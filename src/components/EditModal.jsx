import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { validateName, validateMobile, validateDepartment, ALLOWED_DEPARTMENTS } from '../utils/validators';

/**
 * Edit submission modal dialog component.
 *
 * Renders a centered modal overlay with a form pre-filled from the given
 * submission object. Full Name, Mobile, and Department are editable; Email
 * is read-only. Validates editable fields on blur and on save using
 * validators.js. Supports close via the X button, Cancel button, Escape key,
 * or clicking outside the modal card. Prevents background scroll when open.
 *
 * @param {Object} props
 * @param {Object} props.submission - The submission object to edit.
 * @param {Function} props.onSave - Callback invoked with the updated fields when Save is clicked.
 * @param {Function} props.onClose - Callback invoked when the modal is closed.
 * @returns {JSX.Element} The edit modal component.
 */
export function EditModal({ submission, onSave, onClose }) {
  const [formData, setFormData] = useState({
    fullName: submission.fullName || '',
    email: submission.email || '',
    mobile: submission.mobile || '',
    department: submission.department || '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    mobile: '',
    department: '',
  });

  const modalContentRef = useRef(null);

  // Prevent background scroll when modal is open
  useEffect(function () {
    var originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return function () {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Close on Escape key
  var handleKeyDown = useCallback(function (e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(function () {
    document.addEventListener('keydown', handleKeyDown);
    return function () {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  function handleOverlayClick(e) {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
      onClose();
    }
  }

  function handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    setFormData(function (prev) {
      return { ...prev, [name]: value };
    });

    if (errors[name]) {
      setErrors(function (prev) {
        return { ...prev, [name]: '' };
      });
    }
  }

  function validateField(name, value) {
    var error = '';
    switch (name) {
      case 'fullName':
        error = validateName(value);
        break;
      case 'mobile':
        error = validateMobile(value);
        break;
      case 'department':
        error = validateDepartment(value);
        break;
      default:
        break;
    }
    return error;
  }

  function handleBlur(e) {
    var name = e.target.name;
    var value = e.target.value;
    var error = validateField(name, value);
    setErrors(function (prev) {
      return { ...prev, [name]: error };
    });
  }

  function validateAllFields() {
    var fullNameError = validateField('fullName', formData.fullName);
    var mobileError = validateField('mobile', formData.mobile);
    var departmentError = validateField('department', formData.department);

    var newErrors = {
      fullName: fullNameError,
      mobile: mobileError,
      department: departmentError,
    };

    setErrors(newErrors);

    return !fullNameError && !mobileError && !departmentError;
  }

  function handleSave(e) {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    onSave({
      fullName: formData.fullName,
      mobile: formData.mobile,
      department: formData.department,
    });
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Edit Submission">
      <div className="modal-content" ref={modalContentRef}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Submission</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="edit-fullName" className="form-label form-label-required">
                Full Name
              </label>
              <input
                type="text"
                id="edit-fullName"
                name="fullName"
                className={'form-input' + (errors.fullName ? ' form-input-error' : '')}
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="name"
              />
              {errors.fullName && (
                <span className="form-error-text" role="alert">
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="edit-email"
                name="email"
                className="form-input"
                value={formData.email}
                readOnly
                disabled
                style={{ backgroundColor: 'var(--color-gray-100)', cursor: 'not-allowed' }}
              />
              <span className="form-error-text" style={{ color: 'var(--color-gray-400)' }}>
                Email cannot be changed.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="edit-mobile" className="form-label form-label-required">
                Mobile Number
              </label>
              <input
                type="tel"
                id="edit-mobile"
                name="mobile"
                className={'form-input' + (errors.mobile ? ' form-input-error' : '')}
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="tel"
              />
              {errors.mobile && (
                <span className="form-error-text" role="alert">
                  {errors.mobile}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-department" className="form-label form-label-required">
                Department of Interest
              </label>
              <select
                id="edit-department"
                name="department"
                className={'form-select' + (errors.department ? ' form-input-error' : '')}
                value={formData.department}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select a department</option>
                {ALLOWED_DEPARTMENTS.map(function (dept) {
                  return (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  );
                })}
              </select>
              {errors.department && (
                <span className="form-error-text" role="alert">
                  {errors.department}
                </span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    submittedAt: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditModal;