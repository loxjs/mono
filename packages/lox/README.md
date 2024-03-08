# @loxjs/lox Module

The `@loxjs/lox` module is a comprehensive utility library for Node.js applications. It extends native JavaScript capabilities, integrates environment configurations, error handling, dynamic module loading, and provides a suite of tools for building robust Node.js services.

## Features

- Extends native JavaScript objects with additional functionality.
- Loads configuration options based on the Node.js application environment.
- Offers a structured error handling system.
- Dynamically loads JavaScript modules.
- Generates unique IDs with Snowflake algorithm.
- Provides debugging utilities.
- Sets up an Express.js application with security best practices using Helmet and CORS.
- Includes a utility function collection from `@loxjs/utils`.
- Facilitates the creation of Express.js routing with `@loxjs/express-router`.

## Installation

To install the `@loxjs/lox` module, use the following npm command:

```sh
npm install @loxjs/lox
```

## Usage

After installation, you can require the `@loxjs/lox` module in your project to access its functionalities.

### Configuration

The module automatically loads configuration options from the environment and the `package.json` of the Node.js application.

#### Example

```js
const lox = require('@loxjs/lox');

console.log(lox.config); // Access configuration options
```

### Debugging

The `debug` utility is provided for logging debug information.

#### Example

```js
const lox = require('@loxjs/lox');

const debug = lox.debug('myapp:server');
debug('Server is starting...');
```

For more information on the `debug` package, visit the [npmjs page](https://www.npmjs.com/package/debug).

### Express.js Application Setup

The module sets up an Express.js application with security enhancements using Helmet and CORS.

#### Example

```js
const lox = require('@loxjs/lox');

const app = lox.express();
app.use(lox.helmet()); // Security enhancements
app.use(lox.cors()); // Enable CORS
```

For more information on `express`, `helmet`, and `cors`, visit their npmjs pages:
- [express](https://www.npmjs.com/package/express)
- [helmet](https://www.npmjs.com/package/helmet)
- [cors](https://www.npmjs.com/package/cors)

### Error Handling

The module provides a structured error handling system.

#### Example

```js
const lox = require('@loxjs/lox');

try {
  // Your code here...
} catch (error) {
  lox.error.handle(error);
}
```

### Utilities

Utility functions from `@loxjs/utils` are included for convenience.

#### Example

```js
const lox = require('@loxjs/lox');

const obfuscatedEmail = lox.utils.obfuscateEmail('example@domain.com');
console.log(obfuscatedEmail); // Output: e***e@domain.com
```

For more information on the `@loxjs/utils` package, visit the [npmjs page](https://www.npmjs.com/package/@loxjs/utils).

### Snowflake IDs

Generate unique IDs with the Snowflake algorithm.

#### Example

```js
const lox = require('@loxjs/lox');

const id = new lox.utils.Snowflake(/* parameters */).next();
console.log(id); // Output: A unique Snowflake ID
```

For more information on the `@loxjs/snowflake` package, visit the [npmjs page](https://www.npmjs.com/package/@loxjs/snowflake).

### Dynamic Module Loading

Dynamically load JavaScript modules as needed.

#### Example

```js
const lox = require('@loxjs/lox');

const modules = lox.utils.loadJSModules({ dir: './path/to/modules', autoLoad: true });

// Use the loaded modules
modules.forEach((mod) => {
  console.log(`Module ${mod.moduleName} loaded`, mod.module);
});
```

## Error Handling

Errors are handled through the `@loxjs/errors` module. If an error occurs, it should be passed to the `error.handle` function for structured error handling.

For more information on the `@loxjs/errors` package, visit the [npmjs page](https://www.npmjs.com/package/@loxjs/errors).

---

This README provides a basic overview of the `@loxjs/lox` module. For further details and advanced usage, please refer to the source code and the official documentation for each individual package included in this module.
