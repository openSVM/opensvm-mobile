//! API utilities for fetching Solana blockchain data

use serde::{Deserialize, Serialize};
use serde_json::Value;

// Solana RPC endpoint - using public endpoint
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

/// Detailed transaction information
#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct TransactionDetails {
    pub slot: Option<u64>,
    pub transaction: TransactionInfo,
    pub meta: Option<TransactionMeta>,
    pub block_time: Option<i64>,
    pub version: Option<String>,
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct TransactionInfo {
    pub message: TransactionMessage,
    pub signatures: Vec<String>,
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct TransactionMessage {
    pub account_keys: Vec<String>,
    pub header: MessageHeader,
    pub instructions: Vec<TransactionInstruction>,
    pub recent_blockhash: String,
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct MessageHeader {
    pub num_required_signatures: u8,
    pub num_readonly_signed_accounts: u8,
    pub num_readonly_unsigned_accounts: u8,
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct TransactionInstruction {
    pub accounts: Vec<u8>,
    pub data: String,
    pub program_id_index: u8,
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct TransactionMeta {
    pub err: Option<Value>,
    pub fee: u64,
    pub inner_instructions: Option<Vec<Value>>,
    pub log_messages: Option<Vec<String>>,
    pub post_balances: Vec<u64>,
    pub post_token_balances: Option<Vec<Value>>,
    pub pre_balances: Vec<u64>,
    pub pre_token_balances: Option<Vec<Value>>,
    pub rewards: Option<Vec<Value>>,
    pub status: Option<Value>,
}

/// Transaction response wrapper
#[derive(Deserialize, Debug)]
struct TransactionResponse {
    context: Context,
    value: Option<TransactionDetails>,
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

/// Generic API client for making requests (desktop/mobile)
#[cfg(feature = "desktop")]
pub struct SolanaApiClient {
    client: reqwest::Client,
    base_url: String,
}

#[cfg(feature = "desktop")]
impl SolanaApiClient {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::new(),
            base_url: SOLANA_RPC_URL.to_string(),
        }
    }

    /// Make a JSON-RPC request
    async fn make_request<T>(
        &self,
        method: &str,
        params: Vec<Value>,
    ) -> Result<T, Box<dyn std::error::Error>>
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
    pub async fn get_account_info(
        &self,
        address: &str,
    ) -> Result<Option<AccountInfo>, Box<dyn std::error::Error>> {
        let params = vec![
            Value::String(address.to_string()),
            serde_json::json!({
                "encoding": "base64",
                "commitment": "confirmed"
            }),
        ];

        let response: AccountResponse = self.make_request("getAccountInfo", params).await?;
        Ok(response.value)
    }

    /// Get transaction details
    pub async fn get_transaction(
        &self,
        signature: &str,
    ) -> Result<Option<TransactionDetails>, Box<dyn std::error::Error>> {
        let params = vec![
            Value::String(signature.to_string()),
            serde_json::json!({
                "encoding": "json",
                "commitment": "confirmed",
                "maxSupportedTransactionVersion": 0
            }),
        ];

        let response: TransactionResponse = self.make_request("getTransaction", params).await?;
        Ok(response.value)
    }

    /// Get network stats (aggregated information)
    pub async fn get_network_stats(&self) -> Result<NetworkStats, Box<dyn std::error::Error>> {
        // Get supply info
        let params = vec![serde_json::json!({
            "commitment": "confirmed"
        })];
        let supply: SupplyResponse = self.make_request("getSupply", params).await?;

        // Get epoch info
        let epoch_info: Value = self.make_request("getEpochInfo", vec![]).await?;

        // Get current slot
        let current_slot: u64 = self.make_request("getSlot", vec![]).await?;

        // Get vote accounts to count validators
        let vote_accounts: Value = self.make_request("getVoteAccounts", vec![]).await?;
        let validator_count = vote_accounts["current"]
            .as_array()
            .map(|arr| arr.len())
            .unwrap_or(0);

        Ok(NetworkStats {
            total_supply: supply.value.total,
            circulating_supply: supply.value.circulating,
            current_slot,
            epoch: epoch_info["epoch"].as_u64().unwrap_or(0),
            validator_count,
            avg_slot_time: 0.4, // Default value
        })
    }
}

/// Web-specific API functions using fetch
#[cfg(feature = "web")]
pub mod web {
    use super::*;
    use serde_wasm_bindgen::from_value;
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

        let opts = RequestInit::new();
        opts.set_method("POST");
        opts.set_mode(RequestMode::Cors);
        opts.set_body(&JsValue::from_str(&request_body.to_string()));

        let request = Request::new_with_str_and_init(SOLANA_RPC_URL, &opts)?;
        request.headers().set("Content-Type", "application/json")?;

        let window = web_sys::window().unwrap();
        let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
        let resp: Response = resp_value.dyn_into().unwrap();

        let json = JsFuture::from(resp.json()?).await?;
        let response: JsonRpcResponse<AccountResponse> = from_value(json).unwrap();

        if let Some(error) = response.error {
            return Err(JsValue::from_str(&format!("RPC Error: {}", error.message)));
        }

        Ok(response.result.and_then(|r| r.value))
    }

    pub async fn fetch_transaction(signature: &str) -> Result<Option<TransactionDetails>, JsValue> {
        let request_body = serde_json::json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTransaction",
            "params": [
                signature,
                {
                    "encoding": "json",
                    "commitment": "confirmed",
                    "maxSupportedTransactionVersion": 0
                }
            ]
        });

        let opts = RequestInit::new();
        opts.set_method("POST");
        opts.set_mode(RequestMode::Cors);
        opts.set_body(&JsValue::from_str(&request_body.to_string()));

        let request = Request::new_with_str_and_init(SOLANA_RPC_URL, &opts)?;
        request.headers().set("Content-Type", "application/json")?;

        let window = web_sys::window().unwrap();
        let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
        let resp: Response = resp_value.dyn_into().unwrap();

        let json = JsFuture::from(resp.json()?).await?;
        let response: JsonRpcResponse<TransactionResponse> = from_value(json).unwrap();

        if let Some(error) = response.error {
            return Err(JsValue::from_str(&format!("RPC Error: {}", error.message)));
        }

        Ok(response.result.and_then(|r| r.value))
    }

    pub async fn fetch_network_stats() -> Result<NetworkStats, JsValue> {
        // For web, make a simplified request to get supply
        let request_body = serde_json::json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getSupply",
            "params": [{"commitment": "confirmed"}]
        });

        let opts = RequestInit::new();
        opts.set_method("POST");
        opts.set_mode(RequestMode::Cors);
        opts.set_body(&JsValue::from_str(&request_body.to_string()));

        let request = Request::new_with_str_and_init(SOLANA_RPC_URL, &opts)?;
        request.headers().set("Content-Type", "application/json")?;

        let window = web_sys::window().unwrap();
        let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
        let resp: Response = resp_value.dyn_into().unwrap();

        let json = JsFuture::from(resp.json()?).await?;
        let response: JsonRpcResponse<SupplyResponse> = from_value(json).unwrap();

        if let Some(error) = response.error {
            return Err(JsValue::from_str(&format!("RPC Error: {}", error.message)));
        }

        if let Some(supply_response) = response.result {
            Ok(NetworkStats {
                total_supply: supply_response.value.total,
                circulating_supply: supply_response.value.circulating,
                current_slot: 250_000_000, // Mock value for now
                epoch: 500,
                validator_count: 1500,
                avg_slot_time: 0.4,
            })
        } else {
            Err(JsValue::from_str("No supply data returned"))
        }
    }
}
