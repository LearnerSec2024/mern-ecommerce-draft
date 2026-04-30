import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const categoryVisuals = {
  'Fruits & Vegetables': { emoji: '🥭', className: 'visual-fruit' },
  Electronics: { emoji: '🎧', className: 'visual-tech' },
  Clothing: { emoji: '👟', className: 'visual-fashion' },
  'Home & Kitchen': { emoji: '🏠', className: 'visual-home' },
  'Beauty & Personal Care': { emoji: '✨', className: 'visual-beauty' },
  'Sports & Outdoors': { emoji: '🏕️', className: 'visual-sports' },
  'Books & Stationery': { emoji: '📚', className: 'visual-books' },
  'Toys & Games': { emoji: '🧩', className: 'visual-toys' }
};

const ProductCard = ({ product, wishlisted = false, onWishlistToggle }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [imageError, setImageError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [quickAddMessage, setQuickAddMessage] = useState('');

  const visual = categoryVisuals[product.category] || {
    emoji: '🛒',
    className: 'visual-default'
  };

  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/x-product-id', product._id);
    event.dataTransfer.setData('text/plain', product.name);
  };

  const handleQuickAdd = async () => {
    setQuickAddMessage('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/products' } });
      return;
    }

    try {
      setAdding(true);
      await addToCart(product._id, 1);
      setQuickAddMessage('Added to cart');
    } catch (error) {
      setQuickAddMessage(error.response?.data?.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <article
      id={`product-${product._id}`}
      className="card product-card interactive-product-card"
      draggable
      onDragStart={handleDragStart}
      data-testid="product-card"
      data-product-id={product._id}
      data-category={product.category}
      data-price={product.price}
    >
      <div className="product-image-wrap">
        <Link
          to={`/products/${product._id}`}
          className="product-image-link"
          aria-label={`Open ${product.name} details`}
          data-testid="product-image-link"
        >
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              draggable="false"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`product-image-fallback ${visual.className}`}>
              <span>{visual.emoji}</span>
              <strong>{product.name}</strong>
              <small>{product.category}</small>
            </div>
          )}
        </Link>

        <button
          className="wishlist-button"
          type="button"
          aria-label={`${wishlisted ? 'Remove' : 'Add'} ${product.name} to wishlist`}
          data-testid="wishlist-button"
          onClick={() => onWishlistToggle?.(product)}
        >
          {wishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
        </button>

        <span className="hover-tooltip" data-testid="product-hover-tooltip">
          Drag me to the cart or add me to wishlist
        </span>
      </div>

      <div className="card-body">
        <p className="eyebrow">{product.category}</p>
        <h3 data-testid="product-card-title">{product.name}</h3>
        <p className="muted">{product.brand}</p>
        <strong>${product.price.toFixed(2)}</strong>

        <span className={product.stock > 0 ? 'status ok' : 'status danger'}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>

        <button
          className="button product-add-button"
          type="button"
          disabled={adding || product.stock <= 0}
          onClick={handleQuickAdd}
          data-testid="product-card-add-to-cart"
        >
          {adding ? 'Adding...' : 'Click to add to Cart'}
        </button>

        {quickAddMessage && (
          <p
            className={quickAddMessage === 'Added to cart' ? 'success small' : 'error small'}
            data-testid="product-card-add-message"
          >
            {quickAddMessage}
          </p>
        )}

        <Link to={`/products/${product._id}`} className="button ghost">
          View details
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
