#!/bin/bash
# Send email via Resend
# Usage: ./resend-email.sh "to@example.com" "Subject" "Body text" ["from@m4builds.com"]

set -euo pipefail

TO="${1:?Usage: resend-email.sh <to> <subject> <body> [from]}"
SUBJECT="${2:?Usage: resend-email.sh <to> <subject> <body> [from]}"
BODY="${3:?Usage: resend-email.sh <to> <subject> <body> [from]}"
FROM="${4:-ops@m4builds.com}"

curl -s -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer ${RESEND_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"from\": \"M4 Development Holdings <${FROM}>\",
    \"to\": [\"${TO}\"],
    \"subject\": \"${SUBJECT}\",
    \"text\": \"${BODY}\"
  }"
