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
#[rustfmt::skip]
enum Route {
    #[route("/")]
    Home {},
    
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
    
    #[route("/account/:address")]
    Account { address: String },
    
    #[route("/:..route")]
    NotFound { route: Vec<String> },
}

// Route component implementations
#[component]
fn Home(cx: Scope) -> Element {
    cx.render(rsx! { ExplorerPage {} })
}

#[component]
fn Validators(cx: Scope) -> Element {
    cx.render(rsx! { ValidatorsPage {} })
}

#[component]
fn Solanow(cx: Scope) -> Element {
    cx.render(rsx! { SolanowPage {} })
}

#[component]
fn Wallet(cx: Scope) -> Element {
    cx.render(rsx! { WalletPage {} })
}

#[component(no_case_check)]
fn AI(cx: Scope) -> Element {
    cx.render(rsx! { AIPage {} })
}

#[component]
fn Transaction(cx: Scope, id: String) -> Element {
    cx.render(rsx! { TransactionPage {} })
}

#[component]
fn Account(cx: Scope, address: String) -> Element {
    cx.render(rsx! { 
        AccountPage { 
            address: address.clone() 
        } 
    })
}

#[component]
fn NotFound(cx: Scope, route: Vec<String>) -> Element {
    cx.render(rsx! { NotFoundPage {} })
}

// Main App component
pub fn App(cx: Scope) -> Element {
    cx.render(rsx! {
        style { include_str!("./assets/styles.css") }
        Router::<Route> {}
    })
}
