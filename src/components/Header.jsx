import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { isAdminAuthenticated, logoutAdmin } from '../utils/session';

/**
 * Persistent sticky navigation header component.
 *
 * Renders the HireHub logo, navigation links (Home, Apply, Admin) with
 * active state highlighting, and a dynamic Login/Logout button based on
 * the admin authentication state stored in sessionStorage.
 *
 * @returns {JSX.Element} The header component.
 */
export function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkAuth = useCallback(function () {
    setIsAdmin(isAdminAuthenticated());
  }, []);

  useEffect(function () {
    checkAuth();

    function handleStorageChange(e) {
      if (e.key === 'hirehub_admin_auth' || e.key === null) {
        checkAuth();
      }
    }

    window.addEventListener('storage', handleStorageChange);

    return function () {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth]);

  function handleLogout() {
    logoutAdmin();
    setIsAdmin(false);
    navigate('/');
  }

  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <Link to="/" className="header-logo" aria-label="HireHub Home">
          🏢 HireHub
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={function ({ isActive }) {
              return 'header-nav-link' + (isActive ? ' active' : '');
            }}
          >
            Home
          </NavLink>
          <NavLink
            to="/apply"
            className={function ({ isActive }) {
              return 'header-nav-link' + (isActive ? ' active' : '');
            }}
          >
            Apply
          </NavLink>
          <NavLink
            to="/admin"
            className={function ({ isActive }) {
              return 'header-nav-link' + (isActive ? ' active' : '');
            }}
          >
            Admin
          </NavLink>
        </nav>

        <div>
          {isAdmin ? (
            <button
              type="button"
              className="header-btn header-btn-logout"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/admin"
              className="header-btn header-btn-login"
              aria-label="Login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;