# @loxjs/sleep

A simple promise-based sleep function for Node.js, `@loxjs/sleep` provides a straightforward way to introduce a delay in your async functions or promise chains.

## Installation

Install the module with npm:

```bash
npm install @loxjs/sleep
```

Or with yarn:

```bash
yarn add @loxjs/sleep
```

## Usage

To use `@loxjs/sleep`, simply require it in your module and call it with an amount of time in milliseconds.

```
const sleep = require('@loxjs/sleep')

// In an async function
async function example() {
    console.log('Sleeping for 2 seconds...')
    await sleep(2000); // Sleeps for 2000 milliseconds (2 seconds)
    console.log('Woke up after 2 seconds!')
}

// Immediately-Invoked Function Expression (IIFE) with async
(async () => {
    console.log('Sleeping for 3 seconds...')
    await sleep(3000); // Sleeps for 3000 milliseconds (3 seconds)
    console.log('Woke up after 3 seconds!')
})()
```

## API

`@loxjs/sleep` exports a single function:

### sleep(time)
Returns a Promise that resolves after the specified time.

#### Parameters

 - `time` (Number) - The amount of time to sleep in milliseconds.

#### Returns

 - `Promise` - A Promise that resolves after the specified amount of time.

## Example

```
const sleep = require('@loxjs/sleep')

async function fetchData() {
    // Simulate a delay in fetching data
    console.log('Fetching data in 1 second...')
    await sleep(1000)
    console.log('Data fetched!')
}

fetchData()
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any changes.

Enjoy using `@loxjs/sleep`!