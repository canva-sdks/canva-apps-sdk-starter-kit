import React, { useState, useEffect } from "react";
import { SearchableListView } from "@canva/app-components";
import { Alert, Box, Button, LoadingIndicator, Rows } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";
import { DASH_CONFIG } from "./config";
import { findResources } from "./adapter";
import styles from "./index.css";
import { Authentication, auth } from "@canva/user";

enum AuthenticationState {
  Authenticated,
  Unauthenticated,
  Checking,
  Cancelled,
  Error
}

/**
 * BACKEND_HOST is configured in the root .env file. For more information,
 * refer to the README.md.
 */
const AUTHENTICATION_CHECK_URL = `${BACKEND_HOST}/api/authentication/status`;

const checkAuthenticationStatus = async (auth: Authentication): Promise<AuthenticationState> => {
  /**
   * When implementing this in your app, you might want more advanced checks.
   * Note: You must register the provided endpoint via the Developer Portal.
   */
  try {
    const token = await auth.getCanvaUserToken();
    const res = await fetch(AUTHENTICATION_CHECK_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
    });
    const body = await res.json();

    if (body?.isAuthenticated) {
      return AuthenticationState.Authenticated;
    } else {
      return AuthenticationState.Unauthenticated;
    }
  } catch (error) {
    console.error(error);
    return AuthenticationState.Error;
  }
};

const startAuthenticationFlow = async (): Promise<AuthenticationState> => {
  try {
    const response = await auth.requestAuthentication();
    switch (response.status) {
      case "COMPLETED":
        return AuthenticationState.Authenticated;
      case "ABORTED":
        console.warn("Authentication aborted by user.");
        return AuthenticationState.Cancelled;
      case "DENIED":
        console.warn("Authentication denied by user", response.details);
        return AuthenticationState.Cancelled;
    }
  } catch (e) {
    console.error(e);
    return AuthenticationState.Error;
  }
};

export function App() {

  const [authState, setAuthState] = useState<AuthenticationState>(AuthenticationState.Checking);

  useEffect(() => {
    setAuthState(AuthenticationState.Checking);
    checkAuthenticationStatus(auth)
        .then(status => {
          setAuthState(status);
        });
  }, []);

  useEffect(() => {
    if (authState === AuthenticationState.Unauthenticated) {
      startAuthenticationFlow()
          .then(status => {
            setAuthState(status);
          });
    }
  }, [authState]);

  if (authState === AuthenticationState.Error) {
    console.warn(
      "Warning: authentication not enabled on this app. Please enable auth with the instructions in README"
    );
    // TODO: Comment this next line out for production app
    setAuthState(AuthenticationState.Authenticated);
  }

  // If user has denied or aborted auth flow
  if (authState === AuthenticationState.Cancelled) {
    return (
      <Box paddingEnd="2u" height="full" className={styles.centerInPage}>
        <Rows spacing="2u" align="center">
          <Alert tone="critical">
            Something went wrong while authenticating
          </Alert>
          <Button variant="primary" onClick={startAuthenticationFlow} stretch>
            Start authentication flow
          </Button>
        </Rows>
      </Box>
    );
  }

  return authState === AuthenticationState.Authenticated ? (
    <Box className={styles.rootWrapper}>
      <SearchableListView config={DASH_CONFIG} findResources={findResources} />
    </Box>
  ) : (
    <Box
      width="full"
      height="full"
      paddingTop="1u"
      className={styles.centerInPage}
    >
      <LoadingIndicator size="large" />
    </Box>
  );
}
