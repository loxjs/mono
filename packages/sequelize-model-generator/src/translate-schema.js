
const isArray = require('lodash/isArray')
const isFunction = require('lodash/isFunction')
const isPlainObject = require('lodash/isPlainObject')
const isString = require('lodash/isString')
const isUndefined = require('lodash/isUndefined')

const Sequelize = require('sequelize')


/**
 * @function
 * @description 将 STRING 字段描述转换为 Sequelize.STRING
 * @param {Object} options
 * @param {number} [options.length=255]
 * @param {boolean} [options.binary=false]
 * @returns Sequelize.STRING
 * @example
 * ({ length: 10 }) => Sequelize.STRING(10) // VARCHAR(10)
 * @example
 * ({ binary: true }) => Sequelize.STRING.BINARY // VARCHAR BINARY
 * @example
 * () => Sequelize.STRING(255) // VARCHAR(255)
 */
const _string = function ({
    length,
    binary,
} = {}) {
    return Sequelize.STRING(length, binary)
}

/**
 * @function
 * @description 将 TEXT 字段描述转换为 Sequelize.TEXT
 * @param {Object} options
 * @param {string} [options.length]
 * @returns Sequelize.TEXT
 * @example
 * ({ length: 'tiny' }) => Sequelize.TEXT('tiny') // TINYTEXT
 * @example
 * ({ length: 'ci' }) => Sequelize.CITEXT // CITEXT(only PostgreSQL and SQLite)
 * @example
 * () => Sequelize.TEXT // TEXT
 */
const _text = function ({
    length,
} = {}) {
    if (length === 'tiny') {
        return Sequelize.TEXT(length)
    }
    if (length === 'ci') {
        return Sequelize.CITEXT
    }
    return Sequelize.TEXT
}

/**
 * @function
 * @description 将 DATE 字段描述转换为 Sequelize.DATE
 * @summary mysql / sqlite 为 DATETIME, postgres 为带时区的 TIMESTAMP
 * @param {Object} options
 * @param {string|number} [options.length]
 * @returns Sequelize.DATE
 * @example
 * () => Sequelize.DATE
 */
const _dateTime = function ({
    length,
} = {}) {
    return Sequelize.DATE(length)
}

/**
 * @function
 * @description 将 DATEONLY 字段描述转换为 Sequelize.DATEONLY
 * @returns Sequelize.DATEONLY
 * @example
 * () => Sequelize.DATEONLY // 不带时间
 */
const _date = function () {
    return Sequelize.DATEONLY
}

/**
 * @function
 * @description 将 INTEGER 字段描述转换为 Sequelize.INTEGER
 * @returns Sequelize.INTEGER
 * @example
 * () => Sequelize.INTEGER
 */
const _integer = function () {
    return Sequelize.INTEGER
}

/**
 * @function
 * @description 将 TINYINT 字段描述转换为 Sequelize.TINYINT
 * @summary 非 SQL 标准, PostgreSQL 未支持
 * @returns Sequelize.TINYINT
 * @example
 * () => Sequelize.TINYINT
 */
const _tinyInt = function () {
    return Sequelize.TINYINT
}

/**
 * @function
 * @description 将 SMALLINT 字段描述转换为 Sequelize.SMALLINT
 * @returns Sequelize.SMALLINT
 * @example
 * () => Sequelize.SMALLINT
 */
const _smallInt = function () {
    return Sequelize.SMALLINT
}

/**
 * @function
 * @description 将 BIGINT 字段描述转换为 Sequelize.BIGINT
 * @param {Object} options
 * @param {number} [options.length]
 * @returns Sequelize.BIGINT
 * @example
 * ({ length: 10 }) => Sequelize.BIGINT(10) // BIGINT(10)
 * @example
 * () => Sequelize.BIGINT, BIGINT
 */
const _bigInt = function ({
    length,
} = {}) {
    return Sequelize.BIGINT(length)
}

/**
 * @function
 * @description 将 FLOAT 字段描述转换为 Sequelize.FLOAT
 * @param {Object} options
 * @param {number} [options.length]
 * @param {number} [options.decimals]
 * @returns Sequelize.FLOAT
 * @example
 * ({ length: 11, decimals: 10 }) => Sequelize.FLOAT(11, 10) // FLOAT(11,10)
 * @example
 * ({ length: 11 }) => Sequelize.FLOAT(11) // FLOAT(11)
 * @example
 * () => Sequelize.FLOAT // FLOAT
 */
const _float = function ({
    length,
    decimals,
} = {}) {
    return Sequelize.FLOAT(length, decimals)
}

