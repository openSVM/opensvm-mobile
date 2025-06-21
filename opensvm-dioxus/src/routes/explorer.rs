//! Explorer page

use dioxus::prelude::*;
use dioxus::events::{MouseData, KeyboardData};
use crate::utils::api::NetworkStats;
#[cfg(feature = "desktop")]
use crate::utils::api::SolanaApiClient;

/// Explorer page component
pub fn ExplorerPage(cx: Scope) -> Element {
    let network_stats = use_state(cx, || Option::<NetworkStats>::None);
    let loading = use_state(cx, || true);
    let error = use_state(cx, || Option::<String>::None);
    let search_input = use_state(cx, || String::new());

    // Load network stats on component mount
    use_effect(cx, (), |_| {
        let network_stats = network_stats.to_owned();
        let loading = loading.to_owned();
        let error = error.to_owned();
        
        async move {
            #[cfg(feature = "web")]
            {
                match crate::utils::api::web::fetch_network_stats().await {
                    Ok(stats) => {
                        network_stats.set(Some(stats));
                        loading.set(false);
                    }
                    Err(e) => {
                        error.set(Some(format!("Failed to load network stats: {:?}", e)));
                        loading.set(false);
                    }
                }
            }
            
            #[cfg(not(feature = "web"))]
            {
                let client = SolanaApiClient::new();
                match client.get_network_stats().await {
                    Ok(stats) => {
                        network_stats.set(Some(stats));
                        loading.set(false);
                    }
                    Err(e) => {
                        error.set(Some(format!("Failed to load network stats: {}", e)));
                        loading.set(false);
                    }
                }
            }
        }
    });

    let handle_search = move |_evt: Event<MouseData>| {
        let search_term = search_input.get().trim();
        if !search_term.is_empty() {
            // In a real implementation, this would navigate to account/transaction details
            log::info!("Searching for: {}", search_term);
        }
    };

    cx.render(rsx! {
        div { class: "explorer-page",
            // Header section
            div { class: "header-section",
                h1 { class: "page-title", "Solana Explorer" }
                p { class: "page-description", 
                    "Explore the Solana blockchain with real-time data and AI assistance" 
                }
                
                // Search bar
                div { class: "search-section",
                    div { class: "search-container",
                        input {
                            class: "search-input",
                            placeholder: "Search for addresses, transactions, blocks...",
                            value: "{search_input}",
                            oninput: move |evt| search_input.set(evt.value.clone()),
                            onkeypress: move |evt| {
                                if evt.data.key().to_string() == "Enter" {
                                    // Simulate a mouse event for the search handler
                                    let search_term = search_input.get().trim();
                                    if !search_term.is_empty() {
                                        log::info!("Searching for: {}", search_term);
                                    }
                                }
                            }
                        }
                        button {
                            class: "search-button",
                            onclick: handle_search,
                            "🔍 Search"
                        }
                    }
                }
            }

            // Network stats section
            div { class: "network-stats-section",
                h2 { "Network Overview" }
                
                if **loading {
                    rsx! {
                        div { class: "loading",
                            "Loading network statistics..."
                        }
                    }
                } else if let Some(err) = error.get() {
                    rsx! {
                        div { class: "error",
                            "Error: {err}"
                        }
                    }
                } else if let Some(stats) = network_stats.get() {
                    rsx! {
                        div { class: "stats-grid",
                            div { class: "stat-card",
                                h3 { "Total Supply" }
                                p { class: "stat-value", 
                                    "{stats.total_supply / 1_000_000_000} SOL" 
                                }
                            }
                            div { class: "stat-card",
                                h3 { "Circulating Supply" }
                                p { class: "stat-value", 
                                    "{stats.circulating_supply / 1_000_000_000} SOL" 
                                }
                            }
                            div { class: "stat-card",
                                h3 { "Current Slot" }
                                p { class: "stat-value", "{stats.current_slot}" }
                            }
                            div { class: "stat-card",
                                h3 { "Current Epoch" }
                                p { class: "stat-value", "{stats.epoch}" }
                            }
                            div { class: "stat-card",
                                h3 { "Validators" }
                                p { class: "stat-value", "{stats.validator_count}" }
                            }
                            div { class: "stat-card",
                                h3 { "Avg Slot Time" }
                                p { class: "stat-value", "{stats.avg_slot_time:.2}s" }
                            }
                        }
                    }
                }
            }

            // Quick actions section
            div { class: "quick-actions-section",
                h2 { "Quick Actions" }
                div { class: "actions-grid",
                    div { class: "action-card",
                        h3 { "🏛️ Validators" }
                        p { "Monitor validator performance and network health" }
                        button { class: "action-button", "View Validators" }
                    }
                    div { class: "action-card",
                        h3 { "💰 Wallet" }
                        p { "Connect your wallet and manage your assets" }
                        button { class: "action-button", "Connect Wallet" }
                    }
                    div { class: "action-card",
                        h3 { "🤖 AI Assistant" }
                        p { "Get help with blockchain questions and transactions" }
                        button { class: "action-button", "Chat with AI" }
                    }
                    div { class: "action-card",
                        h3 { "📊 Solanow" }
                        p { "Real-time market data and analytics" }
                        button { class: "action-button", "View Markets" }
                    }
                }
            }
        }
    })
}
