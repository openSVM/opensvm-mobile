// Import necessary modules
mod app;
mod components;
mod constants;
mod platform_optimizations;
mod routes;
mod stores;
mod utils;

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

        // Set up desktop logger
        simple_logger::SimpleLogger::new()
            .with_level(LevelFilter::Debug)
            .init()
            .expect("Failed to initialize logger");

        // Configure window
        let window = WindowBuilder::new()
            .with_title("OpenSVM Dioxus")
            .with_inner_size(LogicalSize::new(1024.0, 768.0));

        // Launch desktop app with simplified config
        dioxus_desktop::launch_cfg(App, Config::new().with_window(window));
    }

    #[cfg(feature = "android")]
    {
        // Initialize logger for Android
        android_logger::init_once(
            android_logger::Config::default()
                .with_min_level(log::Level::Debug)
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