/**
 * @function
 * @description 将 REAL 字段描述转换为 Sequelize.REAL
 * @param {Object} options
 * @param {number} [options.length]
 * @param {number} [options.decimals]
 * @returns Sequelize.REAL
 * @example
 * ({ length: 11, decimals: 12 }) => Sequelize.REAL(11, 12) // REAL(11,12)
 * @example
 * ({ length: 11 }) => Sequelize.REAL(11) // REAL(11)
 * @example
 * () => Sequelize.REAL // REAL
 */
const _real = function ({
    length,
    decimals,
} = {}) {
    return Sequelize.REAL(length, decimals)
}

/**
 * @function
 * @description 将 DOUBLE 字段描述转换为 Sequelize.DOUBLE
 * @param {Object} options
 * @param {number} [options.length]
 * @param {number} [options.decimals]
 * @returns Sequelize.DOUBLE
 * @example
 * ({ length: 11, decimals: 10 }) => Sequelize.DOUBLE(11, 10) // DOUBLE(11,10)
 * @example
 * ({ length: 11 }) => Sequelize.DOUBLE(11) // DOUBLE(11)
 * @example
 * () => Sequelize.DOUBLE // DOUBLE
 */
const _double = function ({
    length,
    decimals,
} = {}) {
    return Sequelize.DOUBLE(length, decimals)
}

/**
 * @function
 * @description 将 DECIMAL 字段描述转换为 Sequelize.DECIMAL
 * @param {Object} options
 * @param {number} [options.length]
 * @param {number} [options.decimals]
 * @returns Sequelize.DECIMAL
 * @example
 * ({ length: 10, decimals: 2 }) => Sequelize.DECIMAL(10, 2) // DECIMAL(10,2)
 * @example
 * ({ length: 10 }) => Sequelize.DECIMAL(10) // DECIMAL(10)
 * @example
 * () => Sequelize.DECIMAL // DECIMAL
 */
const _decimal = function ({
    length,
    decimals,
} = {}) {
    return Sequelize.DECIMAL(length, decimals)
}

/**
 * @function
 * @description 将 NUMERIC 字段描述转换为 Sequelize.DECIMAL
 * @param {Object} options
 * @param {number} [options.length]
 * @param {number} [options.decimals]
 * @returns Sequelize.DECIMAL
 * @example
 * ({ length: 10, decimals: 2 }) => Sequelize.DECIMAL(10, 2) // DECIMAL(10,2)
 * @example
 * ({ length: 10 }) => Sequelize.DECIMAL(10) // DECIMAL(10)
 * @example
 * () => Sequelize.DECIMAL // DECIMAL
 */
const _numeric = function ({
    length,
    decimals,
} = {}) {
    return Sequelize.DECIMAL(length, decimals)
}

/**
 * @function
 * @description 将 JSON 字段描述转换为 Sequelize.JSON
 * @summary 仅 PostgreSQL, SQLite 和 MySQL
 * @returns Sequelize.JSON
 * @example
 * () => Sequelize.JSON // JSON 列
 */
const _json = function () {
    return Sequelize.JSON
}

/**
 * @function
 * @description 将 JSONB 字段描述转换为 Sequelize.JSONB
 * @summary 仅 PostgreSQL
 * @returns Sequelize.JSONB
 * @example
 * () => Sequelize.JSONB // JSONB 列
 */
const _jsonb = function () {
    return Sequelize.JSONB
}

/**
 * @function
 * @description 将 BOOLEAN 字段描述转换为 Sequelize.BOOLEAN
 * @returns Sequelize.BOOLEAN
 * @example
 * () => Sequelize.BOOLEAN // TINYINT(1)
 */
const _boolean = function () {
    return Sequelize.BOOLEAN
}

/**
 * @function
 * @description 将 BLOB 字段描述转换为 Sequelize.BLOB
 * @summary PostgreSQL 为 bytea
 * @param {Object} options
 * @param {string} [options.length]
 * @returns Sequelize.BLOB
 * @example
 * ({ type: 'blob', length: 'tiny' }) => Sequelize.BLOB('tiny')
 * @example
 * ({ type: 'blob', length: 'medium' }) => Sequelize.BLOB('medium')
 * @example
 * ({ type: 'blob', length: 'long' }) => Sequelize.BLOB('long')
 * @example
 * () => Sequelize.BLOB
 */
const _blob = function ({
    length,
} = {}) {
    return Sequelize.BLOB(length)
}

/**
 * @function
 * @description 将 UUID 字段描述转换为 Sequelize.UUID
 * @summary PostgreSQL 和 SQLite 的 UUID 数据类型
 * MySQL 的 CHAR(36) BINARY(使用defaultValue:Sequelize.UUIDV1 或 Sequelize.UUIDV4 来让 sequelize 自动生成 id)
 * @returns Sequelize.UUID
 * @example
 * () => Sequelize.UUID
 */
