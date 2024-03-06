
const isSmsCode = function (v) {
    return /^\d{6}$/.test(v)
}


module.exports = isSmsCode
