/**
 * Formats a phone number for display
 * Handles international numbers by preserving country code
 * 
 * @param phoneNumber The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters except + (for international numbers)
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Check if it's an international number (starts with +)
  if (cleaned.startsWith('+')) {
    // For international numbers, we'll keep the + and format the rest
    // Format: +[country code] [area code] [local number]
    // This is a simplified approach - full international formatting would require
    // knowledge of each country's specific format
    
    // If it's a US/Canada number (+1), format it specially
    if (cleaned.startsWith('+1') && cleaned.length === 12) {
      return `+1 (${cleaned.substring(2, 5)}) ${cleaned.substring(5, 8)}-${cleaned.substring(8)}`;
    }
    
    // For other international numbers, just add spaces for readability
    // after the country code (assuming 1-3 digits for country code)
    if (cleaned.length > 3) {
      // Try to identify country code (1-3 digits after +)
      const countryCodeMatch = cleaned.match(/^\+(\d{1,3})/);
      if (countryCodeMatch) {
        const countryCodeLength = countryCodeMatch[1].length;
        const countryCode = cleaned.substring(0, countryCodeLength + 1); // +[country code]
        const restOfNumber = cleaned.substring(countryCodeLength + 1);
        
        // Format the rest of the number in groups of 3-4 digits for readability
        let formattedRest = '';
        for (let i = 0; i < restOfNumber.length; i += 3) {
          formattedRest += ' ' + restOfNumber.substring(i, Math.min(i + 3, restOfNumber.length));
        }
        
        return countryCode + formattedRest;
      }
    }
    
    // Fallback for other international formats
    return cleaned;
  }
  
  // For US/Canada numbers without country code
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  
  // For numbers that don't match standard formats, return as is with spaces
  // for readability (groups of 3-4 digits)
  let formatted = '';
  for (let i = 0; i < cleaned.length; i += 3) {
    if (i > 0) formatted += ' ';
    formatted += cleaned.substring(i, Math.min(i + 3, cleaned.length));
  }
  
  return formatted;
};

/**
 * Validates a phone number
 * 
 * @param phoneNumber The phone number to validate
 * @returns True if the phone number is valid
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return true; // Empty is valid (optional field)
  
  // Remove all non-digit characters except + (for international numbers)
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Basic validation - must have at least 7 digits
  // and if it has a +, it must be at the beginning
  if (cleaned.length < 7) return false;
  
  // If it contains a +, it must be at the beginning
  if (cleaned.includes('+') && !cleaned.startsWith('+')) return false;
  
  // If it starts with +, it must have at least 7 digits after the +
  if (cleaned.startsWith('+') && cleaned.length < 8) return false;
  
  return true;
};
