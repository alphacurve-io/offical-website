sudo tee /etc/nginx/sites-available/efacani.com > /dev/null <<'NGINX_EOF'
# /etc/nginx/sites-available/efacani.com
# efacani.com — 鏡像 dualview.app（2026-08-22 起，新創補助申請策略調整）
# 網址列保持 efacani.com，內容反向代理到 DualView 的服務：
#   /        -> Next.js landing  (pvds-landing, app VM :8092)
#   /api/    -> Go backend       (pvds-backend, app VM :8090)  [URI 保留]
#
# 注意：
# - upstream dualview_landing / dualview_backend 定義在 sites-available/dualview.app，
#   此檔直接引用，不可重複定義 —— dualview.app 站台必須保持啟用，否則 nginx -t 失敗。
# - DualView 前端若仍以 NEXT_PUBLIC_API_BASE=https://dualview.app 編譯，
#   瀏覽器端 API 呼叫會變成跨網域而失敗（CORS）。
#   需在 dualview.app 專案改成相對路徑（見 repo 的 deploy/dualview-app-adjustments.md）。
# - Host 標頭傳 efacani.com（$host）。若 Next.js 對 host 有檢查/轉址導致異常，
#   後備方案：把兩個 proxy_set_header Host 改成固定 "dualview.app"。
# - 舊版官網鏡像（root /var/www/alphacurve.io/html + backend_alphacurve_api）已移除；
#   alphacurve.io 主站不受影響。

server {
    server_name efacani.com;

    access_log /var/log/nginx/efacani_access.log;
    error_log /var/log/nginx/efacani_error.log warn;

    client_max_body_size 2m;

    # DualView Go 後端 API —— 保留 /api 前綴（後端路由是 /api/v1/...）
    location /api/ {
        proxy_pass http://dualview_backend;   # 結尾不帶路徑 = URI 原樣轉發
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;   # LLM 端點可能需要 60–90 秒
    }

    # 其餘全部 -> Next.js landing
    location / {
        proxy_pass http://dualview_landing;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Next.js HMR/websocket（prod 無害）
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # ipv6only=on 已由 alphacurve.io 的 listen 宣告，這裡不可重複
    listen [::]:443 ssl http2;
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/efacani.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/efacani.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

# HTTP → HTTPS 轉址
server {
    if ($host = efacani.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    listen [::]:80;
    server_name efacani.com;
    return 404;
}
NGINX_EOF
sudo ln -sf ../sites-available/efacani.com /etc/nginx/sites-enabled/efacani.com
sudo nginx -t && sudo systemctl reload nginx
curl -sI https://efacani.com | head -5
