#!/usr/bin/env bash
set -euo pipefail

# Determine project root (this script assumed to be in /api)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Optional: load env vars from api/.env if exists
if [ -f "${ROOT_DIR}/api/.env" ]; then
  echo "Loading environment variables from api/.env"
  # Simple loader (no spaces in values)
  set -a
  # shellcheck disable=SC2046
  source "${ROOT_DIR}/api/.env"
  set +a
fi

cd "${ROOT_DIR}/api/web_api"

# Default environment values (can be overridden before running this script)
export RUST_LOG="${RUST_LOG:-info}"
export ALLOWED_DOMAINS="${ALLOWED_DOMAINS:-alphacurve.io,www.alphacurve.io,localhost}"
export OLLAMA_BASE_URL="${OLLAMA_BASE_URL:-http://localhost:11434}"
export OLLAMA_MODEL="${OLLAMA_MODEL:-gpt-oss:120b}"

echo "========================================"
echo "Starting web_api (Actix) on 0.0.0.0:8080"
echo "ROOT_DIR        = ${ROOT_DIR}"
echo "RUST_LOG        = ${RUST_LOG}"
echo "ALLOWED_DOMAINS = ${ALLOWED_DOMAINS}"
echo "OLLAMA_BASE_URL = ${OLLAMA_BASE_URL}"
echo "OLLAMA_MODEL    = ${OLLAMA_MODEL}"
echo "========================================"
echo

# Run in debug mode; change to --release if you prefer
cargo run