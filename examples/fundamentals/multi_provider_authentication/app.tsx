// For usage information, see the README.md file.
import {
  Button,
  LoadingIndicator,
  Rows,
  Title,
  Text,
  Box,
  MultilineInput,
  FormField,
  Columns,
  Column,
} from "@canva/app-ui-kit";
import { useMemo, useState, useEffect, useCallback } from "react";
import type { AccessTokenResponse } from "@canva/user";
import { auth } from "@canva/user";
import * as styles from "styles/components.css";

// Provider names as defined in the Developer Portal
const META_PROVIDER = "meta" as const;
const GOOGLE_PROVIDER = "google" as const;

const metaScope = new Set(["openid"]);
const googleScope = new Set(["openid", "profile", "email"]);

const META_BACKEND_URL = `${BACKEND_HOST}/meta-route`;
const GOOGLE_BACKEND_URL = `${BACKEND_HOST}/google-route`;

type ProviderStatus = {
  accessTokenResponse: AccessTokenResponse | null | undefined;
  error: string | null;
  loading: boolean;
  responseBody: unknown | undefined;
};

export function App() {
  // Initialize separate OAuth clients for each provider
  const metaOauth = useMemo(
    () => auth.initOauth({ type: "single_account", provider: META_PROVIDER }),
    [],
  );
  const googleOauth = useMemo(
    () =>
      auth.initOauth({
        type: "single_account",
        provider: GOOGLE_PROVIDER,
      }),
    [],
  );

  // Track state for each provider independently
  const [metaStatus, setMetaStatus] = useState<ProviderStatus>({
    accessTokenResponse: undefined,
    error: null,
    loading: false,
    responseBody: undefined,
  });

  const [googleStatus, setGoogleStatus] = useState<ProviderStatus>({
    accessTokenResponse: undefined,
    error: null,
    loading: false,
    responseBody: undefined,
  });

  useEffect(() => {
    // Check if users are already authenticated when the component mounts
    retrieveAndSetToken(META_PROVIDER);
    retrieveAndSetToken(GOOGLE_PROVIDER);
  }, [metaOauth, googleOauth]);

  const getOauthClient = (
    provider: typeof META_PROVIDER | typeof GOOGLE_PROVIDER,
  ) => {
    return provider === META_PROVIDER ? metaOauth : googleOauth;
  };

  const getScope = (
    provider: typeof META_PROVIDER | typeof GOOGLE_PROVIDER,
  ) => {
    return provider === META_PROVIDER ? metaScope : googleScope;
  };

  const getStatus = (
    provider: typeof META_PROVIDER | typeof GOOGLE_PROVIDER,
  ) => {
    return provider === META_PROVIDER ? metaStatus : googleStatus;
  };

  const setStatus = (
    provider: typeof META_PROVIDER | typeof GOOGLE_PROVIDER,
    updates: Partial<ProviderStatus>,
  ) => {
    if (provider === META_PROVIDER) {
      setMetaStatus((prev) => ({ ...prev, ...updates }));
    } else {
      setGoogleStatus((prev) => ({ ...prev, ...updates }));
    }
  };

  const authorize = useCallback(
    async (provider: typeof META_PROVIDER | typeof GOOGLE_PROVIDER) => {
      const oauth = getOauthClient(provider);
      const scope = getScope(provider);

      setStatus(provider, {
        accessTokenResponse: undefined,
        error: null,
        loading: true,
      });
      try {
        // Trigger the OAuth authorization flow for the specific provider
        await oauth.requestAuthorization({ scope });
        await retrieveAndSetToken(provider);
      } catch (error) {
        setStatus(provider, {
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        });
      }
    },
    [metaOauth, googleOauth],
  );

  // IMPORTANT: Always call getAccessToken when you need a token - tokens can expire.
  // Canva automatically handles caching and refreshing tokens for you.
  const retrieveAndSetToken = useCallback(
    async (
      provider: typeof META_PROVIDER | typeof GOOGLE_PROVIDER,
      forceRefresh = false,
    ) => {
      const oauth = getOauthClient(provider);
      const scope = getScope(provider);

      setStatus(provider, { loading: true });
      try {
        const accessTokenResponse = await oauth.getAccessToken({
          forceRefresh,
          scope,
        });
        setStatus(provider, {
          accessTokenResponse,
          loading: false,
        });
      } catch (error) {
        setStatus(provider, {
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        });
      }
    },
    [metaOauth, googleOauth],
  );

  const logout = useCallback(
    async (provider: typeof META_PROVIDER | typeof GOOGLE_PROVIDER) => {
      const oauth = getOauthClient(provider);
      setStatus(provider, {
        accessTokenResponse: undefined,
        loading: true,
      });
      // Revoke the user's authorization and clear stored tokens for the specific provider
      await oauth.deauthorize();
      setStatus(provider, {
        accessTokenResponse: null,
        loading: false,
        responseBody: undefined,
      });
    },
    [metaOauth, googleOauth],
  );

  const fetchData = useCallback(
    async (provider: typeof META_PROVIDER | typeof GOOGLE_PROVIDER) => {
      const status = getStatus(provider);
      const accessToken = status.accessTokenResponse?.token;
      if (!accessToken) {
        return;
      }

      const backendUrl =
        provider === META_PROVIDER ? META_BACKEND_URL : GOOGLE_BACKEND_URL;

      setStatus(provider, { loading: true });
      try {
        // Example of using the access token to make authenticated API requests
        const res = await fetch(backendUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();
        setStatus(provider, {
          responseBody: data,
          loading: false,
        });
      } catch (error) {
        setStatus(provider, {
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        });
      }
    },
    [metaStatus.accessTokenResponse, googleStatus.accessTokenResponse],
  );

  const renderProviderSection = (
    provider: typeof META_PROVIDER | typeof GOOGLE_PROVIDER,
    providerDisplayName: string,
  ) => {
    const status = getStatus(provider);
    const loading = status.loading && status.accessTokenResponse === undefined;
    const isConnected = status.accessTokenResponse != null;

    return (
      <Box
        padding="3u"
        border="standard"
        borderRadius="standard"
        background="neutral"
      >
        <Rows spacing="2u">
          <Title size="small">{providerDisplayName} Provider</Title>

          {status.error ? (
            <Rows spacing="1u">
              <Text tone="critical">Error: {status.error}</Text>
              <Button
                variant="primary"
                onClick={() => authorize(provider)}
                disabled={loading}
              >
                Try again
              </Button>
            </Rows>
          ) : loading ? (
            <LoadingIndicator />
          ) : !isConnected ? (
            <Rows spacing="2u">
              <Text>
                Connect your {providerDisplayName} account to use this provider.
              </Text>
              <Button
                variant="primary"
                onClick={() => authorize(provider)}
                disabled={loading}
              >
                {`Sign in to ${providerDisplayName}`}
              </Button>
            </Rows>
          ) : (
            <Rows spacing="2u">
              <Text>Connected to {providerDisplayName}!</Text>
              <Columns spacing="1u">
                <Column>
                  <Button
                    variant="secondary"
                    onClick={() => logout(provider)}
                    disabled={loading}
                  >
                    Log out
                  </Button>
                </Column>
                <Column>
                  <Button
                    variant="primary"
                    onClick={() => fetchData(provider)}
                    disabled={loading}
                  >
                    Fetch data
                  </Button>
                </Column>
              </Columns>
              {status.responseBody ? (
                <FormField
                  label="Response"
                  value={JSON.stringify(status.responseBody, null, 2)}
                  control={(props) => (
                    <MultilineInput {...props} maxRows={5} autoGrow readOnly />
                  )}
                />
              ) : null}
            </Rows>
          )}
        </Rows>
      </Box>
    );
  };

  const result = (
    <div className={styles.scrollContainer}>
      <Box
        justifyContent="center"
        width="full"
        alignItems="center"
        display="flex"
        height="full"
      >
        <Rows spacing="3u">
          <Rows spacing="2u">
            <Title>Multi-provider authentication</Title>
            <Text>
              This example demonstrates how apps can allow users to authorize
              with multiple OAuth providers (Meta and Google) simultaneously.
            </Text>
            <Text>
              To set up please see the README.md in the
              /examples/fundamentals/multi_provider_authentication folder
            </Text>
          </Rows>

          {renderProviderSection(META_PROVIDER, "Meta")}
          {renderProviderSection(GOOGLE_PROVIDER, "Google")}
        </Rows>
      </Box>
    </div>
  );

  return result;
}
