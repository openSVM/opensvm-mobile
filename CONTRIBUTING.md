# Contributing to OpenSVM Mobile

Thank you for your interest in contributing to OpenSVM Mobile! This document provides guidelines and instructions for contributing to both the React Native and Dioxus implementations of the project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to foster an open and welcoming environment.

## Getting Started

### Prerequisites

#### For React Native (opensvm-reactnative)
- Node.js (v16 or higher)
- Expo CLI
- Yarn or npm

#### For Dioxus (opensvm-dioxus)
- Rust (stable channel)
- Cargo
- Dioxus CLI

### Setting Up the Development Environment

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/opensvm-mobile.git`
3. Add the upstream repository: `git remote add upstream https://github.com/openSVM/opensvm-mobile.git`

#### For React Native

```bash
cd opensvm-reactnative
yarn install
# or
npm install
```

#### For Dioxus

```bash
cd opensvm-dioxus
cargo build
```

## Development Workflow

1. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests to ensure your changes don't break existing functionality
4. Commit your changes with a descriptive commit message
5. Push your branch to your fork: `git push origin feature/your-feature-name`
6. Open a pull request against the main repository

## Pull Request Guidelines

- Fill out the pull request template completely
- Include tests for new features or bug fixes
- Update documentation as needed
- Keep pull requests focused on a single concern
- Make sure CI passes on your pull request

## Testing

### React Native

```bash
cd opensvm-reactnative
yarn test
# or
npm test
```

### Dioxus

```bash
cd opensvm-dioxus
cargo test
```

## Continuous Integration

We use GitHub Actions for continuous integration. All pull requests will be automatically tested. Please make sure your changes pass all tests before requesting a review.

## Release Process

Releases are managed by the core team. When a new release is created:

1. A GitHub release is published with release notes
2. CI automatically builds binaries for all supported platforms
3. Binaries are attached to the GitHub release
4. A Homebrew formula is updated for macOS users

## Getting Help

If you need help with anything related to the project or your contribution, please:

1. Check the documentation
2. Open an issue with your question
3. Reach out to the community on [Discord/Slack/etc.]

Thank you for contributing to OpenSVM Mobile!