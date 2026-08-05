import { getPlatformInfo, requestOpenExternalUrl } from "@canva/platform";
import { fireEvent, screen } from "@testing-library/react";
import { renderInTestProvider } from "src/utils/test_render";
import { RemainingCredits } from "src/components/remaining_credits";
import { APP_NAME } from "src/config";

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

    renderInTestProvider(<RemainingCredits />);

    // get a reference to the link to purchase more credits
    const purchaseMoreLink = screen.getByRole("button");

    // programmatically simulate clicking the button
    fireEvent.click(purchaseMoreLink);

    // we expect that requestOpenExternalUrl has been called
    expect(mockRequestOpenExternalUrl).toHaveBeenCalled();
  });

  it("should disable the purchase link and show a warning when payments aren't supported", () => {
    mockGetPlatformInfo.mockReturnValue({
      canAcceptPayments: false,
    });

    renderInTestProvider(<RemainingCredits />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockRequestOpenExternalUrl).not.toHaveBeenCalled();

    expect(
      screen.getByText(
        `${APP_NAME} credits can only be purchased in a web browser.`,
        { exact: false },
      ),
    ).toBeTruthy();
  });
});
