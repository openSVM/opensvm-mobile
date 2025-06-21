//! Desktop-specific configuration and features

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DesktopConfig {
    pub window: WindowConfig,
    pub menu: MenuConfig,
    pub features: FeatureConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowConfig {
    pub title: String,
    pub width: f64,
    pub height: f64,
    pub resizable: bool,
    pub maximized: bool,
    pub min_width: Option<f64>,
    pub min_height: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MenuConfig {
    pub enabled: bool,
    pub show_file_menu: bool,
    pub show_edit_menu: bool,
    pub show_view_menu: bool,
    pub show_help_menu: bool,
    pub custom_items: Vec<MenuItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MenuItem {
    pub label: String,
    pub action: String,
    pub shortcut: Option<String>,
    pub enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FeatureConfig {
    pub auto_updater: bool,
    pub system_tray: bool,
    pub notifications: bool,
    pub file_associations: bool,
}

impl Default for DesktopConfig {
    fn default() -> Self {
        Self {
            window: WindowConfig {
                title: "OpenSVM Dioxus".to_string(),
                width: 1024.0,
                height: 768.0,
                resizable: true,
                maximized: false,
                min_width: Some(800.0),
                min_height: Some(600.0),
            },
            menu: MenuConfig {
                enabled: true,
                show_file_menu: true,
                show_edit_menu: false,
                show_view_menu: true,
                show_help_menu: true,
                custom_items: vec![
                    MenuItem {
                        label: "Explorer".to_string(),
                        action: "navigate_explorer".to_string(),
                        shortcut: Some("Ctrl+E".to_string()),
                        enabled: true,
                    },
                    MenuItem {
                        label: "Transactions".to_string(),
                        action: "navigate_transactions".to_string(),
                        shortcut: Some("Ctrl+T".to_string()),
                        enabled: true,
                    },
                ],
            },
            features: FeatureConfig {
                auto_updater: false,
                system_tray: false,
                notifications: true,
                file_associations: false,
            },
        }
    }
}

impl DesktopConfig {
    /// Load configuration from file or use defaults
    pub fn load() -> Self {
        // Try to load from config file, fall back to defaults
        match std::fs::read_to_string("desktop_config.json") {
            Ok(content) => {
                match serde_json::from_str(&content) {
                    Ok(config) => config,
                    Err(e) => {
                        log::warn!("Failed to parse config file: {}, using defaults", e);
                        Self::default()
                    }
                }
            }
            Err(_) => {
                log::info!("No config file found, using defaults");
                Self::default()
            }
        }
    }

    /// Save configuration to file
    pub fn save(&self) -> Result<(), Box<dyn std::error::Error>> {
        let content = serde_json::to_string_pretty(self)?;
        std::fs::write("desktop_config.json", content)?;
        Ok(())
    }
}