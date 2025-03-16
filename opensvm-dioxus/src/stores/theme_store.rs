use dioxus::prelude::*;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use web_sys::Storage;

// Define the theme options
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum Theme {
    Light,
    Dark,
    System,
}

// Define the theme state
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThemeState {
    pub theme: Theme,
}

// Create a signal for the theme state
pub fn use_theme_store() -> Signal<ThemeState> {
    // Create a static signal to ensure the state persists across renders
    static THEME_STORE: Signal<ThemeState> = Signal::new(ThemeState {
        theme: Theme::System,
    });
    
    // Initialize the store with data from local storage if available
    use_hook(|| {
        if let Some(storage) = get_local_storage() {
            if let Ok(Some(stored_data)) = storage.get_item("theme-storage") {
                if let Ok(theme_state) = serde_json::from_str::<ThemeState>(&stored_data) {
                    THEME_STORE.set(theme_state);
                }
            }
        }
    });
    
    THEME_STORE
}

// Helper function to get local storage
fn get_local_storage() -> Option<Storage> {
    let window = web_sys::window()?;
    window.local_storage().ok()?
}

// Helper function to save state to local storage
fn save_to_local_storage(state: &ThemeState) {
    if let Some(storage) = get_local_storage() {
        if let Ok(json) = serde_json::to_string(state) {
            let _ = storage.set_item("theme-storage", &json);
        }
    }
}

// Set theme function
pub fn set_theme(theme_store: Signal<ThemeState>, theme: Theme) {
    let mut state = theme_store.read().clone();
    state.theme = theme;
    theme_store.set(state.clone());
    save_to_local_storage(&state);
}

// Get current theme function
pub fn get_current_theme(theme_store: Signal<ThemeState>) -> Theme {
    let state = theme_store.read();
    
    match state.theme {
        Theme::System => {
            // Check system preference
            if let Some(window) = web_sys::window() {
                if let Ok(media_query) = window.match_media("(prefers-color-scheme: dark)") {
                    if let Some(media_query) = media_query {
                        if media_query.matches() {
                            return Theme::Dark;
                        }
                    }
                }
            }
            Theme::Light // Default to light if we can't determine system preference
        },
        _ => state.theme.clone(),
    }
}