# Google Analytics 4 (GA4) 事件追蹤方案

## 📊 概述

本文檔列出了 Alphacurve.io 網站應該追蹤的關鍵用戶行為事件，以便獲得有意義的數據用於未來優化。

## 🎯 追蹤目標

1. **用戶參與度**：了解用戶如何與網站互動
2. **轉化追蹤**：追蹤潛在客戶的關鍵行為
3. **內容效果**：評估不同內容區塊的表現
4. **用戶體驗**：識別用戶痛點和使用模式
5. **功能使用**：了解哪些功能最受歡迎

---

## 📋 建議追蹤的事件

### 1. 頁面瀏覽與導航

#### 1.1 頁面瀏覽（自動追蹤）
- **事件名稱**：`page_view`（GA4 默認）
- **說明**：自動追蹤所有頁面瀏覽
- **自定義參數**：
  - `page_title`: 頁面標題
  - `page_location`: 完整 URL
  - `page_path`: 路徑
  - `language`: 當前語言（zh/en）

#### 1.2 導航菜單點擊
- **事件名稱**：`nav_click`
- **觸發時機**：用戶點擊導航菜單項
- **參數**：
  - `nav_item`: 導航項名稱（如 "services", "team", "contact"）
  - `nav_position`: 在菜單中的位置
  - `language`: 當前語言

#### 1.3 滾動深度
- **事件名稱**：`scroll_depth`
- **觸發時機**：用戶滾動到頁面的特定深度
- **參數**：
  - `scroll_depth`: 滾動百分比（25%, 50%, 75%, 90%）
  - `section`: 當前可見的主要區塊

#### 1.4 Section 進入視圖
- **事件名稱**：`section_view`
- **觸發時機**：當某個 section 進入視口時
- **參數**：
  - `section_name`: section 名稱（hero, services, team, service_model, contact）
  - `section_index`: section 在頁面中的順序
  - `time_on_page`: 到達該 section 的時間（秒）

---

### 2. 語言與本地化

#### 2.1 語言切換
- **事件名稱**：`language_toggle`
- **觸發時機**：用戶切換語言
- **參數**：
  - `from_language`: 原語言
  - `to_language`: 目標語言
  - `toggle_location`: 切換位置（header）

---

### 3. 聯系表單

#### 3.1 表單開始填寫
- **事件名稱**：`form_start`
- **觸發時機**：用戶首次在表單字段中輸入
- **參數**：
  - `form_name`: "contact_form"
  - `form_location`: "contact_section"

#### 3.2 表單字段交互
- **事件名稱**：`form_field_focus`
- **觸發時機**：用戶聚焦到表單字段
- **參數**：
  - `field_name`: 字段名稱（name, email, phone, message, file）
  - `field_type`: 字段類型
  - `form_name`: "contact_form"

#### 3.3 文件上傳
- **事件名稱**：`file_upload`
- **觸發時機**：用戶選擇文件上傳
- **參數**：
  - `file_type`: 文件類型
  - `file_size`: 文件大小（KB）
  - `form_name`: "contact_form"

#### 3.4 表單提交
- **事件名稱**：`form_submit`
- **觸發時機**：用戶提交表單
- **參數**：
  - `form_name`: "contact_form"
  - `form_completion_time`: 填寫表單耗時（秒）
  - `fields_filled`: 已填寫的字段數
  - `has_file`: 是否上傳了文件（true/false）

#### 3.5 表單提交成功
- **事件名稱**：`form_submit_success`
- **觸發時機**：表單成功提交
- **參數**：
  - `form_name`: "contact_form"
  - `response_time`: API 響應時間（毫秒）

#### 3.6 表單提交失敗
- **事件名稱**：`form_submit_error`
- **觸發時機**：表單提交失敗
- **參數**：
  - `form_name`: "contact_form"
  - `error_type`: 錯誤類型（network_error, validation_error, server_error）
  - `error_message`: 錯誤信息

---

### 4. 3D 會議室（Room2）互動

#### 4.1 進入 3D 會議室
- **事件名稱**：`room2_enter`
- **觸發時機**：用戶長按 Logo 進入 3D 會議室
- **參數**：
  - `entry_method`: "long_press_logo"
  - `press_duration`: 長按時長（毫秒）

#### 4.2 3D 會議室加載
- **事件名稱**：`room2_load`
- **觸發時機**：3D 會議室頁面加載完成
- **參數**：
  - `load_time`: 加載時間（毫秒）
  - `models_loaded`: 加載的模型數量
  - `language`: 當前語言

#### 4.3 相機交互
- **事件名稱**：`room2_camera_interaction`
- **觸發時機**：用戶旋轉或縮放相機
- **參數**：
  - `interaction_type`: "rotate" | "zoom"
  - `duration`: 交互持續時間（秒）

