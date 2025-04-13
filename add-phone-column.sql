-- Check if the phone column exists
SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'phone'
) AS phone_column_exists;

-- Add the phone column if it doesn't exist
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts' AND column_name = 'phone';
