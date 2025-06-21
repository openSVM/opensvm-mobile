//! 404 Not Found page

use dioxus::prelude::*;

/// Not Found page component
pub fn NotFoundPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "not-found-page",
            h1 { "404 - Page Not Found" }
            p { "The page you are looking for does not exist." }
        }
    })
}
