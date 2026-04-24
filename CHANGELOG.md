# Changelog

All notable changes to the HireHub Onboarding Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

#### Landing Page
- Hero section with welcome heading, subheading, and call-to-action button linking to the interest form
- "Why Join Us?" feature cards section with four cards (Innovation, Growth, Culture, Impact) in a responsive grid layout
- Bottom call-to-action section with "Apply Now" button linking to the interest form
- Smooth scroll "Learn More" anchor link to the feature cards section

#### Interest Form
- Controlled form with fields for Full Name, Email, Mobile Number, and Department of Interest
- Client-side validation on blur and on submit for all fields
  - Full Name: required, letters and spaces only
  - Email: required, valid email format
  - Mobile Number: required, exactly 10 digits
  - Department of Interest: required, must be one of the allowed departments
- Duplicate email prevention with case-insensitive comparison
- Inline error messages with `role="alert"` for accessibility
- Success banner with auto-dismiss after 4 seconds on successful submission
- Form fields clear automatically after successful submission
- "Back to Home" navigation link
- Eight department options: Engineering, Marketing, Sales, Human Resources, Finance, Operations, Design, Product

#### Admin Login
- Hardcoded credentials for demo purposes (username: `admin`, password: `admin`)
- Login form with username and password fields
- Error message display for invalid credentials or empty fields
- Session-based authentication using sessionStorage

#### Admin Dashboard
- Protected route requiring admin authentication
- Summary stat cards displaying Total Submissions, Unique Departments, and Latest Submission date
- Submissions table with columns for row number, Full Name, Email, Mobile, Department (with colored badge), Submitted Date, and Actions
- Edit functionality via modal dialog with pre-filled form fields
  - Full Name, Mobile Number, and Department are editable
  - Email is displayed as read-only
  - Validation on editable fields before saving
  - Modal closes via Cancel button, X button, Escape key, or clicking outside
- Delete functionality with browser confirmation dialog
- Success and error banners with `role="alert"` for CRUD operations
- Empty state message when no submissions exist
- Logout button that clears session and navigates to home

#### Responsive Design
- Mobile-friendly layout with responsive breakpoints at 768px
- Stacked feature cards grid on mobile
- Collapsible form actions and modal footer on small screens
- Horizontally scrollable submission table on mobile
- Adaptive header navigation with reduced padding on small screens

#### Data Persistence
- localStorage used for persistent candidate submission data under the key `hirehub_submissions`
- sessionStorage used for admin authentication state under the key `hirehub_admin_auth`
- Graceful handling of corrupted localStorage data with automatic reset to empty array
- UUID v4 generation for unique submission identifiers
- ISO 8601 timestamps for submission dates

#### Navigation
- Sticky header with HireHub logo, navigation links (Home, Apply, Admin), and dynamic Login/Logout button
- Active state highlighting on navigation links using React Router NavLink
- Login button links to admin page when not authenticated
- Logout button clears session and redirects to home when authenticated

#### Deployment
- Vercel deployment configuration with SPA rewrites in `vercel.json`
- Vite build configuration with React plugin
- Development server configured on port 3000 with auto-open

#### Testing
- Unit tests for all validator functions (validateName, validateEmail, validateMobile, validateDepartment)
- Unit tests for session utilities (isAdminAuthenticated, loginAdmin, logoutAdmin)
- Unit tests for storage utilities (getSubmissions, saveSubmissions, addSubmission, updateSubmission, deleteSubmission, isEmailDuplicate)
- Component tests for Header, InterestForm, and AdminDashboard
- Tests for corrupted localStorage handling and recovery
- Vitest configured with jsdom environment and React Testing Library