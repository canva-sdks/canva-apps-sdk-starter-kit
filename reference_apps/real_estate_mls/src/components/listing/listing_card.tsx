import { HorizontalCard, ImageCard, Rows, Text } from "@canva/app-ui-kit";
import type { Property } from "../../real_estate.type";

export interface ListingCardProps<T extends Property> {
  item: T;
  onClick?: (item: T) => void;
}

interface BaseListingCardProps<T extends Property> {
  item: T;
  onClick?: (item: T) => void;
}

export const GridListingCard = <T extends Property>({
  item,
  onClick,
}: BaseListingCardProps<T>) => {
  const handleClick = () => {
    onClick?.(item);
  };

  return (
    <div>
      <Rows spacing="1u">
        <ImageCard
          selectable
          thumbnailUrl={item.thumbnail.url}
          alt={item.description}
          borderRadius="standard"
          onClick={handleClick}
          thumbnailHeight={110}
        />
        <Rows spacing="0">
          <Text variant="bold" lineClamp={1}>
            {item.title}
          </Text>
          {item.suburb && <Text size="small">{item.suburb}</Text>}
        </Rows>
      </Rows>
    </div>
  );
};

export const ListListingCard = <T extends Property>({
  item,
  onClick,
}: BaseListingCardProps<T>) => {
  const handleClick = () => {
    onClick?.(item);
  };

  return (
    <HorizontalCard
      ariaLabel={item.title}
      title={item.title}
      description={item.suburb}
      onClick={handleClick}
      thumbnail={{
        url: item.thumbnail.url,
        alt: item.description,
      }}
    />
  );
};
