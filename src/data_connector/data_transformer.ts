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
    { key: "name", label: "agent.name" },
    { key: "displayName", label: "agent.name" },
    { key: "fullName", label: "agent.fullName" },
    { key: "firstName", label: "agent.firstName" },
    { key: "lastName", label: "agent.lastName" },
    { key: "email", label: "agent.email" },
    { key: "emailAddress", label: "agent.email" },
    { key: "phone", label: "agent.phone" },
    { key: "mobile", label: "agent.mobile" },
    { key: "office", label: "agent.office" },
    { key: "position", label: "agent.position" },
    { key: "title", label: "agent.title" },
    { key: "bio", label: "agent.bio" },
    { key: "description", label: "agent.bio" },
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
    columnConfigs.push({ name: "agent.photo", type: "media" as const });
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
    { key: "address", label: "listing.address" },
    { key: "suburb", label: "listing.suburb" },
    { key: "state", label: "listing.state" },
    { key: "postcode", label: "listing.postcode" },
    { key: "price_advertise_as", label: "listing.price" },
    { key: "status", label: "listing.status" },
    { key: "property_type", label: "listing.propertyType" },
    { key: "landarea", label: "listing.landArea" },
    { key: "year_built", label: "listing.yearBuilt" },
    { key: "listed_at", label: "listing.listedDate" },
    { key: "external_id", label: "listing.id" },
    { key: "property_category", label: "listing.category" },
  ];

  const numberFields = [
    { key: "bedrooms", label: "listing.bedrooms" },
    { key: "bathrooms", label: "listing.bathrooms" },
    { key: "garages", label: "listing.carSpaces" },
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
    columnConfigs.push({ name: "listing.photos", type: "media" as const });
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
    { name: "suburb.metric", type: "string" as const },
    { name: "suburb.houseValue", type: "string" as const },
    { name: "suburb.unitValue", type: "string" as const },
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
        { key: "name", label: "agent.name" },
        { key: "displayName", label: "agent.name" },
        { key: "fullName", label: "agent.fullName" },
        { key: "firstName", label: "agent.firstName" },
        { key: "lastName", label: "agent.lastName" },
        { key: "email", label: "agent.email" },
        { key: "phone", label: "agent.phone" },
        { key: "mobile", label: "agent.mobile" },
        { key: "office", label: "agent.office" },
        { key: "position", label: "agent.position" },
        { key: "title", label: "agent.title" },
        { key: "bio", label: "agent.bio" },
      ];
    case "listing":
      return [
        { key: "address", label: "listing.address" },
        { key: "suburb", label: "listing.suburb" },
        { key: "state", label: "listing.state" },
        { key: "postcode", label: "listing.postcode" },
        { key: "price_advertise_as", label: "listing.price" },
        { key: "status", label: "listing.status" },
        { key: "property_type", label: "listing.propertyType" },
        { key: "bedrooms", label: "listing.bedrooms" },
        { key: "bathrooms", label: "listing.bathrooms" },
        { key: "garages", label: "listing.carSpaces" },
        { key: "landarea", label: "listing.landArea" },
        { key: "year_built", label: "listing.yearBuilt" },
        { key: "listed_at", label: "listing.listedDate" },
      ];
    case "market-data":
      return [
        { key: "sales_12m", label: "suburb.sales" },
        { key: "median_price_12m", label: "suburb.medianPrice" },
        { key: "change_12m_median_price_12m", label: "suburb.priceChange" },
        { key: "total_sales_value_12m", label: "suburb.totalSalesValue" },
      ];
    default:
      return [];
  }
}
