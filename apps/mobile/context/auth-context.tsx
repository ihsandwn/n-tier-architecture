import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { tokenStorage } from '@/lib/token-storage';
import { api } from '@/lib/api';
import { User, LoginRequest, SignupRequest } from '@/lib/types';
import Toast from 'react-native-toast-message';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (credentials: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await tokenStorage.getToken();
        const storedUser = await tokenStorage.getUser();

        if (token && storedUser) {
          // Verify token is still valid
          try {
            const decoded: Record<string, any> = jwtDecode(token);
            if (decoded.exp && decoded.exp * 1000 > Date.now()) {
              setUser(storedUser as User);
              api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
              // Token expired
              await tokenStorage.clear();
            }
          } catch (error) {
            console.error('Invalid token:', error);
            await tokenStorage.clear();
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post('/auth/login', credentials);
      const { accessToken, user } = response.data;

      await tokenStorage.saveToken(accessToken);
      await tokenStorage.saveUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(user);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome back, ${user.name}!`,
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMsg,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (credentials: SignupRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post('/auth/signup', credentials);
      const { accessToken, user } = response.data;

      await tokenStorage.saveToken(accessToken);
      await tokenStorage.saveUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(user);

      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: `Welcome, ${user.name}!`,
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: errorMsg,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await tokenStorage.clear();
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setError(null);

      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'See you next time!',
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      isLoading,
      isAuthenticated: !!user,
      error,
    }),
    [user, login, signup, logout, isLoading, error]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
