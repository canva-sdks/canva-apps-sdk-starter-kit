import React from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Rows,
  Text,
  Button,
} from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { useMicrosoftAuth } from "../hooks/use_microsoft_auth";
import { useApiConfig } from "../hooks/use_api_config";
import { SearchableTab } from "./searchable_tab";
import { AgentSearchTab } from "./agent_search_tab";
import { ApiConfigSetup } from "./api_config_setup";
import * as styles from "styles/components.css";

export const ProtectedApp: React.FC = () => {
  const intl = useIntl();
  const { user, logout } = useMicrosoftAuth();
  const { isReady } = useApiConfig();

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {/* Header with user info and logout */}
        <Box
          padding="2u"
          background="neutralLow"
          borderRadius="standard"
        >
          <Rows spacing="1u">
            <Text variant="bold">
              {intl.formatMessage({
                id: "app.welcome_user",
                defaultMessage: "Welcome, {name}",
                description: "Welcome message with user name",
              }, { name: user?.displayName || "User" })}
            </Text>
            <Box display="flex" justifyContent="spaceBetween" alignItems="center">
              <Text variant="regular" size="small">
                {intl.formatMessage({
                  id: "app.signed_in_as",
                  defaultMessage: "Signed in as: {email}",
                  description: "Text showing current user email",
                }, { email: user?.mail || user?.userPrincipalName || "Unknown" })}
              </Text>
              <Button variant="tertiary" onClick={logout}>
                {intl.formatMessage({
                  id: "app.logout",
                  defaultMessage: "Logout",
                  description: "Logout button text",
                })}
              </Button>
            </Box>
          </Rows>
        </Box>

        {/* Main App Content */}
        {!isReady ? (
          <ApiConfigSetup />
        ) : (
          <Tabs defaultActiveId="agents">
            <TabList align="stretch">
              <Tab id="agents">
                {intl.formatMessage({
                  id: "app.agents_tab",
                  defaultMessage: "Agents",
                  description: "Agents tab label",
                })}
              </Tab>
              <Tab id="listings">
                {intl.formatMessage({
                  id: "app.listings_tab",
                  defaultMessage: "Listings",
                  description: "Listings tab label",
                })}
              </Tab>
              <Tab id="market-data">
                {intl.formatMessage({
                  id: "app.market_data_tab",
                  defaultMessage: "Market Data",
                  description: "Market Data tab label",
                })}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel id="agents">
                <AgentSearchTab />
              </TabPanel>
              <TabPanel id="listings">
                <SearchableTab endpoint="listings" tabName="Listings" />
              </TabPanel>
              <TabPanel id="market-data">
                <SearchableTab endpoint="market-data" tabName="Market Data" />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Rows>
    </div>
  );
};