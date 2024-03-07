# @loxjs/snowflake

`@loxjs/snowflake` is a Node.js module that generates unique, distributed, time-sorted identifiers using the Twitter Snowflake algorithm. Snowflake IDs are composed of a timestamp, a data center identifier, a worker identifier, and a sequence number.

## Features

- Generates unique IDs in a distributed environment.
- IDs are time-based and sorted.
- Can extract timestamp, data center ID, and worker ID from generated IDs.
- High-performance ID generation (over 1 million IDs per second).

## Installation

Install the module with npm:

```sh
npm install @loxjs/snowflake
```

Or with yarn:

```sh
yarn add @loxjs/snowflake
```

## Usage

To use `@loxjs/snowflake`, create a new instance of the `Snowflake` class with optional configuration parameters.

```
const Snowflake = require('@loxjs/snowflake');

// Create a Snowflake ID generator with custom settings
const snowflake = new Snowflake({
  epoch: 1546272000000, // Custom epoch start time (default is 2019/1/1)
  dataCenterId: 1, // Data center identifier
  workerId: 1, // Worker identifier
  sequence: 0 // Initial sequence number
});

// Generate a Snowflake ID
const id = snowflake.nextId();
console.log(`Generated Snowflake ID: ${id}`);
```

### Validating Snowflake IDs

The module provides a method to validate if a given value is a valid Snowflake ID.

```
// Check if a given value is a valid Snowflake ID
const isValid = snowflake.isId(id);
console.log(`Is valid Snowflake ID: ${isValid}`);
```

### Example: Handling ID Generation

```
try {
  const id = snowflake.nextId();
  console.log(`Generated Snowflake ID: ${id}`);
} catch (error) {
  console.error('Error generating Snowflake ID:', error);
}
```
