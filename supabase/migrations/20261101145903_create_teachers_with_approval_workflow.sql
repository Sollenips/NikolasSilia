/*
# Teacher profiles with admin approval workflow

## Overview
Studio owners can create profiles for their teachers: photo, experience, academic
status, and the age range they teach. Each profile moves through a review workflow.
Only admins can publish profiles, and admins can only approve or publish them (they
cannot change the teacher's details).

## New table: teachers
- id (uuid, primary key)
- store_id (uuid, the studio the teacher belongs to)
- name (text, required)
- photo_url (text, optional image link)
- academic_status (text, e.g. degree or certification)
- experience_years (int, years of teaching experience)
- experience (text, short background description)
- age_min / age_max (int, age range the teacher works with; age_max optional)
- status (text): 'draft' (being written), 'pending' (waiting for admin approval),
  'published' (visible to the public)
- created_at, updated_at

## Workflow rules (enforced in the database)
1. Owners create profiles as draft or pending. Owners cannot set published.
2. Editing a published profile as an owner moves it back to pending until re-approved.
3. Admins cannot change any teacher detail; they can only change the status.

## Security
- RLS enabled. Public (anon + authenticated) can read only published profiles.
- Owners can read, create, edit, and delete teachers of their own studio.
- Admins can read all profiles and change their status.
- Trigger functions enforce the workflow rules above regardless of the client.

## Important notes
- Indexes on store_id and status for fast studio and public listings.
*/

CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  photo_url text,
  academic_status text,
  experience_years int NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  experience text,
  age_min int NOT NULL DEFAULT 4 CHECK (age_min >= 0),
  age_max int CHECK (age_max IS NULL OR age_max >= age_min),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teachers_store_id ON teachers(store_id);
CREATE INDEX IF NOT EXISTS idx_teachers_status ON teachers(status);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON teachers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON teachers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON teachers TO service_role;

CREATE OR REPLACE FUNCTION guard_teacher_write()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NOT is_admin() AND NEW.status = 'published' THEN
      RAISE EXCEPTION 'Only admins can publish teacher profiles';
    END IF;
    RETURN NEW;
  END IF;

  IF is_admin() THEN
    IF (NEW.store_id, NEW.name, NEW.photo_url, NEW.academic_status, NEW.experience_years,
        NEW.experience, NEW.age_min, NEW.age_max)
       IS DISTINCT FROM
       (OLD.store_id, OLD.name, OLD.photo_url, OLD.academic_status, OLD.experience_years,
        OLD.experience, OLD.age_min, OLD.age_max) THEN
      RAISE EXCEPTION 'Admins can only approve or publish teacher profiles';
    END IF;
  ELSE
    IF NEW.status = 'published' AND OLD.status <> 'published' THEN
      RAISE EXCEPTION 'Only admins can publish teacher profiles';
    END IF;
    IF OLD.status = 'published' THEN
      NEW.status := 'pending';
    END IF;
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_teacher_write ON teachers;
CREATE TRIGGER guard_teacher_write
  BEFORE INSERT OR UPDATE ON teachers
  FOR EACH ROW
  EXECUTE FUNCTION guard_teacher_write();

DROP POLICY IF EXISTS "public_select_published_teachers" ON teachers;
CREATE POLICY "public_select_published_teachers" ON teachers FOR SELECT
  TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "owner_select_teachers" ON teachers;
CREATE POLICY "owner_select_teachers" ON teachers FOR SELECT
  TO authenticated USING (is_store_owner(store_id) OR is_admin());

DROP POLICY IF EXISTS "owner_insert_teachers" ON teachers;
CREATE POLICY "owner_insert_teachers" ON teachers FOR INSERT
  TO authenticated WITH CHECK (is_store_owner(store_id));

DROP POLICY IF EXISTS "owner_update_teachers" ON teachers;
CREATE POLICY "owner_update_teachers" ON teachers FOR UPDATE
  TO authenticated
  USING (is_store_owner(store_id) OR is_admin())
  WITH CHECK (is_store_owner(store_id) OR is_admin());

DROP POLICY IF EXISTS "owner_delete_teachers" ON teachers;
CREATE POLICY "owner_delete_teachers" ON teachers FOR DELETE
  TO authenticated USING (is_store_owner(store_id) OR is_admin());
