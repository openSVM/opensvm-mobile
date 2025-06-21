use dioxus::prelude::*;
use dioxus_router::prelude::*;

use crate::routes::{
    account::AccountPage, ai::AIPage, explorer::ExplorerPage, not_found::NotFoundPage,
    solanow::SolanowPage, transaction::TransactionPage, validators::ValidatorsPage,
    wallet::WalletPage,
};
use crate::stores::theme_store::{use_theme_store, get_current_theme, Theme};

#[cfg(feature = "web")]
use web_sys::{window, MediaQueryList};

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
fn Transaction(cx: Scope, #[allow(unused_variables)] id: String) -> Element {
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
fn NotFound(cx: Scope, #[allow(unused_variables)] route: Vec<String>) -> Element {
    cx.render(rsx! { NotFoundPage {} })
}

// Main App component
pub fn App(cx: Scope) -> Element {
    let theme_store = use_theme_store(cx);
    let current_theme = get_current_theme(theme_store);
    
    // Apply theme to document body
    use_effect(cx, (&current_theme,), |(theme,)| {
        async move {
            #[cfg(feature = "web")]
            {
                if let Some(window) = web_sys::window() {
                    if let Some(document) = window.document() {
                        if let Some(body) = document.body() {
                            let theme_str = match theme {
                                Theme::Light => "light",
                                Theme::Dark => "dark",
                                Theme::System => {
                                    // Use media query to determine system theme
                                    if let Ok(Some(media_query)) = window.match_media("(prefers-color-scheme: dark)") {
                                        if media_query.matches() { "dark" } else { "light" }
                                    } else {
                                        "light"
                                    }
                                }
                            };
                            let _ = body.set_attribute("data-theme", theme_str);
                        }
                    }
                }
            }
        }
    });
    
    cx.render(rsx! {
        style { include_str!("./assets/styles.css") }
        Router::<Route> {}
    })
}
