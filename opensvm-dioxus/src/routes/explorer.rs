//! Explorer page

use dioxus::prelude::*;

/// Explorer page component
pub fn ExplorerPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "explorer-page",
            h1 { "Solana Explorer" }
            p { "Search for transactions, blocks, and accounts on the Solana blockchain." }
        }
    })
}