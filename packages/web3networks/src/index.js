
/* eslint-disable class-methods-use-this, no-new, valid-typeof */

const isArray = require('lodash/isArray')
const isInteger = require('lodash/isInteger')
const isNumber = require('lodash/isNumber')
const isString = require('lodash/isString')
const _find = require('lodash/find')
const _findIndex = require('lodash/findIndex')
const _get = require('lodash/get')
const _set = require('lodash/set')
const _merge = require('lodash/merge')
const urlJoin = require('@loxjs/url-join')

const _networks = require('./networks')

class EthereumNetworkManager {
    constructor () {
        this.networks = []

        this.requiredFields = [
            {
                key: 'chainId',
                type: 'number',
                validator (value) {
                    return isInteger(value) && value > 0
                },
            },
            {
                key: 'chain',
                type: 'string',
                validator (value) {
                    return isString(value) && value !== ''
                },
            },
            {
                key: 'name',
                type: 'string',
                validator (value) {
                    return isString(value) && value !== ''
                },
            },
            {
                key: 'rpcUrl',
                type: 'string',
                validator: (value) => {
                    return isString(value) && value !== '' && this.isValidUrl(value)
                },
            },
            {
                key: 'blockExplorerUrl',
                type: 'string',
                validator: (value) => {
                    return isString(value) && value !== '' && this.isValidUrl(value)
                },
            },
            {
                key: 'currency.name',
                type: 'string',
                validator (value) {
                    return isString(value) && value !== ''
                },
            },
            {
                key: 'currency.symbol',
                type: 'string',
                validator (value) {
                    return isString(value) && value !== ''
                },
            },
            {
                key: 'currency.decimals',
                type: 'number',
                validator (value) {
                    return isInteger(value) && value > 0
                },
            },
        ]
        this.optionalFields = [
            {
                key: 'isTest',
                type: 'boolean',
                default: false,
            },
            {
                key: 'options',
                type: 'object',
                default: {},
            },
            {
                key: 'options.defaultGasLimit',
                type: 'number',
                default: 3000000,
                validator (value) {
                    return isInteger(value) && value > 0
                },
            },
            {
                key: 'options.defaultGasPrice',
                type: 'string',
                default: '1',
                validator (value) {
                    return !Number.isNaN(value) && Number(value) > 0
                },
            },
            {
                key: 'options.defaultMultiplierForGasPrice',
                type: 'number',
                default: 1.5,
                validator (value) {
                    return isNumber(value) && value > 0
                },
            },
        ]
    }

    // Function to validate network data
    validateNetwork (network, isUpdate = false) {
        const {
            requiredFields,
            optionalFields,
        } = this

        // Validate required fields
        for (const field of requiredFields) {
            const value = _get(network, field.key)
            const isFieldProvided = value !== undefined && value !== null
            if (isUpdate && !isFieldProvided) {
                // If it's an update, skip validation for fields that are not provided
                return
            }

            if (!isFieldProvided || typeof value !== field.type || !field.validator(value)) {
                throw new Error(`Invalid network data: ${ field.key } is required and must be a valid ${ field.type }.`)
            }
        }

        // Validate and set default values for optional fields
        for (const field of optionalFields) {
            const value = _get(network, field.key)
            const isFieldProvided = value !== undefined && value !== null

            if (isUpdate && !isFieldProvided) {
                // If it's an update, skip validation for fields that are not provided
                return
            }

            if (!isFieldProvided) {
                // Set default value if not provided and it's not an update
                _set(network, field.key, field.default)
            } else if (typeof value !== field.type || (field.validator && !field.validator(value))) {
                // Validate provided value
                throw new Error(`Invalid network data: ${ field.key } must be a valid ${ field.type }.`)
            }
        }
    }

    // Function to add a new network
    addNetwork (network) {
        const {
            networks,
        } = this
        network.chainId = parseInt(network.chainId)
        this.validateNetwork(network)
        const existingNetwork = this.getNetworkByChainId(network.chainId)
        if (existingNetwork) {
            throw new Error(`Network with chainId ${ network.chainId } already exists.`)
        }
        networks.push(network)
    }

    addNetworks (networks) {
        networks.forEach((network) => {
            this.addNetwork(network)
        })
    }

    // Function to get a network by its chainId
    getNetworkByChainId (chainId, properties) {
        chainId = parseInt(chainId)
        const {
            networks,
        } = this
        const network = _find(networks, { chainId })
        if (!network) {
            return null
        }

        if (!properties) {
            return network
        }

        if (isArray(properties)) {
            return properties.reduce((result, prop) => {
                _set(result, prop, _get(network, prop))
                return result
            }, {})
        }

        return _get(network, properties)
    }

    // Function to update an existing network
    updateNetwork (chainId, newNetworkData) {
        const {
            networks,
        } = this
        this.validateNetwork(newNetworkData, true)
        const networkIndex = _findIndex(networks, { chainId })
        if (networkIndex === -1) {
            throw new Error(`Network with chainId ${ chainId } not found.`)
        }

        // Merge current network data with new data
        const currentNetworkData = networks[networkIndex]
        const updatedNetworkData = _merge({}, currentNetworkData, newNetworkData)
        // Validate the merged result to ensure it's still a valid network
        this.validateNetwork(updatedNetworkData)

        networks[networkIndex] = updatedNetworkData
    }

    // Helper function to check if a string is a valid URL
    isValidUrl (string) {
        try {
            new URL(string)
            return true
        } catch (err) {
            return false
        }
    }

    /**
     * Get the contract explorer URL for a given contract address on a specific chain
     * @param {number} chainId - Chain ID
     * @param {string} contractAddress - Contract address
     * @returns {string} - Contract explorer URL
     */
    getContractExplorerUrl (chainId, contractAddress) {
        const network = this.getNetworkByChainId(chainId, ['blockExplorerUrl'])
        return urlJoin(network.blockExplorerUrl, 'address', contractAddress)
    }

    /**
     * Get the contract token list explorer URL for a given contract address on a specific chain
     * @param {number} chainId - Chain ID
     * @param {string} contractAddress - Contract address
     * @returns {string} - Contract token list explorer URL
     */
    getContractTokenListExplorerUrl (chainId, contractAddress) {
        const network = this.getNetworkByChainId(chainId, ['chainId', 'blockExplorerUrl'])
        if (network.chainId === 355113) {
            return urlJoin(network.blockExplorerUrl, 'address', contractAddress, '?tab=tokens_nfts')
        }
        return urlJoin(network.blockExplorerUrl, 'tokens', contractAddress)
    }

    /**
     * Get the token explorer URL for a given contract address and token ID on a specific chain
     * @param {number} chainId - Chain ID
     * @param {string} contractAddress - Contract address
     * @param {string} tokenId - Token ID
     * @returns {string} - Token explorer URL
     */
    getContractTokenExplorerUrl (chainId, contractAddress, tokenId) {
        const network = this.getNetworkByChainId(chainId, ['blockExplorerUrl'])
        return urlJoin(network.blockExplorerUrl, 'token', contractAddress, `?a=${ tokenId }`)
    }
}


const ethereumNetworkManager = new EthereumNetworkManager()
ethereumNetworkManager.addNetworks(_networks)

module.exports = ethereumNetworkManager
