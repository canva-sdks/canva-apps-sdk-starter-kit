import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/breadcrumb/breadcrumb";
import type { Office } from "../../real_estate.type";
import { AgentTabPanel } from "./agent_tab_panel";
import { ListingTabPanel } from "./listing_tab_panel";

export const ListPage = () => {
  const navigate = useNavigate();
  const { tab = "listings" } = useParams<{
    tab?: string;
  }>();
  const { office } = useLocation().state as { office: Office };
  const intl = useIntl();

  return (
    <Tabs
      onSelect={(value) => navigate(`/list/${value}`, { state: { office } })}
      activeId={tab}
      height="fill"
    >
      <Box height="full" display="flex" flexDirection="column" paddingTop="2u">
        <Breadcrumb />
        <Box paddingBottom="1u">
          <TabList>
            <Tab
              id="listings"
              active={tab === "listings"}
              onClick={() => navigate(`/list/listings`, { state: { office } })}
            >
              {intl.formatMessage({
                defaultMessage: "Listings",
                description: "Tab label for property listings",
              })}
            </Tab>
            <Tab
              id="agents"
              active={tab === "agents"}
              onClick={() => navigate(`/list/agents`, { state: { office } })}
            >
              {intl.formatMessage({
                defaultMessage: "Agents",
                description: "Tab label for real estate agents",
              })}
            </Tab>
          </TabList>
        </Box>
        <TabPanels>
          <TabPanel id="listings">
            <ListingTabPanel office={office} />
          </TabPanel>
          <TabPanel id="agents">
            <AgentTabPanel office={office} />
          </TabPanel>
        </TabPanels>
      </Box>
    </Tabs>
  );
};