const _uuid = function () {
    return Sequelize.UUID
}

/**
 * @function
 * @description 将 CIDR 字段描述转换为 Sequelize.CIDR
 * @summary PostgreSQL 的 CIDR 数据类型
 * @returns Sequelize.CIDR
 * @example
 * () => Sequelize.CIDR
 */
const _cidr = function () {
    return Sequelize.CIDR
}

/**
 * @function
 * @description 将 INET 字段描述转换为 Sequelize.INET
 * @summary PostgreSQL 的 INET 数据类型
 * @returns Sequelize.INET
 * @example
 * () => Sequelize.INET
 */
const _inet = function () {
    return Sequelize.INET
}

/**
 * @function
 * @description 将 MACADDR 字段描述转换为 Sequelize.MACADDR
 * @summary PostgreSQL 的 MACADDR 数据类型
 * @returns Sequelize.MACADDR
 * @example
 * () => Sequelize.MACADDR
 */
const _macAddr = function () {
    return Sequelize.MACADDR
}

/**
 * @function
 * @description 将 GEOMETRY 字段描述转换为 Sequelize.GEOMETRY
 * @summary Spatial 列. 仅 PostgreSQL (带有 PostGIS) 或 MySQL
 * @param {Object} options
 * @param {string} [options.shape]
 * @param {any} [options.srid]
 * @returns Sequelize.GEOMETRY
 * @example
 * ({ shape: 'Point', srid: 4326 }) => Sequelize.GEOMETRY('POINT', 4326)
 * @example
 * ({ shape: 'Point' }) => Sequelize.GEOMETRY('POINT')
 * @example
 * () => Sequelize.GEOMETRY
 */
const _geometry = function ({
    shape,
    srid,
} = {}) {
    return Sequelize.GEOMETRY(shape, srid)
}

/**
 * @function
 * @description 将 ENUM 字段描述转换为 Sequelize.ENUM
 * @param {Object} options
 * @param {array} options.value
 * @returns Sequelize.ENUM
 * @example
 * ({ value: ['value 1', 'value 2'] }) => Sequelize.ENUM('value 1', 'value 2')
 */
const _enum = function ({
    value,
} = {}) {
    return isArray(value) && value.length > 0
        ? Sequelize.ENUM(...value)
        : null
}


const types = {
    string: _string,
    text: _text,
    dateTime: _dateTime,
    date: _date,
    integer: _integer,
    smallInt: _smallInt,
    tinyInt: _tinyInt,
    bigInt: _bigInt,
    float: _float,
    real: _real,
    double: _double,
    decimal: _decimal,
    numeric: _numeric,
    json: _json,
    jsonb: _jsonb,
    boolean: _boolean,
    blob: _blob,
    uuid: _uuid,
    cidr: _cidr,
    inet: _inet,
    macAddr: _macAddr,
    geometry: _geometry,
    enum: _enum,
}


const transformType = function (options) {
    const {
        type,
        range,
        array,
    } = options

    let _type = types[type] !== 'undefined'
        ? types[type](options) || null
        : null

    if (_type) {
        if (range === true) {
            _type = Sequelize.RANGE(_type)
        }

        if (array === true) {
            _type = Sequelize.ARRAY(_type)
        }
    }

    return _type
}


