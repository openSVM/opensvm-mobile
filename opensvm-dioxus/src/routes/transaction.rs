//! Transaction page

use dioxus::prelude::*;
use crate::utils::api::{TransactionDetails};

#[derive(PartialEq, Props)]
pub struct TransactionPageProps {
    pub transaction_id: String,
}

/// Transaction page component
pub fn TransactionPage(cx: Scope<TransactionPageProps>) -> Element {
    let transaction_data = use_state(cx, || None::<TransactionDetails>);
    let loading = use_state(cx, || true);
    let error = use_state(cx, || None::<String>);

    // Fetch transaction data when component mounts or transaction_id changes
    use_effect(cx, (&cx.props.transaction_id,), |(transaction_id,)| {
        let transaction_data = transaction_data.clone();
        let loading = loading.clone();
        let error = error.clone();
        let transaction_id = transaction_id.clone();

        async move {
            loading.set(true);
            error.set(None);

            #[cfg(feature = "web")]
            {
                use crate::utils::api::web::fetch_transaction;
                match fetch_transaction(&transaction_id).await {
                    Ok(Some(data)) => {
                        transaction_data.set(Some(data));
                    }
                    Ok(None) => {
                        error.set(Some("Transaction not found".to_string()));
                    }
                    Err(e) => {
                        error.set(Some(format!("Error fetching transaction: {:?}", e)));
                    }
                }
            }

            #[cfg(not(feature = "web"))]
            {
                // For desktop/mobile, implement later or use mock data
                error.set(Some("Transaction fetching not implemented for this platform".to_string()));
            }

            loading.set(false);
        }
    });

    cx.render(rsx! {
        div { class: "transaction-page",
            h1 { "Transaction Details" }
            
            if *loading.get() {
                rsx! {
                    div { class: "loading",
                        p { "Loading transaction..." }
                    }
                }
            } else if let Some(error_msg) = error.get() {
                rsx! {
                    div { class: "error",
                        p { "Error: {error_msg}" }
                        p { "Transaction ID: {cx.props.transaction_id}" }
                    }
                }
            } else if let Some(transaction) = transaction_data.get() {
                rsx! {
                    div { class: "transaction-details",
                        render_transaction_info { transaction: transaction.clone() }
                    }
                }
            } else {
                rsx! {
                    div { class: "not-found",
                        p { "Transaction not found" }
                        p { "Transaction ID: {cx.props.transaction_id}" }
                    }
                }
            }
        }
    })
}

#[derive(PartialEq, Props)]
struct TransactionInfoProps {
    transaction: TransactionDetails,
}

fn render_transaction_info(cx: Scope<TransactionInfoProps>) -> Element {
    let tx = &cx.props.transaction;
    
    cx.render(rsx! {
        div { class: "transaction-info",
            div { class: "section",
                h2 { "Overview" }
                div { class: "info-grid",
                    div { class: "info-item",
                        span { class: "label", "Signature:" },
                        span { class: "value mono", 
                            if !tx.transaction.signatures.is_empty() {
                                &tx.transaction.signatures[0]
                            } else {
                                "N/A"
                            }
                        }
                    },
                    
                    match tx.slot {
                        Some(slot) => rsx! {
                            div { class: "info-item",
                                span { class: "label", "Slot:" },
                                span { class: "value", "{slot}" }
                            }
                        },
                        None => rsx! { div {} }
                    },
                    
                    match tx.block_time {
                        Some(block_time) => rsx! {
                            div { class: "info-item",
                                span { class: "label", "Block Time:" },
                                span { class: "value", "{format_timestamp(block_time)}" }
                            }
                        },
                        None => rsx! { div {} }
                    },
                    
                    match &tx.meta {
                        Some(meta) => rsx! {
                            div { class: "info-item",
                                span { class: "label", "Fee:" },
                                span { class: "value", "{meta.fee} lamports" }
                            },
                            div { class: "info-item",
                                span { class: "label", "Status:" },
                                span { class: "value", 
                                    if meta.err.is_some() { 
                                        "Failed" 
                                    } else { 
                                        "Success" 
                                    }
                                }
                            }
                        },
                        None => rsx! { div {} }
                    }
                }
            }

            div { class: "section",
                h2 { "Account Keys" }
                div { class: "account-list",
                    for (i, account) in tx.transaction.message.account_keys.iter().enumerate() {
                        div { class: "account-item",
                            span { class: "index", "#{i}" },
                            span { class: "address mono", "{account}" }
                        }
                    }
                }
            }

            div { class: "section",
                h2 { "Instructions" }
                div { class: "instruction-list",
                    for (i, instruction) in tx.transaction.message.instructions.iter().enumerate() {
                        div { class: "instruction-item",
                            h3 { "Instruction #{i + 1}" },
                            div { class: "instruction-details",
                                div { class: "info-item",
                                    span { class: "label", "Program:" },
                                    span { class: "value mono", 
                                        if let Some(program_key) = tx.transaction.message.account_keys.get(instruction.program_id_index as usize) {
                                            program_key
                                        } else {
                                            "Unknown"
                                        }
                                    }
                                },
                                div { class: "info-item",
                                    span { class: "label", "Data:" },
                                    span { class: "value mono small", "{instruction.data}" }
                                }
                            }
                        }
                    }
                }
            }

            match &tx.meta {
                Some(meta) => match &meta.log_messages {
                    Some(logs) => rsx! {
                        div { class: "section",
                            h2 { "Log Messages" },
                            div { class: "logs",
                                for log in logs {
                                    div { class: "log-item", "{log}" }
                                }
                            }
                        }
                    },
                    None => rsx! { div {} }
                },
                None => rsx! { div {} }
            }
        }
    })
}

fn format_timestamp(timestamp: i64) -> String {
    use chrono::{DateTime, Utc};
    DateTime::<Utc>::from_timestamp(timestamp, 0)
        .map(|dt| dt.format("%Y-%m-%d %H:%M:%S UTC").to_string())
        .unwrap_or_else(|| timestamp.to_string())
}
