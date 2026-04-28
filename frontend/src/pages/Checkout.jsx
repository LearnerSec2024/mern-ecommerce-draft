import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loadCart } = useCart();
  const [form, setForm] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Australia',
    paymentMethod: 'mock-card'
  });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const subtotal = cart.totalAmount || 0;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPlacing(true);

    try {
      const { data } = await api.post('/orders', {
        shippingAddress: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          postcode: form.postcode,
          country: form.country
        },
        paymentMethod: form.paymentMethod
      });
      await loadCart();
      navigate('/orders', { state: { orderId: data._id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items?.length) {
    return (
      <div className="card empty-state">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link className="button" to="/products">Browse products</Link>
      </div>
    );
  }

  return (
    <section>
      <h1>Checkout</h1>
      <div className="cart-layout">
        <form className="card stack" onSubmit={handleSubmit}>
          <h2>Shipping details</h2>
          <label>Address line 1<input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required /></label>
          <label>Address line 2<input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} /></label>
          <label>City<input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></label>
          <label>State<input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required /></label>
          <label>Postcode<input value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} required /></label>
          <label>Country<input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required /></label>
          <label>
            Payment method
            <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
              <option value="mock-card">Mock card payment</option>
              <option value="cash-on-delivery">Cash on delivery</option>
            </select>
          </label>
          <button className="button" disabled={placing}>{placing ? 'Placing order...' : 'Place order'}</button>
          {error && <p className="error">{error}</p>}
        </form>
        <aside className="card summary">
          <h2>Order summary</h2>
          {cart.items.map((item) => (
            <p key={item.product}>{item.name} × {item.quantity}</p>
          ))}
          <hr />
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Shipping: ${shipping.toFixed(2)}</p>
          <p>GST estimate: ${tax.toFixed(2)}</p>
          <h3>Total: ${total.toFixed(2)}</h3>
        </aside>
      </div>
    </section>
  );
};

export default Checkout;
