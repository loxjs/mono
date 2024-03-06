
/* eslint-disable class-methods-use-this */

const debug = require('debug')('Contract-Base:Connector')

const Base = require('./base')


const Contract = class extends Base {
    constructor ({
        contractName = '',
        chainId,
        // timeout = 1000 * 60 * 20,
        contractAddress,
        signerPrivateKey,
        abi,
        tokenCurrency = {
            name: '',
            symbol: '',
            decimals: 18,
        },

        ethers,
        provider,
        signer,
        contract,
        errorKeywordsToErrorMessages = {},
        eventToTopics = {},

        // eventDataKeys struct:
        // {
        //     EventType: {
        //         eventName: '...',
        //         attributes: [...],
        //     },
        // }
        // example:
        // {
        //     Transfer: {
        //         eventName: 'Transfer',
        //         attributes: ['from', 'to', 'tokenId'],
        //     },
        //     MintBatch: {
        //         eventName: 'MintBatch',
        //         attributes: ['to', 'amount', 'startTokenId', 'endTokenId'],
        //     },
        //     Mint: {
        //         eventName: 'Transfer',
        //         attributes: [undefined, 'to', 'tokenId'],
        //     },
        //     SetBaseURI: {
        //         eventName: 'SetBaseURI',
        //         attributes: ['oldBaseURI', 'newBaseURI'],
        //     },
        // }
        eventDataKeys = {},
    } = {}) {
        super({
            ethers,
            chainId,
            provider,
            signer,
            signerPrivateKey,
            errorKeywordsToErrorMessages,
        })

        contract = contract || (
            this.signer
                ? new this.ethers.Contract(contractAddress, abi, this.signer)
                : null
        )
        this.contractName = contractName
        // this.timeout = timeout
        this.contractAddress = contractAddress
        this.abi = abi

        this.contract = contract
        this.tokenCurrency = tokenCurrency
        this.isERC20TokenContract = !!this.tokenCurrency.symbol
        // this.iface = new this.ethers.utils.Interface(abi)
        this.iface = new this.ethers.Interface(abi)
        this.eventToTopics = eventToTopics
        this.eventDataKeys = eventDataKeys

        debug('Instantiating', {
            contractName,
            tokenCurrency,
            isERC20TokenContract: this.isERC20TokenContract,
            iface: this.iface,
        })
    }

    // attributes 中 key 的顺序需要与 Contract Event 中定义的属性顺序一致
    decodeEventLogFromReceipt (receipt, eventName, attributes = []) {
        debug('decodeEventLogFromReceipt:start', eventName)
        const res = {
            decoded: false,
            contractAddress: this.contractAddress,
        }

        // debug('decodeEventLogFromReceipt:receipt.events', receipt.events)
        // debug('decodeEventLogFromReceipt:receipt.logs', receipt.logs)
        if (receipt.events && receipt.events.length > 0) {
            debug('decodeEventLogFromReceipt:decode-from-receipt.events')
            const event = this._findEventByName(receipt, eventName)
            res.event = event.event
            res.eventSignature = event.eventSignature
            res.args = event.args
        } else if (receipt.logs && receipt.logs.length > 0) {
            debug('decodeEventLogFromReceipt:decode-from-receipt.logs:total-logs:', receipt.logs.length)
            const {
                logs,
            } = receipt
            const len = logs.length
            let logIndex = len - 1
            for (; logIndex > -1; logIndex -= 1) {
                if (
                    logs[logIndex]?.fragment?.name === eventName
                    || (logs[logIndex]?.topics || []).includes(this.eventToTopics[eventName])
                ) {
                    break
                }
            }
            if (logIndex < 0) {
                logIndex = len - 1
                for (; logIndex > -1; logIndex -= 1) {
                    if (logs[logIndex]?.data !== '0x') {
                        break
                    }
                }
            }

            if (logIndex < 0) {
                logIndex = len - 2
            }
            res.args = this.decodeEventLog(receipt, eventName, logIndex)
        } else {
            debug('decodeEventLogFromReceipt:cannot-decode')
            return res
        }

        res.decoded = true
        if (Array.isArray(attributes) && attributes.length > 0) {
            for (let i = 0; i < attributes.length; i += 1) {
                if (typeof attributes[i] !== 'undefined') {
                    res[attributes[i]] = res.args[i]
                }
            }
        }
        debug('decodeEventLogFromReceipt:end')

        return res
    }

    getDataFromEvent (receipt, eventType) {
        const {
            eventDataKeys,
        } = this

        if (!eventDataKeys[eventType]) {
            return null
        }

        const {
            eventName,
            attributes,
        } = eventDataKeys[eventType]

        const res = this.decodeEventLogFromReceipt(receipt, eventName, attributes)
        res.action = eventType
        return res
    }
}


module.exports = Contract
