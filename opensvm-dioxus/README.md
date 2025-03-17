# OpenSVM Dioxus

A cross-platform desktop and web application for exploring the Solana blockchain, monitoring validators, and managing your Solana wallet, built with Rust and Dioxus.

## Features

- **Cross-Platform**: Runs on Windows, macOS, Linux, and the web (via WebAssembly)
- **Blockchain Explorer**: Search for transactions, blocks, and accounts
- **Validator Monitoring**: Track validator performance metrics
- **Wallet Management**: Connect your Solana wallet and view your assets
- **AI Assistant**: Get help with Solana-related queries

## Development

### Prerequisites

- Rust (stable channel)
- Cargo
- [Dioxus CLI](https://github.com/DioxusLabs/dioxus/tree/master/packages/cli)

### Setup

1. Install Rust and Cargo from [rustup.rs](https://rustup.rs/)

2. Install the WebAssembly target:
   ```bash
   rustup target add wasm32-unknown-unknown
   ```

3. Install Dioxus CLI:
   ```bash
   cargo install dioxus-cli
   ```

### Running the Application

#### Desktop

```bash
# Run in development mode
dioxus serve --platform desktop

# Build for release
dioxus build --release --platform desktop
```

#### Web

```bash
# Run in development mode
dioxus serve --platform web

# Build for release
dioxus build --release --platform web
```

#### Android

```bash
# Run in development mode
dioxus serve --platform android

# Build for release
dioxus build --release --platform android
```

### Building for Different Platforms

#### Linux

```bash
cargo build --release --target x86_64-unknown-linux-gnu
```

#### macOS

```bash
# Intel
cargo build --release --target x86_64-apple-darwin

# Apple Silicon
cargo build --release --target aarch64-apple-darwin
```

#### Windows

```bash
cargo build --release --target x86_64-pc-windows-msvc
```

## Installation

### From Releases

Download the latest release for your platform from the [GitHub Releases](https://github.com/openSVM/opensvm-mobile/releases) page.

### Using Homebrew (macOS)

```bash
# Add the tap
brew tap opensvm/opensvm

# Install the application
brew install opensvm-dioxus
```

## Continuous Integration

This project uses GitHub Actions for continuous integration and deployment. The CI pipeline automatically:

- Builds and tests the application on multiple platforms
- Creates release binaries for Windows, macOS, Linux, Android, and the web
- Generates a Homebrew formula for easy installation on macOS

For more details, see the [CI workflow documentation](../.github/workflows/README.md).

## Project Structure

```
src/
├── app.rs              # Main application component
├── assets/             # Static assets
├── components/         # Reusable UI components
├── constants/          # App constants
├── main.rs             # Entry point
├── routes/             # Application routes
├── stores/             # State management
└── utils/              # Utility functions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.