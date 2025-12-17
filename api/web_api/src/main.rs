mod telegram_bot;
mod ollama;
use actix_multipart::Multipart;
use actix_web::{
    App, Error, HttpResponse, HttpServer, Responder, post, web
};
use serde::Deserialize;
use futures_util::TryStreamExt as _;
use serde::Serialize;
use std::io::Write;
use actix_cors::Cors;
use std::env;
use dotenv::dotenv;
/// 這是一個接收資料的結構
/// 如果只是要接收純文字(非檔案)欄位，也可以用 `serde` 序列化 JSON 的方式；
/// 但由於我們要接收檔案，所以改用 multipart 手動處理。
#[derive(Debug, Serialize)]
struct ContactForm {
    name: Option<String>,
    street: Option<String>,
    city: Option<String>,
    postcode: Option<String>,
    phone: Option<String>,
    email: Option<String>,
    message: Option<String>,
    // 如果有需要，你可以把檔案的 filename / mimetype / size 等額外儲存
    file_name: Option<String>,
    file_content_type: Option<String>,
    /// 這裡為了示範，我們直接把檔案讀到記憶體 (Vec<u8>)
    /// 真實應用中建議儲存到檔案系統或雲端儲存服務。
    file_content: Option<Vec<u8>>,
}

#[derive(Debug, Deserialize)]
struct ChatRequest {
    question: String,
}

#[derive(Debug, Serialize)]
struct ChatResponse {
    answer: String,
}

