import {
  Box,
  Button,
  FormField,
  Grid,
  ImageCard,
  Rows,
  Text,
} from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import cat from "assets/images/cat.jpg";
import dog from "assets/images/dog.jpg";
import rabbit from "assets/images/rabbit.jpg";
import React from "react";
import baseStyles from "styles/components.css";
import { upload } from "@canva/asset";

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
  const [dataUrl, setDataUrl] = React.useState(dog);
  const [isLoading, setIsLoading] = React.useState(false);
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

  const addImage = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { ref } = await upload({
        type: "IMAGE",
        mimeType: "image/jpeg",
        url: dataUrl,
        thumbnailUrl: dataUrl,
      });

      await addNativeElement({
        type: "IMAGE",
        ref,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dataUrl]);

  return (
    <div className={baseStyles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can add native image elements to a
          design.
        </Text>
        <FormField
          label="Select an image"
          control={(props) => (
            <Box id={props.id} padding="1u">
              <Grid columns={3} spacing="1.5u">
                {items.map((item) => (
                  <ImageCard
                    ariaLabel={item.title}
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
