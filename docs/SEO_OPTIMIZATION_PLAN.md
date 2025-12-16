# SEO 優化方案

## 📊 概述

本文檔列出了 Alphacurve.io 網站的 SEO 優化建議，涵蓋技術 SEO、內容優化、結構化數據等方面。

## 🔍 當前狀態分析

### ✅ 已實現
- 基本的 meta 標籤（description, keywords）
- Open Graph 標籤（Facebook 分享）
- Twitter Card 標籤
- Google Analytics 追蹤
- 響應式設計（viewport）

### ❌ 需要改進
- 缺少 robots.txt
- 缺少 sitemap.xml
- 缺少結構化數據（Schema.org）
- HTML lang 屬性固定為 "en"（應根據語言動態）
- 缺少 canonical URL
- 圖片缺少 alt 屬性優化
- 缺少 hreflang 標籤（多語言）
- 頁面標題和描述可以更優化

---

## 🎯 SEO 優化建議

### 1. 技術 SEO

#### 1.1 創建 robots.txt

**文件位置**：`public/robots.txt`

```txt
User-agent: *
Allow: /
Disallow: /room2.html
Disallow: /api/

# Sitemap
Sitemap: https://alphacurve.io/sitemap.xml
```

**說明**：
- 允許所有搜索引擎爬蟲
- 禁止爬取 3D 會議室頁面（避免重複內容）
- 禁止爬取 API 端點
- 指向 sitemap

#### 1.2 創建 sitemap.xml

**文件位置**：`public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://alphacurve.io/</loc>
    <lastmod>2024-12-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="zh" href="https://alphacurve.io/?lang=zh"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://alphacurve.io/?lang=en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://alphacurve.io/"/>
  </url>
</urlset>
```

**說明**：
- 包含主要頁面
- 使用 hreflang 標籤支持多語言
- 設置更新頻率和優先級

#### 1.3 動態 HTML lang 屬性

**問題**：當前 `index.html` 中 `lang="en"` 是固定的

**解決方案**：使用 React Helmet 或類似工具動態設置

#### 1.4 Canonical URL

**建議**：在每個頁面添加 canonical URL，避免重複內容

```html
<link rel="canonical" href="https://alphacurve.io/" />
```

---

### 2. Meta 標籤優化

#### 2.1 頁面標題優化

**當前**：`Alphacurve.io - Unlock Your Business Potential`

**建議**：
- **中文**：`Alphacurve.io | AI 技術顧問與軟體開發服務`
- **英文**：`Alphacurve.io | AI Tech Consulting & Software Development`

**最佳實踐**：
- 包含主要關鍵字
- 長度 50-60 字符
- 品牌名稱在前
- 使用分隔符（| 或 -）

#### 2.2 Meta Description 優化

**當前**：`Integrate technology and business strategy with Alphacurve.io to break through tech bottlenecks and unleash your business potential.`

**建議**：
- **中文**：`Alphacurve 提供 AI 整合、軟體開發與技術顧問服務。協助企業突破技術瓶頸，實現數位轉型與業務成長。專業團隊，客製化解決方案。`
- **英文**：`Alphacurve provides AI integration, software development, and tech consulting services. Help businesses break through tech bottlenecks and achieve digital transformation. Expert team, customized solutions.`

**最佳實踐**：
- 長度 150-160 字符
- 包含主要關鍵字
- 有行動呼籲（CTA）
- 描述價值主張

#### 2.3 Meta Keywords（可選）

**注意**：Google 已不再使用 keywords，但可以保留用於其他搜索引擎

**建議關鍵字**：
- **中文**：AI 整合, 軟體開發, 技術顧問, 數位轉型, 系統開發, 自動化, 雲端解決方案
- **英文**：AI integration, software development, tech consulting, digital transformation, system development, automation, cloud solutions

---

### 3. 結構化數據（Schema.org）

#### 3.1 Organization Schema

**位置**：`public/index.html` 或通過 React Helmet 動態添加

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Alphacurve",
  "url": "https://alphacurve.io",
  "logo": "https://alphacurve.io/header-icon.svg",
  "description": "AI 技術顧問與軟體開發服務",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "contact@alphacurve.io",
    "availableLanguage": ["zh", "en"]
  },
  "sameAs": [
    "https://page.line.me/alphacurve"
  ]
}
```

#### 3.2 Service Schema

**位置**：Services 或 ServiceModel 組件

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Tech Consulting",
  "provider": {
    "@type": "Organization",
    "name": "Alphacurve"
  },
  "areaServed": "TW",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://alphacurve.io/contact"
  }
}
```

