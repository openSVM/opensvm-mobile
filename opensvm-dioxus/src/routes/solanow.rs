//! SolaNow page

use dioxus::prelude::*;

/// SolaNow page component
pub fn SolanowPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "solanow-page",
            h1 { "SolaNow" }
            p { "Real-time updates and insights from the Solana network." }
        }
    })
}
