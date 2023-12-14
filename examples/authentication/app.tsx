import type { Authentication } from "@canva/user";
import { auth } from "@canva/user";
import { Box, Button, Rows, Text, Title } from "@canva/app-ui-kit";
import React from "react";
import styles from "styles/components.css";

type State = "authenticated" | "not_authenticated" | "checking" | "error";

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
): Promise<State> => {
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

export const App = () => {
  // Keep track of the user's authentication status.
  const [state, setState] = React.useState<State>("checking");

  React.useEffect(() => {
    checkAuthenticationStatus(auth).then((status) => {
      setState(status);
    });
  }, []);

  const startAuthenticationFlow = async () => {
    // Start the authentication flow
    try {
      const response = await auth.requestAuthentication();
      switch (response.status) {
        case "COMPLETED":
          setState("authenticated");
          break;
        case "ABORTED":
          console.warn("Authentication aborted by user.");
          setState("not_authenticated");
          break;
        case "DENIED":
          console.warn("Authentication denied by user", response.details);
          setState("not_authenticated");
          break;
      }
    } catch (e) {
      console.error(e);
      setState("error");
    }
  };

  if (state === "error") {
    return (
      <div className={styles.scrollContainer}>
        <Text>
          <Text variant="bold" tagName="span">
            Something went wrong.
          </Text>{" "}
          Check the JavaScript Console for details.
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can allow users to authenticate
          with the app via a third-party platform.
        </Text>
        <Text>
          To set up please see the README.md in the /examples/authentication
          folder
        </Text>
        <Rows spacing="1u">
          <Title size="small">Try the authentication flow</Title>
          <Text size="small" tone="tertiary">
            To test the authentication flow, click the button below. The
            username is "username" and the password is "password".
          </Text>
        </Rows>
        <Box>
          <Text alignment="center">{createAuthenticationMessage(state)}</Text>
        </Box>
        <Button
          variant="primary"
          onClick={startAuthenticationFlow}
          disabled={state === "authenticated" || state === "checking"}
          stretch
        >
          Start authentication flow
        </Button>
      </Rows>
    </div>
  );
};

const createAuthenticationMessage = (state: State) => {
  switch (state) {
    case "checking":
      return "Checking authentication status...";
    case "authenticated":
      return "You are authenticated!";
    case "not_authenticated":
      return "You are not authenticated.";
  }
};
