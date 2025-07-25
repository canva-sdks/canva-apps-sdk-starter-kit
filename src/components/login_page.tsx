import React from "react";
import {
  Box,
  Button,
  LoadingIndicator,
  Rows,
  Text,
  Title,
} from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { useMicrosoftAuth } from "../hooks/use_microsoft_auth";
import * as styles from "styles/components.css";

export const LoginPage: React.FC = () => {
  const intl = useIntl();
  const { isAuthenticated, user, loading, error, login, logout } = useMicrosoftAuth();

  if (loading) {
    return (
      <div className={styles.scrollContainer}>
        <Box
          justifyContent="center"
          width="full"
          alignItems="center"
          display="flex"
          height="full"
        >
          <Rows spacing="2u">
            <LoadingIndicator size="medium" />
            <Text variant="regular">
              {intl.formatMessage({
                id: "login.checking_auth",
                defaultMessage: "Checking authentication...",
                description: "Loading text while checking authentication status",
              })}
            </Text>
          </Rows>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.scrollContainer}>
        <Box
          justifyContent="center"
          width="full"
          alignItems="center"
          display="flex"
          height="full"
        >
          <Rows spacing="3u">
            <Title size="large">
              {intl.formatMessage({
                id: "login.error_title",
                defaultMessage: "Authentication Error",
                description: "Title for authentication error",
              })}
            </Title>
            <Text variant="regular">
              {error}
            </Text>
            <Button variant="primary" onClick={login}>
              {intl.formatMessage({
                id: "login.try_again",
                defaultMessage: "Try Again",
                description: "Button text to retry authentication",
              })}
            </Button>
          </Rows>
        </Box>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className={styles.scrollContainer}>
        <Box
          justifyContent="center"
          width="full"
          alignItems="center"
          display="flex"
          height="full"
        >
          <Rows spacing="3u">
            <Title size="large">
              {intl.formatMessage({
                id: "login.welcome_title",
                defaultMessage: "Welcome!",
                description: "Welcome title for authenticated users",
              })}
            </Title>
            <Text variant="regular">
              {intl.formatMessage({
                id: "login.logged_in_as",
                defaultMessage: "Logged in as: {name}",
                description: "Text showing current logged in user",
              }, { name: user.displayName })}
            </Text>
            <Text variant="regular">
              {intl.formatMessage({
                id: "login.email",
                defaultMessage: "Email: {email}",
                description: "Text showing user email",
              }, { email: user.mail || user.userPrincipalName })}
            </Text>
            <Button variant="secondary" onClick={logout}>
              {intl.formatMessage({
                id: "login.logout",
                defaultMessage: "Logout",
                description: "Button text to logout",
              })}
            </Button>
          </Rows>
        </Box>
      </div>
    );
  }

  return (
    <div className={styles.scrollContainer}>
      <Box
        justifyContent="center"
        width="full"
        alignItems="center"
        display="flex"
        height="full"
      >
        <Rows spacing="4u">
          <Title size="large">
            {intl.formatMessage({
              id: "login.signin_title",
              defaultMessage: "Sign In Required",
              description: "Title for sign in page",
            })}
          </Title>
          
          <Rows spacing="2u">
            <Text variant="regular">
              {intl.formatMessage({
                id: "login.signin_description",
                defaultMessage: "This application requires authentication with Microsoft Azure Active Directory to access agency data and tools.",
                description: "Description explaining why sign in is required",
              })}
            </Text>
            <Text variant="regular">
              {intl.formatMessage({
                id: "login.signin_instructions",
                defaultMessage: "Please sign in with your Microsoft account to continue.",
                description: "Instructions for signing in",
              })}
            </Text>
          </Rows>

          <Button variant="primary" onClick={login} stretch>
            {intl.formatMessage({
              id: "login.signin_microsoft",
              defaultMessage: "Sign in with Microsoft",
              description: "Button text to sign in with Microsoft",
            })}
          </Button>

          <Text variant="regular" size="small">
            {intl.formatMessage({
              id: "login.privacy_notice",
              defaultMessage: "By signing in, you agree to share your basic profile information with this application.",
              description: "Privacy notice text",
            })}
          </Text>
        </Rows>
      </Box>
    </div>
  );
};