// Define color constants for the app
pub struct Colors;

impl Colors {
    pub const PRIMARY: &'static str = "#00D181";
    pub const PRIMARY_LIGHT: &'static str = "#E6F9F3";
    pub const BACKGROUND: &'static str = "#FFFFFF";
    pub const SURFACE: &'static str = "#F8F9FA";
    pub const SURFACE_LIGHT: &'static str = "#F1F3F5";
    pub const TEXT: &'static str = "#1A1B1E";
    pub const TEXT_SECONDARY: &'static str = "#6C757D";
    pub const TEXT_TERTIARY: &'static str = "#ADB5BD";
    pub const BORDER: &'static str = "#E9ECEF";
    pub const SUCCESS: &'static str = "#00D181";
    pub const ERROR: &'static str = "#FF4B4B";
    pub const WARNING: &'static str = "#FFB800";
    
    // Dark theme colors
    pub struct Dark;
    
    impl Dark {
        pub const BACKGROUND: &'static str = "#1A1B1E";
        pub const SURFACE: &'static str = "#212529";
        pub const SURFACE_LIGHT: &'static str = "#343A40";
        pub const TEXT: &'static str = "#F8F9FA";
        pub const TEXT_SECONDARY: &'static str = "#ADB5BD";
        pub const TEXT_TERTIARY: &'static str = "#6C757D";
        pub const BORDER: &'static str = "#343A40";
    }
}