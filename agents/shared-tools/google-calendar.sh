#!/bin/bash
# Google Calendar operations
# Usage: ./google-calendar.sh list_events "2024-01-01T00:00:00Z" "2024-01-31T23:59:59Z"
# Usage: ./google-calendar.sh create_event "Meeting Title" "2024-01-15T10:00:00" "2024-01-15T11:00:00" "Description"
# Usage: ./google-calendar.sh check_availability "2024-01-15T10:00:00Z" "2024-01-15T11:00:00Z"

set -euo pipefail

ACTION="${1:?Usage: google-calendar.sh <action> [args...]}"
shift

CALENDAR_ID="${GOOGLE_CALENDAR_ID:-primary}"

case "$ACTION" in
  list_events)
    TIME_MIN="$1"
    TIME_MAX="$2"
    curl -s "https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?timeMin=${TIME_MIN}&timeMax=${TIME_MAX}&singleEvents=true&orderBy=startTime" \
      -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}"
    ;;
  create_event)
    SUMMARY="$1"
    START="$2"
    END="$3"
    DESC="${4:-}"
    curl -s -X POST "https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events" \
      -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{
        \"summary\": \"${SUMMARY}\",
        \"description\": \"${DESC}\",
        \"start\": {\"dateTime\": \"${START}\", \"timeZone\": \"America/New_York\"},
        \"end\": {\"dateTime\": \"${END}\", \"timeZone\": \"America/New_York\"},
        \"reminders\": {\"useDefault\": false, \"overrides\": [{\"method\": \"popup\", \"minutes\": 60}, {\"method\": \"popup\", \"minutes\": 1440}]}
      }"
    ;;
  check_availability)
    TIME_MIN="$1"
    TIME_MAX="$2"
    curl -s -X POST "https://www.googleapis.com/calendar/v3/freeBusy" \
      -H "Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{
        \"timeMin\": \"${TIME_MIN}\",
        \"timeMax\": \"${TIME_MAX}\",
        \"items\": [{\"id\": \"${CALENDAR_ID}\"}]
      }"
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Available: list_events, create_event, check_availability"
    exit 1
    ;;
esac
