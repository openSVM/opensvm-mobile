# OpenSVM Mobile

A multi-platform application for exploring the Solana blockchain, monitoring validators, and managing your Solana wallet. Available as a React Native mobile app and a Dioxus desktop/web app.

![OpenSVM Mobile](https://via.placeholder.com/800x400?text=OpenSVM+Mobile)

## Overview

OpenSVM Mobile is a comprehensive application that provides tools for interacting with the Solana blockchain. The application offers real-time monitoring of validator performance, blockchain exploration, wallet management, and an AI assistant for Solana-related queries.

The project consists of two implementations:

1. **opensvm-reactnative**: A mobile application built with Expo and React Native
2. **opensvm-dioxus**: A cross-platform desktop and web application built with Rust and Dioxus

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

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Yarn or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/opensvm-mobile.git
cd opensvm-mobile
```

2. Install dependencies
```bash
yarn install
# or
npm install
```

3. Start the development server
```bash
yarn start
# or
npm start
```

4. Run on your device or emulator
- Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
- Press 'a' to run on Android emulator
- Press 'i' to run on iOS simulator
- Press 'w' to run in web browser

## Project Structure

### React Native Application

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

### Dioxus Application

```
opensvm-dioxus/
├── src/                    # Source code
│   ├── app.rs              # Main application component
│   ├── assets/             # Static assets
│   ├── components/         # Reusable UI components
│   ├── constants/          # App constants
│   ├── main.rs             # Entry point
│   ├── routes/             # Application routes
│   ├── stores/             # State management
│   └── utils/              # Utility functions
├── Cargo.toml              # Rust dependencies and project configuration
└── Cargo.lock              # Locked dependencies
```

## Technologies

### React Native Application

- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/routing/introduction/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Charts**: Custom chart components

### Dioxus Application

- **Framework**: [Dioxus](https://dioxuslabs.com/) (Rust-based UI framework)
- **Router**: [Dioxus Router](https://dioxuslabs.com/docs/0.4/router/index.html)
- **State Management**: [Dioxus Signals](https://dioxuslabs.com/docs/0.4/guide/en/state_management.html)
- **UI Components**: Custom components and [Dioxus Free Icons](https://github.com/nissy-dev/dioxus-free-icons)
- **Web Support**: WebAssembly (WASM) via [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen)
- **Desktop Support**: Native binaries for Windows, macOS, and Linux

## Continuous Integration

This project uses GitHub Actions for continuous integration and deployment:

- **Automated Testing**: All pull requests and pushes to the main branch are automatically tested
- **Cross-Platform Builds**: The CI pipeline builds the application for multiple platforms
- **Release Automation**: When a new release is created, binaries are automatically built and attached to the release
- **Homebrew Formula**: A Homebrew formula is automatically generated for easy installation on macOS

For more details, see the [CI workflow documentation](.github/workflows/README.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
