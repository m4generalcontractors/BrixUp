#!/bin/bash
# QuickBooks Online operations
# Usage: ./quickbooks-sync.sh query_transactions "2024-01-01" "2024-12-31"
# Usage: ./quickbooks-sync.sh create_invoice '{"customer_id":"123","line_items":[...]}'
# Usage: ./quickbooks-sync.sh get_pnl "2024-01-01" "2024-12-31"

set -euo pipefail

ACTION="${1:?Usage: quickbooks-sync.sh <action> [args...]}"
shift

QBO_BASE="https://quickbooks.api.intuit.com/v3/company/${QUICKBOOKS_COMPANY_ID}"

case "$ACTION" in
  query_transactions)
    START_DATE="$1"
    END_DATE="$2"
    curl -s "${QBO_BASE}/query?query=SELECT%20*%20FROM%20Purchase%20WHERE%20TxnDate%20>=%20'${START_DATE}'%20AND%20TxnDate%20<=%20'${END_DATE}'%20ORDERBY%20TxnDate%20DESC%20MAXRESULTS%2050" \
      -H "Authorization: Bearer ${QUICKBOOKS_ACCESS_TOKEN}" \
      -H "Accept: application/json"
    ;;
  create_invoice)
    curl -s -X POST "${QBO_BASE}/invoice" \
      -H "Authorization: Bearer ${QUICKBOOKS_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d "$1"
    ;;
  get_pnl)
    START_DATE="$1"
    END_DATE="$2"
    curl -s "${QBO_BASE}/reports/ProfitAndLoss?start_date=${START_DATE}&end_date=${END_DATE}" \
      -H "Authorization: Bearer ${QUICKBOOKS_ACCESS_TOKEN}" \
      -H "Accept: application/json"
    ;;
  get_balance_sheet)
    DATE="${1:-$(date +%Y-%m-%d)}"
    curl -s "${QBO_BASE}/reports/BalanceSheet?date=${DATE}" \
      -H "Authorization: Bearer ${QUICKBOOKS_ACCESS_TOKEN}" \
      -H "Accept: application/json"
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Available: query_transactions, create_invoice, get_pnl, get_balance_sheet"
    exit 1
    ;;
esac
