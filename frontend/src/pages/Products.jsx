import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: 'all', sort: 'newest' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/products', {
          params: filters,
          signal: controller.signal
        });
        setProducts(data.products);
        setCategories(data.categories);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.response?.data?.message || 'Could not load products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [filters]);

  const handleChange = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1>Products</h1>
        </div>
      </div>

      <div className="filters card">
        <input
          name="search"
          placeholder="Search products"
          value={filters.search}
          onChange={handleChange}
        />
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="name_asc">Name A-Z</option>
        </select>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      <div className="grid product-grid">
        {products.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    </section>
  );
};

export default Products;
