import { Column, Columns, Rows } from "@canva/app-ui-kit";
import type { Property } from "../../real_estate.type";
import { GridListingCard } from "./listing_card";

interface ListingGridProps {
  listings: Property[];
  onListingClick: (item: Property) => void;
}

export const ListingGrid = ({ listings, onListingClick }: ListingGridProps) => {
  return (
    <Rows spacing="2u">
      {listings.map((item, index) => {
        if (index % 2 === 0) {
          const nextItem = listings[index + 1];
          return (
            <Columns
              key={`row-${Math.floor(index / 2)}`}
              spacing="2u"
              alignY="stretch"
            >
              <Column key={item.id} width="1/2">
                <GridListingCard item={item} onClick={onListingClick} />
              </Column>
              {nextItem && (
                <Column key={nextItem.id} width="1/2">
                  <GridListingCard item={nextItem} onClick={onListingClick} />
                </Column>
              )}
            </Columns>
          );
        }
        return null;
      })}
    </Rows>
  );
};
