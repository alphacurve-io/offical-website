#!/bin/bash
set -euo pipefail

# 部署目標:nginx VM (專案 ai-saas-419818, asia-east1-c, 34.81.6.91)
# 網站根目錄:/var/www/alphacurve.io/html
PROJECT="ai-saas-419818"
ZONE="asia-east1-c"
VM="nginx"
WEB_ROOT="/var/www/alphacurve.io/html"

GSSH=(gcloud compute ssh "$VM" --project="$PROJECT" --zone="$ZONE" --command)

# 不產生 source map:否則整包原始碼會隨 build 上傳並公開可下載
# (.github/workflows/deploy.yml 走 CI 部署時同樣設了這個變數)
GENERATE_SOURCEMAP=false npm run build

rm -f build.zip
zip -rq build.zip build

# 上傳並解壓
"${GSSH[@]}" "rm -rf ~/build ~/build.zip"
gcloud compute scp build.zip "$VM":~/ --project="$PROJECT" --zone="$ZONE"
"${GSSH[@]}" "unzip -q build.zip && rm build.zip"

# 換上新版網站內容（build 內可能夾帶 .DS_Store 等隱藏雜物，mv * 不會搬走，最後整個目錄刪掉）
"${GSSH[@]}" "sudo rm -rf $WEB_ROOT/* && sudo mv ~/build/* $WEB_ROOT/ && rm -rf ~/build"

echo "Deployed to https://alphacurve.io"
