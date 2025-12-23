import {
  Button,
  Column,
  Columns,
  GridViewIcon,
  ListBulletLtrIcon,
  Rows,
  SearchInputMenu,
  Select,
} from "@canva/app-ui-kit";
import { useState } from "react";
import { useIntl } from "react-intl";

type Layout = "grid" | "list";

interface ListingSearchFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  layout: Layout;
  onLayoutToggle: () => void;
  propertyType: string;
  onPropertyTypeChange: (type: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

export const ListingSearchFilters = ({
  query,
  onQueryChange,
  layout,
  onLayoutToggle,
  propertyType,
  onPropertyTypeChange,
  sort,
  onSortChange,
}: ListingSearchFiltersProps) => {
  const intl = useIntl();
  const [queryValue, setQueryValue] = useState(query);
  return (
    <Rows spacing="2u">
      <SearchInputMenu
        value={queryValue}
        onChange={setQueryValue}
        onChangeComplete={() => onQueryChange(queryValue)}
        onClear={() => {
          setQueryValue("");
          onQueryChange("");
        }}
        placeholder={intl.formatMessage({
          defaultMessage: "Search listings...",
          description: "Placeholder text for listings search input",
        })}
      />
      <Columns spacing="1u" alignY="center">
        <Column width="content">
          <Button
            icon={layout === "grid" ? GridViewIcon : ListBulletLtrIcon}
            type="button"
            onClick={onLayoutToggle}
            variant="secondary"
            ariaLabel={intl.formatMessage(
              {
                defaultMessage:
                  "Toggle layout between grid and list. Current layout is {currentLayout}",
                description: "Aria label for layout toggle button",
              },
              {
                currentLayout:
                  layout === "grid"
                    ? intl.formatMessage({
                        defaultMessage: "grid",
                        description: "Layout option",
                      })
                    : intl.formatMessage({
                        defaultMessage: "list",
                        description: "Layout option",
                      }),
              },
            )}
          />
        </Column>
        <Column width="1/3">
          {/* TODO (App Developer): Review filter options and update to match your specific property data shape */}
          <Select
            value={propertyType}
            onChange={onPropertyTypeChange}
            options={[
              {
                label: intl.formatMessage({
                  defaultMessage: "House",
                  description: "Property type option - house",
                }),
                value: "house",
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "Apartment",
                  description: "Property type option - apartment",
                }),
                value: "apartment",
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "Townhouse",
                  description: "Property type option - townhouse",
                }),
                value: "townhouse",
              },
            ]}
            placeholder={intl.formatMessage({
              defaultMessage: "Property type",
              description: "Placeholder text for property type dropdown",
            })}
          />
        </Column>
        <Column width="1/3">
          <Select
            value={sort}
            onChange={onSortChange}
            options={[
              {
                label: intl.formatMessage({
                  defaultMessage: "Price: Low to High",
                  description: "Sort option - price ascending",
                }),
                value: "price-asc",
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "Price: High to Low",
                  description: "Sort option - price descending",
                }),
                value: "price-desc",
              },
            ]}
            placeholder={intl.formatMessage({
              defaultMessage: "Sort by",
              description: "Placeholder text for sort dropdown",
            })}
          />
        </Column>
      </Columns>
    </Rows>
  );
};
