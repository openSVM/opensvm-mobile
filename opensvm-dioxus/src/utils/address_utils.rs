// Define the types of search inputs
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum SearchInputType {
    Transaction,
    Account,
    Block,
    Unknown,
}

// Define the result of parsing a search input
#[derive(Debug, Clone)]
pub struct SearchInputResult {
    pub is_valid: bool,
    pub value: String,
    pub type_: SearchInputType,
}

// Function to parse a search input and determine its type
pub fn parse_search_input(input: &str) -> SearchInputResult {
    let trimmed = input.trim();

    // Check if it's a transaction signature (base58 encoded, 88 characters)
    if trimmed.len() >= 32 && trimmed.chars().all(|c| c.is_alphanumeric()) {
        return SearchInputResult {
            is_valid: true,
            value: trimmed.to_string(),
            type_: SearchInputType::Transaction,
        };
    }

    // Check if it's a block number
    if trimmed.chars().all(|c| c.is_numeric()) {
        return SearchInputResult {
            is_valid: true,
            value: trimmed.to_string(),
            type_: SearchInputType::Block,
        };
    }

    // Check if it's an account address (base58 encoded)
    if trimmed.len() >= 32 && trimmed.chars().all(|c| c.is_alphanumeric()) {
        return SearchInputResult {
            is_valid: true,
            value: trimmed.to_string(),
            type_: SearchInputType::Account,
        };
    }

    // If we can't determine the type, return Unknown
    SearchInputResult {
        is_valid: false,
        value: trimmed.to_string(),
        type_: SearchInputType::Unknown,
    }
}

// Function to format an address for display (truncate middle)
pub fn format_address(address: &str) -> String {
    if address.len() <= 13 {
        return address.to_string();
    }

    let start = &address[0..6];
    let end = &address[address.len() - 6..];
    format!("{}...{}", start, end)
}

// Function to format a number with commas
pub fn format_number(num: u64) -> String {
    let mut result = String::new();
    let num_str = num.to_string();
    let mut count = 0;

    for c in num_str.chars().rev() {
        if count == 3 {
            result.push(',');
            count = 0;
        }
        result.push(c);
        count += 1;
    }

    result.chars().rev().collect()
}

// Function to format a timestamp as a readable date/time
pub fn format_timestamp(timestamp: u64) -> String {
    let date = chrono::DateTime::from_timestamp(timestamp as i64, 0)
        .unwrap_or_else(|| chrono::DateTime::from_timestamp(0, 0).unwrap());

    date.format("%Y-%m-%d %H:%M:%S").to_string()
}
