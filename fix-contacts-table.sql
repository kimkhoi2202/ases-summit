-- Check if the contacts table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'contacts'
) AS table_exists;

-- Check the current structure of the contacts table
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns 
WHERE 
    table_name = 'contacts'
ORDER BY 
    ordinal_position;

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Add location column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'location'
    ) THEN
        ALTER TABLE contacts ADD COLUMN location TEXT;
        RAISE NOTICE 'Added location column';
    END IF;

    -- Add is_approved column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'is_approved'
    ) THEN
        ALTER TABLE contacts ADD COLUMN is_approved BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_approved column';
    END IF;

    -- Add bio column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'bio'
    ) THEN
        ALTER TABLE contacts ADD COLUMN bio TEXT;
        RAISE NOTICE 'Added bio column';
    END IF;

    -- Add photo_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'photo_url'
    ) THEN
        ALTER TABLE contacts ADD COLUMN photo_url TEXT;
        RAISE NOTICE 'Added photo_url column';
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
