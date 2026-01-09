import { test, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("App > renders header and title", () => {
  render(<App />);

  expect(screen.getByText("Street Address Search")).toBeDefined();
  expect(
    screen.getByText("Search for Norwegian street addresses")
  ).toBeDefined();
});

test("App > renders search bar", () => {
  render(<App />);

  const searchInput = screen.getByRole("searchbox");
  expect(searchInput).toBeDefined();
});

test("App > has proper layout structure", () => {
  const { container } = render(<App />);

  const app = container.querySelector(".app");
  expect(app).toBeDefined();

  const header = container.querySelector(".header");
  expect(header).toBeDefined();

  const searchContainer = container.querySelector(".search-container");
  expect(searchContainer).toBeDefined();
});

test("App > search input is initially empty", () => {
  render(<App />);

  const searchInput = screen.getByRole("searchbox") as HTMLInputElement;
  expect(searchInput.value).toBe("");
});

test("App > subtitle is properly displayed", () => {
  const { container } = render(<App />);

  const subtitle = container.querySelector(".subtitle");
  expect(subtitle).toBeDefined();
  expect(subtitle?.textContent).toBe("Search for Norwegian street addresses");
});
