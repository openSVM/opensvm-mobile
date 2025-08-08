// Import necessary modules
mod app;
mod components;
mod constants;
mod platform_optimizations;
mod routes;
mod stores;
mod utils;

#[cfg(feature = "desktop")]
mod desktop_config;

use app::App;

fn main() {
    // Apply platform-specific optimizations
    platform_optimizations::initialize();

    #[cfg(feature = "web")]
    {
        // Initialize logger for web
        use log::Level;
        console_log::init_with_level(Level::Debug).expect("Failed to initialize logger");

        // Launch the Dioxus app in a browser
        dioxus_web::launch(App);
    }

    #[cfg(feature = "desktop")]
    {
        // Initialize logger for desktop
        use dioxus_desktop::{Config, LogicalSize, WindowBuilder};
        use log::LevelFilter;
        use desktop_config::DesktopConfig;

        // Set up desktop logger
        simple_logger::SimpleLogger::new()
            .with_level(LevelFilter::Debug)
            .init()
            .expect("Failed to initialize logger");

        // Load desktop configuration
        let config = DesktopConfig::load();
        
        log::info!("Starting desktop app with config: {:?}", config);

        // Configure window with loaded settings
        let mut window_builder = WindowBuilder::new()
            .with_title(&config.window.title)
            .with_inner_size(LogicalSize::new(config.window.width, config.window.height))
            .with_resizable(config.window.resizable);

        if let (Some(min_w), Some(min_h)) = (config.window.min_width, config.window.min_height) {
            window_builder = window_builder.with_min_inner_size(LogicalSize::new(min_w, min_h));
        }

        // Configure the desktop app
        let mut desktop_config = Config::new().with_window(window_builder);

        // Add menu configuration if enabled
        if config.menu.enabled {
            log::info!("Desktop menu enabled with {} custom items", config.menu.custom_items.len());
            // Note: Dioxus 0.4 may have different menu API
            // This is a placeholder for menu configuration
        }

        // Launch desktop app with configuration
        dioxus_desktop::launch_cfg(App, desktop_config);
    }

    #[cfg(feature = "android")]
    {
        // Initialize logger for Android
        android_logger::init_once(
            android_logger::Config::default()
                .with_max_level(log::LevelFilter::Debug)
                .with_tag("opensvm-dioxus"),
        );

        // Launch Android app
        dioxus_mobile::launch(App);
    }

    #[cfg(not(any(feature = "web", feature = "desktop", feature = "android")))]
    {
        eprintln!("No platform feature enabled. Please build with --features web, --features desktop, or --features android");
        std::process::exit(1);
    }
}
