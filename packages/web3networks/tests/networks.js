
const networks = [
    // Fantom Opera
    {
        chainId: 90000000001,
        chain: 'Fantom',
        name: 'Fantom Opera',
        rpcUrl: 'https://rpc.ftm.tools/',
        blockExplorerUrl: 'https://ftmscan.com/',
        isTest: false,
        currency: {
            name: 'FTM',
            symbol: 'FTM',
            decimals: 18,
        },
        options: {
            defaultGasLimit: 3000000,
            defaultGasPrice: '1',
            defaultMultiplierForGasPrice: 1.5,
        },
    },

    // Optimism
    {
        chainId: 90000000002,
        chain: 'Optimism',
        name: 'Optimism',
        rpcUrl: 'https://mainnet.optimism.io',
        blockExplorerUrl: 'https://optimistic.etherscan.io/',
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

    // Arbitrum One
    {
        chainId: 90000000003,
        chain: 'Arbitrum',
        name: 'Arbitrum One',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        blockExplorerUrl: 'https://arbiscan.io/',
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
]


module.exports = networks

