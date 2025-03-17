use dioxus::prelude::*;
use dioxus_free_icons::icons::lucide_icons::{Copy, Check};
use dioxus_free_icons::Icon;
use wasm_bindgen::prelude::*;
use web_sys::window;
use gloo::timers::callback::Timeout;

#[derive(Props)]
pub struct CopyButtonProps<'a> {
    pub text: &'a str,
}

#[component]
pub fn CopyButton<'a>(cx: Scope<'a, CopyButtonProps<'a>>) -> Element {
    let copied = use_state(cx, || false);
    
    let handle_copy = move |_| {
        let text = cx.props.text.to_string();
        
        // Copy to clipboard using the Clipboard API
        if let Some(window) = window() {
            if let Ok(Some(navigator)) = window.navigator().dyn_into::<web_sys::Navigator>() {
                if let Some(clipboard) = navigator.clipboard() {
                    let _ = clipboard.write_text(&text);
                    copied.set(true);
                    
                    // Reset copied state after 2 seconds
                    let copied_clone = copied.clone();
                    let timeout = Timeout::new(2000, move || {
                        copied_clone.set(false);
                    });
                    timeout.forget();
                }
            }
        }
    };
    
    cx.render(rsx! {
        button {
            class: "bg-transparent border-none cursor-pointer",
            onclick: handle_copy,
            if *copied.get() {
                rsx! {
                    Icon {
                        icon: Check,
                        width: 20,
                        height: 20,
                        fill: "var(--success)"
                    }
                }
            } else {
                rsx! {
                    Icon {
                        icon: FaCopy,
                        width: 20,
                        height: 20,
                        fill: "var(--text-secondary)"
                    }
                }
            }
        }
    })
}