import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubmissions, updateSubmission, deleteSubmission } from '../utils/storage';
import { logoutAdmin } from '../utils/session';
import { SubmissionTable } from './SubmissionTable';
import { EditModal } from './EditModal';

/**
 * Calculates summary statistics from the submissions array.
 *
 * @param {Array<Object>} submissions - The array of submission objects.
 * @returns {{ total: number, uniqueDepartments: number, latestSubmission: string }}
 *   An object containing total count, unique department count, and latest submission date.
 */
function calculateStats(submissions) {
  var total = submissions.length;

  var departments = new Set(
    submissions.map(function (s) {
      return s.department;
    })
  );
  var uniqueDepartments = departments.size;

  var latestSubmission = 'N/A';
  if (submissions.length > 0) {
    var latest = submissions.reduce(function (max, s) {
      if (!s.submittedAt) {
        return max;
      }
      if (!max) {
        return s.submittedAt;
      }
      return new Date(s.submittedAt) > new Date(max) ? s.submittedAt : max;
    }, null);

    if (latest) {
      try {
        var date = new Date(latest);
        if (!isNaN(date.getTime())) {
          latestSubmission = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          });
        }
      } catch (e) {
        latestSubmission = 'N/A';
      }
    }
  }

  return {
    total: total,
    uniqueDepartments: uniqueDepartments,
    latestSubmission: latestSubmission,
  };
}

/**
 * Protected admin dashboard component.
 *
 * Renders a dashboard header with title and Logout button, three summary
 * stat cards (Total Submissions, Unique Departments, Latest Submission),
 * and a SubmissionTable with all submissions from localStorage. Manages
 * edit state (selected submission, modal visibility) and delete state
 * (confirmation dialog). All data is refreshed from localStorage on each
 * CRUD operation.
 *
 * @returns {JSX.Element} The admin dashboard component.
 */
export function AdminDashboard() {
  const [submissions, setSubmissions] = useState(function () {
    return getSubmissions();
  });
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  var stats = calculateStats(submissions);

  var refreshSubmissions = useCallback(function () {
    setSubmissions(getSubmissions());
  }, []);

  function handleLogout() {
    logoutAdmin();
    navigate('/');
  }

  function handleEdit(submission) {
    setEditingSubmission(submission);
    setErrorMessage('');
    setSuccessMessage('');
  }

  function handleEditSave(updates) {
    var result = updateSubmission(editingSubmission.id, updates);

    if (result.status === 'error') {
      setErrorMessage(result.message || 'Failed to update submission.');
      setEditingSubmission(null);
      return;
    }

    setEditingSubmission(null);
    setErrorMessage('');
    setSuccessMessage('Submission updated successfully.');
    refreshSubmissions();

    setTimeout(function () {
      setSuccessMessage('');
    }, 3000);
  }

  function handleEditClose() {
    setEditingSubmission(null);
  }

  function handleDelete(submission) {
    var confirmed = window.confirm(
      'Are you sure you want to delete the submission from ' + submission.fullName + '?'
    );

    if (!confirmed) {
      return;
    }

    var result = deleteSubmission(submission.id);

    if (!result) {
      setErrorMessage('Failed to delete submission. It may have already been removed.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('Submission deleted successfully.');
    refreshSubmissions();

    setTimeout(function () {
      setSuccessMessage('');
    }, 3000);
  }

  return (
    <div className="main-content">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {successMessage && (
          <div className="banner banner-success" role="alert">
            ✅ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="banner banner-error" role="alert">
            ❌ {errorMessage}
          </div>
        )}

        <div className="stat-cards-row">
          <div className="stat-card">
            <div className="stat-card-value">{stats.total}</div>
            <div className="stat-card-label">Total Submissions</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">{stats.uniqueDepartments}</div>
            <div className="stat-card-label">Unique Departments</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value" style={{ fontSize: 'var(--font-size-lg)' }}>
              {stats.latestSubmission}
            </div>
            <div className="stat-card-label">Latest Submission</div>
          </div>
        </div>

        <SubmissionTable
          submissions={submissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {editingSubmission && (
          <EditModal
            submission={editingSubmission}
            onSave={handleEditSave}
            onClose={handleEditClose}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;