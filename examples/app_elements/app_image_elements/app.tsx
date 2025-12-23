// For usage information, see the README.md file.
/* eslint-disable no-restricted-imports */
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
import {
  type AppElementOptions,
  initAppElement,
  type ImageRef,
} from "@canva/design";
import cat from "assets/images/cat.jpg";
import dog from "assets/images/dog.jpg";
import rabbit from "assets/images/rabbit.jpg";
import { useEffect, useState, useCallback } from "react";
import * as styles from "styles/components.css";
import { upload } from "@canva/asset";

// App element data structure for image elements
// We can't store the image's data URL in the app element's data, since it
// exceeds the 5kb limit. We can, however, store an ID that references the
// image.
type AppElementData = {
  imageId: string;
  width: number;
  height: number;
  rotation: number;
};

type AppElementChangeEvent = {
  data: AppElementData;
  update?: (opts: AppElementOptions<AppElementData>) => Promise<void>;
};

enum Operation {
  Add,
  Update,
}

type ExampleImage = {
  title: string;
  imageSrc: string;
  imageRef: ImageRef | undefined;
};

// Static images are used here for demonstration purposes only.
// In a real app, to avoid bloating your app bundle size,
// you should use a CDN/hosting service to host your images,
// then upload them to Canva using the `upload` function from the `@canva/asset` package.
const STATIC_IMAGES: Record<string, ExampleImage> = {
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

const initialState: AppElementChangeEvent = {
  data: { imageId: "dog", width: 400, height: 400, rotation: 0 },
};

// Initialize the app element client for rendering image elements
// This defines how the app element data gets rendered as design elements
const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    // In production, you would likely be fetching this from a database or API
    const image = STATIC_IMAGES[data.imageId];
    if (!image) {
      throw new Error(`Unknown image ID: ${data.imageId}`);
    }

    if (!image.imageRef) {
      throw new Error(`Image ${data.imageId} has not been uploaded yet`);
    }

    return [
      {
        type: "image",
        top: 0,
        left: 0,
        ref: image.imageRef,
        altText: {
          text: `photo of a ${image.title}`,
          decorative: undefined,
        },
        ...data,
      },
    ];
  },
});

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<AppElementChangeEvent>(initialState);
  const {
    data: { imageId, width, height, rotation },
  } = state;
  const disabled = loading || !imageId || imageId.trim().length < 1;

  const items = Object.entries(STATIC_IMAGES).map(([key, value]) => {
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
            data: {
              ...prevState.data,
              imageId: key,
            },
          };
        });
      },
    };
  });

  const addOrUpdateImage = useCallback(
    async (operation: Operation) => {
      setLoading(true);

      // In production, you would likely be fetching this from a database or API
      const image = STATIC_IMAGES[state.data.imageId];
      if (!image) {
        throw new Error(`Unknown image ID: ${state.data.imageId}`);
      }

      try {
        // Upload the image asset if not already uploaded
        // This creates a reusable image reference for the app element
        if (!image.imageRef) {
          const imageSrc = image.imageSrc;
          const { ref } = await upload({
            type: "image",
            mimeType: "image/jpeg",
            url: imageSrc,
            thumbnailUrl: imageSrc,
            aiDisclosure: "none",
          });

          image.imageRef = ref;
        }

        // Either add a new app element or update the existing one
        if (operation === Operation.Add) {
          await appElementClient.addElement({
            data: state.data,
          });
        } else {
          if (!state.update) {
            throw new Error("Update function is not available");
          }
          await state.update({
            data: state.data,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [state],
  );

  // Register listener for app element selection changes
  // This updates the UI when users select different app elements in the design
  useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState(
        appElement
          ? {
              ...appElement,
            }
          : initialState,
      );
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can create image elements inside
          app elements. Using an app element makes the image element re-editable
          and lets apps control additional properties, such as the width and
          height.
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
                    data: {
                      ...prevState.data,
                      width: Number(value || 0),
                    },
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
                    data: {
                      ...prevState.data,
                      height: Number(value || 0),
                    },
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
                    data: {
                      ...prevState.data,
                      rotation: Number(value || 0),
                    },
                  };
                });
              }}
            />
          )}
        />
        <Button
          variant="primary"
          onClick={() => addOrUpdateImage(Operation.Add)}
          disabled={disabled}
          stretch
        >
          Add image
        </Button>
        {state.update && (
          <Button
            variant="primary"
            onClick={() => addOrUpdateImage(Operation.Update)}
            disabled={disabled}
            stretch
          >
            Update image
          </Button>
        )}
      </Rows>
    </div>
  );
};
