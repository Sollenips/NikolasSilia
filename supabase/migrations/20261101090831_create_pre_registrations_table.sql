/*
# Create pre_registrations table

## Overview
Adds a pre-registration / expression-of-interest feature. Visitors (both
regular users and store owners) can leave their email to be notified when
the platform launches fully.

## New Tables
### pre_registrations
- id (uuid PK)
- email (text, unique, not null) — visitor's email
- role (text, not null, default 'user') — 'user' or 'store'
- name (text, nullable) — optional name
- created_at (timestamptz)

## Security
- RLS enabled on pre_registrations.
- Public INSERT (anon + authenticated): anyone can submit their email.
- No public SELECT: protects submitted emails from being scraped.
- service_role granted for admin dashboard use.
*/

CREATE TABLE IF NOT EXISTS pre_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pre_registrations ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON pre_registrations TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON pre_registrations TO service_role;

DROP POLICY IF EXISTS "public_insert_pre_registrations" ON pre_registrations;
CREATE POLICY "public_insert_pre_registrations"
  ON pre_registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
