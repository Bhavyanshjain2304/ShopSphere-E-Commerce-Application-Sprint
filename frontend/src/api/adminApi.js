import api from './axiosInstance';

// Gateway baseURL = http://localhost:8222/gateway
// Gateway route: /gateway/admin/** → StripPrefix=1 → /admin/** at admin-service
// Admin-service routes: /admin/dashboard, /admin/orders, /admin/products, /admin/reports

export const getDashboard = () => api.get('/admin/dashboard');
export const getReports = () => api.get('/admin/reports');
export const getAllOrders = () => api.get('/admin/orders');
export const updateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status });
export const getAdminProducts = (page = 0, size = 10) =>
  api.get(`/admin/products?page=${page}&size=${size}`);
export const createProduct = (data) => api.post('/admin/products', data);
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);
