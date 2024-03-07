const _get = require('lodash/get')
const ethereumNetworkManager = require('../src')
const networks = require('./networks')

describe('EthereumNetworkManager', () => {
    let manager

    beforeEach(() => {
        // // 在每个测试用例执行之前重置网络管理器实例
        // manager = new EthereumNetworkManager()
        manager = ethereumNetworkManager
    })

    test('should add a single network successfully', () => {
        const network = networks[0] // 假设这是有效的网络对象
        expect(() => {
            return manager.addNetwork(network)
        }).not.toThrow()
    })

    test('should add multiple networks successfully', () => {
        expect(() => {
            return manager.addNetworks(networks.slice(1))
        }).not.toThrow()
    })

    test('should throw an error when adding an existing network', () => {
        const network = networks[0]
        expect(() => {
            return manager.addNetwork(network)
        }).toThrow(`Network with chainId ${ network.chainId } already exists.`)
    })

    test('should get a network by chainId', () => {
        const {
            chainId,
        } = networks[0]
        const network = manager.getNetworkByChainId(chainId)
        expect(network).toBeDefined()
        expect(network.chainId).toBe(chainId)
    })

    test('should return null if network does not exist', () => {
        const chainId = 99000000001 // 假设这是一个不存在的 chainId
        const network = manager.getNetworkByChainId(chainId)
        expect(network).toBeNull()
    })

    test('should update an existing network', () => {
        const {
            chainId,
        } = networks[0]
        const newRpcUrl = 'https://new-rpc-url.com'
        manager.updateNetwork(chainId, { rpcUrl: newRpcUrl })
        const updatedNetwork = manager.getNetworkByChainId(chainId)
        expect(updatedNetwork.rpcUrl).toBe(newRpcUrl)
    })

    test('should update an existing network with new properties', () => {
        const {
            chainId,
        } = networks[0]
        const newRpcUrl = 'https://new-rpc-url.com'
        const newProperties = {
            rpcUrl: newRpcUrl,
            currency: {
                name: 'NEWName',
                symbol: 'NEWSymbol',
            },
            options: {
                defaultGasPrice: '2',
                defaultGasLimit: 4000000,
            },
        }
        const keys = [
            'rpcUrl',
            'currency.name',
            'currency.symbol',
            'options.defaultGasPrice',
            'options.defaultGasLimit',
        ]
        manager.updateNetwork(chainId, newProperties)
        const updatedNetwork = manager.getNetworkByChainId(chainId)
        for (const key of keys) {
            const value = _get(updatedNetwork, key)
            expect(value).toBe(_get(newProperties, key))
        }
    })

    test('should update an existing network via chained new properties', () => {
        const {
            chainId,
        } = networks[1]
        const newRpcUrl = 'https://new-rpc-url.com'
        const newProperties = {
            rpcUrl: newRpcUrl,
            'currency.symbol': 'NEWSymbol',
            'options.defaultGasLimit': 4000000,
        }
        manager.updateNetwork(chainId, newProperties)
        const updatedNetwork = manager.getNetworkByChainId(chainId)
        for (const key of Object.keys(newProperties)) {
            const value = _get(updatedNetwork, key)
            expect(value).toBe(newProperties[key])
        }
    })

    test('should throw an error when updating a non-existing network', () => {
        const chainId = 99000000001 // 假设这是一个不存在的 chainId
        expect(() => {
            return manager.updateNetwork(chainId, {
                rpcUrl: 'https://new-rpc-url.com',
            })
        }).toThrow(`Network with chainId ${ chainId } not found.`)
    })

    test('should validate network data with all required fields', () => {
        const incompleteNetwork = {
            chainId: 99000000002,
            // 缺少其它必要字段
        }
        expect(() => {
            return manager.validateNetwork(incompleteNetwork)
        }).toThrow()
    })

    test('should handle optional fields correctly', () => {
        const networkWithOptionalFields = {
            chainId: 99000000002,
            chain: 'Testnet',
            name: 'Test Network',
            rpcUrl: 'https://test-rpc-url.com',
            blockExplorerUrl: 'https://test-block-explorer.com',
            currency: {
                name: 'Test',
                symbol: 'TST',
                decimals: 18,
            },
            // options 字段是可选的
        }
        expect(() => {
            return manager.validateNetwork(networkWithOptionalFields)
        }).not.toThrow()
        manager.addNetwork(networkWithOptionalFields)
        const network = manager.getNetworkByChainId(networkWithOptionalFields.chainId)
        expect(network.options).toBeDefined()
        expect(network.options.defaultGasLimit).toBe(3000000) // 检查默认值是否被设置
    })
})
