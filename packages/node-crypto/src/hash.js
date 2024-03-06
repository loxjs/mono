
const crypto = require('crypto')

const digtypes = ['hex', 'binary', 'base64']

const hash = function (str, type, digtype) {
    return crypto
        .createHash(type)
        .update(str)
        .digest(digtypes.includes(digtype) ? digtype : 'hex')
}

const md5 = function (str, digtype) {
    return hash(str, 'md5', digtype)
}

const sha512 = function (str, digtype) {
    return hash(str, 'sha512', digtype)
}

const sha384 = function (str, digtype) {
    return hash(str, 'sha384', digtype)
}

const sha256 = function (str, digtype) {
    return hash(str, 'sha256', digtype)
}

const sha224 = function (str, digtype) {
    return hash(str, 'sha224', digtype)
}

const sha1 = function (str, digtype) {
    return hash(str, 'sha1', digtype)
}


module.exports = {
    hash,
    md5,
    sha512,
    sha384,
    sha256,
    sha224,
    sha1,
}
