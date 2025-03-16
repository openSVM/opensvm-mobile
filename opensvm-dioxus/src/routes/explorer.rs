use dioxus::prelude::*;
use dioxus_router::prelude::*;
use dioxus_free_icons::icons::lucide_icons::ChevronRight;
use dioxus_free_icons::Icon;

use crate::components::search_bar::SearchBar;
use crate::components::network_stats::NetworkStats;
use crate::components::validator_analytics::ValidatorAnalytics;
use crate::components::ai_assistant::AIAssistant;
use crate::components::transaction_list::TransactionList;
use crate::app::Route;

// Mock data
const MOCK_STATS: [(u64, u64, u64, u64, f64, u64); 1] = [
    (323139497, 1388, 4108, 748, 0.81, 323139497),
];

// Explorer page component
#[component]
pub fn ExplorerPage(cx: Scope) -> Element {
    let is_loading = use_state(cx, || true);
    let search_results = use_state(cx, || None::<Vec<SearchResult>>);
    let navigator = use_navigator(cx);
    
    // Simulate initial loading
    use_effect(cx, (), |_| {
        to_owned![is_loading];
        async move {
            // Simulate network delay
            gloo::timers::future::TimeoutFuture::new(2000).await;
            is_loading.set(false);
        }
    });
    
    // Handle search
    let handle_search = move |query: String| {
        if query.trim().is_empty() {
            search_results.set(None);
            return;
        }
        
        // Simulate search results
        let results = vec![
            SearchResult {
                type_: "transaction".to_string(),
                id: "7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP".to_string(),
                title: "Transaction".to_string(),
            },
            SearchResult {
                type_: "block".to_string(),
                id: "323139497".to_string(),
                title: "Block #323139497".to_string(),
            },
            SearchResult {
                type_: "account".to_string(),
                id: "FD1".to_string(),
                title: "Firedancer Main".to_string(),
            },
        ];
        
        search_results.set(Some(results));
    };
    
    // Handle search result click
    let handle_search_result_click = move |result: &SearchResult| {
        match result.type_.as_str() {
            "transaction" => {
                navigator.push(Route::Transaction { id: result.id.clone() });
            },
            "block" => {
                log::info!("Navigating to block {}", result.id);
                // Not implemented yet
            },
            "account" => {
                navigator.push(Route::Account { id: result.id.clone() });
            },
            _ => {}
        }
        
        search_results.set(None);
    };
    
    // Handle block click
    let handle_block_click = move |block_number: u64| {
        log::info!("Navigating to block {}", block_number);
        // Not implemented yet
    };
    
    cx.render(rsx! {
        div { class: "container mx-auto pb-8",
            // Search bar
            SearchBar { on_search: handle_search }
            
            // Search results or main content
            if let Some(results) = search_results.get() {
                rsx! {
                    div { class: "p-4",
                        h3 { class: "text-lg font-bold mb-4", "Search Results" }
                        
                        div { class: "space-y-2",
                            results.iter().map(|result| {
                                let result_clone = result.clone();
                                rsx! {
                                    div {
                                        key: "{result.id}",
                                        class: "flex items-center justify-between p-3 bg-surface rounded border cursor-pointer hover:bg-[var(--surface-light)]",
                                        onclick: move |_| handle_search_result_click(&result_clone),
                                        
                                        div { class: "flex flex-col",
                                            span { class: "font-bold", "{result.title}" }
                                            span { class: "text-sm mono text-secondary", "{result.id}" }
                                        }
                                        
                                        Icon { icon: ChevronRight, width: 16, height: 16, fill: "var(--text-secondary)" }
                                    }
                                }
                            })
                        }
                    }
                }
            } else {
                rsx! {
                    // Network stats
                    NetworkStats {
                        blocks_processed: MOCK_STATS[0].0,
                        active_validators: MOCK_STATS[0].1,
                        tps: MOCK_STATS[0].2,
                        epoch: MOCK_STATS[0].3,
                        network_load: MOCK_STATS[0].4,
                        block_height: MOCK_STATS[0].5,
                        is_loading: *is_loading.get(),
                    }
                    
                    // Validator analytics
                    ValidatorAnalytics {}
                    
                    // Recent blocks
                    div { class: "p-4",
                        h3 { class: "text-lg font-bold mb-4", "Recent Blocks" }
                        
                        if *is_loading.get() {
                            rsx! {
                                div { class: "p-4 text-center text-secondary", "Loading blocks..." }
                            }
                        } else {
                            rsx! {
                                div { class: "space-y-2",
                                    (0..5).map(|i| {
                                        let block_number = MOCK_STATS[0].0 - i as u64;
                                        rsx! {
                                            div {
                                                key: "{block_number}",
                                                class: "flex items-center justify-between p-3 bg-surface rounded border cursor-pointer hover:bg-[var(--surface-light)]",
                                                onclick: move |_| handle_block_click(block_number),
                                                
                                                span { class: "mono", "Block #{block_number}" }
                                                Icon { icon: ChevronRight, width: 20, height: 20, fill: "var(--text-secondary)" }
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    }
                    
                    // Recent transactions
                    TransactionList {}
                }
            }
            
            // AI Assistant (hidden by default)
            AIAssistant { expanded: false }
        }
    })
}

// Search result type
#[derive(Clone)]
struct SearchResult {
    type_: String,
    id: String,
    title: String,
}