import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startCheckout, processPayment, placeOrder } from '../api/orderApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const STEPS = ['Address', 'Delivery', 'Payment', 'Review'];

const DELIVERY_MODES = [
  { value: 'STANDARD', label: 'Standard Delivery', desc: '5–7 business days', price: 'Free', icon: '📦' },
  { value: 'EXPRESS', label: 'Express Delivery', desc: '1–2 business days', price: '₹99', icon: '⚡' },
];

const PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI', desc: 'Pay via UPI ID (GPay, PhonePe, Paytm)', icon: '📱' },
  { value: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
  { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
];

const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center mb-10">
    {STEPS.map((label, i) => {
      const idx = i + 1;
      const done = current > idx;
      const active = current === idx;
      return (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-100 text-gray-400'}`}>
              {done ? '✓' : idx}
            </div>
            <span className={`text-xs mt-1 font-medium ${active ? 'text-blue-600' : done ? 'text-green-500' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-12 sm:w-20 mx-1 mb-4 transition-all ${current > idx ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      );
    })}
  </div>
);

const OrderSummary = ({ cart, cartTotal }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
    <h3 className="font-bold text-gray-800 text-base mb-4">Order Summary</h3>
    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
      {cart.map((item) => (
        <div key={item.productId} className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-base shrink-0">🛍️</div>
            <div>
              <p className="text-gray-700 font-medium leading-tight truncate max-w-[130px]">{item.productName}</p>
              <p className="text-gray-400 text-xs">x{item.quantity}</p>
            </div>
          </div>
          <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(0)}</span>
        </div>
      ))}
    </div>
    <div className="border-t pt-4 space-y-2 text-sm">
      <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{cartTotal.toFixed(0)}</span></div>
      <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
      <div className="flex justify-between font-bold text-base pt-2 border-t text-gray-800">
        <span>Total</span><span className="text-blue-600">₹{cartTotal.toFixed(0)}</span>
      </div>
    </div>
  </div>
);

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({
    address: '', city: '', state: '', pincode: '',
    deliveryMode: 'STANDARD',
    paymentMode: 'UPI',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { cart, cartTotal, emptyCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deliveryAddress = `${user?.name}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

  const validateAddress = () => {
    const e = {};
    if (!form.address.trim()) e.address = 'Street address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    setApiError('');
    if (step === 1) {
      if (!validateAddress()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Call startCheckout here so we have orderId before review
      setLoading(true);
      try {
        const res = await startCheckout({ deliveryAddress, deliveryMode: form.deliveryMode });
        setOrderId(res.data.data.id);
        setStep(4);
      } catch (err) {
        setApiError(err.response?.data?.message || 'Checkout failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePlaceOrder = async () => {
    setApiError('');
    setLoading(true);
    try {
      await processPayment({ orderId, paymentMode: form.paymentMode });
      await placeOrder(orderId);
      await emptyCart();
      navigate(`/orders/${orderId}`);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, placeholder, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
          ${errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
      />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h2>
      <StepIndicator current={step} />

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {apiError}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">

          {/* STEP 1 — Address */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-5">Delivery Address</h3>
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-5 text-sm text-blue-700">
                Delivering to <strong>{user?.name}</strong> · {user?.email}
              </div>
              <div className="space-y-4">
                {field('address', 'Street Address', '123 Main Street, Apt 4B')}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {field('city', 'City', 'Mumbai')}
                  {field('state', 'State', 'Maharashtra')}
                  {field('pincode', 'Pincode', '400001')}
                </div>
              </div>
              <button onClick={handleNext}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                Continue to Delivery →
              </button>
            </div>
          )}

          {/* STEP 2 — Delivery Mode */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-5">Choose Delivery Mode</h3>
              <div className="space-y-3 mb-6">
                {DELIVERY_MODES.map((mode) => (
                  <button key={mode.value} type="button" onClick={() => setForm({ ...form, deliveryMode: mode.value })}
                    className={`w-full border-2 rounded-xl p-4 flex items-center gap-4 text-left transition
                      ${form.deliveryMode === mode.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="text-2xl">{mode.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{mode.label}</p>
                      <p className="text-sm text-gray-500">{mode.desc}</p>
                    </div>
                    <span className={`font-bold text-sm ${mode.price === 'Free' ? 'text-green-600' : 'text-gray-700'}`}>
                      {mode.price}
                    </span>
                    {form.deliveryMode === mode.value && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                  ← Back
                </button>
                <button onClick={handleNext} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Payment */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-5">Payment Method</h3>
              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((method) => (
                  <button key={method.value} type="button" onClick={() => setForm({ ...form, paymentMode: method.value })}
                    className={`w-full border-2 rounded-xl p-4 flex items-center gap-4 text-left transition
                      ${form.paymentMode === method.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                    {form.paymentMode === method.value && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
                  ← Back
                </button>
                <button onClick={handleNext} disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
                  {loading ? 'Processing...' : 'Review Order →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Review */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-5">Review Your Order</h3>

              <div className="space-y-4 mb-6">
                {/* Address */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="text-xl mt-0.5">📍</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Delivery Address</p>
                    <p className="text-sm text-gray-700">{deliveryAddress}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs text-blue-600 hover:underline shrink-0">Edit</button>
                </div>

                {/* Delivery mode */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="text-xl mt-0.5">{DELIVERY_MODES.find(m => m.value === form.deliveryMode)?.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Delivery Mode</p>
                    <p className="text-sm text-gray-700">{DELIVERY_MODES.find(m => m.value === form.deliveryMode)?.label}
                      <span className="text-gray-400"> · {DELIVERY_MODES.find(m => m.value === form.deliveryMode)?.desc}</span>
                    </p>
                  </div>
                  <button onClick={() => setStep(2)} className="text-xs text-blue-600 hover:underline shrink-0">Edit</button>
                </div>

                {/* Payment */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="text-xl mt-0.5">{PAYMENT_METHODS.find(m => m.value === form.paymentMode)?.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Payment Method</p>
                    <p className="text-sm text-gray-700">{PAYMENT_METHODS.find(m => m.value === form.paymentMode)?.label}</p>
                  </div>
                  <button onClick={() => setStep(3)} className="text-xs text-blue-600 hover:underline shrink-0">Edit</button>
                </div>

                {/* Items */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Items ({cart.length})</p>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.productName} <span className="text-gray-400">×{item.quantity}</span></span>
                        <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3 flex justify-between font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-blue-600">₹{cartTotal.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <button onClick={handlePlaceOrder} disabled={loading}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</>
                ) : '🎉 Place Order'}
              </button>
              <button onClick={() => setStep(3)} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition">
                ← Back to Payment
              </button>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-80">
          <OrderSummary cart={cart} cartTotal={cartTotal} />
        </div>
      </div>
    </div>
  );
}
