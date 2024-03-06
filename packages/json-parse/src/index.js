
/* Parsing big JSON string to JSON */

const set = require('lodash/set')


const foo = function (str) {
    str = `{"${ str.replace(/&/g, '","').replace(/=/g, '":"') }"}`
    str = JSON.parse(str)

    const serialized = []

    for (const key of Object.keys(str)) {
        serialized.push({
            key: decodeURIComponent(key),
            value: decodeURIComponent(str[key]),
        })
    }

    return serialized.reduce((res, item) => {
        set(res, item.key, item.value)
        return res
    }, {})
}


module.exports = foo
