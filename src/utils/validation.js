// Email validation using standard regex
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true, message: '' };
};

// Password validation - Industry standard requirements
// - Minimum 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true, message: '' };
};

// Phone number validation - Basic format check
// Accepts formats like: (123) 456-7890, 123-456-7890, 1234567890, +1-234-567-8900
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, message: 'Phone number is required' };
  }
  // Remove all non-numeric characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Must have exactly 10 or 11 digits (11 for country code like +1)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return { valid: false, message: 'Phone number must be 10-11 digits' };
  }
  
  // At this point we know we have the right number of digits
  // Just check that the format looks reasonable (no invalid characters, proper structure)
  const phoneRegex = /^[\+]?[1]?[-.\s]?[(]?[0-9]{3}[)]?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: 'Please enter a valid phone number format' };
  }
  
  return { valid: true, message: '' };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, message: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }
  return { valid: true, message: '' };
};
