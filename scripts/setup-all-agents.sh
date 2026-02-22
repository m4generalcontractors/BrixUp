#!/bin/bash
# =============================================================================
# M4 OPS Commander × ZeroClaw — Agent Setup Script
# =============================================================================
# Usage: ./scripts/setup-all-agents.sh
# This script sets up all 11 ZeroClaw agents for deployment.

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

AGENTS_DIR="${AGENTS_DIR:-/opt/m4-agents}"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "========================================"
echo "  M4 OPS Commander × ZeroClaw Setup"
echo "  Agents: ${#AGENTS[@]}"
echo "  Source: ${REPO_DIR}/agents"
echo "  Target: ${AGENTS_DIR}"
echo "========================================"
echo ""

# Create base directory
mkdir -p "${AGENTS_DIR}"

for ENTRY in "${AGENTS[@]}"; do
  SLUG="${ENTRY%%:*}"
  PORT="${ENTRY##*:}"

  echo "[${SLUG}] Setting up on port ${PORT}..."

  # Create workspace directories
  mkdir -p "${AGENTS_DIR}/${SLUG}/.zeroclaw"
  mkdir -p "${AGENTS_DIR}/${SLUG}/workspace"
  mkdir -p "${AGENTS_DIR}/${SLUG}/skills"

  # Copy agent configuration from repo
  if [ -d "${REPO_DIR}/agents/${SLUG}" ]; then
    cp -r "${REPO_DIR}/agents/${SLUG}/"* "${AGENTS_DIR}/${SLUG}/" 2>/dev/null || true
    cp -r "${REPO_DIR}/agents/${SLUG}/.zeroclaw" "${AGENTS_DIR}/${SLUG}/" 2>/dev/null || true
  fi

  # Copy shared tools
  mkdir -p "${AGENTS_DIR}/shared-tools"
  cp -r "${REPO_DIR}/agents/shared-tools/"* "${AGENTS_DIR}/shared-tools/" 2>/dev/null || true
  chmod +x "${AGENTS_DIR}/shared-tools/"*.sh 2>/dev/null || true

  echo "  [OK] ${SLUG} ready"
done

echo ""
echo "========================================"
echo "  Setup complete!"
echo "  ${#AGENTS[@]} agents configured"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Copy .env.example to .env and fill in credentials"
echo "  2. Run: cd ${REPO_DIR}/agents && docker compose -f docker-compose.zeroclaw.yml up -d"
echo "  3. Verify: docker compose -f docker-compose.zeroclaw.yml ps"
echo ""
echo "Port assignments:"
for ENTRY in "${AGENTS[@]}"; do
  SLUG="${ENTRY%%:*}"
  PORT="${ENTRY##*:}"
  printf "  %-25s → :%s\n" "${SLUG}" "${PORT}"
done
