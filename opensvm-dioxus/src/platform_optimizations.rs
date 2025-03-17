//! Platform-specific optimizations for the application
//!
//! This module contains functions to apply platform-specific optimizations
//! for better performance on each target platform (web, desktop, mobile).

/// Apply platform-specific optimizations during application startup
pub fn apply_optimizations() {
    // Apply shared optimizations for all platforms
    apply_shared_optimizations();
    
    // Apply platform-specific optimizations
    #[cfg(feature = "web")]
    apply_web_optimizations();
    
    #[cfg(feature = "desktop")]
    apply_desktop_optimizations();
    
    #[cfg(feature = "android")]
    apply_android_optimizations();
}

/// Apply optimizations that are shared across all platforms
fn apply_shared_optimizations() {
    // Log initialization of optimizations
    log::info!("Applying shared optimizations");
}

/// Apply web-specific optimizations
#[cfg(feature = "web")]
fn apply_web_optimizations() {
    log::info!("Applying web-specific optimizations");
    
    // Use wasm-bindgen to set performance hints
    #[cfg(target_arch = "wasm32")]
    {
        // Enable WebAssembly SIMD optimizations where available
        // This is a hint to the browser that we're doing computationally intensive work
        let window = web_sys::window().expect("No window found");
        let performance = window.performance().expect("No performance object found");
        let _ = js_sys::Reflect::set(
            &performance,
            &wasm_bindgen::JsValue::from_str("hint"),
            &wasm_bindgen::JsValue::from_str("high-performance"),
        );
    }
}

/// Apply desktop-specific optimizations
#[cfg(feature = "desktop")]
fn apply_desktop_optimizations() {
    log::info!("Applying desktop-specific optimizations");
    
    // Set thread pool size for parallel task execution
    // Optimize based on available CPU cores
    let num_cpus = num_cpus::get();
    std::env::set_var("RAYON_NUM_THREADS", num_cpus.to_string());
    log::debug!("Set thread pool size to {}", num_cpus);
    
    // Enable memory optimizations for desktop builds
    // These are environment variables that affect Rust's memory allocator behavior
    std::env::set_var("MALLOC_ARENA_MAX", "2"); // Reduce memory fragmentation
}

/// Apply Android-specific optimizations
#[cfg(feature = "android")]
fn apply_android_optimizations() {
    log::info!("Applying Android-specific optimizations");
    
    // Mobile devices often have limited resources, so we optimize for efficiency
    // Set environment variables for optimized rendering on mobile devices
    std::env::set_var("MOBILE_OPTIMIZED", "1");
    
    // Limit the number of background threads to save battery
    let num_cpus = std::cmp::min(num_cpus::get(), 4); // Use at most 4 threads on mobile
    std::env::set_var("RAYON_NUM_THREADS", num_cpus.to_string());
    log::debug!("Set thread pool size to {} for mobile", num_cpus);
}