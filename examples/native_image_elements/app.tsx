import { addNativeElement } from "@canva/design";
import {
  Box,
  Button,
  FormField,
  Rows,
  Text,
  TextInput,
} from "@canva/app-ui-kit";
import cat from "assets/images/cat.jpg";
import dog from "assets/images/dog.jpg";
import rabbit from "assets/images/rabbit.jpg";
import clsx from "clsx";
import React from "react";
import styles from "styles/components.css";

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

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can add native image elements to a
          design.
        </Text>
        <FormField
          label="Select an image"
          control={(props) => (
            <Box id={props.id} paddingTop="1u">
              <div className={styles.thumbnailGrid}>
                {items.map((item) => (
                  <img
                    className={clsx(
                      styles.thumbnail,
                      item.active && styles.active
                    )}
                    key={item.key}
                    src={item.imageSrc}
                    onClick={item.onClick}
                    alt={item.title}
                  />
                ))}
              </div>
            </Box>
          )}
        />
      </Rows>
      <Rows spacing="3u">
        <FormField
          label="Data URL"
          value={dataUrl}
          control={(props) => <TextInput {...props} disabled />}
        />
        <Button
          variant="primary"
          disabled={disabled}
          loading={isLoading}
          onClick={async () => {
            try {
              setIsLoading(true);
              await addNativeElement({
                type: "IMAGE",
                dataUrl,
              });
            } finally {
              setIsLoading(false);
            }
          }}
          stretch
        >
          Add element
        </Button>
      </Rows>
    </div>
  );
};
