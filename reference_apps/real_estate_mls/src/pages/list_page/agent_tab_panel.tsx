import { Box, Rows, Scrollable, Text } from "@canva/app-ui-kit";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { fetchAgents } from "../../adapter";
import { AgentGrid } from "../../components/agent/agent_grid";
import { AgentList } from "../../components/agent/agent_list";
import { AgentSearchFilters } from "../../components/agent/agent_search_filters";
import {
  GridPlaceholder,
  ListPlaceholder,
} from "../../components/placeholders/placeholders";
import type { Agent, Office } from "../../real_estate.type";

type Layout = "grid" | "list";

interface AgentTabContentProps {
  office: Office;
}

export const AgentTabPanel = ({ office }: AgentTabContentProps) => {
  const intl = useIntl();
  const [layout, setLayout] = useState<Layout>("grid");
  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<string>("");

  const toggleLayout = () => {
    setLayout(layout === "grid" ? "list" : "grid");
  };

  const {
    data: agentItems,
    hasNextPage,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["agents", query, sort, office],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchAgents(office, query, pageParam, sort);
    },
    getNextPageParam: (lastPage) => lastPage?.continuation,
    initialPageParam: undefined,
  });

  const agents = agentItems?.pages?.flatMap((page) => page.agents) || [];
  const navigate = useNavigate();
  const handleAgentClick = (item: Agent) => {
    navigate(`/details/agent`, { state: { office, agent: item } });
  };

  return (
    <Scrollable>
      <InfiniteScroll
        loadMore={() => fetchNextPage()}
        hasMore={hasNextPage}
        useWindow={false}
      >
        <Box height="full">
          <Rows spacing="2u">
            {((!isError && !isLoading && agents.length > 0) ||
              query?.length) && (
              <AgentSearchFilters
                query={query}
                onQueryChange={setQuery}
                layout={layout}
                onLayoutToggle={toggleLayout}
                sort={sort}
                onSortChange={setSort}
              />
            )}
            {isError && (
              <Text tone="critical">
                {intl.formatMessage({
                  defaultMessage: "Error loading agents. Please try again.",
                  description: "Error message when agents fail to load",
                })}
              </Text>
            )}
            {isLoading && (
              <Box width="full" paddingBottom="2u">
                {layout === "grid" ? <GridPlaceholder /> : <ListPlaceholder />}
              </Box>
            )}
            {!isError && !isLoading && agents.length === 0 && (
              <Box
                height="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text>
                  {intl.formatMessage({
                    defaultMessage: "No agents found in this office.",
                    description: "Message shown when no agents are found",
                  })}
                </Text>
              </Box>
            )}
            {!isError && !isLoading && agents.length > 0 && (
              <Rows spacing={layout === "grid" ? "2u" : "0"}>
                {layout === "grid" ? (
                  <AgentGrid agents={agents} onAgentClick={handleAgentClick} />
                ) : (
                  <AgentList agents={agents} onAgentClick={handleAgentClick} />
                )}
                {isFetchingNextPage && (
                  <Box width="full" paddingBottom="2u">
                    {layout === "grid" ? (
                      <GridPlaceholder />
                    ) : (
                      <ListPlaceholder />
                    )}
                  </Box>
                )}
              </Rows>
            )}
          </Rows>
        </Box>
      </InfiniteScroll>
    </Scrollable>
  );
};
