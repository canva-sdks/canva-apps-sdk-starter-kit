import { useEffect, useState, useMemo, useCallback } from "react";
import type { AccessTokenResponse } from "@canva/user";
import { auth } from "@canva/user";
import {
  Text,
  Button,
  Rows,
  Box,
  Column,
  Columns,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  LoadingIndicator,
  Alert
} from "@canva/app-ui-kit";
import { AgentSearchTab } from "./components/agent_search_tab";
import { SearchableTab } from "./components/searchable_tab";
import ConfigurationService from "./services/config";
import * as styles from "styles/components.css";

const oauth_var = auth.initOauth();
// Microsoft Graph API scope for reading user profile
const scope = new Set(["https://graph.microsoft.com/User.Read"]);
const BACKEND_URL = `https://graph.microsoft.com/v1.0/me`;

interface UserProfile {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
  id?: string;
  givenName?: string;
  surname?: string;
  jobTitle?: string;
  officeLocation?: string;
  mobilePhone?: string;
}

export const App = () => {
  const [accessTokenResponse, setAccessTokenResponse] = useState<AccessTokenResponse>(null);
  const [error, setError] = useState<string | null>(null);
  const isAuthorized = useMemo(() => accessTokenResponse != null, [accessTokenResponse]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isCheckingExistingAuth, setIsCheckingExistingAuth] = useState(true);
  const [isInitializingMiddleware, setIsInitializingMiddleware] = useState(false);
  const [middlewareError, setMiddlewareError] = useState<string | null>(null);
  const [middlewareReady, setMiddlewareReady] = useState(false);

  const fetchUserProfile = useCallback(async (token: string) => {
    setError(null);
    try {
      const res = await fetch(BACKEND_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          setError("Access token expired, please log in again");
          await logout();
          return;
        }
        throw new Error(`Failed to fetch profile: ${res.status}`);
      }

      const data = await res.json();
      setUserProfile(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch user profile");
    }
  }, []);

  const initializeMiddlewareAuth = useCallback(async () => {
    try {
      setIsInitializingMiddleware(true);
      setMiddlewareError(null);
      console.log("Initializing middleware API authentication...");

      const configService = ConfigurationService.getInstance();
      await configService.initializeFromEnv();

      setMiddlewareReady(true);
      console.log("Middleware API authentication successful");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to initialize middleware API";
      console.error("Middleware API authentication failed:", errorMsg);
      setMiddlewareError(errorMsg);
      setMiddlewareReady(false);
      throw error;
    } finally {
      setIsInitializingMiddleware(false);
    }
  }, []);

  const retrieveAndSetToken = useCallback(async ({ forceRefresh = false } = {}) => {
    try {
      setIsLoading(true);
      const tokenResponse = await oauth_var.getAccessToken({ scope, forceRefresh });
      setAccessTokenResponse(tokenResponse);

      if (tokenResponse?.token) {
        // Fetch user profile
        await fetchUserProfile(tokenResponse.token);

        // CRITICAL: Only initialize middleware API auth AFTER Microsoft login succeeds
        await initializeMiddlewareAuth();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to get access token");
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile, initializeMiddlewareAuth]);

  const login = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      console.log("Starting Microsoft OAuth login flow...");
      const authorizeResponse = await oauth_var.requestAuthorization({ scope });

      if (authorizeResponse.status === "completed") {
        console.log("Microsoft OAuth authorization completed");
        // This will fetch profile AND initialize middleware API auth
        await retrieveAndSetToken();
      } else {
        console.log("Microsoft OAuth authorization not completed:", authorizeResponse.status);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(error instanceof Error ? error.message : "Login failed");
      setIsLoading(false);
    }
  }, [retrieveAndSetToken]);

  // Check for existing authentication session on mount and auto-trigger login if needed
  useEffect(() => {
    let mounted = true;

    const checkExistingAuth = async () => {
      if (!mounted) return;

      try {
        setIsCheckingExistingAuth(true);
        // Check if a token exists
        const tokenResponse = await oauth_var.getAccessToken({ scope });

        if (!mounted) return;

        if (tokenResponse?.token) {
          console.log("Found existing Microsoft OAuth session");
          setAccessTokenResponse(tokenResponse);
          await fetchUserProfile(tokenResponse.token);

          // Initialize middleware API auth with existing session
          await initializeMiddlewareAuth();

          if (mounted) {
            setIsCheckingExistingAuth(false);
          }
        } else {
          console.log("No existing Microsoft OAuth session found, auto-triggering login");
          setIsCheckingExistingAuth(false);
          // Automatically trigger the login flow
          await login();
        }
      } catch (error) {
        console.log("No existing authentication session, auto-triggering login");
        if (mounted) {
          setIsCheckingExistingAuth(false);
          // Automatically trigger the login flow
          await login();
        }
      }
    };

    checkExistingAuth();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  async function logout() {
    try {
      setIsLoading(true);
      console.log("Logging out...");

      // Deauthorize Microsoft OAuth
      await oauth_var.deauthorize();

      // Clear middleware API auth
      ConfigurationService.getInstance().reset();

      // Clear local state
      setAccessTokenResponse(null);
      setUserProfile(null);
      setError(null);
      setMiddlewareReady(false);
      setMiddlewareError(null);

      console.log("Logout successful");

      // Trigger login flow again after logout
      setIsLoading(false);
      setIsCheckingExistingAuth(false);
      await login();
    } catch (error) {
      console.error("Logout failed:", error);
      setError(error instanceof Error ? error.message : "Logout failed");
      setIsLoading(false);
    }
  }

  // Show loading while authenticating or checking auth
  if (isCheckingExistingAuth || !isAuthorized) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u" align="center">
          <LoadingIndicator size="medium" />
          <Text>
            {isCheckingExistingAuth
              ? "Checking authentication..."
              : "Authenticating with Microsoft..."}
          </Text>
          {error && (
            <Alert tone="critical">
              <Text>{error}</Text>
            </Alert>
          )}
        </Rows>
      </div>
    );
  }

  // Show loading while initializing middleware API
  if (isInitializingMiddleware || !middlewareReady) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u" align="center">
          <LoadingIndicator size="medium" />
          <Text>Setting up API connection...</Text>
          {middlewareError && (
            <Alert tone="critical">
              <Text>{middlewareError}</Text>
            </Alert>
          )}
        </Rows>
      </div>
    );
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="1u">
        <Box background="neutralLow" padding="1u" borderRadius="standard">
          <Columns spacing="1u" alignY="center">
            <Column>
              <Text>Hi {userProfile?.displayName || userProfile?.givenName || "Agent"}</Text>
            </Column>
            <Column width="content">
              <Button 
                variant="tertiary"
                onClick={logout}
              >
                Sign out
              </Button>
            </Column>
          </Columns>
        </Box>
        
        {/* Main App Content */}
        <Tabs>
          <TabList>
            <Tab id="agents">Agent Search</Tab>
            <Tab id="listings">Listings</Tab>
            <Tab id="market">Market Data</Tab>
          </TabList>
          <TabPanels>
            <TabPanel id="agents">
              <Box padding="3u">
                <AgentSearchTab userEmail={userProfile?.mail || userProfile?.userPrincipalName} />
              </Box>
            </TabPanel>
            <TabPanel id="listings">
              <Box padding="3u">
                <SearchableTab
                  endpoint="listings"
                  tabName="Listings"
                  userEmail={userProfile?.mail || userProfile?.userPrincipalName}
                />
              </Box>
            </TabPanel>
            <TabPanel id="market">
              <Box padding="3u">
                <SearchableTab endpoint="market-data" tabName="Market Data" />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Rows>
    </div>
  );
};