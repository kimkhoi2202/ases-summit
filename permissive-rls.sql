-- Enable RLS on the contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'contacts'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON contacts';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Create a single permissive policy that allows all operations for everyone
CREATE POLICY "Allow all operations for everyone"
ON contacts
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Verify the policy was created
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
    tablename = 'contacts';
