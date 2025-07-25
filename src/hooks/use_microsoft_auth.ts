import { useState, useEffect, useCallback } from "react";
import MicrosoftAuthService, { type MicrosoftAuthState, type UserProfile } from "../services/microsoft_auth_service";

interface UseMicrosoftAuthReturn {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

export function useMicrosoftAuth(): UseMicrosoftAuthReturn {
  const [state, setState] = useState<MicrosoftAuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    error: null,
    loading: true,
  });

  const authService = MicrosoftAuthService.getInstance();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((newState) => {
      setState(newState);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [authService]);

  const login = useCallback(async () => {
    try {
      await authService.login();
    } catch {
      // Error is already handled by the service and reflected in state
    }
  }, [authService]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Error is already handled by the service and reflected in state
    }
  }, [authService]);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    return authService.getAccessToken();
  }, [authService]);

  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    getAccessToken,
  };
}