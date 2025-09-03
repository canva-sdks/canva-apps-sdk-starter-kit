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
  LoadingIndicator
} from "@canva/app-ui-kit";
import { AgentSearchTab } from "./components/agent_search_tab";
import { SearchableTab } from "./components/searchable_tab";
import { ApiConfigSetup } from "./components/api_config_setup";
import { useApiConfig } from "./hooks/use_api_config";
import * as styles from "styles/components.css";

const oauth = auth.initOauth();
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
          await retrieveAndSetToken({ forceRefresh: true });
          setError("Access token expired, please try again");
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

  const retrieveAndSetToken = async ({ forceRefresh = false } = {}) => {
    try {
      setIsLoading(true);
      const tokenResponse = await oauth.getAccessToken({ scope, forceRefresh });
      setAccessTokenResponse(tokenResponse);
      
      // Automatically fetch user profile when token is retrieved
      if (tokenResponse?.token) {
        await fetchUserProfile(tokenResponse.token);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to get access token");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // First try to get existing token
        const tokenResponse = await oauth.getAccessToken({ scope });
        
        if (tokenResponse?.token) {
          setAccessTokenResponse(tokenResponse);
          await fetchUserProfile(tokenResponse.token);
        } else {
          // If no token, automatically start login flow
          const authorizeResponse = await oauth.requestAuthorization({ scope });
          if (authorizeResponse.status === "completed") {
            await retrieveAndSetToken();
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Authentication failed");
      } finally {
        setIsLoading(false);
      }
    };
    
    setIsLoading(true);
    initAuth();
  }, [fetchUserProfile]);

  async function login() {
    setError(null);
    try {
      const authorizeResponse = await oauth.requestAuthorization({ scope });
      if (authorizeResponse.status === "completed") {
        await retrieveAndSetToken();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    }
  }

  async function logout() {
    try {
      await oauth.deauthorize();
      setAccessTokenResponse(null);
      setUserProfile(null);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Logout failed");
    }
  }

  if (error && !isAuthorized) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u" align="center">
          <Text variant="bold">Authentication Error</Text>
          <Text>{error}</Text>
          <Button 
            variant="primary" 
            onClick={login}
          >
            Try Again
          </Button>
        </Rows>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u" align="center">
          <LoadingIndicator size="medium" />
          <Text>Loading...</Text>
        </Rows>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u" align="center">
          <LoadingIndicator size="medium" />
          <Text>Authenticating...</Text>
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