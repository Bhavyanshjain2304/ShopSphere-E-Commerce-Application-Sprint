import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../api/adminApi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const KPI_CONFIG = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: '💰', color: 'from-blue-500 to-blue-600', fmt: (v) => `₹${parseFloat(v || 0).toLocaleString('en-IN')}` },
  { key: 'totalOrders', label: 'Total Orders', icon: '📦', color: 'from-violet-500 to-violet-600', fmt: (v) => v ?? '—' },
  { key: 'deliveredOrders', label: 'Delivered', icon: '✅', color: 'from-green-500 to-green-600', fmt: (v) => v ?? '—' },
  { key: 'pendingOrders', label: 'Pending', icon: '⏳', color: 'from-amber-500 to-amber-600', fmt: (v) => v ?? '—' },
  { key: 'cancelledOrders', label: 'Cancelled', icon: '❌', color: 'from-red-500 to-red-600', fmt: (v) => v ?? '—' },
  { key: 'todayOrders', label: "Today's Orders", icon: '📅', color: 'from-teal-500 to-teal-600', fmt: (v) => v ?? '—' },
];

const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#6366f1', '#3b82f6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => {
        // dashboard data is nested inside res.data.data
        const raw = res.data.data;
        setStats(raw);
      })
      .finally(() => setLoading(false));
  }, []);

  const pieData = stats ? [
    { name: 'Delivered', value: Number(stats.deliveredOrders || 0) },
    { name: 'Pending', value: Number(stats.pendingOrders || 0) },
    { name: 'Cancelled', value: Number(stats.cancelledOrders || 0) },
  ].filter(d => d.value > 0) : [];

  const revenueData = stats?.monthlyRevenue || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back! Here's your business overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading
          ? [...Array(6)].map((_, i) => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)
          : KPI_CONFIG.map(({ key, label, icon, color, fmt }) => (
            <div key={key} className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white shadow-lg`}>
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-xs font-medium opacity-80 mb-1">{label}</p>
              <p className="text-xl font-bold leading-tight">{fmt(stats?.[key])}</p>
            </div>
          ))
        }
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue line chart — takes 2/3 */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Revenue Trend (Last 6 Months)</h3>
          {loading ? (
            <div className="h-56 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ) : revenueData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-gray-400 text-sm">No revenue data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`₹${parseFloat(v).toLocaleString('en-IN')}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order status pie — takes 1/3 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Order Status</h3>
          {loading ? (
            <div className="h-56 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ) : pieData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-gray-400 text-sm">No orders yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" outerRadius={75} dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconSize={10} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/admin/products', icon: '🛍️', label: 'Manage Products', desc: 'Add, edit or remove products', bg: 'bg-orange-50 dark:bg-orange-950' },
          { to: '/admin/orders', icon: '📋', label: 'Manage Orders', desc: 'View and update order status', bg: 'bg-indigo-50 dark:bg-indigo-950' },
          { to: '/admin/reports', icon: '📈', label: 'View Reports', desc: 'Revenue and order analytics', bg: 'bg-teal-50 dark:bg-teal-950' },
        ].map(({ to, icon, label, desc, bg }) => (
          <Link key={to} to={to}
            className={`${bg} rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700`}>
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-white text-sm">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
