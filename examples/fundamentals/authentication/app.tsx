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
} from "@canva/app-ui-kit";
import { useMemo, useState, useEffect, useCallback } from "react";
import type { AccessTokenResponse } from "@canva/user";
import { auth } from "@canva/user";
import * as styles from "styles/components.css";

const scope = new Set(["openid"]);

const BACKEND_URL = `${BACKEND_HOST}/custom-route`;

export function App() {
  // Initialize the Canva OAuth client for user authentication
  const oauth = useMemo(() => auth.initOauth(), []);

  const [accessTokenResponse, setAccessTokenResponse] = useState<
    AccessTokenResponse | undefined
  >(undefined);
  const [error, setError] = useState<string | null>(null);
  const loading = accessTokenResponse === undefined;
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined,
  );

  useEffect(() => {
    // Check if the user is already authenticated when the component mounts
    retrieveAndSetToken();
  }, [oauth]);

  const authorize = useCallback(async () => {
    setAccessTokenResponse(undefined);
    setError(null);
    try {
      // Trigger the OAuth authorization flow - this opens Canva's authorization UI
      await oauth.requestAuthorization({ scope });
      await retrieveAndSetToken();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  }, []);

  // IMPORTANT: Always call getAccessToken when you need a token - tokens can expire.
  // Canva automatically handles caching and refreshing tokens for you.
  const retrieveAndSetToken = useCallback(async (forceRefresh = false) => {
    try {
      setAccessTokenResponse(
        await oauth.getAccessToken({ forceRefresh, scope }),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  }, []);

  const logout = useCallback(async () => {
    setAccessTokenResponse(undefined);
    // Revoke the user's authorization and clear stored tokens
    await oauth.deauthorize();
    setAccessTokenResponse(null);
  }, []);

  const fetchData = useCallback(async () => {
    const accessToken = accessTokenResponse?.token;
    if (!accessToken) {
      return;
    }

    try {
      // Example of using the access token to make authenticated API requests
      const res = await fetch(BACKEND_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      setResponseBody(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  }, [accessTokenResponse]);

  const result = (
    <div className={styles.scrollContainer}>
      <Box
        justifyContent="center"
        width="full"
        alignItems="center"
        display="flex"
        height="full"
      >
        {error ? (
          <Rows spacing="2u">
            <Title>Authorization error</Title>
            <Text>{error}</Text>
            <Button variant="primary" onClick={authorize}>
              Try again
            </Button>
          </Rows>
        ) : loading ? (
          <LoadingIndicator />
        ) : !accessTokenResponse ? (
          <Rows spacing="2u">
            <Title>Sign in required</Title>
            <Text>
              This example demonstrates how apps can allow users to authorize
              with the app via a third-party platform.
            </Text>
            <Text>
              To set up please see the README.md in the
              /examples/fundamentals/authentication folder
            </Text>
            <Text>
              To use "Example App", you must sign in with your "Example"
              account.
            </Text>
            <Button variant="primary" onClick={authorize}>
              Sign in to Example
            </Button>
          </Rows>
        ) : (
          <Rows spacing="2u">
            <Text>Logged in!</Text>
            <Button
              variant="primary"
              onClick={async () => {
                logout();
              }}
            >
              Log out
            </Button>
            <Button variant="primary" onClick={fetchData}>
              Fetch data
            </Button>
            {responseBody ? (
              <FormField
                label="Response"
                value={JSON.stringify(responseBody, null, 2)}
                control={(props) => (
                  <MultilineInput {...props} maxRows={5} autoGrow readOnly />
                )}
              />
            ) : null}
          </Rows>
        )}
      </Box>
    </div>
  );

  return result;
}
