import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../data/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await authApi.getCurrentUser();
      setUser(u);
      setLoading(false);
    })();
  }, []);

  const login = async (credentials) => {
    const u = await authApi.login(credentials);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const u = await authApi.register(data);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const updateProfile = async (patch) => {
    if (!user) return null;
    const updated = await authApi.updateProfile(user.id, patch);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
