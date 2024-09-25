import {
  Button,
  LoadingIndicator,
  Rows,
  Title,
  Text,
  Box,
} from "@canva/app-ui-kit";
import { useMemo, useState, useEffect, useCallback } from "react";
import type { AccessTokenResponse } from "@canva/user";
import { auth } from "@canva/user";
import * as styles from "styles/components.css";

const scope = new Set(["openid"]);

export function App() {
  // initialize the OAuth client
  const oauth = useMemo(() => auth.initOauth(), []);

  const [accessToken, setAccessToken] = useState<
    AccessTokenResponse | undefined
  >(undefined);
  const [error, setError] = useState<string | null>(null);
  const loading = accessToken === undefined;

  useEffect(() => {
    // check if the user is already authenticated
    retrieveAndSetToken();
  }, [oauth]);

  const authorize = useCallback(async () => {
    setAccessToken(undefined);
    setError(null);
    try {
      await oauth.requestAuthorization({ scope });
      await retrieveAndSetToken();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  }, []);

  // you MUST call getAccessToken every time you need a token, as the token may expire.
  // Canva will handle caching and refreshing the token for you.
  const retrieveAndSetToken = useCallback(async (forceRefresh = false) => {
    try {
      setAccessToken(await oauth.getAccessToken({ forceRefresh }));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  }, []);

  const logout = useCallback(async () => {
    setAccessToken(undefined);
    await oauth.deauthorize();
    setAccessToken(null);
  }, []);

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
        ) : !accessToken ? (
          <Rows spacing="2u">
            <Title>Sign in required</Title>
            <Text>
              This example demonstrates how apps can allow users to authorize
              with the app via a third-party platform.
            </Text>
            <Text>
              To set up please see the README.md in the /examples/authentication
              folder
            </Text>
            <Text>
              To use "Example App", you must sign in with your "Example"
              account.
            </Text>
            <Button variant="primary" onClick={authorize}>
              Sign into Example
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
          </Rows>
        )}
      </Box>
    </div>
  );

  return result;
}
