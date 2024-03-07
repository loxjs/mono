
/* eslint-disable no-prototype-builtins, no-extend-native, no-bitwise */

const isFunction = require('lodash/isFunction')


BigInt.prototype.toJSON = function () {
    return this.toString()
}


const nativeExtends = []

nativeExtends.push({
    native: Array,
    extends: {
        first: {
            get (filter) {
                if (isFunction(filter)) {
                    for (const item of this) {
                        const res = filter(item)
                        if (res === true) {
                            return item
                        }
                    }
                    return undefined
                }

                return this[0]
            },
        },
        last: {
            get (filter) {
                const indexOfLastElement = this.length - 1
                if (isFunction(filter)) {
                    for (let i = indexOfLastElement; i >= 0; i -= 1) {
                        const item = this[i]
                        const res = filter(item)
                        if (res === true) {
                            return item
                        }
                    }
                    return undefined
                }

                return this[indexOfLastElement]
            },
        },
        before: {
            get (filter) {
                const total = this.length
                if (isFunction(filter)) {
                    for (let i = 0; i < total; i += 1) {
                        const item = this[i]
                        const res = filter(item)
                        if (res === true) {
                            return this[i - 1]
                        }
                    }
                }

                return undefined
            },
        },
        after: {
            get (filter) {
                const total = this.length
                if (isFunction(filter)) {
                    for (let i = 0; i < total; i += 1) {
                        const item = this[i]
                        const res = filter(item)
                        if (res === true) {
                            return this[i + 1]
                        }
                    }
                }

                return undefined
            },
        },
        maxIndex: {
            get () { return this.length - 1 },
        },
    },
})

nativeExtends.push({
    native: Date,
    extends: {
        timestamp: {
            get () { return +this },
        },
        unixTimestamp: {
            get () { return +this / 1000 | 0 },
        },
        $gt: {
            get (date) {
                return +this > +date
            },
        },
        $gte: {
            get (date) {
                return +this >= +date
            },
        },
        $lt: {
            get (date) {
                return +this < +date
            },
        },
        $lte: {
            get (date) {
                return +this <= +date
            },
        },
        $eq: {
            get (date) {
                return +this === +date
            },
        },
    },
})

nativeExtends.push({
    native: Number,
    extends: {
        $gt: {
            get (num) {
                return this > num
            },
        },
        $gte: {
            get (num) {
                return this >= num
            },
        },
        $lt: {
            get (num) {
                return this < num
            },
        },
        $lte: {
            get (num) {
                return this <= num
            },
        },
        $eq: {
            get (num) {
                return this === num
            },
        },
    },
})

nativeExtends.push({
    native: String,
    extends: {
        $contains: {
            get (str) {
                return this.includes(str)
            },
        },
        rightSubstr: {
            get (len) {
                const totalLen = this.length
                const startIndex = totalLen - len
                return this.substring(startIndex, totalLen)
            },
        },
    },
})

nativeExtends.push({
    native: Object,
    extends: {
        $has: {
            get (key) {
                return this.hasOwnProperty(key)
            },
        },
    },
})


const mount = function () {
    for (const { native, extends: _extends } of Object.keys(nativeExtends)) {
        for (const extendName of Object.keys(_extends)) {
            if (!native.prototype.hasOwnProperty(extendName)) {
                Object.defineProperties(native.prototype, {
                    [extendName]: _extends[extendName],
                })
            }
        }
    }
}


module.exports = mount