/**
 * @function
 * 将 schema 字段类型描述转换为 Sequelize 字段对象
 * @param {Object} schema - 表字段描述
 *
 * 示例
 *
 * string
 * @example
 * { type: 'string', length: 10 } => Sequelize.STRING(10) // VARCHAR(10)
 * @example
 * { type: 'string', binary: true } => Sequelize.STRING.BINARY // VARCHAR BINARY
 * @example
 * { type: 'string' } => Sequelize.STRING(255) // VARCHAR(255)
 *
 * text
 * { type: 'text', length: 'tiny' } => Sequelize.TEXT('tiny') // TINYTEXT
 * @example
 * { type: 'text', length: 'ci' } => Sequelize.CITEXT // CITEXT(only PostgreSQL and SQLite)
 * @example
 * { type: 'text' } => Sequelize.TEXT // TEXT
 *
 * dateTime
 * @example
 * { type: 'dateTime' } => Sequelize.DATE
 *
 * date
 * @example
 * { type: 'date' } => Sequelize.DATEONLY // 不带时间
 *
 * integer
 * @example
 * { type: 'integer' } => Sequelize.INTEGER
 *
 * bigInt
 * @example
 * { type: 'bigInt', length: 10 } => Sequelize.BIGINT(10) // BIGINT(10)
 * @example
 * { type: 'bigInt' } => Sequelize.BIGINT, BIGINT
 *
 * float
 * @example
 * { type: 'float', length: 11, decimals: 10 } => Sequelize.FLOAT(11, 10) // FLOAT(11,10)
 * @example
 * { type: 'float', length: 11 } => Sequelize.FLOAT(11) // FLOAT(11)
 * @example
 * { type: 'float' } => Sequelize.FLOAT // FLOAT
 *
 * real
 * @example
 * { type: 'real', length: 11, decimals: 12 } => Sequelize.REAL(11, 12) // REAL(11,12)
 * @example
 * { type: 'real', length: 11 } => Sequelize.REAL(11) // REAL(11)
 * @example
 * { type: 'real' } => Sequelize.REAL // REAL
 *
 * double
 * @example
 * { type: 'double', length: 11, decimals: 10 } => Sequelize.DOUBLE(11, 10) // DOUBLE(11,10)
 * @example
 * { type: 'double', length: 11 } => Sequelize.DOUBLE(11) // DOUBLE(11)
 * @example
 * { type: 'double' } => Sequelize.DOUBLE // DOUBLE
 *
 * decimal
 * @example
 * { type: 'decimal', length: 10, decimals: 2 } => Sequelize.DECIMAL(10, 2) // DECIMAL(10,2)
 * @example
 * { type: 'decimal', length: 10 } => Sequelize.DECIMAL(10) // DECIMAL(10)
 * @example
 * { type: 'decimal' } => Sequelize.DECIMAL // DECIMAL
 *
 * numeric
 * @example
 * { type: 'numeric', length: 10, decimals: 2 } => Sequelize.DECIMAL(10, 2) // DECIMAL(10,2)
 * @example
 * { type: 'numeric', length: 10 } => Sequelize.DECIMAL(10) // DECIMAL(10)
 * @example
 * { type: 'numeric' } => Sequelize.DECIMAL // DECIMAL
 *
 * json
 * @example
 * { type: 'json' } => Sequelize.JSON // JSON 列
 *
 * jsonb
 * @example
 * { type: 'jsonb' } => Sequelize.JSONB // JSONB 列
 *
 * boolean
 * @example
 * { type: 'boolean' } => Sequelize.BOOLEAN // TINYINT(1)
 *
 * blob
 * @example
 * { type: 'blob', length: 'tiny' } => Sequelize.BLOB('tiny')
 * @example
 * { type: 'blob', length: 'medium' } => Sequelize.BLOB('medium')
 * @example
 * { type: 'blob', length: 'long' } => Sequelize.BLOB('long')
 * @example
 * { type: 'blob' } => Sequelize.BLOB
 *
 * uuid
 * @example
 * { type: 'uuid' } => Sequelize.UUID
 *
 * cidr
 * @example
 * { type: 'cidr' } => Sequelize.CIDR
 *
 * inet
 * @example
 * { type: 'inet' } => Sequelize.INET
 *
 * macAddr
 * @example
 * { type: 'macAddr' } => Sequelize.MACADDR
 *
 * geometry
 * @example
 * { type: 'geometry', shape: 'Point', srid: 4326 } => Sequelize.GEOMETRY('POINT', 4326)
 * @example
 * { type: 'geometry', shape: 'Point' } => Sequelize.GEOMETRY('POINT')
 * @example
 * { type: 'geometry' } => Sequelize.GEOMETRY
 *
 */

const translateField = function (options) {
    const attrs = {}

    const seqType = transformType(options)

    if (seqType === null) {
        return null
    }

    attrs.type = seqType

    if (!isUndefined(options.default)) {
        attrs.defaultValue = options.default === Date.now
            ? Sequelize.NOW
            : options.default
    }

    if (options.nullable === false) {
        attrs.allowNull = false
    }

    if (options.unique === true) {
        attrs.unique = true
    }

    if (options.primary === true) {
        attrs.primaryKey = true
    }

    if (options.increment === true) {
        attrs.autoIncrement = true
    }

    if (isPlainObject(options.validate)) {
        attrs.validate = options.validate
    }

    if (isFunction(options.get)) {
        attrs.get = options.get
    }

    if (isFunction(options.set)) {
        attrs.set = options.set
    }

    if (isString(options.comment) && options.comment.length > 0) {
        attrs.comment = options.comment
    }

    if (isString(options.columnName) && options.columnName.length > 0) {
        attrs.field = options.columnName
    }

    if (isPlainObject(options.references) && Object.keys(options.references).length > 0) {
        attrs.references = options.references
    }

    return attrs
}

const foo = function (schema) {
    const fields = Object.keys(schema)
    const newSchema = {}

    for (const field of fields) {
        const attrs = translateField(schema[field])
        if (attrs !== null) {
            newSchema[field] = attrs
        }
    }

    return newSchema
}


module.exports = foo
