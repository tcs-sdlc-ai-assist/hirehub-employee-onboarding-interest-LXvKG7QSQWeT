import { Link } from 'react-router-dom';

/**
 * Landing page component for HireHub Onboarding Portal.
 *
 * Renders three sections:
 * 1. Hero section with welcome heading, subheading, and CTA button linking to /apply.
 * 2. "Why Join Us?" feature cards section with four cards in a responsive grid.
 * 3. Bottom CTA section with an "Apply Now" button linking to /apply.
 *
 * @returns {JSX.Element} The landing page component.
 */
export function LandingPage() {
  return (
    <div className="main-content">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Welcome to HireHub</h1>
          <p className="hero-subtitle">
            Join a team that values innovation, collaboration, and personal growth.
            Discover a workplace where your ideas matter and your career thrives.
          </p>
          <div className="hero-actions">
            <Link to="/apply" className="btn btn-hero-primary">
              Express Your Interest
            </Link>
            <a href="#why-join-us" className="btn btn-hero-secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="features-section" id="why-join-us">
        <h2 className="features-section-title">Why Join Us?</h2>
        <div className="features-grid">
          <div
            className="feature-card"
            style={{ borderTop: '4px solid var(--color-primary)' }}
          >
            <div className="feature-card-icon">🚀</div>
            <h3 className="feature-card-title">Innovation</h3>
            <p className="feature-card-description">
              Work on cutting-edge projects that push boundaries. We encourage creative
              thinking and provide the tools and freedom to bring bold ideas to life.
            </p>
          </div>

          <div
            className="feature-card"
            style={{ borderTop: '4px solid var(--color-success)' }}
          >
            <div className="feature-card-icon">📈</div>
            <h3 className="feature-card-title">Growth</h3>
            <p className="feature-card-description">
              Accelerate your career with mentorship programs, learning opportunities,
              and clear paths for advancement. Your growth is our priority.
            </p>
          </div>

          <div
            className="feature-card"
            style={{ borderTop: '4px solid var(--color-secondary)' }}
          >
            <div className="feature-card-icon">🤝</div>
            <h3 className="feature-card-title">Culture</h3>
            <p className="feature-card-description">
              Be part of a diverse, inclusive, and supportive community. We celebrate
              collaboration, respect, and the unique strengths each person brings.
            </p>
          </div>

          <div
            className="feature-card"
            style={{ borderTop: '4px solid var(--color-warning)' }}
          >
            <div className="feature-card-icon">🌍</div>
            <h3 className="feature-card-title">Impact</h3>
            <p className="feature-card-description">
              Make a real difference with meaningful work that reaches people around the
              world. Your contributions here create lasting, positive change.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="hero" style={{ padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
        <div className="hero-inner">
          <h2 className="hero-title" style={{ fontSize: 'var(--font-size-2xl)' }}>
            Ready to Start Your Journey?
          </h2>
          <p className="hero-subtitle">
            Take the first step toward an exciting career at HireHub. We would love to
            hear from you.
          </p>
          <div className="hero-actions">
            <Link to="/apply" className="btn btn-hero-primary">
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;