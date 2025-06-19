//! API utilities for fetching Solana blockchain data

use serde::{Deserialize, Serialize};
use serde_json::Value;

// Solana RPC endpoint - using public endpoint for now
const SOLANA_RPC_URL: &str = "https://api.mainnet-beta.solana.com";

/// Standard JSON-RPC request structure
#[derive(Serialize, Debug)]
struct JsonRpcRequest {
    jsonrpc: String,
    id: u64,
    method: String,
    params: Vec<Value>,
}

/// Standard JSON-RPC response structure
#[derive(Deserialize, Debug)]
struct JsonRpcResponse<T> {
    jsonrpc: String,
    id: u64,
    result: Option<T>,
    error: Option<JsonRpcError>,
}

#[derive(Deserialize, Debug)]
struct JsonRpcError {
    code: i32,
    message: String,
    data: Option<Value>,
}

/// Account information structure
#[derive(Deserialize, Debug, Clone)]
pub struct AccountInfo {
    pub data: Vec<String>,
    pub executable: bool,
    pub lamports: u64,
    pub owner: String,
    pub rent_epoch: u64,
}

/// Account response wrapper
#[derive(Deserialize, Debug)]
struct AccountResponse {
    context: Context,
    value: Option<AccountInfo>,
}

#[derive(Deserialize, Debug)]
struct Context {
    slot: u64,
}

/// Transaction signature information
#[derive(Deserialize, Debug, Clone)]
pub struct TransactionSignature {
    pub signature: String,
    pub slot: Option<u64>,
    pub err: Option<Value>,
    pub memo: Option<String>,
    pub block_time: Option<i64>,
    pub confirmation_status: Option<String>,
}

/// Block information
#[derive(Deserialize, Debug, Clone)]
pub struct BlockInfo {
    pub block_height: Option<u64>,
    pub block_time: Option<i64>,
    pub blockhash: String,
    pub parent_slot: u64,
    pub previous_blockhash: String,
    pub transactions: Vec<Value>,
}

/// Validator information
#[derive(Deserialize, Debug, Clone)]
pub struct ValidatorInfo {
    pub pubkey: String,
    pub vote_account: String,
    pub activated_stake: u64,
    pub last_vote: u64,
    pub root_slot: u64,
    pub credits: u64,
    pub epoch_vote_account: bool,
    pub epoch_credits: Vec<(u64, u64, u64)>,
    pub commission: u8,
}

/// Supply information
#[derive(Deserialize, Debug, Clone)]
pub struct SupplyInfo {
    pub total: u64,
    pub circulating: u64,
    pub non_circulating: u64,
    pub non_circulating_accounts: Vec<String>,
}

/// Supply response wrapper
#[derive(Deserialize, Debug)]
struct SupplyResponse {
    context: Context,
    value: SupplyInfo,
}

/// Network stats
#[derive(Debug, Clone)]
pub struct NetworkStats {
    pub total_supply: u64,
    pub circulating_supply: u64,
    pub current_slot: u64,
    pub epoch: u64,
    pub validator_count: usize,
    pub avg_slot_time: f64,
}

/// Generic API client for making requests
pub struct SolanaApiClient {
    client: reqwest::Client,
    base_url: String,
}

