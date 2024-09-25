import { fireEvent, render } from "@testing-library/react";
import { TestAppUiProvider } from "@canva/app-ui-kit";
import { App } from "../app";

describe("app", () => {
  let addElementAtPoint: jest.Mock;

  beforeEach(() => {
    addElementAtPoint = jest.fn();
  });

  it("calls addElementAtPoint onClick", async () => {
    const result = render(
      // In a test environment, you should wrap your apps in `TestAppUiProvider`, rather than `AppUiProvider`
      <TestAppUiProvider theme="dark">
        <App onClick={addElementAtPoint} />
      </TestAppUiProvider>,
    );

    // get a reference to the button element
    const button = result.getByRole("button");

    // assert its label matches what we expect
    expect(button.textContent).toEqual("Do something cool");
    // assert our callback has not yet been called
    expect(addElementAtPoint).not.toHaveBeenCalled();

    // programmatically simulate clicking the button
    fireEvent.click(button);

    // assert our callback was called
    expect(addElementAtPoint).toHaveBeenCalledTimes(1);
  });

  it("Renders 🎉", () => {
    const result = render(
      // In a test environment, you should wrap your apps in `TestAppUiProvider`, rather than `AppUiProvider`
      <TestAppUiProvider theme="dark">
        <App onClick={addElementAtPoint} />
      </TestAppUiProvider>,
    );

    expect(result.container).toMatchSnapshot();
  });
});
