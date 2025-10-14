import { useState, useEffect, useCallback } from "react";
import ConfigurationService from "../services/config";

interface UseApiConfigReturn {
  isReady: boolean;
  isInitializing: boolean;
  error: string | null;
  status: {
    initialized: boolean;
    apiReady: boolean;
    authStatus: {
      configured: boolean;
      hasValidToken: boolean;
      currentToken: string | null;
    };
  };
  retry: () => Promise<void>;
}

export const useApiConfig = (): UseApiConfigReturn => {
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(() => ConfigurationService.getInstance().getStatus());

  const configService = ConfigurationService.getInstance();

  const updateStatus = useCallback(() => {
    const currentStatus = configService.getStatus();
    setStatus(currentStatus);
    setIsReady(currentStatus.initialized && currentStatus.apiReady);
  }, [configService]);

  const initializeFromEnv = useCallback(async () => {
    if (isInitializing) {
      return; // Prevent multiple simultaneous initializations
    }

    setIsInitializing(true);
    setError(null);

    try {
      await configService.initializeFromEnv();
      updateStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Environment variables AGENCY_CLIENT_ID and AGENCY_CLIENT_SECRET must be set";
      setError(errorMessage);
      setIsReady(false);
    } finally {
      setIsInitializing(false);
    }
  }, [configService, isInitializing, updateStatus]);

  const retry = useCallback(async () => {
    await initializeFromEnv();
  }, [initializeFromEnv]);

  // Check status on mount and periodically
  useEffect(() => {
    updateStatus();

    // Check status every 5 seconds to detect token expiry
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, [updateStatus]);

  // REMOVED: Auto-initialization on mount
  // The middleware API auth is now explicitly initialized AFTER Microsoft OAuth completes
  // See app.tsx -> initializeMiddlewareAuth() which is called after successful Microsoft login

  return {
    isReady,
    isInitializing,
    error,
    status,
    retry,
  };
};