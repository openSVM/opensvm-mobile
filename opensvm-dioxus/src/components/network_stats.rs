use dioxus::prelude::*;
use crate::utils::address_utils::format_number;
use crate::components::loading_skeleton::Skeleton;

// Stats card component
#[derive(Props)]
pub struct StatsCardProps<'a> {
    pub value: &'a str,
    pub label: &'a str,
    #[props(optional)]
    pub is_loading: Option<bool>,
}

#[component]
pub fn StatsCard<'a>(cx: Scope<'a, StatsCardProps<'a>>) -> Element {
    let is_loading = cx.props.is_loading.unwrap_or(false);
    
    if is_loading {
        cx.render(rsx! {
            div { class: "stats-card",
                Skeleton { height: 20, width: 100 }
                Skeleton { height: 14, width: 80, style: "margin-top: 4px" }
            }
        })
    } else {
        cx.render(rsx! {
            div { class: "stats-card",
                p { class: "stats-value mono", "{cx.props.value}" }
                p { class: "stats-label", "{cx.props.label}" }
            }
        })
    }
}

// Network stats component
#[derive(Props)]
pub struct NetworkStatsProps {
    pub blocks_processed: u64,
    pub active_validators: u64,
    pub tps: u64,
    pub epoch: u64,
    pub network_load: f64,
    pub block_height: u64,
    #[props(optional)]
    pub is_loading: Option<bool>,
}

#[component]
pub fn NetworkStats(cx: Scope<NetworkStatsProps>) -> Element {
    let is_loading = cx.props.is_loading.unwrap_or(false);
    
    cx.render(rsx! {
        div { class: "p-4",
            // Top stats
            div { class: "stats-grid",
                StatsCard {
                    value: &format_number(cx.props.blocks_processed),
                    label: "Blocks Processed",
                    is_loading: is_loading,
                }
                StatsCard {
                    value: &format_number(cx.props.active_validators),
                    label: "Active Validators",
                    is_loading: is_loading,
                }
                StatsCard {
                    value: &format_number(cx.props.tps),
                    label: "TPS",
                    is_loading: is_loading,
                }
            }
            
            // Bottom stats
            div { class: "card",
                if is_loading {
                    rsx! {
                        div { class: "info-row",
                            Skeleton { height: 16, width: 100 }
                            Skeleton { height: 16, width: 60 }
                        }
                        div { class: "info-row",
                            Skeleton { height: 16, width: 100 }
                            Skeleton { height: 16, width: 60 }
                        }
                        div { class: "info-row",
                            Skeleton { height: 16, width: 100 }
                            Skeleton { height: 16, width: 60 }
                        }
                    }
                } else {
                    rsx! {
                        div { class: "info-row",
                            span { class: "info-label", "Current Epoch" }
                            span { class: "info-value", "{cx.props.epoch}" }
                        }
                        div { class: "info-row",
                            span { class: "info-label", "Network Load" }
                            span { class: "info-value", "{cx.props.network_load:.2}%" }
                        }
                        div { class: "info-row",
                            span { class: "info-label", "Block Height" }
                            span { class: "info-value", "{format_number(cx.props.block_height)}" }
                        }
                    }
                }
            }
        }
    })
}