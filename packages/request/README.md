# @loxjs/request

`@loxjs/request` is a Node.js module that provides a wrapper around the `axios` HTTP client to facilitate custom request and response interceptors, error handling, and automatic retry of certain network errors.

## Installation

Install the module with npm:

```sh
npm install @loxjs/request
```

Or with yarn:

```sh
yarn add @loxjs/request
```

## Usage

To use `@loxjs/request`, you need to create an HTTP client instance with optional configuration and interceptors.

```
const createHttpClient = require('@loxjs/request');

const httpClient = createHttpClient({
  baseURL: 'https://api.example.com', // Your API base URL
  timeout: 10000, // Request timeout in milliseconds
}, {
  requestInterceptor: (config) => {
    // Modify or augment the request configuration here
    // For example, adding an authorization token:
    config.headers.Authorization = `Bearer your_token_here`;
    return config;
  },
  responseInterceptor: (response) => {
    // Handle or transform the response data here
    // For example, unwrapping data:
    return response.data;
  },
  errorInterceptor: (error) => {
    // Handle errors or retry logic here
    // For example, logging the error:
    console.error(error.message);
    return Promise.reject(error);
  }
});

// Now you can use the httpClient to make requests
httpClient.get('/users')
  .then(users => {
    console.log(users);
  })
  .catch(error => {
    console.error('An error occurred while fetching users', error);
  });
```

### Error Handling

The module enhances error objects with additional properties and a `retryable` flag for certain network errors that are considered retryable.

```
// Error handling example
httpClient.get('/non-existent-endpoint')
  .catch(error => {
    if (error.retryable) {
      // Implement retry logic
      console.log('This error is retryable, consider implementing retry logic here.');
    }
    console.error('HTTP Request failed:', error.message);
  });
```

### Custom Interceptors

You can add custom interceptors for requests, responses, and errors. Below is an example showing how to add a request interceptor.

```
// Custom request interceptor example
httpClient.interceptors.request.use((config) => {
  // Add custom logic before request is sent
  console.log('Request sent with config:', config);
  return config;
});
```

And here is how you might add a response interceptor.

```
// Custom response interceptor example
httpClient.interceptors.response.use((response) => {
  // Any status code within the range of 2xx causes this function to trigger
  console.log('Response received:', response);
  return response;
}, (error) => {
  // Any status codes outside the range of 2xx cause this function to trigger
  console.error('Response error:', error);
  return Promise.reject(error);
});
```
