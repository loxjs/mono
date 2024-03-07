# @loxjs/load-js-modules

The `@loxjs/load-js-modules` module provides a convenient way to dynamically load JavaScript modules from a specified directory. It supports loading individual files as well as entire directories with an optional auto-load feature.

## Installation

```sh
npm install @loxjs/load-js-modules
```

Or with yarn:

```sh
yarn add @loxjs/load-js-modules
```

## Usage

To use this module, you first need to import it and then call the `loadJSModules` function with the appropriate options.

### Basic Example

```
const loadJSModules = require('@loxjs/load-js-modules');

// Load modules from a specific directory
const modules = loadJSModules({ dir: './path/to/modules', autoLoad: true });

// Use the loaded modules
modules.forEach((mod) => {
  console.log(`Module ${mod.moduleName} loaded`, mod.module);
});
```

### Advanced Usage

You can also load modules without automatically requiring them, which allows you to require them at a later point in your application.

```
const loadJSModules = require('@loxjs/load-js-modules');

// Load module information without auto-loading
const modules = loadJSModules({ dir: './path/to/modules', autoLoad: false });

// Require a specific module when needed
const specificModule = modules.find(mod => mod.moduleName === 'specificModule');
const loadedModule = specificModule.loadModule();

// Use the loaded module
console.log(`Module ${specificModule.moduleName} loaded`, loadedModule);
```

## API

### `loadJSModules(options)`

Loads JavaScript modules from the specified directory.

#### Options

- `dir` (String): The directory to load modules from. This can be a relative or absolute path.
- `autoLoad` (Boolean): If true, modules are automatically required when loaded. Defaults to false.

#### Returns

An array of module objects with the following properties:

- `autoLoad` (Boolean): The autoLoad option passed to loadJSModules.
- `fileExtname` (String): The file extension of the module.
- `fileName` (String): The name of the file.
- `filePath` (String): The full path to the module file.
- `moduleName` (String): The name of the module, derived from the file name.
- `loadModule` (Function): A function that, when called, will require the module.
- `module` (Object|null): The required module if autoLoad is true, otherwise null.
