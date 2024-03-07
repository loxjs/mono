# @loxjs/lox

`@loxjs/lox` is a Node.js module that provides a configuration and utility framework for Node.js applications. It gathers information from the environment and the `package.json` file to create a unified configuration object. Additionally, it allows you to attach utility functions and maintain a cache and store registry for your application.

## Installation

```sh
npm install @loxjs/lox
```

Or with yarn:

```sh
yarn add @loxjs/lox
```

## Usage

To use this module, you first need to require it in your Node.js application. The module exports an object with a preloaded configuration, utilities, cache, and stores that you can directly use or extend as needed.

### Basic Example

```
const lox = require('@loxjs/lox');

// Access the configuration
console.log('The current environment is:', lox.config.env);

// Add a utility function
lox.decorate('greet', function(name) {
  console.log(`Hello, ${name}!`);
});

// Use the utility function
lox.greet('Alice'); // Output: Hello, Alice!
```

### Advanced Usage

You can also extend the `utils`, `cache`, and `stores` objects with your own properties and methods.

```
// Extend the utils object
lox.utils.calculateSum = function(a, b) {
  return a + b;
};

// Use the extended utils
console.log('The sum is:', lox.utils.calculateSum(5, 3)); // Output: The sum is: 8

// Add to the cache
lox.cache.userSession = { userId: '1234', token: 'token123' };

// Retrieve from the cache
console.log('Cached user session:', lox.cache.userSession);
```

## API

The `@loxjs/lox` module provides the following properties and methods:

- `config`: A configuration object that contains settings derived from the Node.js environment and package.json.
- `decorate(key, fn)`: A method to add utility functions to the lox object.
- `utils`: An object that can be extended with utility functions.
- `cache`: An object that can be used as a simple in-memory cache.
- `stores`: An object that can be used to maintain references to data stores.
