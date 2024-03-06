/*!
 * url safe base64
 */

/**
 * .encode
 *
 * return an encoded Buffer as URL Safe Base64
 *
 * Note: This function encodes to the RFC 4648 Spec where '+' is encoded
 *       as '-' and '/' is encoded as '_'. The padding character '=' is
 *       removed.
 *
 * @param {String} buffer
 * @param {Boolean} witheq 是否保留等号; 为兼容之前版本, 默认不保留
 * @return {String}
 * @api public
 */
const encode = function (str, witheq = false) {
    const buf = Buffer.from(str)
        .toString('base64')
        .replace(/\+/g, '-') // Convert '+' to '-'
        .replace(/\//g, '_') // Convert '/' to '_'
        // .replace(/=+$/, '')  // Remove ending '='

    return !witheq ? buf.replace(/=+$/, '') : buf
}

/**
 * .decode
 *
 * return an decoded URL Safe Base64 as Buffer
 *
 * @param {String}
 * @return {Buffer}
 * @api public
 */
const decode = function (str) {
    // Add removed at end '='
    str += Array(5 - (str.length % 4)).join('=')
    /* eslint-disable no-useless-escape */
    str = str
        .replace(/-/g, '+') // Convert '-' to '+'
        .replace(/_/g, '/') // Convert '_' to '/'
    /* eslint-enable no-useless-escape */

    return Buffer.from(str, 'base64').toString()
}

/**
 * .validate
 *
 * Validates a string if it is URL Safe Base64 encoded.
 *
 * @param {String}
 * @return {Boolean}
 * @api public
 */
const validate = function (str) {
    return /^[A-Za-z0-9\-_]+$/.test(str)
}


module.exports = {
    encode,
    decode,
    validate,
}
