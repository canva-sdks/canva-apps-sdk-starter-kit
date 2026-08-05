import { act, screen, waitFor } from "@testing-library/react";
import { renderInTestProvider } from "src/utils/test_render";
import { getRemainingCredits } from "src/api/api";
import type { AppContextType } from "src/context/app_context";
import { ContextProvider } from "src/context/app_context";
import { AppErrorType, CreditsErrorType } from "src/context/error_type";
import { useAppContext } from "src/context/use_app_context";

jest.mock("src/api/api");

const mockGetRemainingCredits = jest.mocked(getRemainingCredits);

let latestContext: AppContextType;

const ContextValues = () => {
  const context = useAppContext();
  latestContext = context;
  const { loadingApp, appError, creditsError, remainingCredits } = context;

  return (
    <>
      <div data-testid="loadingApp">{String(loadingApp)}</div>
      <div data-testid="appError">{appError}</div>
      <div data-testid="creditsError">{creditsError}</div>
      <div data-testid="remainingCredits">{remainingCredits}</div>
    </>
  );
};

const renderContext = () =>
  renderInTestProvider(
    <ContextProvider>
      <ContextValues />
    </ContextProvider>,
  );

describe("ContextProvider credits/app error state", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("does not flag not-enough-credits merely from loading with a zero balance", async () => {
    mockGetRemainingCredits.mockResolvedValue({ credits: 0 });

    renderContext();

    await waitFor(() =>
      expect(screen.getByTestId("loadingApp").textContent).toBe("false"),
    );
    expect(screen.getByTestId("appError").textContent).toBe(AppErrorType.None);
    expect(screen.getByTestId("creditsError").textContent).toBe(
      CreditsErrorType.None,
    );
  });

  it("clears not-enough-credits once credits load successfully with a positive balance", async () => {
    mockGetRemainingCredits.mockResolvedValue({ credits: 5 });

    renderContext();

    await waitFor(() =>
      expect(screen.getByTestId("loadingApp").textContent).toBe("false"),
    );
    expect(screen.getByTestId("appError").textContent).toBe(AppErrorType.None);
    expect(screen.getByTestId("creditsError").textContent).toBe(
      CreditsErrorType.None,
    );
  });

  it("clears an existing not-enough-credits flag once remainingCredits becomes positive", async () => {
    mockGetRemainingCredits.mockResolvedValue({ credits: 0 });

    renderContext();

    await waitFor(() =>
      expect(screen.getByTestId("loadingApp").textContent).toBe("false"),
    );

    act(() => {
      latestContext.setCreditsError(CreditsErrorType.NotEnoughCredits);
    });
    expect(screen.getByTestId("creditsError").textContent).toBe(
      CreditsErrorType.NotEnoughCredits,
    );

    act(() => {
      latestContext.setRemainingCredits(5);
    });
    expect(screen.getByTestId("creditsError").textContent).toBe(
      CreditsErrorType.None,
    );
  });

  it("does not flag not-enough-credits when the credits fetch fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockGetRemainingCredits.mockRejectedValue(new Error("network error"));

    renderContext();

    await waitFor(() =>
      expect(screen.getByTestId("appError").textContent).toBe(
        AppErrorType.GetRemainingCreditsFailed,
      ),
    );
    expect(screen.getByTestId("creditsError").textContent).toBe(
      CreditsErrorType.None,
    );
  });
});
