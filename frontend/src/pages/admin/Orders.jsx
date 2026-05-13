import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/adminApi';

const STATUSES = ['CHECKOUT', 'PAID', 'PACKED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_STYLE = {
  CHECKOUT:   'bg-yellow-100 text-yellow-700',
  PAID:       'bg-blue-100 text-blue-700',
  PACKED:     'bg-orange-100 text-orange-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED:    'bg-indigo-100 text-indigo-700',
  DELIVERED:  'bg-green-100 text-green-700',
  CANCELLED:  'bg-red-100 text-red-600',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getAllOrders()
      .then((res) => {
        const data = res.data.data;
        setOrders(Array.isArray(data) ? data : data?.content || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    } catch {
      alert('Failed to update status');
    }
  };

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-400 mt-1">{orders.length} total orders</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {['ALL', ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
              ${filter === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700 hover:border-blue-400'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">No orders found</td>
                </tr>
              ) : filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-5 py-4 font-semibold text-gray-800 dark:text-white">#{order.id}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{order.userEmail || '—'}</td>
                  <td className="px-5 py-4 font-semibold text-blue-600">
                    {'\u20B9'}{parseFloat(order.totalAmount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
