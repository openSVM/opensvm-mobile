// Import necessary modules
mod app;
mod routes;
mod components;
mod stores;
mod constants;
mod utils;

use app::App;
use dioxus::prelude::*;
use log::Level;

fn main() {
    // Initialize logger
    console_log::init_with_level(Level::Debug).expect("Failed to initialize logger");
    
    // Launch the Dioxus app in a browser
    dioxus_web::launch(App);
}