#[derive(Debug, Deserialize)]
struct EmotionRequest {
    /// User's original message to analyze
    user_request: String,
    /// The assistant's previous answer (e.g. from /api/chat)
    chat_answer: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct EmotionResult {
    /// Detected dominant emotion label
    emotion: String,
    /// Confidence score between 0.0 and 1.0
    confidence: f32,
    /// Short human-readable explanation
    explanation: String,
}

#[derive(Debug, Deserialize)]
struct EmotionReplyRequest {
    /// Persona identifier, e.g. "customer_assistant", "lawyer"
    persona: String,
    /// User's latest (possibly emotional) message
    user_request: String,
    /// Previous assistant answer that might have triggered the reaction
    previous_answer: String,
    /// Emotion label computed by /api/emotion
    emotion_label: String,
    /// Emotion confidence computed by /api/emotion
    emotion_confidence: f32,
    /// Optional language hint, e.g. "zh-TW", "en"
    language_hint: Option<String>,
}

#[derive(Debug, Serialize)]
struct EmotionReplyResponse {
    answer: String,
    persona: String,
    style: String,
}

async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "alphacurve-web-api",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

/// 读取预设的 RAG 文档
fn load_rag_context() -> Result<String, Box<dyn std::error::Error>> {
    // 尝试从多个可能的位置读取文件
    let possible_paths = [
        "/usr/local/bin/rag_context.txt",
        "./rag_context.txt",
        "../rag_context.txt",
        "api/web_api/rag_context.txt",
    ];

    for path in &possible_paths {
        if let Ok(content) = std::fs::read_to_string(path) {
            return Ok(content);
        }
    }

    // 如果找不到文件，返回默认内容
    Ok("Alphacurve is a technology consulting company specializing in AI solutions and software development.".to_string())
}

/// 验证请求来源是否为允许的域名
fn is_allowed_origin(req: &actix_web::HttpRequest) -> bool {
    // 从环境变量获取允许的域名，默认为 alphacurve.io
    let allowed_domains = env::var("ALLOWED_DOMAINS")
        .unwrap_or_else(|_| "alphacurve.io,www.alphacurve.io".to_string());
    
    let domains: Vec<&str> = allowed_domains.split(',').map(|s| s.trim()).collect();
    
    // 检查 Host 头，允许 localhost 和 127.0.0.1（服务器端测试）
    if let Some(host) = req.headers().get("host") {
        if let Ok(host_str) = host.to_str() {
            // 允许 localhost 和 127.0.0.1（服务器端直接调用）
            if host_str.contains("localhost") || host_str.contains("127.0.0.1") {
                return true;
            }
            
            // 检查是否匹配允许的域名
            for domain in &domains {
                if host_str.contains(domain) {
                    return true;
                }
            }
        }
    }
    
    // 检查 Origin 头
    if let Some(origin) = req.headers().get("origin") {
        if let Ok(origin_str) = origin.to_str() {
            // 允许 localhost（开发环境）
            if origin_str.contains("localhost") || origin_str.contains("127.0.0.1") {
                return true;
            }
            
            // 检查是否匹配允许的域名
            for domain in &domains {
                if origin_str.contains(domain) {
                    return true;
                }
            }
        }
    }
    
    // 检查 Referer 头（作为备用）
    if let Some(referer) = req.headers().get("referer") {
        if let Ok(referer_str) = referer.to_str() {
            // 允许 localhost（开发环境）
            if referer_str.contains("localhost") || referer_str.contains("127.0.0.1") {
                return true;
            }
            
            // 检查是否匹配允许的域名
            for domain in &domains {
                if referer_str.contains(domain) {
                    return true;
                }
            }
        }
    }
    
    // 如果没有 Origin 或 Referer，且 Host 是 localhost，允许通过（服务器端直接调用）
    if req.headers().get("origin").is_none() && req.headers().get("referer").is_none() {
        if let Some(host) = req.headers().get("host") {
            if let Ok(host_str) = host.to_str() {
                if host_str.contains("localhost") || host_str.contains("127.0.0.1") {
                    return true;
                }
            }
        }
    }
    
    false
}

// =========================
// Emotion reply templates
// =========================

const GENERIC_TEMPLATE: &str = r#"
You are a separate assistant that generates a softened, empathetic follow-up reply
based on the user's emotion and the previous assistant's stiff answer.

Language hint: {language_hint}

User emotion:
- label: {emotion_label}
- confidence: {emotion_confidence}

Conversation:
- Previous assistant answer: "{previous_answer}"
- User latest request: "{user_request}"

Your role:
- You are NOT the same as the previous assistant. That previous answer was from someone else.
- Do NOT speak as if you were that assistant. Instead, refer to them in the third person
  (e.g. "he", "she", "they"; in Traditional Chinese use 「他 / 她 / 他們」) when explaining them.
- Be respectful, calm, and understanding.
- Assume the user might be joking or emotionally reactive (e.g. angry, frustrated).
- Keep the core business constraints of the previous answer,
  but respond in a softer, more human way that acknowledges the user's feelings.
- If the user writes in Traditional Chinese, you MUST respond fully in Traditional Chinese
  (no Simplified Chinese characters). Otherwise, answer in the same language as the user.

Output:
- The reply MUST NOT exceed 150 characters (including spaces and punctuation).
- Return ONLY the final reply sentence(s), no explanations, no JSON, no extra text.
"#;

const CUSTOMER_ASSISTANT_TEMPLATE: &str = r#"
You are a warm and friendly customer success assistant who speaks on behalf of the team,
not the original assistant who gave the previous answer.

Language hint: {language_hint}

User emotion:
- label: {emotion_label}
- confidence: {emotion_confidence}

Conversation:
- Previous assistant answer: "{previous_answer}"
- User latest request: "{user_request}"

Your role:
- You are NOT the original assistant who wrote the previous answer; you are another person.
- When you talk about the previous assistant, use third person, e.g. in Traditional Chinese:
  「抱歉，他不是故意要死腦筋」，而不是「我不是故意要死腦筋」.
- Be casual, friendly, and a bit humorous.
- Acknowledge the user's feelings or jokes (e.g. complaining about price, calling the assistant stubborn).
- Keep the company's policy and professional boundaries, but phrase them in a soft and human way.
- If appropriate, lightly joke back or use small talk to reduce tension.
- If the user writes in Traditional Chinese, you MUST respond fully in Traditional Chinese
  (no Simplified Chinese characters). Otherwise, answer in the same language as the user.

Output:
- The reply MUST NOT exceed 150 characters (including spaces and punctuation).
- Return ONLY the final reply sentence(s), no explanations, no JSON, no extra text.
"#;

const LAWYER_TEMPLATE: &str = r#"
You are a professional lawyer giving legal-related advice, distinct from the assistant
who wrote the previous answer.

Language hint: {language_hint}

User emotion:
- label: {emotion_label}
- confidence: {emotion_confidence}

Conversation:
- Previous assistant answer: "{previous_answer}"
- User latest request: "{user_request}"

Your role:
- You are NOT the same entity as the previous assistant; that answer was from someone else.
- When referring to the previous assistant, use third person (he/she/they; 他 / 她 / 他們),
  not first person.
- Be calm, precise, and risk-aware, but not cold.
- Acknowledge the user's emotions while clearly explaining legal or risk constraints.
- Do not make promises you cannot keep; focus on clarity and protection of the client's interests.
- If the user writes in Traditional Chinese, you MUST respond fully in Traditional Chinese
  (no Simplified Chinese characters). Otherwise, answer in the same language as the user.

Output:
- The reply MUST NOT exceed 150 characters (including spaces and punctuation).
- Return ONLY the final reply sentence(s), no explanations, no JSON, no extra text.
"#;

fn get_persona_template(persona: &str) -> &'static str {
    match persona {
        "customer_assistant" => CUSTOMER_ASSISTANT_TEMPLATE,
        "lawyer" => LAWYER_TEMPLATE,
        _ => GENERIC_TEMPLATE,
    }
}

