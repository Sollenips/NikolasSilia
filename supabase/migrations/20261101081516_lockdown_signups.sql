/*
# Lock Down Admin Sign-Ups — Single Admin Only

## Overview
Prevents any new user from registering via Supabase Auth. Only the pre-existing
admin account (nikoskarado@gmail.com) can sign in. All new sign-up attempts
are rejected at the database level by a trigger on auth.users.

## Changes
1. Creates a function `reject_new_user_signups()` that raises an exception
   on any INSERT into auth.users, effectively blocking all new registrations.
2. Creates a BEFORE INSERT trigger `block_new_signups` on auth.users that
   calls the function.

## Security
- This is a hard block at the database level — even if someone finds the
  signUp endpoint, the insert fails and no account is created.
- The existing admin user is unaffected (trigger only fires on INSERT).
- To add a new admin in the future, temporarily drop the trigger, create
  the account, then re-create the trigger.
*/

CREATE OR REPLACE FUNCTION reject_new_user_signups()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RAISE EXCEPTION 'Sign-ups are disabled. Only the pre-authorized admin can sign in.'
    USING ERRCODE = 'permission_denied';
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS block_new_signups ON auth.users;
CREATE TRIGGER block_new_signups
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION reject_new_user_signups();
