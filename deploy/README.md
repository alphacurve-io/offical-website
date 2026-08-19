# Deploy 設定

官網主機：`nginx` VM（GCP 專案 `ai-saas-419818`，zone `asia-east1-c`，IP `34.81.6.91`）

```bash
gcloud compute ssh nginx --project=ai-saas-419818 --zone=asia-east1-c
```

## 檔案說明

| 檔案 | 說明 |
|---|---|
| `nginx/efacani.com.conf` | efacani.com 的完整 nginx 設定（官網第二網域） |
| `nginx/alphacurve.io.conf` | 主站設定快照（2026-08-19 從主機備份，upstream 都定義在這裡） |
| `nginx/apply-efacani.sh` | 一鍵套用腳本：SSH 進主機後整段貼上即可 |

## 套用 efacani.com 設定

SSH 進 nginx 主機後，把 `nginx/apply-efacani.sh` 的內容**整段複製貼上**。它會：

1. 用 `sudo tee` 覆寫 `/etc/nginx/sites-available/efacani.com`
2. 確保 `sites-enabled/efacani.com` 是指向 sites-available 的 symlink
3. `nginx -t` 檢查語法，通過才 reload
4. `curl` 驗證 https://efacani.com 回應

## 設計重點

- **root 共用 `/var/www/alphacurve.io/html`**：跑一次 `publish-website.sh`，alphacurve.io 和 efacani.com 同步更新。若之後 efacani.com 要放不同內容，把 root 改回 `/var/www/efacani.com/html` 並自行部署該目錄。
- **API 轉發**（聯絡表單 `/website/api/submit`、`/api/chat` 等）沿用主站的 upstream `backend_alphacurve_api`。upstream 只能定義一次（在 `alphacurve.io` 檔裡），efacani.com 只引用、不重複定義——因此 **alphacurve.io 站台必須保持啟用**，否則 efacani.com 會因找不到 upstream 而 nginx -t 失敗。
- **快取策略**與主站相同：靜態資源 1 年 immutable、HTML 1 小時、JSON/manifest 1 天。
- **憑證**：`/etc/letsencrypt/live/efacani.com/`（certbot 自動續約，2026-11-17 到期）。目前只簽了 `efacani.com`，若要支援 `www.efacani.com`，先設 DNS 再跑 `sudo certbot --nginx -d efacani.com -d www.efacani.com --expand`。
- **與主站設定的差異**：不含 junelai、diamond-island、callback 等其他服務的轉發（那些跟官網無關）；`listen [::]:443` 不加 `ipv6only=on`（同一位址只能宣告一次，已在 alphacurve.io 宣告）。
- SEO 注意：build 出來的 HTML 內 canonical / hreflang 指向 alphacurve.io，efacani.com 的頁面會被搜尋引擎視為 alphacurve.io 的別名，不會分散權重（對補助申請的「網域可連上」需求沒有影響）。
