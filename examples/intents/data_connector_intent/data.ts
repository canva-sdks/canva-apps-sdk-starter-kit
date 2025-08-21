import type {
  DataTable,
  DataTableImageUpload,
  DataTableVideoUpload,
  GetDataTableRequest,
} from "@canva/intents/data";

export const saleStageOptions: string[] = [
  "Initial Release Stage",
  "Construction Stage",
  "Final Release Stage",
];

// define the data source structure - the configurable parameters of the data query
export type RealEstateDataConfig = {
  selectedStageFilter?: string[];
};

// for a given data source query, get the data from the mock API and transform it to DataTable format
export const getRealEstateData = async (
  request: GetDataTableRequest,
): Promise<DataTable> => {
  return new Promise((resolve) => {
    const { dataSourceRef, limit } = request;
    if (dataSourceRef != null) {
      const dataRef = JSON.parse(dataSourceRef?.source) as RealEstateDataConfig;

      const selectedStages = dataRef.selectedStageFilter?.length
        ? dataRef.selectedStageFilter
        : saleStageOptions;

      // get the projects data from the mock API
      const projects = getProjects();

      // filter projects based on selected stages and transform to DataTable
      const dataTable = transformToDataTable(projects, selectedStages);

      // ensure we don't exceed row limit
      dataTable.rows = dataTable.rows.slice(0, limit.row);

      resolve(dataTable);
    }
  });
};

// mock api response structure
interface RealEstateProject {
  name: string;
  initialReleaseStage: number;
  constructionStage: number;
  finalReleaseStage: number;
  media: (DataTableImageUpload | DataTableVideoUpload)[];
}

/**
 * Sample data for real estate projects.
 * Each project has a name, sales stage values, and media assets.
 */
const getProjects = (): RealEstateProject[] => [
  {
    name: "The Kensington",
    initialReleaseStage: getRandomSalesValue(),
    constructionStage: getRandomSalesValue(),
    finalReleaseStage: getRandomSalesValue(),
    media: staticMediaData,
  },
  {
    name: "Horizon Hurstville",
    initialReleaseStage: getRandomSalesValue(),
    constructionStage: getRandomSalesValue(),
    finalReleaseStage: getRandomSalesValue(),
    media: staticMediaData,
  },
  {
    name: "Sterling Lane Cove",
    initialReleaseStage: getRandomSalesValue(),
    constructionStage: getRandomSalesValue(),
    finalReleaseStage: getRandomSalesValue(),
    media: staticMediaData,
  },
  {
    name: "Surry Hills Village",
    initialReleaseStage: getRandomSalesValue(),
    constructionStage: getRandomSalesValue(),
    finalReleaseStage: getRandomSalesValue(),
    media: staticMediaData,
  },
  {
    name: "Willoughby Grounds",
    initialReleaseStage: getRandomSalesValue(),
    constructionStage: getRandomSalesValue(),
    finalReleaseStage: getRandomSalesValue(),
    media: staticMediaData,
  },
  {
    name: "Marque Rockdale",
    initialReleaseStage: getRandomSalesValue(),
    constructionStage: getRandomSalesValue(),
    finalReleaseStage: getRandomSalesValue(),
    media: staticMediaData,
  },
  {
    name: "Atrium The Retreat",
    initialReleaseStage: getRandomSalesValue(),
    constructionStage: getRandomSalesValue(),
    finalReleaseStage: getRandomSalesValue(),
    media: staticMediaData,
  },
  {
    name: "Aura by Aqualand",
    initialReleaseStage: getRandomSalesValue(),
    constructionStage: getRandomSalesValue(),
    finalReleaseStage: getRandomSalesValue(),
    media: staticMediaData,
  },
];

// Transform mock api data to DataTable based on selected stages
const transformToDataTable = (
  projects: RealEstateProject[],
  selectedStages: string[],
): DataTable => {
  const columnConfigs = [
    { name: "Project", type: "string" as const },
    ...(selectedStages.includes("Initial Release Stage")
      ? [{ name: "Initial Release Stage", type: "number" as const }]
      : []),
    ...(selectedStages.includes("Construction Stage")
      ? [{ name: "Construction Stage", type: "number" as const }]
      : []),
    ...(selectedStages.includes("Final Release Stage")
      ? [{ name: "Final Release Stage", type: "number" as const }]
      : []),
    { name: "Media", type: "media" as const },
  ];

  const rows = projects.map((project) => ({
    cells: [
      { type: "string" as const, value: project.name },
      ...(selectedStages.includes("Initial Release Stage")
        ? [{ type: "number" as const, value: project.initialReleaseStage }]
        : []),
      ...(selectedStages.includes("Construction Stage")
        ? [{ type: "number" as const, value: project.constructionStage }]
        : []),
      ...(selectedStages.includes("Final Release Stage")
        ? [{ type: "number" as const, value: project.finalReleaseStage }]
        : []),
      { type: "media" as const, value: project.media },
    ],
  }));

  return { columnConfigs, rows };
};

// static media data for the projects
const staticMediaData: (DataTableImageUpload | DataTableVideoUpload)[] = [
  {
    type: "video_upload",
    mimeType: "video/mp4",
    url: "https://www.canva.dev/example-assets/video-import/video.mp4",
    thumbnailImageUrl:
      "https://www.canva.dev/example-assets/video-import/thumbnail-image.jpg",
    thumbnailVideoUrl:
      "https://www.canva.dev/example-assets/video-import/thumbnail-video.mp4",
    width: 405,
    height: 720,
    aiDisclosure: "none",
  },
  {
    type: "image_upload",
    mimeType: "image/jpeg",
    url: "https://www.canva.dev/example-assets/image-import/image.jpg",
    thumbnailUrl:
      "https://www.canva.dev/example-assets/image-import/thumbnail.jpg",
    width: 540,
    height: 720,
    aiDisclosure: "none",
  },
];

// Helper function to generate random numbers between 10 and 100
function getRandomSalesValue(): number {
  const min = 10;
  const max = 100;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
