
const isString = require('lodash/isString')


const countTheNumberOfCharactersInString = function (str) {
    if (!isString(str) || str.length === 0) {
        return 0
    }

    //先将回车换行符做特殊处理
    /* eslint-disable no-irregular-whitespace */
    str = str.replace(/(\r\n+|\s+|　+)/g, '■')
    /* eslint-enable no-irregular-whitespace */
    //处理英文字符数字，连续字母、数字、英文符号视为一个单词
    /* eslint-disable no-control-regex */
    str = str.replace(/[\x00-\xff]/g, '◆')
    /* eslint-enable no-control-regex */
    //去掉标点符号
    /* eslint-disable max-len */
    str = str.replace(/[\uff01-\uff0f]|[\uff1a-\uff20]|[\uff3b-\uff40]|[\uff5b-\uff5e]|[\u3000-\u303f]|[\u2070-\u209f]|[\u2e00-\u2e7f]|[\u2000-\u206f]|[\u00a0-\u00bf]|[\u0020-\u002f]|[\u003a-\u0040]|[\u005b-\u0060]|[\u007b-\u007e]/ig, '')
    /* eslint-enable max-len */
    //合并字符◆，连续字母、数字、英文符号视为一个单词
    str = str.replace(/◆+/g, '*')
    //去掉回车换行符
    str = str.replace(/■+/g, '')

    return str.length
}


module.exports = countTheNumberOfCharactersInString
