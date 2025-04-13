-- Add notes column to contacts table if it doesn't exist
DO $$
BEGIN
    -- Check if notes column exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'notes'
    ) THEN
        -- Add notes column
        ALTER TABLE contacts ADD COLUMN notes TEXT;
        RAISE NOTICE 'Added notes column to contacts table';
    ELSE
        RAISE NOTICE 'Notes column already exists in contacts table';
    END IF;
END $$;

-- Check the updated structure of the contacts table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_name = 'contacts'
ORDER BY 
    ordinal_position;
