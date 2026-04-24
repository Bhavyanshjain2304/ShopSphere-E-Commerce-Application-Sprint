import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../api/orderApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchCart();
    else setCart([]);
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.data || []);
    } catch {
      setCart([]);
    }
  };

  const addItem = async (productId, productName, price, quantity = 1) => {
    await addToCart({ productId, productName, price, quantity });
    await fetchCart();
  };

  const updateItem = async (productId, quantity) => {
    await updateCartItem(productId, quantity);
    await fetchCart();
  };

  const removeItem = async (productId) => {
    await removeCartItem(productId);
    await fetchCart();
  };

  const emptyCart = async () => {
    await clearCart();
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addItem, updateItem, removeItem, emptyCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
