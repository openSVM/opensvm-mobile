//! OpenSVM Dioxus - A cross-platform Solana blockchain explorer and wallet manager
//! 
//! This is the main entry point for the application.

use dioxus::prelude::*;

mod app;
mod components;
mod constants;
mod routes;
mod stores;
mod utils;

/// Platform-specific optimizations module
mod platform_optimizations;

fn main() {
    // Initialize logging based on platform
    #[cfg(feature = "web")]
    {
        console_log::init_with_level(log::Level::Debug).expect("Failed to initialize logger");
    }
    
    #[cfg(any(feature = "desktop", feature = "android"))]
    {
        env_logger::init();
    }

    // Apply platform-specific optimizations
    platform_optimizations::apply_optimizations();

    // Launch the application with platform-specific settings
    #[cfg(feature = "web")]
    {
        let config = dioxus_web::Config::new()
            .with_web_optimization_mode(dioxus_web::WebOptimizationMode::Compressed);
        dioxus_web::launch_with_props(app::App, (), config);
    }

    #[cfg(feature = "desktop")]
    {
        use dioxus_desktop::{Config, WindowBuilder};
        
        let window = WindowBuilder::new()
            .with_title("OpenSVM Dioxus")
            .with_maximized(false)
            .with_inner_size(dioxus_desktop::LogicalSize::new(1200, 800))
            .with_min_inner_size(dioxus_desktop::LogicalSize::new(800, 600));
        
        let config = Config::new()
            .with_window(window)
            .with_disable_context_menu(false)
            .with_permanent_window_state(false);  // For resizable windows
        
        dioxus_desktop::launch_with_props(app::App, (), config);
    }
    
    #[cfg(feature = "android")]
    {
        dioxus_mobile::launch_with_props(app::App, ());
    }
}
