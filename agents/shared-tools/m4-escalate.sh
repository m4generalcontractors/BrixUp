#!/bin/bash
# Escalate issue to OPS Commander via gateway webhook
# Usage: ./m4-escalate.sh "reason" "suggested_action" priority

set -euo pipefail

REASON="${1:?Usage: m4-escalate.sh <reason> [suggested_action] [priority]}"
SUGGESTION="${2:-Review needed}"
PRIORITY="${3:-2}"

curl -s -X POST "http://ops-commander:3001/webhook" \
  -H "Authorization: Bearer ${OPS_COMMANDER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"[ESCALATION P${PRIORITY}] ${REASON}. Suggested: ${SUGGESTION}\"}"
