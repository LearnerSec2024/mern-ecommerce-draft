import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <article className="card product-card">
      <Link to={`/products/${product._id}`}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="card-body">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="muted">{product.brand}</p>
        <div className="split-row">
          <strong>${product.price.toFixed(2)}</strong>
          <span className={product.stock > 0 ? 'status ok' : 'status danger'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        <Link className="button ghost full" to={`/products/${product._id}`}>View details</Link>
      </div>
    </article>
  );
};

export default ProductCard;
