# Operational Briefing

Generate comprehensive operational briefings for M4 Development Holdings.

## Daily Brief (07:00 ET)
### Structure
1. **Active Projects**: List all active projects by state (NC/SC/FL/AL)
2. **24h Activity**: Tasks completed across all departments
3. **Pending Tasks**: Priority-ordered queue across all departments
4. **Pipeline**: Revenue pipeline snapshot from Sales Command
5. **Financials**: Cash flow summary from Accounting Command
6. **Escalations**: Items requiring Miguel's attention
7. **Agent Health**: Status of all 11 agents

## Weekly Executive Summary (Monday 08:00 ET)
### Structure
1. **Week in Review**: Key accomplishments and milestones
2. **KPIs Dashboard**: Revenue, close rate, project completion, safety
3. **Department Reports**: Summary from each department
4. **Next Week Priorities**: Top 5 items per department
5. **Risk Register**: Updated risks and mitigation status
6. **Compliance**: License/insurance/permit status

## Data Sources
- Query each agent's memory for their latest status
- Query PostgreSQL for project/lead/financial data
- Aggregate metrics from all department heartbeat logs
