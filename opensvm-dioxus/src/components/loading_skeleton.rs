use dioxus::prelude::*;

#[derive(Props, PartialEq)]
pub struct SkeletonProps {
    pub height: u32,
    pub width: u32,
    #[props(optional)]
    pub style: Option<String>,
}

#[component]
pub fn Skeleton(cx: Scope<SkeletonProps>) -> Element {
    let style_str = format!(
        "height: {}px; width: {}px; background-color: var(--surface-light); border-radius: 4px; animation: pulse 1.5s infinite; {}",
        cx.props.height,
        cx.props.width,
        cx.props.style.clone().unwrap_or_default()
    );
    
    cx.render(rsx! {
        div {
            style: "{style_str}",
            // Add keyframes for the pulse animation
            style { "
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.3; }
                    100% { opacity: 0.6; }
                }
            " }
        }
    })
}