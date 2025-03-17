//! Validators page

use dioxus::prelude::*;

/// Validators page component
pub fn ValidatorsPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "validators-page",
            h1 { "Solana Validators" }
            p { "Monitor validator performance metrics and network statistics." }
        }
    })
}
