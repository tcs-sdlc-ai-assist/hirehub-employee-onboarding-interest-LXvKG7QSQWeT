import { useState } from 'react';
import PropTypes from 'prop-types';
import { loginAdmin } from '../utils/session';

/**
 * Admin login form component.
 *
 * Renders a centered card with "Admin Login" title, username and password
 * fields, and a submit button. On submit, calls loginAdmin() from the
 * session utility. On success, triggers the onLoginSuccess callback to
 * update parent state. On failure, displays a red error message below
 * the form.
 *
 * @param {Object} props
 * @param {Function} props.onLoginSuccess - Callback invoked when login succeeds.
 * @returns {JSX.Element} The admin login form component.
 */
export function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    var result = loginAdmin(username, password);

    if (result.success) {
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess();
      }
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">
          Enter your credentials to access the admin dashboard.
        </p>

        {error && (
          <div className="banner banner-error" role="alert">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label form-label-required">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={function (e) {
                setUsername(e.target.value);
              }}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label form-label-required">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={function (e) {
                setPassword(e.target.value);
              }}
              autoComplete="current-password"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AdminLogin.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default AdminLogin;