/* eslint-disable formatjs/no-literal-string-in-jsx */
import { TestAppI18nProvider } from "@canva/app-i18n-kit";
import { TestAppUiProvider } from "@canva/app-ui-kit";
import { getPlatformInfo, requestOpenExternalUrl } from "@canva/platform";
import type { RenderResult } from "@testing-library/react";
import { fireEvent, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { RemainingCredits } from "../remaining_credits";

function renderInTestProvider(node: ReactNode): RenderResult {
  return render(
    // In a test environment, you should wrap your apps in `TestAppI18nProvider` and `TestAppUiProvider`, rather than `AppI18nProvider` and `AppUiProvider`
    <TestAppI18nProvider>
      <TestAppUiProvider>{node}</TestAppUiProvider>,
    </TestAppI18nProvider>,
  );
}

// This test demonstrates how to test code that uses functions from the Canva Apps SDK
// For more information on testing with the Canva Apps SDK, see https://www.canva.dev/docs/apps/testing/
describe("Remaining Credit Tests", () => {
  const mockRequestOpenExternalUrl = jest.mocked(requestOpenExternalUrl);
  const mockGetPlatformInfo = jest.mocked(getPlatformInfo);

  beforeEach(() => {
    jest.resetAllMocks();
    mockGetPlatformInfo.mockReturnValue({
      canAcceptPayments: true,
    });
  });

  it("should call requestOpenExternalUrl when the link is clicked", () => {
    // assert that the mock is in the expected clean state
    expect(mockRequestOpenExternalUrl).not.toHaveBeenCalled();

    const result = renderInTestProvider(<RemainingCredits />);

    // get a reference to the link to purchase more credits
    const purchaseMoreLink = result.getByRole("button");

    // programmatically simulate clicking the button
    fireEvent.click(purchaseMoreLink);

    // we expect that requestOpenExternalUrl has been called
    expect(mockRequestOpenExternalUrl).toHaveBeenCalled();
  });
});
