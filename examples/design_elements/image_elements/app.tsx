// For usage information, see the README.md file.
/* eslint-disable no-restricted-imports */
// ESLint rule is disabled to allow importing static assets for demonstration
import {
  Box,
  Button,
  FormField,
  Grid,
  ImageCard,
  Rows,
  Text,
} from "@canva/app-ui-kit";
import cat from "assets/images/cat.jpg";
import dog from "assets/images/dog.jpg";
import rabbit from "assets/images/rabbit.jpg";
import { useState, useCallback } from "react";
import * as styles from "styles/components.css";
import { upload } from "@canva/asset";
import { useAddElement } from "utils/use_add_element";

// Static image data for demonstration - in production, use hosted assets
const images = {
  dog: {
    title: "Dog",
    imageSrc: dog,
  },
  cat: {
    title: "Cat",
    imageSrc: cat,
  },
  rabbit: {
    title: "Rabbit",
    imageSrc: rabbit,
  },
};

export const App = () => {
  const [dataUrl, setDataUrl] = useState(dog);
  const [isLoading, setIsLoading] = useState(false);
  // Hook that provides the functionality to add elements to the Canva design
  const addElement = useAddElement();
  const disabled = !dataUrl || dataUrl.trim().length < 1;

  const items = Object.entries(images).map(([key, value]) => {
    const { title, imageSrc } = value;
    return {
      key,
      title,
      imageSrc,
      active: dataUrl === imageSrc,
      onClick: () => {
        setDataUrl(imageSrc);
      },
    };
  });

  const addImage = useCallback(async () => {
    setIsLoading(true);
    try {
      // Upload the image to Canva's asset system and get a reference
      // This creates a reusable asset that can be used in multiple designs
      const { ref } = await upload({
        type: "image",
        mimeType: "image/jpeg",
        url: dataUrl,
        thumbnailUrl: dataUrl,
        // AI disclosure indicates whether AI was used to create this content
        aiDisclosure: "none",
      });

      // Add the uploaded image as a design element to the current page
      // The element will appear at the default position on the design canvas
      await addElement({
        type: "image",
        ref, // Reference to the uploaded asset
        altText: {
          text: "photo of an animal",
          decorative: undefined, // Set to true if image is purely decorative
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [dataUrl, addElement]);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can add image elements to a design.
        </Text>
        <FormField
          label="Select an image"
          control={({ id }) => (
            <Box id={id} padding="1u">
              <Grid columns={3} spacing="1.5u">
                {items.map((item) => (
                  <ImageCard
                    ariaLabel="Add image to design"
                    alt={item.title}
                    key={item.key}
                    thumbnailUrl={item.imageSrc}
                    onClick={item.onClick}
                    selectable={true}
                    selected={item.active}
                    borderRadius="standard"
                  />
                ))}
              </Grid>
            </Box>
          )}
        />
        <Button
          variant="primary"
          disabled={disabled}
          loading={isLoading}
          onClick={addImage}
          stretch
        >
          Add element
        </Button>
      </Rows>
    </div>
  );
};
