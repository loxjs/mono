# @loxjs/extend-native

`@loxjs/extend-native` is a JavaScript module designed to extend the prototypes of native JavaScript objects such as `Array`, `Date`, `Number`, `String`, and `Object`. By extending these prototypes, `@loxjs/extend-native` adds additional methods and properties that can be used in a more convenient and expressive way.

## Installation

To install the `@loxjs/extend-native` module, run the following command using npm:

```sh
npm install @loxjs/extend-native
```

Or with yarn:

```sh
yarn add @loxjs/extend-native
```

## Usage

Before you can use the extended methods and properties, you must first require and execute the module to mount the extensions onto the native prototypes:

```js
const mountExtendNative = require('@loxjs/extend-native');
mountExtendNative();
```

Once mounted, the new methods and properties will be available on all instances of the extended objects.

## API Reference

Below is a list of the extended prototypes and their additional methods and properties:

### Array Extensions

#### Properties

- `first`: Get the first element of the array.
- `last`: Get the last element of the array.
- `maxIndex`: Get the index of the last element in the array.

#### Methods

- `$first(filter)`: Find the first element that matches the provided filter function.
- `$last(filter)`: Find the last element that matches the provided filter function.
- `$before(filter)`: Find the element before the first element that matches the provided filter function.
- `$after(filter)`: Find the element after the first element that matches the provided filter function.

### Date Extensions

#### Properties

- `timestamp`: Get the numeric timestamp equivalent of the date.
- `unixTimestamp`: Get the Unix timestamp (seconds since the Unix epoch).

#### Methods

- `$gt(date)`: Check if the date is greater than another date.
- `$gte(date)`: Check if the date is greater than or equal to another date.
- `$lt(date)`: Check if the date is less than another date.
- `$lte(date)`: Check if the date is less than or equal to another date.
- `$eq(date)`: Check if the date is equal to another date.

### Number Extensions

#### Methods

- `$gt(num)`: Check if the number is greater than another number.
- `$gte(num)`: Check if the number is greater than or equal to another number.
- `$lt(num)`: Check if the number is less than another number.
- `$lte(num)`: Check if the number is less than or equal to another number.
- `$eq(num)`: Check if the number is equal to another number.

### String Extensions

#### Methods

- `$contains(str)`: Check if the string contains another string.
- `$rightSubstr(len)`: Get the substring from the right side of the string with the specified length.

### Object Extensions

#### Methods

- `$has(key)`: Check if the object has a property with the specified key.

## Examples

### Array Examples

```js
const array = [1, 2, 3, 4, 5];

console.log(array.first); // Output: 1
console.log(array.last); // Output: 5
console.log(array.maxIndex); // Output: 4

console.log(array.$first(x => x > 1)); // Output: 2
console.log(array.$last(x => x < 5)); // Output: 4
console.log(array.$before(x => x === 3)); // Output: 2
console.log(array.$after(x => x === 3)); // Output: 4
```

### Date Examples

```js
const date1 = new Date('2024-01-01');
const date2 = new Date('2024-01-02');

console.log(date1.timestamp); // Output: 1672531200000
console.log(date1.unixTimestamp); // Output: 1672531200

console.log(date1.$gt(date2)); // Output: false
console.log(date1.$gte(date2)); // Output: false
console.log(date1.$lt(date2)); // Output: true
console.log(date1.$lte(date2)); // Output: true
console.log(date1.$eq(date2)); // Output: false
```

### Number Examples

```js
const number = 42;

console.log(number.$gt(100)); // Output: false
console.log(number.$gte(42)); // Output: true
console.log(number.$lt(100)); // Output: true
console.log(number.$lte(42)); // Output: true
console.log(number.$eq(42)); // Output: true
```

### String Examples

```js
const string = "Hello, World!";

console.log(string.$contains("World")); // Output: true
console.log(string.$rightSubstr(6)); // Output: "World!"
```

### Object Examples

```js
const object = { a: 1, b: 2 };

console.log(object.$has("a")); // Output: true
console.log(object.$has("c")); // Output: false
```

## Notes

- Extending native prototypes can be potentially problematic, especially if the code is being used in combination with other libraries or in larger codebases where similar extensions might be made. It can lead to conflicts and unexpected behavior.
- It is generally recommended to avoid extending native prototypes and instead use utility functions or ES6 classes that extend native objects in a non-intrusive way.
