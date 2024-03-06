
/* eslint-disable no-bitwise */

// Unicode 编码区分数字，字母，特殊字符
const charMode = function (iN) {
    if (iN >= 48 && iN <= 57) { // 数字（U+0030 - U+0039）
        return 1 // 二进制是0001
    }

    if (iN >= 65 && iN <= 90) { // 大写字母（U+0041 - U+005A）
        return 2 // 二进制是0010
    }

    if (iN >= 97 && iN <= 122) { // 小写字母（U+0061 - U+007A）
        return 4 // 二进制是0100
    }
    // 其他算特殊字符
    return 8 // 二进制是1000
}

const bitTotal = function (num) {
    let modes = 0
    for (let i = 0; i < 4; i += 1) {
        if (num & 1) { // num不是0的话
            modes += 1 // 复杂度+1
        }
        num >>>= 1 // num右移1位
    }
    return modes
}

const check = function (sPW, minLen) {
    if (sPW.length < minLen) { // 小于7位，直接 "弱""
        return 0
    }

    let modes = 0

    for (let i = 0; i < sPW.length; i += 1) { // 密码的每一位执行 "位运算 OR"
        modes |= charMode(sPW.charCodeAt(i))
    }

    return bitTotal(modes)
}


module.exports = check
