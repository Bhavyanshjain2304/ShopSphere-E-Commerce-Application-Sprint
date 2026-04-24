import api from './axiosInstance';

export const getDashboard = () => api.get('/admin/admin/dashboard');
export const getReports = () => api.get('/admin/admin/reports');
export const getAllOrders = () => api.get('/admin/admin/orders');
export const updateOrderStatus = (id, status) =>
  api.put(`/admin/admin/orders/${id}/status`, { status });
export const getAdminProducts = (page = 0, size = 10) =>
  api.get(`/admin/admin/products?page=${page}&size=${size}`);
export const createProduct = (data) => api.post('/admin/admin/products', data);
export const updateProduct = (id, data) => api.put(`/admin/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/admin/admin/products/${id}`);
