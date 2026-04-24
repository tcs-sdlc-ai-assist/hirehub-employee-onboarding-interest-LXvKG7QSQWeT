/**
 * localStorage CRUD utility for candidate submissions.
 *
 * All submissions are stored as a JSON array under the key 'hirehub_submissions'.
 * Corrupted data is handled gracefully by resetting to an empty array.
 *
 * @module storage
 */

const STORAGE_KEY = 'hirehub_submissions';

/**
 * Generates a UUID v4 string.
 * @returns {string} A UUID string.
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Reads and parses the submissions array from localStorage.
 * If the data is missing, returns an empty array.
 * If the data is corrupted (invalid JSON or not an array), resets to an empty array.
 *
 * @returns {Array<Object>} The array of submission objects.
 */
export function getSubmissions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data === null || data === undefined) {
      return [];
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, '[]');
      return [];
    }
    return parsed;
  } catch (e) {
    console.error('Corrupted localStorage data detected. Resetting submissions.', e);
    localStorage.setItem(STORAGE_KEY, '[]');
    return [];
  }
}

/**
 * Writes the submissions array to localStorage.
 *
 * @param {Array<Object>} submissions - The array of submission objects to persist.
 */
export function saveSubmissions(submissions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save submissions to localStorage.', e);
  }
}

/**
 * Checks whether a given email already exists in the submissions.
 *
 * @param {string} email - The email address to check.
 * @param {string} [excludeId] - An optional submission id to exclude from the check
 *   (useful when updating an existing submission).
 * @returns {boolean} True if a duplicate email exists, false otherwise.
 */
export function isEmailDuplicate(email, excludeId) {
  if (!email) {
    return false;
  }
  const submissions = getSubmissions();
  const normalizedEmail = String(email).trim().toLowerCase();
  return submissions.some(function (s) {
    if (excludeId && s.id === excludeId) {
      return false;
    }
    return String(s.email).trim().toLowerCase() === normalizedEmail;
  });
}

/**
 * Adds a new submission to localStorage.
 * Generates a UUID and timestamp, checks for duplicate email,
 * and appends the submission to the array.
 *
 * @param {Object} submission - The submission data.
 * @param {string} submission.fullName - The candidate's full name.
 * @param {string} submission.email - The candidate's email address.
 * @param {string} submission.mobile - The candidate's mobile number.
 * @param {string} submission.department - The candidate's department of interest.
 * @returns {{ status: string, submission?: Object, message?: string }}
 *   An object with status 'success' and the new submission, or status 'error' with a message.
 */
export function addSubmission(submission) {
  if (isEmailDuplicate(submission.email)) {
    return { status: 'error', message: 'Duplicate email' };
  }

  const submissions = getSubmissions();
  const newSubmission = {
    id: generateUUID(),
    fullName: String(submission.fullName).trim(),
    email: String(submission.email).trim(),
    mobile: String(submission.mobile).trim(),
    department: String(submission.department).trim(),
    submittedAt: new Date().toISOString(),
  };

  submissions.push(newSubmission);
  saveSubmissions(submissions);

  return { status: 'success', submission: newSubmission };
}

/**
 * Updates an existing submission by id, merging the provided updates.
 * If the updates include an email change, checks for duplicate email
 * (excluding the current submission).
 *
 * @param {string} id - The id of the submission to update.
 * @param {Object} updates - An object containing the fields to update.
 * @returns {{ status: string, submission?: Object, message?: string }}
 *   An object with status 'success' and the updated submission, or status 'error' with a message.
 */
export function updateSubmission(id, updates) {
  const submissions = getSubmissions();
  const index = submissions.findIndex(function (s) {
    return s.id === id;
  });

  if (index === -1) {
    return { status: 'error', message: 'Submission not found' };
  }

  if (updates.email && String(updates.email).trim().toLowerCase() !== String(submissions[index].email).trim().toLowerCase()) {
    if (isEmailDuplicate(updates.email, id)) {
      return { status: 'error', message: 'Duplicate email' };
    }
  }

  const updatedSubmission = { ...submissions[index] };
  if (updates.fullName !== undefined) {
    updatedSubmission.fullName = String(updates.fullName).trim();
  }
  if (updates.email !== undefined) {
    updatedSubmission.email = String(updates.email).trim();
  }
  if (updates.mobile !== undefined) {
    updatedSubmission.mobile = String(updates.mobile).trim();
  }
  if (updates.department !== undefined) {
    updatedSubmission.department = String(updates.department).trim();
  }

  submissions[index] = updatedSubmission;
  saveSubmissions(submissions);

  return { status: 'success', submission: updatedSubmission };
}

/**
 * Deletes a submission by id.
 *
 * @param {string} id - The id of the submission to delete.
 * @returns {boolean} True if the submission was found and deleted, false otherwise.
 */
export function deleteSubmission(id) {
  const submissions = getSubmissions();
  const index = submissions.findIndex(function (s) {
    return s.id === id;
  });

  if (index === -1) {
    return false;
  }

  submissions.splice(index, 1);
  saveSubmissions(submissions);
  return true;
}