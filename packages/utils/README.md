# @loxjs/utils

The `@loxjs/utils` module is a collection of utility functions designed to assist with common tasks such as obfuscating sensitive information and integrating Google OAuth2 authentication in your Node.js applications.

## Features

- Obfuscate email addresses to protect them from being used for spam or other malicious activities.
- Obfuscate hashes to maintain privacy while still allowing identification.
- Obfuscate wallet addresses to enhance security and privacy in transactions.
- Integrate Google OAuth2 authentication easily with the bundled `GoogleAuth` class.

## Installation

To install the `@loxjs/utils` module, run the following command in your project directory:

```sh
npm install @loxjs/utils
```

## Usage

After installation, you can import and use the various utility functions and the GoogleAuth class in your application.

### Obfuscating Email Addresses

#### `obfuscateEmail(email)`

- `email` (Required): The email address to obfuscate.

#### Example

```js
const { obfuscateEmail } = require('@loxjs/utils');

const email = 'example@domain.com';
const obfuscatedEmail = obfuscateEmail(email);
console.log(obfuscatedEmail); // Output: e***e@domain.com
```

### Obfuscating Hashes

#### `obfuscateHash(hash)`

- `hash` (Required): The hash string to obfuscate.

#### Example

```js
const { obfuscateHash } = require('@loxjs/utils');

const hash = '123456abcdef1234567890abcdef1234567890';
const obfuscatedHash = obfuscateHash(hash);
console.log(obfuscatedHash); // Output: 123456...7890
```

### Obfuscating Wallet Addresses

#### `obfuscateWallet(wallet)`

- `wallet` (Required): The wallet address to obfuscate.

#### Example

```js
const { obfuscateWallet } = require('@loxjs/utils');

const wallet = '0x123456abcdef1234567890abcdef1234567890';
const obfuscatedWallet = obfuscateWallet(wallet);
console.log(obfuscatedWallet); // Output: 0x1234...7890
```

### Google OAuth2 Authentication

The `GoogleAuth` class from the `@loxjs/google-auth` module is also re-exported in this utility package for convenience.

To learn more about the `GoogleAuth` class and its usage, please refer to the documentation for [`@loxjs/google-auth` on npmjs](https://www.npmjs.com/package/@loxjs/google-auth).

#### Example

```js
const { GoogleAuth } = require('@loxjs/utils');

const googleAuth = new GoogleAuth({
    secret: {
        client_id: 'YOUR_CLIENT_ID',
        client_secret: 'YOUR_CLIENT_SECRET',
        grant_type: 'authorization_code'
    }
    // Additional configurations such as timeout and proxy can be added here
});

// Use the googleAuth instance to authenticate and obtain user information
```

Replace `'YOUR_CLIENT_ID'` and `'YOUR_CLIENT_SECRET'` with your actual Google client ID and client secret.

## Error Handling

The `obfuscateEmail` function will return the original input if it is not a valid email address. The `obfuscateHash` and `obfuscateWallet` functions will return an empty string if the input is falsy. Make sure to handle these cases as needed in your application.

---

This README provides a basic overview of the `@loxjs/utils` module. For further details and advanced usage, please refer to the source code and the official documentation for the `@loxjs/google-auth` module.
