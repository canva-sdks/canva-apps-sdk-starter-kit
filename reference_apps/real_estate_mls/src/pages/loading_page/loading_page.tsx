import {
  Box,
  Column,
  Columns,
  Placeholder,
  Rows,
  Text,
  Title,
  tokens,
} from "@canva/app-ui-kit";
import { useQueries } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAgents, fetchListings } from "../../adapter";
import { Breadcrumb } from "../../components/breadcrumb/breadcrumb";
import type { Office } from "../../real_estate.type";

export const LoadingPage = () => {
  const navigate = useNavigate();
  const office = (useLocation().state as { office: Office })?.office;
  const intl = useIntl();

  const results = useQueries({
    queries: [
      {
        queryKey: ["agents-loading", office?.id],
        queryFn: async () => fetchAgents(office),
        enabled: !!office,
      },
      {
        queryKey: ["listings-loading", office],
        queryFn: async () => fetchListings(office),
        enabled: !!office,
      },
    ],
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.every((result) => result.isError);
  const isEmpty =
    !isLoading &&
    !isError &&
    results[0].data?.agents.length === 0 &&
    results[1].data?.listings.length === 0;

  useEffect(() => {
    if (!isLoading && !isError && !isEmpty && office) {
      const hasListings = results[1].data?.listings?.length;

      // Navigate to list page with appropriate tab based on available data
      const defaultTab = hasListings ? "listings" : "agents";
      navigate(`/list/${defaultTab}`, { replace: true, state: { office } });
    }
  }, [results, isLoading, isError, isEmpty, office, navigate]);

  if (isLoading) {
    return (
      <Box height="full" paddingY="2u" display="flex" flexDirection="column">
        <Breadcrumb />
        <Box height="full" width="full" paddingTop="2u">
          <Rows spacing="2u">
            <Columns spacing="1u" alignY="stretch">
              <Column width="1/2">
                <div style={{ height: tokens.space400 }}>
                  <Placeholder shape="rectangle" />
                </div>
              </Column>
              <Column width="1/2">
                <div style={{ height: tokens.space400 }}>
                  <Placeholder shape="rectangle" />
                </div>
              </Column>
            </Columns>
            <div style={{ width: "100%", height: tokens.space400 }}>
              <Placeholder shape="rectangle" />
            </div>
          </Rows>
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box height="full" paddingY="2u" display="flex" flexDirection="column">
        <Breadcrumb />
        <Box
          height="full"
          width="full"
          paddingX="2u"
          justifyContent="center"
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Rows spacing="2u" align="center">
            <Title alignment="center">
              {intl.formatMessage({
                defaultMessage: "Something went wrong",
                description: "Title shown when there's an error loading data",
              })}
            </Title>
            <Text alignment="center">
              {intl.formatMessage({
                defaultMessage: "Unable to load data. Please try again.",
                description: "Error message shown when data fails to load",
              })}
            </Text>
          </Rows>
        </Box>
      </Box>
    );
  }

  if (isEmpty) {
    return (
      <Box height="full" paddingY="2u" display="flex" flexDirection="column">
        <Breadcrumb />
        <Box
          height="full"
          width="full"
          justifyContent="center"
          alignItems="center"
          display="flex"
          flexDirection="column"
          paddingX="2u"
        >
          <Rows spacing="2u" align="center">
            <Title alignment="center">
              {intl.formatMessage({
                defaultMessage: "Nothing here yet",
                description:
                  "Title shown when there are no agents or listings to display",
              })}
            </Title>
            <Text alignment="center">
              {intl.formatMessage({
                defaultMessage:
                  "There are no agents or listings here. Try choosing another office.",
                description:
                  "Helper text shown when there are no agents or listings to display",
              })}
            </Text>
          </Rows>
        </Box>
      </Box>
    );
  }

  return null;
};
