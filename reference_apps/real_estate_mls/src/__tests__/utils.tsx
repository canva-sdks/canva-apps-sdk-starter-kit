import { TestAppI18nProvider } from "@canva/app-i18n-kit";
import { TestAppUiProvider } from "@canva/app-ui-kit";
import { render } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const renderWithUserEvent = (node: React.ReactNode) => {
  const user = userEvent.setup();
  renderInTestProvider(node);
  return { user };
};

export function renderInTestProvider(node: React.ReactNode): RenderResult {
  return render(
    <TestAppI18nProvider>
      <TestAppUiProvider>{node}</TestAppUiProvider>
    </TestAppI18nProvider>,
  );
}
