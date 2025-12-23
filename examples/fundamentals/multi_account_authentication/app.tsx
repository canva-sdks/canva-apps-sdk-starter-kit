// For usage information, see the README.md file.
import {
  Avatar,
  Button,
  Columns,
  Column,
  LoadingIndicator,
  Rows,
  Title,
  Text,
  Box,
} from "@canva/app-ui-kit";
import { useMemo, useState, useEffect, useCallback } from "react";
import { auth } from "@canva/user";
import type { OauthAccount } from "@canva/user";
import * as styles from "styles/components.css";
import { AccountSelector, View } from "./account_selector";

// Provider name as defined in the Developer Portal
const PROVIDER = "my_provider_name" as const;

const scope = new Set(["profile", "email", "openid"]);
const BASE_URL = `${BACKEND_HOST}/userinfo`;

export function App() {
  const [accounts, setAccounts] = useState<OauthAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.Switcher);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );

  const oauth = useMemo(
    // Initialize the Canva OAuth client for user authentication
    () => auth.initOauth({ type: "multi_account", provider: PROVIDER }),
    [],
  );

  const retrieveAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await oauth.getAccounts();

      setAccounts(res.accounts);

      // Set the first account as selected if none is selected
      if (!selectedAccountId && res.accounts.length > 0) {
        setSelectedAccountId(res.accounts[0]?.id ?? null);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [selectedAccountId, oauth]);

  useEffect(() => {
    // Check if the user is already authenticated when the component mounts
    retrieveAccounts();
  }, [oauth, retrieveAccounts]);

  const authorize = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await oauth.requestAuthorization({
        scope,
        queryParams: { access_type: "offline", prompt: "login" },
      });
      // Call retrieveAccounts after authorization
      await retrieveAccounts();

      // Reset the view to Switcher after successful authorization
      setCurrentView(View.Switcher);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [oauth, retrieveAccounts]);

  const handleAccountSwitch = useCallback((accountId: string) => {
    setSelectedAccountId(accountId);
    // Clear profile data when switching accounts
    setProfile(null);
    setProfileError(null);
  }, []);

  const handleManageAccounts = useCallback(() => {
    setCurrentView(View.Manage);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentView(View.Switcher);
  }, []);

  const handleDisconnect = useCallback(
    async (accountId: string) => {
      const account = accounts.find((acc) => acc.id === accountId);
      if (account) {
        setLoading(true);
        try {
          await account.deauthorize();
          // If we're disconnecting the selected account, select the first remaining account
          if (selectedAccountId === accountId) {
            const remainingAccounts = accounts.filter(
              (acc) => acc.id !== accountId,
            );
            setSelectedAccountId(remainingAccounts[0]?.id ?? null);
          }
          // Clear profile data when disconnecting any account
          setProfile(null);
          setProfileError(null);
          await retrieveAccounts();
        } finally {
          setLoading(false);
        }
      }
    },
    [accounts, selectedAccountId, retrieveAccounts],
  );

  const handleSignInAgain = useCallback(
    async (accountId: string) => {
      await authorize();
    },
    [authorize],
  );

  const handleAddAccount = useCallback(async () => {
    await authorize();
  }, [authorize]);

  const fetchProfile = useCallback(async (account: OauthAccount) => {
    setLoading(true);
    setProfileError(null);
    setProfile(null);

    try {
      // Get access token for the account using the correct OAuth client
      const tokenResponse = await account.getAccessToken({ scope });

      if (!tokenResponse) {
        throw new Error("Failed to get access token");
      }

      // Make request to Auth0 userinfo endpoint
      const response = await fetch(`${BASE_URL}/userinfo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenResponse.token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const profileData = await response.json();
      // Add provider information to the profile data for display
      setProfile(profileData);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const result = (
    <div className={styles.scrollContainer}>
      <Box
        justifyContent="center"
        width="full"
        height="full"
        alignItems="center"
        display="flex"
      >
        {error ? (
          <Rows spacing="2u">
            <Title>Authorization error</Title>
            <Text>{error}</Text>
            <Button variant="primary" onClick={() => authorize()}>
              Try again
            </Button>
          </Rows>
        ) : loading ? (
          <LoadingIndicator />
        ) : accounts.length === 0 ? (
          <Rows spacing="2u">
            <Title>Sign in required</Title>
            <Text>
              This example demonstrates how apps can allow users to authorize
              with the app via a third-party platform.
            </Text>
            <Text>
              To set up please see the README.md in the
              /examples/fundamentals/multi_account_authentication folder
            </Text>
            <Text>
              To use "Example App", you must sign in with your "Example"
              account.
            </Text>
            <Button variant="primary" onClick={() => authorize()}>
              Sign in to Example
            </Button>
          </Rows>
        ) : (
          <Rows spacing="2u">
            <Title>Auth0 Account Switcher</Title>
            <Text>
              Switch between your connected Auth0 accounts or manage your
              account connections.
            </Text>

            <AccountSelector
              currentView={currentView}
              setCurrentView={setCurrentView}
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              triggerLabel="Switch Account"
              appName="Auth0"
              onAccountSwitch={handleAccountSwitch}
              onAddAccount={handleAddAccount}
              onSignInAgain={handleSignInAgain}
              onManageAccounts={handleManageAccounts}
              onBack={handleBack}
              onDisconnect={handleDisconnect}
            />

            {/* Show selected account info */}
            {selectedAccountId && (
              <Box
                padding="2u"
                border="standard"
                borderRadius="standard"
                background="neutral"
              >
                <Rows spacing="2u">
                  <Title size="small">Selected Account</Title>
                  {(() => {
                    const selectedAccount = accounts.find(
                      (acc) => acc.id === selectedAccountId,
                    );
                    return selectedAccount ? (
                      <Columns spacing="2u" alignY="center">
                        <Column width="content">
                          <Avatar
                            name={selectedAccount.displayName}
                            photo={selectedAccount.avatarUrl}
                          />
                        </Column>
                        <Column>
                          <Rows spacing="1u">
                            <Text size="medium">
                              {selectedAccount.displayName}
                            </Text>
                            <Text size="small">
                              {selectedAccount.principal}
                            </Text>
                          </Rows>
                        </Column>
                        <Column width="content">
                          <Button
                            variant="primary"
                            onClick={() => fetchProfile(selectedAccount)}
                            disabled={loading}
                          >
                            {loading ? "Fetching..." : "Fetch Profile"}
                          </Button>
                        </Column>
                      </Columns>
                    ) : null;
                  })()}
                </Rows>
              </Box>
            )}

            {/* Profile Display Section */}
            {(profile || profileError || loading) && (
              <Box
                padding="3u"
                border="standard"
                borderRadius="standard"
                background="neutral"
              >
                <Rows spacing="2u">
                  <Title size="small">Profile Information</Title>

                  {loading && (
                    <Box display="flex" justifyContent="center">
                      <LoadingIndicator />
                    </Box>
                  )}

                  {profileError && (
                    <Box padding="2u" borderRadius="standard" border="standard">
                      <Text>Error: {profileError}</Text>
                    </Box>
                  )}

                  {profile && (
                    <Box
                      padding="2u"
                      background="neutral"
                      borderRadius="standard"
                    >
                      <Text size="small">
                        <pre
                          style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}
                        >
                          {JSON.stringify(profile, null, 2)}
                        </pre>
                      </Text>
                    </Box>
                  )}
                </Rows>
              </Box>
            )}
          </Rows>
        )}
      </Box>
    </div>
  );

  return result;
}
