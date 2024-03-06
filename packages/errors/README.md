# @loxjs/errors

`@loxjs/errors` is a Node.js module designed to create a standardized error handling system. It extends the native JavaScript `Error` object, providing additional properties such as internal and HTTP status codes, and integrates with Express.js for handling errors in web applications.

## Features

 - Extends the native Error object with additional properties and methods.
 - Provides a unified way to handle different types of errors.
 - Allows for internationalization (i18n) of error messages.
 - Supports custom error details and data payloads.
 - Integrates with Express.js to handle errors in HTTP requests.
 - Can generate both detailed and simplified error JSON representations.

## Installation

Install the package with npm:

```sh
npm install @loxjs/errors
```

Or with yarn:

```sh
yarn add @loxjs/errors
```

## Usage

### Basic Error Creation

```
const Errors = require('@loxjs/errors');

// Create a new error
const myError = new Errors('MyCustomError', {
  message: 'Something went wrong',
  httpCode: 400,
  detail: 'Detailed information about the error',
  data: { additional: 'data' }
});

console.log(myError.toJSON()); // Outputs the error as a JSON object
```

### Express.js Middleware

```
const express = require('express');
const app = express();
const { expressError } = require('@loxjs/errors');

// Use the middleware in your Express application
app.use(expressError({
  isPROD: process.env.NODE_ENV === 'production', // Use true to hide detailed error info in production
  errHandler: (errJSON) => {
    // Optional: A function to handle the error, e.g. logging it
    console.error(errJSON);
  },
  i18n: (code) => {
    // Optional: A function for internationalization
    return code; // Replace with actual i18n implementation
  }
}));

app.get('/', (req, res) => {
  throw new Error('Oops!'); // This will be caught by the expressError middleware
});

app.listen(3000);
```

### Error Wrapper

```
const { errorWrapper } = require('@loxjs/errors');

// Wrap native errors or custom error codes
const wrappedError = errorWrapper('CustomErrorCode', {
  message: 'Custom error message',
  httpCode: 500
});

console.log(wrappedError.toString()); // Outputs the error as a JSON string
```

### Internationalization

```
const { setI18n } = require('@loxjs/errors');

// Set an internationalization function
setI18n((errCode) => {
  const i18nMessages = {
    'CustomErrorCode': 'Translated custom error message',
    // Add more error code translations here
  };
  return i18nMessages[errCode] || errCode;
});
```

## API Reference

### Errors Class

 - new Errors(code, options)
   - code (String): The error code.
   - options (Object): Additional options for the error.
     - internalCode (String): Internal error code for debugging.
     - httpCode (Number): HTTP status code associated with the error.
     - message (String): Human-readable description of the error.
     - fileName (String): Name of the file where the error occurred.
     - lineNumber (Number): Line number where the error occurred.
     - stack (String): Stack trace.
     - detail (Any): Additional details about the error.
     - data (Any): Additional data payload.

### errorWrapper Function

 - errorWrapper(loxErrorCodeOrNativeErrorEntity, optionsOrErrorMessage)
   - Wraps a custom error code or native error entity into a standardized error object.
   - loxErrorCodeOrNativeErrorEntity (String|Error): The error code or native error object.
   - optionsOrErrorMessage (Object|String): Additional options for the error or a message string.

### expressError Middleware

 - expressError(options)
   - options (Object): Configuration options for the middleware.
     - isPROD (Boolean): Whether to run in production mode, which affects error detail visibility.
     - errHandler (Function): A function to handle the error, such as logging.
     - i18n (Function): A function for internationalizing error messages.
