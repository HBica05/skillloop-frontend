import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../api/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set axios default auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // On first load, fetch the current user if we have a token
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API_BASE}/dj-rest-auth/user/`);
          setCurrentUser(res.data);
        } catch {
          // Token is invalid or expired — clear it
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post(`${API_BASE}/dj-rest-auth/login/`, {
      username,
      password,
    });
    const receivedToken = res.data.key;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setCurrentUser(res.data.user);
    return res.data;
  };

  const register = async (formData) => {
    const res = await axios.post(
      `${API_BASE}/dj-rest-auth/registration/`,
      formData
    );
    const receivedToken = res.data.key;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setCurrentUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/dj-rest-auth/logout/`);
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access
export function useAuth() {
  return useContext(AuthContext);
}