#### 3.3 FAQ Schema

**位置**：FAQ 組件

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "為什麼需要先付顧問費？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "顧問階段會產出需求分析、架構草案、可行性評估、預算與工期估算等具體成果..."
      }
    }
  ]
}
```

#### 3.4 WebSite Schema（帶搜索功能）

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Alphacurve.io",
  "url": "https://alphacurve.io",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://alphacurve.io/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

### 4. 內容優化

#### 4.1 標題結構（H1-H6）

**當前檢查**：
- ✅ Hero Section 有 H1
- ⚠️ 需要確保標題層級正確

**建議**：
```
H1: 主標題（每個頁面只有一個）
H2: 主要區塊標題（Services, Team, Contact）
H3: 子區塊標題（各服務項目）
H4-H6: 更細分的內容
```

#### 4.2 關鍵字密度

**主要關鍵字**：
- **中文**：AI 整合、軟體開發、技術顧問、數位轉型
- **英文**：AI integration, software development, tech consulting

**建議**：
- 關鍵字密度 1-2%
- 自然使用，避免關鍵字堆砌
- 使用同義詞和相關詞

#### 4.3 內容長度

**建議**：
- 每個主要 section 至少 300 字
- 總頁面內容至少 1000 字
- 定期更新內容

#### 4.4 內部連結

**建議**：
- 在內容中自然添加內部連結
- 使用描述性錨文本
- 連結到相關的 section

---

### 5. 圖片優化

#### 5.1 Alt 屬性

**檢查清單**：
- [ ] 所有圖片都有 alt 屬性
- [ ] Alt 文本描述圖片內容
- [ ] 包含相關關鍵字（自然）
- [ ] 裝飾性圖片使用空 alt（alt=""）

**示例**：
```html
<!-- 好的 -->
<img src="service-icon.svg" alt="AI 整合服務圖標" />

<!-- 裝飾性圖片 -->
<img src="decoration.svg" alt="" />
```

#### 5.2 圖片優化

**建議**：
- 使用 WebP 格式（現代瀏覽器）
- 提供 fallback（PNG/JPG）
- 壓縮圖片大小
- 使用適當的尺寸（響應式）
- 添加 loading="lazy" 延遲加載

#### 5.3 圖片 Schema

```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "contentUrl": "https://alphacurve.io/image.jpg",
  "description": "AI 整合服務說明圖"
}
```

---

### 6. 多語言 SEO

#### 6.1 hreflang 標籤

**位置**：`public/index.html` 或通過 React Helmet

```html
<link rel="alternate" hreflang="zh" href="https://alphacurve.io/?lang=zh" />
<link rel="alternate" hreflang="en" href="https://alphacurve.io/?lang=en" />
<link rel="alternate" hreflang="x-default" href="https://alphacurve.io/" />
```

#### 6.2 動態 lang 屬性

**問題**：當前 HTML lang 固定為 "en"

**解決方案**：使用 React Helmet 根據當前語言動態設置

```javascript
import { Helmet } from 'react-helmet-async';

<Helmet>
  <html lang={language} />
  <title>{language === 'zh' ? '中文標題' : 'English Title'}</title>
  <meta name="description" content={language === 'zh' ? '中文描述' : 'English Description'} />
