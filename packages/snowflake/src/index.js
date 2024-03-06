
/* eslint-disable import/no-extraneous-dependencies, no-bitwise, class-methods-use-this */

const isBigInt = require('is-bigint')
const isString = require('lodash/isString')


/**
 * Twitter Snowflake 分布式 ID 思想概要
 *
 * Snowflake ID 的结构如下(每部分用 `-` 分开):
 *       0      - 0000000000 0000000000 0000000000 0000000000 0   -       0000000000        -   000000000000
 *   Sign 区位               Delta Milliseconds 区位                  DataCenter/Worker 区位      Sequence 区位
 * - sign 区位, 固定 1 bit 符号标识, 即生成的 id 为正数
 * - Delta Milliseconds 区位, 长度 41 bits, 存储`当前时间戳 - 开始时间戳`的差值.
 *   41 bits 可以表示 241 − 1 个数字, 如果只用来表示正整数(计算机中正数包含 0), 可以表示的数值范围是: 0 至 241 − 1,
 *   减 1 是因为可表示的数值范围是从 0 开始算的, 而不是1.
 *   也就是说 41 bits 可以表示 241 − 1 个毫秒的值，转化成单位年则是 (241 − 1) / (1000 ∗ 60 ∗ 60 ∗ 24 ∗ 365) = 69 年
 *   开始时间戳一般是 id 生成器初始化的时间, 或者通过参数传入(如下实现中的 class 参数 epoch).
 * - DataCenter/Worker 区位, 长度 10 bits, 可整体使用, 最多支持 1024 个实例,
 *   或细分为包括 5 bits 的 DataCenter 区位 和 5 bits 的 worker 区位, 如下实现采用细分的方式
 * - Sequence 区位, 长度 12 bits, 标识每毫秒内的计数序列, 最多可标识 4096 个序号
 * 如上 4 部分共 64 位, 为一个 Long 型
 *
 * Snowflake ID 的优点:
 * - 所有生成的ID都是按时间趋势递增
 * - 整个分布式系统内不会产生重复 ID
 * - 每个 ID 中都可以解读出，该 ID 是在哪个数据中心的哪台工作机器上产生
 * - 数值型的分布式 ID(替换了 UUID)
 * - 高性能的ID生成器(超高 100w/s 的超高性能)
 */
const Snowflake = class {
    constructor ({
        epoch = 1546272000000, // 2019/1/1
        dataCenterId = 0,
        workerId = 0,
        sequence = 0,
    } = {}) {
        this.epoch = BigInt(epoch)
        this.dataCenterId = BigInt(dataCenterId)
        this.workerId = BigInt(workerId)
        this.sequence = BigInt(sequence)

        this.dataCenterIdBitLen = BigInt(5)
        this.workerIdBitLen = BigInt(5)
        this.timestampBitLen = BigInt(41)
        this.sequenceBitLen = BigInt(12)

        this.bigInt0 = BigInt(0)
        this.bigInt1 = BigInt(1)
        this.bigIntNe1 = BigInt(-1)

        this.workerIdMaxVal = this.bigIntNe1 ^ (this.bigIntNe1 << this.workerIdBitLen) // 值为：31
        this.dataCenterIdMaxVal = this.bigIntNe1 ^ (this.bigIntNe1 << this.dataCenterIdBitLen) // 值为：31

        // 标准 SnowFlake ID 结构
        this.workerIdOffset = this.sequenceBitLen // 值为：12
        this.dataCenterIdOffset = this.sequenceBitLen + this.workerIdBitLen // 值为：17
        this.timestampOffset = this.sequenceBitLen + this.workerIdBitLen + this.dataCenterIdBitLen // 值为：22

        this.sequenceMask = this.bigIntNe1 ^ (this.bigIntNe1 << this.sequenceBitLen) // 值为：4095
        this.lastTimestamp = this.bigIntNe1

        if (this.dataCenterId > this.dataCenterIdMaxVal || this.dataCenterId < this.bigInt0) {
            throw new Error(`dataCenterId must max than 0 and small than ${ this.dataCenterIdMaxVal }`)
        }
        if (this.workerId > this.workerIdMaxVal || this.workerId < this.bigInt0) {
            throw new Error(`workerId must max than 0 and small than ${ this.workerIdMaxVal }`)
        }
    }

    tilNextMilliseconds (lastTimestamp) {
        let timestamp = this.timeGen()
        while (timestamp <= lastTimestamp) {
            timestamp = this.timeGen()
        }
        return timestamp
    }

    timeGen () {
        return BigInt(Date.now())
    }

    nextId () {
        let timestamp = this.timeGen()
        if (timestamp < this.lastTimestamp) {
            throw new Error(`Clock moved backwards. Refusing to generate id for ${ (this.lastTimestamp - timestamp) }`)
        }
        if (this.lastTimestamp === timestamp) {
            this.sequence = (this.sequence + this.bigInt1) & this.sequenceMask
            if (this.sequence === this.bigInt0) {
                timestamp = this.tilNextMilliseconds(this.lastTimestamp)
            }
        } else {
            this.sequence = this.bigInt0
        }
        this.lastTimestamp = timestamp

        // 标准 SnowFlake ID 结构
        return ((timestamp - this.epoch) << this.timestampOffset)
            | (this.dataCenterId << this.dataCenterIdOffset)
            | (this.workerId << this.workerIdOffset)
            | this.sequence
    }

    isId (id) {
        if (isBigInt(id) && id.toString().length === 18) {
            return true
        }
        if (isString(id) && /^[1-9]\d{17}$/.test(id)) {
            return true
        }
        return false
    }
}


module.exports = Snowflake
