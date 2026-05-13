import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSearchBar } from '../context/SearchBarContext';
import { useTheme } from '../context/ThemeContext';

const HIDE_SEARCH_ROUTES = ['/login', '/signup'];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { heroVisible } = useSearchBar();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const shouldShowSearch = !HIDE_SEARCH_ROUTES.includes(location.pathname) && !heroVisible;

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?keyword=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent shrink-0">
          ShopSphere
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch}
          className={`flex flex-1 max-w-2xl transition-all duration-300 ${shouldShowSearch ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, brands and more..."
            className="flex-1 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          <button type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition">
            🔍
          </button>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">

          {/* Dark mode toggle */}
          <button onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title={dark ? 'Light mode' : 'Dark mode'}>
            {dark ? '☀️' : '🌙'}
          </button>

          <Link to="/products"
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Products
          </Link>

          {user && (
            <Link to="/orders"
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              Orders
            </Link>
          )}

          {/* Cart */}
          {user && (
            <Link to="/cart"
              className="relative px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center">
              <span className="text-lg">🛒</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User avatar / login */}
          {user ? (
            <div className="relative ml-1" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate hidden sm:block">
                  {user.name}
                </span>
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    📦 My Orders
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-gray-100 dark:border-gray-800 mt-1">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition">
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link to="/login"
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                Login
              </Link>
              <Link to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
