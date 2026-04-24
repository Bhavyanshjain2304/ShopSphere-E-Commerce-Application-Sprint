import api from './axiosInstance';

// Products
export const getProducts = (page = 0, size = 10, sortBy = 'id') =>
  api.get(`/catalog/products?page=${page}&size=${size}&sortBy=${sortBy}`);

export const getProduct = (id) => api.get(`/catalog/products/${id}`);

export const searchProducts = (keyword, page = 0, size = 10) =>
  api.get(`/catalog/products/search?keyword=${keyword}&page=${page}&size=${size}`);

export const getProductsByCategory = (categoryId, page = 0, size = 10) =>
  api.get(`/catalog/products/category/${categoryId}?page=${page}&size=${size}`);

export const getFeaturedProducts = (page = 0, size = 10) =>
  api.get(`/catalog/products/featured?page=${page}&size=${size}`);

// Categories
export const getCategories = () => api.get('/catalog/categories');
export const getCategory = (id) => api.get(`/catalog/categories/${id}`);
