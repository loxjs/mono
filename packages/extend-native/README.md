# @loxjs/extend-native

The `@loxjs/extend-native` module extends native JavaScript objects with additional utility methods. This module is designed to enhance the functionality of native objects such as `Array`, `Date`, `Number`, `String`, and `Object` by adding convenient accessors and methods.

## Installation

```sh
npm install @loxjs/extend-native
```

Or with yarn:

```sh
yarn add @loxjs/extend-native
```

## Usage

After installation, import the module function and call it to extend the prototypes:

```
const extendNative = require('@loxjs/extend-native');
extendNative();
```

## Extensions

### BigInt

Adds a `toJSON` method to `BigInt` for proper serialization.

**Example:**

```
const bigIntValue = BigInt(123456789012345678901234567890);
console.log(JSON.stringify({ key: bigIntValue })); // '{"key":"123456789012345678901234567890"}'
```

### Array

#### first

Access the first element or find the first element that matches a filter function.

**Example:**

```
const array = [1, 2, 3, 4];
console.log(array.first); // 1
console.log(array.first(x => x > 2)); // 3
```

#### last

Access the last element or find the last element that matches a filter function.

**Example:**

```
console.log(array.last); // 4
console.log(array.last(x => x < 4)); // 3
```

#### before

Find the element before the one that matches a filter function.

**Example:**

```
console.log(array.before(x => x === 3)); // 2
```

#### after

Find the element after the one that matches a filter function.

**Example:**

```
console.log(array.after(x => x === 2)); // 3
```

#### maxIndex

Get the index of the last element in the array.

**Example:**

```
console.log(array.maxIndex); // 3
```

### Date

#### timestamp

Get the timestamp of the date.

**Example:**

```
const date = new Date();
console.log(date.timestamp); // 1587754887956
```

#### unixTimestamp

Get the Unix timestamp of the date.

**Example:**

```
console.log(date.unixTimestamp); // 1587754887
```

#### Comparison Accessors (`$gt`, `$gte`, `$lt`, `$lte`, `$eq`)

Compare two dates.

**Example:**

```
const date1 = new Date('2020-04-25');
const date2 = new Date('2020-04-26');
console.log(date1.$lt(date2)); // true
```

### Number

Comparison Accessors (`$gt`, `$gte`, `$lt`, `$lte`, `$eq`)

Compare two numbers.

**Example:**

```
const number = 10;
console.log(number.$gt(5)); // true
```

### String

#### $contains

Check if the string contains a given substring.

**Example:**

```
const string = 'hello world';
console.log(string.$contains('world')); // true
```

#### rightSubstr

Get the substring from the right side of the string with a given length.

**Example:**

```
console.log(string.rightSubstr(5)); // 'world'
```

### Object

#### $has

Check if the object has a property with a given key.

**Example:**

```
const object = { key: 'value' };
console.log(object.$has('key')); // true
```
