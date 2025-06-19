use dioxus::prelude::*;
use dioxus_router::prelude::*;

use crate::routes::{
    explorer::ExplorerPage,
    validators::ValidatorsPage,
    solanow::SolanowPage,
    wallet::WalletPage,
    ai::AIPage,
    transaction::TransactionPage,
    account::{AccountPage, AccountPageProps},
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
    
    #[route("/account/:address")]
    Account { address: String },
    
    #[route("/:..segments")]
    NotFound { segments: Vec<String> },
}

impl Route {
    pub fn render(&self, cx: Scope) -> Element {
        match self {
            Route::Explorer {} => cx.render(rsx! { ExplorerPage {} }),
            Route::Validators {} => cx.render(rsx! { ValidatorsPage {} }),
            Route::Solanow {} => cx.render(rsx! { SolanowPage {} }),
            Route::Wallet {} => cx.render(rsx! { WalletPage {} }),
            Route::AI {} => cx.render(rsx! { AIPage {} }),
            Route::Transaction { id } => cx.render(rsx! { TransactionPage { id: id.clone() } }),
            Route::Account { address } => cx.render(rsx! { 
                AccountPage { 
                    address: address.clone() 
                } 
            }),
            Route::NotFound { segments } => cx.render(rsx! { NotFoundPage { segments: segments.clone() } }),
        }
    }
}

// Main App component
pub fn App(cx: Scope) -> Element {
    cx.render(rsx! {
        style { include_str!("./assets/styles.css") }
        Router::<Route> {}
    })
}
