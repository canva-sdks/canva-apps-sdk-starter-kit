// For usage information, see the README.md file.
/* eslint-disable no-restricted-imports */
import {
  Alert,
  Box,
  Button,
  FormField,
  Grid,
  ImageCard,
  Rows,
  Select,
  Text,
} from "@canva/app-ui-kit";
import type { AppElementOptions, Placement, ImageRef } from "@canva/design";
import {
  addElementAtPoint,
  getCurrentPageContext,
  initAppElement,
} from "@canva/design";
import cat from "assets/images/cat.jpg";
import dog from "assets/images/dog.jpg";
import rabbit from "assets/images/rabbit.jpg";
import { useCallback, useEffect, useState } from "react";
import * as styles from "styles/components.css";
import { upload } from "@canva/asset";
import { useFeatureSupport } from "utils/use_feature_support";

// Below values are only for demonstration purposes.
// You can position your elements anywhere on the page by providing arbitrary
// values for placement attributes: top, left, width, height and rotation.
const enum ElementPlacement {
  DEFAULT = "default",
  TOP_LEFT = "top_left",
  TOP_RIGHT = "top_right",
  BOTTOM_LEFT = "bottom_left",
  BOTTOM_RIGHT = "bottom_right",
}

// App elements in Canva have a 5KB data limit per element.
// Rather than storing large image data URLs directly, we store a reference ID
// that maps to the actual image asset after upload via the @canva/asset package.
type AppElementData = {
  imageId: string;
};

type UIState = {
  placement?: ElementPlacement;
  data: AppElementData;
  update?: (opts: AppElementOptions<AppElementData>) => Promise<void>;
};

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
  dog: { title: "Dog", imageSrc: dog, imageRef: undefined },
  cat: { title: "Cat", imageSrc: cat, imageRef: undefined },
  rabbit: { title: "Rabbit", imageSrc: rabbit, imageRef: undefined },
};

const initialState: UIState = {
  data: {
    imageId: "dog",
  },
  placement: ElementPlacement.DEFAULT,
};

// Initialize the app element client for creating interactive elements in designs.
// App elements are reusable, customizable components that users can edit within Canva.
// The render function defines how the element appears when placed in a design.
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
        ref: image.imageRef,
        top: 0,
        left: 0,
        width: 400,
        height: 400,
        altText: {
          text: `photo of a ${image.title}`,
          decorative: undefined,
        },
      },
    ];
  },
});

