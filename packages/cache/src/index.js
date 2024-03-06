
const Redis = require('ioredis')


const Foo = class {
    constructor ({
        redis = {},
        prefix,
        exType = 'EX',
        exDuration,
    } = {}) {
        this.redisConfig = redis
        this.redisClient = new Redis(redis)
        this.prefix = prefix || ''
        this.exType = exType
        this.exDuration = exDuration
    }

    generateKey (key) {
        return this.prefix
            ? `${ this.prefix }:${ key }`
            : key
    }

    get (key) {
        key = this.generateKey(key)
        return this.redisClient.get(key).then((res) => {
            return res !== null ? JSON.parse(res).value : res
        })
    }

    set (key, value, {
        exType,
        exDuration,
    } = {}) {
        key = this.generateKey(key)
        value = JSON.stringify({
            value,
        })
        exType = exType || this.exType
        exDuration = exDuration || this.exDuration
        return exType && exDuration
            ? this.redisClient.set(key, value, exType, exDuration)
            : this.redisClient.set(key, value)
    }
}


module.exports = Foo
