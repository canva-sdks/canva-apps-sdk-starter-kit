/* eslint-disable formatjs/no-literal-string-in-object */
import type { SelectOption } from "@canva/app-ui-kit";
import {
  Button,
  HorizontalCard,
  Rows,
  TableMergedHeaderCellsIcon,
} from "@canva/app-ui-kit";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Header } from "src/components";
import {
  datasetFilter,
  ownershipFilter,
  sortOrderField,
} from "src/components/inputs/messages";
import { SearchFilter } from "src/components/inputs/search_filter";
import { SelectField } from "src/components/inputs/select_field";
import { useAppContext } from "src/context";
import { Paths } from "src/routes/paths";
import { dateCell, stringCell } from "src/utils";
import type { CanvaItemResponse } from "../connect_client";
import { DataAPIError, DataSourceHandler } from "../data_source";
import type { APIResponseItem, DataSourceConfig } from "../data_source";

export interface BrandTemplatesDataSource extends DataSourceConfig {
  query: string;
  dataset: "any" | "non_empty";
  ownership: "any" | "owned" | "shared";
  sort_by:
    | "relevance"
    | "modified_descending"
    | "modified_ascending"
    | "title_descending"
    | "title_ascending";
}

export interface CanvaBrandTemplate extends APIResponseItem {
  title: string;
  created_at: number;
  updated_at: number;
  view_url: string;
  create_url: string;
}

export const brandTemplatesSource = new DataSourceHandler<
  BrandTemplatesDataSource,
  CanvaBrandTemplate
>(
  {
    schema: "brand_templates/v1",
    query: "",
    dataset: "any",
    ownership: "any",
    sort_by: "relevance",
  },
  [
    {
      label: "ID",
      getValue: (template: CanvaBrandTemplate) => `ID ${template.id}`,
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
      label: "View URL",
      getValue: "view_url",
      toCell: stringCell,
    },
    {
      label: "Create URL",
      getValue: "create_url",
      toCell: stringCell,
    },
  ],
  (
    source: BrandTemplatesDataSource,
    authToken: string,
    rowLimit: number,
    signal: AbortSignal | undefined,
  ) =>
    getBrandTemplates(
      authToken,
      rowLimit,
      signal,
      source.query,
      source.ownership,
      source.dataset,
      source.sort_by,
    ),
  BrandTemplatesSelection,
  BrandTemplatesSourceConfig,
);

export async function getBrandTemplates(
  authToken: string,
  rowLimit: number,
  signal: AbortSignal | undefined,
  query: string,
  ownership: string,
  dataset: string,
  sort_by: string,
  continuation?: string,
  allItems: CanvaBrandTemplate[] = [],
): Promise<CanvaBrandTemplate[]> {
  const baseUrl = `https://api.canva.com/rest/v1/brand-templates`;

  const params = new URLSearchParams();
  if (continuation) {
    params.set("continuation", continuation);
  } else {
    if (query) {
      params.set("query", query);
    }
    params.set("ownership", ownership);
    params.set("dataset", dataset);
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
    .then((data: CanvaItemResponse<CanvaBrandTemplate>) => {
      const updatedItems = [...allItems, ...data.items];

      if (data.continuation && updatedItems.length < rowLimit) {
        return getBrandTemplates(
          authToken,
          rowLimit,
          signal,
          query,
          ownership,
          dataset,
          sort_by,
          data.continuation,
          updatedItems,
        );
      }

      return updatedItems;
    });
}

function BrandTemplatesSelection() {
  const intl = useIntl();
  const { setDataSourceHandler } = useAppContext();
  const navigate = useNavigate();

  const title = intl.formatMessage({
    defaultMessage: "Brand Templates",
    description:
      "Main heading on the brand templates button displayed when selecting the import type.",
  });

  const description = intl.formatMessage({
    defaultMessage: "Query brand templates",
    description:
      "Subtext on the brand templates button displayed when selecting the import type.",
  });

  const handleClick = () => {
    setDataSourceHandler(
      brandTemplatesSource as unknown as DataSourceHandler<
        DataSourceConfig,
        APIResponseItem
      >,
    );
    navigate(Paths.DATA_SOURCE_CONFIG);
  };

  return (
    <HorizontalCard
      key="brand-templates"
      title={title}
      thumbnail={{ icon: () => <TableMergedHeaderCellsIcon /> }}
      onClick={handleClick}
      description={description}
      ariaLabel={description}
    />
  );
}

function BrandTemplatesSourceConfig(sourceConfig: BrandTemplatesDataSource) {
  const intl = useIntl();
  const { loadDataSource } = useAppContext();
  const [query, setQuery] = useState<string>(sourceConfig.query);
  const [ownership, setOwnership] = useState<string>(sourceConfig.ownership);
  const [sortOrder, setSortOrder] = useState<string>(sourceConfig.sort_by);
  const [dataset, setDataset] = useState<string>(sourceConfig.dataset);
  const [isLoading, setIsLoading] = useState(false);

  const [filterCount, setFilterCount] = useState(0);
  useEffect(() => {
    // Update the filter count based on the selected filters
    // consider a filter to be applied if not set to the default value
    setFilterCount(
      (ownership !== "any" ? 1 : 0) +
        (dataset !== "any" ? 1 : 0) +
        (sortOrder !== "relevance" ? 1 : 0),
    );
  }, [ownership, dataset, sortOrder]);
  const resetFilters = () => {
    setOwnership("any");
    setDataset("any");
    setSortOrder("relevance");
  };

  const loadTemplates = async () => {
    loadDataSource("Canva Brand Templates", {
      schema: "brand_templates/v1",
      query,
      ownership,
      dataset,
      sort_by: sortOrder,
    } as BrandTemplatesDataSource).then(() => {
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

  const datasetOptions: SelectOption<string>[] = [
    { value: "any", label: intl.formatMessage(datasetFilter.any) },
    { value: "non_empty", label: intl.formatMessage(datasetFilter.nonEmpty) },
  ];

  return (
    <div>
      <Header
        title={intl.formatMessage({
          defaultMessage: "Canva Brand Templates",
          description: "The header text for the brand templates data source",
        })}
        showBack={true}
      />
      <Rows spacing="2u">
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
            label={intl.formatMessage(datasetFilter.label)}
            options={datasetOptions}
            value={dataset}
            onChange={setDataset}
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
            loadTemplates();
          }}
        >
          {intl.formatMessage({
            defaultMessage: "Load Templates",
            description: "Button for saving and applying the query filter",
          })}
        </Button>
      </Rows>
    </div>
  );
}
