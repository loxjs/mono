# @loxjs/password

`@loxjs/password` is a Node.js module designed for password strength checking and random password generation. It provides a simple interface to evaluate the complexity of a given password and to generate a strong, random password based on specified criteria.

## Installation

```sh
npm install @loxjs/password
```

Or with yarn:

```sh
yarn add @loxjs/password
```

## Usage

This module exports two main functions: `checkStrength` for checking the password strength and `random` for generating a random password.

### Checking Password Strength

The `checkStrength` function evaluates the complexity of a password by analyzing its composition of numbers, uppercase letters, lowercase letters, and special characters.

```
const { checkStrength } = require('@loxjs/password');

// Check the strength of a password
const password = 'YourP@ssw0rd';
const strength = checkStrength(password, 7); // Minimum length is 7

console.log(strength); // Output will be a number between 0 (weak) to 4 (strong)
```

The function returns a number representing the strength level:

- 0: Weak (less than minimum length)
- 1: Weak (only one type of character)
- 2: Moderate (two types of characters)
- 3: Strong (three types of characters)
- 4: Very Strong (all four types of characters)

### Generating a Random Password

The `random` function generates a random password that includes a mix of numbers, lowercase and uppercase letters, and special characters.

```
const { random } = require('@loxjs/password');

// Generate a simple random password
const passwordLength = 10; // Specify the length of the password
const newPassword = random(passwordLength);

console.log(newPassword); // Output will be a random password
```

## API

### `checkStrength(password, minLength)`

Checks the strength of the given password.

- `password` (String): The password to check.
- `minLength` (Number): The minimum length for the password to be considered not weak.

### `random(length)`

Generates a random password.

- `length` (Number): The desired length of the generated password.
