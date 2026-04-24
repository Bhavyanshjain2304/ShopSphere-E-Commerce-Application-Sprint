import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startCheckout, processPayment, placeOrder } from '../api/orderApi';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({ deliveryAddress: '', deliveryMode: 'STANDARD', paymentMode: 'UPI' });
  const [error, setError] = useState('');
  const { emptyCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await startCheckout({ deliveryAddress: form.deliveryAddress, deliveryMode: form.deliveryMode });
      setOrderId(res.data.data.id);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed');
    }
  };

  const handlePayment = async () => {
    setError('');
    try {
      await processPayment({ orderId, paymentMode: form.paymentMode });
      await placeOrder(orderId);
      await emptyCart();
      navigate(`/orders/${orderId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {step === 1 && (
        <form onSubmit={handleCheckout}>
          <textarea placeholder="Delivery Address" value={form.deliveryAddress}
            onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} required />
          <select value={form.deliveryMode} onChange={(e) => setForm({ ...form, deliveryMode: e.target.value })}>
            <option value="STANDARD">Standard</option>
            <option value="EXPRESS">Express</option>
          </select>
          <button type="submit">Continue to Payment</button>
        </form>
      )}

      {step === 2 && (
        <div>
          <h3>Payment</h3>
          <select value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}>
            <option value="UPI">UPI</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="NET_BANKING">Net Banking</option>
          </select>
          <button onClick={handlePayment}>Place Order</button>
        </div>
      )}
    </div>
  );
}
