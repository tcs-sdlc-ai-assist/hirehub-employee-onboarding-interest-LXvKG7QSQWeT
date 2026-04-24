import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
} from './session';

const SESSION_KEY = 'hirehub_admin_auth';

describe('session.js', function () {
  beforeEach(function () {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(function () {
    sessionStorage.clear();
  });

  // ---- isAdminAuthenticated ----
  describe('isAdminAuthenticated', function () {
    it('returns false when no key is set in sessionStorage', function () {
      expect(isAdminAuthenticated()).toBe(false);
    });

    it('returns true when sessionStorage key is set to "true"', function () {
      sessionStorage.setItem(SESSION_KEY, 'true');
      expect(isAdminAuthenticated()).toBe(true);
    });

    it('returns false when sessionStorage key is set to "false"', function () {
      sessionStorage.setItem(SESSION_KEY, 'false');
      expect(isAdminAuthenticated()).toBe(false);
    });

    it('returns false when sessionStorage key is set to an arbitrary string', function () {
      sessionStorage.setItem(SESSION_KEY, 'yes');
      expect(isAdminAuthenticated()).toBe(false);
    });

    it('returns false when sessionStorage key is set to empty string', function () {
      sessionStorage.setItem(SESSION_KEY, '');
      expect(isAdminAuthenticated()).toBe(false);
    });

    it('returns false when sessionStorage.getItem throws an error', function () {
      var consoleSpy = vi.spyOn(console, 'error').mockImplementation(function () {});
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function () {
        throw new Error('SecurityError');
      });

      expect(isAdminAuthenticated()).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  // ---- loginAdmin ----
  describe('loginAdmin', function () {
    it('returns success true with correct credentials (admin/admin)', function () {
      var result = loginAdmin('admin', 'admin');

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('sets sessionStorage key to "true" on successful login', function () {
      loginAdmin('admin', 'admin');

      expect(sessionStorage.getItem(SESSION_KEY)).toBe('true');
    });

    it('returns success false with incorrect username', function () {
      var result = loginAdmin('wronguser', 'admin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('returns success false with incorrect password', function () {
      var result = loginAdmin('admin', 'wrongpass');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('returns success false with both incorrect credentials', function () {
      var result = loginAdmin('wronguser', 'wrongpass');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('does not set sessionStorage key on failed login', function () {
      loginAdmin('wrong', 'wrong');

      expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
    });

    it('returns error when username is empty string', function () {
      var result = loginAdmin('', 'admin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when password is empty string', function () {
      var result = loginAdmin('admin', '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when username is undefined', function () {
      var result = loginAdmin(undefined, 'admin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when password is undefined', function () {
      var result = loginAdmin('admin', undefined);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when username is null', function () {
      var result = loginAdmin(null, 'admin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when password is null', function () {
      var result = loginAdmin('admin', null);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when both username and password are empty', function () {
      var result = loginAdmin('', '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when username is whitespace only', function () {
      var result = loginAdmin('   ', 'admin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when password is whitespace only', function () {
      var result = loginAdmin('admin', '   ');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('trims whitespace from credentials and succeeds with correct values', function () {
      var result = loginAdmin('  admin  ', '  admin  ');

      expect(result.success).toBe(true);
      expect(sessionStorage.getItem(SESSION_KEY)).toBe('true');
    });

    it('is case-sensitive for username', function () {
      var result = loginAdmin('Admin', 'admin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('is case-sensitive for password', function () {
      var result = loginAdmin('admin', 'Admin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('handles sessionStorage.setItem failure gracefully', function () {
      var consoleSpy = vi.spyOn(console, 'error').mockImplementation(function () {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function () {
        throw new Error('QuotaExceededError');
      });

      var result = loginAdmin('admin', 'admin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to save authentication state');

      consoleSpy.mockRestore();
    });
  });

  // ---- logoutAdmin ----
  describe('logoutAdmin', function () {
    it('removes the sessionStorage key', function () {
      sessionStorage.setItem(SESSION_KEY, 'true');

      logoutAdmin();

      expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
    });

    it('does not throw when key does not exist', function () {
      expect(function () {
        logoutAdmin();
      }).not.toThrow();
    });

    it('results in isAdminAuthenticated returning false after logout', function () {
      sessionStorage.setItem(SESSION_KEY, 'true');
      expect(isAdminAuthenticated()).toBe(true);

      logoutAdmin();

      expect(isAdminAuthenticated()).toBe(false);
    });

    it('handles sessionStorage.removeItem failure gracefully', function () {
      var consoleSpy = vi.spyOn(console, 'error').mockImplementation(function () {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(function () {
        throw new Error('SecurityError');
      });

      expect(function () {
        logoutAdmin();
      }).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  // ---- Full login/logout lifecycle ----
  describe('login/logout lifecycle', function () {
    it('authenticates after login and de-authenticates after logout', function () {
      expect(isAdminAuthenticated()).toBe(false);

      var loginResult = loginAdmin('admin', 'admin');
      expect(loginResult.success).toBe(true);
      expect(isAdminAuthenticated()).toBe(true);

      logoutAdmin();
      expect(isAdminAuthenticated()).toBe(false);
    });

    it('allows re-login after logout', function () {
      loginAdmin('admin', 'admin');
      expect(isAdminAuthenticated()).toBe(true);

      logoutAdmin();
      expect(isAdminAuthenticated()).toBe(false);

      loginAdmin('admin', 'admin');
      expect(isAdminAuthenticated()).toBe(true);
    });
  });
});