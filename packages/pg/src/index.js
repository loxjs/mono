
const isArray = require('lodash/isArray')
const isPlainObject = require('lodash/isPlainObject')
const isUndefined = require('lodash/isUndefined')
const { Pool } = require('pg')


const foo = function (config = {}) {
    const pool = new Pool(config)

    const statementNameCache = {}
    const formatOptions = function (options) {
        if (typeof options === 'undefined') {
            return options
        }

        const { name } = options
        if (typeof name === 'string' && name.length > 0) {
            if (typeof statementNameCache[name] === 'undefined') {
                statementNameCache[name] = 0
            }
            statementNameCache[name] += 1
            options.name = `${ name }-${ Date.now() }-${ statementNameCache[name] }`
        }
        return options
    }

    const client = async function (options) {
        options = formatOptions(options)
        const c = await pool.connect()
        try {
            const r = await c.query(options)
            c.release()
            return {
                data: r.rows,
                result: r,
            }
        } catch (err) {
            c.release()
            return Promise.reject(err)
        }
    }

    const transaction = async function (cb) {
        const c = await pool.connect()
        try {
            await c.query('BEGIN')
            const r = await cb(c, formatOptions)
            await c.query('COMMIT')
            c.release()
            return r
        } catch (err) {
            await c.query('ROLLBACK')
            c.release()
            return Promise.reject(err)
        }
    }

    // 禁止在 bar.query 上进行事务操作, 参见:
    // https://node-postgres.com/api/pool#pool-query-gt-promise-pg-result-
    const query = function (options) {
        options = formatOptions(options)
        return pool.query(options).then((res) => {
            return {
                data: res.rows,
                result: res,
            }
        })
    }

    const insertOne = function (tableName, data, {
        returning,
    } = {}) {
        if (!isPlainObject(data) || Object.keys(data).length === 0) {
            throw new Error(`Invalid \`data\` to insert into table \`${ tableName }\``)
        }
        const sqlValues = []
        const values = []
        const columns = Object.keys(data)
            .map((key, index) => {
                sqlValues.push(`$${ index + 1 }`)
                values.push(data[key])
                return `"${ key }"`
            })
            .join(', ')
        returning = isUndefined(returning) ? '' : `RETURNING ${ isArray(returning) ? returning.join(', ') : returning }`
        const options = {
            name: tableName,
            text: `INSERT INTO "${ tableName }"(${ columns }) VALUES(${ sqlValues.join(', ') }) ${ returning }`,
            values,
        }
        return client(options)
    }

    const insert = function (tableName, data, {
        returning,
    } = {}) {
        if (!isArray(data)) {
            throw new Error(`Invalid \`data\` to insert into table \`${ tableName }\``)
        }

        returning = isUndefined(returning) ? '' : `RETURNING ${ isArray(returning) ? returning.join(', ') : returning }`
        const sql = `INSERT INTO "${ tableName }"({columns_text}) VALUES{values_text} ${ returning }`
        let columns = null
        const sqlValues = []
        const values = []
        let idx = 0
        for (const item of data) {
            if (!isPlainObject(item) || Object.keys(item).length === 0) {
                throw new Error(`Invalid \`data\` to insert into table \`${ tableName }\``)
            }
            if (columns === null) {
                columns = Object.keys(item)
            }
            const _sqlValues = []
            for (const column of columns) {
                _sqlValues.push(`$${ idx += 1 }`)
                values.push(item[column])
            }
            sqlValues.push(`(${ _sqlValues.join(', ') })`)
        }
        columns = columns
            .map((key) => {
                return `"${ key }"`
            })
            .join(', ')

        const options = {
            name: tableName,
            text: sql.replace('{columns_text}', columns).replace('{values_text}', sqlValues.join(', ')),
            values,
        }

        return client(options)
    }


    const count = async function (options) {
        const { data } = await query(options)
        return parseInt(data[0].count, 10)
    }

    const exist = async function (options) {
        const { data } = await query(options)
        return parseInt(data[0].count, 10) > 0
    }

    const findOne = async function (options) {
        const { data } = await query(options)
        return data.length > 0 ? data[0] : undefined
    }

    const totalCount = function () {
        return pool.totalCount()
    }

    const idleCount = function () {
        return pool.idleCount()
    }

    const waitingCount = function () {
        return pool.waitingCount()
    }

    const on = function (options) {
        return pool.on(...options)
    }


    const sqlFormatter = function (sql) {
        sql = sql.split('\n')
            .map((v) => {
                return v.trim()
            })
            .filter((v) => {
                return v.length > 0
            })
            .join('\n')
        if (!sql.endsWith(';')) {
            sql += ';'
        }

        return sql
    }


    const TABLES = function () {
        return query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_catalog='${ config.database }'
            AND table_schema = 'public'
            AND table_type = 'BASE TABLE';
            `)
            .then((res) => {
                return res.data.filter((v) => {
                    return !v.table_name.endsWith('_bk')
                })
            })
    }

    const TABLE = {}

    TABLE.addColumns = function (sql) {
        if (!sql.endsWith(';')) {
            sql = `${ sql };`
        }

        return client(`
        DO $$
            BEGIN
                BEGIN
                    ${ sql }
                EXCEPTION
                    WHEN duplicate_column THEN RAISE NOTICE
                        'column has existed in table.';
                END;
            END;
        $$;
        `)
    }

    TABLE.dropColumn = function (tableName, columnName) {
        return client(`
        ALTER TABLE ${ tableName } DROP COLUMN IF EXISTS "${ columnName }";
        `)
    }

    TABLE.getColumns = function (tableName) {
        return client(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_catalog='${ config.database }'
            AND table_schema = 'public'
            AND table_name='${ tableName }';
            `)
            .then((res) => {
                return res.data
            })
    }

    const VIEW = {}

    VIEW.create = function (viewName, viewSQL) {
        viewSQL = sqlFormatter(`
            -- Create view named \`${ viewName }\`
            CREATE OR REPLACE VIEW ${ viewName } AS
            ${ viewSQL }
        `)


        return client(viewSQL)
    }

    VIEW.drop = function (viewName) {
        return client(`
        DROP VIEW IF EXISTS ${ viewName };
        `)
    }

    const TRIGGER = {}

    TRIGGER.drop = function (triggerName, tableName) {
        return client(`
        DROP TRIGGER IF EXISTS
            ${ triggerName } ON ${ tableName };
        `)
    }

    const FUNCTION = {}

    FUNCTION.drop = function (functionName) {
        return client(`
        DROP FUNCTION IF EXISTS
            ${ functionName } ();
        `)
    }

    const INDEX = {}

    INDEX.drop = function (indexName) {
        return client(`
        DROP INDEX IF EXISTS ${ indexName };
        `)
    }

    client.query = query
    client.transaction = transaction
    client.insertOne = insertOne
    client.insert = insert
    client.count = count
    client.exist = exist
    client.findOne = findOne
    client.totalCount = totalCount
    client.idleCount = idleCount
    client.waitingCount = waitingCount
    client.on = on

    client.tables = TABLES
    client.table = TABLE
    client.view = VIEW
    client.trigger = TRIGGER
    client.function = FUNCTION
    client.index = INDEX

    return client
}


module.exports = foo
