/* eslint-disable formatjs/no-literal-string-in-object */

import type { SelectOption } from "@canva/app-ui-kit";
import { Button, DatabaseIcon, HorizontalCard, Rows } from "@canva/app-ui-kit";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Header } from "src/components";
import {
  ownershipFilter,
  sortOrderField,
} from "src/components/inputs/messages";
import { SearchFilter } from "src/components/inputs/search_filter";
import { SelectField } from "src/components/inputs/select_field";
import { useAppContext } from "src/context";
import { Paths } from "src/routes/paths";
import { dateCell, numberCell, stringCell } from "src/utils";
import type { CanvaItemResponse } from "../connect_client";
import { DataAPIError, DataSourceHandler } from "../data_source";
import type { APIResponseItem, DataSourceConfig } from "../data_source";

export interface DesignsDataSource extends DataSourceConfig {
  query: string;
  ownership: "any" | "owned" | "shared";
  sort_by:
    | "relevance"
    | "modified_descending"
    | "modified_ascending"
    | "title_descending"
    | "title_ascending";
}

export interface CanvaDesign extends APIResponseItem {
  title: string;
  created_at: number;
  updated_at: number;
  page_count: number;
}

export const designsSource = new DataSourceHandler<
  DesignsDataSource,
  CanvaDesign
>(
  {
    schema: "designs/v1",
    query: "",
    ownership: "any",
    sort_by: "relevance",
  },
  [
    {
      label: "ID",
      getValue: (design: CanvaDesign) => `ID ${design.id}`,
      toCell: stringCell,
    },
    {
      label: "Title",
      getValue: "title",
      toCell: stringCell,
    },
    {
      label: "Created At",
      getValue: "created_at",
      toCell: dateCell,
    },
    {
      label: "Updated At",
      getValue: "updated_at",
      toCell: dateCell,
    },
    {
      label: "Page Count",
      getValue: "page_count",
      toCell: numberCell,
    },
  ],
  (
    source: DesignsDataSource,
    authToken: string,
    rowLimit: number,
    signal: AbortSignal | undefined,
  ) =>
    getDesigns(
      authToken,
      rowLimit,
      signal,
      source.query,
      source.ownership,
      source.sort_by,
    ),
  DesignSelection,
  DesignsSourceConfig,
);

export async function getDesigns(
  authToken: string,
  rowLimit: number,
  signal: AbortSignal | undefined,
  query: string,
  ownership: string,
  sort_by: string,
  continuation?: string,
  allItems: CanvaDesign[] = [],
): Promise<CanvaDesign[]> {
  const baseUrl = `https://api.canva.com/rest/v1/designs`;
  const params = new URLSearchParams();
  if (continuation) {
    params.set("continuation", continuation);
  } else {
    if (query) {
      params.set("query", query);
    }
    params.set("ownership", ownership);
    params.set("sort_by", sort_by);
  }
  const url = `${baseUrl}?${params.toString()}`;

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new DataAPIError(
          `Canva Connect response was not ok: ${response.statusText || response.status}`,
        );
      }
      return response.json();
    })
    .then((data: CanvaItemResponse<CanvaDesign>) => {
      const updatedItems = [...allItems, ...data.items];

      if (data.continuation && updatedItems.length < rowLimit) {
        return getDesigns(
          authToken,
          rowLimit,
          signal,
          query,
          ownership,
          sort_by,
          data.continuation,
          updatedItems,
        );
      }

      return updatedItems;
    });
}

function DesignSelection() {
  const intl = useIntl();
  const { setDataSourceHandler } = useAppContext();
  const navigate = useNavigate();

  const title = intl.formatMessage({
    defaultMessage: "Designs",
    description:
      "Main heading on the designs button displayed when selecting the import type.",
  });

  const description = intl.formatMessage({
    defaultMessage: "Query designs",
    description:
      "Subtext on the designs selection button displayed when selecting the import type.",
  });

  const handleClick = () => {
    setDataSourceHandler(
      designsSource as unknown as DataSourceHandler<
        DataSourceConfig,
        APIResponseItem
      >,
    );
    navigate(Paths.DATA_SOURCE_CONFIG);
  };

  return (
    <HorizontalCard
      key="designs"
      title={title}
      thumbnail={{ icon: () => <DatabaseIcon /> }}
      onClick={handleClick}
      description={description}
      ariaLabel={description}
    />
  );
}

function DesignsSourceConfig(sourceConfig: DesignsDataSource) {
  const intl = useIntl();
  const { loadDataSource } = useAppContext();
  const [query, setQuery] = useState<string>(sourceConfig.query);
  const [ownership, setOwnership] = useState<string>(sourceConfig.ownership);
  const [sortOrder, setSortOrder] = useState<string>(sourceConfig.sort_by);
  const [isLoading, setIsLoading] = useState(false);

  const [filterCount, setFilterCount] = useState(0);
  useEffect(() => {
    // Update the filter count based on the selected filters
    // consider a filter to be applied if not set to the default value
    setFilterCount(
      (ownership !== "any" ? 1 : 0) + (sortOrder !== "relevance" ? 1 : 0),
    );
  }, [ownership, sortOrder]);
  const resetFilters = () => {
    setOwnership("any");
    setSortOrder("relevance");
  };

  const loadDesigns = async () => {
    setIsLoading(true);
    loadDataSource("Canva Designs", {
      schema: "designs/v1",
      query,
      ownership,
      sort_by: sortOrder,
    } as DesignsDataSource).then(() => {
      setIsLoading(false);
    });
  };

  const ownershipOptions: SelectOption<string>[] = [
    { value: "any", label: intl.formatMessage(ownershipFilter.any) },
    { value: "owned", label: intl.formatMessage(ownershipFilter.owned) },
    { value: "shared", label: intl.formatMessage(ownershipFilter.shared) },
  ];

  const sortOrderOptions: SelectOption<string>[] = [
    { value: "relevance", label: intl.formatMessage(sortOrderField.relevance) },
    {
      value: "modified_descending",
      label: intl.formatMessage(sortOrderField.modifiedDesc),
    },
    {
      value: "modified_ascending",
      label: intl.formatMessage(sortOrderField.modifiedAsc),
    },
    {
      value: "title_descending",
      label: intl.formatMessage(sortOrderField.titleDesc),
    },
    {
      value: "title_ascending",
      label: intl.formatMessage(sortOrderField.titleAsc),
    },
  ];

  return (
    <div>
      <Rows spacing="2u">
        <Header
          title={intl.formatMessage({
            defaultMessage: "Canva Designs",
            description: "The header text for the designs data source",
          })}
          showBack={true}
        />

        <SearchFilter
          value={query}
          onChange={setQuery}
          filterCount={filterCount}
          resetFilters={resetFilters}
        >
          <SelectField
            label={intl.formatMessage(ownershipFilter.label)}
            options={ownershipOptions}
            value={ownership}
            onChange={setOwnership}
          />
          <SelectField
            label={intl.formatMessage(sortOrderField.label)}
            options={sortOrderOptions}
            value={sortOrder}
            onChange={setSortOrder}
          />
        </SearchFilter>

        <Button
          variant="primary"
          loading={isLoading}
          onClick={async () => {
            loadDesigns();
          }}
        >
          {intl.formatMessage({
            defaultMessage: "Load Designs",
            description: "Button for saving and applying the query filter",
          })}
        </Button>
      </Rows>
    </div>
  );
}
