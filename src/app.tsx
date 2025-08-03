import { useEffect, useState, useMemo, useCallback } from "react";
import type { AccessTokenResponse } from "@canva/user";
import { auth } from "@canva/user";
import { Text, Button, Rows, Title, FormField, MultilineInput, Tabs, Tab, TabList, TabPanels, TabPanel, Box, Column, Columns } from "@canva/app-ui-kit";
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
    retrieveAndSetToken();
  }, []);

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

  const ProfileTab = () => (
    <Box paddingTop="2u">
      <Rows spacing="2u">
        <Title size="small">User Profile</Title>
        {userProfile ? (
          <Columns spacing="2u">
            <Column>
              <Rows spacing="1u">
                <Text size="small" tone="tertiary">Display Name</Text>
                <Text>{userProfile.displayName || "N/A"}</Text>
              </Rows>
            </Column>
            <Column>
              <Rows spacing="1u">
                <Text size="small" tone="tertiary">Email</Text>
                <Text>{userProfile.mail || userProfile.userPrincipalName || "N/A"}</Text>
              </Rows>
            </Column>
          </Columns>
        ) : (
          <Text tone="tertiary">Loading profile...</Text>
        )}
        {userProfile && (
          <>
            <Columns spacing="2u">
              <Column>
                <Rows spacing="1u">
                  <Text size="small" tone="tertiary">First Name</Text>
                  <Text>{userProfile.givenName || "N/A"}</Text>
                </Rows>
              </Column>
              <Column>
                <Rows spacing="1u">
                  <Text size="small" tone="tertiary">Last Name</Text>
                  <Text>{userProfile.surname || "N/A"}</Text>
                </Rows>
              </Column>
            </Columns>
            {(userProfile.jobTitle || userProfile.officeLocation) && (
              <Columns spacing="2u">
                <Column>
                  <Rows spacing="1u">
                    <Text size="small" tone="tertiary">Job Title</Text>
                    <Text>{userProfile.jobTitle || "N/A"}</Text>
                  </Rows>
                </Column>
                <Column>
                  <Rows spacing="1u">
                    <Text size="small" tone="tertiary">Office Location</Text>
                    <Text>{userProfile.officeLocation || "N/A"}</Text>
                  </Rows>
                </Column>
              </Columns>
            )}
          </>
        )}
      </Rows>
    </Box>
  );

  const RawDataTab = () => (
    <Box paddingTop="2u">
      <Rows spacing="2u">
        <Title size="small">Raw API Response</Title>
        {userProfile ? (
          <FormField
            label="Microsoft Graph API Response"
            value={JSON.stringify(userProfile, null, 2)}
            control={(props) => (
              <MultilineInput {...props} maxRows={10} autoGrow readOnly />
            )}
          />
        ) : (
          <Text tone="tertiary">No data available</Text>
        )}
      </Rows>
    </Box>
  );

  const ActionsTab = () => (
    <Box paddingTop="2u">
      <Rows spacing="2u">
        <Title size="small">Actions</Title>
        <Button variant="secondary" onClick={() => retrieveAndSetToken({ forceRefresh: true })}>
          Refresh Token
        </Button>
        <Button variant="secondary" onClick={() => fetchUserProfile(accessTokenResponse?.token || "")}>
          Refresh Profile
        </Button>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </Rows>
    </Box>
  );

  if (error && !isAuthorized) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u">
          <Title>Authorization Error</Title>
          <Text tone="critical">{error}</Text>
          <Button variant="primary" onClick={login}>
            Try Again
          </Button>
        </Rows>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u">
          <Text>Loading...</Text>
        </Rows>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u">
          <Title>Microsoft Authentication</Title>
          <Text>Sign in with your Microsoft account to continue</Text>
          <Button variant="primary" onClick={login}>
            Sign in with Microsoft
          </Button>
        </Rows>
      </div>
    );
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Rows spacing="1u">
          <Title>Microsoft Account Connected</Title>
          {userProfile && (
            <Text tone="tertiary">Signed in as {userProfile.displayName || userProfile.mail || "Microsoft User"}</Text>
          )}
        </Rows>
        
        <Tabs>
          <TabList>
            <Tab id="profile">Profile</Tab>
            <Tab id="raw">Raw Data</Tab>
            <Tab id="actions">Actions</Tab>
          </TabList>
          <TabPanels>
            <TabPanel id="profile">
              <ProfileTab />
            </TabPanel>
            <TabPanel id="raw">
              <RawDataTab />
            </TabPanel>
            <TabPanel id="actions">
              <ActionsTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Rows>
    </div>
  );
};