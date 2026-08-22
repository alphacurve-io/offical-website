# DualView 專案配合調整 — efacani.com 鏡像

> 背景：Google for Startups 以「公司屬諮詢/服務類型」初審未過，申請策略改為以
> **dualview.app 產品**申請。efacani.com（申請人 email / GCP Billing Admin 的網域）
> 改為**反向代理鏡像 dualview.app**——網址列保持 efacani.com，內容是 DualView。
>
> nginx 端（nginx VM, ai-saas-419818）已由 `deploy/nginx/efacani.com.conf` 處理：
> `/api/` → pvds-backend (:8090)、其餘 → pvds-landing (:8092)，與 dualview.app
> 站台共用同一組 upstream。**本文件是 dualview.app 專案（app VM 上的 code）要做的事。**

## 必做

### 1. 前端 API base 改成相對路徑（解掉 CORS）

現況：pvds-landing 以 `NEXT_PUBLIC_API_BASE=https://dualview.app` 編譯，
瀏覽器端 fetch 會打絕對網址。從 efacani.com 開站時，這些呼叫變成
**跨網域 → 後端沒有 CORS 標頭 → 登入與所有 API 全部失敗**。

改法：把 API base 改成**空字串（相對路徑）**，fetch 打 `/api/v1/...`，
自動落在目前網域，由 nginx 轉給後端——兩個網域都同源、完全不需要 CORS。

```bash
# 部署流程 / ecosystem.config.js / .env.production 中：
NEXT_PUBLIC_API_BASE=            # 原本是 https://dualview.app
```

留意程式碼裡組 URL 的地方，確認 base 為空字串時結果是 `/api/v1/...`
（例如 `` `${base}/api/v1/xxx` `` 這種寫法空字串就直接可用）。
改完需**重新 build + 重啟 pvds-landing**（NEXT_PUBLIC_* 是編譯期注入，改 env 不重啟無效）。

替代方案（不想動前端時）：在 Go 後端加 CORS middleware，
`Access-Control-Allow-Origin: https://efacani.com` + `Authorization, Content-Type`
headers + OPTIONS preflight 回 204。但相對路徑方案更乾淨，優先採用。

### 2. Next.js host 相關設定

nginx 會把 `Host: efacani.com` 原樣傳給 Next.js，逐項檢查：

- **Server Actions**（若有用）：Next.js 會驗證 Origin/Host。同源情況下兩者都是
  efacani.com 會通過；但若有設定 `experimental.serverActions.allowedOrigins`，
  要把 `efacani.com` 加進去。
- **host 檢查 / 網域轉址 middleware**：若 middleware 有「非 dualview.app 就 301 回
  dualview.app」之類的邏輯，要放行 efacani.com，否則鏡像會被彈走。
- **locale 轉址**（`/` → 307 `/zh-TW`）：目前是相對路徑轉址，不用改；
  若之後改成絕對網址記得用相對路徑。

### 3. 檢查登入憑證的存放方式

- JWT 放 **localStorage / Authorization header**：不用改（同源呼叫後一切正常）。
- 若是 **cookie**：確認後端 `Set-Cookie` **沒有寫死 `Domain=dualview.app`**
  （host-only cookie 即可，兩個網域各自成立）。

## 建議做（非必要）

- **寫死的 `https://dualview.app` 連結**：頁面上分享連結、og:url、canonical 等
  仍會指向 dualview.app。SEO 上這反而正確（efacani.com 被視為別名、不分散權重），
  對補助審核無影響；但站內導覽連結若有寫死絕對網址，訪客會被帶離 efacani.com，
  建議改相對路徑。
- **next.config images**：若 `<Image>` 有載入絕對網址的圖，確認 `remotePatterns`
  涵蓋；純相對路徑則不用動。

## 不用動的

- **GCP 防火牆**：流量仍然只從 nginx VM 進 app VM 的 :8092/:8090，來源 IP 不變。
- **dualview.app 本身的 nginx 站台**：保持啟用（efacani.com 引用它定義的 upstream）。
- **pvds-backend 監聽位址**：維持 0.0.0.0:8090。

## 驗證清單（全部做完後）

```bash
curl -sI https://efacani.com            # 307 → /zh-TW
curl -sI https://efacani.com/zh-TW      # 200，內容是 DualView landing
curl -sI https://dualview.app           # 原站不受影響
```

瀏覽器開 https://efacani.com：

1. DevTools Network 確認 API 呼叫都打 `https://efacani.com/api/v1/...`（不是 dualview.app）
2. 走一次註冊/登入流程
3. dualview.app 本尊也再走一次登入，確認相對路徑改動沒有弄壞原站
