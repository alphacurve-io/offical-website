#!/usr/bin/env bash
set -euo pipefail

# Base URL of your Actix server
BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "=== 1) Test /api/chat ==="
CHAT_RESPONSE=$(
  curl -s -X POST "${BASE_URL}/api/chat" \
    -H "Content-Type: application/json" \
    -d '{
      "question": "產品能不能算便宜點？"
    }'
)

echo "Raw /api/chat response:"
echo "$CHAT_RESPONSE"
CHAT_ANSWER=$(echo "$CHAT_RESPONSE" | jq -r '.answer')
echo
echo "Parsed chat answer: $CHAT_ANSWER"
echo

echo "=== 2) Test /api/emotion ==="
USER_REQUEST="你怎麼這麼死腦筋"

EMOTION_PAYLOAD=$(jq -n \
  --arg ur "$USER_REQUEST" \
  --arg ca "$CHAT_ANSWER" \
  '{user_request: $ur, chat_answer: $ca}'
)

EMOTION_RESPONSE=$(
  curl -s -X POST "${BASE_URL}/api/emotion" \
    -H "Content-Type: application/json" \
    -d "$EMOTION_PAYLOAD"
)

echo "Raw /api/emotion response:"
echo "$EMOTION_RESPONSE"
EMOTION_LABEL=$(echo "$EMOTION_RESPONSE" | jq -r '.emotion')
EMOTION_CONFIDENCE=$(echo "$EMOTION_RESPONSE" | jq -r '.confidence')
echo
echo "Parsed emotion: $EMOTION_LABEL (confidence: $EMOTION_CONFIDENCE)"
echo

echo "=== 3) Test /api/emotion_reply ==="
EMOTION_REPLY_PAYLOAD=$(jq -n \
  --arg persona "customer_assistant" \
  --arg ur "$USER_REQUEST" \
  --arg pa "$CHAT_ANSWER" \
  --arg el "$EMOTION_LABEL" \
  --argjson ec "$EMOTION_CONFIDENCE" \
  --arg lh "zh-TW" \
  '{
    persona: $persona,
    user_request: $ur,
    previous_answer: $pa,
    emotion_label: $el,
    emotion_confidence: $ec,
    language_hint: $lh
  }'
)

EMOTION_REPLY_RESPONSE=$(
  curl -s -X POST "${BASE_URL}/api/emotion_reply" \
    -H "Content-Type: application/json" \
    -d "$EMOTION_REPLY_PAYLOAD"
)

echo "Raw /api/emotion_reply response:"
echo "$EMOTION_REPLY_RESPONSE"
echo
echo "Final softened reply:"
echo "$EMOTION_REPLY_RESPONSE" | jq -r '.answer'
echo

# example output:
# ./test_emotion_flow.sh
# === 1) Test /api/chat ===
# Raw /api/chat response:
# {"answer":"我們會依需求提供最具性價比的方案，細節可再討論。"}

# Parsed chat answer: 我們會依需求提供最具性價比的方案，細節可再討論。

# === 2) Test /api/emotion ===
# Raw /api/emotion response:
# {"emotion":"frustrated","confidence":0.94,"explanation":"User is irritated, calling the assistant '死腦筋', indicating annoyance and frustration with the response."}

# Parsed emotion: frustrated (confidence: 0.94)

# === 3) Test /api/emotion_reply ===
# Raw /api/emotion_reply response:
# {"answer":"抱歉，前面的回覆讓您覺得有點死腦筋，真的不是故意的！我們很願意再一起討論，找到最適合您需求的方案，讓您感覺更舒服。請問還有什麼細節想了解或調整的嗎？祝您今天好心情 😊","persona":"customer_assistant","style":"softened_followup"}

# Final softened reply:
# 抱歉，前面的回覆讓您覺得有點死腦筋，真的不是故意的！我們很願意再一起討論，找到最適合您需求的方案，讓您感覺更舒服。請問還有什麼細節想了解或調整的嗎？祝您今天好心情 😊