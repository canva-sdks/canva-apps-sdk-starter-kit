import { Carousel, Column, Columns, Rows, Text } from "@canva/app-ui-kit";
import { useState } from "react";
import { useIntl } from "react-intl";
import { StyleCarouselMessages as Messages } from "./style_carousel.messages";
import { StyleCarouselItem } from "./style_carousel_item";

export const StyleCarousel = () => {
  const intl = useIntl();
  const [isSelected, setIsSelected] = useState<number>(0);
  const toggleSelected = (index: number) =>
    setIsSelected((current) => (current === index ? 0 : index));

  const imageStyles = [
    {
      title: intl.formatMessage(Messages.styleNone),
      alt: intl.formatMessage(Messages.altNone),
      image: "https://www.canva.dev/example-assets/images/gen_ai_none.jpg",
    },
    {
      title: intl.formatMessage(Messages.styleHandDrawn),
      alt: intl.formatMessage(Messages.altHandDrawn),
      image:
        "https://www.canva.dev/example-assets/images/gen_ai_duck_hand_drawn.jpg",
    },
    {
      title: intl.formatMessage(Messages.styleSticker),
      alt: intl.formatMessage(Messages.altSticker),
      image:
        "https://www.canva.dev/example-assets/images/gen_ai_duck_sticker.jpg",
    },
    {
      title: intl.formatMessage(Messages.styleLineArt),
      alt: intl.formatMessage(Messages.altLineArt),
      image:
        "https://www.canva.dev/example-assets/images/gen_ai_duck_line_art.jpg",
    },
    {
      title: intl.formatMessage(Messages.styleImpasto),
      alt: intl.formatMessage(Messages.altImpasto),
      image:
        "https://www.canva.dev/example-assets/images/gen_ai_duck_impasto.jpg",
    },
    {
      title: intl.formatMessage(Messages.styleDoodle),
      alt: intl.formatMessage(Messages.altDoodle),
      image:
        "https://www.canva.dev/example-assets/images/gen_ai_duck_doodle.jpg",
    },
  ];

  return (
    <Rows spacing="1u">
      <Columns spacing="1u" alignY="center">
        <Column>
          <Text variant="bold">{intl.formatMessage(Messages.styleLabel)}</Text>
        </Column>
      </Columns>
      <Carousel>
        {imageStyles.map(({ title, alt, image }, index) => (
          <StyleCarouselItem
            key={index}
            title={title}
            alt={alt}
            image={image}
            isSelected={isSelected === index}
            onClick={() => toggleSelected(index)}
          />
        ))}
      </Carousel>
    </Rows>
  );
};
