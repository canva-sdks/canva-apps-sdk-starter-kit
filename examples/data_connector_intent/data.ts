import type {
  DataTable,
  DataTableCell,
  FetchDataTableParams,
} from "@canva/intents/data";

export const suburbOptions: string[] = [
  "Bondi",
  "Chatswood",
  "Newtown",
  "Strathfield",
  "Surry Hills",
];

const MAX_PRICE = 100;
const MIN_PRICE = 10;

// define the data source structure - the configurable parameters of the data query
export type RealEstateDataConfig = {
  selectedSuburbFilter?: string[];
};

// for a given data source query, fetch the data and build a table
export const fetchRealEstateData = async (
  params: FetchDataTableParams,
): Promise<DataTable> => {
  return new Promise((resolve) => {
    if (params.dataSourceRef != null) {
      const dataRef = JSON.parse(
        params.dataSourceRef?.source,
      ) as RealEstateDataConfig;

      const selectedSuburbs = dataRef.selectedSuburbFilter?.length
        ? dataRef.selectedSuburbFilter
        : suburbOptions;

      // generate random data for the selected suburbs
      // this would be replaced with a call to an API to fetch the data
      const monthlySales = getSuburbSales(selectedSuburbs);

      // construct the data table output, starting with a header row of string cells
      const headingCells = ["Month", ...selectedSuburbs].map((heading) => {
        return {
          type: "string" as const,
          value: heading,
        };
      });
      const dataTable: DataTable = {
        rows: [{ cells: headingCells }],
      };

      // now convert the data into rows and cells for the table
      monthlySales.forEach((month) => {
        const cells: DataTableCell[] = [{ type: "string", value: month.month }];

        selectedSuburbs.forEach((suburb) => {
          cells.push({
            type: "number" as const,
            value: month.sales[suburb],
          });
        });

        dataTable.rows.push({ cells });
      });

      resolve(dataTable);
    }
  });
};

// this function generates example data. It is randomised and will be different when the data source is refreshed.
const getSuburbSales = (
  suburbs: string[],
): { month: string; sales: Record<string, number> }[] => {
  const generateRandomPrice = () => {
    return Math.floor(Math.random() * (MAX_PRICE - MIN_PRICE)) + MIN_PRICE;
  };

  const randomSales = () => {
    return suburbs.reduce(
      (sales, suburb) => {
        sales[suburb] = generateRandomPrice();
        return sales;
      },
      {} as Record<string, number>,
    );
  };

  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((month) => {
    return {
      month,
      sales: randomSales(),
    };
  });
};
