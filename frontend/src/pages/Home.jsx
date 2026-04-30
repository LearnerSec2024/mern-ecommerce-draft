import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';

const HOME_PAGE_SIZE = 6;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pageNumber, setPageNumber] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchHomeProducts = async () => {
      setLoadingProducts(true);
      setProductError('');

      try {
        const { data } = await api.get('/products', {
          params: {
            category: selectedCategory,
            sort: 'name_asc',
            page: pageNumber,
            limit: HOME_PAGE_SIZE
          },
          signal: controller.signal
        });

        setProducts(data.products || []);
        setCategories(data.categories || []);
        setPages(data.pages || 1);
        setTotalProducts(data.total || 0);
      } catch (error) {
        if (error.name !== 'CanceledError') {
          setProductError(error.response?.data?.message || 'Could not load home products');
        }
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchHomeProducts();

    return () => controller.abort();
  }, [selectedCategory, pageNumber]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPageNumber(1);
  };

  const goToPreviousPage = () => {
    setPageNumber((currentPage) => Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    setPageNumber((currentPage) => Math.min(pages, currentPage + 1));
  };

  return (
    <section className="home-page" data-testid="home-page">
      <div className="hero-splash">
        <div className="hero-content">
          <p className="hero-pill">Fresh deals • Fast checkout • Mock payments</p>

          <h1>Shop smarter with colourful, test-ready ecommerce.</h1>

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
          <p>
            Real UI patterns for Playwright: dropdowns, popups, iframes, hover and drag actions.
          </p>
        </article>

        <article className="home-feature-card">
          <span>📦</span>
          <h3>Seeded catalogue</h3>
          <p>Products are loaded from MongoDB so the app behaves like a real shop.</p>
        </article>
      </div>

      <section className="home-catalogue-section" data-testid="home-catalogue-section">
        <div className="home-catalogue-header">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2>Explore products without leaving the home page</h2>
            <p className="muted">
              Showing {products.length} of {totalProducts} products
              {selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}.
            </p>
          </div>

          <Link to="/products" className="button ghost">
            Open full catalogue
          </Link>
        </div>

        <div className="home-category-tabs" aria-label="Home product categories">
          <button
            type="button"
            className={selectedCategory === 'all' ? 'category-chip active' : 'category-chip'}
            onClick={() => handleCategorySelect('all')}
            data-testid="home-category-all"
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? 'category-chip active' : 'category-chip'}
              onClick={() => handleCategorySelect(category)}
              data-testid="home-category-chip"
            >
              {category}
            </button>
          ))}
        </div>

        {loadingProducts && <p>Loading home products...</p>}

        {productError && <p className="error">{productError}</p>}

        {!loadingProducts && !productError && products.length === 0 && (
          <div className="card empty-state">
            <p>No products found for this category.</p>
          </div>
        )}

        {!loadingProducts && !productError && products.length > 0 && (
          <>
            <div className="grid product-grid home-product-grid" data-testid="home-product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="home-pagination" aria-label="Home product pagination">
              <button
                type="button"
                className="button ghost"
                onClick={goToPreviousPage}
                disabled={pageNumber <= 1}
                data-testid="home-products-previous"
              >
                &lt; Previous
              </button>

              <span data-testid="home-products-page-indicator">
                Page {pageNumber} of {pages}
              </span>

              <button
                type="button"
                className="button ghost"
                onClick={goToNextPage}
                disabled={pageNumber >= pages}
                data-testid="home-products-next"
              >
                Next &gt;
              </button>
            </div>
          </>
        )}
      </section>
    </section>
  );
};

export default Home;
