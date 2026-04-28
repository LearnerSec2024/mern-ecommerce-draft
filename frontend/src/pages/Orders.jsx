import { useEffect, useState } from 'react';
import api from '../api/axios.js';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <section>
      <h1>My orders</h1>
      {loading && <p>Loading orders...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && orders.length === 0 && <p>No orders yet.</p>}
      <div className="stack">
        {orders.map((order) => (
          <article className="card" key={order._id}>
            <div className="split-row">
              <div>
                <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <strong>${order.totalPrice.toFixed(2)}</strong>
            </div>
            <p>Status: <span className="status ok">{order.orderStatus}</span></p>
            <p>Payment: {order.paymentStatus}</p>
            <p>{order.orderItems.length} item(s)</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Orders;
