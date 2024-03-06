
const crypto = require('crypto')

const digtypes = ['hex', 'binary', 'base64']

const hmac = function (str, type, salt, digtype) {
    return crypto
        .createHmac(type, salt)
        .update(str)
        .digest(digtypes.includes(digtype) ? digtype : 'hex')
}

const hmacSha1 = function (str, salt, digtype) {
    return hmac(str, 'sha1', salt, digtype)
}

const hmacSha384 = function (str, salt, digtype) {
    return hmac(str, 'hmacSha384', salt, digtype)
}

const hmacSha256 = function (str, salt, digtype) {
    return hmac(str, 'sha256', salt, digtype)
}

const hmacSha512 = function (str, salt, digtype) {
    return hmac(str, 'sha512', salt, digtype)
}

const hmacMd5 = function (str, salt, digtype) {
    return hmac(str, 'md5', salt, digtype)
}


module.exports = {
    hmacSha1,
    hmacSha384,
    hmacSha256,
    hmacSha512,
    hmacMd5,
}
