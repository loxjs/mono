
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
            get () { return this[0] },
        },
        last: {
            get () { return this[this.length - 1] },
        },
        maxIndex: {
            get () { return this.length - 1 },
        },

        $first (filter) {
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
        $last (filter) {
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
        $before (filter) {
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
        $after (filter) {
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
        $gt (date) {
            return +this > +date
        },
        $gte (date) {
            return +this >= +date
        },
        $lt (date) {
            return +this < +date
        },
        $lte (date) {
            return +this <= +date
        },
        $eq (date) {
            return +this === +date
        },
    },
})

nativeExtends.push({
    native: Number,
    extends: {
        $gt (num) {
            return this > num
        },
        $gte (num) {
            return this >= num
        },
        $lt (num) {
            return this < num
        },
        $lte (num) {
            return this <= num
        },
        $eq (num) {
            return this === num
        },
    },
})

nativeExtends.push({
    native: String,
    extends: {
        $contains (str) {
            return this.includes(str)
        },
        $rightSubstr (len) {
            const totalLen = this.length
            const startIndex = totalLen - len
            return this.substring(startIndex, totalLen)
        },
    },
})

nativeExtends.push({
    native: Object,
    extends: {
        $has (key) {
            return this.hasOwnProperty(key)
        },
    },
})


const mount = function () {
    for (const { native, extends: _extends } of nativeExtends) {
        for (const extendName of Object.keys(_extends)) {
            if (!native.prototype.hasOwnProperty(extendName)) {
                if (_extends[extendName].get) {
                    Object.defineProperties(native.prototype, {
                        [extendName]: _extends[extendName],
                    })
                } else {
                    native.prototype[extendName] = _extends[extendName]
                }
            }
        }
    }
}


module.exports = mount
