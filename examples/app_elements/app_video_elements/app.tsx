// For usage information, see the README.md file.
import {
  Box,
  Button,
  FormField,
  Grid,
  VideoCard,
  NumberInput,
  Rows,
  Text,
} from "@canva/app-ui-kit";
import {
  type AppElementOptions,
  initAppElement,
  type VideoRef,
} from "@canva/design";
import React from "react";
import * as styles from "styles/components.css";
import { upload } from "@canva/asset";

// Type definition for the data stored within an app element
type AppElementData = {
  title: string;
  videoId: string;
  width: number;
  height: number;
  rotation: number;
};

// Event handler type for app element changes (creation or editing)
type AppElementChangeEvent = {
  data: AppElementData;
  update?: (opts: AppElementOptions<AppElementData>) => Promise<void>;
};

type ExampleStaticVideo = {
  title: string;
  url: string;
  thumbnailImageUrl: string;
  thumbnailVideoUrl: string;
  width: number;
  height: number;
  videoRef: VideoRef | undefined;
};

// Sample video data for demonstration - in production apps, use CDN hosting
const STATIC_VIDEOS: Record<string, ExampleStaticVideo> = {
  building: {
    title: "Pinwheel on building",
    url: "https://www.canva.dev/example-assets/video-import/video.mp4",
    thumbnailImageUrl:
      "https://www.canva.dev/example-assets/video-import/thumbnail-image.jpg",
    thumbnailVideoUrl:
      "https://www.canva.dev/example-assets/video-import/thumbnail-video.mp4",
    width: 405,
    height: 720,
    videoRef: undefined,
  },
  beach: {
    title: "A beautiful beach scene",
    url: "https://www.canva.dev/example-assets/video-import/beach-video.mp4",
    thumbnailImageUrl:
      "https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg",
    thumbnailVideoUrl:
      "https://www.canva.dev/example-assets/video-import/beach-thumbnail-video.mp4",
    width: 320,
    height: 180,
    videoRef: undefined,
  },
};

const initialState: AppElementChangeEvent = {
  data: {
    title: "Pinwheel on building",
    videoId: "building",
    width: 405,
    height: 720,
    rotation: 0,
  },
};

// Initialize the app element client to handle video rendering in Canva designs
const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    // In production, you would likely be fetching this from a database or API
    const video = STATIC_VIDEOS[data.videoId];

    if (!video) {
      throw new Error(`Unknown video ID: ${data.videoId}`);
    }

    if (!video.videoRef) {
      throw new Error(`Video ${data.videoId} has not been uploaded yet`);
    }

    return [
      {
        type: "video",
        top: 0,
        left: 0,
        altText: {
          text: `a video of ${data.title}`,
          decorative: undefined,
        },
        ref: video.videoRef,
        ...data,
      },
    ];
  },
});

export const App = () => {
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState<AppElementChangeEvent>(initialState);
  const {
    data: { videoId, width, height, rotation },
  } = state;
  const disabled = loading || !videoId || videoId.trim().length < 1;

  const items = Object.entries(STATIC_VIDEOS).map(([key, value]) => {
    const { title, thumbnailImageUrl, thumbnailVideoUrl, width, height } =
      value;
    return {
      key,
      title,
      thumbnailImageUrl,
      thumbnailVideoUrl,
      active: videoId === key,
      onClick: () => {
        setState((prevState) => {
          return {
            ...prevState,
            data: {
              ...prevState.data,
              videoId: key,
              width,
              height,
            },
          };
        });
      },
    };
  });

  const addOrUpdateVideo = React.useCallback(async () => {
    setLoading(true);
    try {
      // In production, you would likely be fetching this from a database or API
      const video = STATIC_VIDEOS[state.data.videoId];

      if (!video) {
        throw new Error(`Unknown video ID: ${state.data.videoId}`);
      }

      // Upload video to Canva if not already uploaded
      if (!video.videoRef) {
        const { ref } = await upload({
          type: "video",
          mimeType: "video/mp4",
          url: video.url,
          thumbnailImageUrl: video.thumbnailImageUrl,
          thumbnailVideoUrl: video.thumbnailVideoUrl,
          aiDisclosure: "none",
        });

        // Update the mutable videoRef property
        video.videoRef = ref;
      }

      // Add new app element or update existing one based on current state
      if (state.update) {
        state.update({ data: state.data });
      } else {
        appElementClient.addElement({ data: state.data });
      }
    } finally {
      setLoading(false);
    }
  }, [state]);

  // Register listener for when user selects an existing app element to edit
  React.useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState(
        appElement
          ? {
              data: appElement.data,
              update: appElement.update,
            }
          : initialState,
      );
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can create video elements inside
          app elements. Using an app element makes the video element re-editable
          and lets apps control additional properties, such as the width and
          height.
        </Text>
        <FormField
          label="Select a video"
          control={(props) => (
            <Box {...props} padding="1u">
              <Grid columns={2} spacing="1.5u">
                {items.map((item) => (
                  <VideoCard
                    ariaLabel={item.title}
                    mimeType="video/mp4"
                    key={item.key}
                    thumbnailUrl={item.thumbnailImageUrl}
                    videoPreviewUrl={item.thumbnailVideoUrl}
                    onClick={item.onClick}
                    selectable={true}
                    selected={item.active}
                    borderRadius="standard"
                    thumbnailHeight={150}
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
                      width: value || 0,
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
                      height: value || 0,
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
                      rotation: value || 0,
                    },
                  };
                });
              }}
            />
          )}
        />
        <Button
          variant="primary"
          onClick={addOrUpdateVideo}
          disabled={disabled}
          stretch
        >
          {`${state.update ? "Update" : "Add"} video`}
        </Button>
      </Rows>
    </div>
  );
};
