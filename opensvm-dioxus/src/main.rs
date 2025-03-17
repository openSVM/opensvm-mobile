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

fn main() {
    // Initialize logging
    #[cfg(target_arch = "wasm32")]
    console_log::init_with_level(log::Level::Debug).expect("Failed to initialize logger");
    #[cfg(not(target_arch = "wasm32"))]
    env_logger::init();

    // Launch the application
    #[cfg(target_arch = "wasm32")]
    dioxus_web::launch(app::App);

    #[cfg(not(target_arch = "wasm32"))]
    dioxus_desktop::launch(app::App);
}
