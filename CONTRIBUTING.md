# Contributing to loxjs/mono

🚀 Thank you for taking the time to contribute to the `@loxjs` namespace modules managed with Lerna and Yarn! 🚀

This repository is a monorepo that contains multiple npm packages under the `@loxjs` namespace. We use Lerna for managing multi-package repositories and Yarn for dependencies.

## How to Contribute

### Reporting Bugs or Issues

If you find a bug or have an issue with any of the packages in this repository:

1. Go to the [Issues](https://github.com/loxjs/mono/issues) section of the `loxjs/mono` repository.
2. Check if the issue has already been reported to avoid duplicates.
3. If not, create a new issue using the provided template, including as much detail as possible.

### Suggesting Enhancements or New Features

We welcome suggestions for improvements or new features:

1. Open a new issue in the [Issues](https://github.com/loxjs/mono/issues) section.
2. Describe the enhancement in detail, explaining why it would be beneficial.

### Submitting Pull Requests

To submit a pull request:

1. Fork the repository and create your branch from `main`.
2. If you've added code, add tests and make sure they pass.
3. Ensure the code follows the existing style guidelines and passes linting.
4. Update the documentation if you've changed APIs or added new features.
5. Submit a pull request targeting the `main` branch of the `loxjs/mono` repository.

## Development Setup

To get your development environment set up:

```sh
# Clone the repository
git clone https://github.com/loxjs/mono.git
cd mono

# Install the Yarn at the global level (if you haven't already)
npm install -g yarn

# Bootstrap the packages in the current Lerna repo.
# Installs all of their dependencies and links any cross-dependencies.
yarn bootstrap

# Run tests across all packages
yarn test
```

When using Lerna with Yarn Workspaces, you can run scripts across all packages using Lerna's run command:

```
lerna run test
```

## Pull Request Guidelines

 - Keep pull requests concise and focused on a single module, feature, or issue.
 - Include screenshots and animated GIFs in your pull request whenever visual changes are involved.
 - Follow the existing code conventions and style in order to maintain a consistent code base.
 - Document any major changes to the codebase in the project's documentation.
 - Ensure all files end with a newline.

## Style Guides

### Git Commit Messages

 - Use the imperative mood ("Add feature" not "Added feature").
 - Keep the first line under 50 characters.
 - Include the type of change (feat, fix, chore, docs, style, refactor, test, perf) in the commit message.
 - Reference issues and pull requests after the body.

### JavaScript Style Guide

 - Adhere to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
 - Use ES6+ syntax whenever possible.
 - Use 4 spaces for indentation.
 - Avoid inline comments when they are not necessary.
 - **Don't disable eslint and don't modify .eslintrc.json **

## Community and Behavioral Expectations

 - Be respectful and considerate of others.
 - Gracefully accept constructive criticism.
 - Prioritize what is best for the community and the projects.
 - Show empathy and kindness to other community members.

## License

By contributing to `loxjs/mono`, you agree that your contributions will be licensed under the repository's MIT License.

## Questions or Need Help?

If you have any questions or need assistance, please reach out to the project maintainers.
