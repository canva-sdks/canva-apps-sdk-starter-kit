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

interface AgentSearchFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  layout: Layout;
  onLayoutToggle: () => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

export const AgentSearchFilters = ({
  query,
  onQueryChange,
  layout,
  onLayoutToggle,
  sort,
  onSortChange,
}: AgentSearchFiltersProps) => {
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
          defaultMessage: "Search agents...",
          description: "Placeholder text for agents search input",
        })}
      />
      <Columns spacing="1u" alignY="center">
        <Column width="content">
          <Button
            icon={layout === "grid" ? GridViewIcon : ListBulletLtrIcon}
            type="button"
            onClick={onLayoutToggle}
            variant="secondary"
          />
        </Column>
        <Column width="1/3">
          <Select
            value={sort}
            onChange={onSortChange}
            options={[
              {
                label: intl.formatMessage({
                  defaultMessage: "Name: A to Z",
                  description: "Sort option - name ascending",
                }),
                value: "name-asc",
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "Name: Z to A",
                  description: "Sort option - name descending",
                }),
                value: "name-desc",
              },
            ]}
            placeholder={intl.formatMessage({
              defaultMessage: "Sort by",
              description: "Placeholder text for agents sort dropdown",
            })}
          />
        </Column>
      </Columns>
    </Rows>
  );
};
