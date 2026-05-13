import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orderApi';

const STATUS_CONFIG = {
  CHECKOUT:   { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', dot: 'bg-amber-500', label: 'Checkout' },
  PAID:       { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400', dot: 'bg-blue-500', label: 'Paid' },
  PROCESSING: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400', dot: 'bg-purple-500', label: 'Processing' },
  PACKED:     { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400', dot: 'bg-orange-500', label: 'Packed' },
  SHIPPED:    { color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400', dot: 'bg-indigo-500', label: 'Shipped' },
  DELIVERED:  { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', dot: 'bg-green-500', label: 'Delivered' },
  CANCELLED:  { color: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400', dot: 'bg-red-500', label: 'Cancelled' },
};

const SkeletonOrder = () => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
    <div className="flex justify-between">
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-24" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-32" />
      </div>
      <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-20" />
    </div>
  </div>
);

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  if (!loading && orders.length === 0) return (
    <div className="min-h-screen dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-950 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-6xl">📦</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No orders yet</h2>
        <p className="text-gray-400 mb-8">Your order history will appear here once you make a purchase.</p>
        <Link to="/products"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-200 dark:shadow-none">
          Start Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <div className="dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Orders</h2>
          <p className="text-sm text-gray-400 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['ALL', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${filter === s ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-400'}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonOrder key={i} />)
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p>No {filter.toLowerCase()} orders found</p>
            </div>
          ) : filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', label: order.status };
            return (
              <Link key={order.id} to={`/orders/${order.id}`}
                className="block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 rounded-xl flex items-center justify-center text-xl">
                      📦
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">
                        {order.orderCode || `ORD-${String(order.id).padStart(6, '0')}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-400">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600 text-lg">₹{order.totalAmount}</p>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
