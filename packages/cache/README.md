# @loxjs/cache

`@loxjs/cache` is a Node.js module that provides a simple caching layer on top of Redis. It allows for easy setting and retrieval of JSON objects with optional expiration settings.

## Features

- Simple key-value storage
- Automatic JSON serialization and deserialization
- Optional key prefixing
- Configurable expiration for cached items

## Installation

Install the module with npm:

```bash
npm install @loxjs/cache --save
```

Or with yarn:

```bash
yarn add @loxjs/cache
```

## Usage

Here's how to use `@loxjs/cache` in your project.

### Initializing

First, require and initialize the module:

```
const Cache = require('@loxjs/cache');

const cache = new Cache({
  redis: {
    // Redis configuration options
  },
  prefix: 'myPrefix', // optional key prefix
  exType: 'EX',       // default expiration type ('EX' for seconds)
  exDuration: 3600    // default expiration duration (in seconds)
});
```

### Setting a Value

To cache a value with an optional expiration:

```
cache.set('myKey', { my: 'value' }, {
  exType: 'EX',       // 'EX' for seconds, 'PX' for milliseconds
  exDuration: 60      // expiration time in seconds
});
```

If `exType` and `exDuration` are not specified, the defaults provided during initialization will be used.

### Getting a Value

To retrieve a value from the cache:

```
cache.get('myKey').then(value => {
  console.log(value); // outputs: { my: 'value' }
});
```
