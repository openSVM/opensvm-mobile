# OpenSVM Mobile

A mobile application for exploring the Solana blockchain, monitoring validators, and managing your Solana wallet.

![OpenSVM Mobile](https://via.placeholder.com/800x400?text=OpenSVM+Mobile)

[![CI/CD Pipeline](https://github.com/openSVM/opensvm-mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/openSVM/opensvm-mobile/actions/workflows/ci.yml)

## Overview

OpenSVM Mobile is a comprehensive mobile application built with Expo and React Native that provides tools for interacting with the Solana blockchain. The application offers real-time monitoring of validator performance, blockchain exploration, wallet management, and an AI assistant for Solana-related queries.

## Features

### 🔍 Blockchain Explorer
- Search for transactions, blocks, and accounts
- View network statistics and metrics
- Monitor recent blocks and transactions

### 📊 Validator Monitoring
- Track validator performance metrics (TPS, latency, skip rate)
- View global validator distribution
- Analyze validator resources (CPU, memory, disk, bandwidth)
- Compare top validators

### 💰 Wallet Management
- Connect your Solana wallet
- View your assets and transactions
- Copy wallet address for transactions

### 🤖 AI Assistant
- Get help with Solana-related queries
- Learn about blockchain concepts
- Receive guidance on using the application

### 📝 SIMD-0228 Proposal
- Interactive simulation of the market-based emission mechanism
- Staking calculator to estimate rewards
- Discussion thread for community feedback

## Getting Started

### React Native Project

#### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Yarn or npm

#### Installation

1. Clone the repository
```bash
git clone https://github.com/openSVM/opensvm-mobile.git
cd opensvm-mobile
```

2. Navigate to the React Native project
```bash
cd opensvm-reactnative
```

3. Install dependencies
```bash
yarn install
# or
npm install
```

4. Start the development server
```bash
yarn start
# or
npm start
```

5. Run on your device or emulator
- Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
- Press 'a' to run on Android emulator
- Press 'i' to run on iOS simulator
- Press 'w' to run in web browser

### Dioxus Project

#### Prerequisites
- Rust (stable channel)
- Cargo
- Dioxus CLI

#### Installation

1. Clone the repository (if not already done)
```bash
git clone https://github.com/openSVM/opensvm-mobile.git
cd opensvm-mobile
```

2. Navigate to the Dioxus project
```bash
cd opensvm-dioxus
```

3. Install Rust (if not already installed)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

4. Add WASM target
```bash
rustup target add wasm32-unknown-unknown
```

5. Install Dioxus CLI
```bash
cargo install dioxus-cli
```

6. Start the development server
```bash
# For web development
dioxus serve --platform web

# For desktop development
dioxus serve --platform desktop

# For Android development
dioxus serve --platform android
```

### Building for Production

The CI/CD pipeline automatically builds and releases the application for all platforms when a new tag is pushed. However, you can also build manually:

#### Web (WASM)
```bash
dioxus build --features web --profile wasm-release --platform web --release
```

#### Desktop
```bash
# macOS/Linux
RUSTFLAGS="-C target-cpu=native" dioxus build --features desktop --profile desktop-release --platform desktop --release

# Windows (PowerShell)
$env:RUSTFLAGS="-C target-cpu=native"
dioxus build --features desktop --profile desktop-release --platform desktop --release
```

#### Android
```bash
RUSTFLAGS="-C opt-level=3 -C lto=thin" dioxus build --features android --platform android --release
```

## Project Structure

This repository contains two main projects:

### React Native Project

```
opensvm-reactnative/
├── app/                    # Main application screens and navigation
│   ├── (tabs)/             # Tab-based navigation screens
│   ├── account/            # Account-related screens
│   └── transaction/        # Transaction-related screens
├── assets/                 # Static assets (images, fonts)
├── components/             # Reusable UI components
│   └── charts/             # Chart and visualization components
├── constants/              # App constants (colors, typography)
├── hooks/                  # Custom React hooks
├── mocks/                  # Mock data for development
├── stores/                 # State management (Zustand)
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

### Dioxus Project

```
opensvm-dioxus/
├── src/                    # Source code directory
│   ├── app.rs              # Main application component
│   ├── main.rs             # Entry point with platform-specific configurations
│   ├── assets/             # Static assets
│   ├── components/         # Reusable UI components
│   ├── constants/          # App-wide constants
│   ├── routes/             # Application routes
│   ├── stores/             # State management
│   └── utils/              # Utility functions
└── Cargo.toml              # Project dependencies and configuration
```

## Technologies

### React Native Project

- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/routing/introduction/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Charts**: Custom chart components

### Dioxus Project

- **Framework**: [Dioxus](https://dioxuslabs.com/) (Rust-based UI framework)
- **State Management**: [Dioxus Signals](https://dioxuslabs.com/docs/0.4/guide/en/state_management.html)
- **Router**: [Dioxus Router](https://dioxuslabs.com/docs/0.4/router/en/index.html)
- **Platforms**: Web (WASM), Desktop (Windows, macOS, Linux), Android

### CI/CD

- **GitHub Actions**: Automated build, test, and release pipeline
- **Cross-Platform Builds**: Web, Desktop (Windows, macOS, Linux), Android
- **Release Automation**: Automatic GitHub releases and Homebrew formula updates

## CI/CD Pipeline

This repository uses GitHub Actions to automate the build, test, and release process for the OpenSVM-Dioxus project.

### Workflow Overview

The CI/CD pipeline is defined in `.github/workflows/ci.yml` and includes the following jobs:

1. **Build & Test**: Compiles and tests the application for all supported platforms
2. **Release**: Creates platform-specific binaries and publishes them as GitHub releases
3. **Homebrew Formula**: Updates the Homebrew formula for macOS users
4. **Android Build**: Builds and optimizes the Android APK

### Creating a Release

To create a new release:

1. Create and push a new tag following semantic versioning:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. The workflow will automatically:
   - Build all platform versions
   - Create a GitHub release with all artifacts
   - Update the Homebrew formula

### Installing from Homebrew

On macOS, you can install the application using Homebrew:

```bash
# Add the tap (only needed once)
brew tap openSVM/opensvm-mobile https://github.com/openSVM/opensvm-mobile.git

# Install the application
brew install opensvm-dioxus
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
