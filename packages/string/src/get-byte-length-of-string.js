
// 中文/日文/韩文等, 在 Windows 中占 2 字节, 在 Linux 中占 3 字节
const getByteLengthOfString = function (str = '', isLinux = true) {
    const overLength = isLinux ? 2 : 1
    let { length } = str
    /* eslint-disable no-prototype-builtins */
    for (const i in str) {
        if (str.hasOwnProperty(i)) {
            const isDoubleByte = str[i].charCodeAt(0).toString(16).length === 4
            if (isDoubleByte) {
                length += overLength
            }
        }
    }
    return length
}


module.exports = getByteLengthOfString
