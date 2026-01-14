import { AppI18nProvider } from "@canva/app-i18n-kit";
import { AppUiProvider } from "@canva/app-ui-kit";
import { ErrorBoundary } from "react-error-boundary";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { ContextProvider } from "../../context";
import { ErrorPage } from "../../pages";
import { routes } from "../../routes";

export const App = () => (
  <AppI18nProvider>
    <AppUiProvider>
      <ErrorBoundary fallback={<ErrorPage />}>
        <ContextProvider>
          <RouterProvider router={createHashRouter(routes)} />
        </ContextProvider>
      </ErrorBoundary>
    </AppUiProvider>
  </AppI18nProvider>
);
