# @loxjs/url-join

`@loxjs/url-join` is a Node.js utility module that allows for the concatenation of URL segments into a single, normalized URL. It is a fork of the original [url-join](https://github.com/jfromaniello/url-join) module, modified to support `require` in addition to `import` for module inclusion, making it more accessible for a wider range of Node.js projects.

## Installation

To install the module, use npm or yarn as follows:

```sh
npm install @loxjs/url-join
```

or

```sh
yarn add @loxjs/url-join
```

## Usage

To use this module in your project, simply require it and then call the `urlJoin` function with the URL segments you want to join together:

```
const urlJoin = require('@loxjs/url-join');

const myUrl = urlJoin('http://example.com', 'path', 'to', 'resource');
console.log(myUrl);
// Output: http://example.com/path/to/resource
```

## Examples

Joining URL segments with query parameters:

```
const myUrl = urlJoin('http://example.com', 'search', '?query=node');
// Output: http://example.com/search?query=node
```

Handling trailing slashes:

```
const myUrl = urlJoin('http://example.com/', '/about/');
// Output: http://example.com/about/
```

Support for file protocol:

```
const myUrl = urlJoin('file:///', 'usr', 'local', 'bin');
// Output: file:///usr/local/bin
```

## Acknowledgements

We would like to express our gratitude to the author and contributors of the original [url-join](https://github.com/jfromaniello/url-join) module. `@loxjs/url-join` is built upon the solid foundation they provided, and this modification would not have been possible without their groundwork.

## Features

 - Normalizes URL paths by removing redundant slashes.
 - Correctly handles protocols and slashes specific to file URLs.
 - Supports both `require` and `import` statements for module inclusion.
 - Manages trailing slashes and query parameters in a URL.
 - Throws informative errors for non-string URL segments.

## API

### urlJoin(...args)

Joins all given URL segments and normalizes the result.

Arguments:

 - `...args` (String[]): An array of strings representing each segment of the URL.

Returns:

 - String: A string of the normalized URL.
