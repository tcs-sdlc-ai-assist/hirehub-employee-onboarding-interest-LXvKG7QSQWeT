import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { validateName, validateEmail, validateMobile, validateDepartment, ALLOWED_DEPARTMENTS } from '../utils/validators';
import { addSubmission, isEmailDuplicate } from '../utils/storage';

/**
 * Interest form page component for candidate submissions.
 *
 * Renders a controlled form with fields for Full Name, Email, Mobile Number,
 * and Department of Interest. Validates fields on blur and on submit using
 * validators.js. Checks for duplicate email via isEmailDuplicate(). On
 * successful submission, clears the form and shows a green success banner
 * that auto-dismisses after 4 seconds.
 *
 * @returns {JSX.Element} The interest form page component.
 */
export function InterestForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const successTimerRef = useRef(null);

  const clearSuccessTimer = useCallback(function () {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  }, []);

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
      case 'email':
        error = validateEmail(value);
        if (!error && isEmailDuplicate(value)) {
          error = 'This email has already been submitted';
        }
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
    var emailError = validateField('email', formData.email);
    var mobileError = validateField('mobile', formData.mobile);
    var departmentError = validateField('department', formData.department);

    var newErrors = {
      fullName: fullNameError,
      email: emailError,
      mobile: mobileError,
      department: departmentError,
    };

    setErrors(newErrors);

    return !fullNameError && !emailError && !mobileError && !departmentError;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage('');
    setSubmitError('');
    clearSuccessTimer();

    if (!validateAllFields()) {
      return;
    }

    var result = addSubmission({
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      department: formData.department,
    });

    if (result.status === 'error') {
      if (result.message === 'Duplicate email') {
        setErrors(function (prev) {
          return { ...prev, email: 'This email has already been submitted' };
        });
      } else {
        setSubmitError(result.message || 'An error occurred. Please try again.');
      }
      return;
    }

    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      department: '',
    });

    setErrors({
      fullName: '',
      email: '',
      mobile: '',
      department: '',
    });

    setSuccessMessage('Your interest has been submitted successfully! We will be in touch soon.');

    successTimerRef.current = setTimeout(function () {
      setSuccessMessage('');
      successTimerRef.current = null;
    }, 4000);
  }

  return (
    <div className="main-content">
      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">Express Your Interest</h1>
          <p className="form-subtitle">
            Fill out the form below to let us know you are interested in joining HireHub.
          </p>

          {successMessage && (
            <div className="banner banner-success" role="alert">
              ✅ {successMessage}
            </div>
          )}

          {submitError && (
            <div className="banner banner-error" role="alert">
              ❌ {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="fullName" className="form-label form-label-required">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className={'form-input' + (errors.fullName ? ' form-input-error' : '')}
                placeholder="Enter your full name"
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
              <label htmlFor="email" className="form-label form-label-required">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={'form-input' + (errors.email ? ' form-input-error' : '')}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
              />
              {errors.email && (
                <span className="form-error-text" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="mobile" className="form-label form-label-required">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                className={'form-input' + (errors.mobile ? ' form-input-error' : '')}
                placeholder="Enter your 10-digit mobile number"
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
              <label htmlFor="department" className="form-label form-label-required">
                Department of Interest
              </label>
              <select
                id="department"
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

            <div className="form-actions">
              <Link to="/" className="btn btn-secondary">
                Back to Home
              </Link>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InterestForm;