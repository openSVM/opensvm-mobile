use dioxus::prelude::*;
use dioxus_free_icons::icons::lucide_icons::{ArrowRightLeft, ChevronRight};
use dioxus_free_icons::Icon;
use dioxus_router::prelude::*;

use crate::app::Route;
use crate::utils::address_utils::{format_address, format_timestamp};

// Transaction item type
#[derive(Clone, PartialEq)]
pub struct Transaction {
    pub signature: String,
    pub timestamp: u64,
    pub from: String,
    pub to: String,
    pub amount: f64,
    pub status: TransactionStatus,
}

// Transaction status enum
#[derive(Clone, PartialEq)]
pub enum TransactionStatus {
    Success,
    Failed,
    Pending,
}

// Props for the transaction list component
#[derive(Props)]
pub struct TransactionListProps {
    #[props(optional)]
    pub transactions: Option<Vec<Transaction>>,
    #[props(optional)]
    pub is_loading: Option<bool>,
    #[props(optional)]
    pub title: Option<String>,
}

// Transaction list component
#[component]
pub fn TransactionList(cx: Scope<TransactionListProps>) -> Element {
    let navigator = use_navigator(cx);
    let is_loading = cx.props.is_loading.unwrap_or(false);
    let title = cx.props.title.clone().unwrap_or_else(|| "Recent Transactions".to_string());
    
    // Mock transactions if none provided
    let transactions = if let Some(txs) = &cx.props.transactions {
        txs.clone()
    } else {
        vec![
            Transaction {
                signature: "7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP".to_string(),
                timestamp: chrono::Utc::now().timestamp() as u64 - 3600, // 1 hour ago
                from: "7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP".to_string(),
                to: "FD1fQiAMEMREpJQQVag1JGCGwYY5hKtLu3rtbJfiTeGP".to_string(),
                amount: 1.5,
                status: TransactionStatus::Success,
            },
            Transaction {
                signature: "8nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP".to_string(),
                timestamp: chrono::Utc::now().timestamp() as u64 - 7200, // 2 hours ago
                from: "FD1fQiAMEMREpJQQVag1JGCGwYY5hKtLu3rtbJfiTeGP".to_string(),
                to: "7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP".to_string(),
                amount: 0.5,
                status: TransactionStatus::Success,
            },
            Transaction {
                signature: "9nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP".to_string(),
                timestamp: chrono::Utc::now().timestamp() as u64 - 10800, // 3 hours ago
                from: "7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP".to_string(),
                to: "GD1fQiAMEMREpJQQVag1JGCGwYY5hKtLu3rtbJfiTeGP".to_string(),
                amount: 2.0,
                status: TransactionStatus::Failed,
            },
        ]
    };
    
    // Handle transaction click
    let handle_transaction_click = move |signature: String| {
        navigator.push(Route::Transaction { id: signature });
    };
    
    cx.render(rsx! {
        div { class: "card",
            h3 { class: "text-lg font-bold mb-4", "{title}" }
            
            if is_loading {
                rsx! {
                    div { class: "p-4 text-center text-secondary", "Loading transactions..." }
                }
            } else if transactions.is_empty() {
                rsx! {
                    div { class: "p-4 text-center text-secondary", "No transactions found" }
                }
            } else {
                rsx! {
                    div { class: "space-y-2",
                        transactions.iter().map(|tx| {
                            let signature_clone = tx.signature.clone();
                            rsx! {
                                div {
                                    key: "{tx.signature}",
                                    class: "flex items-center justify-between p-3 bg-surface rounded border cursor-pointer hover:bg-[var(--surface-light)]",
                                    onclick: move |_| handle_transaction_click(signature_clone.clone()),
                                    
                                    div { class: "flex items-center gap-3",
                                        // Transaction icon with status color
                                        div {
                                            class: match tx.status {
                                                TransactionStatus::Success => "text-[var(--success)]",
                                                TransactionStatus::Failed => "text-[var(--error)]",
                                                TransactionStatus::Pending => "text-[var(--warning)]",
                                            },
                                            Icon { icon: ArrowRightLeft, width: 16, height: 16 }
                                        }
                                        
                                        // Transaction details
                                        div { class: "flex flex-col",
                                            div { class: "flex items-center gap-2",
                                                span { class: "text-sm font-bold", "From: " }
                                                span { class: "text-sm mono", "{format_address(&tx.from)}" }
                                            }
                                            div { class: "flex items-center gap-2",
                                                span { class: "text-sm font-bold", "To: " }
                                                span { class: "text-sm mono", "{format_address(&tx.to)}" }
                                            }
                                            div { class: "text-xs text-secondary", "{format_timestamp(tx.timestamp)}" }
                                        }
                                    }
                                    
                                    // Amount and arrow
                                    div { class: "flex items-center gap-3",
                                        span { class: "font-bold", "{tx.amount} SOL" }
                                        Icon { icon: ChevronRight, width: 16, height: 16, fill: "var(--text-secondary)" }
                                    }
                                }
                            }
                        })
                    }
                }
            }
        }
    })
}