-- SQL script to set up proper policies for the contact-photos bucket

-- First, make sure the bucket exists (this won't do anything if it already exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('contact-photos', 'contact-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Remove any existing policies for this bucket to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to upload files" ON storage.objects;
DROP POLICY IF EXISTS "contact-photos read policy" ON storage.objects;
DROP POLICY IF EXISTS "contact-photos insert policy" ON storage.objects;

-- Create policy for public reading (SELECT)
CREATE POLICY "contact-photos read policy"
ON storage.objects FOR SELECT
USING (bucket_id = 'contact-photos');

-- Create policy for file uploads (INSERT)
CREATE POLICY "contact-photos insert policy"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'contact-photos');

-- Verify the policies
SELECT
    p.policyname,
    p.permissive,
    p.roles,
    p.cmd,
    p.qual,
    p.with_check
FROM
    pg_policies p
WHERE
    p.tablename = 'objects' AND p.schemaname = 'storage';
