# @loxjs/config

A configuration management library for Node.js applications, `@loxjs/config` provides a simple and fluent API for getting and setting configuration values, bulk updates, and merging configurations with defaults.

## Features

- Easy configuration value retrieval with dot notation
- Set individual configuration values or in bulk
- Merge configurations with default values
- Fluent API for checking equality or inequality of configuration values

## Installation

Install `@loxjs/config` using npm:

```sh
npm install @loxjs/config
```

Or using yarn:

```sh
yarn add @loxjs/config
```

## Usage

Here's a quick overview of how you can use `@loxjs/config`.

### Importing

First, import and initialize the module:

```
const Config = require('@loxjs/config');

const config = new Config({
  // Initial configuration values
});
```

### Setting Configuration Values

To set a configuration value:

```
config.set('path.to.setting', 'value');
To set multiple configuration values at once:

config.bulkSet({
  'path.to.setting': 'value',
  'another.path.to.setting': 'another value'
});
```

### Getting Configuration Values

To get a configuration value, use:

```
const value = config.get('path.to.setting');
```

To get a configuration value with a `defaultValue`, `defaultValue` is returned when configuration value is `undefined`:

```
const value = config.get('path.to.setting', 'defaultValue');
```

To get a configuration value and set it if it doesn't exist:

```
const value = config.geset('path.to.setting', 'defaultValue');
```

### Checking Configuration Values

To check if a configuration value equals a specific value:

```
const isEqual = config.eq('path.to.setting', 'value');
```

To check if a configuration value does not equal a specific value:

```
const isNotEqual = config.ne('path.to.setting', 'value');
```

### Merging Configuration Values

To merge a set of default values with existing configuration:

```
const mergedConfig = config.merge('path.to.setting', {
  defaultKey: 'defaultValue',
  anotherDefaultKey: 'anotherDefaultValue'
});
```
