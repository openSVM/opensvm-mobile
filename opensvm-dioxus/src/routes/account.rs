use dioxus::prelude::*;
use dioxus_router::prelude::*;
use dioxus_free_icons::icons::lucide_icons::{User, Copy, ExternalLink};
use dioxus_free_icons::Icon;

use crate::components::copy_button::CopyButton;
use crate::components::transaction_list::TransactionList;
use crate::utils::address_utils::format_timestamp;

// Mock account data
struct Account {
    address: String,
    balance: f64,
    owner: String,
    executable: bool,
    rent_epoch: u64,
    created_at: u64,
}

#[component]
pub fn AccountPage(cx: Scope) -> Element {
    let params = use_params(cx);
    let id = params.id.clone();
    let is_loading = use_state(cx, || true);
    let account = use_state(cx, || None::<Account>);
    
    // Simulate loading account data
    use_effect(cx, (), |_| {
        to_owned![is_loading, account, id];
        async move {
            // Simulate network delay
            gloo::timers::future::TimeoutFuture::new(1000).await;
            
            // Create mock account data
            let acc = Account {
                address: id,
                balance: 123.45,
                owner: "11111111111111111111111111111111".to_string(),
                executable: false,
                rent_epoch: 361,
                created_at: chrono::Utc::now().timestamp() as u64 - 86400 * 30, // 30 days ago
            };
            
            account.set(Some(acc));
            is_loading.set(false);
        }
    });
    
    if *is_loading.get() {
        cx.render(rsx! {
            div { class: "container mx-auto p-4 flex justify-center items-center min-h-[50vh]",
                p { class: "text-secondary", "Loading account details..." }
            }
        })
    } else if let Some(acc) = account.get() {
        cx.render(rsx! {
            div { class: "container mx-auto p-4",
                // Account header
                div { class: "flex items-center gap-3 mb-6",
                    Icon { icon: User, width: 24, height: 24, fill: "var(--primary)" }
                    h1 { class: "text-xl font-bold mono", "Account Details" }
                }
                
                // Account address
                div { class: "card mb-6",
                    h2 { class: "text-lg font-bold mb-4", "Address" }
                    
                    div { class: "flex items-center justify-between p-3 bg-surface rounded border",
                        p { class: "mono text-sm break-all", "{acc.address}" }
                        
                        div { class: "flex items-center gap-2 ml-2",
                            CopyButton { text: &acc.address }
                            
                            button { class: "bg-transparent border-none cursor-pointer",
                                Icon { 
                                    icon: ExternalLink,
                                    width: 20,
                                    height: 20,
                                    fill: "var(--text-secondary)"
                                }
                            }
                        }
                    }
                }
                
                // Account overview
                div { class: "card mb-6",
                    h2 { class: "text-lg font-bold mb-4", "Overview" }
                    
                    // Balance
                    div { class: "flex items-center justify-between p-4 bg-[var(--primary-light)] rounded mb-4",
                        span { class: "text-secondary", "Balance" }
                        span { class: "text-xl font-bold mono text-[var(--primary)]", "{acc.balance} SOL" }
                    }
                    
                    // Other details
                    div { class: "info-row",
                        span { class: "info-label", "Owner" }
                        span { class: "info-value mono", "{acc.owner}" }
                    }
                    
                    div { class: "info-row",
                        span { class: "info-label", "Executable" }
                        span { class: "info-value", if acc.executable { "Yes" } else { "No" } }
                    }
                    
                    div { class: "info-row",
                        span { class: "info-label", "Rent Epoch" }
                        span { class: "info-value", "{acc.rent_epoch}" }
                    }
                    
                    div { class: "info-row",
                        span { class: "info-label", "Created At" }
                        span { class: "info-value", "{format_timestamp(acc.created_at)}" }
                    }
                }
                
                // Account transactions
                TransactionList { title: Some("Account Transactions".to_string()) }
            }
        })
    } else {
        cx.render(rsx! {
            div { class: "container mx-auto p-4 flex justify-center items-center min-h-[50vh]",
                p { class: "text-error", "Account not found" }
            }
        })
    }
}