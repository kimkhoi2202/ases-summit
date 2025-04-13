-- First, enable RLS on the contacts table if it's not already enabled
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anyone to insert contacts" ON contacts;
DROP POLICY IF EXISTS "Allow anyone to view approved contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated users to view all contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated users to update contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated users to delete contacts" ON contacts;

-- IMPORTANT: Create a policy to allow public (anonymous) users to insert into contacts
-- This is the key policy that's missing and causing the 401 error
CREATE POLICY "Allow public to insert contacts"
ON contacts FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow public users to view only approved contacts
CREATE POLICY "Allow public to view approved contacts"
ON contacts FOR SELECT
TO public
USING (is_approved = true);

-- Create policy to allow authenticated users to view all contacts
CREATE POLICY "Allow authenticated to view all contacts"
ON contacts FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow authenticated users to update contacts
CREATE POLICY "Allow authenticated to update contacts"
ON contacts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow authenticated users to delete contacts
CREATE POLICY "Allow authenticated to delete contacts"
ON contacts FOR DELETE
TO authenticated
USING (true);

-- Verify the policies were created
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    tablename = 'contacts'
ORDER BY
    policyname;
