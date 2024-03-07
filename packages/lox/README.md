# @loxjs/lox

`@loxjs/lox` is a Node.js utility module that provides a streamlined environment for setting up and configuring Node.js applications, particularly those built with [Express.js](https://www.npmjs.com/package/express). It extends native JavaScript objects, integrates a configuration loader, and offers a suite of utilities for error handling, module loading, and unique ID generation.

## Features

- **Native Extensions**: Automatically extends native JavaScript types with additional functionality.
- **Configuration Management**: Loads application settings from `package.json` and environment variables, and merges them into a single configuration object.
- **Middleware Integration**: Bundles common [Express.js](https://www.npmjs.com/package/express) middleware for security, CORS, and more.
- **Debugging Support**: Includes a debugging utility for logging and development purposes.
- **Utility Functions**: Provides a collection of utility functions for loading JavaScript modules dynamically and generating Snowflake IDs.
- **Decorator Function**: Offers a `decorate` function to attach new properties or methods to the main module object.
- **Routing**: Integrates [@loxjs/express-router](https://www.npmjs.com/package/@loxjs/express-router) for advanced routing capabilities.

## Installation

Install the module with npm:

```sh
npm install @loxjs/lox
```

Or with Yarn:

```sh
yarn add @loxjs/lox
```

## Usage

Below are examples of how to use the `@loxjs/lox` module in your application.

### Basic Setup

```javascript
const lox = require('@loxjs/lox');

// Access the loaded configuration
const config = lox.config;

// Start an Express application
const app = lox.express();
app.use(lox.helmet()); // Security middleware
app.use(lox.cors()); // CORS middleware

// Define routes using ExpressRouter
const router = new lox.ExpressRouter();
router
  .get('/example')
  .controller(async (req) => {
    // Your GET controller logic here
  });
app.use('/api', router.end());

// Start the server
const port = config.port || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

### Using `decorate`

The `decorate` function allows you to attach new properties or methods to the `lox` object.

```javascript
// Example function to be decorated
function myCustomLogger(message) {
  console.log('Custom Log:', message);
}

// Decorate the lox object with the custom logger
lox.decorate('log', myCustomLogger);

// Use the decorated function
lox.log('This is a test log message.');
```

### Utility Functions

#### Loading JavaScript Modules

```javascript
// Dynamically load JavaScript modules from a specified directory
const modules = lox.utils.loadJSModules('/path/to/modules');

// Example usage of loaded modules
if (modules.myModule) {
  modules.myModule.doSomething();
}
```

#### Generating Snowflake IDs

```javascript
// Generate a Snowflake ID
const id = lox.utils.Snowflake.generate();
console.log(`Generated Snowflake ID: ${id}`);
```

## API Reference

### `lox.config`

An object containing the merged configuration from your `package.json` and environment variables.

### `lox.decorate(key, fn)`

Attaches a new property or method to the `lox` object.

- `key` (String): The key under which the function should be stored.
- `fn` (Function): The function to be attached.

### `lox.debug(namespace)`

Creates a [debug](https://www.npmjs.com/package/debug) instance with the specified namespace.

- `namespace` (String): The namespace for the debug instance.

### `lox.express()`

Creates and returns an [Express](https://www.npmjs.com/package/express) application instance.

### `lox.helmet()`

Returns the [Helmet](https://www.npmjs.com/package/helmet) middleware for securing Express applications by setting various HTTP headers.

### `lox.cors(options)`

Returns the [CORS](https://www.npmjs.com/package/cors) middleware configured with the provided options.

- `options` (Object): Configuration options for CORS middleware.

### `lox.ExpressRouter`

A constructor for creating a new [ExpressRouter](https://www.npmjs.com/package/@loxjs/express-router) instance for defining application routes.

### `lox.error`

An object containing error-handling utilities.

### `lox.utils`

An object containing utility functions such as [loadJSModules](https://www.npmjs.com/package/@loxjs/express-router) and [Snowflake](https://www.npmjs.com/package/@loxjs/snowflake).

#### `lox.utils.loadJSModules(directory)`

Dynamically loads JavaScript modules from the specified directory.

- `directory` (String): The path to the directory containing JavaScript modules.

#### `lox.utils.Snowflake`

An object with methods related to Snowflake ID generation.

##### `lox.utils.Snowflake.generate()`

Generates a unique Snowflake ID.

### `lox.cache`

An object to store cached data. This object is empty by default and can be used as needed.

### `lox.stores`

An object to store data stores. This object is empty by default and can be used to store instances of data stores or models.
