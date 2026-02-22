#!/bin/bash
# Post formatted message to Slack channel
# Usage: ./m4-notify-slack.sh "#channel" "message text" ["username"]

set -euo pipefail

CHANNEL="${1:?Usage: m4-notify-slack.sh <channel> <message> [username]}"
MESSAGE="${2:?Usage: m4-notify-slack.sh <channel> <message> [username]}"
USERNAME="${3:-M4 OPS}"

curl -s -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"channel\": \"${CHANNEL}\",
    \"text\": \"${MESSAGE}\",
    \"username\": \"${USERNAME}\",
    \"icon_emoji\": \":construction:\"
  }"
