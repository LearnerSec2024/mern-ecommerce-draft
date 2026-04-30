import { useEffect, useState } from 'react';

import api from '../api/axios.js';

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatStatus = (value) =>
  value
    ? value
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Unknown';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
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

  const toggleOrder = (orderId) => {
    setExpandedOrderId((currentId) => (currentId === orderId ? null : orderId));
  };

  return (
    <section className="stack" data-testid="my-orders-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>My orders</h1>
          <p className="muted">
            Review your order history, purchased products, shipping details and totals.
          </p>
        </div>
      </div>

      {loading && <p>Loading orders...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && orders.length === 0 && (
        <div className="card empty-state">
          <p>No orders yet.</p>
        </div>
      )}

      <div className="stack">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;

          return (
            <article className="card order-card" key={order._id} data-testid="order-card">
              <div className="order-summary-header">
                <div>
                  <p className="eyebrow">Order</p>
                  <h2>Order #{order._id.slice(-6).toUpperCase()}</h2>
                  <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="order-summary-meta">
                  <strong>{formatCurrency(order.totalPrice)}</strong>
                  <span className="status ok">{formatStatus(order.orderStatus)}</span>
                  <span className="status">{formatStatus(order.paymentStatus)}</span>
                </div>
              </div>

              <div className="order-quick-details">
                <span>{order.orderItems.length} item(s)</span>
                <span>Payment: {formatStatus(order.paymentMethod)}</span>
                <span>
                  Ship to: {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </span>
              </div>

              <button
                className="button ghost"
                type="button"
                onClick={() => toggleOrder(order._id)}
                data-testid="order-details-toggle"
              >
                {isExpanded ? 'Hide order details' : 'View order details'}
              </button>

              {isExpanded && (
                <div className="order-details" data-testid="order-details">
                  <div className="order-section">
                    <h3>Products ordered</h3>

                    <div className="order-items-list">
                      {order.orderItems.map((item) => (
                        <div className="order-item-row" key={`${order._id}-${item.product}`}>
                          <img
                            src={item.image || '/images/products/default.jpg'}
                            alt={item.name}
                            className="order-item-image"
                          />

                          <div className="order-item-main">
                            <strong>{item.name}</strong>
                            <span className="muted">
                              Quantity {item.quantity} × {formatCurrency(item.price)}
                            </span>
                          </div>

                          <strong>{formatCurrency(item.quantity * item.price)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-details-grid">
                    <div className="order-section">
                      <h3>Shipping address</h3>
                      <p>{order.shippingAddress?.line1}</p>
                      {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
                      <p>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                        {order.shippingAddress?.postcode}
                      </p>
                      <p>{order.shippingAddress?.country}</p>
                    </div>

                    <div className="order-section">
                      <h3>Order totals</h3>

                      <div className="order-total-row">
                        <span>Items</span>
                        <strong>{formatCurrency(order.itemsPrice)}</strong>
                      </div>

                      <div className="order-total-row">
                        <span>Shipping</span>
                        <strong>{formatCurrency(order.shippingPrice)}</strong>
                      </div>

                      <div className="order-total-row">
                        <span>Tax</span>
                        <strong>{formatCurrency(order.taxPrice)}</strong>
                      </div>

                      <div className="order-total-row grand-total">
                        <span>Total</span>
                        <strong>{formatCurrency(order.totalPrice)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="order-section">
                    <h3>Status details</h3>
                    <div className="order-status-grid">
                      <span>Order status: {formatStatus(order.orderStatus)}</span>
                      <span>Payment status: {formatStatus(order.paymentStatus)}</span>
                      <span>Payment method: {formatStatus(order.paymentMethod)}</span>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Orders;