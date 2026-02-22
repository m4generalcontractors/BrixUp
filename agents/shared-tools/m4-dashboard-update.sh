#!/bin/bash
# Push update to Next.js dashboard via API
# Usage: ./m4-dashboard-update.sh "agent_slug" '{"status":"online","metrics":{...}}'

set -euo pipefail

AGENT_SLUG="${1:?Usage: m4-dashboard-update.sh <agent_slug> <json_payload>}"
PAYLOAD="${2:?Usage: m4-dashboard-update.sh <agent_slug> <json_payload>}"

DASHBOARD_URL="${DASHBOARD_URL:-https://app.m4builds.com}"

curl -s -X POST "${DASHBOARD_URL}/api/agents/${AGENT_SLUG}/status" \
  -H "Authorization: Bearer ${DASHBOARD_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "${PAYLOAD}"
