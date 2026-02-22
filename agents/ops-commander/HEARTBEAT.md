# OPS Commander Heartbeat

## Every 30 Minutes
1. Query all department agent gateway health endpoints
2. Check for pending escalations in PostgreSQL
3. Process any unrouted tasks
4. Log heartbeat summary to #ops-heartbeat on Slack

## Every 2 Hours
1. Generate pipeline snapshot
2. Check agent memory for unresolved issues
3. Verify all agents responded to last heartbeat

## Daily at 07:00 ET
1. Generate full operations brief
2. Post to #ops-commander on Slack
3. Send summary email to miguel@m4builds.com

## Daily at 18:00 ET
1. End-of-day task reconciliation
2. Identify tasks that missed SLA
3. Flag overdue follow-ups to Sales Command

## Weekly on Monday at 08:00 ET
1. Generate weekly executive summary
2. Calculate KPIs across all departments
3. Flag licensing/insurance expirations within 30 days
4. Post to #ops-commander and email Miguel
