// ============================================
// Validation Utilities
// ============================================

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Nigerian phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check for Nigerian phone format
  // 080xxxxxxxx or +234xxxxxxxxxx
  const phoneRegex = /^(\+?234|0)[7-9][0-1]\d{8}$/;
  return phoneRegex.test(cleaned);
};

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate minimum length
 */
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

/**
 * Validate maximum length
 */
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

/**
 * Validate positive number
 */
export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

/**
 * Validate non-negative number
 */
export const isNonNegativeNumber = (value: number): boolean => {
  return !isNaN(value) && value >= 0;
};

/**
 * Validate date is not in the future
 */
export const isNotFutureDate = (date: Date): boolean => {
  return new Date(date) <= new Date();
};

/**
 * Form validation helper
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    if (rule.required && !isRequired(value)) {
      return rule.message;
    }
    
    if (rule.minLength && typeof value === 'string' && !minLength(value, rule.minLength)) {
      return rule.message;
    }
    
    if (rule.maxLength && typeof value === 'string' && !maxLength(value, rule.maxLength)) {
      return rule.message;
    }
    
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message;
    }
    
    if (rule.custom && !rule.custom(value)) {
      return rule.message;
    }
  }
  
  return null;
};