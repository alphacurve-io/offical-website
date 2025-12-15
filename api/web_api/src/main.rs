mod telegram_bot;
use actix_multipart::Multipart;
use actix_web::{
    App, Error, HttpResponse, HttpServer, Responder, post
};
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

async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "alphacurve-web-api",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
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
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000") // Replace with your allowed origin
            .allowed_methods(vec!["GET", "POST", "OPTIONS"])
            .allowed_headers(vec!["Content-Type", "Authorization"])
            .max_age(3600);

        App::new()
            .wrap(cors)
            .route("/health", actix_web::web::get().to(health_check))
            .route("/healthz", actix_web::web::get().to(health_check))
            .service(submit_form)
    })
    // bind to all interfaces
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
