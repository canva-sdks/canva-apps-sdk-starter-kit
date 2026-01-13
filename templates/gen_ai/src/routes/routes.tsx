import { Home } from "src/intents/design_editor/home";
import { ErrorPage } from "src/pages/error";
import { GeneratePage } from "src/pages/generate";
import { ResultsPage } from "src/pages/results";
import { Paths } from "src/routes/paths";

export const routes = [
  {
    path: Paths.HOME,
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <GeneratePage />,
      },
      {
        path: Paths.RESULTS,
        element: <ResultsPage />,
      },
      // @TODO: Add additional pages and routes as needed.
    ],
  },
];
