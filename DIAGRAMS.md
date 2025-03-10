# OpenSVM Mobile Diagrams

This document contains visual diagrams to help understand the OpenSVM Mobile application structure, data flow, and component relationships.

## Application Architecture

```mermaid
graph TD
    A[App Entry] --> B[Navigation Layer]
    B --> C[Screen Components]
    C --> D[UI Components]
    D --> E[Business Logic/Hooks]
    E --> F[State Management]
    F --> G[External Services]
    
    subgraph "Navigation Layer"
        B1[Expo Router]
        B2[Tab Navigation]
        B3[Stack Navigation]
    end
    
    subgraph "Screen Components"
        C1[Explorer]
        C2[Validators]
        C3[SIMD-0228]
        C4[Wallet]
        C5[AI Assistant]
    end
    
    subgraph "UI Components"
        D1[Charts]
        D2[Forms]
        D3[Lists]
        D4[Cards]
        D5[Modals]
    end
    
    subgraph "Business Logic/Hooks"
        E1[useValidatorMetrics]
        E2[useNetworkStats]
        E3[useWebSocket]
        E4[useGithubDiscussions]
    end
    
    subgraph "State Management"
        F1[Wallet Store]
        F2[Theme Store]
    end
    
    subgraph "External Services"
        G1[Solana RPC]
        G2[Validator API]
        G3[GitHub API]
    end
    
    B1 --> B2
    B1 --> B3
    B2 --> C1
    B2 --> C2
    B2 --> C3
    B2 --> C4
    B2 --> C5
    B3 --> C6[Transaction Details]
    B3 --> C7[Account Details]
    
    C1 --> D1
    C1 --> D3
    C2 --> D1
    C2 --> D4
    C3 --> D1
    C3 --> D2
    C4 --> D4
    C5 --> D5
    
    C1 --> E2
    C2 --> E1
    C2 --> E3
    C3 --> E4
    C4 --> F1
    
    E1 --> G2
    E2 --> G1
    E4 --> G3
    F1 --> G1
```

## Data Flow Diagram

```mermaid
flowchart TD
    User([User]) <--> UI[UI Components]
    UI <--> Hooks[Custom Hooks]
    Hooks <--> Store[State Stores]
    Hooks <--> API[External APIs]
    Store <--> Storage[(Local Storage)]
    
    subgraph "User Interactions"
        A1[View Explorer]
        A2[Monitor Validators]
        A3[Explore SIMD Proposal]
        A4[Connect Wallet]
        A5[Use AI Assistant]
    end
    
    subgraph "Data Processing"
        B1[Fetch Blockchain Data]
        B2[Process Validator Metrics]
        B3[Calculate Emission Rates]
        B4[Manage Wallet State]
        B5[Process AI Queries]
    end
    
    User --> A1
    User --> A2
    User --> A3
    User --> A4
    User --> A5
    
    A1 --> B1
    A2 --> B2
    A3 --> B3
    A4 --> B4
    A5 --> B5
    
    B1 --> UI
    B2 --> UI
    B3 --> UI
    B4 --> UI
    B5 --> UI
```

## Component Hierarchy

```mermaid
graph TD
    App[App Root] --> Layout[Root Layout]
    Layout --> Tabs[Tab Navigation]
    
    Tabs --> Explorer[Explorer Screen]
    Tabs --> Validators[Validators Screen]
    Tabs --> SIMD[SIMD-0228 Screen]
    Tabs --> Wallet[Wallet Screen]
    Tabs --> AI[AI Assistant Screen]
    
    Explorer --> SearchBar
    Explorer --> NetworkStats
    Explorer --> ValidatorAnalytics
    Explorer --> RecentBlocks
    Explorer --> AIAssistantMini
    
    Validators --> MetricsGrid
    Validators --> GlobeVisualization
    Validators --> LineChart
    Validators --> ValidatorList
    ValidatorList --> ValidatorItem
    
    SIMD --> TabNav[Tab Navigation]
    TabNav --> EmissionTab[Emission Mechanism]
    TabNav --> StakingTab[Staking Calculator]
    TabNav --> DiscussionTab[Discussion]
    
    EmissionTab --> FormulaDisplay
    EmissionTab --> InteractiveSlider
    EmissionTab --> ResultsGrid
    EmissionTab --> BenefitsCards
    
    StakingTab --> Calculator
    StakingTab --> ComparisonCard
    
    DiscussionTab --> GitHubThread
    
    Wallet --> ConnectButton
    Wallet --> WalletDetails
    WalletDetails --> AddressDisplay
    WalletDetails --> CopyButton
    
    AI --> AIAssistant
    AIAssistant --> ChatInterface
    AIAssistant --> MessageList
    AIAssistant --> InputBar
```

## State Management

```mermaid
stateDiagram-v2
    [*] --> AppInitialized
    
    state AppInitialized {
        [*] --> WalletDisconnected
        WalletDisconnected --> WalletConnecting: User clicks connect
        WalletConnecting --> WalletConnected: Connection successful
        WalletConnecting --> WalletError: Connection failed
        WalletError --> WalletDisconnected: User retries
        WalletConnected --> WalletDisconnected: User disconnects
        
        state ThemeState {
            [*] --> LightTheme
            LightTheme --> DarkTheme: Toggle theme
            DarkTheme --> LightTheme: Toggle theme
        }
        
        state DataFetchingState {
            [*] --> DataLoading
            DataLoading --> DataLoaded: Fetch complete
            DataLoading --> DataError: Fetch failed
            DataError --> DataLoading: Retry
            DataLoaded --> DataRefreshing: Pull to refresh
            DataRefreshing --> DataLoaded: Refresh complete
        }
    }
```

