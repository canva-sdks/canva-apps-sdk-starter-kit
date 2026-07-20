import { screen } from "@testing-library/react";
import React from "react";
import { App } from "src/intents/design_editor/app";
import { renderInTestProvider } from "src/utils/test_render";

describe("App", () => {
  it("should render the app and start at the office selection page", () => {
    renderInTestProvider(<App />);
    expect(screen.getByText(/select office/i)).toBeInTheDocument();
  });
});
