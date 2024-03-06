
const random = require('lodash/random')


const dict = {
    num: '0123456789',
    str: 'abcdefghijklmnopqrstuvwxyz',
    upstr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    punct: '~!@#$%^&*()_+[]{}|`;:,./?><-=',
}

dict.all = dict.num + dict.str + dict.upstr

const lens = {
    num: dict.num.length - 1,
    str: dict.str.length - 1,
    upstr: dict.upstr.length - 1,
    punct: dict.punct.length - 1,
    all: dict.all.length - 1,
}

const shuffle = function (array) {
    return array.sort(() => {
        return Math.random() - 0.5
    })
}

const simple = function (len = 8) {
    len = len < 4 ? 4 : len

    const strs = []

    strs.push(dict.num.charAt(random(lens.num)))
    strs.push(dict.str.charAt(random(lens.str)))
    strs.push(dict.upstr.charAt(random(lens.upstr)))
    strs.push(dict.punct.charAt(random(lens.punct)))

    for (let i = 0; i < len - 4; i += 1) {
        strs.push(dict.all.charAt(random(lens.all)))
    }

    shuffle(strs)

    return strs.join('')
}


module.exports = {
    simple,
}
