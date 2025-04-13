-- Check the structure of the contacts table
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
