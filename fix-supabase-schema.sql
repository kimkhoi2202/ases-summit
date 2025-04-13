-- Create the contacts table if it doesn't exist
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT,
    is_approved BOOLEAN DEFAULT false,
    photo_url TEXT,
    bio TEXT,
    location TEXT,
    instagram TEXT,
    facebook TEXT,
    linkedin TEXT,
    youtube TEXT,
    twitter TEXT,
    email TEXT,
    website TEXT
);

-- Add any missing columns to the contacts table
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Check and add location column
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'location'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE contacts ADD COLUMN location TEXT;
        RAISE NOTICE 'Added location column';
    END IF;

    -- Check and add bio column
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'bio'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE contacts ADD COLUMN bio TEXT;
        RAISE NOTICE 'Added bio column';
    END IF;

    -- Check and add photo_url column
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'photo_url'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE contacts ADD COLUMN photo_url TEXT;
        RAISE NOTICE 'Added photo_url column';
    END IF;

    -- Check and add is_approved column
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'is_approved'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE contacts ADD COLUMN is_approved BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_approved column';
    END IF;

    -- Check and add social media columns
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'instagram'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE contacts ADD COLUMN instagram TEXT;
        RAISE NOTICE 'Added instagram column';
    END IF;

    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'facebook'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE contacts ADD COLUMN facebook TEXT;
        RAISE NOTICE 'Added facebook column';
    END IF;

    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'linkedin'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE contacts ADD COLUMN linkedin TEXT;
        RAISE NOTICE 'Added linkedin column';
    END IF;

    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'youtube'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE contacts ADD COLUMN youtube TEXT;
        RAISE NOTICE 'Added youtube column';
    END IF;

    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'twitter'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE contacts ADD COLUMN twitter TEXT;
        RAISE NOTICE 'Added twitter column';
    END IF;

    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'email'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE contacts ADD COLUMN email TEXT;
        RAISE NOTICE 'Added email column';
    END IF;

    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'website'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE contacts ADD COLUMN website TEXT;
        RAISE NOTICE 'Added website column';
    END IF;
END $$;

-- Set up RLS (Row Level Security) policies for the contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert into contacts
DROP POLICY IF EXISTS "Allow anyone to insert contacts" ON contacts;
CREATE POLICY "Allow anyone to insert contacts" 
ON contacts FOR INSERT 
TO public 
WITH CHECK (true);

-- Create policy to allow anyone to select from contacts
DROP POLICY IF EXISTS "Allow anyone to view approved contacts" ON contacts;
CREATE POLICY "Allow anyone to view approved contacts" 
ON contacts FOR SELECT 
TO public 
USING (is_approved = true);

-- Create policy to allow authenticated users to view all contacts
DROP POLICY IF EXISTS "Allow authenticated users to view all contacts" ON contacts;
CREATE POLICY "Allow authenticated users to view all contacts" 
ON contacts FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow authenticated users to update contacts
DROP POLICY IF EXISTS "Allow authenticated users to update contacts" ON contacts;
CREATE POLICY "Allow authenticated users to update contacts" 
ON contacts FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create policy to allow authenticated users to delete contacts
DROP POLICY IF EXISTS "Allow authenticated users to delete contacts" ON contacts;
CREATE POLICY "Allow authenticated users to delete contacts" 
ON contacts FOR DELETE 
TO authenticated 
USING (true);

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
