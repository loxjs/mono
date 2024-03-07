# README for @loxjs/web3networks

The `@loxjs/web3networks` module provides a comprehensive and easy-to-use interface to manage Ethereum-based blockchain network configurations. It allows developers to add, retrieve, update, and validate network configurations for different Ethereum chains, including testnets and mainnets.

## Features

- Add single or multiple network configurations
- Retrieve network configurations by chain ID
- Update existing network configurations
- Validate network data with required and optional fields
- Set default values for optional fields if not provided
- Helper function to validate URLs

## Installation

To install the module, use npm or yarn as follows:

npm:

```sh
npm install @loxjs/web3networks
```

yarn:

```sh
yarn add @loxjs/web3networks
```

## Usage

First, require the module in your project:

```javascript
const ethereumNetworkManager = require('@loxjs/web3networks');
```

### Adding Networks

To add a new network configuration:

```javascript
const newNetwork = {
    chainId: 1,
    chain: 'Ethereum',
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet-rpc-url.com',
    blockExplorerUrl: 'https://mainnet-block-explorer.com',
    currency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
    },
    options: {
        defaultGasLimit: 21000,
        defaultGasPrice: '1000000000',
    },
};

try {
    ethereumNetworkManager.addNetwork(newNetwork);
    console.log('Network added successfully');
} catch (error) {
    console.error('Failed to add network:', error.message);
}
```

To add multiple networks at once:

```javascript
const networksArray = [/* array of network objects */];

try {
    ethereumNetworkManager.addNetworks(networksArray);
    console.log('Networks added successfully');
} catch (error) {
    console.error('Failed to add networks:', error.message);
}
```

### Retrieving Networks

To get a network by its chain ID:

```javascript
const chainId = 1; // For Ethereum Mainnet
const network = ethereumNetworkManager.getNetworkByChainId(chainId);

if (network) {
    console.log('Retrieved network:', network);
} else {
    console.log('Network not found for chain ID:', chainId);
}
```

### Updating Networks

To update an existing network:

```javascript
const chainIdToUpdate = 1;
const newRpcUrl = 'https://new-mainnet-rpc-url.com';

try {
    ethereumNetworkManager.updateNetwork(chainIdToUpdate, { rpcUrl: newRpcUrl });
    console.log('Network updated successfully');
} catch (error) {
    console.error('Failed to update network:', error.message);
}
```

### Validating Network Data

To validate network data:

```javascript
const networkData = {
    chainId: 1,
    // ...other required properties
};

try {
    ethereumNetworkManager.validateNetwork(networkData);
    console.log('Network data is valid');
} catch (error) {
    console.error('Invalid network data:', error.message);
}
```

## API Reference

### `addNetwork(network)`

Adds a single network configuration.

**Parameters:**

- `network` - An object containing the network configuration.

**Example:**

```javascript
ethereumNetworkManager.addNetwork({
    chainId: 1,
    // ...other network properties
});
```

### `addNetworks(networks)`

Adds multiple network configurations.

**Parameters:**

- `networks` - An array of objects containing the network configurations.

**Example:**

```javascript
ethereumNetworkManager.addNetworks([
    {
        chainId: 1,
        // ...other network properties
    },
    {
        chainId: 2,
        // ...other network properties
    },
]);
```

### `getNetworkByChainId(chainId, [properties])`

Retrieves a network by its chain ID. Optionally, specific properties can be retrieved.

**Parameters:**

- `chainId` - The chain ID of the network to retrieve.
- `properties` (optional) - An array of strings specifying which properties to retrieve.

**Example:**

```javascript
const network = ethereumNetworkManager.getNetworkByChainId(1, ['rpcUrl', 'currency.name']);
```

### `updateNetwork(chainId, newNetworkData)`

Updates an existing network configuration.

**Parameters:**

- `chainId` - The chain ID of the network to update.
- `newNetworkData` - An object containing the new network data.

**Example:**

```javascript
ethereumNetworkManager.updateNetwork(1, {
    rpcUrl: 'https://new-mainnet-rpc-url.com',
    // ...other network properties
});
```

```javascript
ethereumNetworkManager.updateNetwork(1, {
    name: 'New chain name',
    'currency.name': 'New Name',
    'options.defaultGasLimit': 4000000,
    // ...other network properties
});
```

### `validateNetwork(network, [isUpdate])`

Validates the provided network configuration.

**Parameters:**

- `network` - An object containing the network configuration.
- `isUpdate` (optional) - A boolean indicating whether the validation is for an update operation.

**Example:**

```javascript
ethereumNetworkManager.validateNetwork({
    chainId: 1,
    // ...other network properties
});
```
