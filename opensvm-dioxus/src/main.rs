// Import necessary modules
mod app;
mod routes;
mod components;
mod stores;
mod constants;
mod utils;
mod platform_optimizations;

use app::App;
use dioxus::prelude::*;

#[cfg(feature = "web")]
fn main() {
    // Initialize logger for web
    use log::Level;
    console_log::init_with_level(Level::Debug).expect("Failed to initialize logger");
    
    // Apply platform-specific optimizations
    platform_optimizations::initialize();
    
    // Launch the Dioxus app in a browser
    dioxus_web::launch(App);
}

#[cfg(feature = "desktop")]
fn main() {
    // Initialize logger for desktop
    use dioxus_desktop::tao::menu::{MenuBar, MenuItem};
    use dioxus_desktop::{Config, LogicalSize, WindowBuilder};
    use log::LevelFilter;
    
    // Set up desktop logger
    simple_logger::SimpleLogger::new()
        .with_level(LevelFilter::Debug)
        .init()
        .expect("Failed to initialize logger");
    
    // Apply platform-specific optimizations
    platform_optimizations::initialize();
    
    // Create menu bar
    let mut menu = MenuBar::new();
    let mut file_menu = MenuBar::new();
    file_menu.add_item(MenuItem::new("Quit", true, None));
    menu.add_submenu("File", true, file_menu);
    
    // Configure window
    let window = WindowBuilder::new()
        .with_title("OpenSVM Dioxus")
        .with_inner_size(LogicalSize::new(1024.0, 768.0));
    
    // Launch desktop app
    dioxus_desktop::launch_cfg(
        App,
        Config::new().with_window(window).with_menu(menu),
    );
}

#[cfg(feature = "android")]
fn main() {
    // Initialize logger for Android
    android_logger::init_once(
        android_logger::Config::default()
            .with_min_level(log::Level::Debug)
            .with_tag("opensvm-dioxus"),
    );
    
    // Apply platform-specific optimizations
    platform_optimizations::initialize();
    
    // Launch Android app
    dioxus_mobile::launch(App);
}
