import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { isAdminAuthenticated } from '../utils/session';
import { AdminLogin } from './AdminLogin';

/**
 * Protected route wrapper for admin authentication.
 *
 * Checks admin authentication state via isAdminAuthenticated() from the
 * session utility. If authenticated, renders the children (e.g., AdminDashboard).
 * If not authenticated, renders the AdminLogin component with an onLoginSuccess
 * callback that updates local auth state to trigger a re-render and show the
 * protected content.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected content to render when authenticated.
 * @returns {JSX.Element} Either the children or the AdminLogin component.
 */
export function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(function () {
    return isAdminAuthenticated();
  });

  var handleLoginSuccess = useCallback(function () {
    setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;