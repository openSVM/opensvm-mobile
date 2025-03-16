use dioxus::prelude::*;
use dioxus_free_icons::icons::lucide_icons::{Bot, Send};
use dioxus_free_icons::Icon;

#[derive(Props)]
pub struct AIAssistantProps {
    #[props(optional)]
    pub expanded: Option<bool>,
}

#[component]
pub fn AIAssistant(cx: Scope<AIAssistantProps>) -> Element {
    let message = use_state(cx, String::new);
    let expanded = cx.props.expanded.unwrap_or(false);
    
    let handle_send = move |_| {
        if message.get().trim().is_empty() {
            return;
        }
        
        log::info!("Sending message: {}", message.get());
        message.set(String::new());
    };
    
    if !expanded {
        return cx.render(rsx! { div {} });
    }
    
    cx.render(rsx! {
        div { class: "p-4",
            div { class: "flex items-center gap-3 mb-6",
                Icon {
                    icon: Bot,
                    width: 24,
                    height: 24,
                    fill: "var(--primary)"
                }
                h2 { class: "text-xl font-bold mono", "AI Assistant" }
            }
            
            div { class: "mb-4",
                p { class: "text-secondary",
                    "Ask me anything about OpenSVM, transactions, or blockchain concepts."
                }
            }
            
            div { class: "flex gap-3 items-end",
                textarea {
                    class: "flex-1 bg-surface rounded border p-4 mono resize-none",
                    style: "min-height: 80px; max-height: 120px;",
                    placeholder: "Type your question...",
                    value: "{message}",
                    oninput: move |e| message.set(e.value.clone()),
                    onkeydown: move |e| {
                        if e.key() == "Enter" && !e.shift_key() {
                            e.prevent_default();
                            handle_send(());
                        }
                    }
                }
                
                button {
                    class: "btn-primary rounded-full p-3",
                    class: if message.get().trim().is_empty() { "opacity-50 cursor-not-allowed" } else { "" },
                    disabled: message.get().trim().is_empty(),
                    onclick: handle_send,
                    
                    Icon {
                        icon: Send,
                        width: 20,
                        height: 20,
                        fill: "white"
                    }
                }
            }
        }
    })
}