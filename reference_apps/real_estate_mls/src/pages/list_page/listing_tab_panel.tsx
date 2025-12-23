import { Box, Rows, Scrollable, Text } from "@canva/app-ui-kit";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { fetchListings } from "../../adapter";
import { ListingGrid } from "../../components/listing/listing_grid";
import { ListingList } from "../../components/listing/listing_list";
import { ListingSearchFilters } from "../../components/listing/listing_search_filters";
import {
  GridPlaceholder,
  ListPlaceholder,
} from "../../components/placeholders/placeholders";
import type { Office, Property } from "../../real_estate.type";

type Layout = "grid" | "list";

interface ListingTabContentProps {
  office: Office;
}

export const ListingTabPanel = ({ office }: ListingTabContentProps) => {
  const intl = useIntl();
  const [layout, setLayout] = useState<Layout>("grid");
  const [query, setQuery] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [sort, setSort] = useState<string>("");

  const toggleLayout = () => {
    setLayout(layout === "grid" ? "list" : "grid");
  };

  const {
    data: listingItems,
    hasNextPage,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["listings", query, propertyType, sort, office],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      return fetchListings(office, query, propertyType, sort, pageParam);
    },
    getNextPageParam: (lastPage) => lastPage?.continuation,
    initialPageParam: undefined,
  });
  const navigate = useNavigate();

  const listings = listingItems?.pages?.flatMap((page) => page.listings) || [];
  const handleListingClick = (item: Property) => {
    navigate(`/details/listing`, { state: { office, listing: item } });
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
            {((!isError && !isLoading && !!listings.length) ||
              !!query?.length) && (
              <ListingSearchFilters
                query={query}
                onQueryChange={setQuery}
                layout={layout}
                onLayoutToggle={toggleLayout}
                propertyType={propertyType}
                onPropertyTypeChange={setPropertyType}
                sort={sort}
                onSortChange={setSort}
              />
            )}
            {isError && (
              <Text tone="critical">
                {intl.formatMessage({
                  defaultMessage: "Error loading listings. Please try again.",
                  description: "Error message when listings fail to load",
                })}
              </Text>
            )}
            {isLoading && (
              <Box width="full" paddingBottom="2u">
                {layout === "grid" ? <GridPlaceholder /> : <ListPlaceholder />}
              </Box>
            )}
            {!isError && !isLoading && !listings.length && (
              <Box
                height="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text>
                  {intl.formatMessage({
                    defaultMessage: "No listings found.",
                    description: "Message shown when no listings are found",
                  })}
                </Text>
              </Box>
            )}
            {!isError && !isLoading && !!listings.length && (
              <Rows spacing={layout === "grid" ? "2u" : "0"}>
                {layout === "grid" ? (
                  <ListingGrid
                    listings={listings}
                    onListingClick={handleListingClick}
                  />
                ) : (
                  <ListingList
                    listings={listings}
                    onListingClick={handleListingClick}
                  />
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
