//! Transaction page

use dioxus::prelude::*;

/// Transaction page component
pub fn TransactionPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "transaction-page",
            h1 { "Transaction Details" }
            p { "View detailed information about Solana blockchain transactions." }
        }
    })
}
