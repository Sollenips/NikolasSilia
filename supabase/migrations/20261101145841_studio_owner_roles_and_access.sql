/*
# Studio owner roles and access control

## Overview
Separates admins from studio owners. Until now every signed-in user had full admin
rights. This migration introduces explicit roles so studio owners can edit only their
own studio, while admins keep full control.

## New tables
1. `app_admins` - user ids with full admin rights. Seeded with the existing admin account.
2. `store_owners` - links an auth user to the studio they own (one studio per owner row).
3. `studio_owner_invites` - emails the admin has pre-approved for sign-up, with the studio
   they will own. Used by the signup trigger and removed once the account is created.

## Modified objects
- `is_admin()` and `is_store_owner(store uuid)` helper functions (SECURITY DEFINER).
- Signup trigger on auth.users now allows sign-up only for invited emails and links the
  new account to its studio. All other sign-ups remain blocked.
- Policies on `stores`, `classes`, and `bookings` now require admin rights instead of any
  signed-in user. Owners may update only their own studio row.

## Security
- RLS enabled on all new tables. Only admins can read or manage invites and admin rows.
- Owners can read their own `store_owners` row only.
- Public read of stores and classes is unchanged.

## Important notes
1. The existing admin account (nikoskarado@gmail.com) is added to `app_admins` if it exists.
2. Owners cannot insert or delete studios, nor change classes or bookings.
*/

CREATE TABLE IF NOT EXISTS app_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS store_owners (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, store_id)
);
CREATE INDEX IF NOT EXISTS idx_store_owners_store_id ON store_owners(store_id);

CREATE TABLE IF NOT EXISTS studio_owner_invites (
  email text PRIMARY KEY,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE app_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_owner_invites ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON app_admins TO authenticated;
GRANT SELECT ON store_owners TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON studio_owner_invites TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON app_admins TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON store_owners TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON studio_owner_invites TO service_role;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM app_admins WHERE user_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION is_store_owner(target_store uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM store_owners
    WHERE user_id = auth.uid() AND store_id = target_store
  );
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION is_store_owner(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION is_store_owner(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "admins_select_own" ON app_admins;
CREATE POLICY "admins_select_own" ON app_admins FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "owners_select_own" ON store_owners;
CREATE POLICY "owners_select_own" ON store_owners FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_select_invites" ON studio_owner_invites;
CREATE POLICY "admin_select_invites" ON studio_owner_invites FOR SELECT
  TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_insert_invites" ON studio_owner_invites;
CREATE POLICY "admin_insert_invites" ON studio_owner_invites FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_invites" ON studio_owner_invites;
CREATE POLICY "admin_update_invites" ON studio_owner_invites FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_invites" ON studio_owner_invites;
CREATE POLICY "admin_delete_invites" ON studio_owner_invites FOR DELETE
  TO authenticated USING (is_admin());

INSERT INTO app_admins (user_id)
SELECT id FROM auth.users WHERE email = 'nikoskarado@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

CREATE OR REPLACE FUNCTION reject_new_user_signups()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM studio_owner_invites WHERE lower(email) = lower(NEW.email)) THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Sign-ups are by invitation only.'
    USING ERRCODE = 'permission_denied';
END;
$$;

CREATE OR REPLACE FUNCTION link_studio_owner_invite()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite studio_owner_invites%ROWTYPE;
BEGIN
  SELECT * INTO invite FROM studio_owner_invites WHERE lower(email) = lower(NEW.email);
  IF FOUND THEN
    INSERT INTO store_owners (user_id, store_id) VALUES (NEW.id, invite.store_id)
      ON CONFLICT DO NOTHING;
    DELETE FROM studio_owner_invites WHERE email = invite.email;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS link_studio_owner_invite ON auth.users;
CREATE TRIGGER link_studio_owner_invite
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION link_studio_owner_invite();

DROP POLICY IF EXISTS "auth_insert_stores" ON stores;
DROP POLICY IF EXISTS "auth_update_stores" ON stores;
DROP POLICY IF EXISTS "admin_insert_stores" ON stores;
CREATE POLICY "admin_insert_stores" ON stores FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_stores" ON stores;
CREATE POLICY "admin_update_stores" ON stores FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "owner_update_own_store" ON stores;
CREATE POLICY "owner_update_own_store" ON stores FOR UPDATE
  TO authenticated USING (is_store_owner(id)) WITH CHECK (is_store_owner(id));

DROP POLICY IF EXISTS "admin_delete_stores" ON stores;
CREATE POLICY "admin_delete_stores" ON stores FOR DELETE
  TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "auth_insert_classes" ON classes;
DROP POLICY IF EXISTS "auth_update_classes" ON classes;
DROP POLICY IF EXISTS "auth_delete_classes" ON classes;
CREATE POLICY "admin_insert_classes" ON classes FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "admin_update_classes" ON classes FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "admin_delete_classes" ON classes FOR DELETE
  TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "auth_select_bookings" ON bookings;
CREATE POLICY "admin_select_bookings" ON bookings FOR SELECT
  TO authenticated USING (is_admin());
