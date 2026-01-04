import { screen, waitFor } from "@testing-library/react";
import React from "react";
import { OfficeSelectionPage } from "../pages/office_selection_page/office_selection_page";
import { renderInTestProvider, renderWithUserEvent } from "./utils";
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockOffices = [
  { id: "office1", name: "Murray Street" },
  { id: "office2", name: "Jermaine Street" },
];
// Mock the adapter module
jest.mock("../adapter.ts", () => ({
  fetchOffices: jest.fn().mockResolvedValue(mockOffices),
}));

describe("Office selection page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should require a selection of office to continue", async () => {
    const { user } = renderWithUserEvent(<OfficeSelectionPage />);

    // Should start at office selection page
    expect(screen.getByText(/select office/i)).toBeInTheDocument();

    // Click the Continue button to submit the form (should show validation error first)
    const continueButton = screen.getByText("Continue");
    user.click(continueButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/please select an office/i)).toBeInTheDocument();
    });
  });

  it("should render user account information", async () => {
    renderInTestProvider(<OfficeSelectionPage />);

    // Should show user account section
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getAllByText("Alex Chen")[0]).toBeInTheDocument();
    expect(screen.getByText("alex.chen@example.com")).toBeInTheDocument();
  });

  it("should navigate to loading page once user selects an office", async () => {
    const { user } = renderWithUserEvent(<OfficeSelectionPage />);
    const office = mockOffices[0];

    if (!office) {
      throw new Error("No mock office found");
    }

    user.click(screen.getByText("Select office"));
    await waitFor(() => {
      expect(screen.getByText(office.name)).toBeInTheDocument();
    });
    user.click(screen.getByText(office.name));
    user.click(screen.getByText("Continue"));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/loading", {
        state: { office },
      });
    });
  });
});
