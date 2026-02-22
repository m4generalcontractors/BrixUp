#!/bin/bash
# HubSpot CRM operations
# Usage: ./hubspot.sh create_contact '{"firstname":"John","email":"john@example.com"}'
# Usage: ./hubspot.sh search_contacts "john@example.com"
# Usage: ./hubspot.sh update_deal <dealId> '{"dealstage":"closedwon"}'
# Usage: ./hubspot.sh get_pipeline

set -euo pipefail

ACTION="${1:?Usage: hubspot.sh <action> [args...]}"
shift

case "$ACTION" in
  create_contact)
    curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts" \
      -H "Authorization: Bearer ${HUBSPOT_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{\"properties\": $1}"
    ;;
  search_contacts)
    curl -s -X POST "https://api.hubapi.com/crm/v3/objects/contacts/search" \
      -H "Authorization: Bearer ${HUBSPOT_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{\"filterGroups\":[{\"filters\":[{\"propertyName\":\"email\",\"operator\":\"EQ\",\"value\":\"$1\"}]}]}"
    ;;
  update_deal)
    DEAL_ID="$1"
    curl -s -X PATCH "https://api.hubapi.com/crm/v3/objects/deals/${DEAL_ID}" \
      -H "Authorization: Bearer ${HUBSPOT_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{\"properties\": $2}"
    ;;
  get_pipeline)
    curl -s "https://api.hubapi.com/crm/v3/pipelines/deals" \
      -H "Authorization: Bearer ${HUBSPOT_ACCESS_TOKEN}"
    ;;
  create_deal)
    curl -s -X POST "https://api.hubapi.com/crm/v3/objects/deals" \
      -H "Authorization: Bearer ${HUBSPOT_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{\"properties\": $1}"
    ;;
  list_contacts)
    LIMIT="${1:-10}"
    curl -s "https://api.hubapi.com/crm/v3/objects/contacts?limit=${LIMIT}" \
      -H "Authorization: Bearer ${HUBSPOT_ACCESS_TOKEN}"
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Available: create_contact, search_contacts, update_deal, get_pipeline, create_deal, list_contacts"
    exit 1
    ;;
esac
