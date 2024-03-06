
const unix = function () {
    /* eslint-disable no-bitwise */
    return Date.now() / 1000 | 0
    /* eslint-enable no-bitwise */
}

const foo = function () {
    return Date.now()
}

foo.unix = unix


module.exports = foo
