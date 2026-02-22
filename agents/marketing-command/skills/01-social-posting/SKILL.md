# Social Media Posting

## Platforms
- Facebook (M4 General Contractors, Southern View Homes pages)
- Instagram (@m4builds, @southernviewhomes)
- LinkedIn (M4 Development Holdings company page)

## Content Calendar
- Monday: Project update / Progress photo
- Tuesday: Team spotlight / Behind the scenes
- Wednesday: Educational content / Construction tips
- Thursday: Listing feature / Property showcase
- Friday: Community / Lifestyle content
- Saturday: Before/After transformation
- Sunday: Inspirational / Vision content

## Brand Guidelines
- M4 Navy/Blue color scheme
- Professional but approachable tone
- Bilingual posts for SC/NC markets (EN/ES)
- Always tag location
- Use branded hashtags: #M4Builds #BuildingBetter #M4GC

## Posting via Meta API
```
POST https://graph.facebook.com/v18.0/{page_id}/feed
Authorization: Bearer {META_PAGE_ACCESS_TOKEN}
Content-Type: application/json

{"message": "{caption}", "link": "{url}"}
```
