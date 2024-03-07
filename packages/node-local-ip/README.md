# @loxjs/node-local-ip

`@loxjs/node-local-ip` is a simple Node.js module that helps you retrieve the local IPv4 address of your machine. It automatically determines the correct network interface based on your operating system (e.g., `eth0` for Linux, `en0` for Mac) and provides the IPv4 address associated with that interface.

## Installation

```sh
npm install @loxjs/node-local-ip
```

Or with yarn:

```sh
yarn add @loxjs/node-local-ip
```

## Usage

To use this module to get your local IPv4 address, simply require and call the module. It will return the local IPv4 address as a string.

### Example

```
const getLocalIp = require('@loxjs/node-local-ip');

const myLocalIp = getLocalIp();
console.log('My local IP address is:', myLocalIp);
```

The above code will output your machine's local IP address to the console.

## How It Works

The module uses Node.js's built-in `os` module to access the network interfaces of the machine. It then looks for the `IPv4` address within the network interfaces object.

## Error Handling

If the module encounters an error while trying to retrieve the network interfaces, it will return the error object.

### Example with Error Handling

```
const getLocalIp = require('@loxjs/node-local-ip');

try {
    const myLocalIp = getLocalIp();
    console.log('My local IP address is:', myLocalIp);
} catch (err) {
    console.error('Error retrieving local IP:', err);
}
```
