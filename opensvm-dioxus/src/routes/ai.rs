use dioxus::prelude::*;
use crate::components::ai_assistant::AIAssistant;

#[component(no_case_check)]
pub fn AIPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "container mx-auto p-4",
            h1 { class: "text-xl font-bold mb-4 mono", "AI Assistant" }
            p { class: "text-secondary mb-6", "Get help with OpenSVM blockchain questions and transactions." }
            
            // Use the AI Assistant component with expanded=true
            AIAssistant { expanded: true }
        }
    })
}