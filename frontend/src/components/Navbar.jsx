import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="nav-wrap">
      <nav className="nav container">
        <Link className="brand" to="/">
          MERN Shop
        </Link>
        <div className="nav-links">
          <NavLink to="/products">Products</NavLink>
          {user && <NavLink to="/orders">My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
          {user && <NavLink to="/cart">Cart ({cartCount})</NavLink>}
          {!user ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <button className="link-button" onClick={handleLogout}>
              Logout {user.name}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
