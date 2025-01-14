use reqwest::Client;
use std::error::Error;
use reqwest::multipart;



/// 傳送 Telegram 訊息
///
/// * `token` - 你的 Telegram Bot Token (從 .env 讀取或其他來源)
/// * `chat_id` - 目標聊天室 ID
/// * `text` - 要傳送的文字訊息
pub async fn send_message(
    token: &str,
    chat_id: &str,
    text: &str
) -> Result<(), Box<dyn Error>> {
    // Telegram bot API endpoint
    let url = format!("https://api.telegram.org/bot{}/sendMessage", token);

    // 建立 POST 參數
    // Telegram 目前只要帶上 "chat_id" 跟 "text" 即可
    let params = [("chat_id", chat_id), ("text", text)];

    // 建立 reqwest client，發送表單參數
    let client = Client::new();
    let resp = client
        .post(&url)
        .form(&params)
        .send()
        .await?;

    if resp.status().is_success() {
        Ok(())
    } else {
        let status = resp.status();
        let body_text = resp.text().await.unwrap_or_default();
        Err(format!("無法傳送 Telegram 訊息, status: {}, body: {}", status, body_text).into())
    }
}


pub async fn send_telegram_file(
    token: &str,
    chat_id: &str,
    file_data: &[u8],
    file_name: &str,
) -> Result<(), Box<dyn Error>> {
    // Telegram `sendDocument` API endpoint
    let url = format!("https://api.telegram.org/bot{}/sendDocument", token);

    // 建立 multipart/form-data
    // - chat_id 為你要傳送到的目標聊天室
    // - document 為檔案本體
    //   - file_name(...) 為檔名，Telegram 端可見
    //   - mime_str(...) 這裡示範用預設 application/octet-stream
    let form = multipart::Form::new()
        .text("chat_id", chat_id.to_string())
        .part(
            "document",
            multipart::Part::bytes(file_data.to_vec())
                .file_name(file_name.to_string())
                .mime_str("application/octet-stream")?,
        );

    let client = Client::new();
    let resp = client
        .post(url)
        .multipart(form)
        .send()
        .await?;

    if resp.status().is_success() {
        Ok(())
    } else {
        let status = resp.status();
        let body_text = resp.text().await.unwrap_or_default();
        Err(format!("sendDocument API call failed. status: {}, body: {}", status, body_text).into())
    }
}
