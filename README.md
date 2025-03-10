# OpenSVM Mobile

A mobile application for exploring the Solana blockchain, monitoring validators, and managing your Solana wallet.

![OpenSVM Mobile](https://via.placeholder.com/800x400?text=OpenSVM+Mobile)

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

```
opensvm-mobile/
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

## Technologies

- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/routing/introduction/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Charts**: Custom chart components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.