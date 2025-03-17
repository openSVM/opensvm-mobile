use dioxus::prelude::*;
use dioxus_router::prelude::*;
use dioxus_free_icons::icons::lucide_icons::{Search, X, Loader};
use dioxus_free_icons::Icon;
use wasm_bindgen_futures::spawn_local;

use crate::utils::address_utils::parse_search_input;
use crate::app::Route;

#[derive(Props)]
pub struct SearchBarProps<'a> {
    #[props(optional)]
    pub placeholder: Option<&'a str>,
    #[props(optional)]
    pub on_search: Option<EventHandler<'a, String>>,
}

#[component]
pub fn SearchBar<'a>(cx: Scope<'a, SearchBarProps<'a>>) -> Element {
    let query = use_state(cx, String::new);
    let is_searching = use_state(cx, || false);
    let is_focused = use_state(cx, || false);
    let navigator = use_navigator(cx);
    
    let placeholder = cx.props.placeholder.unwrap_or("Search transactions, accounts, blocks...");
    
    let handle_submit = move |_| {
        let query_value = query.get().clone();
        if query_value.trim().is_empty() {
            return;
        }
        
        is_searching.set(true);
        
        // Parse the search query to determine what type of data it is
        let search_result = parse_search_input(&query_value);
        
        // If on_search prop is provided, call it
        if let Some(on_search) = &cx.props.on_search {
            on_search.call(query_value.clone());
        }
        
        // Clone values for the async block
        let navigator = navigator.clone();
        let is_searching = is_searching.clone();
        let search_result = search_result.clone();
        
        // Simulate search delay
        spawn_local(async move {
            // Simulate network delay
            gloo::timers::future::TimeoutFuture::new(1000).await;
            
            // Navigate based on the type of input
            if search_result.is_valid {
                match search_result.type_ {
                    crate::utils::address_utils::SearchInputType::Transaction => {
                        navigator.push(Route::Transaction { id: search_result.value });
                    },
                    crate::utils::address_utils::SearchInputType::Account => {
                        navigator.push(Route::Account { id: search_result.value });
                    },
                    crate::utils::address_utils::SearchInputType::Block => {
                        log::info!("Searching for block: {}", search_result.value);
                        // Not implemented yet
                    },
                    _ => {
                        log::info!("General search for: {}", search_result.value);
                    }
                }
            } else {
                log::info!("Invalid search query: {}", query_value);
                // Could show an error message here
            }
            
            is_searching.set(false);
        });
    };
    
    let handle_clear = move |_| {
        query.set(String::new());
    };
    
    cx.render(rsx! {
        div { class: "p-4 flex flex-col items-center gap-2",
            h1 { class: "text-xl font-bold mono", "OpenSVM Explorer" }
            p { class: "text-secondary mb-4 mono", "The quieter you become, the more you are able to hear." }
            
            div { class: "search-container w-full max-w-[600px]",
                div { 
                    class: "flex items-center bg-surface rounded border p-3 gap-2 flex-1",
                    class: if *is_focused.get() { "border-[var(--primary)]" } else { "" },
                    
                    // Search or loading icon
                    if *is_searching.get() {
                        rsx! {
                            div { class: "animate-spin",
                                Icon { 
                                    icon: Loader,
                                    width: 18,
                                    height: 18,
                                    fill: "var(--primary)"
                                }
                            }
                        }
                    } else {
                        rsx! {
                            Icon { 
                                icon: Search,
                                width: 18,
                                height: 18,
                                fill: if *is_focused.get() { "var(--primary)" } else { "var(--text-secondary)" }
                            }
                        }
                    }
                    
                    // Search input
                    input {
                        class: "flex-1 bg-transparent border-none outline-none mono",
                        placeholder: "{placeholder}",
                        value: "{query}",
                        oninput: move |e| query.set(e.value.clone()),
                        onkeydown: move |e| {
                            if e.key() == "Enter" {
                                handle_submit(());
                            }
                        },
                        onfocus: move |_| is_focused.set(true),
                        onblur: move |_| is_focused.set(false),
                    }
                    
                    // Clear button
                    if !query.is_empty() {
                        rsx! {
                            button {
                                class: "bg-transparent border-none cursor-pointer",
                                onclick: handle_clear,
                                Icon { 
                                    icon: FaTimes,
                                    width: 18,
                                    height: 18,
                                    fill: "var(--text-secondary)"
                                }
                            }
                        }
                    }
                }
                
                // Search button
                button {
                    class: "search-button",
                    class: if *is_searching.get() || query.is_empty() { "opacity-70 cursor-not-allowed" } else { "" },
                    disabled: *is_searching.get() || query.is_empty(),
                    onclick: handle_submit,
                    if *is_searching.get() { "Searching..." } else { "Search" }
                }
            }
        }
    })
}