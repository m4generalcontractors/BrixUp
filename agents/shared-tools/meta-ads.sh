#!/bin/bash
# Meta Marketing API operations
# Usage: ./meta-ads.sh list_campaigns
# Usage: ./meta-ads.sh campaign_insights <campaign_id> "2024-01-01" "2024-01-31"
# Usage: ./meta-ads.sh pause_campaign <campaign_id>
# Usage: ./meta-ads.sh account_insights "2024-01-01" "2024-01-31"

set -euo pipefail

ACTION="${1:?Usage: meta-ads.sh <action> [args...]}"
shift

META_BASE="https://graph.facebook.com/v18.0"

case "$ACTION" in
  list_campaigns)
    curl -s "${META_BASE}/${META_AD_ACCOUNT_ID}/campaigns?fields=id,name,status,daily_budget,objective&access_token=${META_PAGE_ACCESS_TOKEN}"
    ;;
  campaign_insights)
    CAMPAIGN_ID="$1"
    START_DATE="$2"
    END_DATE="$3"
    curl -s "${META_BASE}/${CAMPAIGN_ID}/insights?fields=impressions,clicks,spend,actions,cost_per_action_type&time_range={\"since\":\"${START_DATE}\",\"until\":\"${END_DATE}\"}&access_token=${META_PAGE_ACCESS_TOKEN}"
    ;;
  pause_campaign)
    CAMPAIGN_ID="$1"
    curl -s -X POST "${META_BASE}/${CAMPAIGN_ID}" \
      -d "status=PAUSED" \
      -d "access_token=${META_PAGE_ACCESS_TOKEN}"
    ;;
  activate_campaign)
    CAMPAIGN_ID="$1"
    curl -s -X POST "${META_BASE}/${CAMPAIGN_ID}" \
      -d "status=ACTIVE" \
      -d "access_token=${META_PAGE_ACCESS_TOKEN}"
    ;;
  account_insights)
    START_DATE="$1"
    END_DATE="$2"
    curl -s "${META_BASE}/${META_AD_ACCOUNT_ID}/insights?fields=impressions,clicks,spend,actions,cost_per_action_type&time_range={\"since\":\"${START_DATE}\",\"until\":\"${END_DATE}\"}&access_token=${META_PAGE_ACCESS_TOKEN}"
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Available: list_campaigns, campaign_insights, pause_campaign, activate_campaign, account_insights"
    exit 1
    ;;
esac
