import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, cartTotal, updateItem, removeItem, emptyCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return <div><h2>Your cart is empty</h2></div>;

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.map((item) => (
        <div key={item.productId}>
          <span>{item.productName}</span>
          <span>${item.price}</span>
          <input
            type="number" min="1" value={item.quantity}
            onChange={(e) => updateItem(item.productId, Number(e.target.value))}
          />
          <span>${(item.price * item.quantity).toFixed(2)}</span>
          <button onClick={() => removeItem(item.productId)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${cartTotal.toFixed(2)}</h3>
      <button onClick={emptyCart}>Clear Cart</button>
      <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
    </div>
  );
}
