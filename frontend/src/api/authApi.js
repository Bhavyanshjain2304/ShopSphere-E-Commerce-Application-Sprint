import api from './axiosInstance';

export const signup = (data) => api.post('/auth/signup', data);
export const signupAdmin = (data, secret) => api.post('/auth/signup/admin', data, {
  headers: { 'X-Admin-Secret': secret },
});
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const validateToken = (token) => api.get(`/auth/validate?token=${token}`);
