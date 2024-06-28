import React from "react";
import { SearchableListView } from "@canva/app-components";
import { Alert, Box, Button, LoadingIndicator, Rows } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";
import { config } from "./config";
import { findResources } from "./adapter";
import styles from "./index.css";
import { Authentication, auth } from "@canva/user";

type AuthenticationState =
  | "authenticated"
  | "not_authenticated"
  | "checking"
  | "cancelled"
  | "error";

/**
 * This endpoint is defined in the ./backend/server.ts file. You need to
 * register the endpoint in the Developer Portal before sending requests.
 *
 * BACKEND_HOST is configured in the root .env file, for more information,
 * refer to the README.md.
 */
const AUTHENTICATION_CHECK_URL = `${BACKEND_HOST}/api/authentication/status`;

const checkAuthenticationStatus = async (
  auth: Authentication
): Promise<AuthenticationState> => {
  /**
   * Send a request to an endpoint that checks if the user is authenticated.
   * This is example code, intended to convey the basic idea. When implementing this in your app, you might want more advanced checks.
   *
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
      return "authenticated";
    } else {
      return "not_authenticated";
    }
  } catch (error) {
    console.error(error);
    return "error";
  }
};

export function App() {
  // Keep track of the user's authentication status.
  const [authState, setAuthState] =
    React.useState<AuthenticationState>("checking");

  React.useEffect(() => {
    setAuthState("checking");
    checkAuthenticationStatus(auth).then((status) => {
      setAuthState(status);
    });
  }, []);

  React.useEffect(() => {
    if (authState === "not_authenticated") {
      startAuthenticationFlow();
    }
  }, [authState]);

  const startAuthenticationFlow = async () => {
    try {
      const response = await auth.requestAuthentication();
      switch (response.status) {
        case "COMPLETED":
          setAuthState("authenticated");
          break;
        case "ABORTED":
          console.warn("Authentication aborted by user.");
          setAuthState("cancelled");
          break;
        case "DENIED":
          console.warn("Authentication denied by user", response.details);
          setAuthState("cancelled");
          break;
      }
    } catch (e) {
      console.error(e);
      setAuthState("error");
    }
  };

  if (authState === "error") {
    console.warn(
      "Warning: authentication not enabled on this app. Please enable auth with the instructions in README"
    );
    // Comment this next line out for production apps
    setAuthState("authenticated");
  }

  // If user has denied or aborted auth flow
  if (authState === "cancelled") {
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

  return authState === "authenticated" ? (
    <Box className={styles.rootWrapper}>
      <SearchableListView config={config} findResources={findResources} />
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
