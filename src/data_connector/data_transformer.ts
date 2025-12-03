import type {
  DataTable,
  DataTableImageUpload,
  ColumnConfig,
  DataTableRow,
  DataTableCell,
  DataType,
} from "@canva/intents/data";

/**
 * Data source configuration for the data connector
 */
export type DataSourceConfig = {
  dataType: "agent" | "listing" | "market-data";
  agentEmail?: string;
  listingId?: string;
  suburbPostcode?: string;
  selectedFields?: string[];
};

/**
 * Transform agent profile data to DataTable format
 */
export function transformAgentToDataTable(
  agentData: Record<string, unknown>,
  selectedFields?: string[]
): DataTable {
  const allTextFields = [
    { key: "name", label: "Name" },
    { key: "displayName", label: "Display Name" },
    { key: "fullName", label: "Full Name" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "emailAddress", label: "Email Address" },
    { key: "phone", label: "Phone" },
    { key: "mobile", label: "Mobile" },
    { key: "office", label: "Office" },
    { key: "position", label: "Position" },
    { key: "title", label: "Title" },
    { key: "bio", label: "Bio" },
    { key: "description", label: "Description" },
  ];

  // Filter fields based on what's actually present in the data
  const availableFields = allTextFields.filter(
    (field) =>
      agentData[field.key] !== undefined &&
      agentData[field.key] !== null &&
      agentData[field.key] !== ""
  );

  // Apply field selection if provided
  const fieldsToInclude = selectedFields?.length
    ? availableFields.filter((f) => selectedFields.includes(f.key))
    : availableFields;

  // Check for image fields
  const imageFields = Object.entries(agentData).filter(([key, value]) => {
    if (typeof value !== "string") return false;
    const isImageUrl =
      value.startsWith("http") &&
      (value.includes(".jpg") ||
        value.includes(".png") ||
        value.includes(".jpeg") ||
        value.includes(".gif"));
    const isImageField =
      key.toLowerCase().includes("image") ||
      key.toLowerCase().includes("photo") ||
      key.toLowerCase().includes("headshot") ||
      key.toLowerCase().includes("avatar");
    return isImageUrl || isImageField;
  });

  // Build column configs
  const columnConfigs: ColumnConfig[] = fieldsToInclude.map((field) => ({
    name: field.label,
    type: "string" as const,
  }));

  if (imageFields.length > 0) {
    columnConfigs.push({ name: "Photo", type: "media" as const });
  }

  // Build row cells - using DataTableCell type explicitly
  const cells: DataTableCell<DataType>[] = fieldsToInclude.map((field) => ({
    type: "string" as const,
    value: String(agentData[field.key] || ""),
  }));

  // Add image cell if present
  if (imageFields.length > 0) {
    const mediaItems: DataTableImageUpload[] = imageFields.map(([, url]) => ({
      type: "image_upload" as const,
      mimeType: "image/jpeg" as const,
      url: url as string,
      thumbnailUrl: url as string,
      width: 400,
      height: 400,
      aiDisclosure: "none" as const,
    }));
    cells.push({ type: "media" as const, value: mediaItems });
  }

  return {
    columnConfigs,
    rows: [{ cells }],
  };
}

/**
 * Transform listing data to DataTable format
 */
export function transformListingToDataTable(
  listingData: Record<string, unknown>,
  selectedFields?: string[]
): DataTable {
  const stringFields = [
    { key: "address", label: "Address" },
    { key: "suburb", label: "Suburb" },
    { key: "state", label: "State" },
    { key: "postcode", label: "Postcode" },
    { key: "price_advertise_as", label: "Price" },
    { key: "status", label: "Status" },
    { key: "property_type", label: "Property Type" },
    { key: "landarea", label: "Land Area" },
    { key: "year_built", label: "Year Built" },
    { key: "listed_at", label: "Listed Date" },
    { key: "external_id", label: "Listing ID" },
    { key: "property_category", label: "Category" },
  ];

  const numberFields = [
    { key: "bedrooms", label: "Bedrooms" },
    { key: "bathrooms", label: "Bathrooms" },
    { key: "garages", label: "Car Spaces" },
  ];

  // Filter fields based on what's actually present in the data
  const availableStringFields = stringFields.filter(
    (field) =>
      listingData[field.key] !== undefined &&
      listingData[field.key] !== null &&
      listingData[field.key] !== "" &&
      listingData[field.key] !== "null"
  );

  const availableNumberFields = numberFields.filter(
    (field) =>
      listingData[field.key] !== undefined &&
      listingData[field.key] !== null &&
      listingData[field.key] !== ""
  );

  // Apply field selection if provided
  const stringsToInclude = selectedFields?.length
    ? availableStringFields.filter((f) => selectedFields.includes(f.key))
    : availableStringFields;

  const numbersToInclude = selectedFields?.length
    ? availableNumberFields.filter((f) => selectedFields.includes(f.key))
    : availableNumberFields;

  // Check for photos
  const photos = listingData.photos as string[] | undefined;
  const hasPhotos = photos && Array.isArray(photos) && photos.length > 0;

  // Build column configs
  const columnConfigs: ColumnConfig[] = [
    ...stringsToInclude.map((field) => ({
      name: field.label,
      type: "string" as const,
    })),
    ...numbersToInclude.map((field) => ({
      name: field.label,
      type: "number" as const,
    })),
  ];

  if (hasPhotos) {
    columnConfigs.push({ name: "Photos", type: "media" as const });
  }

  // Build row cells - using DataTableCell type explicitly
  const stringCells: DataTableCell<"string">[] = stringsToInclude.map((field) => {
    let value = listingData[field.key];
    // Format specific fields
    if (field.key === "listed_at" && value) {
      value = new Date(value as string).toLocaleDateString();
    }
    return {
      type: "string" as const,
      value: String(value || ""),
    };
  });

  const numberCells: DataTableCell<"number">[] = numbersToInclude.map((field) => ({
    type: "number" as const,
    value: Number(listingData[field.key]) || 0,
  }));

  const cells: DataTableCell<DataType>[] = [...stringCells, ...numberCells];

  // Add photos cell if present
  if (hasPhotos && photos) {
    const mediaItems: DataTableImageUpload[] = photos.slice(0, 10).map((url) => ({
      type: "image_upload" as const,
      mimeType: "image/jpeg" as const,
      url,
      thumbnailUrl: url,
      width: 800,
      height: 600,
      aiDisclosure: "none" as const,
    }));
    cells.push({ type: "media" as const, value: mediaItems });
  }

  return {
    columnConfigs,
    rows: [{ cells }],
  };
}

