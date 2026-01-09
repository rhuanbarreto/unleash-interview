import { test, expect, afterEach, describe } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
  afterEach(cleanup);

  test("renders header and title", () => {
    render(<App />);

    expect(screen.getByText("Street Address Search")).toBeDefined();
    expect(
      screen.getByText("Search for Norwegian street addresses")
    ).toBeDefined();
  });

  test("renders search bar", () => {
    render(<App />);

    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toBeDefined();
  });

  test("has proper layout structure", () => {
    const { container } = render(<App />);

    const app = container.querySelector(".app");
    expect(app).toBeDefined();

    const header = container.querySelector(".header");
    expect(header).toBeDefined();

    const searchContainer = container.querySelector(".search-container");
    expect(searchContainer).toBeDefined();
  });

  test("search input is initially empty", () => {
    render(<App />);

    const searchInput = screen.getByRole("searchbox") as HTMLInputElement;
    expect(searchInput.value).toBe("");
  });

  test("subtitle is properly displayed", () => {
    const { container } = render(<App />);

    const subtitle = container.querySelector(".subtitle");
    expect(subtitle).toBeDefined();
    expect(subtitle?.textContent).toBe("Search for Norwegian street addresses");
  });
});
