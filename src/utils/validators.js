/**
 * Allowed department values for the interest form.
 * @type {string[]}
 */
const ALLOWED_DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Design',
  'Product',
];

/**
 * Validates a candidate's full name.
 * @param {string} name - The full name to validate.
 * @returns {string} An error message string, or empty string if valid.
 */
export function validateName(name) {
  if (name === undefined || name === null || String(name).trim() === '') {
    return 'Full name is required';
  }
  const trimmed = String(name).trim();
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(trimmed)) {
    return 'Full name must contain only letters and spaces';
  }
  return '';
}

/**
 * Validates a candidate's email address.
 * @param {string} email - The email to validate.
 * @returns {string} An error message string, or empty string if valid.
 */
export function validateEmail(email) {
  if (email === undefined || email === null || String(email).trim() === '') {
    return 'Email is required';
  }
  const trimmed = String(email).trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address';
  }
  return '';
}

/**
 * Validates a candidate's mobile number.
 * @param {string} mobile - The mobile number to validate.
 * @returns {string} An error message string, or empty string if valid.
 */
export function validateMobile(mobile) {
  if (mobile === undefined || mobile === null || String(mobile).trim() === '') {
    return 'Mobile number is required';
  }
  const trimmed = String(mobile).trim();
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(trimmed)) {
    return 'Mobile number must be exactly 10 digits';
  }
  return '';
}

/**
 * Validates a candidate's department selection.
 * @param {string} department - The department to validate.
 * @returns {string} An error message string, or empty string if valid.
 */
export function validateDepartment(department) {
  if (department === undefined || department === null || String(department).trim() === '') {
    return 'Department is required';
  }
  const trimmed = String(department).trim();
  if (!ALLOWED_DEPARTMENTS.includes(trimmed)) {
    return 'Please select a valid department';
  }
  return '';
}

export { ALLOWED_DEPARTMENTS };