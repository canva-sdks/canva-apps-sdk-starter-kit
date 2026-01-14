import type { RenderSelectionUiRequest } from "@canva/intents/data";
import type { AccessTokenResponse } from "@canva/user";
import { auth } from "@canva/user";
import type { JSX, ReactNode } from "react";
import { createContext, useCallback, useState } from "react";
import type { APIResponseItem, DataSourceHandler } from "src/api/data_source";
import { type DataSourceConfig } from "src/api/data_source";

export interface AppContextType {
  appError: string;
  setAppError: (value: string) => void;
  request: RenderSelectionUiRequest;
  isAuthenticated: boolean;
  accessToken: AccessTokenResponse | undefined;
  setAccessToken: (token: AccessTokenResponse | undefined) => void;
  oauth: ReturnType<typeof auth.initOauth>;
  logout: () => Promise<void>;
  dataSourceHandler?: DataSourceHandler<DataSourceConfig, APIResponseItem>;
  setDataSourceHandler: (
    value: DataSourceHandler<DataSourceConfig, APIResponseItem>,
  ) => void;

  dataSourceConfig?: DataSourceConfig;
  setDataSourceConfig: (value: DataSourceConfig) => void;
  loadDataSource: (title: string, source: DataSourceConfig) => Promise<void>;
}

export const AppContext = createContext<AppContextType>({
  appError: "",
  setAppError: () => {},
  request: {} as RenderSelectionUiRequest,
  isAuthenticated: false,
  accessToken: undefined,
  setAccessToken: () => {},
  oauth: auth.initOauth(),
  logout: async () => {},
  dataSourceHandler: {} as DataSourceHandler<DataSourceConfig, APIResponseItem>,
  setDataSourceHandler: () => {},
  dataSourceConfig: {} as DataSourceConfig,
  setDataSourceConfig: () => {},
  loadDataSource: async () => {},
});

/**
 * Provides application-wide state and methods using React Context.
 * @param {object} props - The props object.
 * @param {ReactNode} props.children - The children components wrapped by the provider.
 * @returns {JSX.Element} The provider component.
 * @description This provider component wraps the entire application to provide application-wide state and methods using React Context.
 * It manages state related to app errors, filter parameters, and authentication.
 * It exposes these state values and setter methods to its child components via the AppContext.
 * For more information on React Context, refer to the official React documentation: {@link https://react.dev/learn/passing-data-deeply-with-context}.
 */
export const ContextProvider = ({
  renderSelectionUiRequest,
  children,
}: {
  renderSelectionUiRequest: RenderSelectionUiRequest;
  children: ReactNode;
}): JSX.Element => {
  const [appError, setAppError] = useState<string>("");
  const [request] = useState<RenderSelectionUiRequest>(
    renderSelectionUiRequest,
  );

  // authentication
  const [accessToken, setAccessToken] = useState<
    AccessTokenResponse | undefined
  >(undefined);
  const oauth = auth.initOauth();
  const isAuthenticated = !!accessToken;

  // data handlers
  const [dataSourceHandler, setDataSourceHandler] =
    useState<DataSourceHandler<DataSourceConfig, APIResponseItem>>();
  const [dataSourceConfig, setDataSourceConfig] = useState<DataSourceConfig>();

  // data connection
  const loadDataSource = useCallback(
    async (title: string, source: DataSourceConfig) => {
      const result = await request.updateDataRef({
        title,
        source: JSON.stringify(source),
      });
      if (result.status === "remote_request_failed") {
        setAppError(`Failed to load data source: uanble to connect to the API`);
      } else if (result.status === "app_error") {
        setAppError(
          `Failed to load data source: ${result.message || result.status}`,
        );
      } else {
        setAppError("");
      }
    },
    [request],
  );

  const logout = useCallback(async () => {
    try {
      setAccessToken(undefined);
      await oauth.deauthorize();
      setAccessToken(null);
    } catch (error) {
      setAppError(error instanceof Error ? error.message : "Logout failed");
    }
  }, [oauth]);

  const value: AppContextType = {
    appError,
    setAppError,
    request,
    isAuthenticated,
    accessToken,
    setAccessToken,
    oauth,
    logout,
    dataSourceHandler,
    setDataSourceHandler,
    dataSourceConfig,
    setDataSourceConfig,
    loadDataSource,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
