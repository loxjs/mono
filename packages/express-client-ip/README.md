# @loxjs/express-client-ip

`@loxjs/express-client-ip` is an npm module for obtaining a client's IP address in Express.js applications. It accounts for requests forwarded by proxy servers, such as Caddy, Nginx, Apache, CloudFlare, etc., and attempts to extract the original client IP address from various HTTP header fields.

## Features

 - Retrieves IP addresses from HTTP headers like `X-Real-IP`, `X-Forwarded-For`, `CF-Connecting-IP`, and others.
 - Compatible with both IPv4 and IPv6 addresses.
 - Provides middleware function for easy integration into Express.js applications.
 - Automatically handles scenarios involving multiple proxy servers.
 - Returns the client's IP address for a request or `null` if undetermined.

## Installation

Install using npm:

```sh
npm install @loxjs/express-client-ip
```

Or with yarn:

```sh
yarn add @loxjs/express-client-ip
```

## Usage

### As Middleware

In your Express.js application, you can use `@loxjs/express-client-ip` as middleware to set the `req.clientIp` property on every request.

```
const express = require('express');
const getClientIP = require('@loxjs/express-client-ip');

const app = express();

// Apply middleware
app.use(getClientIP.middleware);

app.get('/', (req, res) => {
  res.send(`Your IP is: ${req.clientIp}`);
});

app.listen(3000);
```

### As a Function

You can also directly call the `getIP` function to obtain the client's IP address.

```
const getClientIP = require('@loxjs/express-client-ip');

app.get('/some-path', (req, res) => {
  const ip = getClientIP(req);
  res.send(`Your IP is: ${ip}`);
});
```

## API Reference

### getIP Function

 - `getIP(req)`: Extracts the client IP address from the request object.
   - req: The request object from Express.js.

### getIP.middleware Function

 - `getIP.middleware`: An Express.js middleware that adds the client's IP address to the `req.clientIp` property.
