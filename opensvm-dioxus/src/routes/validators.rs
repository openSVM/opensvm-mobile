use dioxus::prelude::*;
use crate::components::validator_analytics::ValidatorAnalytics;

#[component]
pub fn ValidatorsPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "container mx-auto p-4",
            h1 { class: "text-xl font-bold mb-4 mono", "Validators" }
            p { class: "text-secondary mb-6", "Explore the network validators and their performance metrics." }
            
            // Reuse the validator analytics component
            ValidatorAnalytics {}
        }
    })
}