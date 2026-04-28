import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const Cart = () => {
  const { cart, loadCart, updateQuantity, removeItem, loading } = useCart();
  const [error, setError] = useState('');

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantity = async (productId, quantity) => {
    setError('');
    try {
      await updateQuantity(productId, quantity);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update cart');
    }
  };

  return (
    <section>
      <div className="page-header"><h1>Your cart</h1></div>
      {loading && <p>Loading cart...</p>}
      {error && <p className="error">{error}</p>}
      {!cart.items?.length ? (
        <div className="card empty-state">
          <p>Your cart is empty.</p>
          <Link className="button" to="/products">Browse products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="stack">
            {cart.items.map((item) => (
              <article className="card cart-item" key={item.product}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => handleQuantity(item.product, Number(event.target.value))}
                />
                <button className="button ghost" onClick={() => removeItem(item.product)}>Remove</button>
              </article>
            ))}
          </div>
          <aside className="card summary">
            <h2>Summary</h2>
            <p>Subtotal: <strong>${cart.totalAmount.toFixed(2)}</strong></p>
            <Link className="button full" to="/checkout">Checkout</Link>
          </aside>
        </div>
      )}
    </section>
  );
};

export default Cart;
