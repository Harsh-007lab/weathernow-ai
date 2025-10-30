/**
 * Security utility functions for input sanitization
 */

/**
 * Sanitize city names to prevent XSS and injection attacks
 * Allows only letters (including unicode), spaces, hyphens, commas, and apostrophes
 */
export const sanitizeCityName = (city: string): string => {
  if (!city || typeof city !== 'string') {
    return '';
  }
  
  // Remove any HTML tags
  const withoutTags = city.replace(/<[^>]*>/g, '');
  
  // Allow only safe characters: letters (including unicode), spaces, hyphens, commas, apostrophes
  const sanitized = withoutTags.replace(/[^\p{L}\s\-,']/gu, '');
  
  // Trim and limit length
  return sanitized.trim().slice(0, 100);
};

/**
 * Sanitize general text input
 */
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

/**
 * Validate and sanitize numeric input
 */
export const sanitizeNumber = (value: any, min?: number, max?: number): number | null => {
  const num = Number(value);
  
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  
  if (min !== undefined && num < min) {
    return min;
  }
  
  if (max !== undefined && num > max) {
    return max;
  }
  
  return num;
};
