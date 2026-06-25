import React from "react";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import { TestAppI18nProvider } from "@canva/app-i18n-kit";
import { TestAppUiProvider } from "@canva/app-ui-kit";

// In a test environment, you should wrap your apps in `TestAppI18nProvider` and `TestAppUiProvider`, rather than `AppI18nProvider` and `AppUiProvider`
export const renderInTestProvider = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestAppI18nProvider>
      <TestAppUiProvider>{children}</TestAppUiProvider>
    </TestAppI18nProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};
