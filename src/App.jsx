import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { InterestForm } from './components/InterestForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './components/AdminDashboard';
import './App.css';

/**
 * Root application component.
 *
 * Renders the persistent Header component at the top of every page and
 * defines client-side routes using React Router v6:
 * - '/' renders the LandingPage
 * - '/apply' renders the InterestForm
 * - '/admin' renders the AdminDashboard wrapped in a ProtectedRoute
 *
 * @returns {JSX.Element} The root application component.
 */
export function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<InterestForm />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;