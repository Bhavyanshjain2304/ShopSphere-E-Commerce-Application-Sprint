import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">ShopSphere</Link>
      <Link to="/products">Products</Link>
      {user && <Link to="/cart">Cart ({cartCount})</Link>}
      {user && <Link to="/orders">My Orders</Link>}
      {isAdmin() && <Link to="/admin">Admin</Link>}
      {user ? (
        <>
          <span>{user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}
