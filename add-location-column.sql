-- First, check the current schema of the contacts table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts';

-- Add the location column if it doesn't exist
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts' AND column_name = 'location';
