use dioxus::prelude::*;
use dioxus_free_icons::icons::lucide_icons::{Wallet, Copy, ExternalLink};
use dioxus_free_icons::Icon;

use crate::stores::wallet_store::{use_wallet_store, connect_wallet, disconnect_wallet};
use crate::components::copy_button::CopyButton;
use crate::components::transaction_list::TransactionList;

#[component]
pub fn WalletPage(cx: Scope) -> Element {
    let wallet = use_wallet_store();
    
    // Handle connect wallet
    let handle_connect = move |_| {
        connect_wallet(wallet.clone());
    };
    
    // Handle disconnect wallet
    let handle_disconnect = move |_| {
        disconnect_wallet(wallet.clone());
    };
    
    if !wallet.read().is_connected {
        cx.render(rsx! {
            div { class: "container mx-auto p-4 flex flex-col items-center justify-center min-h-[80vh]",
                div { class: "flex flex-col items-center max-w-md text-center",
                    Icon { 
                        icon: Wallet,
                        width: 48,
                        height: 48,
                        fill: "var(--primary)"
                    }
                    
                    h1 { class: "text-xl font-bold my-4 mono", "Connect Wallet" }
                    
                    p { class: "text-secondary mb-8",
                        "Connect your wallet to view your assets, transactions, and more."
                    }
                    
                    button { 
                        class: "btn btn-primary py-3 px-6",
                        onclick: handle_connect,
                        "Connect Wallet"
                    }
                }
            }
        })
    } else {
        cx.render(rsx! {
            div { class: "container mx-auto p-4",
                h1 { class: "text-xl font-bold mb-4 mono", "Your Wallet" }
                
                // Wallet address
                div { class: "card mb-6",
                    div { class: "flex items-center justify-between",
                        div { class: "flex items-center gap-2",
                            Icon { 
                                icon: Wallet,
                                width: 20,
                                height: 20,
                                fill: "var(--primary)"
                            }
                            span { class: "font-bold", "Address" }
                        }
                        
                        button { 
                            class: "btn btn-secondary text-sm",
                            onclick: handle_disconnect,
                            "Disconnect"
                        }
                    }
                    
                    div { class: "flex items-center justify-between mt-4 p-3 bg-surface rounded border",
                        p { class: "mono text-sm", "{wallet.read().address}" }
                        
                        div { class: "flex items-center gap-2",
                            CopyButton { text: &wallet.read().address }
                            
                            button { class: "bg-transparent border-none cursor-pointer",
                                Icon { 
                                    icon: FaExternalLinkAlt,
                                    width: 20,
                                    height: 20,
                                    fill: "var(--text-secondary)"
                                }
                            }
                        }
                    }
                }
                
                // Wallet balance
                div { class: "card mb-6",
                    h2 { class: "text-lg font-bold mb-4", "Balance" }
                    
                    div { class: "flex items-center justify-between p-4 bg-[var(--primary-light)] rounded",
                        span { class: "text-secondary", "Total Balance" }
                        span { class: "text-xl font-bold mono text-[var(--primary)]", "123.45 SOL" }
                    }
                    
                    div { class: "flex items-center justify-between p-4",
                        span { class: "text-secondary", "USD Value" }
                        span { class: "font-bold", "≈ $13,332.60" }
                    }
                }
                
                // Recent transactions
                TransactionList { title: "Your Transactions".to_string() }
            }
        })
    }
}