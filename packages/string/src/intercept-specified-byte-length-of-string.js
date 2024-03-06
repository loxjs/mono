
const isString = require('lodash/isString')


const getByteLengthOfString = require('./get-byte-length-of-string')


// 根据字节长度截取字符串:
// 未指定字节长度时, 返回原始字符串
// 指定长度大于等于原始字符串字节长度时, 返回原始字符串
// 截取字符串时, 根据传入参数区分 Windows 和 Linux 平台
// 截取字符串时, 新字符串的字节长度可能小于指定长度, 这取决于加上下一个字符的字节长度是否超出指定长度
// 中文/日文/韩文等, 在 Windows 中占 2 字节, 在 Linux 中占 3 字节
const interceptSpecifiedByteLengthOfString = function (str, specifiedByteLength, {
    isLinux = true,
    ellipsis,
} = {}) {
    if (typeof specifiedByteLength === 'undefined') {
        return str
    }
    const strLength = getByteLengthOfString(str)
    if (strLength <= specifiedByteLength) {
        return str
    }
    ellipsis = isString(ellipsis) ? ellipsis : ''
    const ellipsisByteLength = getByteLengthOfString(ellipsis)
    const newStrCharacters = []
    let newStrByteLength = ellipsisByteLength
    for (const character of str) {
        const characterByteLength = getByteLengthOfString(character, isLinux)
        newStrByteLength += characterByteLength
        if (newStrByteLength > specifiedByteLength) {
            break
        }
        if (newStrByteLength === specifiedByteLength) {
            newStrCharacters.push(character)
            break
        }
        newStrCharacters.push(character)
    }
    newStrCharacters.push(ellipsis)
    return newStrCharacters.join('')
}


module.exports = interceptSpecifiedByteLengthOfString
