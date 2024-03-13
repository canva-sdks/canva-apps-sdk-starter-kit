import { addNativeElement } from "@canva/design";
import { upload } from "@canva/asset";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import React from "react";
import styles from "styles/components.css";

const HEART_PATH =
  "M 20 10 C 20.97 5 22.911 0 29.702 0 C 36.494 0 41.83 5 39.405 15 C 36.979 25 25.821 30 20 40 C 14.179 30 3.021 25 0.595 15 C -1.8304 5 3.5059 0 10.298 0 C 17.089 0 19.03 5 20 10 Z";

export const App = () => {
  const addShapeWithImageFill = async () => {
    // Start uploading the image
    const image = await upload({
      type: "IMAGE",
      mimeType: "image/jpeg",
      url: "https://www.canva.dev/example-assets/image-import/image.jpg",
      thumbnailUrl:
        "https://www.canva.dev/example-assets/image-import/thumbnail.jpg",
      width: 540,
      height: 720,
    });

    // Add the image to the design
    await addNativeElement({
      type: "SHAPE",
      paths: [
        {
          d: HEART_PATH,
          fill: {
            dropTarget: true,
            asset: {
              type: "IMAGE",
              ref: image.ref,
            },
          },
        },
      ],
      viewBox: {
        width: 40,
        height: 40,
        top: 0,
        left: 0,
      },
    });

    // Wait for the upload to finish so we can report errors if it fails to
    // upload
    await image.whenUploaded();

    // upload is completed
    console.log("Upload complete!");
  };

  const addShapeWithVideoFill = async () => {
    // Start uploading the video
    const video = await upload({
      type: "VIDEO",
      mimeType: "video/mp4",
      url: "https://www.canva.dev/example-assets/video-import/video.mp4",
      thumbnailImageUrl:
        "https://www.canva.dev/example-assets/video-import/thumbnail-image.jpg",
      thumbnailVideoUrl:
        "https://www.canva.dev/example-assets/video-import/thumbnail-video.mp4",
      width: 405,
      height: 720,
    });

    // Add the video to the design
    await addNativeElement({
      type: "SHAPE",
      paths: [
        {
          d: HEART_PATH,
          fill: {
            dropTarget: true,
            asset: {
              type: "VIDEO",
              ref: video.ref,
            },
          },
        },
      ],
      viewBox: {
        width: 40,
        height: 40,
        top: 0,
        left: 0,
      },
    });

    // Wait for the upload to finish so we can report errors if it fails to
    // upload
    await video.whenUploaded();

    // upload is completed
    console.log("Upload complete!");
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This example demonstrates how apps can add native shape elements with
          image and video fill.
        </Text>
        <Rows spacing="1.5u">
          <Button onClick={addShapeWithImageFill} variant="secondary" stretch>
            Add shape element with image fill
          </Button>
          <Button onClick={addShapeWithVideoFill} variant="secondary" stretch>
            Add shape element with video fill
          </Button>
        </Rows>
      </Rows>
    </div>
  );
};
