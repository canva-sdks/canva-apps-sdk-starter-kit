import { LoadingIndicator } from "@canva/app-ui-kit";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type {
  APIResponseItem,
  DataSourceConfig,
  DataSourceHandler,
} from "../../api";
import { DATA_SOURCES } from "../../api/data_sources";
import { useAppContext } from "../../context";
import { Paths } from "../../routes/paths";
import {
  isDataRefEmpty,
  isLaunchedWithError,
  isOutdatedSource,
} from "../../utils/data_params";

const parseDataSource = (source: string) => {
  try {
    return source ? JSON.parse(source) : undefined;
  } catch {
    return undefined;
  }
};

export const Entrypoint = () => {
  const navigate = useNavigate();
  const context = useAppContext();
  const { request, setAppError, setDataSourceHandler } = context;

  useEffect(() => {
    // if the app was loaded with a populated data ref, we should reload the previous state.
    // otherwise, if this is a first launch or there is an error, we should navigate to the first screen for a user - selecting a data source
    let navigateTo: Paths | undefined;

    if (isDataRefEmpty(request)) {
      // probably a first time launch - the user will need to select a data source
      navigateTo = Paths.DATA_SOURCE_SELECTION;
    } else if (isOutdatedSource(request) || isLaunchedWithError(request)) {
      // the configured source does not match the expected data source types
      // so prompt the user to reconfigure the data source
      setAppError("The data source configuration needs to be updated.");
      navigateTo = Paths.DATA_SOURCE_SELECTION;
    } else {
      // there is a data ref, so we should parse it and navigate to the appropriate page
      const dataRef = request.invocationContext.dataSourceRef;
      const parsedSource = parseDataSource(dataRef?.source ?? "");

      if (parsedSource) {
        const dataHandler = DATA_SOURCES.find((handler) =>
          handler.matchSource(parsedSource),
        );
        if (dataHandler) {
          setDataSourceHandler(
            dataHandler as unknown as DataSourceHandler<
              DataSourceConfig,
              APIResponseItem
            >,
          );
          dataHandler.sourceConfig = parsedSource;
          navigateTo = Paths.DATA_SOURCE_CONFIG;
        }
      }
    }

    navigate(navigateTo || Paths.DATA_SOURCE_SELECTION);
  }, [request]);

  return <LoadingIndicator />;
};
