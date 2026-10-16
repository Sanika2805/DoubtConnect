import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken, clearToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On page load: if a token is saved, ask the server who it belongs to.
  useEffect(() => {
    async function restore() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await api.me();
        setUser(user);
      } catch (e) {
        if (e.status === 401) clearToken();
      }
      setLoading(false);
    }
    restore();
  }, []);

  async function login(username, password) {
    const data = await api.login({ username, password });
    setToken(data.token);
    setUser(data.user);
  }

  async function register(fullName, username, password) {
    const data = await api.register({ fullName, username, password });
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  async function updateProfile(updates) {
    const { user } = await api.updateProfile(updates);
    setUser(user);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
