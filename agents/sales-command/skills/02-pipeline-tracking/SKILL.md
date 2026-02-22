# Pipeline Tracking

## Pipeline Stages
1. **New Lead** - Just entered the system
2. **Contacted** - First outreach completed
3. **Qualified** - Budget, timeline, scope confirmed
4. **Proposal Sent** - Estimate delivered to client
5. **Negotiation** - Price/scope discussions active
6. **Contract Sent** - Agreement sent for signature
7. **Closed Won** - Signed and deposited
8. **Closed Lost** - Deal did not close (track reason)

## Deal Tracking
For each deal, track in HubSpot and memory:
- Client name and contact info
- Entity (M4GC/Overland/NexGen/SVH/M4 Aggregates)
- Project type and location
- Estimated value
- Current stage and days in stage
- Next action and due date
- Assigned team member

## Forecasting
Weekly forecast calculation:
- Weight by stage: Qualified (25%), Proposal (50%), Negotiation (75%), Contract (90%)
- Sum weighted values for 30/60/90-day forecast
- Compare to monthly/quarterly targets

## Stale Deal Alerts
- Qualified > 14 days without proposal: Alert
- Proposal > 7 days without response: Follow up
- Negotiation > 21 days: Escalate to Miguel
