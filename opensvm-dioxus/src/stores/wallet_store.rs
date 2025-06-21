use dioxus::prelude::*;
use serde::{Deserialize, Serialize};

#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;
#[cfg(feature = "web")]
use web_sys::Storage;

// Define the wallet state
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct WalletState {
    pub is_connected: bool,
    pub address: String,
}

impl Default for WalletState {
    fn default() -> Self {
        Self {
            is_connected: false,
            address: String::new(),
        }
    }
}

// Create a hook for the wallet state
pub fn use_wallet_store(cx: &ScopeState) -> &UseState<WalletState> {
    let wallet_state = use_state(cx, || {
        // Try to load from local storage
        #[cfg(feature = "web")]
        {
            if let Some(storage) = get_local_storage() {
                if let Ok(Some(stored_data)) = storage.get_item("wallet-storage") {
                    if let Ok(wallet_state) = serde_json::from_str::<WalletState>(&stored_data) {
                        return wallet_state;
                    }
                }
            }
        }
        WalletState::default()
    });

    // Save to local storage whenever the state changes
    use_effect(cx, (wallet_state,), |(state,)| {
        let state = state.get();
        save_to_local_storage(state);
        async move {}
    });

    wallet_state
}

// Helper function to get local storage
#[cfg(feature = "web")]
fn get_local_storage() -> Option<Storage> {
    let window = web_sys::window()?;
    window.local_storage().ok()?
}

#[cfg(not(feature = "web"))]
fn get_local_storage() -> Option<()> {
    None
}

// Helper function to save state to local storage
fn save_to_local_storage(state: &WalletState) {
    #[cfg(feature = "web")]
    {
        if let Some(storage) = get_local_storage() {
            if let Ok(json) = serde_json::to_string(state) {
                let _ = storage.set_item("wallet-storage", &json);
            }
        }
    }
}

// Connect wallet function
pub fn connect_wallet(wallet: &UseState<WalletState>) {
    let mut state = wallet.get().clone();
    state.is_connected = true;
    state.address = "7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP".to_string(); // Mock address
    wallet.set(state.clone());
    save_to_local_storage(&state);
}

// Disconnect wallet function
pub fn disconnect_wallet(wallet: &UseState<WalletState>) {
    let mut state = wallet.get().clone();
    state.is_connected = false;
    state.address = String::new();
    wallet.set(state.clone());
    save_to_local_storage(&state);
}