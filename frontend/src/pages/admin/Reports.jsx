import { useEffect, useState } from 'react';
import { getReports } from '../../api/adminApi';
import RevenueChart from '../../components/admin/RevenueChart';
import OrderStatusChart from '../../components/admin/OrderStatusChart';

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getReports()
      .then((res) => setData(res.data.data))
      .catch(() => setError('Failed to load reports. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-24 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-xl h-80 animate-pulse" />
          <div className="bg-gray-100 rounded-xl h-80 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const dashboard = data?.dashboard || {};
  const orders = Array.isArray(data?.orders)
    ? data.orders
    : data?.orders?.content || [];

  const totalRevenue = dashboard.totalRevenue ?? orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0);
  const totalOrders = dashboard.totalOrders ?? orders.length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Revenue" value={`₹${parseFloat(totalRevenue).toLocaleString('en-IN')}`} icon="💰" color="bg-blue-50" />
        <StatCard label="Total Orders" value={totalOrders} icon="📦" color="bg-purple-50" />
        <StatCard label="Delivered Orders" value={deliveredCount} icon="✅" color="bg-green-50" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Revenue Over Time</h3>
          <RevenueChart orders={orders} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Order Status Distribution</h3>
          <OrderStatusChart orders={orders} />
        </div>
      </div>

      {/* Orders table */}
      {orders.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
          <h3 className="font-semibold text-gray-700 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-800">#{order.id}</td>
                    <td className="py-3 text-gray-600">{order.userEmail || '—'}</td>
                    <td className="py-3 font-semibold text-blue-600">₹{parseFloat(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
