/*
# Create studio image storage bucket

Plain-English summary: studio owners can now upload photos from their computer instead of pasting web links. Photos are stored in a public bucket, so they display on the site, and each upload is limited to 5 MB and to JPEG, PNG or WebP images.

## New storage bucket
- studio-images: public bucket for studio cover and gallery photos.
- File size limit: 5 MB per file.
- Allowed types: image/jpeg, image/png, image/webp.

## Security changes
- Anyone (anonymous visitors and signed-in users) can upload a new file to studio-images only.
- No one can update, overwrite or delete files through the public API, so uploaded photos cannot be tampered with after upload.
- Reading is public because the bucket is public, which is required to show photos on the site.

## Notes
1. Statements are idempotent (ON CONFLICT and DROP POLICY IF EXISTS), so the migration is safe to re-run.
2. No existing data is changed.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'studio-images',
  'studio-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "public_upload_studio_images" ON storage.objects;
CREATE POLICY "public_upload_studio_images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'studio-images');