fn build_emotion_reply_prompt(req: &EmotionReplyRequest) -> String {
    let template = get_persona_template(&req.persona);
    let language_hint = req
        .language_hint
        .clone()
        .unwrap_or_else(|| "auto".to_string());

    template
        .replace("{language_hint}", &language_hint)
        .replace("{emotion_label}", &req.emotion_label)
        .replace(
            "{emotion_confidence}",
            &format!("{:.2}", req.emotion_confidence),
        )
        .replace("{previous_answer}", &req.previous_answer)
        .replace("{user_request}", &req.user_request)
}

fn truncate_to_200_chars(text: &str) -> String {
    let max_chars = 200;
    let count = text.chars().count();
    if count <= max_chars {
        return text.to_string();
    }
    // 保留 197 個字元並在末尾加上 "..."
    let truncated: String = text.chars().take(max_chars - 3).collect();
    format!("{}...", truncated)
}

/// RAG 聊天端点
#[post("/api/chat")]
async fn chat_endpoint(
    req: web::Json<ChatRequest>,
    http_req: actix_web::HttpRequest,
) -> Result<impl Responder, Error> {
    // 验证请求来源
    if !is_allowed_origin(&http_req) {
        return Ok(HttpResponse::Forbidden().json(serde_json::json!({
            "error": "Forbidden",
            "message": "This API can only be called from authorized domains"
        })));
    }
    // 加载 RAG 上下文
    let rag_context = match load_rag_context() {
        Ok(context) => context,
        Err(e) => {
            eprintln!("Warning: Failed to load RAG context: {}", e);
            "".to_string()
        }
    };

    // 构建包含 RAG 上下文的 prompt
    let prompt = format!(
        r#"You are a helpful assistant for Alphacurve, a technology consulting company.

Context about Alphacurve:
{}

Website Information:
- Alphacurve provides AI solutions and software development services
- We help businesses implement cutting-edge technology solutions
- Our team specializes in consulting, development, and technical support

Based on the context above, please answer the following question in a helpful and professional manner.

IMPORTANT: Your answer must be concise and not exceed 100 characters (including spaces and punctuation). Be direct and to the point.

LANGUAGE RULES:
- If the user's question is written in Traditional Chinese (正體 / 繁體中文), you MUST answer entirely in Traditional Chinese characters and NEVER use Simplified Chinese characters.
- If the user's question is in another language, respond in that language.

Question: {}

Answer:"#,
        rag_context,
        req.question
    );

    // 调用 Ollama API
    match ollama::generate_response(&prompt).await {
        Ok(answer) => {
            Ok(HttpResponse::Ok().json(ChatResponse {
                answer,
            }))
        }
        Err(e) => {
            eprintln!("Error calling Ollama API: {}", e);
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to generate response",
                "message": e.to_string()
            })))
        }
    }
}

