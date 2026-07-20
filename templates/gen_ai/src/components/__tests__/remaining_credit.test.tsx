import { getPlatformInfo, requestOpenExternalUrl } from "@canva/platform";
import { fireEvent, screen } from "@testing-library/react";
import { renderInTestProvider } from "src/utils/test_render";
import { RemainingCredits } from "src/components/remaining_credits";

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
});
