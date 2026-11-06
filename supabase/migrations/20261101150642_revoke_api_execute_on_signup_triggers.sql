/*
# Revoke direct API execution of signup trigger functions

1. Modified functions
- `reject_new_user_signups` and `link_studio_owner_invite` are trigger-only functions.

2. Security
- Revokes EXECUTE from PUBLIC, anon and authenticated so they can no longer be called through the public API.
- Triggers still run because Postgres checks EXECUTE only when the trigger is created.
*/

REVOKE EXECUTE ON FUNCTION public.reject_new_user_signups() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.link_studio_owner_invite() FROM PUBLIC, anon, authenticated;