## Validator Monitoring Flow

```mermaid
sequenceDiagram
    participant User
    participant ValidatorsScreen
    participant useValidatorMetrics
    participant WebSocket
    
    User->>ValidatorsScreen: Open Validators Tab
    ValidatorsScreen->>useValidatorMetrics: Initialize hook
    useValidatorMetrics->>WebSocket: Connect to WebSocket
    WebSocket-->>useValidatorMetrics: Initial validator data
    useValidatorMetrics-->>ValidatorsScreen: Update UI with data
    
    loop Real-time updates
        WebSocket-->>useValidatorMetrics: New metrics data
        useValidatorMetrics-->>ValidatorsScreen: Update UI with new data
    end
    
    User->>ValidatorsScreen: Select validator
    ValidatorsScreen->>useValidatorMetrics: Get validator details
    useValidatorMetrics-->>ValidatorsScreen: Return detailed data
    ValidatorsScreen-->>User: Show validator detail view
    
    User->>ValidatorsScreen: Close detail view
    ValidatorsScreen-->>User: Return to validators list
```

## SIMD-0228 Proposal Flow

```mermaid
sequenceDiagram
    participant User
    participant SIMDScreen
    participant Calculator
    participant GitHubThread
    
    User->>SIMDScreen: Open SIMD Tab
    SIMDScreen->>User: Show emission mechanism tab
    
    User->>SIMDScreen: Adjust staking percentage
    SIMDScreen->>SIMDScreen: Calculate new emission rate
    SIMDScreen->>SIMDScreen: Update charts and results
    SIMDScreen-->>User: Display updated results
    
    User->>SIMDScreen: Switch to staking calculator
    SIMDScreen->>Calculator: Initialize with current rates
    Calculator-->>User: Show calculator interface
    
    User->>Calculator: Enter staking amount
    User->>Calculator: Select staking period
    User->>Calculator: Choose yield rate
    Calculator->>Calculator: Calculate rewards
    Calculator-->>User: Display staking results
    
    User->>SIMDScreen: Switch to discussion tab
    SIMDScreen->>GitHubThread: Fetch discussion data
    GitHubThread-->>User: Display GitHub discussion
```

## Explorer Search Flow

```mermaid
sequenceDiagram
    participant User
    participant ExplorerScreen
    participant SearchBar
    participant Router
    
    User->>ExplorerScreen: Open Explorer Tab
    ExplorerScreen-->>User: Show network stats and recent blocks
    
    User->>SearchBar: Enter search query
    SearchBar->>SearchBar: Process query
    SearchBar-->>ExplorerScreen: Return search results
    ExplorerScreen-->>User: Display search results
    
    User->>ExplorerScreen: Select transaction result
    ExplorerScreen->>Router: Navigate to transaction/[id]
    Router-->>User: Show transaction details
    
    User->>Router: Go back
    Router-->>ExplorerScreen: Return to Explorer
    ExplorerScreen-->>User: Show Explorer screen
```

## Wallet Connection Flow

```mermaid
sequenceDiagram
    participant User
    participant WalletScreen
    participant WalletStore
    participant AsyncStorage
    
    User->>WalletScreen: Open Wallet Tab
    WalletScreen->>WalletStore: Get connection status
    WalletStore->>AsyncStorage: Retrieve saved state
    AsyncStorage-->>WalletStore: Return connection data
    WalletStore-->>WalletScreen: Update UI with status
    
    alt Wallet not connected
        WalletScreen-->>User: Show connect button
        User->>WalletScreen: Press connect
        WalletScreen->>WalletStore: Call connect()
        WalletStore->>WalletStore: Set isConnected = true
        WalletStore->>WalletStore: Set mock address
        WalletStore->>AsyncStorage: Save connection state
        WalletStore-->>WalletScreen: Update UI
        WalletScreen-->>User: Show connected state
    else Wallet already connected
        WalletScreen-->>User: Show wallet details
        User->>WalletScreen: Press disconnect
        WalletScreen->>WalletStore: Call disconnect()
        WalletStore->>WalletStore: Set isConnected = false
        WalletStore->>AsyncStorage: Save connection state
        WalletStore-->>WalletScreen: Update UI
        WalletScreen-->>User: Show disconnected state
    end
```

## AI Assistant Flow

```mermaid
sequenceDiagram
    participant User
    participant AIScreen
    participant AIAssistant
    participant AIService
    
    User->>AIScreen: Open AI Tab
    AIScreen->>AIAssistant: Initialize with expanded view
    AIAssistant-->>User: Show chat interface
    
    User->>AIAssistant: Type question
    AIAssistant->>AIService: Send query
    AIService-->>AIAssistant: Return response
    AIAssistant-->>User: Display AI response
    
    User->>AIAssistant: Ask follow-up question
    AIAssistant->>AIService: Send follow-up query with context
    AIService-->>AIAssistant: Return contextual response
    AIAssistant-->>User: Display AI response
```

## Technology Stack

```mermaid
graph TD
    A[OpenSVM Mobile] --> B[Frontend Framework]
    A --> C[State Management]
    A --> D[Navigation]
    A --> E[UI Components]
    A --> F[Data Fetching]
    A --> G[Storage]
    
    B --> B1[React Native]
    B --> B2[Expo]
    
    C --> C1[Zustand]
    
    D --> D1[Expo Router]
    
    E --> E1[Native Components]
    E --> E2[Custom Components]
    E --> E3[Lucide Icons]
    
    F --> F1[WebSockets]
    F --> F2[Custom Hooks]
    
    G --> G1[AsyncStorage]
```