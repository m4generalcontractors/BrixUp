#!/bin/bash
# Send SMS via Twilio
# Usage: ./twilio-sms.sh "+1234567890" "Hello from M4 Development Holdings"

set -euo pipefail

TO="${1:?Usage: twilio-sms.sh <to_number> <message>}"
MESSAGE="${2:?Usage: twilio-sms.sh <to_number> <message>}"

curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json" \
  -u "${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}" \
  --data-urlencode "To=${TO}" \
  --data-urlencode "From=${TWILIO_PHONE_NUMBER}" \
  --data-urlencode "Body=${MESSAGE}"
