
const obfuscateEmail = function (email) {
    // 检查是否是有效的电子邮件格式
    if (!email || !email.includes('@')) {
        return email // 如果不是电子邮件，直接返回原字符串
    }

    const [localPart, domainPart] = email.split('@')

    // 如果本地部分（@之前的部分）长度小于等于2，不做缩略处理
    if (localPart.length <= 2) {
        return `***@${ domainPart }`
    }

    // 取本地部分的第一个和最后一个字符
    const firstChar = localPart[0]
    const lastChar = localPart[localPart.length - 1]

    // 用星号替换本地部分中间的字符
    const obfuscatedLocalPart = `${ firstChar }***${ lastChar }`

    // 返回缩略后的电子邮件地址
    return `${ obfuscatedLocalPart }@${ domainPart }`
}


module.exports = obfuscateEmail
