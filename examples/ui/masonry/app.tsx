// For usage information, see the README.md file.
import {
  Masonry,
  MasonryItem,
  ImageCard,
  Rows,
  Text,
  Placeholder,
} from "@canva/app-ui-kit";
import { useState, useRef, useEffect, useCallback } from "react";
import * as styles from "styles/components.css";
import type { QueuedImage } from "@canva/asset";
import { upload } from "@canva/asset";
import type { ImageDragConfig } from "@canva/design";
import { ui } from "@canva/design";
import type { Image } from "./fake_api";
import { getImages } from "./fake_api";
import InfiniteScroll from "react-infinite-scroller";
import { generatePlaceholders } from "./utils";
import { useAddElement } from "utils/use_add_element";
import { useFeatureSupport } from "utils/use_feature_support";

const TARGET_ROW_HEIGHT_PX = 100;
const NUM_PLACEHOLDERS = 10;

const uploadImage = async (image: Image): Promise<QueuedImage> => {
  // Upload the image directly since we're using static URLs from Canva's example assets
  const queuedImage = await upload({
    type: "image",
    mimeType: image.url.endsWith(".png") ? "image/png" : "image/jpeg",
    url: image.url,
    thumbnailUrl: image.url,
    width: image.width,
    height: image.height,
    aiDisclosure: "none",
  });

  return queuedImage;
};

export const Placeholders = generatePlaceholders({
  numPlaceholders: NUM_PLACEHOLDERS,
  height: TARGET_ROW_HEIGHT_PX,
}).map((placeholder, index) => (
  <MasonryItem
    targetWidthPx={placeholder.width}
    targetHeightPx={placeholder.height}
    key={`placeholder-${index}`}
  >
    <Placeholder shape="rectangle" />
  </MasonryItem>
));

export const App = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState<number | undefined>(1);
  const [hasMore, setHasMore] = useState(true);
  const isSupported = useFeatureSupport();
  const addElement = useAddElement();

  const scrollContainerRef = useRef(null);

  const fetchImages = useCallback(async () => {
    if (isFetching || !page || !hasMore) {
      return;
    }

    setIsFetching(true);

    try {
      const { images: newImages, nextPage } = await getImages(page);

      setImages((prevImages) => [...prevImages, ...newImages]);
      setPage(nextPage);
      setHasMore(nextPage != null);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, page, hasMore]);

  // Load first page on mount
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const addImageToDesign = async (image: Image) => {
    const queuedImage = await uploadImage(image);

    await addElement({
      type: "image",
      ref: queuedImage.ref,
      altText: {
        text: "an example image",
        decorative: undefined,
      },
    });
  };

  const onDragStart = async (
    event: React.DragEvent<HTMLElement>,
    image: Image,
  ) => {
    const dragData: ImageDragConfig = {
      type: "image",
      resolveImageRef: () => uploadImage(image),
      // Our mock API doesn't return a thumbnail/preview image, but for a production app
      // you should use real lower resolution thumbnail/preview images
      previewUrl: image.url,
      previewSize: {
        width: image.width,
        height: image.height,
      },
      fullSize: {
        width: image.width,
        height: image.height,
      },
    };
    if (isSupported(ui.startDragToPoint)) {
      ui.startDragToPoint(event, dragData);
    } else if (isSupported(ui.startDragToCursor)) {
      ui.startDragToCursor(event, dragData);
    }
  };

  const Images = images.map((image, index) => (
    <MasonryItem
      targetWidthPx={image.width}
      targetHeightPx={image.height}
      key={`MasonryItem-${index}`}
    >
      <ImageCard
        ariaLabel="Add image to design"
        onClick={() => addImageToDesign(image)}
        thumbnailUrl={image.url}
        alt={image.title}
        onDragStart={(event: React.DragEvent<HTMLElement>) =>
          onDragStart(event, image)
        }
      />
    </MasonryItem>
  ));

  return (
    <div className={styles.scrollContainer} ref={scrollContainerRef}>
      <Rows spacing="2u">
        <Text>
          This example demonstrates how apps can use the Masonry component from
          the App UI Kit with static example images.
        </Text>
        <InfiniteScroll
          loadMore={fetchImages}
          hasMore={hasMore && !isFetching}
          useWindow={false}
          getScrollParent={() => scrollContainerRef.current}
        >
          <Masonry targetRowHeightPx={TARGET_ROW_HEIGHT_PX}>
            {[...Images, ...(isFetching ? Placeholders : [])]}
          </Masonry>
        </InfiniteScroll>
      </Rows>
    </div>
  );
};
