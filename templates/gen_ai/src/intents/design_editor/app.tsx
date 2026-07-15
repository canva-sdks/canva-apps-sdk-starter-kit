import { ErrorBoundary } from "react-error-boundary";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { ContextProvider } from "../../context/app_context";
import { ErrorPage } from "../../pages/error";
import { routes } from "../../routes/routes";

export const App = () => (
  <ErrorBoundary fallback={<ErrorPage />}>
    <ContextProvider>
      <RouterProvider router={createHashRouter(routes)} />
    </ContextProvider>
  </ErrorBoundary>
);
