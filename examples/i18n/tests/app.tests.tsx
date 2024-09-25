import type { RenderResult } from "@testing-library/react";
import { fireEvent, render } from "@testing-library/react";
import { TestAppUiProvider } from "@canva/app-ui-kit";
import { TestAppI18nProvider } from "@canva/app-i18n-kit";
import { App, TokenCount } from "../app";

function renderInTestProvider(node: React.ReactNode): RenderResult {
  return render(
    // In a test environment, you should wrap your apps in `TestAppI18nProvider` and `TestAppUiProvider`, rather than `AppI18nProvider` and `AppUiProvider`
    <TestAppI18nProvider>
      <TestAppUiProvider>{node}</TestAppUiProvider>
    </TestAppI18nProvider>,
  );
}

describe("app", () => {
  let requestOpenExternalUrl: jest.Mock;

  beforeEach(() => {
    requestOpenExternalUrl = jest.fn().mockResolvedValue({});
    jest.useFakeTimers({
      now: new Date("2024-09-25"), // For consistent snapshots, pretend today is always Canva Extend 2024
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("calls openExternalUrl onClick", async () => {
    const result = renderInTestProvider(
      <App requestOpenExternalUrl={requestOpenExternalUrl} />,
    );

    // get a reference to the link element
    const galleryExternalLink = result.getByText(/gallery/);

    // assert its label matches what we expect
    expect(galleryExternalLink.textContent).toContain("gallery");
    // assert our callback has not yet been called
    expect(requestOpenExternalUrl).not.toHaveBeenCalled();

    // programmatically simulate clicking the button
    fireEvent.click(galleryExternalLink);

    // assert our callback was called
    expect(requestOpenExternalUrl).toHaveBeenCalledTimes(1);
  });

  it("Renders token counts consistently 🎉", () => {
    const resultToken0 = renderInTestProvider(
      <TokenCount used={0} total={25} />,
    );
    // The snapshot test can be used to detect unexpected changes in the rendered output.
    expect(resultToken0.container).toMatchSnapshot();

    const resultToken1 = renderInTestProvider(
      <TokenCount used={1} total={25} />,
    );
    expect(resultToken1.container).toMatchSnapshot();

    const resultToken10 = renderInTestProvider(
      <TokenCount used={10} total={25} />,
    );
    expect(resultToken10.container).toMatchSnapshot();
  });
});
