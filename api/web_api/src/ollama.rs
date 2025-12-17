use serde::{Deserialize, Serialize};
use serde::de::DeserializeOwned;
use std::env;

#[derive(Debug, Serialize)]
struct OllamaRequest {
    model: String,
    prompt: String,
    stream: bool,
}

#[derive(Debug, Deserialize)]
struct OllamaResponse {
    response: String,
    #[allow(dead_code)]
    done: bool,
}

/// Internal helper to call Ollama API and return the full raw response text
async fn call_ollama(prompt: &str) -> Result<String, Box<dyn std::error::Error>> {
    let base_url = env::var("OLLAMA_BASE_URL")
        .unwrap_or_else(|_| "http://localhost:11434".to_string());
    let api_key = env::var("OLLAMA_API_KEY").ok();
    let model = env::var("OLLAMA_MODEL").unwrap_or_else(|_| "gpt-oss:120b".to_string());

    let url = format!("{}/api/generate", base_url);

    let request = OllamaRequest {
        model,
        prompt: prompt.to_string(),
        stream: false,
    };

    let client = reqwest::Client::new();
    let mut request_builder = client.post(&url).json(&request);

    // 如果有 API key，添加到请求头
    if let Some(key) = api_key {
        request_builder = request_builder.header("Authorization", format!("Bearer {}", key));
    }

    let response = request_builder.send().await?;

    if !response.status().is_success() {
        let status = response.status();
        let error_text = response.text().await.unwrap_or_default();
        return Err(format!("Ollama API error ({}): {}", status, error_text).into());
    }

    let ollama_response: OllamaResponse = response.json().await?;
    Ok(ollama_response.response.trim().to_string())
}

/// 调用 Ollama API 生成回答（向下兼容：默认限制为 100 个字符）
pub async fn generate_response(prompt: &str) -> Result<String, Box<dyn std::error::Error>> {
    let mut answer = call_ollama(prompt).await?;

    // 保持原有行为：限制回答长度不超过 100 个字符（中文字符）
    if answer.chars().count() > 100 {
        let truncated: String = answer.chars().take(97).collect();
        answer = format!("{}...", truncated);
    }

    Ok(answer)
}

/// 调用 Ollama API，回傳完整文字（不做長度截斷）
pub async fn generate_response_full(prompt: &str) -> Result<String, Box<dyn std::error::Error>> {
    call_ollama(prompt).await
}

/// 调用 Ollama API，並將回應解析為 JSON 結構
///
/// - 呼叫端需要保證 prompt 明確要求模型輸出合法 JSON
/// - 不會做任何長度截斷，避免破壞 JSON 格式
pub async fn generate_json<T>(prompt: &str) -> Result<T, Box<dyn std::error::Error>>
where
    T: DeserializeOwned,
{
    let answer = call_ollama(prompt).await?;
    let parsed = serde_json::from_str::<T>(&answer)?;
    Ok(parsed)
}

