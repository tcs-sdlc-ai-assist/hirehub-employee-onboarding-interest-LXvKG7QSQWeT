import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateEmail,
  validateMobile,
  validateDepartment,
  ALLOWED_DEPARTMENTS,
} from './validators';

describe('validators.js', function () {
  // ---- validateName ----
  describe('validateName', function () {
    it('returns empty string for a valid name', function () {
      expect(validateName('John Doe')).toBe('');
    });

    it('returns empty string for a single word name', function () {
      expect(validateName('Alice')).toBe('');
    });

    it('returns empty string for a name with multiple spaces', function () {
      expect(validateName('Mary Jane Watson')).toBe('');
    });

    it('returns empty string for a name with leading and trailing spaces (trimmed)', function () {
      expect(validateName('  John Doe  ')).toBe('');
    });

    it('returns error for empty string', function () {
      expect(validateName('')).toBe('Full name is required');
    });

    it('returns error for whitespace-only input', function () {
      expect(validateName('   ')).toBe('Full name is required');
    });

    it('returns error for undefined', function () {
      expect(validateName(undefined)).toBe('Full name is required');
    });

    it('returns error for null', function () {
      expect(validateName(null)).toBe('Full name is required');
    });

    it('returns error for name containing numbers', function () {
      expect(validateName('John123')).toBe('Full name must contain only letters and spaces');
    });

    it('returns error for name containing special characters', function () {
      expect(validateName('John@Doe')).toBe('Full name must contain only letters and spaces');
    });

    it('returns error for name containing hyphens', function () {
      expect(validateName('Mary-Jane')).toBe('Full name must contain only letters and spaces');
    });

    it('returns error for name containing periods', function () {
      expect(validateName('Dr. Smith')).toBe('Full name must contain only letters and spaces');
    });

    it('accepts all uppercase letters', function () {
      expect(validateName('JOHN DOE')).toBe('');
    });

    it('accepts all lowercase letters', function () {
      expect(validateName('john doe')).toBe('');
    });
  });

  // ---- validateEmail ----
  describe('validateEmail', function () {
    it('returns empty string for a valid email', function () {
      expect(validateEmail('john@example.com')).toBe('');
    });

    it('returns empty string for an email with subdomain', function () {
      expect(validateEmail('user@mail.example.com')).toBe('');
    });

    it('returns empty string for an email with plus addressing', function () {
      expect(validateEmail('user+tag@example.com')).toBe('');
    });

    it('returns empty string for an email with dots in local part', function () {
      expect(validateEmail('first.last@example.com')).toBe('');
    });

    it('returns error for empty string', function () {
      expect(validateEmail('')).toBe('Email is required');
    });

    it('returns error for whitespace-only input', function () {
      expect(validateEmail('   ')).toBe('Email is required');
    });

    it('returns error for undefined', function () {
      expect(validateEmail(undefined)).toBe('Email is required');
    });

    it('returns error for null', function () {
      expect(validateEmail(null)).toBe('Email is required');
    });

    it('returns error for email without @ symbol', function () {
      expect(validateEmail('johnexample.com')).toBe('Please enter a valid email address');
    });

    it('returns error for email without domain', function () {
      expect(validateEmail('john@')).toBe('Please enter a valid email address');
    });

    it('returns error for email without local part', function () {
      expect(validateEmail('@example.com')).toBe('Please enter a valid email address');
    });

    it('returns error for email without TLD', function () {
      expect(validateEmail('john@example')).toBe('Please enter a valid email address');
    });

    it('returns error for email with spaces', function () {
      expect(validateEmail('john doe@example.com')).toBe('Please enter a valid email address');
    });

    it('returns error for plain text', function () {
      expect(validateEmail('not-an-email')).toBe('Please enter a valid email address');
    });

    it('returns empty string for email with leading/trailing spaces (trimmed)', function () {
      expect(validateEmail('  john@example.com  ')).toBe('');
    });
  });

  // ---- validateMobile ----
  describe('validateMobile', function () {
    it('returns empty string for a valid 10-digit number', function () {
      expect(validateMobile('1234567890')).toBe('');
    });

    it('returns empty string for another valid 10-digit number', function () {
      expect(validateMobile('9876543210')).toBe('');
    });

    it('returns error for empty string', function () {
      expect(validateMobile('')).toBe('Mobile number is required');
    });

    it('returns error for whitespace-only input', function () {
      expect(validateMobile('   ')).toBe('Mobile number is required');
    });

    it('returns error for undefined', function () {
      expect(validateMobile(undefined)).toBe('Mobile number is required');
    });

    it('returns error for null', function () {
      expect(validateMobile(null)).toBe('Mobile number is required');
    });

    it('returns error for number with less than 10 digits', function () {
      expect(validateMobile('12345')).toBe('Mobile number must be exactly 10 digits');
    });

    it('returns error for number with more than 10 digits', function () {
      expect(validateMobile('12345678901')).toBe('Mobile number must be exactly 10 digits');
    });

    it('returns error for number containing letters', function () {
      expect(validateMobile('12345abcde')).toBe('Mobile number must be exactly 10 digits');
    });

    it('returns error for number containing special characters', function () {
      expect(validateMobile('123-456-7890')).toBe('Mobile number must be exactly 10 digits');
    });

    it('returns error for number with spaces', function () {
      expect(validateMobile('123 456 7890')).toBe('Mobile number must be exactly 10 digits');
    });

    it('returns error for number with plus prefix', function () {
      expect(validateMobile('+1234567890')).toBe('Mobile number must be exactly 10 digits');
    });

    it('returns empty string for 10-digit number with leading/trailing spaces (trimmed)', function () {
      expect(validateMobile('  1234567890  ')).toBe('');
    });

    it('returns error for a single digit', function () {
      expect(validateMobile('5')).toBe('Mobile number must be exactly 10 digits');
    });

    it('returns error for all zeros with 9 digits', function () {
      expect(validateMobile('000000000')).toBe('Mobile number must be exactly 10 digits');
    });

    it('returns empty string for all zeros with 10 digits', function () {
      expect(validateMobile('0000000000')).toBe('');
    });
  });

  // ---- validateDepartment ----
  describe('validateDepartment', function () {
    it('returns empty string for each allowed department', function () {
      ALLOWED_DEPARTMENTS.forEach(function (dept) {
        expect(validateDepartment(dept)).toBe('');
      });
    });

    it('returns empty string for Engineering', function () {
      expect(validateDepartment('Engineering')).toBe('');
    });

    it('returns empty string for Human Resources', function () {
      expect(validateDepartment('Human Resources')).toBe('');
    });

    it('returns error for empty string', function () {
      expect(validateDepartment('')).toBe('Department is required');
    });

    it('returns error for whitespace-only input', function () {
      expect(validateDepartment('   ')).toBe('Department is required');
    });

    it('returns error for undefined', function () {
      expect(validateDepartment(undefined)).toBe('Department is required');
    });

    it('returns error for null', function () {
      expect(validateDepartment(null)).toBe('Department is required');
    });

    it('returns error for an invalid department name', function () {
      expect(validateDepartment('Legal')).toBe('Please select a valid department');
    });

    it('returns error for a department with wrong casing', function () {
      expect(validateDepartment('engineering')).toBe('Please select a valid department');
    });

    it('returns error for a department with extra spaces inside', function () {
      expect(validateDepartment('Human  Resources')).toBe('Please select a valid department');
    });

    it('returns error for a random string', function () {
      expect(validateDepartment('NotADepartment')).toBe('Please select a valid department');
    });

    it('returns empty string for department with leading/trailing spaces (trimmed)', function () {
      expect(validateDepartment('  Engineering  ')).toBe('');
    });
  });

  // ---- ALLOWED_DEPARTMENTS ----
  describe('ALLOWED_DEPARTMENTS', function () {
    it('is an array', function () {
      expect(Array.isArray(ALLOWED_DEPARTMENTS)).toBe(true);
    });

    it('contains exactly 8 departments', function () {
      expect(ALLOWED_DEPARTMENTS).toHaveLength(8);
    });

    it('contains Engineering', function () {
      expect(ALLOWED_DEPARTMENTS).toContain('Engineering');
    });

    it('contains Marketing', function () {
      expect(ALLOWED_DEPARTMENTS).toContain('Marketing');
    });

    it('contains Sales', function () {
      expect(ALLOWED_DEPARTMENTS).toContain('Sales');
    });

    it('contains Human Resources', function () {
      expect(ALLOWED_DEPARTMENTS).toContain('Human Resources');
    });

    it('contains Finance', function () {
      expect(ALLOWED_DEPARTMENTS).toContain('Finance');
    });

    it('contains Operations', function () {
      expect(ALLOWED_DEPARTMENTS).toContain('Operations');
    });

    it('contains Design', function () {
      expect(ALLOWED_DEPARTMENTS).toContain('Design');
    });

    it('contains Product', function () {
      expect(ALLOWED_DEPARTMENTS).toContain('Product');
    });
  });
});