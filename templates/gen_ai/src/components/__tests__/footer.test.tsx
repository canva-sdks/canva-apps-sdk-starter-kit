import { getPlatformInfo } from "@canva/platform";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import type { Location } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { renderInTestProvider } from "src/utils/test_render";
import { Footer } from "src/components/footer";
import { purchaseCredits } from "src/api/api";
import type { AppContextType } from "src/context/app_context";
import { AppContext } from "src/context/app_context";
import {
  AppErrorType,
  CreditsErrorType,
  PromptInputErrorType,
} from "src/context/error_type";
import { Paths } from "src/routes/paths";

jest.mock("src/api/api");

// The real react-router-dom module calls `new TextEncoder()` at import
// time, which jsdom doesn't provide as a global. Footer only reads
// useNavigate/useLocation, so mock those two hooks directly rather than
// pulling in the real module (and a MemoryRouter) just to render a tree.
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockGetPlatformInfo = jest.mocked(getPlatformInfo);
const mockPurchaseCredits = jest.mocked(purchaseCredits);
const mockUseNavigate = jest.mocked(useNavigate);
const mockUseLocation = jest.mocked(useLocation);
const mockNavigate = jest.fn();

const baseContext: AppContextType = {
  appError: AppErrorType.None,
  setAppError: () => {},
  creditsError: CreditsErrorType.None,
  setCreditsError: () => {},
  loadingApp: false,
  setLoadingApp: () => {},
  isLoadingImages: false,
  setIsLoadingImages: () => {},
  jobId: "",
  setJobId: () => {},
  remainingCredits: 0,
  setRemainingCredits: () => {},
  promptInput: "a cat wearing a hat",
  setPromptInput: () => {},
  promptInputError: PromptInputErrorType.None,
  setPromptInputError: () => {},
  generatedImages: [],
  setGeneratedImages: () => {},
};

const renderFooter = (
  overrides: Partial<AppContextType>,
  initialPath: string = Paths.HOME,
) => {
  mockUseLocation.mockReturnValue({ pathname: initialPath } as Location);

  return renderInTestProvider(
    <AppContext.Provider value={{ ...baseContext, ...overrides }}>
      <Footer />
    </AppContext.Provider>,
  );
};

describe("Footer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetPlatformInfo.mockReturnValue({
      canAcceptPayments: true,
    });
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  it("keeps the Generate button enabled while credits remain", () => {
    const setIsLoadingImages = jest.fn();
    renderFooter({ remainingCredits: 5, setIsLoadingImages });

    fireEvent.click(screen.getByRole("button", { name: "Generate image" }));

    // Only reached once the credit/prompt guards pass, proving the click went through.
    expect(setIsLoadingImages).toHaveBeenCalledWith(true);
  });

  it("flags not-enough-credits and disables the button only after a click with zero credits", () => {
    const setCreditsError = jest.fn();
    renderFooter({ remainingCredits: 0, setCreditsError });

    const generateButton = screen.getByRole("button", {
      name: "Generate image",
    });

    // The button isn't disabled just because credits are at zero on load.
    expect(setCreditsError).not.toHaveBeenCalled();

    fireEvent.click(generateButton);

    expect(setCreditsError).toHaveBeenCalledTimes(1);
    expect(setCreditsError).toHaveBeenCalledWith(
      CreditsErrorType.NotEnoughCredits,
    );

    // A second click has no further effect once the button is aria-disabled.
    fireEvent.click(generateButton);
    expect(setCreditsError).toHaveBeenCalledTimes(1);
  });

  it("clears the prompt and navigates home when Start over is clicked, without dismissing an active alert", () => {
    const setAppError = jest.fn();
    const setPromptInput = jest.fn();
    renderFooter(
      {
        remainingCredits: 5,
        appError: AppErrorType.GeneratingImagesFailed,
        setAppError,
        setPromptInput,
      },
      Paths.RESULTS,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start over" }));

    expect(setAppError).not.toHaveBeenCalled();
    expect(setPromptInput).toHaveBeenCalledWith("");
    expect(mockNavigate).toHaveBeenCalledWith(Paths.HOME);
  });

  it("shows the demo Reset credits button only when credits are exhausted", () => {
    renderFooter({ remainingCredits: 0 });

    expect(screen.getByRole("button", { name: /Reset credits/ })).toBeTruthy();
    expect(
      screen.getByText(
        "Reset the template’s demo credits. Remove this when you connect your app to your credit system.",
      ),
    ).toBeTruthy();
  });

  it("hides the demo Reset credits button while credits remain", () => {
    renderFooter({ remainingCredits: 5 });

    expect(screen.queryByRole("button", { name: /Reset credits/ })).toBeNull();
  });

  it("hides the demo Reset credits button when credits failed to load, even though remainingCredits is 0", () => {
    renderFooter({
      remainingCredits: 0,
      appError: AppErrorType.GetRemainingCreditsFailed,
    });

    expect(screen.queryByRole("button", { name: /Reset credits/ })).toBeNull();
  });

  it("purchases more credits when Reset credits is clicked and the platform accepts payments", async () => {
    mockGetPlatformInfo.mockReturnValue({ canAcceptPayments: true });
    mockPurchaseCredits.mockResolvedValue({ credits: 10 });
    const setRemainingCredits = jest.fn();
    renderFooter({ remainingCredits: 0, setRemainingCredits });

    fireEvent.click(screen.getByRole("button", { name: /Reset credits/ }));

    await waitFor(() => expect(setRemainingCredits).toHaveBeenCalledWith(10));
    expect(mockPurchaseCredits).toHaveBeenCalledTimes(1);
  });

  it("does not purchase credits when the platform cannot accept payments", () => {
    mockGetPlatformInfo.mockReturnValue({ canAcceptPayments: false });
    const setRemainingCredits = jest.fn();
    renderFooter({ remainingCredits: 0, setRemainingCredits });

    fireEvent.click(screen.getByRole("button", { name: /Reset credits/ }));

    expect(mockPurchaseCredits).not.toHaveBeenCalled();
    expect(setRemainingCredits).not.toHaveBeenCalled();
  });

  it("surfaces a general app error when purchasing more credits fails", async () => {
    mockGetPlatformInfo.mockReturnValue({ canAcceptPayments: true });
    mockPurchaseCredits.mockRejectedValue(new Error("network error"));
    const setAppError = jest.fn();
    const setRemainingCredits = jest.fn();
    renderFooter({ remainingCredits: 0, setAppError, setRemainingCredits });

    fireEvent.click(screen.getByRole("button", { name: /Reset credits/ }));

    await waitFor(() =>
      expect(setAppError).toHaveBeenCalledWith(AppErrorType.General),
    );
    expect(setRemainingCredits).not.toHaveBeenCalled();
  });
});
