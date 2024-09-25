import {
  Box,
  Button,
  FormField,
  Grid,
  ImageCard,
  NumberInput,
  Rows,
  Text,
} from "@canva/app-ui-kit";
import { initAppElement } from "@canva/design";
import cat from "assets/images/cat.jpg";
import dog from "assets/images/dog.jpg";
import rabbit from "assets/images/rabbit.jpg";
import { useEffect, useState, useCallback } from "react";
import * as styles from "styles/components.css";
import { upload } from "@canva/asset";

// We can't store the image's data URL in the app element's data, since it
// exceeds the 5kb limit. We can, however, store an ID that references the
// image.
type AppElementData = {
  imageId: string;
  width: number;
  height: number;
  rotation: number;
};

type UIState = AppElementData;

const images = {
  dog: {
    title: "Dog",
    imageSrc: dog,
    imageRef: undefined,
  },
  cat: {
    title: "Cat",
    imageSrc: cat,
    imageRef: undefined,
  },
  rabbit: {
    title: "Rabbit",
    imageSrc: rabbit,
    imageRef: undefined,
  },
};

const initialState: UIState = {
  imageId: "dog",
  width: 400,
  height: 400,
  rotation: 0,
};

const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    return [
      {
        type: "image",
        top: 0,
        left: 0,
        ref: images[data.imageId].imageRef,
        altText: {
          text: `photo of a ${images[data.imageId].title}`,
          decorative: undefined,
        },
        ...data,
      },
    ];
  },
});

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<UIState>(initialState);
  const { imageId, width, height, rotation } = state;
  const disabled = loading || !imageId || imageId.trim().length < 1;

  const items = Object.entries(images).map(([key, value]) => {
    const { title, imageSrc } = value;
    return {
      key,
      title,
      imageSrc,
      active: imageId === key,
      onClick: () => {
        setState((prevState) => {
          return {
            ...prevState,
            imageId: key,
          };
        });
      },
    };
  });

  const addOrUpdateImage = useCallback(async () => {
    setLoading(true);
    try {
      if (!images[state.imageId].imageRef) {
        // Upload local image
        const imageSrc = images[state.imageId].imageSrc;
        const { ref } = await upload({
          type: "image",
          mimeType: "image/jpeg",
          url: imageSrc,
          thumbnailUrl: imageSrc,
          aiDisclosure: "none",
        });
        images[state.imageId].imageRef = ref;
      }

      // Add or update app element
      await appElementClient.addOrUpdateElement(state);
    } finally {
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState(appElement ? appElement.data : initialState);
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can create image elements inside
          app elements. This makes the element re-editable and lets apps control
          additional properties, such as the width and height.
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
        <FormField
          label="Width"
          value={width}
          control={(props) => (
            <NumberInput
              {...props}
              min={1}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    width: Number(value || 0),
                  };
                });
              }}
            />
          )}
        />
        <FormField
          label="Height"
          value={height}
          control={(props) => (
            <NumberInput
              {...props}
              min={1}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    height: Number(value || 0),
                  };
                });
              }}
            />
          )}
        />
        <FormField
          label="Rotation"
          value={rotation}
          control={(props) => (
            <NumberInput
              {...props}
              min={-180}
              max={180}
              onChange={(value) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    rotation: Number(value || 0),
                  };
                });
              }}
            />
          )}
        />
        <Button
          variant="primary"
          onClick={addOrUpdateImage}
          disabled={disabled}
          stretch
        >
          Add or update image
        </Button>
      </Rows>
    </div>
  );
};
