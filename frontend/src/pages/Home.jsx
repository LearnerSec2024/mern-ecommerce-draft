import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="home-page" data-testid="home-page">
      <div className="hero-splash">
        <div className="hero-content">
          <p className="hero-pill">Fresh deals • Fast checkout • Mock payments</p>

          <h1>
            Shop smarter with colourful, test-ready ecommerce.
          </h1>

          <p className="hero-copy">
            Browse fresh groceries, everyday essentials and tech favourites in a MERN shop designed
            for real ecommerce flows and Playwright automation practice.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="button hero-primary">
              Browse products
            </Link>

            <Link to="/register" className="button hero-secondary">
              Create account
            </Link>
          </div>

          <div className="hero-highlights" aria-label="Store highlights">
            <span>🚚 Free shipping over $100</span>
            <span>🛒 Drag-to-cart practice</span>
            <span>🔐 Secure login flow</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Featured shopping categories">
          <div className="floating-card card-fruit">
            <span className="category-emoji">🥭</span>
            <strong>Fresh Picks</strong>
            <small>Fruit & vegetables</small>
          </div>

          <div className="floating-card card-tech">
            <span className="category-emoji">🎧</span>
            <strong>Tech Deals</strong>
            <small>Gadgets & audio</small>
          </div>

          <div className="floating-card card-fashion">
            <span className="category-emoji">👟</span>
            <strong>Style Drop</strong>
            <small>Shoes & fashion</small>
          </div>
        </div>
      </div>

      <div className="home-feature-grid">
        <article className="home-feature-card">
          <span>⚡</span>
          <h3>Fast customer journey</h3>
          <p>Register, login, add to cart, checkout and verify orders end-to-end.</p>
        </article>

        <article className="home-feature-card">
          <span>🎯</span>
          <h3>Automation friendly</h3>
          <p>Real UI patterns for Playwright: dropdowns, popups, iframes, hover and drag actions.</p>
        </article>

        <article className="home-feature-card">
          <span>📦</span>
          <h3>Seeded catalogue</h3>
          <p>Products are loaded from MongoDB so the app behaves like a real shop.</p>
        </article>
      </div>
    </section>
  );
};

export default Home;