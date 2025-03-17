use dioxus::prelude::*;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use web_sys::Storage;

// Define the wallet state
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalletState {
    pub is_connected: bool,
    pub address: String,
}

// Create a signal for the wallet state
pub fn use_wallet_store() -> Signal<WalletState> {
    // Create a static signal to ensure the state persists across renders
    static WALLET_STORE: Signal<WalletState> = Signal::new(WalletState {
        is_connected: false,
        address: String::new(),
    });
    
    // Initialize the store with data from local storage if available
    use_effect(|_| {
        if let Some(storage) = get_local_storage() {
            if let Ok(Some(stored_data)) = storage.get_item("wallet-storage") {
                if let Ok(wallet_state) = serde_json::from_str::<WalletState>(&stored_data) {
                    WALLET_STORE.set(wallet_state);
                }
            }
        }
        
        || {}
    });
    
    WALLET_STORE
}

// Helper function to get local storage
fn get_local_storage() -> Option<Storage> {
    let window = web_sys::window()?;
    window.local_storage().ok()?
}

// Helper function to save state to local storage
fn save_to_local_storage(state: &WalletState) {
    if let Some(storage) = get_local_storage() {
        if let Ok(json) = serde_json::to_string(state) {
            let _ = storage.set_item("wallet-storage", &json);
        }
    }
}

// Connect wallet function
pub fn connect_wallet(wallet: Signal<WalletState>) {
    let mut state = wallet.read().clone();
    state.is_connected = true;
    state.address = "7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP".to_string(); // Mock address
    wallet.set(state.clone());
    save_to_local_storage(&state);
}

// Disconnect wallet function
pub fn disconnect_wallet(wallet: Signal<WalletState>) {
    let mut state = wallet.read().clone();
    state.is_connected = false;
    state.address = String::new();
    wallet.set(state.clone());
    save_to_local_storage(&state);
}