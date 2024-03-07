
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
        this.validateNetwork(network)
        const existingNetwork = this.getNetworkByChainId(network.chainId)
        if (existingNetwork) {
            throw new Error(`Network with chainId ${ network.chainId } already exists.`)
        }
        this.networks.push(network)
    }

    addNetworks (networks) {
        networks.forEach((network) => {
            this.addNetwork(network)
        })
    }

    // Function to get a network by its chainId
    getNetworkByChainId (chainId, properties) {
        const network = _find(this.networks, { chainId })
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
        this.validateNetwork(newNetworkData, true)
        const networkIndex = _findIndex(this.networks, { chainId })
        if (networkIndex === -1) {
            throw new Error(`Network with chainId ${ chainId } not found.`)
        }

        // Merge current network data with new data
        const currentNetworkData = this.networks[networkIndex]
        const updatedNetworkData = _merge({}, currentNetworkData, newNetworkData)
        // Validate the merged result to ensure it's still a valid network
        this.validateNetwork(updatedNetworkData)

        this.networks[networkIndex] = updatedNetworkData
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
}


const networks = [
    {
        chainId: 1,
        chain: 'Ethereum',
        name: 'Ethereum',
        rpcUrl: 'https://ethereum-rpc.publicnode.com',
        blockExplorerUrl: 'https://etherscan.io/',
        isTest: false,
        currency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },
    {
        chainId: 17000,
        chain: 'Ethereum',
        name: 'Holesky',
        rpcUrl: 'https://ethereum-holesky.publicnode.com',
        blockExplorerUrl: 'https://holesky.etherscan.io/',
        isTest: true,
        currency: {
            name: 'Holesky ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },
    {
        chainId: 11155111,
        chain: 'Ethereum',
        name: 'Sepolia',
        rpcUrl: 'https://rpc.sepolia.org',
        blockExplorerUrl: 'https://sepolia.etherscan.io/',
        isTest: true,
        currency: {
            name: 'Sepolia ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },
    {
        chainId: 43114,
        chain: 'Avalanche',
        name: 'Avalanche',
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        blockExplorerUrl: 'https://snowtrace.io/',
        isTest: false,
        currency: {
            name: 'AVAX',
            symbol: 'AVAX',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },
    {
        chainId: 43113,
        chain: 'Avalanche',
        name: 'Avalanche Fuji',
        // rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
        rpcUrl: 'https://avalanche-fuji-c-chain-rpc.publicnode.com',
        blockExplorerUrl: 'https://testnet.snowtrace.io/',
        isTest: true,
        currency: {
            name: 'AVAX',
            symbol: 'AVAX',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },
    {
        chainId: 137,
        chain: 'Polygon',
        name: 'Polygon',
        rpcUrl: 'https://polygon-rpc.com/',
        blockExplorerUrl: 'https://polygonscan.com/',
        isTest: false,
        currency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },
    {
        chainId: 80001,
        chain: 'Polygon',
        name: 'Mumbai',
        // rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
        rpcUrl: 'https://avalanche-fuji-c-chain-rpc.publicnode.com',
        blockExplorerUrl: 'https://mumbai.polygonscan.com/',
        isTest: true,
        currency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },
    {
        chainId: 56,
        chain: 'BNB Smart Chain',
        name: 'BNB Chain',
        oldName: 'Binance Smart Chain Mainnet',
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        blockExplorerUrl: 'https://bscscan.com/',
        isTest: false,
        currency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },
    {
        chainId: 97,
        chain: 'BNB Smart Chain',
        name: 'BNB Chain Testnet',
        oldName: 'Binance Smart Chain Testnet',
        rpcUrl: 'https://bsc-testnet-rpc.publicnode.com',
        blockExplorerUrl: 'https://testnet.bscscan.com/',
        isTest: true,
        currency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },
    {
        chainId: 974399131,
        chain: 'Skale',
        name: 'Skale Calypso Hub Testnet',
        rpcUrl: 'https://testnet.skalenodes.com/v1/giant-half-dual-testnet',
        blockExplorerUrl: 'https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/',
        isTest: true,
        currency: {
            name: 'SKALE FUEL',
            symbol: 'sFUEL',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },
    {
        chainId: 1564830818,
        chain: 'Skale',
        name: 'Skale Calypso Hub',
        rpcUrl: 'https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague',
        blockExplorerUrl: 'https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com/',
        isTest: false,
        currency: {
            name: 'SKALE FUEL',
            symbol: 'sFUEL',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },
]

const ethereumNetworkManager = new EthereumNetworkManager()
ethereumNetworkManager.addNetworks(networks)

module.exports = ethereumNetworkManager
