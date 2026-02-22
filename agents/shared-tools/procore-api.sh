#!/bin/bash
# Procore API operations
# Usage: ./procore-api.sh list_projects
# Usage: ./procore-api.sh get_project <project_id>
# Usage: ./procore-api.sh list_daily_logs <project_id> "2024-01-15"
# Usage: ./procore-api.sh create_daily_log <project_id> '{"log_date":"2024-01-15",...}'

set -euo pipefail

ACTION="${1:?Usage: procore-api.sh <action> [args...]}"
shift

PROCORE_BASE="https://api.procore.com/rest/v1.0"
COMPANY_ID="${PROCORE_COMPANY_ID}"

case "$ACTION" in
  list_projects)
    curl -s "${PROCORE_BASE}/projects?company_id=${COMPANY_ID}" \
      -H "Authorization: Bearer ${PROCORE_ACCESS_TOKEN}"
    ;;
  get_project)
    PROJECT_ID="$1"
    curl -s "${PROCORE_BASE}/projects/${PROJECT_ID}" \
      -H "Authorization: Bearer ${PROCORE_ACCESS_TOKEN}"
    ;;
  list_daily_logs)
    PROJECT_ID="$1"
    DATE="${2:-$(date +%Y-%m-%d)}"
    curl -s "${PROCORE_BASE}/projects/${PROJECT_ID}/daily_logs?log_date=${DATE}" \
      -H "Authorization: Bearer ${PROCORE_ACCESS_TOKEN}"
    ;;
  create_daily_log)
    PROJECT_ID="$1"
    curl -s -X POST "${PROCORE_BASE}/projects/${PROJECT_ID}/daily_logs" \
      -H "Authorization: Bearer ${PROCORE_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "$2"
    ;;
  list_schedule)
    PROJECT_ID="$1"
    curl -s "${PROCORE_BASE}/projects/${PROJECT_ID}/schedule/tasks" \
      -H "Authorization: Bearer ${PROCORE_ACCESS_TOKEN}"
    ;;
  list_budget)
    PROJECT_ID="$1"
    curl -s "${PROCORE_BASE}/projects/${PROJECT_ID}/budget/views" \
      -H "Authorization: Bearer ${PROCORE_ACCESS_TOKEN}"
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Available: list_projects, get_project, list_daily_logs, create_daily_log, list_schedule, list_budget"
    exit 1
    ;;
esac
