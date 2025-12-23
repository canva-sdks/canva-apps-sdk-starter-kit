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

// Static images from Canva example assets
// In a real app, you would fetch images from your CDN/database instead of using static data
const STATIC_IMAGES: Image[] = [
  {
    title: "Bee",
    url: "https://www.canva.dev/example-assets/images/bee.png",
    width: 640,
    height: 640,
  },
  {
    title: "Dolphin",
    url: "https://www.canva.dev/example-assets/images/dolphin.jpg",
    width: 640,
    height: 640,
  },
  {
    title: "Canva Logo",
    url: "https://www.canva.dev/example-assets/images/logo.png",
    width: 240,
    height: 240,
  },
  {
    title: "Puppy",
    url: "https://www.canva.dev/example-assets/images/puppyhood.jpg",
    width: 400,
    height: 300,
  },
];

const generateImages = (numImages: number) => {
  // Create variations of the static images to fill the requested number
  // In a real app, this function wouldn't be needed - you'd get actual image data from your API
  const images: Image[] = [];
  for (let i = 0; i < numImages; i++) {
    const baseImage = STATIC_IMAGES[i % STATIC_IMAGES.length];
    if (baseImage) {
      images.push({
        ...baseImage,
        title: `${baseImage.title} ${Math.floor(i / STATIC_IMAGES.length) + 1}`,
      });
    }
  }
  return images;
};

// Paginated api example to demo infinite scrolling.
// Uses static Canva example images instead of external API.
// In a real app, replace this with actual API calls to your image service
export const getImages = async (page: number): Promise<PaginatedResponse> => {
  // Wait 1 second to simulate a fetch request.
  // In a real app, this would be something like const response = await fetch(`/api/images?page=${page}`)
  await new Promise((res) => setTimeout(res, 1000));

  const imagesPerPage = 10;
  const totalImages = 50;
  const totalPages = Math.ceil(totalImages / imagesPerPage);

  const startIndex = (page - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;

  // In a real app, you would make an API call here and get back the paginated results
  // For example: const { data: pageImages, hasMore } = await apiClient.getImages({ page, limit: imagesPerPage })
  const allImages = generateImages(totalImages);
  const pageImages = allImages.slice(startIndex, endIndex);

  return {
    pageCount: totalPages,
    nextPage: page < totalPages ? page + 1 : undefined,
    images: pageImages,
  };
};
