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
import type { Placement } from "@canva/design";
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

// Below values are only for demonstration purposes.0
// You can position your elements anywhere on the page by providing arbitrary
// values for placement attributes: top, left, width, height and rotation.
const enum ElementPlacement {
  DEFAULT = "default",
  TOP_LEFT = "top_left",
  TOP_RIGHT = "top_right",
  BOTTOM_LEFT = "bottom_left",
  BOTTOM_RIGHT = "bottom_right",
}

// We can't store the image's data URL in the app element's data, since it
// exceeds the 5kb limit. We can, however, store an ID that references the
// image.
type AppElementData = {
  imageId: string;
};

type UIState = AppElementData & {
  placement?: ElementPlacement;
  isEditingAppElement: boolean;
};

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
  placement: ElementPlacement.DEFAULT,
  isEditingAppElement: false,
};

const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    return [
      {
        type: "image",
        ref: images[data.imageId].imageRef,
        top: 0,
        left: 0,
        width: 400,
        height: 400,
        altText: {
          text: `photo of a ${images[data.imageId].title}`,
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
  const { imageId } = state;
  const disabled = !imageId || imageId.trim().length < 1;

  const getPlacement = async (
    placement?: ElementPlacement,
  ): Promise<Placement | undefined> => {
    const pageContext = await getCurrentPageContext();
    const pageDimensions = pageContext.dimensions;
    if (!pageDimensions) {
      // Current doctype doesn't support absolute positioning
      return;
    }

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

  const addOrUpdateAppImage = useCallback(async () => {
    if (!images[state.imageId].imageRef) {
      // Upload local image
      const { ref } = await upload({
        type: "image",
        mimeType: "image/jpeg",
        url: images[state.imageId].imageSrc,
        thumbnailUrl: images[state.imageId].imageSrc,
        width: 400,
        height: 400,
        aiDisclosure: "none",
      });
      images[state.imageId].imageRef = ref;
    }
    const placement = await getPlacement(state.placement);
    await appElementClient.addOrUpdateElement(
      { imageId: state.imageId },
      placement,
    );
  }, [state]);

  const addImage = useCallback(async () => {
    if (!images[state.imageId].imageRef) {
      // Upload local image
      const { ref } = await upload({
        type: "image",
        mimeType: "image/jpeg",
        url: images[state.imageId].imageSrc,
        thumbnailUrl: images[state.imageId].imageSrc,
        width: 400,
        height: 400,
        aiDisclosure: "none",
      });
      images[state.imageId].imageRef = ref;
    }
    const placement = await getPlacement(state.placement);
    await addElementAtPoint({
      type: "image",
      ref: images[state.imageId].imageRef,
      altText: {
        text: `photo of a ${images[state.imageId].title}`,
        decorative: undefined,
      },
      ...placement,
    });
  }, [state]);

  useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState((prevState) => {
        return appElement
          ? {
              ...prevState,
              ...appElement.data,
              isEditingAppElement: Boolean(appElement.data),
            }
          : { ...prevState, isEditingAppElement: false };
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
          // Positioning appElement absolutely is not supported in certain design types such as docs.
          disabled={disabled || !isRequiredFeatureSupported}
        >
          {state.isEditingAppElement ? "Update app element" : "Add app element"}
        </Button>
        <Button
          variant="secondary"
          onClick={addImage}
          // Positioning elements absolutely is not supported in certain design types such as docs.
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
