# Deploy 設定

官網主機：`nginx` VM（GCP 專案 `ai-saas-419818`，zone `asia-east1-c`，IP `34.81.6.91`）

```bash
gcloud compute ssh nginx --project=ai-saas-419818 --zone=asia-east1-c
```

## 檔案說明

| 檔案 | 說明 |
|---|---|
| `nginx/efacani.com.conf` | efacani.com 的完整 nginx 設定（2026-08-22 起改為**鏡像 dualview.app**） |
| `nginx/alphacurve.io.conf` | 主站設定快照（2026-08-19 從主機備份，官網 upstream 定義在這裡） |
| `nginx/apply-efacani.sh` | 一鍵套用腳本：SSH 進主機後整段貼上即可 |
| `dualview-app-adjustments.md` | dualview.app 專案配合鏡像要做的調整（API base 改相對路徑等） |

## 套用 efacani.com 設定

SSH 進 nginx 主機後，把 `nginx/apply-efacani.sh` 的內容**整段複製貼上**。它會：

1. 用 `sudo tee` 覆寫 `/etc/nginx/sites-available/efacani.com`
2. 確保 `sites-enabled/efacani.com` 是指向 sites-available 的 symlink
3. `nginx -t` 檢查語法，通過才 reload
4. `curl` 驗證 https://efacani.com 回應

## 設計重點

- **efacani.com 現在是 dualview.app 的鏡像**（2026-08-22 策略調整：Google for Startups 以「諮詢/服務公司」初審未過，改以 DualView 產品申請）。網址列保持 efacani.com，`/api/` 反向代理到 pvds-backend（app VM :8090）、其餘到 pvds-landing（app VM :8092）。
- **upstream 引用**：`dualview_landing` / `dualview_backend` 定義在主機的 `sites-available/dualview.app`，efacani.com 只引用、不重複定義——因此 **dualview.app 站台必須保持啟用**，否則 efacani.com 會因找不到 upstream 而 nginx -t 失敗。（舊版鏡像官網時同理依賴 alphacurve.io 的 `backend_alphacurve_api`。）
- **dualview.app 專案要配合調整**（否則登入/API 會因 CORS 失敗）：見 `dualview-app-adjustments.md`。
- **憑證**：`/etc/letsencrypt/live/efacani.com/`（certbot 自動續約，2026-11-17 到期）。目前只簽了 `efacani.com`，若要支援 `www.efacani.com`，先設 DNS 再跑 `sudo certbot --nginx -d efacani.com -d www.efacani.com --expand`。
- `listen [::]:443` 不加 `ipv6only=on`（同一位址只能宣告一次，已在 alphacurve.io 宣告）。
- **舊版（鏡像官網）設定**在 git 歷史裡（2026-08-19 版的 `nginx/efacani.com.conf`：root 共用 `/var/www/alphacurve.io/html` + `backend_alphacurve_api` API 轉發），要退回時從那裡拿。前端 `src/utils/site-config.js` 的 efacani.com 動態設定仍保留，退回即恢復生效。
