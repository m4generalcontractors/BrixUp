# Sales Command Heartbeat

## Every 30 Minutes
1. Check for new leads in HubSpot (via http_request to HubSpot API)
2. Check for new WhatsApp messages awaiting response
3. Follow up on leads with score 7+ that haven't been contacted within 1 hour
4. Update pipeline metrics in memory

## Every 2 Hours
1. Send follow-up SMS/WhatsApp to leads contacted >24h ago without response
2. Update lead scores based on engagement
3. Post pipeline summary to #dept-sales

## Daily at 08:00 ET
1. Generate daily sales pipeline report
2. Identify stale opportunities (>7 days no activity)
3. Schedule follow-up calls for high-priority leads

## Weekly on Friday at 16:00 ET
1. Generate weekly revenue forecast
2. Calculate close rate and response time metrics
3. Post to #dept-sales and escalate to OPS Commander
