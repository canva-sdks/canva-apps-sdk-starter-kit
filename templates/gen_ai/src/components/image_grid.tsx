import { Grid, ImageCard, Rows, Text } from "@canva/app-ui-kit";
import type { QueuedImage } from "@canva/asset";
import { upload } from "@canva/asset";
import { addElementAtPoint, ui } from "@canva/design";
import type { DragEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import type { ImageType } from "src/api";
import { useAppContext } from "src/context";
import * as styles from "styles/utils.css";

const THUMBNAIL_HEIGHT = 150;

const uploadImage = async (image: ImageType): Promise<QueuedImage> => {
  // Upload the image using @canva/asset.
  const queuedImage = await upload({
    type: "image",
    mimeType: "image/jpeg",
    thumbnailUrl: image.thumbnail.url,
    url: image.fullsize.url,
    width: image.fullsize.width,
    height: image.fullsize.height,
    aiDisclosure: "app_generated",
  });

  return queuedImage;
};

export const ImageGrid = () => {
  const { generatedImages } = useAppContext();

  const onDragStart = async (
    event: DragEvent<HTMLElement>,
    image: ImageType,
  ) => {
    const parentNode = event.currentTarget.parentElement;
    try {
      if (styles.hidden) {
        parentNode?.classList.add(styles.hidden);
      }

      await ui.startDragToPoint(event, {
        type: "image",
        resolveImageRef: () => uploadImage(image),
        previewUrl: image.thumbnail.url,
        previewSize: {
          width: image.thumbnail.width,
          height: image.thumbnail.height,
        },
        fullSize: {
          width: image.fullsize.width,
          height: image.fullsize.height,
        },
      });
    } finally {
      if (styles.hidden) {
        parentNode?.classList.remove(styles.hidden);
      }
    }
  };

  const onImageClick = async (image: ImageType) => {
    const queuedImage = await uploadImage(image);

    await addElementAtPoint({
      type: "image",
      altText: { text: image.label, decorative: false },
      ref: queuedImage.ref,
    });
  };

  const intl = useIntl();

  return (
    <Rows spacing="1u">
      <Text size="medium" variant="bold">
        <FormattedMessage
          defaultMessage="Select or drag to add to design"
          description="Instruction to the user on how they can add the generated image to their design"
        />
      </Text>
      <Grid columns={2} spacing="2u">
        {generatedImages.map((image, index) => (
          <ImageCard
            key={index}
            thumbnailUrl={image.thumbnail.url}
            onClick={() => onImageClick(image)}
            ariaLabel={intl.formatMessage({
              defaultMessage: "Add image to design",
              description:
                "Aria label for the image card. When the image card is pressed, it will add the image to the design",
            })}
            alt={image.label}
            thumbnailHeight={THUMBNAIL_HEIGHT}
            borderRadius="standard"
            onDragStart={(event: DragEvent<HTMLElement>) =>
              onDragStart(event, image)
            }
          />
        ))}
      </Grid>
    </Rows>
  );
};
