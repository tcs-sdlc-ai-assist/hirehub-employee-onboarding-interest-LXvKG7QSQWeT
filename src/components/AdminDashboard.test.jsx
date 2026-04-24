import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';

const STORAGE_KEY = 'hirehub_submissions';
const SESSION_KEY = 'hirehub_admin_auth';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async function () {
  var actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: function () {
      return mockNavigate;
    },
  };
});

function createMockSubmissions() {
  return [
    {
      id: 'test-id-1',
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      mobile: '1234567890',
      department: 'Engineering',
      submittedAt: '2026-03-04T10:30:00.000Z',
    },
    {
      id: 'test-id-2',
      fullName: 'Bob Smith',
      email: 'bob@example.com',
      mobile: '9876543210',
      department: 'Marketing',
      submittedAt: '2026-03-05T14:00:00.000Z',
    },
    {
      id: 'test-id-3',
      fullName: 'Carol White',
      email: 'carol@example.com',
      mobile: '5555555555',
      department: 'Engineering',
      submittedAt: '2026-03-06T09:15:00.000Z',
    },
  ];
}

describe('AdminDashboard', function () {
  beforeEach(function () {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem(SESSION_KEY, 'true');
    vi.clearAllMocks();
  });

  afterEach(function () {
    localStorage.clear();
    sessionStorage.clear();
  });

  function renderDashboard() {
    return render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminDashboard />
      </MemoryRouter>
    );
  }

  // ---- Rendering ----
  describe('rendering', function () {
    it('renders the dashboard title', function () {
      renderDashboard();

      expect(screen.getByText('Admin Dashboard')).toBeDefined();
    });

    it('renders the Logout button', function () {
      renderDashboard();

      var logoutButton = screen.getByRole('button', { name: 'Logout' });
      expect(logoutButton).toBeDefined();
    });
  });

  // ---- Stat Cards ----
  describe('stat cards', function () {
    it('renders stat cards with zero values when no submissions exist', function () {
      renderDashboard();

      expect(screen.getByText('Total Submissions')).toBeDefined();
      expect(screen.getByText('Unique Departments')).toBeDefined();
      expect(screen.getByText('Latest Submission')).toBeDefined();

      expect(screen.getByText('0')).toBeDefined();
      expect(screen.getByText('N/A')).toBeDefined();
    });

    it('renders correct total submissions count', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      var statCards = document.querySelectorAll('.stat-card');
      var totalCard = statCards[0];
      expect(within(totalCard).getByText('3')).toBeDefined();
      expect(within(totalCard).getByText('Total Submissions')).toBeDefined();
    });

    it('renders correct unique departments count', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      var statCards = document.querySelectorAll('.stat-card');
      var deptCard = statCards[1];
      expect(within(deptCard).getByText('2')).toBeDefined();
      expect(within(deptCard).getByText('Unique Departments')).toBeDefined();
    });

    it('renders latest submission date', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      var statCards = document.querySelectorAll('.stat-card');
      var latestCard = statCards[2];
      expect(within(latestCard).getByText('Latest Submission')).toBeDefined();
      // The latest submission is 2026-03-06T09:15:00.000Z
      // It should not be N/A
      expect(within(latestCard).queryByText('N/A')).toBeNull();
    });

    it('renders stat cards with correct values for single submission', function () {
      var singleSubmission = [
        {
          id: 'single-1',
          fullName: 'Solo User',
          email: 'solo@example.com',
          mobile: '1111111111',
          department: 'Finance',
          submittedAt: '2026-01-15T08:00:00.000Z',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(singleSubmission));
      renderDashboard();

      var statCards = document.querySelectorAll('.stat-card');
      expect(within(statCards[0]).getByText('1')).toBeDefined();
      expect(within(statCards[1]).getByText('1')).toBeDefined();
    });
  });

  // ---- Submission Table ----
  describe('submission table', function () {
    it('renders empty state when no submissions exist', function () {
      renderDashboard();

      expect(screen.getByText('No submissions yet.')).toBeDefined();
    });

    it('renders submission table with mock data', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      expect(screen.getByText('Alice Johnson')).toBeDefined();
      expect(screen.getByText('Bob Smith')).toBeDefined();
      expect(screen.getByText('Carol White')).toBeDefined();
    });

    it('renders email addresses in the table', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      expect(screen.getByText('alice@example.com')).toBeDefined();
      expect(screen.getByText('bob@example.com')).toBeDefined();
      expect(screen.getByText('carol@example.com')).toBeDefined();
    });

    it('renders mobile numbers in the table', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      expect(screen.getByText('1234567890')).toBeDefined();
      expect(screen.getByText('9876543210')).toBeDefined();
      expect(screen.getByText('5555555555')).toBeDefined();
    });

    it('renders department badges in the table', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      var engineeringBadges = screen.getAllByText('Engineering');
      expect(engineeringBadges.length).toBe(2);
      expect(screen.getByText('Marketing')).toBeDefined();
    });

    it('renders Edit and Delete buttons for each submission', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      expect(screen.getByLabelText('Edit Alice Johnson')).toBeDefined();
      expect(screen.getByLabelText('Delete Alice Johnson')).toBeDefined();
      expect(screen.getByLabelText('Edit Bob Smith')).toBeDefined();
      expect(screen.getByLabelText('Delete Bob Smith')).toBeDefined();
      expect(screen.getByLabelText('Edit Carol White')).toBeDefined();
      expect(screen.getByLabelText('Delete Carol White')).toBeDefined();
    });

    it('renders table headers', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      expect(screen.getByText('#')).toBeDefined();
      expect(screen.getByText('Full Name')).toBeDefined();
      expect(screen.getByText('Email')).toBeDefined();
      expect(screen.getByText('Mobile')).toBeDefined();
      expect(screen.getByText('Department')).toBeDefined();
      expect(screen.getByText('Submitted Date')).toBeDefined();
      expect(screen.getByText('Actions')).toBeDefined();
    });
  });

  // ---- Edit Modal ----
  describe('edit functionality', function () {
    it('opens edit modal when Edit button is clicked', async function () {
      var user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Edit Alice Johnson'));

      expect(screen.getByText('Edit Submission')).toBeDefined();
    });

    it('pre-fills the edit modal with submission data', async function () {
      var user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Edit Alice Johnson'));

      var nameInput = screen.getByLabelText(/Full Name/);
      var emailInput = screen.getByLabelText(/Email/);
      var mobileInput = screen.getByLabelText(/Mobile Number/);

      expect(nameInput.value).toBe('Alice Johnson');
      expect(emailInput.value).toBe('alice@example.com');
      expect(mobileInput.value).toBe('1234567890');
    });

    it('shows email as read-only in edit modal', async function () {
      var user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Edit Alice Johnson'));

      var emailInput = screen.getByLabelText(/Email/);
      expect(emailInput.hasAttribute('readonly')).toBe(true);
      expect(emailInput.disabled).toBe(true);
    });

    it('closes edit modal when Cancel button is clicked', async function () {
      var user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Edit Alice Johnson'));
      expect(screen.getByText('Edit Submission')).toBeDefined();

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.queryByText('Edit Submission')).toBeNull();
    });

    it('closes edit modal when close button is clicked', async function () {
      var user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Edit Alice Johnson'));
      expect(screen.getByText('Edit Submission')).toBeDefined();

      await user.click(screen.getByLabelText('Close modal'));

      expect(screen.queryByText('Edit Submission')).toBeNull();
    });

    it('saves changes and updates the table', async function () {
      var user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Edit Alice Johnson'));

      var nameInput = screen.getByLabelText(/Full Name/);
      await user.clear(nameInput);
      await user.type(nameInput, 'Alice Updated');

      await user.click(screen.getByRole('button', { name: 'Save Changes' }));

      expect(screen.queryByText('Edit Submission')).toBeNull();
      expect(screen.getByText('Alice Updated')).toBeDefined();
      expect(screen.getByText(/Submission updated successfully/)).toBeDefined();
    });

    it('persists edit changes to localStorage', async function () {
      var user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Edit Bob Smith'));

      var nameInput = screen.getByLabelText(/Full Name/);
      await user.clear(nameInput);
      await user.type(nameInput, 'Bob Updated');

      await user.click(screen.getByRole('button', { name: 'Save Changes' }));

      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      var updated = stored.find(function (s) {
        return s.id === 'test-id-2';
      });
      expect(updated.fullName).toBe('Bob Updated');
    });

    it('shows validation errors in edit modal for empty name', async function () {
      var user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Edit Alice Johnson'));

      var nameInput = screen.getByLabelText(/Full Name/);
      await user.clear(nameInput);

      await user.click(screen.getByRole('button', { name: 'Save Changes' }));

      expect(screen.getByText('Full name is required')).toBeDefined();
    });

    it('shows validation errors in edit modal for invalid mobile', async function () {
      var user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Edit Alice Johnson'));

      var mobileInput = screen.getByLabelText(/Mobile Number/);
      await user.clear(mobileInput);
      await user.type(mobileInput, '123');

      await user.click(screen.getByRole('button', { name: 'Save Changes' }));

      expect(screen.getByText('Mobile number must be exactly 10 digits')).toBeDefined();
    });

    it('pre-fills department select in edit modal', async function () {
      var user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Edit Alice Johnson'));

      var departmentSelect = screen.getByLabelText(/Department of Interest/);
      expect(departmentSelect.value).toBe('Engineering');
    });
  });

  // ---- Delete Functionality ----
  describe('delete functionality', function () {
    it('triggers confirmation dialog when Delete button is clicked', async function () {
      var user = userEvent.setup();
      var confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Delete Alice Johnson'));

      expect(confirmSpy).toHaveBeenCalledWith(
        'Are you sure you want to delete the submission from Alice Johnson?'
      );

      confirmSpy.mockRestore();
    });

    it('does not delete when confirmation is cancelled', async function () {
      var user = userEvent.setup();
      var confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Delete Alice Johnson'));

      expect(screen.getByText('Alice Johnson')).toBeDefined();

      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(3);

      confirmSpy.mockRestore();
    });

    it('deletes submission when confirmation is accepted', async function () {
      var user = userEvent.setup();
      var confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Delete Alice Johnson'));

      expect(screen.queryByText('Alice Johnson')).toBeNull();
      expect(screen.getByText(/Submission deleted successfully/)).toBeDefined();

      confirmSpy.mockRestore();
    });

    it('persists deletion to localStorage', async function () {
      var user = userEvent.setup();
      var confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Delete Bob Smith'));

      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toHaveLength(2);
      var deleted = stored.find(function (s) {
        return s.id === 'test-id-2';
      });
      expect(deleted).toBeUndefined();

      confirmSpy.mockRestore();
    });

    it('updates stat cards after deletion', async function () {
      var user = userEvent.setup();
      var confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      var statCards = document.querySelectorAll('.stat-card');
      expect(within(statCards[0]).getByText('3')).toBeDefined();

      await user.click(screen.getByLabelText('Delete Alice Johnson'));

      statCards = document.querySelectorAll('.stat-card');
      expect(within(statCards[0]).getByText('2')).toBeDefined();

      confirmSpy.mockRestore();
    });

    it('shows empty state after deleting all submissions', async function () {
      var user = userEvent.setup();
      var confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      var singleSubmission = [
        {
          id: 'only-1',
          fullName: 'Only User',
          email: 'only@example.com',
          mobile: '1111111111',
          department: 'Sales',
          submittedAt: '2026-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(singleSubmission));
      renderDashboard();

      await user.click(screen.getByLabelText('Delete Only User'));

      expect(screen.getByText('No submissions yet.')).toBeDefined();

      confirmSpy.mockRestore();
    });
  });

  // ---- Logout ----
  describe('logout', function () {
    it('clears session and navigates to home on logout click', async function () {
      var user = userEvent.setup();
      renderDashboard();

      var logoutButton = screen.getByRole('button', { name: 'Logout' });
      await user.click(logoutButton);

      expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('renders logout button with correct class', function () {
      renderDashboard();

      var logoutButton = screen.getByRole('button', { name: 'Logout' });
      expect(logoutButton.className).toContain('btn-danger');
    });
  });

  // ---- Success and Error Messages ----
  describe('messages', function () {
    it('shows success banner with role alert after edit', async function () {
      var user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Edit Alice Johnson'));

      await user.click(screen.getByRole('button', { name: 'Save Changes' }));

      var alerts = screen.getAllByRole('alert');
      var successAlert = alerts.find(function (el) {
        return el.textContent.includes('Submission updated successfully');
      });
      expect(successAlert).toBeDefined();
    });

    it('shows success banner with role alert after delete', async function () {
      var user = userEvent.setup();
      var confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createMockSubmissions()));
      renderDashboard();

      await user.click(screen.getByLabelText('Delete Alice Johnson'));

      var alerts = screen.getAllByRole('alert');
      var successAlert = alerts.find(function (el) {
        return el.textContent.includes('Submission deleted successfully');
      });
      expect(successAlert).toBeDefined();

      confirmSpy.mockRestore();
    });
  });

  // ---- Dashboard Structure ----
  describe('structure', function () {
    it('renders the dashboard container', function () {
      renderDashboard();

      var container = document.querySelector('.dashboard-container');
      expect(container).not.toBeNull();
    });

    it('renders three stat cards', function () {
      renderDashboard();

      var statCards = document.querySelectorAll('.stat-card');
      expect(statCards).toHaveLength(3);
    });

    it('renders the stat cards row', function () {
      renderDashboard();

      var statRow = document.querySelector('.stat-cards-row');
      expect(statRow).not.toBeNull();
    });
  });

  // ---- Corrupted Storage ----
  describe('corrupted storage handling', function () {
    it('handles corrupted localStorage gracefully', function () {
      localStorage.setItem(STORAGE_KEY, 'not valid json');
      renderDashboard();

      expect(screen.getByText('No submissions yet.')).toBeDefined();

      var statCards = document.querySelectorAll('.stat-card');
      expect(within(statCards[0]).getByText('0')).toBeDefined();
    });

    it('handles non-array localStorage data gracefully', function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ corrupted: true }));
      renderDashboard();

      expect(screen.getByText('No submissions yet.')).toBeDefined();
    });
  });
});