impl SolanaApiClient {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::new(),
            base_url: SOLANA_RPC_URL.to_string(),
        }
    }

    /// Make a JSON-RPC request
    async fn make_request<T>(&self, method: &str, params: Vec<Value>) -> Result<T, Box<dyn std::error::Error>>
    where
        T: for<'de> Deserialize<'de>,
    {
        let request = JsonRpcRequest {
            jsonrpc: "2.0".to_string(),
            id: 1,
            method: method.to_string(),
            params,
        };

        let response = self
            .client
            .post(&self.base_url)
            .json(&request)
            .send()
            .await?;

        let json_response: JsonRpcResponse<T> = response.json().await?;

        if let Some(error) = json_response.error {
            return Err(format!("RPC Error: {} - {}", error.code, error.message).into());
        }

        json_response.result.ok_or("No result in response".into())
    }

    /// Get account information
    pub async fn get_account_info(&self, address: &str) -> Result<Option<AccountInfo>, Box<dyn std::error::Error>> {
        let params = vec![
            Value::String(address.to_string()),
            serde_json::json!({
                "encoding": "base64",
                "commitment": "confirmed"
            })
        ];

        let response: AccountResponse = self.make_request("getAccountInfo", params).await?;
        Ok(response.value)
    }

    /// Get transaction signatures for an address
    pub async fn get_signatures_for_address(&self, address: &str, limit: usize) -> Result<Vec<TransactionSignature>, Box<dyn std::error::Error>> {
        let params = vec![
            Value::String(address.to_string()),
            serde_json::json!({
                "limit": limit,
                "commitment": "confirmed"
            })
        ];

        self.make_request("getSignaturesForAddress", params).await
    }

    /// Get recent performance samples  
    pub async fn get_recent_performance_samples(&self, limit: usize) -> Result<Vec<Value>, Box<dyn std::error::Error>> {
        let params = vec![Value::Number(limit.into())];
        self.make_request("getRecentPerformanceSamples", params).await
    }

    /// Get supply information
    pub async fn get_supply(&self) -> Result<SupplyInfo, Box<dyn std::error::Error>> {
        let params = vec![serde_json::json!({
            "commitment": "confirmed"
        })];

        let response: SupplyResponse = self.make_request("getSupply", params).await?;
        Ok(response.value)
    }

    /// Get epoch information
    pub async fn get_epoch_info(&self) -> Result<Value, Box<dyn std::error::Error>> {
        self.make_request("getEpochInfo", vec![]).await
    }

    /// Get current slot
    pub async fn get_slot(&self) -> Result<u64, Box<dyn std::error::Error>> {
        self.make_request("getSlot", vec![]).await
    }

    /// Get block production information
    pub async fn get_block_production(&self) -> Result<Value, Box<dyn std::error::Error>> {
        self.make_request("getBlockProduction", vec![]).await
    }

    /// Get vote accounts (validators)
    pub async fn get_vote_accounts(&self) -> Result<Value, Box<dyn std::error::Error>> {
        self.make_request("getVoteAccounts", vec![]).await
    }

    /// Get block information
    pub async fn get_block(&self, slot: u64) -> Result<BlockInfo, Box<dyn std::error::Error>> {
        let params = vec![
            Value::Number(slot.into()),
            serde_json::json!({
                "encoding": "json",
                "transactionDetails": "signatures",
                "commitment": "confirmed"
            })
        ];

        self.make_request("getBlock", params).await
    }

    /// Get network stats (aggregated information)
    pub async fn get_network_stats(&self) -> Result<NetworkStats, Box<dyn std::error::Error>> {
        // Get supply info
        let supply = self.get_supply().await?;
        
        // Get epoch info
        let epoch_info: Value = self.get_epoch_info().await?;
        
        // Get current slot
        let current_slot = self.get_slot().await?;
        
        // Get vote accounts to count validators
        let vote_accounts: Value = self.get_vote_accounts().await?;
        let validator_count = vote_accounts["current"]
            .as_array()
            .map(|arr| arr.len())
            .unwrap_or(0);

        // Get performance samples for avg slot time
        let performance_samples: Vec<Value> = self.get_recent_performance_samples(20).await?;
        let avg_slot_time = performance_samples
            .iter()
            .filter_map(|sample| sample["samplePeriodSecs"].as_f64())
            .sum::<f64>() / performance_samples.len() as f64;

        Ok(NetworkStats {
            total_supply: supply.total,
            circulating_supply: supply.circulating,
            current_slot,
            epoch: epoch_info["epoch"].as_u64().unwrap_or(0),
            validator_count,
            avg_slot_time,
        })
    }
}

/// Web-specific API functions using fetch
#[cfg(feature = "web")]
pub mod web {
    use super::*;
    use wasm_bindgen::prelude::*;
    use wasm_bindgen_futures::JsFuture;
    use web_sys::{Request, RequestInit, RequestMode, Response};

    pub async fn fetch_account_info(address: &str) -> Result<Option<AccountInfo>, JsValue> {
        let request_body = serde_json::json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getAccountInfo",
            "params": [
                address,
                {
                    "encoding": "base64",
                    "commitment": "confirmed"
                }
            ]
        });

        let mut opts = RequestInit::new();
        opts.method("POST");
        opts.mode(RequestMode::Cors);
        opts.body(Some(&JsValue::from_str(&request_body.to_string())));

        let request = Request::new_with_str_and_init(SOLANA_RPC_URL, &opts)?;
        request.headers().set("Content-Type", "application/json")?;

        let window = web_sys::window().unwrap();
        let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
        let resp: Response = resp_value.dyn_into().unwrap();

        let json = JsFuture::from(resp.json()?).await?;
        let response: JsonRpcResponse<AccountResponse> = json.into_serde().unwrap();

        if let Some(error) = response.error {
            return Err(JsValue::from_str(&format!("RPC Error: {}", error.message)));
        }

        Ok(response.result.and_then(|r| r.value))
    }

    pub async fn fetch_network_stats() -> Result<NetworkStats, JsValue> {
        // For web, we'll implement a simplified version
        // In a real implementation, you'd make multiple parallel requests
        
        // Mock data for now - in production, make actual API calls
        Ok(NetworkStats {
            total_supply: 500_000_000_000_000_000, // 500M SOL in lamports
            circulating_supply: 400_000_000_000_000_000, // 400M SOL
            current_slot: 250_000_000,
            epoch: 500,
            validator_count: 1500,
            avg_slot_time: 0.4,
        })
    }
}