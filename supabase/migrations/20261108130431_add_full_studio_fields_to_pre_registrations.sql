/*
# Add full studio details to studio listing requests

Plain-English summary: the "List your school" form now collects the same details as the admin "Add studio" form. This migration adds the matching columns to the listing-request table so those details can be stored.

## New columns on pre_registrations
- description (text): what the studio offers
- category (text): main class category
- address (text): street address
- image_url (text): cover image link
- photo_url_1 (text): first gallery photo link
- photo_url_2 (text): second gallery photo link
- floor (text): floor or level of the building
- disability_access (boolean, default false): wheelchair or disability access
- rate_info (text): pricing information
- first_class_discount_pct (integer, default 0): discount on a first class
- weekly_schedule (text): weekly timetable notes

## Modified tables
- pre_registrations: new nullable columns only. Existing rows and columns are unchanged.

## Security
- No changes to row level security or grants. The existing public insert rule still applies.

## Notes
1. All statements use IF NOT EXISTS so the migration is safe to re-run.
2. No data is removed or converted.
*/

ALTER TABLE pre_registrations ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE pre_registrations ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE pre_registrations ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE pre_registrations ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE pre_registrations ADD COLUMN IF NOT EXISTS photo_url_1 text;
ALTER TABLE pre_registrations ADD COLUMN IF NOT EXISTS photo_url_2 text;
ALTER TABLE pre_registrations ADD COLUMN IF NOT EXISTS floor text;
ALTER TABLE pre_registrations ADD COLUMN IF NOT EXISTS disability_access boolean DEFAULT false;
ALTER TABLE pre_registrations ADD COLUMN IF NOT EXISTS rate_info text;
ALTER TABLE pre_registrations ADD COLUMN IF NOT EXISTS first_class_discount_pct integer DEFAULT 0;
ALTER TABLE pre_registrations ADD COLUMN IF NOT EXISTS weekly_schedule text;
