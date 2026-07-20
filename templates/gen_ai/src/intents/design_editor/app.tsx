import { ErrorBoundary } from "react-error-boundary";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { ContextProvider } from "src/context/app_context";
import { ErrorPage } from "src/pages/error";
import { routes } from "src/routes/routes";

export const App = () => (
  <ErrorBoundary fallback={<ErrorPage />}>
    <ContextProvider>
      <RouterProvider router={createHashRouter(routes)} />
    </ContextProvider>
  </ErrorBoundary>
);
