import { getPlatformInfo } from "@canva/platform";
import { screen } from "@testing-library/react";
import { renderInTestProvider } from "src/utils/test_render";
import { CreditError } from "src/components/credit_error";
import type { AppContextType } from "src/context/app_context";
import { AppContext } from "src/context/app_context";
import {
  AppErrorType,
  CreditsErrorType,
  PromptInputErrorType,
} from "src/context/error_type";

const mockGetPlatformInfo = jest.mocked(getPlatformInfo);

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
  promptInput: "",
  setPromptInput: () => {},
  promptInputError: PromptInputErrorType.None,
  setPromptInputError: () => {},
  generatedImages: [],
  setGeneratedImages: () => {},
};

const renderCreditError = (overrides: Partial<AppContextType>) =>
  renderInTestProvider(
    <AppContext.Provider value={{ ...baseContext, ...overrides }}>
      <CreditError />
    </AppContext.Provider>,
  );

describe("CreditError", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetPlatformInfo.mockReturnValue({
      canAcceptPayments: true,
    });
  });

  it("renders nothing while the app is still loading", () => {
    renderCreditError({
      loadingApp: true,
      creditsError: CreditsErrorType.NotEnoughCredits,
    });

    expect(screen.queryByText(/don.t have enough/i)).toBeNull();
  });

  it("renders nothing when there is no credits error", () => {
    renderCreditError({ creditsError: CreditsErrorType.None });

    expect(screen.queryByText(/don.t have enough/i)).toBeNull();
  });

  it("shows the credits error message once loaded", () => {
    renderCreditError({ creditsError: CreditsErrorType.NotEnoughCredits });

    expect(screen.getByText(/don.t have enough/i)).toBeTruthy();
  });
});
