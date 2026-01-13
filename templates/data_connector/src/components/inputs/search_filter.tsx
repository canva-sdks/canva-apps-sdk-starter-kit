import {
  Badge,
  Box,
  Button,
  Column,
  Columns,
  Flyout,
  Rows,
  SearchInputMenu,
  SlidersIcon,
} from "@canva/app-ui-kit";
import type { ReactNode } from "react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { filterMenu } from "./messages";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  filterCount: number;
  resetFilters: () => void;
  children?: ReactNode;
}

export const SearchFilter = ({
  value,
  onChange,
  filterCount,
  resetFilters,
  children,
}: SearchFilterProps) => {
  const intl = useIntl();
  const [triggerRef, setTriggerRef] = useState<HTMLDivElement | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const onFilterClick = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const filterButton = (
    <Button
      size="small"
      variant="tertiary"
      icon={SlidersIcon}
      onClick={onFilterClick}
    />
  );
  return (
    <>
      <Box paddingStart="0.5u">
        <SearchInputMenu
          value={value}
          placeholder={intl.formatMessage(filterMenu.search)}
          onChange={(value) => onChange(value)}
          onClear={() => onChange("")}
          ref={setTriggerRef}
          end={
            filterCount === 0 ? (
              filterButton
            ) : (
              <Badge
                tone="assist"
                wrapInset="0"
                shape="circle"
                text={filterCount.toString()}
                ariaLabel={intl.formatMessage(filterMenu.count)}
              >
                {filterButton}
              </Badge>
            )
          }
        />
      </Box>
      <Flyout
        open={isFilterMenuOpen}
        onRequestClose={() => setIsFilterMenuOpen(false)}
        width="trigger"
        trigger={triggerRef}
        placement="bottom-center"
        footer={
          <Box padding="2u" background="surface">
            <Columns spacing="1u">
              <Column>
                <Button variant="secondary" onClick={resetFilters} stretch>
                  {intl.formatMessage(filterMenu.clear)}
                </Button>
              </Column>
              <Column>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsFilterMenuOpen(false);
                  }}
                  stretch
                >
                  {intl.formatMessage(filterMenu.apply)}
                </Button>
              </Column>
            </Columns>
          </Box>
        }
      >
        <Box padding="2u">
          <Rows spacing="2u">{children}</Rows>
        </Box>
      </Flyout>
    </>
  );
};
