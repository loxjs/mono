# @loxjs/express-router

The `@loxjs/express-router` module provides a fluent and convenient way to define and manage routes in Express.js applications. It extends the routing capabilities with advanced response handling, allowing for a variety of response types and behaviors.

## Features

- Fluent and chainable API for defining routes.
- Support for all common HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD).
- Simplified controller association with support for both single and multiple controllers.
- Extended response handling within controllers, including:
  - Custom HTTP status codes.
  - HTTP response headers.
  - Redirects and location headers.
  - Response type formatting (HTML, XML, JavaScript, CSV).
  - Raw data responses without default packaging.
- Easy integration with existing Express.js applications.

## Installation

```sh
npm install @loxjs/express-router
```

Or with yarn:

```sh
yarn add @loxjs/express-router
```

## Usage

Import and use `@loxjs/express-router` to define routes in your Express.js application:

```javascript
// router.js

const ExpressRouter = require('@loxjs/express-router');
const router = new ExpressRouter();
```

Define routes using the fluent API and attach controllers:

```
router
  .get('/example')
  .controller(async (req) => {
    // Your GET controller logic here
  });

router
  .post('/example')
  .controller(async (req) => {
    // Your POST controller logic here
  });

module.exports = router
```

Once all routes are defined, call `end()` to finalize and use them in your Express.js application:

```javascript
const express = require('express');
const router = require('./router.js');

const app = express();

app.use('/api', router.end());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## API Reference

### `path(options)`

Defines a new path for a route.

- `options`: An object with the following properties:
  - `method`: The HTTP method (default: `'get'`).
  - `path`: The path for the route (default: `'/'`).

### `controller(controller)`

Associates a controller with the current path.

- `controller`: A function or an array of functions to handle the route.

### `end()`

Finalizes the route definitions and returns the Express router.

### HTTP Method Shortcuts

The following methods are shortcuts for `path()` with the method preset:

- `get(path)`
- `post(path)`
- `put(path)`
- `patch(path)`
- `delete(path)`
- `head(path)`

### use(callback)

Uses a middleware function or an array of functions.

- `callback`: A middleware function or an array of middleware functions to apply.

## Extended Controller Logic

The `generate` method within the `ExpressRouter` class provides several extended response handling features:

- `Custom HTTP Status Codes`: Controllers can specify custom HTTP status codes for the response.
- `HTTP Response Headers`: Controllers can append custom headers to the response.
- `Redirects`: Controllers can trigger HTTP redirects using `req.routerRedirect`.
- `Location Headers`: Controllers can set the `Location` header using `req.routerLocation`.
- `Response Type Formatting`: Controllers can specify the response type (HTML, XML, JavaScript, CSV) using `req.routerResponseType`.
- `Raw Data Responses`: Controllers can bypass default data packaging by setting `req.responseRawData` to `true` or by including `__disablePackagingData` in the response object.
- `File Downloads`: For CSV responses, controllers can specify a filename, which prompts the browser to download the file.

These extended features allow for more granular control over the HTTP response from within your controllers.

### Default Response Data Format

By default, responses are sent as JSON with the following format:

```javascript
{
  "code": 200,
  "data": "your data here" // If `.controller()` returns data
}
```

If `.controller()` returns void or undefined, responses are sent as JSON with the following format:

```javascript
{
  "code": 200
}
```

### Setting a Single Cookie

To set a cookie, you can use the `req.setCookie` object within your request handler. The `req.setCookie` object must contain the `name` and `value` properties.

- `req.setCookie.name` (String): The name of the cookie. This field is required.
- `req.setCookie.value` (String): The value of the cookie. This field is required.
- `req.setCookie.options` (Object): Optional settings for the cookie, such as `maxAge`.

#### Example

```javascript
router
  .post('/set-cookie')
  .controller((req) => {
    req.setCookie = {
      name: 'sessionId',
      value: 'abc123',
      options: { maxAge: 1000 * 60 * 60 * 24 * 30 } // Expires in 30 days
    };

    // ...additional logic...

    res.end('Cookie set');
  });
```

### Setting Multiple Cookies

To set multiple cookies at once, you can assign an array of cookie objects to `req.setCookies`.

- `req.setCookies` (Array): An array where each element is an object with `name`, `value`, and optional `options` properties.

#### Example

```javascript
router
  .post('/set-multiple-cookies')
  .controller((req) => {
    req.setCookies = [
      {
        name: 'sessionId',
        value: 'abc123',
        options: { maxAge: 1000 * 60 * 60 * 24 * 30 }
      },
      {
        name: 'preferences',
        value: 'darkmode',
        // No options provided, default settings will be used
      }
    ];

    // ...additional logic...

    res.end('Multiple cookies set');
  });
```

### Clearing a Single Cookie

To clear a single cookie, assign the cookie name to `req.clearCookie`.

- `req.clearCookie` (String): The name of the cookie to clear.

#### Example

```javascript
router
  .post('/clear-cookie')
  .controller((req) => {
    req.clearCookie = 'sessionId';

    // ...additional logic...

    res.end('Cookie cleared');
  });
```

### Clearing Multiple Cookies

To clear multiple cookies, provide an array of cookie names to `req.clearCookies`.

- `req.clearCookies` (Array): An array of strings, where each string is the name of a cookie to clear.

#### Example

```javascript
router
  .post('/clear-multiple-cookies')
  .controller((req) => {
    req.clearCookies = ['sessionId', 'preferences'];

    // ...additional logic...

    res.end('Multiple cookies cleared');
  });
```

### Handling res.location

To set the `Location` header for HTTP redirection:

```javascript
router
  .get('/example')
  .controller((req) => {
    req.routerLocation = '/new-location';
    req.routerHTTPStatus = 302; // Optional: Set a custom HTTP status code
  });
```

### Handling res.redirect

To redirect the request to a different URL:

```
router
  .get('/example')
  .controller((req) => {
    req.routerRedirect = '/redirect-url';
  });
```

### Custom HTTP Response Headers

To add custom response headers:

```javascript
router
  .get('/example')
  .controller((req) => {
    req.routerResponseHeaders = [
      ['X-Custom-Header', 'HeaderValue'],
      ['Another-Header', 'AnotherValue']
    ];
  });
```

### Returning HTTP Error Codes

To return a specific HTTP status code, possibly with data:

```javascript
router
  .get('/error')
  .controller((req) => {
    req.routerHTTPStatus = 500; // Set the HTTP status code
    return { message: 'Internal Server Error' };
  });
```

### Returning HTML

To return HTML content:

```javascript
router
  .get('/html')
  .controller((req) => {
    req.routerResponseType = 'plainHTML';
    return '<h1>Welcome to the HTML page</h1>';
  });
```

### Returning XML

To return XML content:

```javascript
router
  .get('/xml')
  .controller((req) => {
    req.routerResponseType = 'xml';
    return '<note><body>This is a note</body></note>';
  });
```

### Returning JavaScript Code

To return JavaScript code:

```javascript
router
  .get('/script.js')
  .controller((req) => {
    req.routerResponseType = 'js';
    return 'alert("Hello, world!");';
  });
```

### Returning CSV

To return CSV content and prompt a file download:

```javascript
router
  .get('/csv')
  .controller((req) => {
    req.routerResponseType = 'csv';
    req.filename = 'example.csv';
    return 'id,name\n1,Alice\n2,Bob';
  });
```

### Disabling Data Packaging

To return raw data without the default JSON packaging:

```javascript
router
  .get('/rawdata')
  .controller((req) => {
    req.responseRawData = true;
    return 'Raw data response';
  });
```
