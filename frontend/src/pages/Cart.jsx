import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Cart() {
  const { cart, cartTotal, updateItem, removeItem, emptyCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="min-h-screen dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-950 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-6xl">🛒</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">Looks like you haven't added anything yet. Start exploring our products!</p>
        <Link to="/products"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-200 dark:shadow-none">
          Browse Products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="dark:bg-gray-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Shopping Cart</h2>
            <p className="text-sm text-gray-400 mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={emptyCart} className="text-sm text-red-400 hover:text-red-600 font-medium transition">
            Clear all
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div key={item.productId}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4 hover:shadow-md transition">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  🛍️
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-white truncate">{item.productName}</h3>
                  <p className="text-indigo-600 font-bold text-sm mt-0.5">₹{item.price}</p>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center border-2 border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => item.quantity > 1 ? updateItem(item.productId, item.quantity - 1) : removeItem(item.productId)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-gray-600 dark:text-gray-300 transition">
                    −
                  </button>
                  <span className="px-4 py-2 font-bold text-gray-800 dark:text-white text-sm min-w-[2.5rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateItem(item.productId, item.quantity + 1)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-gray-600 dark:text-gray-300 transition">
                    +
                  </button>
                </div>

                <p className="font-bold text-gray-800 dark:text-white w-20 text-right text-sm">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </p>

                <button onClick={() => removeItem(item.productId)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition">
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:w-80">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sticky top-20">
              <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Discount</span>
                  <span className="text-green-600 font-medium">−₹0</span>
                </div>
              </div>

              <div className="border-t dark:border-gray-800 mt-4 pt-4 flex justify-between font-bold text-lg text-gray-800 dark:text-white">
                <span>Total</span>
                <span className="text-indigo-600">₹{cartTotal.toFixed(0)}</span>
              </div>

              <button onClick={() => navigate('/checkout')}
                className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 rounded-2xl font-bold text-sm transition shadow-lg shadow-indigo-200 dark:shadow-none">
                Proceed to Checkout →
              </button>

              <Link to="/products"
                className="block text-center mt-3 text-sm text-indigo-600 hover:underline font-medium">
                ← Continue Shopping
              </Link>

              <div className="mt-5 pt-4 border-t dark:border-gray-800 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>🔒 Secure</span>
                <span>🚚 Free delivery</span>
                <span>↩️ Easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
