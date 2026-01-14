import { Entrypoint } from "src/intents/data_connector/entrypoint";
import { Home } from "src/intents/data_connector/home";
import { DataSourceConfig } from "src/pages/data_source_config";
import { ErrorPage } from "src/pages/error";
import { Login } from "src/pages/login";
import { SelectSource } from "src/pages/select_source";
import { Paths } from "src/routes/paths";
import { ProtectedRoute } from "./protected_route";

export const routes = [
  {
    path: Paths.ENTRYPOINT,
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Entrypoint />,
      },
      {
        path: Paths.LOGIN,
        element: <Login />,
      },
      {
        path: Paths.DATA_SOURCE_SELECTION,
        element: (
          <ProtectedRoute>
            <SelectSource />
          </ProtectedRoute>
        ),
      },
      {
        path: Paths.DATA_SOURCE_CONFIG,
        element: (
          <ProtectedRoute>
            <DataSourceConfig />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
