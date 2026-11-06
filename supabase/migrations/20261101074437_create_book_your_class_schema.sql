/*
# Book Your Class — Core Schema

## Overview
Creates the foundation for a class-booking platform in Athens where users
(parents or individuals) can browse classes offered by local stores/studios
and book a spot without visiting in person.

## New Tables

### stores
Local businesses/studios that offer classes (e.g. a karate dojo, a music school).
- id (uuid PK)
- name (text) — store/studio name
- description (text) — what the place offers
- category (text) — primary category tag (e.g. "martial arts", "music")
- area (text) — Athens area (Kallithea, Marousi, Glyfada)
- address (text) — street address
- phone (text) — contact phone
- email (text) — contact email
- image_url (text) — header/cover photo URL
- created_at (timestamptz)

### classes
Individual class offerings tied to a store.
- id (uuid PK)
- store_id (uuid FK → stores, cascade delete)
- title (text) — class name
- description (text) — what the class covers
- category (text) — category tag
- instructor (text) — who teaches it
- age_min (int) — minimum age
- age_max (int) — maximum age (null = no upper limit)
- price_eur (numeric) — price per session in euros
- duration_minutes (int) — length of a session
- capacity (int) — max attendees per session
- weekly_schedule (text) — human-readable schedule (e.g. "Mon & Wed 18:00")
- image_url (text) — class photo URL
- created_at (timestamptz)

### bookings
A booking made by a user for a class. No auth — anyone can book.
Personal data is NOT publicly readable.
- id (uuid PK)
- class_id (uuid FK → classes, cascade delete)
- participant_name (text) — who attends
- participant_age (int) — age of attendee
- guardian_name (text, nullable) — required if under 18
- booker_name (text) — who made the booking
- booker_email (text) — contact email
- booker_phone (text) — contact phone
- preferred_date (date) — requested start date
- notes (text, nullable) — optional message
- status (text, default 'pending') — pending | confirmed | cancelled
- created_at (timestamptz)

## Security
- RLS enabled on all tables.
- stores & classes: public read (anon + authenticated), no public writes.
- bookings: public INSERT (anyone can book), no public SELECT (protects personal data).
- service_role granted on bookings for potential admin/edge-function use.
- No auth flow requested, so no authenticated-only ownership policies.
*/

-- ── stores ──
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  area text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON stores TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_stores" ON stores;
CREATE POLICY "public_read_stores"
  ON stores FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── classes ──
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  instructor text NOT NULL,
  age_min int NOT NULL DEFAULT 4,
  age_max int,
  price_eur numeric(8,2) NOT NULL DEFAULT 0,
  duration_minutes int NOT NULL DEFAULT 60,
  capacity int NOT NULL DEFAULT 10,
  weekly_schedule text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON classes TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_classes" ON classes;
CREATE POLICY "public_read_classes"
  ON classes FOR SELECT
  TO anon, authenticated
  USING (true);

-- index for area/category filtering via the joined store
CREATE INDEX IF NOT EXISTS idx_classes_store_id ON classes(store_id);
CREATE INDEX IF NOT EXISTS idx_classes_category ON classes(category);

-- ── bookings ──
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  participant_name text NOT NULL,
  participant_age int NOT NULL,
  guardian_name text,
  booker_name text NOT NULL,
  booker_email text NOT NULL,
  booker_phone text NOT NULL,
  preferred_date date NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (create bookings), but cannot SELECT (privacy).
GRANT INSERT ON bookings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bookings TO service_role;

DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
CREATE POLICY "public_insert_bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_bookings_class_id ON bookings(class_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
