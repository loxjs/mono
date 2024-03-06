
/* eslint-disable prefer-regex-literals */

const uppercase = new RegExp('([A-Z])', 'g')
const separator = '_'
// const multiSeparatorReg = new RegExp(`${ separator }{2,}`)
const replacement = `${ separator }$1`

const underscore = function (str, all_upper_case) {
    if (all_upper_case && str === str.toUpperCase()) {
        return str
    }

    const str_path = str.split('::')
    const j = str_path.length
    let i = 0

    for (; i < j; i += 1) {
        str_path[i] = str_path[i].replace(uppercase, replacement)
        // str_path[i] = str_path[i].replace(multiSeparatorReg, separator)
    }

    return str_path.join('/').toLowerCase()
}


module.exports = underscore
