use dioxus::prelude::*;
use dioxus_free_icons::icons::lucide_icons::Wallet;
use dioxus_free_icons::Icon;
use dioxus_router::prelude::*;

use crate::stores::wallet_store::{use_wallet_store, connect_wallet, disconnect_wallet};
use crate::app::Route;

#[component]
pub fn WalletButton(cx: Scope) -> Element {
    let wallet = use_wallet_store(cx);
    let navigator = use_navigator(cx);
    
    let handle_wallet_click = move |_| {
        if wallet.get().is_connected {
            // If already connected, navigate to wallet page
            navigator.push(Route::Wallet {});
        } else {
            // If not connected, connect wallet
            connect_wallet(wallet);
            navigator.push(Route::Wallet {});
        }
    };
    
    cx.render(rsx! {
        button {
            class: "btn",
            class: if wallet.get().is_connected { "btn-secondary" } else { "btn-primary" },
            onclick: handle_wallet_click,
            
            Icon {
                icon: Wallet,
                width: 16,
                height: 16,
                fill: if wallet.get().is_connected { "var(--text)" } else { "white" }
            }
            
            span { 
                style: "margin-left: 8px;",
                if wallet.get().is_connected { "Wallet" } else { "Connect Wallet" }
            }
        }
    })
}