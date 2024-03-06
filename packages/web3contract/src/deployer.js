
/* eslint-disable class-methods-use-this */

const debug = require('debug')('Contract-Base:Deployer')
const sleep = require('sleep-promise')

const Base = require('./base')


const Deployer = class extends Base {
    constructor ({
        chainId,
        // timeout = 1000 * 60 * 20,
        signerPrivateKey,

        ethers,
        provider,
        signer,
        abi,
        bytecode,
        errorKeywordsToErrorMessages = {},
    }) {
        super({
            ethers,
            chainId,
            provider,
            signer,
            signerPrivateKey,
            errorKeywordsToErrorMessages,
        })

        debug('Instantiating', {
            ethers,
            chainId,
            provider,
            signer,
        })

        this.factory = new this.ethers.ContractFactory(abi, bytecode, this.signer)
        // this.timeout = timeout
    }

    async deploy ({
        constructorParams = [],
        nonce,
        gasPrice,
        gasLimit,
    } = {}) {
        debug('Deploying contract init params:', {
            constructorParams,
            gasPrice,
            gasLimit,
        })

        const options = await this.generateTransactionOptions({
            nonce,
            gasLimit,
            gasPrice,
        })
        debug('Deploying contract with params:', {
            constructorParams,
            ...options,
        })

        const contract = await this.factory.deploy(...constructorParams, options)
        await sleep(30000)
        const txReceipt = await contract.deploymentTransaction()

        await this.getTransactionRevertReason({
            hash: txReceipt.hash, // deploymentTransaction 返回的数据可能不太完整, 所有此处不使用 deploymentTransaction 返回的 txReceipt
        })

        return {
            contract,
            address: contract.target,
            hash: txReceipt.hash,
        }
    }
}


module.exports = Deployer
