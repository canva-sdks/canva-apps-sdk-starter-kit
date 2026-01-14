import {
  Box,
  Button,
  LoadingIndicator,
  Rows,
  Text,
  Title,
} from "@canva/app-ui-kit";
import { useCallback, useEffect, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { scope } from "src/api";
import { Header } from "src/components";
import { Paths } from "src/routes/paths";
import * as styles from "styles/components.css";
import { useAppContext } from "../context";

export const Login = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { oauth, setAccessToken, isAuthenticated } = useAppContext();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate(Paths.ENTRYPOINT);
      return;
    }

    // check if the user is already authenticated
    retrieveAndSetToken();
  }, [isAuthenticated]);

  const authorize = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await oauth.requestAuthorization({ scope });
      await retrieveAndSetToken();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      setLoading(false);
    }
  }, [oauth]);

  // you MUST call getAccessToken every time you need a token, as the token may expire.
  // Canva will handle caching and refreshing the token for you.
  const retrieveAndSetToken = useCallback(
    async (forceRefresh = false) => {
      try {
        const token = await oauth.getAccessToken({ forceRefresh, scope });
        setAccessToken(token);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
        setLoading(false);
      }
    },
    [oauth, setAccessToken],
  );

  return (
    <div className={styles.scrollContainer}>
      <Box
        justifyContent="center"
        width="full"
        alignItems="center"
        display="flex"
        height="full"
      >
        {error && (
          <Rows spacing="2u">
            <Title>
              <FormattedMessage {...loginMessages.authorizationError} />
            </Title>
            <Text>{error}</Text>
            <Button variant="primary" onClick={authorize}>
              {intl.formatMessage(loginMessages.tryAgain)}
            </Button>
          </Rows>
        )}
        {loading && <LoadingIndicator />}
        {!loading && !error && (
          <Rows spacing="2u">
            <Header
              title={intl.formatMessage(loginMessages.signInRequired)}
              showBack={false}
            />
            <Text>
              <FormattedMessage {...loginMessages.dataConnectorsOAuth} />
            </Text>
            <Text>
              <FormattedMessage {...loginMessages.exampleDemonstration} />
            </Text>
            <Text>
              <FormattedMessage {...loginMessages.setupInstructions} />
            </Text>
            <Button variant="primary" onClick={authorize}>
              {intl.formatMessage(loginMessages.signIntoCanva)}
            </Button>
          </Rows>
        )}
      </Box>
    </div>
  );
};

const loginMessages = defineMessages({
  authorizationError: {
    defaultMessage: "Authorization error",
    description:
      "Title displayed when there is an error during OAuth authorization",
  },
  tryAgain: {
    defaultMessage: "Try again",
    description: "Button text to retry authorization after an error occurs",
  },
  signInRequired: {
    defaultMessage: "Sign in required",
    description:
      "Header title for the login page indicating authentication is needed",
  },
  dataConnectorsOAuth: {
    defaultMessage:
      "Data connectors can use OAuth to authenticate with other platforms.",
    description: "Body text shown when the user is prompted to sign in",
  },
  exampleDemonstration: {
    defaultMessage:
      "This example demonstrates how to do this with the Canva Connect API.",
    description: "Body text shown when the user is prompted to sign in",
  },
  setupInstructions: {
    defaultMessage:
      "For set up instructions please see the README.md in the root folder.",
    description: "Body text shown when the user is prompted to sign in",
  },
  signIntoCanva: {
    defaultMessage: "Sign into Canva",
    description: "Button text for initiating Canva authentication",
  },
});
