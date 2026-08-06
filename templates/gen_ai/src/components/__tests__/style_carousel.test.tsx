import { fireEvent, screen } from "@testing-library/react";
import { renderInTestProvider } from "src/utils/test_render";
import { StyleCarousel } from "src/components/style_carousel";

const isPressed = (name: string) =>
  screen.getByRole("button", { name }).getAttribute("aria-pressed") === "true";

describe("StyleCarousel", () => {
  // jsdom doesn't implement IntersectionObserver, which the Carousel's
  // scroll-visibility tracking relies on.
  beforeAll(() => {
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })) as unknown as typeof IntersectionObserver;
  });

  it("selects 'None' by default", () => {
    renderInTestProvider(<StyleCarousel />);

    expect(isPressed("None")).toBe(true);
    expect(isPressed("Hand drawn")).toBe(false);
  });

  it("selects a style when clicked, deselecting the previous one", () => {
    renderInTestProvider(<StyleCarousel />);

    fireEvent.click(screen.getByRole("button", { name: "Hand drawn" }));

    expect(isPressed("Hand drawn")).toBe(true);
    expect(isPressed("None")).toBe(false);
  });

  it("deselects a style when clicked again", () => {
    renderInTestProvider(<StyleCarousel />);

    const handDrawnButton = screen.getByRole("button", { name: "Hand drawn" });
    fireEvent.click(handDrawnButton);
    fireEvent.click(handDrawnButton);

    expect(isPressed("Hand drawn")).toBe(false);
  });
});
