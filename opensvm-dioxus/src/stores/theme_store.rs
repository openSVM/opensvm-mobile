use dioxus::prelude::*;
use serde::{Deserialize, Serialize};
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

impl Default for ThemeState {
    fn default() -> Self {
        Self {
            theme: Theme::System,
        }
    }
}

// Create a hook for the theme state
pub fn use_theme_store(cx: &ScopeState) -> &UseState<ThemeState> {
    let theme_state = use_state(cx, || {
        // Try to load from local storage
        if let Some(storage) = get_local_storage() {
            if let Ok(Some(stored_data)) = storage.get_item("theme-storage") {
                if let Ok(theme_state) = serde_json::from_str::<ThemeState>(&stored_data) {
                    return theme_state;
                }
            }
        }
        ThemeState::default()
    });

    // Save to local storage whenever the state changes
    use_effect(cx, (theme_state,), |(state,)| {
        let state = state.get();
        save_to_local_storage(state);
        async move {}
    });

    theme_state
}

// Helper function to get local storage
fn get_local_storage() -> Option<Storage> {
    #[cfg(feature = "web")]
    {
        let window = web_sys::window()?;
        window.local_storage().ok()?
    }
    #[cfg(not(feature = "web"))]
    None
}

// Helper function to save state to local storage
fn save_to_local_storage(state: &ThemeState) {
    #[cfg(feature = "web")]
    {
        if let Some(storage) = get_local_storage() {
            if let Ok(json) = serde_json::to_string(state) {
                let _ = storage.set_item("theme-storage", &json);
            }
        }
    }
}

// Set theme function
pub fn set_theme(theme_store: &UseState<ThemeState>, theme: Theme) {
    let mut state = theme_store.get().clone();
    state.theme = theme;
    theme_store.set(state);
}

// Get current theme function
pub fn get_current_theme(theme_store: &UseState<ThemeState>) -> Theme {
    let state = theme_store.get();
    
    match state.theme {
        Theme::System => {
            // Check system preference using media query
            #[cfg(feature = "web")]
            {
                if let Some(window) = web_sys::window() {
                    if let Ok(Some(media_query)) = window.match_media("(prefers-color-scheme: dark)") {
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