import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getSubmissions,
  saveSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  isEmailDuplicate,
} from './storage';

const STORAGE_KEY = 'hirehub_submissions';

describe('storage.js', function () {
  beforeEach(function () {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(function () {
    localStorage.clear();
  });

  // ---- getSubmissions ----
  describe('getSubmissions', function () {
    it('returns an empty array when localStorage has no data', function () {
      var result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage value is null', function () {
      localStorage.removeItem(STORAGE_KEY);
      var result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns parsed submissions when localStorage has valid JSON array', function () {
      var submissions = [
        {
          id: 'abc-123',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2026-03-04T10:30:00.000Z',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));

      var result = getSubmissions();
      expect(result).toEqual(submissions);
      expect(result).toHaveLength(1);
      expect(result[0].fullName).toBe('John Doe');
    });

    it('returns multiple submissions correctly', function () {
      var submissions = [
        {
          id: '1',
          fullName: 'Alice',
          email: 'alice@example.com',
          mobile: '1111111111',
          department: 'Marketing',
          submittedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          fullName: 'Bob',
          email: 'bob@example.com',
          mobile: '2222222222',
          department: 'Sales',
          submittedAt: '2026-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));

      var result = getSubmissions();
      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('alice@example.com');
      expect(result[1].email).toBe('bob@example.com');
    });

    it('resets and returns empty array when localStorage has corrupted JSON', function () {
      localStorage.setItem(STORAGE_KEY, '{not valid json!!!');

      var result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
    });

    it('resets and returns empty array when localStorage has a non-array JSON value', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ key: 'value' }));

      var result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
    });

    it('resets and returns empty array when localStorage has a string JSON value', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify('just a string'));

      var result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
    });

    it('resets and returns empty array when localStorage has a number JSON value', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(42));

      var result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
    });
  });

  // ---- saveSubmissions ----
  describe('saveSubmissions', function () {
    it('writes submissions array to localStorage as JSON', function () {
      var submissions = [
        {
          id: 'test-1',
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          mobile: '9876543210',
          department: 'Design',
          submittedAt: '2026-03-04T10:30:00.000Z',
        },
      ];

      saveSubmissions(submissions);

      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toEqual(submissions);
    });

    it('writes an empty array to localStorage', function () {
      saveSubmissions([]);

      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toEqual([]);
    });

    it('overwrites existing data in localStorage', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 'old' }]));

      var newSubmissions = [{ id: 'new-1' }, { id: 'new-2' }];
      saveSubmissions(newSubmissions);

      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toEqual(newSubmissions);
      expect(stored).toHaveLength(2);
    });

    it('handles localStorage.setItem failure gracefully', function () {
      var consoleSpy = vi.spyOn(console, 'error').mockImplementation(function () {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function () {
        throw new Error('QuotaExceededError');
      });

      expect(function () {
        saveSubmissions([{ id: 'test' }]);
      }).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  // ---- addSubmission ----
  describe('addSubmission', function () {
    it('creates a new submission with id and submittedAt timestamp', function () {
      var result = addSubmission({
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(result.status).toBe('success');
      expect(result.submission).toBeDefined();
      expect(result.submission.id).toBeDefined();
      expect(typeof result.submission.id).toBe('string');
      expect(result.submission.id.length).toBeGreaterThan(0);
      expect(result.submission.submittedAt).toBeDefined();
      expect(result.submission.fullName).toBe('John Doe');
      expect(result.submission.email).toBe('john@example.com');
      expect(result.submission.mobile).toBe('1234567890');
      expect(result.submission.department).toBe('Engineering');
    });

    it('persists the new submission to localStorage', function () {
      addSubmission({
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        mobile: '9876543210',
        department: 'Marketing',
      });

      var stored = getSubmissions();
      expect(stored).toHaveLength(1);
      expect(stored[0].email).toBe('jane@example.com');
    });

    it('appends to existing submissions', function () {
      addSubmission({
        fullName: 'First User',
        email: 'first@example.com',
        mobile: '1111111111',
        department: 'Sales',
      });

      addSubmission({
        fullName: 'Second User',
        email: 'second@example.com',
        mobile: '2222222222',
        department: 'Finance',
      });

      var stored = getSubmissions();
      expect(stored).toHaveLength(2);
      expect(stored[0].email).toBe('first@example.com');
      expect(stored[1].email).toBe('second@example.com');
    });

    it('returns error for duplicate email', function () {
      addSubmission({
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      var result = addSubmission({
        fullName: 'John Doe Again',
        email: 'john@example.com',
        mobile: '0987654321',
        department: 'Marketing',
      });

      expect(result.status).toBe('error');
      expect(result.message).toBe('Duplicate email');
    });

    it('returns error for duplicate email with different casing', function () {
      addSubmission({
        fullName: 'John Doe',
        email: 'John@Example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      var result = addSubmission({
        fullName: 'Another John',
        email: 'john@example.com',
        mobile: '0987654321',
        department: 'Sales',
      });

      expect(result.status).toBe('error');
      expect(result.message).toBe('Duplicate email');
    });

    it('trims whitespace from submission fields', function () {
      var result = addSubmission({
        fullName: '  John Doe  ',
        email: '  john@example.com  ',
        mobile: '  1234567890  ',
        department: '  Engineering  ',
      });

      expect(result.status).toBe('success');
      expect(result.submission.fullName).toBe('John Doe');
      expect(result.submission.email).toBe('john@example.com');
      expect(result.submission.mobile).toBe('1234567890');
      expect(result.submission.department).toBe('Engineering');
    });

    it('generates a valid submittedAt ISO string', function () {
      var before = new Date().toISOString();
      var result = addSubmission({
        fullName: 'Test User',
        email: 'test@example.com',
        mobile: '5555555555',
        department: 'Product',
      });
      var after = new Date().toISOString();

      expect(result.submission.submittedAt).toBeDefined();
      var submittedDate = new Date(result.submission.submittedAt);
      expect(isNaN(submittedDate.getTime())).toBe(false);
      expect(submittedDate.toISOString() >= before).toBe(true);
      expect(submittedDate.toISOString() <= after).toBe(true);
    });

    it('generates unique ids for each submission', function () {
      var result1 = addSubmission({
        fullName: 'User One',
        email: 'one@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });

      var result2 = addSubmission({
        fullName: 'User Two',
        email: 'two@example.com',
        mobile: '2222222222',
        department: 'Marketing',
      });

      expect(result1.submission.id).not.toBe(result2.submission.id);
    });
  });

  // ---- updateSubmission ----
  describe('updateSubmission', function () {
    it('updates the correct submission by id', function () {
      var addResult = addSubmission({
        fullName: 'Original Name',
        email: 'original@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      var id = addResult.submission.id;

      var updateResult = updateSubmission(id, {
        fullName: 'Updated Name',
        mobile: '0987654321',
        department: 'Marketing',
      });

      expect(updateResult.status).toBe('success');
      expect(updateResult.submission.fullName).toBe('Updated Name');
      expect(updateResult.submission.mobile).toBe('0987654321');
      expect(updateResult.submission.department).toBe('Marketing');
      expect(updateResult.submission.email).toBe('original@example.com');
    });

    it('persists the update to localStorage', function () {
      var addResult = addSubmission({
        fullName: 'Before Update',
        email: 'update@example.com',
        mobile: '1234567890',
        department: 'Sales',
      });

      updateSubmission(addResult.submission.id, { fullName: 'After Update' });

      var stored = getSubmissions();
      expect(stored[0].fullName).toBe('After Update');
    });

    it('returns error when submission id is not found', function () {
      var result = updateSubmission('nonexistent-id', { fullName: 'Test' });

      expect(result.status).toBe('error');
      expect(result.message).toBe('Submission not found');
    });

    it('returns error for duplicate email when changing email', function () {
      addSubmission({
        fullName: 'User One',
        email: 'one@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });

      var addResult2 = addSubmission({
        fullName: 'User Two',
        email: 'two@example.com',
        mobile: '2222222222',
        department: 'Marketing',
      });

      var result = updateSubmission(addResult2.submission.id, {
        email: 'one@example.com',
      });

      expect(result.status).toBe('error');
      expect(result.message).toBe('Duplicate email');
    });

    it('allows updating without changing email', function () {
      var addResult = addSubmission({
        fullName: 'Keep Email',
        email: 'keep@example.com',
        mobile: '1234567890',
        department: 'Finance',
      });

      var result = updateSubmission(addResult.submission.id, {
        fullName: 'New Name',
      });

      expect(result.status).toBe('success');
      expect(result.submission.fullName).toBe('New Name');
      expect(result.submission.email).toBe('keep@example.com');
    });

    it('does not modify other submissions', function () {
      var addResult1 = addSubmission({
        fullName: 'User One',
        email: 'one@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });

      var addResult2 = addSubmission({
        fullName: 'User Two',
        email: 'two@example.com',
        mobile: '2222222222',
        department: 'Marketing',
      });

      updateSubmission(addResult2.submission.id, { fullName: 'Updated Two' });

      var stored = getSubmissions();
      expect(stored[0].fullName).toBe('User One');
      expect(stored[0].id).toBe(addResult1.submission.id);
      expect(stored[1].fullName).toBe('Updated Two');
    });

    it('trims whitespace from updated fields', function () {
      var addResult = addSubmission({
        fullName: 'Original',
        email: 'trim@example.com',
        mobile: '1234567890',
        department: 'Design',
      });

      var result = updateSubmission(addResult.submission.id, {
        fullName: '  Trimmed Name  ',
        mobile: '  0987654321  ',
      });

      expect(result.status).toBe('success');
      expect(result.submission.fullName).toBe('Trimmed Name');
      expect(result.submission.mobile).toBe('0987654321');
    });
  });

  // ---- deleteSubmission ----
  describe('deleteSubmission', function () {
    it('removes the correct submission by id and returns true', function () {
      var addResult = addSubmission({
        fullName: 'To Delete',
        email: 'delete@example.com',
        mobile: '1234567890',
        department: 'Operations',
      });

      var result = deleteSubmission(addResult.submission.id);

      expect(result).toBe(true);
      var stored = getSubmissions();
      expect(stored).toHaveLength(0);
    });

    it('returns false when submission id is not found', function () {
      var result = deleteSubmission('nonexistent-id');
      expect(result).toBe(false);
    });

    it('only removes the targeted submission and keeps others', function () {
      var addResult1 = addSubmission({
        fullName: 'Keep Me',
        email: 'keep@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });

      var addResult2 = addSubmission({
        fullName: 'Delete Me',
        email: 'deleteme@example.com',
        mobile: '2222222222',
        department: 'Marketing',
      });

      deleteSubmission(addResult2.submission.id);

      var stored = getSubmissions();
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe(addResult1.submission.id);
      expect(stored[0].fullName).toBe('Keep Me');
    });

    it('persists the deletion to localStorage', function () {
      var addResult = addSubmission({
        fullName: 'Persist Delete',
        email: 'persist@example.com',
        mobile: '3333333333',
        department: 'Product',
      });

      deleteSubmission(addResult.submission.id);

      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = JSON.parse(raw);
      expect(parsed).toHaveLength(0);
    });

    it('returns false when deleting from empty storage', function () {
      var result = deleteSubmission('any-id');
      expect(result).toBe(false);
    });
  });

  // ---- isEmailDuplicate ----
  describe('isEmailDuplicate', function () {
    it('returns false when no submissions exist', function () {
      expect(isEmailDuplicate('test@example.com')).toBe(false);
    });

    it('returns true when email already exists', function () {
      addSubmission({
        fullName: 'Existing User',
        email: 'existing@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(isEmailDuplicate('existing@example.com')).toBe(true);
    });

    it('returns false for a unique email', function () {
      addSubmission({
        fullName: 'Existing User',
        email: 'existing@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(isEmailDuplicate('unique@example.com')).toBe(false);
    });

    it('performs case-insensitive email comparison', function () {
      addSubmission({
        fullName: 'Case Test',
        email: 'CaseTest@Example.COM',
        mobile: '1234567890',
        department: 'Marketing',
      });

      expect(isEmailDuplicate('casetest@example.com')).toBe(true);
      expect(isEmailDuplicate('CASETEST@EXAMPLE.COM')).toBe(true);
    });

    it('returns false for empty or falsy email', function () {
      expect(isEmailDuplicate('')).toBe(false);
      expect(isEmailDuplicate(null)).toBe(false);
      expect(isEmailDuplicate(undefined)).toBe(false);
    });

    it('excludes a specific id from the duplicate check', function () {
      var addResult = addSubmission({
        fullName: 'Exclude Me',
        email: 'exclude@example.com',
        mobile: '1234567890',
        department: 'Sales',
      });

      expect(isEmailDuplicate('exclude@example.com', addResult.submission.id)).toBe(false);
    });

    it('still detects duplicates when excludeId does not match', function () {
      addSubmission({
        fullName: 'User A',
        email: 'shared@example.com',
        mobile: '1111111111',
        department: 'Finance',
      });

      addSubmission({
        fullName: 'User B',
        email: 'other@example.com',
        mobile: '2222222222',
        department: 'Design',
      });

      expect(isEmailDuplicate('shared@example.com', 'some-other-id')).toBe(true);
    });

    it('handles email with leading and trailing whitespace', function () {
      addSubmission({
        fullName: 'Whitespace User',
        email: 'whitespace@example.com',
        mobile: '1234567890',
        department: 'Operations',
      });

      expect(isEmailDuplicate('  whitespace@example.com  ')).toBe(true);
    });
  });

  // ---- Corrupted localStorage handling (SCRUM-18025) ----
  describe('corrupted localStorage handling', function () {
    it('recovers from corrupted JSON and allows new submissions', function () {
      localStorage.setItem(STORAGE_KEY, 'this is not json');

      var submissions = getSubmissions();
      expect(submissions).toEqual([]);

      var result = addSubmission({
        fullName: 'Recovery User',
        email: 'recovery@example.com',
        mobile: '5555555555',
        department: 'Product',
      });

      expect(result.status).toBe('success');
      expect(getSubmissions()).toHaveLength(1);
    });

    it('recovers from non-array JSON and allows operations', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ corrupted: true }));

      var submissions = getSubmissions();
      expect(submissions).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');

      var result = addSubmission({
        fullName: 'After Corruption',
        email: 'after@example.com',
        mobile: '6666666666',
        department: 'Human Resources',
      });

      expect(result.status).toBe('success');
      expect(getSubmissions()).toHaveLength(1);
    });

    it('recovers from null stored as JSON string', function () {
      localStorage.setItem(STORAGE_KEY, 'null');

      var submissions = getSubmissions();
      expect(submissions).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
    });
  });
});