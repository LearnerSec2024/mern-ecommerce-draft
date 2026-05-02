import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const PRODUCTS_PER_PAGE = 8;
const MAX_PRICE = 10000;

const Products = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const loadMoreRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sort: 'newest'
  });

  const [searchText, setSearchText] = useState('');
  const [priceMax, setPriceMax] = useState(MAX_PRICE);

  const [pageNumber, setPageNumber] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [showDelayedDeal, setShowDelayedDeal] = useState(false);

  const [dropActive, setDropActive] = useState(false);
  const [dropMessage, setDropMessage] = useState('');
  const [wishlistMessage, setWishlistMessage] = useState('');

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mern-shop-wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const isCategoryPaginationMode = filters.category !== 'all';
  const hasMoreProducts = pageNumber < pages;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDelayedDeal(true);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setError('');

      if (pageNumber === 1 || isCategoryPaginationMode) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const { data } = await api.get('/products', {
          params: {
            ...filters,
            page: pageNumber,
            limit: PRODUCTS_PER_PAGE
          },
          signal: controller.signal
        });

        setProducts((currentProducts) => {
          if (pageNumber === 1 || isCategoryPaginationMode) {
            return data.products || [];
          }

          const existingIds = new Set(currentProducts.map((product) => product._id));

          const newProducts = (data.products || []).filter(
            (product) => !existingIds.has(product._id)
          );

          return [...currentProducts, ...newProducts];
        });

        setCategories(data.categories || []);
        setPages(data.pages || 1);
        setTotalProducts(data.total || 0);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.response?.data?.message || 'Could not load products');
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [filters, pageNumber, isCategoryPaginationMode]);

  useEffect(() => {
    if (isCategoryPaginationMode) {
      return undefined;
    }

    const node = loadMoreRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMoreProducts && !loading && !loadingMore) {
          setPageNumber((currentPage) => currentPage + 1);
        }
      },
      {
        rootMargin: '180px'
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasMoreProducts, loading, loadingMore, isCategoryPaginationMode]);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => Number(product.price) <= Number(priceMax));
  }, [products, priceMax]);

  const applyFilters = (nextFilters) => {
    setProducts([]);
    setPageNumber(1);
    setFilters(nextFilters);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    applyFilters({
      ...filters,
      search: searchText.trim()
    });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    applyFilters({
      ...filters,
      [name]: value
    });
  };

  const goToPreviousPage = () => {
    setPageNumber((currentPage) => Math.max(1, currentPage - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    setPageNumber((currentPage) => Math.min(pages, currentPage + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlistToggle = (product) => {
    setWishlist((currentWishlist) => {
      const alreadyExists = currentWishlist.includes(product._id);

      const nextWishlist = alreadyExists
        ? currentWishlist.filter((id) => id !== product._id)
        : [...currentWishlist, product._id];

      localStorage.setItem('mern-shop-wishlist', JSON.stringify(nextWishlist));

      setWishlistMessage(
        alreadyExists
          ? `${product.name} removed from wishlist`
          : `${product.name} added to wishlist`
      );

      return nextWishlist;
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDropActive(true);
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = () => {
    setDropActive(false);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setDropActive(false);
    setDropMessage('');

    const productId = event.dataTransfer.getData('application/x-product-id');

    if (!productId) {
      setDropMessage('No product was detected. Try dragging a product card again.');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/products' } });
      return;
    }

    try {
      await addToCart(productId, 1);
      setDropMessage('Product added to cart from drag and drop.');
    } catch (err) {
      setDropMessage(err.response?.data?.message || 'Could not add dragged product to cart.');
    }
  };

  return (
    <section className="stack" data-testid="products-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1>Products</h1>
          <p className="muted">
            Search, filter, drag products to cart and practise advanced Playwright interactions.
          </p>
        </div>

        <div
          className={
            dropActive
              ? 'cart-drop-zone sticky-cart-drop-zone active'
              : 'cart-drop-zone sticky-cart-drop-zone'
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="cart-drop-zone"
        >
          Drag product here to add to cart
        </div>
      </div>

      {showDelayedDeal && (
        <div className="card delayed-banner" data-testid="delayed-deal-banner">
          <strong>Today only:</strong> Free shipping on orders over $100.
        </div>
      )}

      {dropMessage && (
        <p className="success" data-testid="drag-cart-message">
          {dropMessage}
        </p>
      )}

      {wishlistMessage && (
        <p className="success" data-testid="wishlist-toast">
          {wishlistMessage}
        </p>
      )}

      <form className="filters enhanced-filters" onSubmit={handleSearchSubmit}>
        <label htmlFor="product-search">
          Search products
          <input
            id="product-search"
            name="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Press Enter to search"
            data-testid="product-search-input"
          />
        </label>

        <label htmlFor="category-filter">
          Category
          <select
            id="category-filter"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            data-testid="category-filter"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="sort-filter">
          Sort
          <select
            id="sort-filter"
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            data-testid="sort-filter"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name_asc">Name A-Z</option>
          </select>
        </label>

        <label htmlFor="price-range">
          Max price: ${Number(priceMax).toFixed(0)}
          <input
            id="price-range"
            type="range"
            min="0"
            max={MAX_PRICE}
            step="5"
            value={priceMax}
            onChange={(event) => setPriceMax(event.target.value)}
            data-testid="price-range-slider"
          />
        </label>

        <button className="button" type="submit" data-testid="product-search-button">
          Search
        </button>
      </form>

      {filters.search && (
        <p className="muted" data-testid="active-search-term">
          Active search: {filters.search}
        </p>
      )}

      <p className="muted" data-testid="loaded-product-count">
        {isCategoryPaginationMode ? (
          <>
            Showing {visibleProducts.length} products on page {pageNumber} of {pages} (
            {totalProducts} total in {filters.category})
          </>
        ) : (
          <>
            Loaded {products.length} of {totalProducts} products
          </>
        )}
      </p>

      {loading && <p>Loading products...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && visibleProducts.length === 0 && (
        <div className="card empty-state">
          <p>No products found.</p>
        </div>
      )}

      {!loading && !error && visibleProducts.length > 0 && (
        <>
          <div className="grid product-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                wishlisted={wishlist.includes(product._id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>

          {isCategoryPaginationMode ? (
            <div className="products-pagination" aria-label="Category product pagination">
              <button
                type="button"
                className="button ghost"
                onClick={goToPreviousPage}
                disabled={pageNumber <= 1 || loading}
                data-testid="products-previous-page"
              >
                &lt; Previous
              </button>

              <span data-testid="products-page-indicator">
                Page {pageNumber} of {pages}
              </span>

              <button
                type="button"
                className="button ghost"
                onClick={goToNextPage}
                disabled={pageNumber >= pages || loading}
                data-testid="products-next-page"
              >
                Next &gt;
              </button>
            </div>
          ) : (
            <div
              ref={loadMoreRef}
              className="infinite-scroll-sentinel"
              data-testid="infinite-scroll-sentinel"
            >
              {loadingMore && <span>Loading more products...</span>}
              {!loadingMore && hasMoreProducts && <span>Scroll to load more products</span>}
              {!loadingMore && !hasMoreProducts && products.length > 0 && (
                <span>All products loaded</span>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Products;
