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
import { useMemo, useState, useCallback } from "react";
import { auth } from "@canva/user";
import type { OauthAccount } from "@canva/user";
import * as styles from "styles/components.css";
import { OauthAccountSwitcher } from "@canva/app-components";

// Provider name as defined in the Developer Portal
const PROVIDER = "my_provider_name" as const;

const scope = new Set(["profile", "email", "openid"]);
const BASE_URL = BACKEND_HOST;

export function App() {
  const [selectedAccount, setSelectedAccount] = useState<OauthAccount | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const oauth = useMemo(
    // Initialize the Canva OAuth client for user authentication
    () => auth.initOauth({ type: "multi_account", provider: PROVIDER }),
    [],
  );

  const handleAccountSwitch = useCallback((account: OauthAccount | null) => {
    setSelectedAccount(account);
    // Clear profile data when switching accounts or when no account is active
    setProfile(null);
    setProfileError(null);
  }, []);

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

      // Fetch profile from your backend using the account access token
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
      setProfile(profileData);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Box
        justifyContent="center"
        width="full"
        height="full"
        alignItems="center"
        display="flex"
      >
        <Rows spacing="2u">
          <Title>Multi-account authentication</Title>
          <Text>
            {selectedAccount
              ? "Switch between your linked accounts or manage your connections."
              : "To get started, sign in using the button below."}
          </Text>

          <OauthAccountSwitcher
            oauth={oauth}
            scope={scope}
            authorizationQueryParams={{
              access_type: "offline",
              prompt: "login",
            }}
            signInLabel="Sign in"
            triggerLabel="Switch Account"
            appName="Multi-account demo"
            onAccountSwitch={handleAccountSwitch}
          />

          {selectedAccount ? (
            <>
              <Box
                padding="2u"
                border="standard"
                borderRadius="standard"
                background="neutral"
              >
                <Rows spacing="2u">
                  <Title size="small">Selected Account</Title>
                  <Columns spacing="2u" alignY="center">
                    <Column width="content">
                      <Avatar
                        name={selectedAccount.displayName}
                        photo={selectedAccount.avatarUrl}
                      />
                    </Column>
                    <Column>
                      <Rows spacing="1u">
                        <Text size="medium">{selectedAccount.displayName}</Text>
                        <Text size="small">{selectedAccount.principal}</Text>
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
                </Rows>
              </Box>

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
                      <Box
                        padding="2u"
                        borderRadius="standard"
                        border="standard"
                      >
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
            </>
          ) : null}
        </Rows>
      </Box>
    </div>
  );
}
