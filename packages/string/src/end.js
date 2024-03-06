
// 获取字符串结尾的指定长度(默认 1)的字符

const end = function (str, len = 1) {
    return str.substr(-len)
}


module.exports = end
