import { ImageCard, Rows, Text } from "@canva/app-ui-kit";

export const StyleCarouselItem = ({
  title,
  alt,
  image,
  isSelected,
  onClick,
}: {
  title: string;
  alt: string;
  image: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <Rows spacing="0.5u" align="center">
    <ImageCard
      alt={alt}
      ariaLabel={title}
      thumbnailUrl={image}
      thumbnailHeight={96}
      thumbnailBackground="secondary"
      thumbnailAspectRatio={1}
      borderRadius="standard"
      selectable
      selected={isSelected}
      onClick={onClick}
    />
    <Text size="small">{title}</Text>
  </Rows>
);