</Helmet>
```

---

### 7. 性能優化（影響 SEO）

#### 7.1 Core Web Vitals

**指標**：
- **LCP (Largest Contentful Paint)**：< 2.5 秒
- **FID (First Input Delay)**：< 100 毫秒
- **CLS (Cumulative Layout Shift)**：< 0.1

**優化建議**：
- 優化圖片大小和格式
- 使用 CDN
- 代碼分割（Code Splitting）
- 延遲加載非關鍵資源
- 優化字體加載

#### 7.2 移動端優化

**檢查**：
- ✅ 已有 viewport meta 標籤
- ⚠️ 確保觸控目標足夠大（至少 44x44px）
- ⚠️ 確保文字可讀（至少 16px）

---

### 8. 安全性（影響 SEO）

#### 8.1 HTTPS

**檢查**：✅ 網站應使用 HTTPS

#### 8.2 Security Headers

**建議添加**（在服務器配置中）：
```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
```

---

### 9. 社交媒體優化

#### 9.1 Open Graph 優化

**當前**：已有基本 OG 標籤

**建議改進**：
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://alphacurve.io" />
<meta property="og:title" content="Alphacurve.io | AI 技術顧問與軟體開發" />
<meta property="og:description" content="提供 AI 整合、軟體開發與技術顧問服務..." />
<meta property="og:image" content="https://alphacurve.io/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="zh_TW" />
<meta property="og:locale:alternate" content="en_US" />
```

#### 9.2 Twitter Card 優化

**當前**：已有基本 Twitter Card

**建議**：確保圖片尺寸正確（1200x630px）

---

### 10. 本地 SEO（如果適用）

#### 10.1 LocalBusiness Schema

如果提供本地服務，可以添加：

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Alphacurve",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "TW"
  }
}
```

---

## 📋 實施優先級

### 高優先級（立即實施）

1. ✅ **創建 robots.txt**
2. ✅ **創建 sitemap.xml**
3. ✅ **添加結構化數據**（Organization, Service, FAQ）
4. ✅ **優化頁面標題和描述**
5. ✅ **添加 hreflang 標籤**
6. ✅ **動態設置 HTML lang 屬性**

### 中優先級（1-2 周內）

1. 優化所有圖片的 alt 屬性
2. 添加 canonical URL
3. 優化 Open Graph 和 Twitter Card
4. 添加 WebSite Schema（帶搜索功能）
5. 內容優化（關鍵字密度、內部連結）

### 低優先級（後續優化）

1. 圖片格式優化（WebP）
2. 性能優化（Core Web Vitals）
3. 本地 SEO（如果適用）
4. 創建博客或資源中心（增加內容）

---

## 🛠️ 實施步驟

### 步驟 1：創建基礎 SEO 文件

1. 創建 `public/robots.txt`
2. 創建 `public/sitemap.xml`
3. 安裝 React Helmet（用於動態 meta 標籤）

### 步驟 2：添加結構化數據

1. 在 `public/index.html` 中添加 Organization Schema
2. 在 FAQ 組件中添加 FAQPage Schema
3. 在 Services 組件中添加 Service Schema

### 步驟 3：優化 Meta 標籤

1. 使用 React Helmet 動態設置標題和描述
2. 根據語言切換內容
3. 添加 hreflang 標籤

### 步驟 4：內容和圖片優化

1. 檢查並優化所有 alt 屬性
2. 優化內容關鍵字
3. 添加內部連結

### 步驟 5：驗證和測試

1. 使用 Google Search Console 提交 sitemap
2. 使用 Google Rich Results Test 測試結構化數據
3. 使用 PageSpeed Insights 測試性能
4. 使用 Mobile-Friendly Test 測試移動端

---

## 📊 預期效果

### 短期（1-3 個月）
- 改善搜索引擎索引
- 提高結構化數據顯示（Rich Snippets）
- 改善社交媒體分享預覽

### 中期（3-6 個月）
- 提高搜索排名
- 增加有機流量
- 改善點擊率（CTR）

### 長期（6-12 個月）
- 建立品牌權威
- 持續的有機流量增長
- 更好的用戶體驗指標

---

## 🔍 監控和維護

### 工具推薦

1. **Google Search Console**
   - 監控搜索表現
   - 提交 sitemap
   - 檢查索引問題

2. **Google Analytics**
   - 追蹤有機流量
   - 分析用戶行為
   - 監控轉化

3. **PageSpeed Insights**
   - 監控 Core Web Vitals
   - 性能優化建議

4. **Ahrefs / SEMrush**（可選）
   - 關鍵字排名追蹤
   - 競爭對手分析
   - 反向連結監控

### 定期檢查

- **每週**：檢查 Google Search Console 錯誤
- **每月**：審查搜索排名和流量
- **每季度**：更新內容和優化策略

---

## 📚 參考資源

- [Google Search Central](https://developers.google.com/search)
- [Schema.org 文檔](https://schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