/**
 * Transform market data to DataTable format
 */
export function transformMarketDataToDataTable(
  marketData: {
    house: Record<string, unknown>;
    unit: Record<string, unknown>;
    labels: Array<{ property: string; label: string; format: string }>;
    month_end?: string;
  },
  selectedMetrics?: string[]
): DataTable {
  // Default metrics if none selected
  const defaultMetrics = [
    "sales_12m",
    "median_price_12m",
    "change_12m_median_price_12m",
    "total_sales_value_12m",
  ];

  const metricsToInclude = selectedMetrics?.length
    ? marketData.labels.filter((l) => selectedMetrics.includes(l.property))
    : marketData.labels.filter((l) => defaultMetrics.includes(l.property));

  // Build column configs: Metric Name, House Value, Unit Value
  const columnConfigs: ColumnConfig[] = [
    { name: "Metric", type: "string" as const },
    { name: "House", type: "string" as const },
    { name: "Unit", type: "string" as const },
  ];

  // Build rows - one row per metric
  const rows: DataTableRow[] = metricsToInclude.map((metric) => {
    const houseValue = formatMarketValue(
      marketData.house[metric.property],
      metric.format
    );
    const unitValue = formatMarketValue(
      marketData.unit[metric.property],
      metric.format
    );

    return {
      cells: [
        { type: "string" as const, value: metric.label },
        { type: "string" as const, value: houseValue },
        { type: "string" as const, value: unitValue },
      ],
    };
  });

  return {
    columnConfigs,
    rows,
  };
}

/**
 * Format market data values based on format type
 */
function formatMarketValue(value: unknown, format: string): string {
  if (value === null || value === undefined) return "N/A";

  switch (format) {
    case "currency":
    case "dollar":
      return `$${Number(value).toLocaleString()}`;
    case "percentage":
    case "percent": {
      const numValue = Number(value);
      if (numValue > 0 && numValue < 1) {
        return `${(numValue * 100).toFixed(2)}%`;
      }
      return `${numValue.toFixed(2)}%`;
    }
    case "number":
      return Number(value).toLocaleString();
    default:
      return String(value);
  }
}

/**
 * Get available field options for a data type
 */
export function getAvailableFields(
  dataType: "agent" | "listing" | "market-data"
): {
  key: string;
  label: string;
}[] {
  switch (dataType) {
    case "agent":
      return [
        { key: "name", label: "Name" },
        { key: "displayName", label: "Display Name" },
        { key: "fullName", label: "Full Name" },
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "mobile", label: "Mobile" },
        { key: "office", label: "Office" },
        { key: "position", label: "Position" },
        { key: "title", label: "Title" },
        { key: "bio", label: "Bio" },
      ];
    case "listing":
      return [
        { key: "address", label: "Address" },
        { key: "suburb", label: "Suburb" },
        { key: "state", label: "State" },
        { key: "postcode", label: "Postcode" },
        { key: "price_advertise_as", label: "Price" },
        { key: "status", label: "Status" },
        { key: "property_type", label: "Property Type" },
        { key: "bedrooms", label: "Bedrooms" },
        { key: "bathrooms", label: "Bathrooms" },
        { key: "garages", label: "Car Spaces" },
        { key: "landarea", label: "Land Area" },
        { key: "year_built", label: "Year Built" },
        { key: "listed_at", label: "Listed Date" },
      ];
    case "market-data":
      return [
        { key: "sales_12m", label: "Sales (12 months)" },
        { key: "median_price_12m", label: "Median Price (12 months)" },
        { key: "change_12m_median_price_12m", label: "Price Change (12 months)" },
        { key: "total_sales_value_12m", label: "Total Sales Value (12 months)" },
      ];
    default:
      return [];
  }
}
