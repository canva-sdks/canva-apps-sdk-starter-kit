import { TestAppUiProvider } from "@canva/app-ui-kit";
import type { RenderResult } from "@testing-library/react";
import { fireEvent, render, within } from "@testing-library/react";
import { openColorSelector } from "@canva/asset";
import { features, requestOpenExternalUrl } from "@canva/platform";
import { API_URL, App, DOCS_URL, QUOTA_ERROR } from "../app";
import { addPage } from "@canva/design";
import { CanvaError } from "@canva/error";

function renderInTestProvider(node: React.ReactNode): RenderResult {
  return render(
    // In a test environment, you should wrap your apps in `TestAppUiProvider`, rather than `AppUiProvider`
    // Refer to the i18n example for information on how to test with localization
    <TestAppUiProvider>{node}</TestAppUiProvider>,
  );
}

describe("Example Tests", () => {
  // These functions have already been mocked in jest.setup.ts, this is just for type casting
  const mockRequestOpenExternalUrl = jest.mocked(requestOpenExternalUrl);
  const mockIsSupported = jest.mocked(features.isSupported);
  const mockAddPage = jest.mocked(addPage);

  beforeEach(() => {
    jest.resetAllMocks();
    mockRequestOpenExternalUrl.mockResolvedValue({ status: "completed" });
    mockIsSupported.mockReturnValue(true);
  });

  // this test demonstrates basic assertions for whether or not a Canva App API function was called
  it("should call `openColorSelector` when the swatch is clicked", () => {
    // assert that the mock is in the expected clean state
    expect(openColorSelector).not.toHaveBeenCalled();

    const result = renderInTestProvider(<App />);

    // get a reference to the button element by looking within the color-selector div for the button role
    const colorSelectorDiv = result.container.querySelector(
      "#color-selector",
    ) as HTMLElement;
    const swatch = within(colorSelectorDiv).getByRole("button");

    // confirm that our callback has not been called in the initial render
    expect(openColorSelector).not.toHaveBeenCalled();

    // programmatically simulate clicking the button
    fireEvent.click(swatch);

    // we expect that openColorSelector has been called by the button's click handler
    expect(openColorSelector).toHaveBeenCalled();
  });

  // this test demonstrates assertions for the arguments passed to a Canva App API function across multiple calls
  it("should call `requestOpenExternalUrl` when the button is clicked", () => {
    expect(mockRequestOpenExternalUrl).not.toHaveBeenCalled();

    const result = renderInTestProvider(<App />);

    // get a reference to the Apps SDK button by name
    const sdkButton = result.getByRole("button", {
      name: "Apps SDK",
    });

    expect(mockRequestOpenExternalUrl).not.toHaveBeenCalled();
    fireEvent.click(sdkButton);
    expect(mockRequestOpenExternalUrl).toHaveBeenCalled();

    // assert that the requestOpenExternalUrl function was called with the expected arguments
    expect(mockRequestOpenExternalUrl.mock.calls[0][0]).toEqual({
      url: DOCS_URL,
    });

    // the name property of the getByRole query can be a regex to match partial contents of the button label
    const referenceButton = result.getByRole("button", {
      name: /Reference/,
    });
    fireEvent.click(referenceButton);
    expect(mockRequestOpenExternalUrl).toHaveBeenCalledTimes(2);
    expect(mockRequestOpenExternalUrl.mock.calls[1][0]).toEqual({
      url: API_URL,
    });
  });

  // the addPage function is not supported in all design types, so we need to test how the app handles this
  // the next three tests demonstrate the permutations - when it is supported , when it is not supported, and when it is supported but throws an error
  it("should show a button when `addPage` is supported and call it when the button is clicked", () => {
    const result = renderInTestProvider(<App />);

    const addPageButton = result.getByRole("button", {
      name: "Add Page",
    });

    // assert the button was found
    expect(addPageButton).toBeDefined();

    expect(addPage).not.toHaveBeenCalled();
    fireEvent.click(addPageButton);
    expect(addPage).toHaveBeenCalled();
  });

  it("should show a message when `addPage` is not supported", () => {
    mockIsSupported.mockReturnValue(false);
    const result = renderInTestProvider(<App />);
    const text = result.getByText(/Adding pages is not supported/);
    expect(text).toBeDefined();

    // the button should not be rendered, so getByRole should throw an error
    expect(() => result.getByRole("button", { name: "Add Page" })).toThrow();
  });

  it("should show an error message when `addPage` throws an error", async () => {
    mockAddPage.mockImplementationOnce(() => {
      throw new CanvaError({
        code: "quota_exceeded",
        message: "Quota exceeded",
      });
    });
    const result = renderInTestProvider(<App />);
    const addPageButton = result.getByRole("button", {
      name: "Add Page",
    });

    fireEvent.click(addPageButton);

    expect(mockAddPage).toHaveBeenCalled();

    // assert that the error message is displayed after the error was caught
    const errorMessage = result.getByText(QUOTA_ERROR);
    expect(errorMessage).toBeDefined();
  });
});
