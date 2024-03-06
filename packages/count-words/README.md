# @loxjs/count-words

`@loxjs/count-words` is a simple utility function for Node.js that counts the number of words in a given string, treating continuous sequences of English letters, numbers, and symbols as a single word, and removing punctuation and whitespace.

## Features

- Counts words by treating continuous sequences of English alphanumeric characters and symbols as single words
- Removes punctuation and excess whitespace, including spaces, tabs, and newlines
- Handles multilingual text by stripping non-English punctuation and symbols

## Installation

Install `@loxjs/count-words` using npm:

```sh
npm install @loxjs/count-words
```

Or using yarn:

```sh
yarn add @loxjs/count-words
```

## Usage

To use `@loxjs/count-words` in your project:

```
const countWords = require('@loxjs/count-words');

const myString = "Hello, world! This is a test string.";
const wordCount = countWords(myString);

console.log(wordCount); // Output will be the number of words in `myString`
```

## Functionality

The countWords function performs the following steps:

1. Validates that the input is a non-empty string.
2. Replaces all whitespace characters (including spaces, tabs, and newlines) with a placeholder symbol.
3. Treats continuous sequences of English alphanumeric characters and symbols as single words by replacing them with a unique character.
4. Strips all punctuation from the string.
5. Counts the remaining characters in the string, which correspond to the number of words.
