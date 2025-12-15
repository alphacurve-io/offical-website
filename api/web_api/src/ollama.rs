use serde::{Deserialize, Serialize};
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

/// 调用 Ollama API 生成回答
pub async fn generate_response(prompt: &str) -> Result<String, Box<dyn std::error::Error>> {
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
    
    Ok(ollama_response.response)
}

