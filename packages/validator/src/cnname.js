
const isCNName = function (v) {
    return /^[\u4e00-\u9fa5]{2,5}$/.test(v)
}


module.exports = isCNName
