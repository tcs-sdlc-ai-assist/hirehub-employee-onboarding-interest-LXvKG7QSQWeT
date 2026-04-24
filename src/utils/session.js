/**
 * SessionStorage utility for admin authentication.
 *
 * Admin auth state is stored in sessionStorage under the key 'hirehub_admin_auth'.
 * This ensures the auth state is cleared when the browser tab is closed.
 *
 * Hardcoded credentials are used for demo purposes only.
 *
 * @module session
 */

const SESSION_KEY = 'hirehub_admin_auth';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

/**
 * Checks whether the admin is currently authenticated.
 * Reads the sessionStorage key and returns true only if the value is exactly 'true'.
 *
 * @returns {boolean} True if the admin is authenticated, false otherwise.
 */
export function isAdminAuthenticated() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch (e) {
    console.error('Failed to read admin auth state from sessionStorage.', e);
    return false;
  }
}

/**
 * Validates the provided credentials against hardcoded admin credentials.
 * If valid, sets the sessionStorage key to mark the admin as authenticated.
 *
 * @param {string} username - The username to validate.
 * @param {string} password - The password to validate.
 * @returns {{ success: boolean, error?: string }}
 *   An object with success true if login succeeded, or success false with an error message.
 */
export function loginAdmin(username, password) {
  if (
    username === undefined ||
    username === null ||
    String(username).trim() === '' ||
    password === undefined ||
    password === null ||
    String(password).trim() === ''
  ) {
    return { success: false, error: 'Username and password are required' };
  }

  const trimmedUsername = String(username).trim();
  const trimmedPassword = String(password).trim();

  if (trimmedUsername !== ADMIN_USERNAME || trimmedPassword !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid credentials' };
  }

  try {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } catch (e) {
    console.error('Failed to set admin auth state in sessionStorage.', e);
    return { success: false, error: 'Failed to save authentication state' };
  }

  return { success: true };
}

/**
 * Logs out the admin by removing the sessionStorage key.
 *
 * @returns {void}
 */
export function logoutAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to remove admin auth state from sessionStorage.', e);
  }
}