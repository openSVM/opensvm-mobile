//! Account page

use dioxus::prelude::*;

/// Account page component
pub fn AccountPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "account-page",
            h1 { "Account Details" }
            p { "View detailed information about Solana accounts and their balances." }
        }
    })
}
