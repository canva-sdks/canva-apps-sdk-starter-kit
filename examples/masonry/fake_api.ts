const NUMBER_OF_IMAGES = 50;
const NUM_PAGES = 5;
const MIN_WIDTH_PX = 200;
const MAX_WIDTH_PX = 400;
const HEIGHT_PX = 300;

export type Image = {
  title: string;
  url: string;
  height: number;
  width: number;
};

export type PaginatedResponse = {
  nextPage?: number;
  pageCount: number;
  images: Image[];
};

const generateImages = ({
  numImages,
  minWidthPx,
  maxWidthPx,
}: {
  numImages: number;
  minWidthPx: number;
  maxWidthPx: number;
}) => {
  return Array.from({ length: numImages }, (_, i) => {
    const randomWidthPx = Math.floor(
      Math.random() * (maxWidthPx - minWidthPx + 1) + minWidthPx,
    );

    return {
      title: `image-${i}`,
      url: `https://picsum.photos/id/${i + 1}/${randomWidthPx}/${HEIGHT_PX}`,
      height: HEIGHT_PX,
      width: randomWidthPx,
    };
  });
};

// Paginated api example to demo infinite scrolling.
// The same 50 images are returned each time.
// Please do not use this as a best practice example.
export const getImages = async (page: number): Promise<PaginatedResponse> => {
  // Wait 1 second to simulate a fetch request.
  await new Promise((res) => setTimeout(res, 1000));

  return {
    pageCount: NUM_PAGES,
    nextPage: page === NUM_PAGES ? undefined : page + 1,
    images: generateImages({
      numImages: NUMBER_OF_IMAGES,
      minWidthPx: MIN_WIDTH_PX,
      maxWidthPx: MAX_WIDTH_PX,
    }),
  };
};
