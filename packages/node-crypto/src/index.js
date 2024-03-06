
const hash = require('./hash')
const hmac = require('./hmac')


const bar = {
    ...hash,
    ...hmac,
}


module.exports = bar
