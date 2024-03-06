
const crypto = require('crypto')


const uuid = (length = 32) => {
    const str = crypto
        .randomBytes(Math.ceil(length * 0.75))
        .toString('base64')
        .slice(0, length)
    return str.replace(/[+/]/g, '_')
}


module.exports = uuid
