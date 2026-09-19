import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken } from '../lib/api';
import { BusinessProfile } from '../types';

interface AuthContextType {
  user: any | null;
  business: BusinessProfile | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, fullName: string, password?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateBusinessLocally: (updated: Partial<BusinessProfile>) => void;
  switchPersona: (persona: 'adaeze' | 'new_merchant' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        // Auto-login to Adaeze Foods Ltd for seamless demo experience
        const data = await api.login('hello@adaezefoods.ng');
        setUser(data.user);
        setBusiness(data.business);
        return;
      }
      const data = await api.getMe();
      setUser(data.user);
      setBusiness(data.business);
    } catch (err) {
      console.warn('Failed to load session, falling back to demo:', err);
      try {
        const data = await api.login('hello@adaezefoods.ng');
        setUser(data.user);
        setBusiness(data.business);
      } catch (e) {
        setUser(null);
        setBusiness(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const login = async (email: string, password = 'password123') => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      setBusiness(data.business);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, fullName: string, password = 'password123', phone?: string) => {
    setLoading(true);
    try {
      const data = await api.register(email, fullName, password, phone);
      setUser(data.user);
      setBusiness(data.business);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
      setUser(null);
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const profile = await api.getProfile();
      setBusiness(profile);
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  const updateBusinessLocally = (updated: Partial<BusinessProfile>) => {
    setBusiness((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const switchPersona = async (persona: 'adaeze' | 'new_merchant' | 'admin') => {
    setLoading(true);
    try {
      if (persona === 'adaeze') {
        await login('hello@adaezefoods.ng');
      } else if (persona === 'admin') {
        await login('owoadeopeyemi11@gmail.com');
      } else {
        // new unverified merchant starting fresh onboarding
        const uniqueEmail = `demo.merchant.${Math.floor(Math.random() * 9000 + 1000)}@quickbill.ng`;
        await register(uniqueEmail, 'New Merchant');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        updateBusinessLocally,
        switchPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
