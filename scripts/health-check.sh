#!/bin/bash
# =============================================================================
# M4 ZeroClaw Agents — Health Check
# =============================================================================
# Usage: ./scripts/health-check.sh

set -euo pipefail

AGENTS=(
  "ops-commander:3001"
  "marketing-command:3002"
  "sales-command:3003"
  "estimating-command:3004"
  "precon-command:3005"
  "pm-command:3006"
  "accounting-command:3007"
  "document-command:3008"
  "permit-command:3009"
  "hr-command:3010"
  "investor-command:3011"
)

HOST="${AGENT_HOST:-127.0.0.1}"
ONLINE=0
OFFLINE=0

echo "========================================"
echo "  M4 ZeroClaw Agent Health Check"
echo "  $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "========================================"
echo ""

for ENTRY in "${AGENTS[@]}"; do
  SLUG="${ENTRY%%:*}"
  PORT="${ENTRY##*:}"

  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 2 "http://${HOST}:${PORT}/health" 2>/dev/null || echo "000")

  if [ "$STATUS" = "200" ]; then
    printf "  [ONLINE]  %-25s :%s\n" "${SLUG}" "${PORT}"
    ONLINE=$((ONLINE + 1))
  else
    printf "  [OFFLINE] %-25s :%s (HTTP %s)\n" "${SLUG}" "${PORT}" "${STATUS}"
    OFFLINE=$((OFFLINE + 1))
  fi
done

echo ""
echo "========================================"
echo "  Online: ${ONLINE} / ${#AGENTS[@]}"
echo "  Offline: ${OFFLINE} / ${#AGENTS[@]}"
echo "========================================"

if [ "$OFFLINE" -gt 0 ]; then
  exit 1
fi
