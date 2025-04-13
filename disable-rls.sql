-- The simplest solution: Disable RLS on the contacts table
-- This will allow all operations without restrictions
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT
    tablename,
    rowsecurity
FROM
    pg_tables
WHERE
    tablename = 'contacts';
