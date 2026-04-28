import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setMessage('');
    setError('');
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    try {
      await addToCart(product._id, quantity);
      setMessage('Added to cart');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add item to cart');
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error && !product) return <p className="error">{error}</p>;

  return (
    <section>
      <Link to="/products">← Back to products</Link>
      <div className="details-layout card">
        <img className="details-image" src={product.image} alt={product.name} />
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="muted">Brand: {product.brand}</p>
          <p>{product.description}</p>
          <h2>${product.price.toFixed(2)}</h2>
          <p className={product.stock > 0 ? 'status ok' : 'status danger'}>
            {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </p>
          <label>
            Quantity
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </label>
          <button className="button" disabled={product.stock === 0} onClick={handleAddToCart}>
            Add to cart
          </button>
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
