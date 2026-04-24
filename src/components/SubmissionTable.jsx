import PropTypes from 'prop-types';

/**
 * Maps a department name to its corresponding CSS badge class.
 *
 * @param {string} department - The department name.
 * @returns {string} The CSS class name for the department badge.
 */
function getDepartmentBadgeClass(department) {
  var normalized = String(department).trim().toLowerCase();
  switch (normalized) {
    case 'engineering':
      return 'badge badge-engineering';
    case 'marketing':
      return 'badge badge-marketing';
    case 'sales':
      return 'badge badge-sales';
    case 'human resources':
      return 'badge badge-hr';
    case 'finance':
      return 'badge badge-finance';
    case 'operations':
      return 'badge badge-operations';
    case 'design':
      return 'badge badge-design';
    case 'product':
      return 'badge badge-product';
    default:
      return 'badge badge-default';
  }
}

/**
 * Formats an ISO date string into a human-readable format.
 *
 * @param {string} isoString - The ISO 8601 date string.
 * @returns {string} A formatted date string (e.g., "Mar 4, 2026, 10:30 AM").
 */
function formatDate(isoString) {
  if (!isoString) {
    return '—';
  }
  try {
    var date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch (e) {
    return '—';
  }
}

/**
 * Submission data table component for the admin dashboard.
 *
 * Renders a responsive table displaying candidate submissions with columns
 * for row number, full name, email, mobile, department (with colored badge),
 * submitted date, and action buttons (Edit/Delete). Shows an empty state
 * message when no submissions exist. The table scrolls horizontally on mobile.
 *
 * @param {Object} props
 * @param {Array<Object>} props.submissions - Array of submission objects to display.
 * @param {Function} props.onEdit - Callback invoked with a submission object when Edit is clicked.
 * @param {Function} props.onDelete - Callback invoked with a submission object when Delete is clicked.
 * @returns {JSX.Element} The submission table component.
 */
export function SubmissionTable({ submissions, onEdit, onDelete }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="table-card">
        <div className="table-empty">
          No submissions yet.
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Department</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(function (submission, index) {
              return (
                <tr key={submission.id}>
                  <td>{index + 1}</td>
                  <td>{submission.fullName}</td>
                  <td>{submission.email}</td>
                  <td>{submission.mobile}</td>
                  <td>
                    <span className={getDepartmentBadgeClass(submission.department)}>
                      {submission.department}
                    </span>
                  </td>
                  <td>{formatDate(submission.submittedAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={function () {
                          onEdit(submission);
                        }}
                        aria-label={'Edit ' + submission.fullName}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={function () {
                          onDelete(submission);
                        }}
                        aria-label={'Delete ' + submission.fullName}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      submittedAt: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SubmissionTable;