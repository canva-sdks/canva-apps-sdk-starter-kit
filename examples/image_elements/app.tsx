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
      const { ref } = await upload({
        type: "image",
        mimeType: "image/jpeg",
        url: dataUrl,
        thumbnailUrl: dataUrl,
        aiDisclosure: "none",
      });

      await addElement({
        type: "image",
        ref,
        altText: {
          text: "photo of an animal",
          decorative: undefined,
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
