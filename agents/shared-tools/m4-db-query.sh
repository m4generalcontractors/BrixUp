#!/bin/bash
# Query M4 business data from PostgreSQL
# Usage: ./m4-db-query.sh <table> [where_clause] [limit]

set -euo pipefail

TABLE="${1:?Usage: m4-db-query.sh <table> [where_clause] [limit]}"
WHERE="${2:-1=1}"
LIMIT="${3:-20}"

psql "${DATABASE_URL}" -t -A -F '|' -c "
  SELECT * FROM \"${TABLE}\"
  WHERE ${WHERE}
  ORDER BY \"createdAt\" DESC
  LIMIT ${LIMIT};
" | jq -R -s 'split("\n") | map(select(length > 0)) | map(split("|"))'