/// Emotion analysis endpoint
#[post("/api/emotion")]
async fn emotion_endpoint(
    req: web::Json<EmotionRequest>,
    http_req: actix_web::HttpRequest,
) -> Result<impl Responder, Error> {
    // 验证请求来源
    if !is_allowed_origin(&http_req) {
        return Ok(HttpResponse::Forbidden().json(serde_json::json!({
            "error": "Forbidden",
            "message": "This API can only be called from authorized domains"
        })));
    }

    let prompt = format!(
        r#"You are an emotion analysis assistant.

Your task is to analyze the user's dominant emotion when they wrote the request.

User request:
{user_request}

Assistant answer:
{chat_answer}

Output rules:
- Respond ONLY with a single JSON object, no explanations or extra text.
- The JSON MUST have exactly these fields:
  - "emotion": string, one of ["happy","satisfied","neutral","confused","frustrated","angry","sad","worried","excited"]
  - "confidence": number between 0 and 1
  - "explanation": short natural language explanation of the emotion.

Example of the required JSON format:
{{
  "emotion": "angry",
  "confidence": 0.92,
  "explanation": "User sounds upset about pricing and thinks you are inflexible."
}}"#,
        user_request = req.user_request,
        chat_answer = req.chat_answer,
    );

    match ollama::generate_json::<EmotionResult>(&prompt).await {
        Ok(result) => Ok(HttpResponse::Ok().json(result)),
        Err(e) => {
            eprintln!("Error calling Ollama API for emotion: {}", e);
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to analyze emotion",
                "message": e.to_string()
            })))
        }
    }
}

/// Emotion-aware, persona-based follow-up reply endpoint
#[post("/api/emotion_reply")]
async fn emotion_reply_endpoint(
    req: web::Json<EmotionReplyRequest>,
    http_req: actix_web::HttpRequest,
) -> Result<impl Responder, Error> {
    // 验证请求来源
    if !is_allowed_origin(&http_req) {
        return Ok(HttpResponse::Forbidden().json(serde_json::json!({
            "error": "Forbidden",
            "message": "This API can only be called from authorized domains"
        })));
    }

    let body = req.into_inner();
    let prompt = build_emotion_reply_prompt(&body);

    match ollama::generate_response_full(&prompt).await {
        Ok(answer) => {
            let limited_answer = truncate_to_200_chars(&answer);
            Ok(HttpResponse::Ok().json(EmotionReplyResponse {
                answer: limited_answer,
            persona: body.persona,
            style: "softened_followup".to_string(),
            }))
        }
        Err(e) => {
            eprintln!("Error calling Ollama API for emotion_reply: {}", e);
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to generate emotion-aware reply",
                "message": e.to_string()
            })))
        }
    }
}

