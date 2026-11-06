/*
# Enable Admin Auth — Classes and Bookings Management

## Overview
Enables signed-in admin users to create, update, and delete classes and view
bookings. Also grants write access to stores for authenticated admins so they
can add new studios.

## Changes
1. **stores**: Grants INSERT, UPDATE to authenticated. Adds INSERT/UPDATE policies
   scoped to authenticated users (any signed-in admin can manage stores).
2. **classes**: Grants INSERT, UPDATE, DELETE to authenticated. Adds policies for
   authenticated users to create, update, and delete classes.
3. **bookings**: Grants SELECT to authenticated so admins can view incoming bookings.
   Adds SELECT policy for authenticated users.

## Security
- Public read on stores and classes stays unchanged (anon + authenticated SELECT).
- Bookings remain INSERT-only for anon (public booking), SELECT now also available
  to authenticated (admin can view), but NOT to anon (protects personal data).
- No DELETE on bookings for anon — only service_role retains that.
*/

-- ── stores: allow authenticated admins to create/edit ──
GRANT INSERT, UPDATE ON stores TO authenticated;

DROP POLICY IF EXISTS "auth_insert_stores" ON stores;
CREATE POLICY "auth_insert_stores"
  ON stores FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_stores" ON stores;
CREATE POLICY "auth_update_stores"
  ON stores FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- ── classes: allow authenticated admins to create/edit/delete ──
GRANT INSERT, UPDATE, DELETE ON classes TO authenticated;

DROP POLICY IF EXISTS "auth_insert_classes" ON classes;
CREATE POLICY "auth_insert_classes"
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_classes" ON classes;
CREATE POLICY "auth_update_classes"
  ON classes FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_classes" ON classes;
CREATE POLICY "auth_delete_classes"
  ON classes FOR DELETE
  TO authenticated
  USING (true);

-- ── bookings: allow authenticated admins to view ──
GRANT SELECT ON bookings TO authenticated;

DROP POLICY IF EXISTS "auth_select_bookings" ON bookings;
CREATE POLICY "auth_select_bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);