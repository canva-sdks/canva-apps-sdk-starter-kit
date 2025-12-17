import type { Property } from "../../real_estate.type";
import { ListListingCard } from "./listing_card";

interface ListingListProps {
  listings: Property[];
  onListingClick: (item: Property) => void;
}

export const ListingList = ({ listings, onListingClick }: ListingListProps) => {
  return (
    <>
      {listings.map((item: Property, index: number) => (
        <ListListingCard
          key={`${item.id}-${index}`}
          item={item}
          onClick={onListingClick}
        />
      ))}
    </>
  );
};
