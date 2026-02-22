#!/bin/bash
# Send WhatsApp message via Twilio
# Usage: ./twilio-whatsapp.sh "+1234567890" "Hello from M4"
# Usage: ./twilio-whatsapp.sh "+1234567890" "" "m4_lead_followup" '{"1":"John"}'

set -euo pipefail

TO="${1:?Usage: twilio-whatsapp.sh <to_number> <message> [template_name] [template_vars]}"
MESSAGE="${2:-}"
TEMPLATE="${3:-}"
VARS="${4:-}"

if [ -n "$TEMPLATE" ]; then
  # Send template message
  curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json" \
    -u "${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}" \
    --data-urlencode "To=whatsapp:${TO}" \
    --data-urlencode "From=whatsapp:${TWILIO_WHATSAPP_NUMBER}" \
    --data-urlencode "ContentSid=${TEMPLATE}" \
    --data-urlencode "ContentVariables=${VARS}"
else
  # Send freeform message (within 24h window)
  curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json" \
    -u "${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}" \
    --data-urlencode "To=whatsapp:${TO}" \
    --data-urlencode "From=whatsapp:${TWILIO_WHATSAPP_NUMBER}" \
    --data-urlencode "Body=${MESSAGE}"
fi
