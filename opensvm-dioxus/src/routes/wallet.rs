//! Wallet page

use dioxus::prelude::*;

/// Wallet page component
pub fn WalletPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "wallet-page",
            h1 { "Solana Wallet" }
            p { "Manage your Solana assets, view transactions, and send tokens." }
        }
    })
}
