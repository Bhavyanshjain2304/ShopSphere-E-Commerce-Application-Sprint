import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api/orderApi';

const STATUS_STEPS = ['CHECKOUT', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED'];

const STATUS_CONFIG = {
  CHECKOUT:   { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  PAID:       { color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  PACKED:     { color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  SHIPPED:    { color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  DELIVERED:  { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  CANCELLED:  { color: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder(id).then(r => setOrder(r.data.data));
  }, [id]);

  if (!order) return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
    </div>
  );

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const cfg = STATUS_CONFIG[order.status] || { color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };

  return (
    <div className="dark:bg-gray-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline mb-6 font-medium">
          ← Back to Orders
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Order ID</p>
                <h2 className="text-2xl font-bold">
                  {order.orderCode || `ORD-${String(order.id).padStart(6, '0')}`}
                </h2>
                <p className="text-indigo-200 text-sm mt-1">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${cfg.color}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Progress tracker */}
            {order.status !== 'CANCELLED' && (
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-4">Order Progress</h3>
                <div className="relative">
                  {/* Line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 dark:bg-gray-800" />
                  <div className="absolute top-4 left-4 h-0.5 bg-indigo-600 transition-all duration-500"
                    style={{ width: currentStep >= 0 ? `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` : '0%' }} />

                  <div className="relative flex justify-between">
                    {STATUS_STEPS.map((step, i) => {
                      const done = i < currentStep;
                      const active = i === currentStep;
                      return (
                        <div key={step} className="flex flex-col items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all
                            ${done ? 'bg-indigo-600 text-white' : active ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                            {done ? '✓' : i + 1}
                          </div>
                          <span className={`text-xs font-medium text-center ${active ? 'text-indigo-600' : done ? 'text-indigo-400' : 'text-gray-400'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Items */}
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 rounded-lg flex items-center justify-center text-lg shrink-0">
                      🛍️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white text-sm truncate">{item.productName}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-800 dark:text-white text-sm">₹{item.subtotal}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Delivery Address</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{order.deliveryAddress}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Payment Method</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{order.paymentMode || '—'}</p>
              </div>
            </div>

            {/* Total */}
            <div className="border-t dark:border-gray-800 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-800 dark:text-white">Order Total</span>
              <span className="text-2xl font-bold text-indigo-600">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
