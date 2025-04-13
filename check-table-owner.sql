-- Check the owner of the contacts table
SELECT
    tablename,
    tableowner
FROM
    pg_tables
WHERE
    tablename = 'contacts';

-- Grant all privileges on the contacts table to the authenticated role
GRANT ALL PRIVILEGES ON TABLE contacts TO authenticated;

-- Grant all privileges on the contacts table to the anon role (public)
GRANT ALL PRIVILEGES ON TABLE contacts TO anon;
