import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Set Axios default base URL for API calls
let apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Ensure no trailing slash
if (apiURL.endsWith('/')) apiURL = apiURL.slice(0, -1);
axios.defaults.baseURL = apiURL;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const resp = await axios.post('/api/users/login', { username, password });
      const { token, user: userData } = resp.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const register = async (username, password) => {
    try {
      await axios.post('/api/users/register', { username, password });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Registration failed" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
