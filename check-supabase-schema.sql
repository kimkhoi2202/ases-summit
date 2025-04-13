-- Check all tables in the public schema
SELECT 
    table_name 
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name;

-- Check the structure of the contacts table (if it exists)
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

-- Check if there are any rows in the contacts table
SELECT 
    COUNT(*) as total_contacts,
    COUNT(*) FILTER (WHERE is_approved = true) as approved_contacts,
    COUNT(*) FILTER (WHERE is_approved = false) as unapproved_contacts,
    COUNT(*) FILTER (WHERE is_approved IS NULL) as null_approval_contacts
FROM 
    contacts;

-- Check the first few rows of the contacts table to see the data structure
SELECT 
    id, 
    name, 
    category, 
    is_approved, 
    created_at,
    -- Check if these columns exist before selecting them
    CASE WHEN EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'location'
    ) 
    THEN (SELECT location FROM contacts c WHERE c.id = contacts.id)
    ELSE 'column_not_found' END as location_check,
    
    CASE WHEN EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'contacts' AND column_name = 'bio'
    ) 
    THEN (SELECT bio FROM contacts c WHERE c.id = contacts.id)
    ELSE 'column_not_found' END as bio_check
FROM 
    contacts
ORDER BY 
    created_at DESC
LIMIT 5;
