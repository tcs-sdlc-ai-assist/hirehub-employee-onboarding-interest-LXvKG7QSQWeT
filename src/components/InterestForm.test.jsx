import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { InterestForm } from './InterestForm';

const STORAGE_KEY = 'hirehub_submissions';

describe('InterestForm', function () {
  beforeEach(function () {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(function () {
    localStorage.clear();
  });

  function renderForm() {
    return render(
      <MemoryRouter initialEntries={['/apply']}>
        <InterestForm />
      </MemoryRouter>
    );
  }

  // ---- Rendering ----
  describe('rendering', function () {
    it('renders the form title', function () {
      renderForm();

      expect(screen.getByText('Express Your Interest')).toBeDefined();
    });

    it('renders the form subtitle', function () {
      renderForm();

      expect(
        screen.getByText(/Fill out the form below to let us know you are interested/)
      ).toBeDefined();
    });

    it('renders the Full Name input field', function () {
      renderForm();

      var input = screen.getByLabelText(/Full Name/);
      expect(input).toBeDefined();
      expect(input.getAttribute('type')).toBe('text');
      expect(input.getAttribute('name')).toBe('fullName');
    });

    it('renders the Email input field', function () {
      renderForm();

      var input = screen.getByLabelText(/Email/);
      expect(input).toBeDefined();
      expect(input.getAttribute('type')).toBe('email');
      expect(input.getAttribute('name')).toBe('email');
    });

    it('renders the Mobile Number input field', function () {
      renderForm();

      var input = screen.getByLabelText(/Mobile Number/);
      expect(input).toBeDefined();
      expect(input.getAttribute('type')).toBe('tel');
      expect(input.getAttribute('name')).toBe('mobile');
    });

    it('renders the Department of Interest select field', function () {
      renderForm();

      var select = screen.getByLabelText(/Department of Interest/);
      expect(select).toBeDefined();
      expect(select.tagName.toLowerCase()).toBe('select');
    });

    it('renders all department options', function () {
      renderForm();

      var departments = [
        'Engineering',
        'Marketing',
        'Sales',
        'Human Resources',
        'Finance',
        'Operations',
        'Design',
        'Product',
      ];

      departments.forEach(function (dept) {
        expect(screen.getByRole('option', { name: dept })).toBeDefined();
      });
    });

    it('renders the Submit button', function () {
      renderForm();

      var submitButton = screen.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeDefined();
      expect(submitButton.getAttribute('type')).toBe('submit');
    });

    it('renders the Back to Home link', function () {
      renderForm();

      var backLink = screen.getByRole('link', { name: 'Back to Home' });
      expect(backLink).toBeDefined();
      expect(backLink.getAttribute('href')).toBe('/');
    });
  });

  // ---- Validation: Empty Fields ----
  describe('validation for empty fields', function () {
    it('shows error for empty Full Name on blur', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Full Name/);
      await user.click(input);
      await user.tab();

      expect(screen.getByText('Full name is required')).toBeDefined();
    });

    it('shows error for empty Email on blur', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Email/);
      await user.click(input);
      await user.tab();

      expect(screen.getByText('Email is required')).toBeDefined();
    });

    it('shows error for empty Mobile Number on blur', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Mobile Number/);
      await user.click(input);
      await user.tab();

      expect(screen.getByText('Mobile number is required')).toBeDefined();
    });

    it('shows error for empty Department on blur', async function () {
      var user = userEvent.setup();
      renderForm();

      var select = screen.getByLabelText(/Department of Interest/);
      await user.click(select);
      await user.tab();

      expect(screen.getByText('Department is required')).toBeDefined();
    });

    it('shows all validation errors on submit with empty form', async function () {
      var user = userEvent.setup();
      renderForm();

      var submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      expect(screen.getByText('Full name is required')).toBeDefined();
      expect(screen.getByText('Email is required')).toBeDefined();
      expect(screen.getByText('Mobile number is required')).toBeDefined();
      expect(screen.getByText('Department is required')).toBeDefined();
    });
  });

  // ---- Validation: Invalid Fields ----
  describe('validation for invalid fields', function () {
    it('shows error for name with numbers', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Full Name/);
      await user.type(input, 'John123');
      await user.tab();

      expect(screen.getByText('Full name must contain only letters and spaces')).toBeDefined();
    });

    it('shows error for name with special characters', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Full Name/);
      await user.type(input, 'John@Doe');
      await user.tab();

      expect(screen.getByText('Full name must contain only letters and spaces')).toBeDefined();
    });

    it('shows error for invalid email format', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Email/);
      await user.type(input, 'notanemail');
      await user.tab();

      expect(screen.getByText('Please enter a valid email address')).toBeDefined();
    });

    it('shows error for email without domain', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Email/);
      await user.type(input, 'user@');
      await user.tab();

      expect(screen.getByText('Please enter a valid email address')).toBeDefined();
    });

    it('shows error for mobile with less than 10 digits', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Mobile Number/);
      await user.type(input, '12345');
      await user.tab();

      expect(screen.getByText('Mobile number must be exactly 10 digits')).toBeDefined();
    });

    it('shows error for mobile with more than 10 digits', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Mobile Number/);
      await user.type(input, '12345678901');
      await user.tab();

      expect(screen.getByText('Mobile number must be exactly 10 digits')).toBeDefined();
    });

    it('shows error for mobile with letters', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Mobile Number/);
      await user.type(input, '12345abcde');
      await user.tab();

      expect(screen.getByText('Mobile number must be exactly 10 digits')).toBeDefined();
    });

    it('shows error for mobile with special characters', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Mobile Number/);
      await user.type(input, '123-456-78');
      await user.tab();

      expect(screen.getByText('Mobile number must be exactly 10 digits')).toBeDefined();
    });
  });

  // ---- Validation errors clear on input ----
  describe('validation errors clear on input change', function () {
    it('clears Full Name error when user starts typing', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Full Name/);
      await user.click(input);
      await user.tab();

      expect(screen.getByText('Full name is required')).toBeDefined();

      await user.type(input, 'J');

      expect(screen.queryByText('Full name is required')).toBeNull();
    });

    it('clears Email error when user starts typing', async function () {
      var user = userEvent.setup();
      renderForm();

      var input = screen.getByLabelText(/Email/);
      await user.click(input);
      await user.tab();

      expect(screen.getByText('Email is required')).toBeDefined();

      await user.type(input, 'j');

      expect(screen.queryByText('Email is required')).toBeNull();
    });
  });

  // ---- Successful Submission ----
  describe('successful submission', function () {
    it('saves submission to localStorage and shows success banner', async function () {
      var user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText(/Full Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email/), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Engineering');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(
        screen.getByText(/Your interest has been submitted successfully/)
      ).toBeDefined();

      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(1);
      expect(stored[0].fullName).toBe('John Doe');
      expect(stored[0].email).toBe('john@example.com');
      expect(stored[0].mobile).toBe('1234567890');
      expect(stored[0].department).toBe('Engineering');
      expect(stored[0].id).toBeDefined();
      expect(stored[0].submittedAt).toBeDefined();
    });

    it('clears the form fields after successful submission', async function () {
      var user = userEvent.setup();
      renderForm();

      var nameInput = screen.getByLabelText(/Full Name/);
      var emailInput = screen.getByLabelText(/Email/);
      var mobileInput = screen.getByLabelText(/Mobile Number/);
      var departmentSelect = screen.getByLabelText(/Department of Interest/);

      await user.type(nameInput, 'Jane Smith');
      await user.type(emailInput, 'jane@example.com');
      await user.type(mobileInput, '9876543210');
      await user.selectOptions(departmentSelect, 'Marketing');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(mobileInput.value).toBe('');
      expect(departmentSelect.value).toBe('');
    });

    it('shows success banner with role alert', async function () {
      var user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText(/Full Name/), 'Test User');
      await user.type(screen.getByLabelText(/Email/), 'test@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '5555555555');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Sales');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      var alerts = screen.getAllByRole('alert');
      var successAlert = alerts.find(function (el) {
        return el.textContent.includes('Your interest has been submitted successfully');
      });
      expect(successAlert).toBeDefined();
    });

    it('allows multiple unique submissions', async function () {
      var user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText(/Full Name/), 'User One');
      await user.type(screen.getByLabelText(/Email/), 'one@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '1111111111');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Finance');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(
        screen.getByText(/Your interest has been submitted successfully/)
      ).toBeDefined();

      await user.type(screen.getByLabelText(/Full Name/), 'User Two');
      await user.type(screen.getByLabelText(/Email/), 'two@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '2222222222');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Design');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(2);
      expect(stored[0].email).toBe('one@example.com');
      expect(stored[1].email).toBe('two@example.com');
    });
  });

  // ---- Duplicate Email ----
  describe('duplicate email handling', function () {
    it('shows error when submitting a duplicate email', async function () {
      var user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText(/Full Name/), 'First User');
      await user.type(screen.getByLabelText(/Email/), 'duplicate@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Engineering');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(
        screen.getByText(/Your interest has been submitted successfully/)
      ).toBeDefined();

      await user.type(screen.getByLabelText(/Full Name/), 'Second User');
      await user.type(screen.getByLabelText(/Email/), 'duplicate@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '0987654321');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Marketing');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText('This email has already been submitted')).toBeDefined();

      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(1);
    });

    it('shows duplicate email error on blur when email already exists', async function () {
      var user = userEvent.setup();

      var existing = [
        {
          id: 'existing-1',
          fullName: 'Existing User',
          email: 'existing@example.com',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2026-03-04T10:30:00.000Z',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

      renderForm();

      var emailInput = screen.getByLabelText(/Email/);
      await user.type(emailInput, 'existing@example.com');
      await user.tab();

      expect(screen.getByText('This email has already been submitted')).toBeDefined();
    });

    it('detects duplicate email case-insensitively on submit', async function () {
      var user = userEvent.setup();

      var existing = [
        {
          id: 'existing-1',
          fullName: 'Existing User',
          email: 'CaseTest@Example.COM',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2026-03-04T10:30:00.000Z',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

      renderForm();

      await user.type(screen.getByLabelText(/Full Name/), 'New User');
      await user.type(screen.getByLabelText(/Email/), 'casetest@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '5555555555');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Sales');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText('This email has already been submitted')).toBeDefined();

      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(1);
    });
  });

  // ---- Does not submit with invalid data ----
  describe('does not submit with invalid data', function () {
    it('does not save to localStorage when form has validation errors', async function () {
      var user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText(/Full Name/), 'John123');
      await user.type(screen.getByLabelText(/Email/), 'invalid-email');
      await user.type(screen.getByLabelText(/Mobile Number/), '123');

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      var stored = localStorage.getItem(STORAGE_KEY);
      expect(stored === null || stored === '[]' || stored === undefined).toBe(true);
    });

    it('does not show success banner when form has validation errors', async function () {
      var user = userEvent.setup();
      renderForm();

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(
        screen.queryByText(/Your interest has been submitted successfully/)
      ).toBeNull();
    });
  });

  // ---- Back to Home link ----
  describe('Back to Home link', function () {
    it('renders a link that navigates to home page', function () {
      renderForm();

      var backLink = screen.getByRole('link', { name: 'Back to Home' });
      expect(backLink).toBeDefined();
      expect(backLink.getAttribute('href')).toBe('/');
    });
  });

  // ---- Form structure ----
  describe('form structure', function () {
    it('renders a form element with noValidate', function () {
      renderForm();

      var form = document.querySelector('form');
      expect(form).toBeDefined();
      expect(form.getAttribute('novalidate')).not.toBeNull();
    });

    it('renders the default select option', function () {
      renderForm();

      var defaultOption = screen.getByRole('option', { name: 'Select a department' });
      expect(defaultOption).toBeDefined();
      expect(defaultOption.value).toBe('');
    });
  });
});