import { useEffect, useState } from 'react';
import api from '../api/axios.js';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    const { data } = await api.get('/orders');
    setOrders(data);
  };

  useEffect(() => {
    loadOrders().catch((err) => setError(err.response?.data?.message || 'Could not load orders'));
  }, []);

  const updateStatus = async (orderId, orderStatus) => {
    await api.put(`/orders/${orderId}/status`, { orderStatus });
    await loadOrders();
  };

  return (
    <section>
      <h1>Manage orders</h1>
      {error && <p className="error">{error}</p>}
      <div className="stack">
        {orders.map((order) => (
          <article className="card" key={order._id}>
            <div className="split-row">
              <div>
                <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                <p className="muted">
                  {order.user?.name} · {order.user?.email}
                </p>
              </div>
              <strong>${order.totalPrice.toFixed(2)}</strong>
            </div>
            <p>Status: {order.orderStatus}</p>
            <select
              value={order.orderStatus}
              onChange={(e) => updateStatus(order._id, e.target.value)}
            >
              <option value="placed">Placed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminOrders;
