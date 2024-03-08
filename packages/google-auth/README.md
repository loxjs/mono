# GoogleAuth Module

The `@loxjs/google-auth` module is a Node.js package designed to simplify the process of authenticating users with Google OAuth2. It provides an easy-to-use interface for obtaining user information using Google's OAuth2 API.

## Features

- Easy Google OAuth2 integration.
- Supports proxy configuration for requests.
- Simplified method to obtain user information from Google ID tokens.

## Installation

To install the `@loxjs/google-auth` module, run the following command in your project directory:

```sh
npm install @loxjs/google-auth
```

## Usage

To use the `GoogleAuth` class, you need to create an instance and provide it with your Google client secret details. You can also specify a timeout and proxy settings.

### Parameters

- `secret` (Required): An object containing your Google app's `client_id`, `client_secret`, and `grant_type`.
- `timeout` (Optional): A number representing the request timeout in milliseconds. Default is `120000` (2 minutes).
- `proxy` (Optional): An object specifying the proxy configuration. Click [here](https://www.npmjs.com/package/tunnel) for more information.

### Dependencies

This module relies on the following npm packages:

- `querystring`: [View on npmjs](https://www.npmjs.com/package/querystring)
- `@loxjs/errors`: [View on npmjs](https://www.npmjs.com/package/@loxjs/errors)
- `axios`: [View on npmjs](https://www.npmjs.com/package/axios)
- `tunnel`: [View on npmjs](https://www.npmjs.com/package/tunnel)

Please refer to the respective package pages on npmjs for more information.

## API

The `GoogleAuth` module exposes a single class, `GoogleAuth`, which contains the following method:

### getUserInfo

This method retrieves user information using a given code and redirect URI.

#### Parameters

- `code` (Required): The authorization code you received from Google after user consent.
- `redirect_uri` (Required): The URI where the user was redirected after consent.

#### Example

```js
const GoogleAuth = require('@loxjs/google-auth');

const googleAuth = new GoogleAuth({
    secret: {
        client_id: 'YOUR_CLIENT_ID',
        client_secret: 'YOUR_CLIENT_SECRET',
        grant_type: 'authorization_code'
    },
    timeout: 1000 * 60 * 2, // Optional, 2 minutes timeout
    proxy: { // Optional
        protocol: 'http',
        host: 'localhost',
        port: 8080,
        proxyAuth: 'user:password',
        headers: {
            'User-Agent': 'Node'
        }
    }
});

async function authenticate() {
    try {
        const userInfo = await googleAuth.getUserInfo({
            code: 'AUTHORIZATION_CODE',
            redirect_uri: 'YOUR_REDIRECT_URI'
        });
        console.log(userInfo);
    } catch (error) {
        console.error('Authentication failed:', error);
    }
}

authenticate();
```

Replace `'YOUR_CLIENT_ID'`, `'YOUR_CLIENT_SECRET'`, `'AUTHORIZATION_CODE'`, and `'YOUR_REDIRECT_URI'` with your actual client ID, client secret, authorization code, and redirect URI, respectively.

## Note

When using the `proxy` option, make sure the proxy settings are correct and the proxy server is properly configured to handle HTTPS over HTTP tunneling.

## Error Handling

Errors are handled using the `@loxjs/errors` package. If the `id_token` is not present in the response, the `Account.InvalidGoogleAuthToken` error is thrown. Make sure to catch and handle errors appropriately in your implementation.

For more information on error handling, please visit [`@loxjs/errors` on npmjs](https://www.npmjs.com/package/@loxjs/errors).

---

This README provides a basic overview of the `@loxjs/google-auth` module. For further details and advanced usage, please refer to the source code and the official Google OAuth2 documentation.