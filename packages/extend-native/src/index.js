
/* eslint-disable no-prototype-builtins, no-extend-native, no-bitwise */

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
