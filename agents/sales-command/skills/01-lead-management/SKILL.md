# Lead Management

## Lead Routing by Entity
- Residential construction/renovation → M4 General Contractors (M4GC)
- Sitework, grading, excavation → Overland Grading & Sitework
- Investment opportunity → NexGen Capital Partners
- New home purchase → Southern View Homes
- Aggregate/materials → M4 Aggregates

## Lead Scoring (1-10)
- Has budget defined: +2
- Has timeline: +2
- Property address provided: +1
- Referred by existing client: +2
- Commercial project: +1
- Multi-unit/development: +2

## Follow-up Protocol
- Score 7+: Respond within 1 HOUR (SMS + WhatsApp + Email)
- Score 4-6: Respond within 4 hours (Email + SMS)
- Score 1-3: Respond within 24 hours (Email only)

## SMS via Twilio
```
POST https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json
Authorization: Basic {base64(SID:AUTH_TOKEN)}
Content-Type: application/x-www-form-urlencoded

To={PHONE}&From={M4_NUMBER}&Body={MESSAGE}
```

## WhatsApp Template Messages
For first contact (outside 24h window), use approved templates:
- m4_lead_followup (EN): "Hello {{name}}! This is M4 Development Holdings..."
- m4_lead_followup_es (ES): "¡Hola {{name}}! Somos M4 Development Holdings..."

## CRM Update (HubSpot)
```
POST https://api.hubapi.com/crm/v3/objects/contacts
Authorization: Bearer {HUBSPOT_TOKEN}
Content-Type: application/json

{"properties": {"firstname": "", "lastname": "", "email": "", "phone": "", "company": "", "lead_status": "NEW"}}
```

## Language Detection
If the lead's message is in Spanish, respond in Spanish. Always use professional, warm tone. Address by name when known.
