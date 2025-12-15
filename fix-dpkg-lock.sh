#!/bin/bash

# 修復 dpkg 鎖問題的腳本
# 在伺服器端執行此腳本來清理 dpkg 鎖和停止相關進程

set -e

echo "🔍 檢查 dpkg 相關進程..."

# 檢查並列出所有 dpkg/apt 相關進程
echo "正在運行的 dpkg/apt 進程："
ps aux | grep -E "(dpkg|apt|apt-get)" | grep -v grep || echo "  沒有找到相關進程"

# 檢查鎖文件狀態
echo ""
echo "🔒 檢查鎖文件狀態："
if [ -f /var/lib/dpkg/lock-frontend ]; then
    echo "  /var/lib/dpkg/lock-frontend 存在"
    lsof /var/lib/dpkg/lock-frontend 2>/dev/null || echo "    沒有進程使用此鎖"
fi

if [ -f /var/lib/dpkg/lock ]; then
    echo "  /var/lib/dpkg/lock 存在"
    lsof /var/lib/dpkg/lock 2>/dev/null || echo "    沒有進程使用此鎖"
fi

if [ -f /var/cache/apt/archives/lock ]; then
    echo "  /var/cache/apt/archives/lock 存在"
    lsof /var/cache/apt/archives/lock 2>/dev/null || echo "    沒有進程使用此鎖"
fi

echo ""
read -p "是否要停止所有 dpkg/apt 相關進程？(y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🛑 停止 dpkg/apt 相關進程..."
    
    # 停止 apt/dpkg 進程（使用 kill -TERM 先嘗試優雅停止）
    sudo pkill -TERM -f "dpkg|apt-get|apt" || echo "  沒有找到需要停止的進程"
    
    # 等待進程結束
    sleep 3
    
    # 如果還有進程在運行，使用 kill -KILL 強制停止
    if pgrep -f "dpkg|apt-get|apt" > /dev/null; then
        echo "⚠️  仍有進程在運行，強制停止..."
        sudo pkill -KILL -f "dpkg|apt-get|apt" || true
        sleep 2
    fi
    
    echo "✅ 進程已停止"
else
    echo "❌ 已取消"
    exit 0
fi

echo ""
read -p "是否要清理鎖文件？(y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 清理鎖文件..."
    
    # 再次確認沒有進程在使用鎖
    if fuser /var/lib/dpkg/lock-frontend /var/lib/dpkg/lock /var/cache/apt/archives/lock >/dev/null 2>&1; then
        echo "⚠️  警告：仍有進程在使用鎖文件，建議先停止進程"
        read -p "是否仍要強制清理？(y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ 已取消清理"
            exit 0
        fi
    fi
    
    # 備份並移除鎖文件
    sudo rm -f /var/lib/dpkg/lock-frontend
    sudo rm -f /var/lib/dpkg/lock
    sudo rm -f /var/cache/apt/archives/lock
    
    echo "✅ 鎖文件已清理"
else
    echo "❌ 已取消清理鎖文件"
fi

echo ""
echo "🔧 修復 dpkg 狀態..."
sudo dpkg --configure -a || echo "⚠️  dpkg --configure 遇到問題（可能正常）"

echo ""
echo "🧹 清理並修復依賴..."
sudo apt-get install -f -y || echo "⚠️  apt-get install -f 遇到問題（可能正常）"

echo ""
echo "✅ 完成！現在可以重新執行部署流程了"

