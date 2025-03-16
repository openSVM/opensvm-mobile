// Define typography constants for the app
pub struct Typography;

impl Typography {
    // Font family
    pub const MONO: &'static str = "Menlo, monospace";
    
    // Font sizes
    pub struct Size {
        pub const XS: &'static str = "12px";
        pub const SM: &'static str = "14px";
        pub const BASE: &'static str = "16px";
        pub const LG: &'static str = "18px";
        pub const XL: &'static str = "20px";
        pub const XXL: &'static str = "24px";
        pub const XXXL: &'static str = "30px";
        pub const XXXXL: &'static str = "36px";
    }
    
    // Line heights
    pub struct LineHeight {
        pub const TIGHT: f32 = 1.25;
        pub const NORMAL: f32 = 1.5;
        pub const RELAXED: f32 = 1.75;
    }
    
    // Font weights
    pub struct Weight {
        pub const NORMAL: &'static str = "400";
        pub const MEDIUM: &'static str = "500";
        pub const SEMIBOLD: &'static str = "600";
        pub const BOLD: &'static str = "700";
    }
}