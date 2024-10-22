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
import { initAppElement } from "@canva/design";
import React from "react";
import * as styles from "styles/components.css";
import { upload } from "@canva/asset";

type AppElementData = {
  title: string;
  videoId: string;
  width: number;
  height: number;
  rotation: number;
};

type UIState = AppElementData;

const videos = {
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

const initialState: UIState = {
  title: "Pinwheel on building",
  videoId: "building",
  width: 405,
  height: 720,
  rotation: 0,
};

const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    return [
      {
        type: "video",
        top: 0,
        left: 0,
        altText: {
          text: `a video of ${data.title}`,
          decorative: undefined,
        },
        ref: videos[data.videoId].videoRef,
        ...data,
      },
    ];
  },
});

export const App = () => {
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState<UIState>(initialState);
  const { videoId, width, height, rotation } = state;
  const disabled = loading || !videoId || videoId.trim().length < 1;

  const items = Object.entries(videos).map(([key, value]) => {
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
            videoId: key,
            width,
            height,
          };
        });
      },
    };
  });

  const addOrUpdateVideo = React.useCallback(async () => {
    setLoading(true);
    try {
      if (!videos[state.videoId].videoRef) {
        const item = videos[state.videoId];
        const { ref } = await upload({
          type: "video",
          mimeType: "video/mp4",
          url: item.url,
          thumbnailImageUrl: item.thumbnailImageUrl,
          thumbnailVideoUrl: item.thumbnailVideoUrl,
          aiDisclosure: "none",
        });
        videos[state.videoId].videoRef = ref;
      }

      // Add or update app element
      await appElementClient.addOrUpdateElement(state);
    } finally {
      setLoading(false);
    }
  }, [state]);

  React.useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState(appElement ? appElement.data : initialState);
    });
  }, []);

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can create video elements inside
          app elements. This makes the element re-editable and lets apps control
          additional properties, such as the width and height.
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
                    width: value || 0,
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
                    height: value || 0,
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
                    rotation: value || 0,
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
          Add or update video
        </Button>
      </Rows>
    </div>
  );
};