#[post("/website/api/submit")]
async fn submit_form(mut payload: Multipart) -> Result<impl Responder, Error> {
    // 建立一個結構，用來收集所有欄位
    let mut form_data = ContactForm {
        name: None,
        street: None,
        city: None,
        postcode: None,
        phone: None,
        email: None,
        message: None,
        file_name: None,
        file_content_type: None,
        file_content: None,
    };

    // 逐段（field）解析 Multipart
    while let Ok(Some(mut field)) = payload.try_next().await {
        let field_name = field.name().unwrap_or("").to_string();
    
        // 先看看 content_disposition 裡面有沒有 filename
        let is_file = field
            .content_disposition()
            .and_then(|cd| cd.get_filename())
            .is_some();
    
        if is_file {
            // ========== 視為「檔案欄位」 ==========
            let content_disposition = field.content_disposition();
            if let Some(cd) = content_disposition {
                if let Some(filename) = cd.get_filename() {
                    form_data.file_name = Some(filename.to_string());
                }
            }
    
            // 記錄 content type (e.g., "image/png", "application/pdf", ...)
            if let Some(ct) = field.content_type() {
                form_data.file_content_type = Some(ct.to_string());
            }
    
            let mut file_bytes = Vec::new();
            while let Some(chunk) = field.try_next().await? {
                file_bytes.write_all(&chunk)?;
            }
            form_data.file_content = Some(file_bytes);
        } else {
            // ========== 視為「純文字欄位」==========
            let mut value_bytes = Vec::new();
            while let Some(chunk) = field.try_next().await? {
                value_bytes.write_all(&chunk)?;
            }
            let value_str = String::from_utf8_lossy(&value_bytes).to_string();
    
            match field_name.as_str() {
                "name"     => form_data.name     = Some(value_str),
                "street"   => form_data.street   = Some(value_str),
                "city"     => form_data.city     = Some(value_str),
                "postcode" => form_data.postcode = Some(value_str),
                "phone"    => form_data.phone    = Some(value_str),
                "email"    => form_data.email    = Some(value_str),
                "message"  => form_data.message  = Some(value_str),
                _ => {}
            }
        }
    }

    // 這裡你可以把 form_data 存到資料庫，或進行後續處理
    // 為了示範，我們先印到 console：
    // println!("接收到的表單資料: {:#?}", form_data);
    // borrow form_data
    let name_clone = form_data.name.clone();    
    let street_clone = form_data.street.clone();
    let city_clone = form_data.city.clone();
    let postcode_clone = form_data.postcode.clone();
    let phone_clone = form_data.phone.clone();
    let email_clone = form_data.email.clone();
    let message_clone = form_data.message.clone();
    let text_msg = format!("Name: {}\nStreet: {}\nCity: {}\nPostcode: {}\nPhone: {}\nEmail: {}\nMessage: {}", name_clone.unwrap_or_default(), street_clone.unwrap_or_default(), city_clone.unwrap_or_default(), postcode_clone.unwrap_or_default(), phone_clone.unwrap_or_default(), email_clone.unwrap_or_default(), message_clone.unwrap_or_default());
    dotenv().ok();
    let bot_token = env::var("TELEGRAM_BOT_TOKEN").unwrap_or_default();
    let chat_id   = env::var("TELEGRAM_CHAT_ID").unwrap_or_default();
     // 3. 呼叫 send_message 裏面的函式
    //    這裡若失敗，你可以選擇回傳錯誤，或只是印出錯誤訊息
    match telegram_bot::send_message(&bot_token, &chat_id, &text_msg).await {
        Ok(_) => println!("Telegram 訊息已成功送出！"),
        Err(e) => eprintln!("送出 Telegram 訊息失敗: {}", e),
    }

    //  發送檔案
    if let (Some(file_bytes), Some(file_name)) = (&form_data.file_content, &form_data.file_name) {
        match telegram_bot::send_telegram_file(&bot_token, &chat_id, file_bytes, file_name).await {
            Ok(_)  => println!("File has been sent to Telegram chat_id={}!", chat_id),
            Err(e) => eprintln!("Failed to send file: {}", e),
        }
    }

    // 回傳成功訊息
    Ok(HttpResponse::Ok().json({
        // 這裡單純回傳 JSON 格式的資料，實際可回傳你需要的格式
        serde_json::json!({
            "status": "success",
            "data": form_data
        })
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    HttpServer::new(|| {
        // 从环境变量获取允许的域名，默认为 alphacurve.io
        let allowed_domains = env::var("ALLOWED_DOMAINS")
            .unwrap_or_else(|_| "alphacurve.io,www.alphacurve.io".to_string());
        
        let domains_clone = allowed_domains.clone();
        
        // 创建 CORS 配置，使用动态检查
        let cors = Cors::default()
            .allowed_origin_fn(move |origin, _req_head| {
                if let Ok(origin_str) = origin.to_str() {
                    // 允许 localhost（开发环境）
                    if origin_str.starts_with("http://localhost:") {
                        return true;
                    }
                    
                    // 检查是否匹配允许的域名
                    for domain in domains_clone.split(',') {
                        let domain = domain.trim();
                        if origin_str.contains(domain) {
                            return true;
                        }
                    }
                }
                false
            })
            .allowed_methods(vec!["GET", "POST", "OPTIONS"])
            .allowed_headers(vec!["Content-Type", "Authorization", "Origin", "Referer"])
            .max_age(3600);

        App::new()
            .wrap(cors)
            .route("/health", actix_web::web::get().to(health_check))
            .route("/healthz", actix_web::web::get().to(health_check))
            .service(submit_form)
            .service(chat_endpoint)
            .service(emotion_endpoint)
            .service(emotion_reply_endpoint)
    })
    // bind to all interfaces
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
