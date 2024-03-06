
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


module.exports = {
    list: networks,
    addNetwork (network = {}) {
        for (let i = 0; i < networks.length; i += 1) {
            if (networks[i].chainId === network.chainId) {
                networks.splice(i, 1)
                return
            }
        }
        networks.push(network)
    },
    getNetworkByChainId (chainId) {
        return networks.find((network) => { return network.chainId.toString() === chainId.toString() })
    },
}
