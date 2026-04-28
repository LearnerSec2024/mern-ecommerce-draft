import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <section>
      <p className="eyebrow">Admin</p>
      <h1>Admin dashboard</h1>
      <div className="grid two-col">
        <Link className="card dashboard-tile" to="/admin/products">
          <h2>Products</h2>
          <p>Create, edit and archive products.</p>
        </Link>
        <Link className="card dashboard-tile" to="/admin/orders">
          <h2>Orders</h2>
          <p>View orders and update fulfilment status.</p>
        </Link>
      </div>
    </section>
  );
};

export default AdminDashboard;
