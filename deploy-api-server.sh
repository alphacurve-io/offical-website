#!/bin/bash

# 設定 GITHUB_TOKEN
source .env

# 使用 GITHUB_TOKEN clone offical-website
git clone https://Jamesshieh0510:${GITHUB_TOKEN}@github.com/alphacurve-io/offical-website.git

# build environment
# No LSB modules are available.
# Distributor ID: Debian
# Description:    Debian GNU/Linux 12 (bookworm)
# Release:        12
# Codename:       bookworm

# 安裝必要的系統套件
sudo apt-get update
sudo apt-get install -y build-essential pkg-config

# install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustc --version
cargo --version
rustup update

# 為 Linux 編譯  
cd ~/offical-website/api/web_api
cargo build --release

# 背景執行
cargo run --release &

# 關閉背景執行
kill $!
