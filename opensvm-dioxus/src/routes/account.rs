//! Account page

use dioxus::prelude::*;
use dioxus_router::prelude::*;
use crate::utils::api::{AccountInfo, TransactionSignature};
#[cfg(feature = "desktop")]
use crate::utils::api::SolanaApiClient;

#[derive(Props, PartialEq)]
pub struct AccountPageProps {
    address: String,
}

/// Account page component
pub fn AccountPage(cx: Scope<AccountPageProps>) -> Element {
    let account_info = use_state(cx, || Option::<AccountInfo>::None);
    let transactions = use_state(cx, || Vec::<TransactionSignature>::new());
    let loading = use_state(cx, || true);
    let error = use_state(cx, || Option::<String>::None);

    // Load account data on mount or when address changes
    use_effect(cx, (&cx.props.address,), |(address,)| {
        let account_info = account_info.to_owned();
        let transactions = transactions.to_owned();
        let loading = loading.to_owned();
        let error = error.to_owned();
        let address = address.clone();
        
        async move {
            loading.set(true);
            error.set(None);
            
            #[cfg(feature = "web")]
            {
                match crate::utils::api::web::fetch_account_info(&address).await {
                    Ok(info) => {
                        account_info.set(info);
                        loading.set(false);
                    }
                    Err(e) => {
                        error.set(Some(format!("Failed to load account: {:?}", e)));
                        loading.set(false);
                    }
                }
            }
            
            #[cfg(not(feature = "web"))]
            {
                let client = SolanaApiClient::new();
                
                // Fetch account info
                match client.get_account_info(&address).await {
                    Ok(info) => {
                        account_info.set(info);
                        
                        // Fetch recent transactions
                        match client.get_signatures_for_address(&address, 10).await {
                            Ok(sigs) => {
                                transactions.set(sigs);
                            }
                            Err(e) => {
                                log::warn!("Failed to load transactions: {}", e);
                            }
                        }
                        
                        loading.set(false);
                    }
                    Err(e) => {
                        error.set(Some(format!("Failed to load account: {}", e)));
                        loading.set(false);
                    }
                }
            }
        }
    });

    let sol_balance = account_info.get()
        .as_ref()
        .map(|info| info.lamports as f64 / 1_000_000_000.0)
        .unwrap_or(0.0);

    cx.render(rsx! {
        div { class: "account-page",
            // Header section
            div { class: "header-section",
                h1 { class: "page-title", "Account Details" }
                div { class: "account-address",
                    span { class: "address-label", "Address: " }
                    code { class: "address-value", "{cx.props.address}" }
                    button { 
                        class: "copy-button",
                        onclick: move |_| {
                            // Copy to clipboard functionality would go here
                            log::info!("Copying address to clipboard");
                        },
                        "📋 Copy"
                    }
                }
            }

            if **loading {
                rsx! {
                    div { class: "loading-section",
                        div { class: "loading-spinner" }
                        p { "Loading account information..." }
                    }
                }
            } else if let Some(err) = error.get() {
                rsx! {
                    div { class: "error-section",
                        div { class: "error-message",
                            h3 { "Error Loading Account" }
                            p { "{err}" }
                            button { 
                                class: "retry-button",
                                onclick: move |_| {
                                    // Trigger reload
                                    loading.set(true);
                                },
                                "🔄 Retry"
                            }
                        }
                    }
                }
            } else {
                rsx! {
                    div { class: "account-content",
                        // Account overview
                        div { class: "account-overview",
                            h2 { "Overview" }
                            div { class: "overview-grid",
                                div { class: "overview-card",
                                    h3 { "Balance" }
                                    p { class: "balance-value", "{sol_balance:.9} SOL" }
                                    p { class: "balance-lamports", "({account_info.get().as_ref().map(|info| info.lamports).unwrap_or(0)} lamports)" }
                                }
                                div { class: "overview-card",
                                    h3 { "Owner" }
                                    code { class: "owner-address", 
                                        "{account_info.get().map(|info| info.owner.as_str()).unwrap_or(\"Unknown\")}" 
                                    }
                                }
                                div { class: "overview-card",
                                    h3 { "Executable" }
                                    p { class: "executable-status",
                                        if account_info.get().map(|info| info.executable).unwrap_or(false) {
                                            "✅ Yes"
                                        } else {
                                            "❌ No"
                                        }
                                    }
                                }
                                div { class: "overview-card",
                                    h3 { "Rent Epoch" }
                                    p { "{account_info.get().map(|info| info.rent_epoch).unwrap_or(0)}" }
                                }
                            }
                        }

                        // Account data section
                        if let Some(info) = account_info.get() {
                            if !info.data.is_empty() {
                                rsx! {
                                    div { class: "account-data-section",
                                        h2 { "Account Data" }
                                        div { class: "data-container",
                                            h3 { "Raw Data ({info.data.len()} bytes)" }
                                            div { class: "data-preview",
                                                code { class: "data-hex",
                                                    // Show first few bytes of data
                                                    if let Some(first_data) = info.data.first() {
                                                        format!("{}...", &first_data[..std::cmp::min(first_data.len(), 100)])
                                                    } else {
                                                        "No data".to_string()
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                rsx! {
                                    div { class: "account-data-section",
                                        h2 { "Account Data" }
                                        p { class: "no-data", "This account has no data" }
                                    }
                                }
                            }
                        }

                        // Recent transactions section
                        div { class: "transactions-section",
                            h2 { "Recent Transactions" }
                            if transactions.is_empty() {
                                rsx! {
                                    p { class: "no-transactions", "No recent transactions found" }
                                }
                            } else {
                                rsx! {
                                    div { class: "transactions-list",
                                        p { "Transaction list functionality temporarily disabled for compilation" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}
