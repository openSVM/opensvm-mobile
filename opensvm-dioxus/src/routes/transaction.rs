use dioxus::prelude::*;
use dioxus_router::prelude::*;
use dioxus_free_icons::icons::lucide_icons::{ArrowRightLeft, CheckCircle, XCircle, Clock, DollarSign, FileText};
use dioxus_free_icons::Icon;

use crate::components::copy_button::CopyButton;
use crate::utils::address_utils::{format_address, format_timestamp};
use crate::app::Route;

// Mock transaction data
struct Transaction {
    signature: String,
    slot: u64,
    timestamp: u64,
    fee: f64,
    status: TransactionStatus,
    from: String,
    to: String,
    amount: f64,
    type_: String,
    program_id: String,
    logs: Vec<String>,
}

enum TransactionStatus {
    Success,
    Failed,
    Pending,
}

#[component]
pub fn TransactionPage(cx: Scope) -> Element {
    let params = use_params(cx);
    let id = params.id.clone();
    let is_loading = use_state(cx, || true);
    let transaction = use_state(cx, || None::<Transaction>);
    let navigator = use_navigator(cx);
    
    // Simulate loading transaction data
    use_effect(cx, (), |_| {
        to_owned![is_loading, transaction, id];
        async move {
            // Simulate network delay
            gloo::timers::future::TimeoutFuture::new(1000).await;
            
            // Create mock transaction data
            let tx = Transaction {
                signature: id,
                slot: 323139497,
                timestamp: chrono::Utc::now().timestamp() as u64 - 3600, // 1 hour ago
                fee: 0.000005,
                status: TransactionStatus::Success,
                from: "7nzUHcqRVGVsRKLzq9vEG8JqLkQHv6LPCC9JQZy54RVP".to_string(),
                to: "FD1fQiAMEMREpJQQVag1JGCGwYY5hKtLu3rtbJfiTeGP".to_string(),
                amount: 1.5,
                type_: "Transfer".to_string(),
                program_id: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA".to_string(),
                logs: vec![
                    "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]".to_string(),
                    "Program log: Transfer 1.5 SOL".to_string(),
                    "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success".to_string(),
                ],
            };
            
            transaction.set(Some(tx));
            is_loading.set(false);
        }
    });
    
    // Handle account click
    let handle_account_click = move |address: String| {
        navigator.push(Route::Account { id: address });
    };
    
    if *is_loading.get() {
        cx.render(rsx! {
            div { class: "container mx-auto p-4 flex justify-center items-center min-h-[50vh]",
                p { class: "text-secondary", "Loading transaction details..." }
            }
        })
    } else if let Some(tx) = transaction.get() {
        cx.render(rsx! {
            div { class: "container mx-auto p-4",
                // Transaction header
                div { class: "transaction-header",
                    Icon { icon: ArrowRightLeft, width: 20, height: 20, fill: "var(--primary)" }
                    h1 { class: "text-xl font-bold mono", "{tx.type_}" }
                    
                    // Status badge
                    div {
                        class: "status-badge",
                        class: match tx.status {
                            TransactionStatus::Success => "success",
                            TransactionStatus::Failed => "error",
                            TransactionStatus::Pending => "",
                        },
                        
                        match tx.status {
                            TransactionStatus::Success => rsx! {
                                Icon { icon: CheckCircle, width: 14, height: 14, fill: "var(--success)" }
                                span { "Success" }
                            },
                            TransactionStatus::Failed => rsx! {
                                Icon { icon: XCircle, width: 14, height: 14, fill: "var(--error)" }
                                span { "Failed" }
                            },
                            TransactionStatus::Pending => rsx! {
                                Icon { icon: Clock, width: 14, height: 14, fill: "var(--warning)" }
                                span { "Pending" }
                            },
                        }
                    }
                }
                
                // Overview section
                div { class: "card",
                    h2 { class: "text-lg font-bold mb-4", "Overview" }
                    
                    div { class: "info-row",
                        span { class: "info-label", "Signature" }
                        div { class: "flex items-center gap-2",
                            span { class: "info-value overflow-hidden text-ellipsis", "{tx.signature}" }
                            CopyButton { text: &tx.signature }
                        }
                    }
                    
                    div { class: "info-row",
                        span { class: "info-label", "Timestamp" }
                        span { class: "info-value", "{format_timestamp(tx.timestamp)}" }
                    }
                    
                    div { class: "info-row",
                        span { class: "info-label", "Slot" }
                        span { class: "info-value", "{tx.slot}" }
                    }
                    
                    div { class: "info-row",
                        span { class: "info-label", "Fee" }
                        span { class: "info-value", "{tx.fee} SOL" }
                    }
                }
                
                // Transaction details section
                div { class: "card",
                    h2 { class: "text-lg font-bold mb-4", "Transaction Details" }
                    
                    // From address
                    div { class: "mb-3",
                        span { class: "info-label block mb-1", "From" }
                        div { 
                            class: "address-container cursor-pointer",
                            onclick: move |_| handle_account_click(tx.from.clone()),
                            
                            span { class: "address-text", "{format_address(&tx.from)}" }
                            CopyButton { text: &tx.from }
                        }
                    }
                    
                    // Arrow
                    div { class: "flex justify-center my-3",
                        Icon { icon: FaExchangeAlt, width: 20, height: 20, fill: "var(--text-secondary)" }
                    }
                    
                    // To address
                    div { class: "mb-3",
                        span { class: "info-label block mb-1", "To" }
                        div { 
                            class: "address-container cursor-pointer",
                            onclick: move |_| handle_account_click(tx.to.clone()),
                            
                            span { class: "address-text", "{format_address(&tx.to)}" }
                            CopyButton { text: &tx.to }
                        }
                    }
                    
                    // Amount
                    div { class: "amount-container",
                        span { class: "amount-label", "Amount" }
                        span { class: "amount-value", "{tx.amount} SOL" }
                    }
                }
                
                // Program section
                div { class: "card",
                    h2 { class: "text-lg font-bold mb-4", "Program" }
                    
                    div { class: "address-container",
                        span { class: "address-text", "{format_address(&tx.program_id)}" }
                        CopyButton { text: &tx.program_id }
                    }
                }
                
                // Logs section
                div { class: "card",
                    h2 { class: "text-lg font-bold mb-4", "Logs" }
                    
                    div { class: "bg-surface p-4 rounded border font-mono text-sm",
                        tx.logs.iter().map(|log| {
                            rsx! {
                                div { class: "mb-1", "{log}" }
                            }
                        })
                    }
                }
            }
        })
    } else {
        cx.render(rsx! {
            div { class: "container mx-auto p-4 flex justify-center items-center min-h-[50vh]",
                p { class: "text-error", "Transaction not found" }
            }
        })
    }
}