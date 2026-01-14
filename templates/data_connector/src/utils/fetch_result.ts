import type {
  DataTable,
  DataTableMetadata,
  GetDataTableCompleted,
  GetDataTableError,
} from "@canva/intents/data";

export const completeDataTable = (
  dataTable: DataTable,
  metadata?: DataTableMetadata,
): GetDataTableCompleted => {
  return {
    status: "completed",
    dataTable,
    metadata,
  };
};

export const appError = (message?: string): GetDataTableError => {
  return {
    status: "app_error",
    message,
  };
};

export const outdatedSourceRef = (): GetDataTableError => {
  return {
    status: "outdated_source_ref",
  };
};

export const remoteRequestFailed = (): GetDataTableError => {
  return {
    status: "remote_request_failed",
  };
};
