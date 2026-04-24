# HireHub Onboarding Portal

A modern, client-side onboarding portal built with React 18+, Vite, and React Router v6. Candidates can express their interest in joining HireHub by submitting a form, while admins can manage submissions through a protected dashboard.

## Tech Stack

- **React 18+** — Component-based UI library
- **Vite 5** — Fast development server and build tool
- **React Router v6** — Client-side routing with `BrowserRouter`
- **Plain CSS** — Custom properties (CSS variables), responsive design, no external CSS frameworks
- **PropTypes** — Runtime prop type checking
- **Vitest** — Unit and component testing framework
- **React Testing Library** — Component testing utilities

## Features

### Landing Page
- Hero section with welcome heading, subheading, and call-to-action buttons
- "Why Join Us?" feature cards section (Innovation, Growth, Culture, Impact) in a responsive grid
- Bottom call-to-action section with "Apply Now" button
- Smooth scroll "Learn More" anchor link

### Interest Form
- Controlled form with fields for Full Name, Email, Mobile Number, and Department of Interest
- Client-side validation on blur and on submit
  - Full Name: required, letters and spaces only
  - Email: required, valid email format
  - Mobile Number: required, exactly 10 digits
  - Department of Interest: required, must be one of 8 allowed departments
- Duplicate email prevention (case-insensitive)
- Inline error messages with `role="alert"` for accessibility
- Success banner with auto-dismiss after 4 seconds
- Form fields clear automatically after successful submission

### Admin Login
- Hardcoded demo credentials (see [Admin Credentials](#admin-credentials))
- Session-based authentication using `sessionStorage`
- Error message display for invalid credentials

### Admin Dashboard
- Protected route requiring admin authentication
- Summary stat cards: Total Submissions, Unique Departments, Latest Submission
- Submissions table with columns for row number, Full Name, Email, Mobile, Department (colored badge), Submitted Date, and Actions
- **Edit** functionality via modal dialog with validation
- **Delete** functionality with browser confirmation dialog
- Success and error banners for CRUD operations
- Empty state message when no submissions exist
- Logout button that clears session and navigates to home

### Responsive Design
- Mobile-friendly layout with responsive breakpoints at 768px
- Stacked feature cards grid on mobile
- Horizontally scrollable submission table on mobile
- Adaptive header navigation with reduced padding on small screens

### Data Persistence
- `localStorage` for persistent candidate submission data (`hirehub_submissions`)
- `sessionStorage` for admin authentication state (`hirehub_admin_auth`)
- Graceful handling of corrupted `localStorage` data with automatic reset
- UUID v4 generation for unique submission identifiers
- ISO 8601 timestamps for submission dates

### Navigation
- Sticky header with HireHub logo and navigation links (Home, Apply, Admin)
- Active state highlighting using React Router `NavLink`
- Dynamic Login/Logout button based on authentication state

## Admin Credentials

| Username | Password |
|----------|----------|
| `admin`  | `admin`  |

> These credentials are hardcoded for demo purposes only.

## Folder Structure

```
hirehub-onboarding-portal/
├── index.html
├── package.json
├── vite.config.js
├── vitest.config.js
├── vercel.json
├── .env.example
├── .gitignore
├── CHANGELOG.md
├── README.md
└── src/
    ├── main.jsx                        # Application entry point
    ├── App.jsx                         # Root component with routing
    ├── App.css                         # Global styles and CSS custom properties
    ├── components/
    │   ├── Header.jsx                  # Sticky navigation header
    │   ├── Header.test.jsx             # Header component tests
    │   ├── LandingPage.jsx             # Landing page with hero and feature cards
    │   ├── InterestForm.jsx            # Candidate interest form
    │   ├── InterestForm.test.jsx       # Interest form component tests
    │   ├── AdminLogin.jsx              # Admin login form
    │   ├── AdminDashboard.jsx          # Admin dashboard with CRUD operations
    │   ├── AdminDashboard.test.jsx     # Admin dashboard component tests
    │   ├── ProtectedRoute.jsx          # Auth guard wrapper component
    │   ├── SubmissionTable.jsx         # Submissions data table
    │   └── EditModal.jsx               # Edit submission modal dialog
    └── utils/
        ├── validators.js               # Form validation functions
        ├── validators.test.js          # Validator unit tests
        ├── storage.js                  # localStorage CRUD utilities
        ├── storage.test.js             # Storage utility unit tests
        ├── session.js                  # sessionStorage auth utilities
        └── session.test.js             # Session utility unit tests
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
git clone <repository-url>
cd hirehub-onboarding-portal
npm install
```

### Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000) and open automatically in your default browser.

### Production Build

```bash
npm run build
```

The optimized production build will be output to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for verification before deployment.

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

Tests are written with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). The test suite covers:

- **Validator functions** — `validateName`, `validateEmail`, `validateMobile`, `validateDepartment`
- **Session utilities** — `isAdminAuthenticated`, `loginAdmin`, `logoutAdmin`
- **Storage utilities** — `getSubmissions`, `saveSubmissions`, `addSubmission`, `updateSubmission`, `deleteSubmission`, `isEmailDuplicate`
- **Components** — Header, InterestForm, AdminDashboard
- **Edge cases** — Corrupted `localStorage` handling and recovery

## Deployment

### Vercel

This project includes a `vercel.json` configuration file with SPA rewrites for client-side routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

To deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in [Vercel](https://vercel.com/)
3. Vercel will auto-detect Vite and configure the build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy

Alternatively, deploy via the Vercel CLI:

```bash
npm install -g vercel
vercel
```

### Other Platforms

Since this is a static single-page application, it can be deployed to any static hosting provider (Netlify, GitHub Pages, Cloudflare Pages, etc.). Ensure your hosting provider is configured to serve `index.html` for all routes to support client-side routing.

## Environment Variables

This is a client-side-only application. No environment variables are required to run it.

If you extend this project with API integrations, add Vite-compatible environment variables using the `VITE_` prefix in a `.env` file:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Access them in code via `import.meta.env.VITE_API_BASE_URL`.

See `.env.example` for reference.

## License

Private