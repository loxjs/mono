# @loxjs/node-base64

`@loxjs/node-base64` is a Node.js module that provides URL-safe Base64 encoding and decoding. It follows the RFC 4648 Spec for Base64 encoding, where '+' is encoded as '-' and '/' is encoded as '_'. Additionally, it can remove padding characters '=' for a more compact representation.

## Installation

```sh
npm install @loxjs/node-base64
```

Or with yarn:

```sh
yarn add @loxjs/node-base64
```

## Usage

This module exports three main functions: `encode`, `decode`, and `validate`. You can use these functions to handle URL-safe Base64 strings within your Node.js applications.

### Encoding to URL Safe Base64

```
const base64 = require('@loxjs/node-base64');

// Encode a string to Base64
const encodedString = base64.encode('Hello World!');
console.log(encodedString); // Output: SGVsbG8gV29ybGQh (without padding '=' characters)
```

### Encoding with Padding Characters

```
const base64 = require('@loxjs/node-base64');

// Encode a string to Base64 and keep padding '=' characters
const encodedStringWithEq = base64.encode('Hello World!', true);
console.log(encodedStringWithEq); // Output: SGVsbG8gV29ybGQh== (with padding '=' characters)
```

### Decoding from URL Safe Base64

```
const base64 = require('@loxjs/node-base64');

// Decode a URL Safe Base64 string
const decodedString = base64.decode('SGVsbG8gV29ybGQh');
console.log(decodedString); // Output: Hello World!
```

### Validating a URL Safe Base64 String

```
const base64 = require('@loxjs/node-base64');

// Validate a URL Safe Base64 string
const isValid = base64.validate('SGVsbG8gV29ybGQh');
console.log(isValid); // Output: true
```

## API

### `encode(str, [witheq])`

Encodes a buffer or string to URL Safe Base64.

- `str` (String|Buffer): The string or buffer to encode.
- `witheq` (Boolean): Optional. If `true`, retains padding '=' characters. Defaults to `false`.

### `decode(str)`

Decodes a URL Safe Base64 string to its original representation.

- `str` (String): The URL Safe Base64 string to decode.

### `validate(str)`

Validates whether a string is a URL Safe Base64 encoded string.

- `str` (String): The string to validate.
