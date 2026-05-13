import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupAdmin } from '../api/authApi';

export default function SignupAdmin() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signupAdmin(form, secretKey);
      const { token } = res.data;
      localStorage.setItem('token', token);
      navigate('/admin');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create admin account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-100 dark:border-gray-800">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            ⚙️
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Create Admin Account</h2>
            <p className="text-xs text-gray-400">Full access to ShopSphere admin panel</p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 mb-5 text-xs text-amber-700 dark:text-amber-400">
          ⚠️ Admin accounts have full access to products, orders, and reports. Only share with trusted users.
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm border border-red-100 dark:border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Secret Key</label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter admin secret key"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Contact your system administrator for this key.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Admin Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="admin@shopsphere.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition text-sm">
            {loading ? 'Creating Admin...' : 'Create Admin Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-5 text-xs">
          Want a regular account?{' '}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
