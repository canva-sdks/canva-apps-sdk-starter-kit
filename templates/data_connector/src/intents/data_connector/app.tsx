import { AppI18nProvider } from "@canva/app-i18n-kit";
import { AppUiProvider } from "@canva/app-ui-kit";
import type { RenderSelectionUiRequest } from "@canva/intents/data";
import { ErrorBoundary } from "react-error-boundary";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { ContextProvider } from "../../context";
import { ErrorPage } from "../../pages";
import { routes } from "../../routes";

export const App = ({ request }: { request: RenderSelectionUiRequest }) => (
  <AppI18nProvider>
    <AppUiProvider>
      <ErrorBoundary fallback={<ErrorPage />}>
        <ContextProvider renderSelectionUiRequest={request}>
          <RouterProvider router={createHashRouter(routes)} />
        </ContextProvider>
      </ErrorBoundary>
    </AppUiProvider>
  </AppI18nProvider>
);
