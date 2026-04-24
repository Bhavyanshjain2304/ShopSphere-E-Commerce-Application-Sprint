import api from './axiosInstance';

// Cart
export const getCart = () => api.get('/orders/cart');
export const addToCart = (data) => api.post('/orders/cart', data);
export const updateCartItem = (productId, quantity) =>
  api.put(`/orders/cart/${productId}?quantity=${quantity}`);
export const removeCartItem = (productId) => api.delete(`/orders/cart/${productId}`);
export const clearCart = () => api.delete('/orders/cart');

// Orders
export const startCheckout = (data) => api.post('/orders/orders/checkout/start', data);
export const processPayment = (data) => api.post('/orders/orders/payment', data);
export const placeOrder = (orderId) => api.post(`/orders/orders/place?orderId=${orderId}`);
export const getOrder = (id) => api.get(`/orders/orders/${id}`);
export const getMyOrders = () => api.get('/orders/orders/my');
