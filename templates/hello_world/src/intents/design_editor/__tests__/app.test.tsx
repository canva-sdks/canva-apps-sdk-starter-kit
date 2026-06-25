import { useFeatureSupport } from "@canva/app-hooks";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import type { Feature } from "@canva/platform";
import { requestOpenExternalUrl } from "@canva/platform";
import { fireEvent } from "@testing-library/react";
import { App, DOCS_URL } from "../app";
import { renderInTestProvider } from "../../../utils/test_render";

jest.mock("@canva/app-hooks");

// This test demonstrates how to test code that uses functions from the Canva Apps SDK
// For more information on testing with the Canva Apps SDK, see https://www.canva.dev/docs/apps/testing/
describe("Hello World Tests", () => {
  const mockIsSupported = jest.fn();
  const mockUseFeatureSupport = jest.mocked(useFeatureSupport);
  const mockRequestOpenExternalUrl = jest.mocked(requestOpenExternalUrl);

  beforeEach(() => {
    jest.resetAllMocks();
    mockIsSupported.mockImplementation(
      (fn: Feature) => fn === addElementAtPoint,
    );
    mockUseFeatureSupport.mockReturnValue(mockIsSupported);
    mockRequestOpenExternalUrl.mockResolvedValue({ status: "completed" });
  });

  // this test uses a mock in place of the useFeatureSupport hook
  it("should add a text element when the button is clicked", () => {
    // assert that the mocks are in the expected clean state
    expect(mockUseFeatureSupport).not.toHaveBeenCalled();
    expect(addElementAtPoint).not.toHaveBeenCalled();

    const result = renderInTestProvider(<App />);

    // the hook should have been called in the render process but not the callback
    expect(mockUseFeatureSupport).toHaveBeenCalled();
    expect(addElementAtPoint).not.toHaveBeenCalled();

    // get a reference to the do something cool button element
    const doSomethingCoolBtn = result.getByRole("button", {
      name: "Do something cool",
    });

    // programmatically simulate clicking the button
    fireEvent.click(doSomethingCoolBtn);

    // we expect that addElementAtPoint has been called by the button's click handler
    expect(mockIsSupported).toHaveBeenCalledWith(addElementAtPoint);
    expect(mockIsSupported).not.toHaveBeenCalledWith(addElementAtCursor);
    expect(addElementAtPoint).toHaveBeenCalled();
  });

  // this test uses a mock in place of the @canva/platform requestOpenExternalUrl function
  it("should call `requestOpenExternalUrl` when the button is clicked", () => {
    expect(mockRequestOpenExternalUrl).not.toHaveBeenCalled();

    const result = renderInTestProvider(<App />);

    // get a reference to the Apps SDK button by name
    const sdkButton = result.getByRole("button", {
      name: "Open Canva Apps SDK docs",
    });

    expect(mockRequestOpenExternalUrl).not.toHaveBeenCalled();
    fireEvent.click(sdkButton);
    expect(mockRequestOpenExternalUrl).toHaveBeenCalled();

    // assert that the requestOpenExternalUrl function was called with the expected arguments
    expect(mockRequestOpenExternalUrl.mock.calls[0]?.[0]).toEqual({
      url: DOCS_URL,
    });
  });
});
