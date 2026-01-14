import type { RenderSelectionUiRequest } from "@canva/intents/data";

export const isLaunchedWithError = (request: RenderSelectionUiRequest) => {
  return request.invocationContext.reason === "app_error";
};

export const isOutdatedSource = (request: RenderSelectionUiRequest) => {
  return request.invocationContext.reason === "outdated_source_ref";
};

export const isDataRefEmpty = (request: RenderSelectionUiRequest) => {
  return (
    !request?.invocationContext ||
    (!isLaunchedWithError(request) &&
      !request.invocationContext.dataSourceRef?.source)
  );
};