#### 4.4 點擊人物
- **事件名稱**：`room2_character_click`
- **觸發時機**：用戶點擊 3D 場景中的人物
- **參數**：
  - `character_type`: "kid1" | "person_0" | "person_1" 等
  - `character_position`: 人物位置（x, y, z）

#### 4.5 AI 聊天 - 問題提交
- **事件名稱**：`room2_chat_question`
- **觸發時機**：用戶提交問題到 AI
- **參數**：
  - `question_length`: 問題長度（字符數）
  - `question_language`: 問題語言（檢測）
  - `has_question_mark`: 是否包含問號

#### 4.6 AI 聊天 - 回答顯示
- **事件名稱**：`room2_chat_answer`
- **觸發時機**：AI 回答顯示
- **參數**：
  - `answer_length`: 回答長度（字符數）
  - `response_time`: API 響應時間（毫秒）
  - `answer_language`: 回答語言

#### 4.7 AI 聊天 - 錯誤
- **事件名稱**：`room2_chat_error`
- **觸發時機**：AI 聊天出錯
- **參數**：
  - `error_type`: 錯誤類型
  - `error_message`: 錯誤信息

#### 4.8 對話氣泡查看
- **事件名稱**：`room2_bubble_view`
- **觸發時機**：用戶看到對話氣泡
- **參數**：
  - `bubble_type`: "random" | "ai_answer" | "character_click"
  - `character_id`: 人物 ID
  - `message_length`: 消息長度

---

### 5. 服務模式區塊（Service Model）

#### 5.1 FAQ 展開
- **事件名稱**：`faq_expand`
- **觸發時機**：用戶展開 FAQ 問題
- **參數**：
  - `faq_index`: FAQ 索引
  - `faq_question`: 問題文本（前 50 字符）
  - `section`: "service_model"

#### 5.2 CTA 按鈕點擊
- **事件名稱**：`cta_click`
- **觸發時機**：用戶點擊 CTA 按鈕
- **參數**：
  - `cta_type`: "line" | "contact" | "service"
  - `cta_text`: 按鈕文本
  - `cta_location`: 按鈕位置
  - `destination`: 目標 URL 或錨點

#### 5.3 服務卡片點擊
- **事件名稱**：`service_card_click`
- **觸發時機**：用戶點擊服務卡片
- **參數**：
  - `service_name`: 服務名稱
  - `service_index`: 服務索引
  - `card_type`: "service" | "process" | "why_consulting"

---

### 6. 外部鏈接

#### 6.1 外部鏈接點擊
- **事件名稱**：`external_link_click`
- **觸發時機**：用戶點擊外部鏈接
- **參數**：
  - `link_url`: 鏈接 URL
  - `link_text`: 鏈接文本
  - `link_location`: 鏈接位置

#### 6.2 Line 鏈接點擊
- **事件名稱**：`line_click`
- **觸發時機**：用戶點擊 Line 鏈接
- **參數**：
  - `link_location`: 鏈接位置（header, footer, cta）
  - `link_text`: 鏈接文本

---

### 7. 移動端特定

#### 7.1 移動菜單打開
- **事件名稱**：`mobile_menu_open`
- **觸發時機**：移動端用戶打開菜單
- **參數**：
  - `device_type`: "mobile" | "tablet"
  - `screen_width`: 屏幕寬度

#### 7.2 地圖 Pin 點擊
- **事件名稱**：`map_pin_click`
- **觸發時機**：移動端用戶點擊地圖 Pin
- **參數**：
  - `device_type`: "mobile" | "tablet"

---

### 8. 用戶參與度指標

#### 8.1 會話時長
- **事件名稱**：`session_duration`（GA4 自動）
- **說明**：追蹤用戶會話時長

#### 8.2 頁面停留時間
- **事件名稱**：`time_on_page`（GA4 自動）
- **說明**：追蹤頁面停留時間

#### 8.3 跳出率
- **事件名稱**：`bounce`（GA4 自動）
- **說明**：追蹤單頁會話

---

## 🎨 自定義維度建議

### 用戶維度
1. **用戶類型**：新用戶 / 回訪用戶
2. **設備類型**：桌面 / 平板 / 移動設備
3. **瀏覽器**：Chrome, Safari, Firefox 等
4. **操作系統**：Windows, macOS, iOS, Android
5. **語言偏好**：zh / en

### 內容維度
1. **內容區塊**：hero, services, team, service_model, contact
2. **服務類型**：AI, 自動化, 系統開發等
3. **頁面類型**：首頁, 3D 會議室

### 行為維度
1. **參與度等級**：低 / 中 / 高
2. **轉化階段**：瀏覽 / 興趣 / 行動
3. **用戶路徑**：首次訪問路徑

---

## 📈 關鍵指標（KPIs）

