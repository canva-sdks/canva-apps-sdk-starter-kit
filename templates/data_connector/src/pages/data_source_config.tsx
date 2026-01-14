import { useAppContext } from "src/context";

export const DataSourceConfig = () => {
  const { dataSourceHandler } = useAppContext();
  if (!dataSourceHandler) {
    return undefined; // should be impossible
  }
  return dataSourceHandler.configPage(dataSourceHandler.sourceConfig);
};
