import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiRequest('POST', '/api/auth/login', { username, password });
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      setError('Username atau password salah!');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setError(null);
  };

  return {
    isLoggedIn,
    isLoading,
    error,
    login,
    logout
  };
}
