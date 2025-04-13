-- Check all contacts in the database
SELECT id, name, category, is_approved, created_at 
FROM contacts 
ORDER BY created_at DESC;

-- Check specifically for unapproved contacts
SELECT id, name, category, is_approved, created_at 
FROM contacts 
WHERE is_approved = false
ORDER BY created_at DESC;
