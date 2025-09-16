// For usage information, see the README.md file.
import { fireEvent, render } from "@testing-library/react";
import { TestAppUiProvider } from "@canva/app-ui-kit";
import { App } from "../app";

describe("app", () => {
  let addElementAtPoint: jest.Mock;

  beforeEach(() => {
    // Create a fresh mock for each test to avoid test interdependency
    addElementAtPoint = jest.fn();
  });

  it("calls addElementAtPoint onClick", async () => {
    const result = render(
      /*
        TestAppUiProvider is used instead of AppUiProvider in tests
        It provides the same theming and context without browser-specific features
        The theme prop allows testing both light and dark mode appearances
      */
      <TestAppUiProvider theme="dark">
        <App onClick={addElementAtPoint} />
      </TestAppUiProvider>,
    );

    // Get reference to the button using accessible role selector
    const button = result.getByRole("button");

    // Verify button text content matches expected value
    expect(button.textContent).toEqual("Do something cool");
    // Verify the Canva SDK method hasn't been called yet
    expect(addElementAtPoint).not.toHaveBeenCalled();

    // Simulate user clicking the button
    fireEvent.click(button);

    // Verify the Canva SDK method was called exactly once
    expect(addElementAtPoint).toHaveBeenCalledTimes(1);
  });

  it("Renders 🎉", () => {
    const result = render(
      /*
        Snapshot testing ensures UI doesn't change unexpectedly
        TestAppUiProvider ensures consistent rendering across test environments
      */
      <TestAppUiProvider theme="dark">
        <App onClick={addElementAtPoint} />
      </TestAppUiProvider>,
    );

    // Compare rendered output against saved snapshot
    expect(result.container).toMatchSnapshot();
  });
});