export const App = () => {
  const isSupported = useFeatureSupport();
  const isRequiredFeatureSupported = isSupported(
    addElementAtPoint,
    getCurrentPageContext,
  );

  const [state, setState] = useState<UIState>(initialState);
  const {
    data: { imageId },
  } = state;
  const disabled = !imageId || imageId.trim().length < 1;

  // Calculate placement coordinates based on page dimensions and desired position.
  // Some design types (like docs) don't support absolute positioning, so we check compatibility.
  const getPlacement = async (
    placement?: ElementPlacement,
  ): Promise<Placement | undefined> => {
    const pageContext = await getCurrentPageContext();
    const pageDimensions = pageContext.dimensions;
    if (!pageDimensions) {
      // Current doctype doesn't support absolute positioning
      return;
    }

    // Scale element size to half the smaller page dimension for consistent appearance
    const elementSize =
      Math.min(pageDimensions.height, pageDimensions.width) / 2;
    switch (placement) {
      case ElementPlacement.TOP_LEFT:
        return {
          top: 0,
          left: 0,
          width: elementSize,
          height: elementSize,
          rotation: 0,
        };
      case ElementPlacement.TOP_RIGHT:
        return {
          top: 0,
          left: pageDimensions.width - elementSize,
          width: elementSize,
          height: elementSize,
          rotation: 0,
        };
      case ElementPlacement.BOTTOM_LEFT:
        return {
          top: pageDimensions.height - elementSize,
          left: 0,
          width: elementSize,
          height: elementSize,
          rotation: 0,
        };
      case ElementPlacement.BOTTOM_RIGHT:
        return {
          top: pageDimensions.height - elementSize,
          left: pageDimensions.width - elementSize,
          width: elementSize,
          height: elementSize,
          rotation: 0,
        };
      default:
        return undefined;
    }
  };

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

  // Add or update an app element (interactive, editable element) in the design.
  // App elements can be updated in-place if they already exist in the design.
  const addOrUpdateAppImage = useCallback(async () => {
    // In production, you would likely be fetching this from a database or API
    const image = STATIC_IMAGES[state.data.imageId];
    if (!image) {
      throw new Error(`Unknown image ID: ${state.data.imageId}`);
    }

    // Image has not yet been uploaded
    // Upload image to Canva's asset system to get a reference for use in designs
    if (!image.imageRef) {
      const { ref } = await upload({
        type: "image",
        mimeType: "image/jpeg",
        url: image.imageSrc,
        thumbnailUrl: image.imageSrc,
        width: 400,
        height: 400,
        aiDisclosure: "none",
      });
      image.imageRef = ref;
    }
    const placement = await getPlacement(state.placement);
    if (state.update) {
      state.update({ data: state.data, placement });
    } else {
      appElementClient.addElement({ data: state.data, placement });
    }
  }, [state]);

  // Add a static image element directly to the design at specified coordinates.
  // Unlike app elements, these are not interactive or editable once placed.
  const addImage = useCallback(async () => {
    // In production, you would likely be fetching this from a database or API
    const image = STATIC_IMAGES[state.data.imageId];
    if (!image) {
      throw new Error(`Unknown image ID: ${state.data.imageId}`);
    }

    if (!image.imageRef) {
      // Upload image to Canva's asset system to get a reference for use in designs
      const { ref } = await upload({
        type: "image",
        mimeType: "image/jpeg",
        url: image.imageSrc,
        thumbnailUrl: image.imageSrc,
        width: 400,
        height: 400,
        aiDisclosure: "none",
      });
      image.imageRef = ref;
    }
    const placement = await getPlacement(state.placement);
    await addElementAtPoint({
      type: "image",
      ref: image.imageRef,
      altText: {
        text: `photo of a ${image.title}`,
        decorative: undefined,
      },
      ...placement,
    });
  }, [state]);

  // Register listener for app element changes (when user selects/deselects elements in design).
  // This allows the app to update its UI based on which app element is currently selected.
  useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState((prevState) => {
        return appElement
          ? {
              ...prevState,
              data: {
                ...prevState.data,
                ...appElement.data,
              },
              update: appElement.update,
            }
          : { ...prevState, update: undefined };
      });
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can get the dimensions of the
          current page and create elements at specific positions on that page.
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
          label="Placement"
          value={state.placement}
          control={(props) => (
            <Select
              {...props}
              options={[
                { value: ElementPlacement.DEFAULT, label: "Default" },
                { value: ElementPlacement.TOP_LEFT, label: "Top Left" },
                { value: ElementPlacement.TOP_RIGHT, label: "Top Right" },
                { value: ElementPlacement.BOTTOM_LEFT, label: "Bottom Left" },
                { value: ElementPlacement.BOTTOM_RIGHT, label: "Bottom Right" },
              ]}
              onChange={(event) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    placement: event,
                  };
                });
              }}
              stretch
            />
          )}
        />
        <Button
          variant="secondary"
          onClick={addOrUpdateAppImage}
          // Absolute positioning is not supported in certain design types such as docs
          disabled={disabled || !isRequiredFeatureSupported}
        >
          {state.update ? "Update app element" : "Add app element"}
        </Button>
        <Button
          variant="secondary"
          onClick={addImage}
          // Absolute positioning is not supported in certain design types such as docs
          disabled={disabled || !isRequiredFeatureSupported}
        >
          Add element
        </Button>
        {!isRequiredFeatureSupported && <UnsupportedAlert />}
      </Rows>
    </div>
  );
};

const UnsupportedAlert = () => (
  <Alert tone="warn">
    Sorry, the required features are not supported in the current design.
  </Alert>
);
