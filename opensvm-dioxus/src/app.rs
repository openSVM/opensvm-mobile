use dioxus::prelude::*;
use dioxus_router::prelude::*;

use crate::routes::{
    explorer::ExplorerPage,
    validators::ValidatorsPage,
    solanow::SolanowPage,
    wallet::WalletPage,
    ai::AIPage,
    transaction::TransactionPage,
    account::AccountPage,
    not_found::NotFoundPage,
};

// Define the routes for our app
#[derive(Routable, Clone)]
pub enum Route {
    #[route("/")]
    Explorer {},
    
    #[route("/validators")]
    Validators {},
    
    #[route("/solanow")]
    Solanow {},
    
    #[route("/wallet")]
    Wallet {},
    
    #[route("/ai")]
    AI {},
    
    #[route("/transaction/:id")]
    Transaction { id: String },
    
    #[route("/account/:id")]
    Account { id: String },
    
    #[route("/:..segments")]
    NotFound { segments: Vec<String> },
}

// Main App component
pub fn App(cx: Scope) -> Element {
    cx.render(rsx! {
        style { include_str!("./assets/styles.css") }
        Router::<Route> {}
    })
}