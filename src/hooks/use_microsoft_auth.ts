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
    console.log("🔗 [useMicrosoftAuth] Setting up auth state subscription...");
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((newState) => {
      console.log("📡 [useMicrosoftAuth] Received auth state update:", {
        isAuthenticated: newState.isAuthenticated,
        loading: newState.loading,
        error: newState.error,
        hasUser: !!newState.user,
        userDisplayName: newState.user?.displayName
      });
      setState(newState);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("🔌 [useMicrosoftAuth] Cleaning up auth state subscription");
      unsubscribe();
    };
  }, [authService]);

  const login = useCallback(async () => {
    console.log("🚀 [useMicrosoftAuth] Login requested by component");
    try {
      await authService.login();
      console.log("✅ [useMicrosoftAuth] Login completed successfully");
    } catch (error) {
      console.error("💥 [useMicrosoftAuth] Login failed:", error);
      // Error is already handled by the service and reflected in state
    }
  }, [authService]);

  const logout = useCallback(async () => {
    console.log("🚪 [useMicrosoftAuth] Logout requested by component");
    try {
      await authService.logout();
      console.log("✅ [useMicrosoftAuth] Logout completed successfully");
    } catch (error) {
      console.error("💥 [useMicrosoftAuth] Logout failed:", error);
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