### 轉化指標
1. **表單提交率**：表單提交數 / 表單開始填寫數
2. **3D 會議室進入率**：進入 3D 會議室數 / 首頁訪問數
3. **AI 聊天使用率**：使用 AI 聊天數 / 進入 3D 會議室數
4. **CTA 點擊率**：CTA 點擊數 / 頁面瀏覽數

### 參與度指標
1. **平均會話時長**
2. **平均頁面瀏覽數**
3. **滾動深度分布**
4. **Section 查看率**

### 內容效果指標
1. **各 Section 查看率**
2. **FAQ 展開率**
3. **服務卡片點擊率**
4. **導航菜單使用率**

---

## 🔧 實施建議

### 優先級

#### 高優先級（立即實施）
1. ✅ 表單提交追蹤（form_submit, form_submit_success）
2. ✅ 3D 會議室進入追蹤（room2_enter）
3. ✅ AI 聊天追蹤（room2_chat_question, room2_chat_answer）
4. ✅ CTA 按鈕點擊追蹤（cta_click, line_click）
5. ✅ 導航菜單點擊追蹤（nav_click）

#### 中優先級（1-2 周內）
1. Section 進入視圖追蹤（section_view）
2. 滾動深度追蹤（scroll_depth）
3. FAQ 展開追蹤（faq_expand）
4. 表單字段交互追蹤（form_field_focus）

#### 低優先級（後續優化）
1. 相機交互追蹤（room2_camera_interaction）
2. 對話氣泡查看追蹤（room2_bubble_view）
3. 文件上傳追蹤（file_upload）

### 實施步驟

1. **創建 GA4 事件追蹤工具函數**
   - 創建統一的 `gtag` 封裝函數
   - 確保所有事件格式一致

2. **逐步添加追蹤代碼**
   - 從高優先級事件開始
   - 測試每個事件的觸發和參數

3. **驗證和調試**
   - 使用 GA4 DebugView 驗證事件
   - 檢查參數是否正確傳遞

4. **創建報告和儀表板**
   - 在 GA4 中創建自定義報告
   - 設置關鍵指標警報

---

## 📝 代碼示例

### 基礎追蹤函數

```javascript
// utils/analytics.js
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: Date.now(),
    });
  }
};

// 使用示例
trackEvent('form_submit', {
  form_name: 'contact_form',
  form_completion_time: 120,
  fields_filled: 5,
  has_file: true,
});
```

### 表單追蹤示例

```javascript
// ContactForm.js
const handleSubmit = async (e) => {
  e.preventDefault();
  const startTime = Date.now();
  
  // 追蹤表單提交
  trackEvent('form_submit', {
    form_name: 'contact_form',
    form_completion_time: Math.floor((Date.now() - formStartTime) / 1000),
    fields_filled: Object.values(formData).filter(v => v).length,
    has_file: !!formData.file,
  });
  
  try {
    const response = await fetch(apiUrl, { method: 'POST', body: data });
    if (response.ok) {
      trackEvent('form_submit_success', {
        form_name: 'contact_form',
        response_time: Date.now() - startTime,
      });
    } else {
      trackEvent('form_submit_error', {
        form_name: 'contact_form',
        error_type: 'server_error',
      });
    }
  } catch (error) {
    trackEvent('form_submit_error', {
      form_name: 'contact_form',
      error_type: 'network_error',
    });
  }
};
```

### 3D 會議室追蹤示例

```javascript
// ContactForm.js - 長按進入 3D 會議室
const startLongPress = () => {
  const pressStartTime = Date.now();
  // ... 長按邏輯 ...
  
  if (percent >= 100) {
    trackEvent('room2_enter', {
      entry_method: 'long_press_logo',
      press_duration: Date.now() - pressStartTime,
    });
    setShowRoom(true);
  }
};

// room2.html - AI 聊天
async function sendQuestion(question) {
  trackEvent('room2_chat_question', {
    question_length: question.length,
    question_language: detectLanguage(question),
    has_question_mark: question.includes('?'),
  });
  
  const startTime = Date.now();
  const response = await fetch(apiUrl, { ... });
  const data = await response.json();
  
  trackEvent('room2_chat_answer', {
    answer_length: data.answer.length,
    response_time: Date.now() - startTime,
    answer_language: detectLanguage(data.answer),
  });
}
```

---

## 🎯 預期收益

1. **數據驅動決策**：基於真實用戶行為數據優化網站
2. **轉化率優化**：識別轉化漏鬥中的瓶頸
3. **內容優化**：了解哪些內容最吸引用戶
4. **用戶體驗改進**：發現用戶痛點並改進
5. **ROI 追蹤**：評估營銷活動和功能的效果

---

## 📚 參考資料

- [GA4 事件文檔](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 自定義維度](https://support.google.com/analytics/answer/10075209)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)

