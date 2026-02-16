-- Migration: Fix BRIX → BRXU in transaction descriptions
-- Run this against your Supabase database to fix existing corrupted descriptions

UPDATE transactions
SET description = REPLACE(description, 'BRIX', 'BRXU')
WHERE description LIKE '%BRIX%' AND description NOT LIKE '%BRXU%';
