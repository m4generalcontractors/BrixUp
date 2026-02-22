# Pricing Database

## Regional Price Tracking
Maintain current pricing for NC, SC, FL, and AL markets:
- Lumber (per BF, per LF for common dimensions)
- Concrete (per CY, pump costs)
- Roofing (per SQ by material type)
- Electrical (per SF for residential/commercial)
- Plumbing (per fixture, per LF rough-in)
- HVAC (per ton, per SF)
- Labor rates by trade and region

## Price Sources
- Supplier quotes (stored in memory)
- Historical project costs (from PM Command)
- Industry indices (RS Means regional factors)

## Price Updates
- Update material prices monthly from supplier quotes
- Flag prices that change >10% from last recorded
- Apply regional cost factors for each state
