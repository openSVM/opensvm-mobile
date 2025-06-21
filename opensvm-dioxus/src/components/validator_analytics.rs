use dioxus::prelude::*;
use dioxus_free_icons::icons::lucide_icons::{Shield, Globe, Users, Wallet, TrendingUp, ChevronRight};
use dioxus_free_icons::Icon;
use dioxus_router::prelude::*;

// Mock data for validator stats
#[derive(Clone)]
struct ValidatorStats {
    total_stake: u64,
    average_stake: u64,
    active_validators: u64,
    total_delegators: u64,
    average_apy: f64,
    regions: Vec<Region>,
}

#[derive(Clone)]
struct Region {
    name: String,
    validators: u64,
    stake: u64,
}

// Stats card component
#[derive(Props)]
pub struct StatsCardProps<'a> {
    pub icon: Element<'a>,
    pub label: &'a str,
    pub value: &'a str,
    #[props(optional)]
    pub subvalue: Option<&'a str>,
}

#[component]
fn StatsCard<'a>(cx: Scope<'a, StatsCardProps<'a>>) -> Element {
    cx.render(rsx! {
        div { class: "stats-card",
            div { class: "flex items-center gap-2 mb-3",
                &cx.props.icon
                span { class: "text-secondary", "{cx.props.label}" }
            }
            p { class: "stats-value", "{cx.props.value}" }
            if let Some(subvalue) = cx.props.subvalue {
                rsx! {
                    p { class: "text-sm", style: "color: var(--primary);", "{subvalue}" }
                }
            }
        }
    })
}

// Region globe component
#[component]
fn RegionGlobe(cx: Scope) -> Element {
    // Mock data for regions
    let regions = vec![
        Region { name: "North America".to_string(), validators: 482, stake: 124893241 },
        Region { name: "Europe".to_string(), validators: 394, stake: 98234123 },
        Region { name: "Asia".to_string(), validators: 289, stake: 76234123 },
        Region { name: "South America".to_string(), validators: 123, stake: 34123412 },
        Region { name: "Africa".to_string(), validators: 67, stake: 12341234 },
        Region { name: "Oceania".to_string(), validators: 33, stake: 8923412 },
    ];
    
    // Find the maximum number of validators for scaling
    let max_validators = regions.iter().map(|r| r.validators).max().unwrap_or(1);
    
    cx.render(rsx! {
        div { class: "card",
            div { class: "flex justify-between items-center mb-6",
                h3 { class: "text-lg font-bold", "Global Distribution" }
                button { class: "flex items-center text-[var(--primary)]",
                    "View All"
                    Icon { icon: ChevronRight, width: 16, height: 16, fill: "var(--primary)" }
                }
            }
            
            div { class: "flex gap-4 overflow-x-auto pb-4",
                regions.iter().map(|region| {
                    let percentage = (region.validators as f64 / max_validators as f64) * 100.0;
                    rsx! {
                        div { class: "flex flex-col items-center min-w-[100px]",
                            div { 
                                class: "w-full relative h-[200px] flex items-end",
                                div {
                                    class: "w-full bg-[var(--primary-light)] rounded-t-lg",
                                    style: "height: {percentage}%; position: absolute; bottom: 0;",
                                }
                                p { 
                                    class: "z-10 w-full text-center font-bold mb-2",
                                    "{region.validators}"
                                }
                            }
                            p { class: "text-sm text-secondary text-center", "{region.name}" }
                        }
                    }
                })
            }
        }
    })
}

// Format number helper function
fn format_number(num: u64) -> String {
    if num >= 1_000_000_000 {
        format!("{:.1}B", num as f64 / 1_000_000_000.0)
    } else if num >= 1_000_000 {
        format!("{:.1}M", num as f64 / 1_000_000.0)
    } else if num >= 1_000 {
        format!("{:.1}K", num as f64 / 1_000.0)
    } else {
        num.to_string()
    }
}

// Main validator analytics component
#[component]
pub fn ValidatorAnalytics(cx: Scope) -> Element {
    // Mock data
    let stats = ValidatorStats {
        total_stake: 354829481,
        average_stake: 258234,
        active_validators: 1388,
        total_delegators: 892341,
        average_apy: 6.8,
        regions: vec![], // We'll use the regions in the RegionGlobe component
    };
    
    cx.render(rsx! {
        div { class: "p-4",
            div { class: "stats-grid",
                StatsCard {
                    icon: cx.render(rsx! {
                        Icon { icon: FaShield, width: 18, height: 18, fill: "var(--primary)" }
                    }),
                    label: "Active Validators",
                    value: &format_number(stats.active_validators),
                    subvalue: Some("+12% this month"),
                }
                
                StatsCard {
                    icon: cx.render(rsx! {
                        Icon { icon: Wallet, width: 18, height: 18, fill: "var(--primary)" }
                    }),
                    label: "Total Stake",
                    value: &format!("{} SOL", format_number(stats.total_stake)),
                    subvalue: Some(&format!("≈ ${}", format_number(stats.total_stake * 108))),
                }
                
                StatsCard {
                    icon: cx.render(rsx! {
                        Icon { icon: FaUsers, width: 18, height: 18, fill: "var(--primary)" }
                    }),
                    label: "Total Delegators",
                    value: &format_number(stats.total_delegators),
                }
                
                StatsCard {
                    icon: cx.render(rsx! {
                        Icon { icon: FaChartLine, width: 18, height: 18, fill: "var(--primary)" }
                    }),
                    label: "Average APY",
                    value: &format!("{}%", stats.average_apy),
                    subvalue: Some("Last 30 days"),
                }
            }
            
            RegionGlobe {}
        }
    })
}