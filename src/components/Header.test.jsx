import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';

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

describe('Header', function () {
  beforeEach(function () {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(function () {
    sessionStorage.clear();
  });

  function renderHeader(initialRoute) {
    var route = initialRoute || '/';
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Header />
      </MemoryRouter>
    );
  }

  // ---- Logo ----
  describe('logo', function () {
    it('renders the HireHub logo text', function () {
      renderHeader();

      expect(screen.getByText(/HireHub/)).toBeDefined();
    });

    it('logo links to the home page', function () {
      renderHeader();

      var logoLink = screen.getByLabelText('HireHub Home');
      expect(logoLink).toBeDefined();
      expect(logoLink.getAttribute('href')).toBe('/');
    });
  });

  // ---- Navigation Links ----
  describe('navigation links', function () {
    it('renders the Home navigation link', function () {
      renderHeader();

      var homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toBeDefined();
      expect(homeLink.getAttribute('href')).toBe('/');
    });

    it('renders the Apply navigation link', function () {
      renderHeader();

      var applyLink = screen.getByRole('link', { name: 'Apply' });
      expect(applyLink).toBeDefined();
      expect(applyLink.getAttribute('href')).toBe('/apply');
    });

    it('renders the Admin navigation link', function () {
      renderHeader();

      var adminLink = screen.getByRole('link', { name: 'Admin' });
      expect(adminLink).toBeDefined();
      expect(adminLink.getAttribute('href')).toBe('/admin');
    });

    it('highlights the Home link as active when on home route', function () {
      renderHeader('/');

      var homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink.className).toContain('active');
    });

    it('highlights the Apply link as active when on apply route', function () {
      renderHeader('/apply');

      var applyLink = screen.getByRole('link', { name: 'Apply' });
      expect(applyLink.className).toContain('active');
    });

    it('highlights the Admin link as active when on admin route', function () {
      renderHeader('/admin');

      var adminLink = screen.getByRole('link', { name: 'Admin' });
      expect(adminLink.className).toContain('active');
    });
  });

  // ---- Login Button (not authenticated) ----
  describe('when not authenticated', function () {
    it('renders the Login button', function () {
      renderHeader();

      var loginButton = screen.getByLabelText('Login');
      expect(loginButton).toBeDefined();
      expect(loginButton.textContent).toBe('Login');
    });

    it('Login button links to the admin page', function () {
      renderHeader();

      var loginButton = screen.getByLabelText('Login');
      expect(loginButton.getAttribute('href')).toBe('/admin');
    });

    it('does not render the Logout button', function () {
      renderHeader();

      var logoutButton = screen.queryByLabelText('Logout');
      expect(logoutButton).toBeNull();
    });
  });

  // ---- Logout Button (authenticated) ----
  describe('when authenticated', function () {
    beforeEach(function () {
      sessionStorage.setItem(SESSION_KEY, 'true');
    });

    it('renders the Logout button', function () {
      renderHeader();

      var logoutButton = screen.getByLabelText('Logout');
      expect(logoutButton).toBeDefined();
      expect(logoutButton.textContent).toBe('Logout');
    });

    it('does not render the Login button', function () {
      renderHeader();

      var loginButton = screen.queryByLabelText('Login');
      expect(loginButton).toBeNull();
    });

    it('clears session and navigates to home on logout click', async function () {
      var user = userEvent.setup();
      renderHeader();

      var logoutButton = screen.getByLabelText('Logout');
      await user.click(logoutButton);

      expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // ---- Header structure ----
  describe('structure', function () {
    it('renders a banner role header element', function () {
      renderHeader();

      var header = screen.getByRole('banner');
      expect(header).toBeDefined();
    });

    it('renders a navigation element with correct aria-label', function () {
      renderHeader();

      var nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toBeDefined();
    });
  });
});