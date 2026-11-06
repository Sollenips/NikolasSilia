/*
# Studio listing fields on pre_registrations

1. Modified Table
- `pre_registrations` gets three new nullable columns used by the studio listing form:
  - `phone` (text): studio owner's telephone number
  - `area` (text): Athens area the studio is in
  - `studio_info` (text): short description of the studio

2. Security
- No change to RLS, policies or grants. The existing public insert policy still applies.

3. Notes
- Existing rows are kept as they are; the new columns stay empty for them.
- Nothing is dropped or renamed.
*/

ALTER TABLE public.pre_registrations ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.pre_registrations ADD COLUMN IF NOT EXISTS area text;
ALTER TABLE public.pre_registrations ADD COLUMN IF NOT EXISTS studio_info text;
