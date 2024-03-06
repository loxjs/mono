
const isUUIDv1 = function (v) {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(v)
}

const isUUIDv2 = function (v) {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-[2][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(v)
}

const isUUIDv3 = function (v) {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-[3][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(v)
}

const isUUIDv4 = function (v) {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(v)
}

const isUUIDv5 = function (v) {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-[5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(v)
}


module.exports = {
    isUUIDv1,
    isUUIDv2,
    isUUIDv3,
    isUUIDv4,
    isUUIDv5,
}
