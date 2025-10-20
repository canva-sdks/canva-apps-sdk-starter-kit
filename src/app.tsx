import { useEffect, useState, useMemo, useCallback } from "react";
import type { AccessTokenResponse } from "@canva/user";
import { auth } from "@canva/user";
import {
  Text,
  Button,
  Rows,
  Title,
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
import { ApiConfigSetup } from "./components/api_config_setup";
import { useApiConfig } from "./hooks/use_api_config";
import ConfigurationService from "./services/config";
import * as styles from "styles/components.css";

const oauth_var = auth.initOauth();
const scope = new Set(["openid"]);
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
  const { isReady } = useApiConfig();

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
      console.log("Initializing middleware API authentication...");
      const configService = ConfigurationService.getInstance();
      await configService.initializeFromEnv();
      console.log("Middleware API authentication successful");
    } catch (error) {
      console.error("Middleware API authentication failed:", error);
      throw error;
    }
  }, []);

  const retrieveAndSetToken = async ({ forceRefresh = false } = {}) => {
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
  };

  // Check for existing authentication session on mount (but don't auto-login)
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        setIsCheckingExistingAuth(true);
        // Only check if a token exists, don't trigger auth flow
        const tokenResponse = await oauth_var.getAccessToken({ scope });

        if (tokenResponse?.token) {
          console.log("Found existing Microsoft OAuth session");
          setAccessTokenResponse(tokenResponse);
          await fetchUserProfile(tokenResponse.token);

          // Initialize middleware API auth with existing session
          await initializeMiddlewareAuth();
        } else {
          console.log("No existing Microsoft OAuth session found");
        }
      } catch (error) {
        console.log("No existing authentication session");
      } finally {
        setIsCheckingExistingAuth(false);
      }
    };

    checkExistingAuth();
  }, [fetchUserProfile, initializeMiddlewareAuth]);

  async function login() {
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
  }

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

      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      setError(error instanceof Error ? error.message : "Logout failed");
    } finally {
      setIsLoading(false);
    }
  }

  // Show loading while checking for existing auth session
  if (isCheckingExistingAuth) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u" align="center">
          <LoadingIndicator size="medium" />
          <Text>Checking authentication...</Text>
        </Rows>
      </div>
    );
  }

  // Show login screen if not authorized
  if (!isAuthorized) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="3u" align="center">
          <Title size="medium">Welcome to Axis Canva</Title>
          <Text alignment="center">
            Please sign in with your Microsoft account to continue
          </Text>

          {error && (
            <Alert tone="critical">
              <Text>{error}</Text>
            </Alert>
          )}

          <Button
            variant="primary"
            onClick={login}
            disabled={isLoading}
            stretch
          >
            {isLoading ? "Signing in..." : "Sign in with Microsoft"}
          </Button>
        </Rows>
      </div>
    );
  }

  // Show loading during authentication process
  if (isLoading) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u" align="center">
          <LoadingIndicator size="medium" />
          <Text>Completing authentication...</Text>
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
        {!isReady ? (
          <ApiConfigSetup />
        ) : (
          <Tabs>
            <TabList>
              <Tab id="agents">Agent Search</Tab>
              <Tab id="listings">Listings</Tab>
              <Tab id="market">Market Data</Tab>
            </TabList>
            <TabPanels>
              <TabPanel id="agents">
                <AgentSearchTab userEmail={userProfile?.mail || userProfile?.userPrincipalName} />
              </TabPanel>
              <TabPanel id="listings">
                <SearchableTab 
                  endpoint="listings" 
                  tabName="Listings" 
                  userEmail={userProfile?.mail || userProfile?.userPrincipalName}
                />
              </TabPanel>
              <TabPanel id="market">
                <SearchableTab endpoint="market-data" tabName="Market Data" />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Rows>
    </div>
  );
};