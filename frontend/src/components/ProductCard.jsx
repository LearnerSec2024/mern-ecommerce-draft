import { useState } from 'react';
import { Link } from 'react-router-dom';

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
  const [imageError, setImageError] = useState(false);

  const visual = categoryVisuals[product.category] || {
    emoji: '🛒',
    className: 'visual-default'
  };

  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/x-product-id', product._id);
    event.dataTransfer.setData('text/plain', product.name);
  };

  return (
    <article
      className="card product-card interactive-product-card"
      draggable
      onDragStart={handleDragStart}
      data-testid="product-card"
      data-product-id={product._id}
    >
      <div className="product-image-wrap">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`product-image-fallback ${visual.className}`}>
            <span>{visual.emoji}</span>
            <strong>{product.name}</strong>
            <small>{product.category}</small>
          </div>
        )}

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
        <h3>{product.name}</h3>
        <p className="muted">{product.brand}</p>
        <strong>${product.price.toFixed(2)}</strong>

        <span className={product.stock > 0 ? 'status ok' : 'status danger'}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>

        <Link to={`/products/${product._id}`} className="button ghost">
          View details
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;