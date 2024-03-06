
/* eslint-disable class-methods-use-this */

const debug = require('debug')('Contract-Base')
const _ethers = require('ethers')
const isBigInt = require('is-bigint')
const { Web3 } = require('web3')
const math = require('mathjs')
const {
    isFunction,
    isString,
    isUndefined,
} = require('lodash')
const {
    error,
    utils,
} = require('@loxjs/lox')

const {
    getNetworkByChainId,
} = require('@loxjs/web3networks')

const proxy = require('./proxy')
const baseErrorKeywordsToErrorMessages = require('./errorKeywordsToErrorMessages')


const _DEFAULT_GAS_LIMIT = 1000000 // 3000000 // 8000000
const _DEFAULT_GAS_PRICE = '0.00000004'
const _DEFAULT_MULTIPLIER_FOR_GAS_PRICE = 1.3

const isExists = (value) => {
    return value !== null && value !== undefined
}


const Base = class {
    constructor ({
        ethers,
        chainId,
        provider,
        signer,
        signerPrivateKey,
        errorKeywordsToErrorMessages = {},
        defaultGasLimit,
        defaultGasPrice,
        defaultMultiplierForGasPrice,
    } = {}) {
        this.ethers = ethers || _ethers
        this.chainId = chainId
        this.network = getNetworkByChainId(chainId)
        this.web3 = new Web3(this.network.rpcUrl)

        const _networkOptions = this.network.options || {}
        this.DEFAULT_GAS_LIMIT = defaultGasLimit || _networkOptions.defaultGasLimit || _DEFAULT_GAS_LIMIT
        this.DEFAULT_GAS_PRICE = defaultGasPrice || _networkOptions.defaultGasPrice || _DEFAULT_GAS_PRICE

        // 用于发起 transaction 时如果函数未接收到 gasPrice 参数,
        // 则通过 DEFAULT_MULTIPLIER_FOR_GAS_PRICE 设置默认的 gas price,
        // 设置规则是获取 network 当前的 gas price, 乘以 DEFAULT_MULTIPLIER_FOR_GAS_PRICE
        this.DEFAULT_MULTIPLIER_FOR_GAS_PRICE = defaultMultiplierForGasPrice || _networkOptions.defaultMultiplierForGasPrice || _DEFAULT_MULTIPLIER_FOR_GAS_PRICE

        provider = provider || proxy.getJsonRpcProvider({
            rpcUrl: this.network.rpcUrl,
        })
        signer = signer || (
            signerPrivateKey
                ? new this.ethers.Wallet(signerPrivateKey, provider)
                : null
        )
        this.provider = provider
        this.signer = signer
        this.signerAddress = signer ? signer.address : null
        this.zeroAddress = '0x0000000000000000000000000000000000000000'

        /**
         * 根据 key 的长度倒序排序 errorKeywordsToErrorMessages,
         * 防止 key 中有重复的 keywords 导致可能出现的短 key 被优先用于检查错误信息而返回了不正确的错误.
         */
        errorKeywordsToErrorMessages = {
            ...baseErrorKeywordsToErrorMessages,
            ...errorKeywordsToErrorMessages,
        }
        this.ErrorKeywordsToErrorMessages = Object
            .keys(errorKeywordsToErrorMessages)
            .sort((a, b) => { return b.length - a.length })
            .map((keyword) => {
                return {
                    keyword,
                    message: errorKeywordsToErrorMessages[keyword],
                }
            })

        debug('Instantiating', {
            chainId,

            ethers,
            provider: this.provider,
            signer: this.signer,
            signerAddress: this.signerAddress,
            zeroAddress: this.zeroAddress,
            network: this.network,
            DEFAULT_GAS_LIMIT: this.DEFAULT_GAS_LIMIT,
            DEFAULT_MULTIPLIER_FOR_GAS_PRICE: this.DEFAULT_MULTIPLIER_FOR_GAS_PRICE,
            errorKeywordsToErrorMessages,
        })
    }

    _formatErr (err) {
        debug('_formatErr', {
            err,
            chainId: this.chainId,
            network: this.network,
            contractAddress: this.contractAddress,
            signerAddress: this.signerAddress,
        })
        if (err.maker === 'CONTRACT_BASE_CONSTRUCTOR') {
            return err
        }
        err.maker = 'CONTRACT_BASE_CONSTRUCTOR'

        if (err.code === 'SERVER_ERROR') {
            if (err.message.indexOf('')) {
                const _err = new Error('Server response 404 Not Found')
                _err.code = 'InvalidRpcUrl'
                _err.origin = err
                _err.maker = err.maker
                return _err
            }
            const _message = err?.serverError?.message || err?.message || ''
            const _err = new Error(_message.replace('Error:', '').trim())
            _err.code = err.code
            _err.origin = err
            _err.maker = err.maker
            return _err
        }
        if (err.code === 'INVALID_ARGUMENT') {
            const _err = new Error(err.reason)
            _err.code = err.code
            _err.origin = err
            _err.maker = err.maker
            return _err
        }
        if (err?.error?.body) {
            const errInfo = JSON.parse(err?.error?.body)
            const _err = new Error(errInfo.error.message)
            _err.code = errInfo.error.code
            _err.maker = err.maker
            return _err
        }
        if (err?.error) {
            const _err = new Error(err.error.message)
            _err.code = err.error.code
            _err.origin = err
            _err.maker = err.maker
            return _err
        }
        if (err.reason) {
            const _err = new Error(err.reason)
            _err.code = err.code
            _err.origin = err
            _err.maker = err.maker
            return _err
        }

        return this.decodeError(err)
    }

    decodeError (err) {
        const msg = err.message.toLowerCase()

        for (const item of this.ErrorKeywordsToErrorMessages) {
            if (msg.indexOf(item.keyword.toLowerCase()) > -1) {
                return error(item.message)
            }
        }

        return err
    }

    generateError (errMsg) {
        return this.decodeError(new Error(errMsg))
    }

    _findEventByName (receipt, eventName) {
        return receipt.events.filter((event) => {
            return event.event === eventName
        })[0] || null
    }

    /**
     * Returns: {
     *   name,
     *   chainId,
     *   ensAddress,
     *   ... 或其他链自行扩充的属性
     * }
     */
    async getNetworkInfo () {
        const network = await this.provider.getNetwork()
        return network
    }

    isAddress (address) {
        // return this.ethers.utils.isAddress(address)
        return this.ethers.isAddress(address)
    }

    mustAddress (address) {
        const isAddress = this.isAddress(address)
        if (!isAddress) {
            throw this.generateError('InvalidAddress')
        }
    }

    isBigNumber (value) {
        return isBigInt(value)
    }

    bigNumber (value) {
        // return isBigInt(value) ? value : this.ethers.BigNumber.from(value)
        return isBigInt(value) ? value : BigInt(value)
    }

    parseUnits (amount, unit) {
        // const value = this.ethers.utils.parseUnits(amount, unit)
        const value = this.ethers.parseUnits(amount, unit)
        return value
    }

    formatUnits (amount, unit) {
        // const value = this.ethers.utils.formatUnits(amount, unit)
        const value = this.ethers.formatUnits(amount, unit)
        return value
    }

    parseEther (amount) {
        // const value = this.ethers.utils.parseEther(amount)
        const value = this.ethers.parseEther(amount)
        return value
    }

    formatEther (value) {
        // const res = this.ethers.utils.formatEther(value)
        const res = this.ethers.formatEther(value)
        return res
    }

    async getSignerAddress () {
        if (!this.signerAddress) {
            this.signerAddress = await this.signer.getAddress()
        }
        return this.signerAddress
    }

    bigIntMulInt (_bigInt, mul = 1) {
        if (mul !== 1) {
            mul = math.bignumber(mul)
            _bigInt = math.bignumber(_bigInt.toString())
            _bigInt = math.multiply(_bigInt, mul)
            _bigInt = math.round(_bigInt).toString()
            _bigInt = BigInt(_bigInt)
        }
        return _bigInt
    }

    /**
     * @param {number} mul - gas price multiplier, default 1
     */
    async getGasPrice (/* mul = 1 */) {
        try {
            const {
                web3,
            } = this
            const gasPrice = await web3.eth.getGasPrice()
            // gasPrice = this.bigIntMulInt(gasPrice, mul)
            return gasPrice
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    /**
     * 比较参数 gasPrice 和链上的实时 gasPrice, 返回一个更有效更不易导致 transaction out of gas 的 gasPrice
     */
    compareParamGasPriceWithRealtimeGasPrice (paramGasPrice, realTimeGasPrice) {
        debug('compareParamGasPriceWithRealtimeGasPrice.params', {
            paramGasPrice,
            realTimeGasPrice,
            DEFAULT_GAS_PRICE: this.DEFAULT_GAS_PRICE,
        })

        if (isString(paramGasPrice)) {
            paramGasPrice = paramGasPrice.trim() || this.DEFAULT_GAS_PRICE
            paramGasPrice = this.bigNumber(this.parseUnits(paramGasPrice, 'gwei'))
        } else if (!paramGasPrice) {
            paramGasPrice = this.bigNumber(this.parseUnits(this.DEFAULT_GAS_PRICE, 'gwei'))
        } else {
            paramGasPrice = BigInt(paramGasPrice)
        }


        // 当 realTimeGasPrice 大于 paramGasPrice 时
        if (realTimeGasPrice > paramGasPrice) {
            debug('compareParamGasPriceWithRealtimeGasPrice.hit realTimeGasPrice bigger than gasPrice')
            paramGasPrice = realTimeGasPrice
        } else if (this.bigIntMulInt(realTimeGasPrice, this.DEFAULT_MULTIPLIER_FOR_GAS_PRICE) > paramGasPrice) { // 当 realTimeGasPrice 乘以 DEFAULT_MULTIPLIER_FOR_GAS_PRICE 大于 gasPrice 时
            debug('compareParamGasPriceWithRealtimeGasPrice.hit realTimeGasPrice * DEFAULT_MULTIPLIER_FOR_GAS_PRICE bigger than gasPrice', {
                'realTimeGasPrice * DEFAULT_MULTIPLIER_FOR_GAS_PRICE': this.bigIntMulInt(realTimeGasPrice, this.DEFAULT_MULTIPLIER_FOR_GAS_PRICE),
                DEFAULT_MULTIPLIER_FOR_GAS_PRICE: this.DEFAULT_MULTIPLIER_FOR_GAS_PRICE,
                paramGasPrice,
            })
            paramGasPrice = realTimeGasPrice
        }

        return paramGasPrice
    }

    async processGasPrice (gasPrice) {
        debug('processGasPrice.params', {
            gasPrice,
        })
        // 获取链上的实时 gas price(实时 gas price 由最后几个区块的 gas price 的中位数决定)
        const realTimeGasPrice = await this.getGasPrice(/* this.DEFAULT_MULTIPLIER_FOR_GAS_PRICE */)
        debug('processGasPrice.realTimeGasPrice', realTimeGasPrice)
        debug('processGasPrice.DEFAULT_MULTIPLIER_FOR_GAS_PRICE', this.DEFAULT_MULTIPLIER_FOR_GAS_PRICE)
        if (isUndefined(gasPrice)) {
            debug('processGasPrice.hit none inited gasPrice')
            gasPrice = this.compareParamGasPriceWithRealtimeGasPrice(this.DEFAULT_GAS_PRICE, realTimeGasPrice)
        } else {
            debug('processGasPrice.hit exists inited gasPrice')
            gasPrice = this.compareParamGasPriceWithRealtimeGasPrice(gasPrice, realTimeGasPrice)
        }
        gasPrice = this.bigIntMulInt(gasPrice, this.DEFAULT_MULTIPLIER_FOR_GAS_PRICE)
        debug('processGasPrice.gasPrice.final', gasPrice)
        return gasPrice
    }

    async generateTransactionOptions ({
        nonce,
        gasLimit,
        gasPrice,
    } = {}) {
        try {
            debug('generateTransactionOptions.params', {
                nonce,
                gasLimit,
                gasPrice,
            })
            gasLimit = gasLimit || this.DEFAULT_GAS_LIMIT
            debug('generateTransactionOptions.gasLimit.processed', gasLimit)
            // gasPrice = gasPrice || this.DEFAULT_GAS_PRICE
            gasPrice = await this.processGasPrice(gasPrice)
            debug('generateTransactionOptions.gasPrice.processed', gasPrice)
            // const estimateGas = await contract.foo.estimateGas(addr)
            const estimateGas = gasPrice * BigInt(gasLimit)
            debug('generateTransactionOptions.estimateGas.processed', estimateGas)

            const balance = await this.balanceOf(this.signer.address)
            debug('generateTransactionOptions.balance', balance)
            if (balance < estimateGas) {
                throw new Error('InsufficientBalance')
            }

            return {
                nonce,
                gasLimit,
                gasPrice,
            }
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    async getNonce (address) {
        try {
            address = address || await this.getSignerAddress()
            const nonce = await this.provider.getTransactionCount(address)
            return nonce
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    async getBlock (blockNumber) {
        const block = await this.provider.getBlock(blockNumber)
        return block
    }

    async balanceOf (address) {
        try {
            address = address || await this.getSignerAddress()
            const balance = await this.provider.getBalance(address)
            return balance
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    async getTransactionReceipt (txHash) {
        try {
            const receipt = await this.provider.getTransactionReceipt(txHash)
            return receipt
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    async getTransaction (txHash) {
        try {
            const tx = await this.provider.getTransaction(txHash)
            return tx
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    async getEvent (fragment) {
        try {
            const res = await this.iface.getEvent(fragment)
            return res
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    /**
     * 获取或校验 transaction 的执行是否成功
     */
    async getTransactionRevertReason ({
        tx,
        txReceipt,
        hash,
    }) {
        txReceipt = txReceipt || await this.getTransactionReceipt(hash)

        if (txReceipt.status === 1 || txReceipt.status === true) {
            // 交易成功
            debug('Deployment successful', {
                contractAddress: txReceipt.contractAddress,
                gasUsed: txReceipt.gasUsed,
            })
            return
        }

        // 交易失败

        tx = tx || await this.provider.getTransaction(hash)
        const result = await this.provider.call(tx, tx.blockNumber)

        // 'result' 包含了 revert reason，但它是编码过的，需要解码
        if (result.startsWith('0x08c379a0')) { // 0x08c379a0 是标准的错误标识符
            const reason = this.ethers.toUtf8String(`0x${ result.substring(138) }`)
            throw this.generateError(reason)
        } else {
            debug('Deployment failed', {
                txReceipt,
                txReceiptStatus: txReceipt.status,
            })
            // 如果 gasUsed 等于 gasLimit，可能是因为 gas 不足
            if (txReceipt.gasUsed === tx.gasLimit) {
                const reason = 'Transaction ran out of gas'
                throw this.generateError(reason)
            }

            const reason = 'Failed without revert reason'
            throw this.generateError(reason)
        }
    }

    decodeEventLog (receipt, eventName, logIndex = 0) {
        try {
            const res = this.iface.decodeEventLog(eventName, receipt.logs[logIndex].data, receipt.logs[logIndex].topics)
            return res
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    async formatTransaction ({
        tx,
        txReceipt,
        block,
        hash,
        ignoreIfTxCompleted = false,
    } = {}) {
        debug('formatTransaction.params', {
            tx,
            txReceipt,
            block,
            hash,
            ignoreIfTxCompleted,
        })
        hash = hash || tx?.hash || txReceipt?.hash
        tx = tx || await this.getTransaction(hash)
        debug('formatTransaction.tx', tx)
        if (ignoreIfTxCompleted) {
            tx = tx || {}
        } else if (!tx) {
            throw error('Web3.TransactionNotCompleted')
        }

        txReceipt = txReceipt || await this.getTransactionReceipt(hash)
        debug('formatTransaction.txReceipt', txReceipt)
        if (ignoreIfTxCompleted) {
            txReceipt = txReceipt || {}
        } else if (!txReceipt || (txReceipt.status !== 1 && txReceipt.status !== true)) {
            throw error('Web3.TransactionNotCompleted')
        }

        const blockNumber = tx.blockNumber || txReceipt.blockNumber
        debug('formatTransaction.blockNumber', blockNumber)
        block = block || await this.getBlock(blockNumber)
        debug('formatTransaction.block', block)
        if (ignoreIfTxCompleted) {
            block = block || {}
        } else if (!block) {
            throw error('Web3.TransactionNotCompleted')
        }

        const confirmations = tx && isFunction(tx.confirmations)
            ? await tx.confirmations()
            : 0

        const {
            network,
        } = this
        const {
            blockExplorerUrl,
            currency,
        } = network
        const {
            decimals,
            symbol,
        } = currency

        const blockHash = block.hash || null
        const hashExplorerUrl = utils.urlJoin(blockExplorerUrl, 'tx', hash)
        const blockHashExplorerUrl = utils.urlJoin(blockExplorerUrl, 'block', blockHash)
        const contractAddress = txReceipt.contractAddress || tx.contractAddress || null
        const to = tx.to || txReceipt.to || this.zeroAddress
        const index = tx.index || txReceipt.index || null

        const gasLimit = isExists(tx.gasLimit)
            ? tx.gasLimit.toString()
            : null
        const maxPriorityFeePerGas = isExists(tx.maxPriorityFeePerGas)
            ? tx.maxPriorityFeePerGas.toString()
            : null
        const maxPriorityFeePerGasReadable = isExists(tx.maxPriorityFeePerGas)
            ? `${ this.formatUnits(tx.maxPriorityFeePerGas, decimals) } ${ symbol }`
            : null
        const maxFeePerGas = isExists(tx.maxFeePerGas)
            ? tx.maxFeePerGas.toString()
            : null
        const maxFeePerGasReadable = isExists(tx.maxFeePerGas)
            ? `${ this.formatUnits(tx.maxFeePerGas, decimals) } ${ symbol }`
            : null
        const value = isExists(tx.value)
            ? tx.value.toString()
            : null
        const gasPrice = isExists(txReceipt.gasPrice)
            ? txReceipt.gasPrice.toString()
            : null
        const gasPriceReadable = isExists(txReceipt.gasPrice)
            ? `${ this.formatUnits(txReceipt.gasPrice, decimals) } ${ symbol }`
            : null
        const baseFeePerGas = isExists(block.baseFeePerGas)
            ? block.baseFeePerGas.toString()
            : null
        const baseFeePerGasReadable = isExists(block.baseFeePerGas)
            ? `${ this.formatUnits(block.baseFeePerGas, decimals) } ${ symbol }`
            : null
        const gasUsed = isExists(txReceipt.gasUsed)
            ? txReceipt.gasUsed.toString()
            : null
        const cumulativeGasUsed = isExists(txReceipt.cumulativeGasUsed)
            ? txReceipt.cumulativeGasUsed.toString()
            : null

        const status = txReceipt.status === 1 || txReceipt.status === true ? 1 : 0

        const data = {
            from: tx.from,
            to,
            contractAddress,
            hash: tx.hash,
            hashExplorerUrl,
            index,
            blockNumber,
            blockHash,
            blockHashExplorerUrl,

            type: tx.type,
            nonce: tx.nonce,

            gasLimit,
            gasPrice,
            gasPriceReadable,
            baseFeePerGas,
            baseFeePerGasReadable,
            gasUsed,
            cumulativeGasUsed,
            maxPriorityFeePerGas,
            maxPriorityFeePerGasReadable,
            maxFeePerGas,
            maxFeePerGasReadable,

            value,
            data: tx.data,

            status,
            confirmations,
            timestamp: block.timestamp,

            network,
            block,
            tx,
            txReceipt,
        }
        debug('formatTransaction.data', data)

        return data
    }
}


module.exports = Base
