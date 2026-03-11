/**
 * Data table builder for the Data Connector intent.
 *
 * This module turns your domain data into the `DataTable` format that
 * powers Canva's Bulk Create — each row becomes a unique design,
 * autofilled with the row's values. The table is made up of:
 *
 *  - `columnConfigs` — the schema (column names + types). Each column
 *    becomes a merge field the user can map onto their design.
 *  - `rows` — the actual data, where each row's `cells` array must
 *    match the column order. Supported cell types are `"string"` and
 *    `"media"` (images).
 *
 * The `ListingsDataConfig` type defines the serialized config that
 * travels between the selection UI and this builder via
 * `dataSourceRef.source`.
 *
 * @see https://www.canva.dev/docs/apps/data-connector/
 */
import type {
  ColumnConfig,
  DataTable,
  DataTableRow,
  GetDataTableRequest,
} from "@canva/intents/data";
import { listings } from "../../data";

// TODO: Define the shape of your data source configuration. This is
// serialized into dataSourceRef.source by the selection UI and parsed
// back here to filter/fetch the right data.
export type ListingsDataConfig = {
  propertyTypes?: string[];
};

export const propertyTypeOptions = ["House", "Apartment", "Townhouse"];

// TODO: Define columns for your data table. Each column maps to a
// merge field in Bulk Create. Supported types: "string", "media".
const columnConfigs: ColumnConfig[] = [
  { name: "Name", type: "string" as const },
  { name: "Address", type: "string" as const },
  { name: "Suburb", type: "string" as const },
  { name: "Price", type: "string" as const },
  { name: "Type", type: "string" as const },
  { name: "Photo", type: "media" as const },
];

// TODO: Replace with your own data fetching logic. Parse the user's
// selection from `dataSourceRef.source`, fetch/filter your records,
// and map each one to a row whose cells match columnConfigs above.
export function getListingsDataTable(request: GetDataTableRequest): DataTable {
  const { dataSourceRef, limit } = request;

  // Restore the user's filter selection from the serialized config.
  const config = dataSourceRef
    ? (JSON.parse(dataSourceRef.source) as ListingsDataConfig)
    : {};

  const selectedTypes = config.propertyTypes?.length
    ? config.propertyTypes
    : propertyTypeOptions;

  const filtered = listings.filter((listing) =>
    selectedTypes.includes(listing.listingType),
  );

  // Each row's cells must match columnConfigs in order. Media cells
  // require at least a url, mimeType, and dimensions.
  const rows: DataTableRow[] = filtered.slice(0, limit.row).map((listing) => ({
    cells: [
      { type: "string" as const, value: listing.name },
      { type: "string" as const, value: listing.address },
      { type: "string" as const, value: listing.suburb },
      { type: "string" as const, value: listing.price },
      { type: "string" as const, value: listing.listingType },
      {
        type: "media" as const,
        value: [
          {
            type: "image_upload" as const,
            mimeType: "image/png" as const,
            url: listing.thumbnail.url,
            thumbnailUrl: listing.thumbnail.url,
            width: listing.thumbnail.width,
            height: listing.thumbnail.height,
            aiDisclosure: "none" as const,
          },
        ],
      },
    ],
  }));

  return { columnConfigs, rows };
}
