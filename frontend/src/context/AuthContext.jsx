import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, signup as signupApi, getMe } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((res) => {
          // getMe returns AuthResponse: { token, email, name, role }
          // strip token from user state to keep it consistent with login()
          const { token: _t, ...userData } = res.data;
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await signupApi({ name, email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
