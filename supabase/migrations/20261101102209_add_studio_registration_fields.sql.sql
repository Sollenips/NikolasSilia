/*
# Add Studio Registration Fields

## Overview
Expands the stores table with detailed studio information that studio owners
provide during registration: cost rates, two photos, floor level, disability
access, first-class discount, and a structured weekly schedule.

## Changes to `stores`
1. `photo_url_1` (text) — first studio photo (interior/exterior)
2. `photo_url_2` (text) — second studio photo
3. `floor` (text) — floor level (e.g. "Ground floor", "2nd floor")
4. `disability_access` (boolean, default false) — whether the studio is
   wheelchair-accessible / has facilities for people with disabilities
5. `rate_info` (text) — human-readable cost rates (e.g. "€20/session, €80/month")
6. `first_class_discount_pct` (int, default 0) — percentage discount for the
   first class (e.g. 10 = 10% off the first session)
7. `weekly_schedule` (text) — structured weekly schedule of classes
   (e.g. "Mon 18:00, Wed 18:00, Sat 10:00")

## Security
- No new tables. Existing RLS on stores stays unchanged.
- Existing grants (anon+authenticated SELECT, authenticated INSERT/UPDATE)
  already cover the new columns since they are table-level grants.
- No policy changes needed.
*/

-- Add new columns to stores (idempotent)
ALTER TABLE stores
  ADD COLUMN IF NOT EXISTS photo_url_1 text,
  ADD COLUMN IF NOT EXISTS photo_url_2 text,
  ADD COLUMN IF NOT EXISTS floor text,
  ADD COLUMN IF NOT EXISTS disability_access boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rate_info text,
  ADD COLUMN IF NOT EXISTS first_class_discount_pct int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS weekly_schedule text;

-- Backfill existing rows so they have sensible defaults
UPDATE stores
  SET weekly_schedule = COALESCE(weekly_schedule, '')
  WHERE weekly_schedule IS NULL;
