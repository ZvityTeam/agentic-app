import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { login, logout, register } from '@/store/slices/auth-slice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        const resultAction = await dispatch(login({ email, password }));
        if (login.fulfilled.match(resultAction)) {
          return { success: true };
        } else {
          return {
            success: false,
            error: resultAction.payload || 'Login failed',
          };
        }
      } catch (error) {
        return { success: false, error: 'Login failed' };
      }
    },
    [dispatch]
  );

  const handleRegister = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const resultAction = await dispatch(
          register({ name, email, password })
        );
        if (register.fulfilled.match(resultAction)) {
          return { success: true };
        } else {
          return {
            success: false,
            error: resultAction.payload || 'Registration failed',
          };
        }
      } catch (error) {
        return { success: false, error: 'Registration failed' };
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    await dispatch(logout());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}