-- Check if the is_rejected column exists
SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'is_rejected'
) AS is_rejected_column_exists;

-- Add the is_rejected column if it doesn't exist
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS is_rejected BOOLEAN DEFAULT false;

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'contacts' AND column_name = 'is_rejected';
