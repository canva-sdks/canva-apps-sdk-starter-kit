import type {
  DataTable,
  DataTableCell,
  DataTableImageUpload,
  DataTableVideoUpload,
  GetDataTableRequest,
} from "@canva/intents/data";

export const saleStageOptions: string[] = [
  "Pre-release Stage",
  "Initial Release Stage",
  "Construction Stage",
  "Final Release Stage",
];

const MAX_PRICE = 100;
const MIN_PRICE = 10;

// define the data source structure - the configurable parameters of the data query
export type RealEstateDataConfig = {
  selectedStageFilter?: string[];
};

// for a given data source query, fetch the data and build a table
export const fetchRealEstateData = async (
  request: GetDataTableRequest,
): Promise<DataTable> => {
  return new Promise((resolve) => {
    const { dataSourceRef, limit } = request;
    if (dataSourceRef != null) {
      const dataRef = JSON.parse(dataSourceRef?.source) as RealEstateDataConfig;

      const selectedStages = dataRef.selectedStageFilter?.length
        ? dataRef.selectedStageFilter
        : saleStageOptions;

      // generate random data for the selected suburbs
      // this would be replaced with a call to an API to fetch the data
      const projectSales = getStageSales(selectedStages);

      // construct the data table output, starting with defining the columns
      const dataTable: DataTable = {
        columnConfigs: [
          {
            name: "Project",
            type: "string",
          },
          ...selectedStages.map((suburb) => ({
            name: suburb,
            type: "number" as const,
          })),
          {
            name: "Media",
            type: "media",
          },
        ],
        rows: [],
      };

      // now convert the data into rows and cells for the table
      projectSales.forEach((project) => {
        const cells: DataTableCell[] = [
          { type: "string", value: project.project },
        ];

        selectedStages.forEach((stage) => {
          cells.push({
            type: "number" as const,
            value: project.sales[stage],
          });
        });

        cells.push({
          type: "media" as const,
          value: project.media,
        });

        dataTable.rows.push({ cells });
      });

      // Ensure we don't exceed the row limit
      dataTable.rows = dataTable.rows.slice(0, limit.row);

      resolve(dataTable);
    }
  });
};

// this function generates example data. It is randomised and will be different when the data source is refreshed.
const getStageSales = (
  stages: string[],
): {
  project: string;
  sales: Record<string, number>;
  media: (DataTableImageUpload | DataTableVideoUpload)[];
}[] => {
  const generateRandomPrice = () => {
    return Math.floor(Math.random() * (MAX_PRICE - MIN_PRICE)) + MIN_PRICE;
  };

  const randomSales = () => {
    return stages.reduce(
      (sales, stage) => {
        sales[stage] = generateRandomPrice();
        return sales;
      },
      {} as Record<string, number>,
    );
  };

  return [
    "The Kensington",
    "Horizon Hurstville",
    "Sterling Lane Cove",
    "Surry Hills Village",
    "Willoughby Grounds",
    "Marque Rockdale",
    "Atrium The Retreat",
    "Aura by Aqualand",
    "Castle Residences",
    "One Rose",
    "Spring Garden",
    "Delano Crows Nest",
  ].map((project) => {
    return {
      project,
      sales: randomSales(),
      media: [
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
      ],
    };
  });
};
