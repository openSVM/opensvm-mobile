use dioxus::prelude::*;
use dioxus_free_icons::icons::lucide_icons::{Zap, TrendingUp, BarChart};
use dioxus_free_icons::Icon;

#[component]
pub fn SolanowPage(cx: Scope) -> Element {
    cx.render(rsx! {
        div { class: "container mx-auto p-4",
            h1 { class: "text-xl font-bold mb-4 mono", "SolaNow" }
            p { class: "text-secondary mb-6", "Real-time updates and insights from the Solana network." }
            
            // Placeholder content
            div { class: "card mb-6",
                h2 { class: "text-lg font-bold mb-4", "Market Overview" }
                
                div { class: "flex items-center gap-2 mb-3",
                    Icon { icon: FaChartLine, width: 20, height: 20, fill: "var(--primary)" }
                    span { class: "font-bold", "SOL Price: $108.45" }
                }
                
                div { class: "flex items-center gap-2 mb-3",
                    Icon { icon: FaChartBar, width: 20, height: 20, fill: "var(--primary)" }
                    span { class: "font-bold", "24h Volume: $1.2B" }
                }
                
                div { class: "flex items-center gap-2",
                    Icon { icon: FaBolt, width: 20, height: 20, fill: "var(--primary)" }
                    span { class: "font-bold", "Network TPS: 4,108" }
                }
            }
            
            // Coming soon message
            div { class: "p-4 text-center text-secondary",
                "More detailed analytics coming soon!"
            }
        }
    })
}