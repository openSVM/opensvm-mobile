use dioxus::prelude::*;

#[component]
pub fn NotFoundPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "container mx-auto p-4 flex flex-col items-center justify-center min-h-[80vh]",
            h1 { class: "text-xl font-bold mb-4 mono", "404 - Page Not Found" }
            p { class: "text-secondary mb-8", "The page you are looking for does not exist." }
            a { 
                class: "btn btn-primary",
                href: "/",
                "Return to Home"
            }
        }
    })
}