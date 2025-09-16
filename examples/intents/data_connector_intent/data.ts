// For usage information, see the README.md file.

import type {
  DataTable,
  DataTableImageUpload,
  DataTableVideoUpload,
  GetDataTableRequest,
} from "@canva/intents/data";

// Available filter options for real estate project sales stages
export const saleStageOptions: string[] = [
  "Initial Release Stage",
  "Construction Stage",
  "Final Release Stage",
];

// Configuration object that defines the structure of a data source query
export type RealEstateDataConfig = {
  selectedStageFilter?: string[];
};

// Fetches data from the mock API and transforms it into Canva's DataTable format
export const getRealEstateData = async (
  request: GetDataTableRequest,
): Promise<DataTable> => {
  return new Promise((resolve) => {
    const { dataSourceRef, limit } = request;
    if (dataSourceRef != null) {
      // Parse the saved data source configuration from the request
      const dataRef = JSON.parse(dataSourceRef?.source) as RealEstateDataConfig;

      // Use selected stages from config, or default to all stages if none selected
      const selectedStages = dataRef.selectedStageFilter?.length
        ? dataRef.selectedStageFilter
        : saleStageOptions;

      // Fetch mock project data
      const projects = getProjects();

      // Transform raw project data to Canva's DataTable format
      const dataTable = transformToDataTable(projects, selectedStages);

      // Apply row limit as specified by Canva's data connector constraints
      dataTable.rows = dataTable.rows.slice(0, limit.row);

      resolve(dataTable);
    }
  });
};

// Structure representing a real estate project from the mock API
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

// Converts the mock API project data into Canva's DataTable format with dynamic column configuration
const transformToDataTable = (
  projects: RealEstateProject[],
  selectedStages: string[],
): DataTable => {
  // Define column structure based on user's selected stages
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

  // Generate table rows with data cells matching the column structure
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

// Static media assets used for demonstration purposes in all projects
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

// Generates random sales values for demonstration purposes
function getRandomSalesValue(): number {
  const min = 10;
  const max = 100;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
