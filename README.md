# @loxjs

## Environment Setup Instructions

To ensure the proper functioning of this project, it is required that you set up environment variables before running the application. Follow the steps below to configure your environment:

### Creating the `.env` File

1. In the root directory of the project, create a file named `.env` if it does not already exist.
2. Open the `.env` file in a text editor of your choice.
3. Add the following line to the `.env` file to define the NPM_TOKEN:

```
NPM_TOKEN=your-npm-token-here
```

Replace `your-npm-token-here` with the actual token provided to you.

### Obtaining an NPM Token

If you do not already have an NPM token, you can obtain one by logging into your NPM account and creating a new access token. Please refer to the official NPM documentation for detailed instructions: [Creating and viewing access tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens).

### Important Notes

Do not share your `.env` file or the NPM_TOKEN with others. Treat it as sensitive information.
The `.env` file should not be committed to version control. Ensure that it is listed in your .gitignore file to prevent accidental submission.

Once you have configured your `.env` file with the appropriate NPM_TOKEN, you can proceed with running the project as per the provided instructions.


## Managing Dependencies with Yarn Workspaces

### Adding Dependencies to Individual Workspaces

#### Specify Workspace in the Command

```bash
yarn workspace <npm-module-name> add <dependency-name>
```

##### Examples

```
# Add dependency
yarn workspace @loxjs/lox add express

# Add dev dependency
yarn workspace @loxjs/lox add lodash -D
```

This command will add the dependency directly to the specified workspace without needing to change directories.

### Adding Shared Dependencies to the Monorepo Root

There are scenarios where you might want to add dependencies to the root of your monorepo, especially if they are shared tools or configurations like linters, formatters, or typescript.

#### Adding Regular (Production) Dependencies

To add a shared dependency that will be used across workspaces:

```bash
yarn add <dependency-name> -W
```

#### Adding Development Dependencies

To add a shared development dependency:

```bash
yarn add <dependency-name> --dev -W
```

The `-W` flag, or `--ignore-workspace-root-check`, is necessary to add the dependency to the root package.json file.

### Examples

#### Adding a Dependency to a Specific Workspace

To add React to a workspace named web-app:

```bash
yarn workspace web-app add react
```

#### Adding a Shared Development Dependency to the Root

To install ESLint as a development dependency at the root level:

```bash
yarn add eslint --dev -W
```

### Notes

 - Always ensure that the dependencies added to the root are intended for use across multiple workspaces.
 - Adding a dependency to the root when it is only needed for a single workspace can lead to unnecessary bloat and potential version conflicts.
 - Keep your root package.json dependencies minimal and focused on tools and configurations that benefit the entire project.
 - Regularly audit your dependencies to maintain a clean and efficient project structure.


## Script for Updating Module Version

The `update-module-version` script in package.json is designed to update the version of a module within a Node.js project and to create a Git tag for that version.

### Usage

```bash
npm run update-module-version <module-name> <module-version> [--help]
```

Parameters

  - <module-name>: The name of the module you wish to update.
  - <module-version>: The specific version to set for the module, which must follow the semver (Semantic Versioning) format. Or one of 'major', 'minor', or 'patch', which will be used to automatically increment the version number.

Options
  - --help: Display the help information and exit the script.

Examples

  - To set the version of module my-module to 1.2.3:

```bash
npm run update-module-version my-module 1.2.3
```

  - To automatically increment the minor version of module my-module:

```bash
npm run update-module-version my-module minor
```

  - To display the help information:

```bash
npm run update-module-version --help
```

Notes

  - Ensure you are in the root directory of your project before using this script and that you have the necessary permissions to modify the package.json of the module and to create Git tags.
  - The script will automatically update the package.json file based on the provided parameters and attempt to create a new Git tag.
  - If the provided version is invalid or if the new version is not greater than the current version, the script will throw an error and exit.


## Script for Publishing Module

The `publish-module` script in package.json is a Node.js automation tool designed to streamline the process of publishing individual npm modules from a monolithic repository (monorepo). It compiles the module's source code using `Babel`, copies necessary files such as `README.md` and `package.json` to the build directory, and then publishes the module to npm.

### Usage

```bash
npm run publish-module <module-name> [--help]
```

Replace `<module-name>` with the actual name of the module you want to publish. Make sure you run this command from the root directory of current monorepo.

Parameters

  - <module-name>: The name of the module you wish to publish.

Options
  - --help: Display the help information and exit the script.

Examples

  - To publish module my-module:

```bash
npm run publish-module my-module
```

  - To display the help information:

```bash
npm run publish-module --help
```

### Steps Performed by the Script

The publish-module script automates the following tasks:

1. Code Transpilation: Transpiles the module's ES6+ code from the `src` to the `lib` directory using Babel.

2. File Preparation: Copies the `README.md` file (if present) and the `package.json` file to the `lib` directory. It also updates the `package.json` file with the repository's git remote URL.

3. NPM Publication: Publishes the module to npm using the credentials of the currently logged-in npm user.

### Error Handling

If the script encounters an error during execution, it will display an error message in the console. Review the error details, ensure all prerequisites are met, and try running the script again.


## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2024-present, Zen Li
