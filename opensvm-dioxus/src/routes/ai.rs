//! AI Assistant page

use dioxus::prelude::*;

/// AI Assistant page component
pub fn AIPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "ai-page",
            h1 { "AI Assistant" }
            p { "Get help with OpenSVM blockchain questions and transactions." }
        }
    })
}
