import { test, expect, afterEach, describe } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
  afterEach(cleanup);

  test("renders loading text", () => {
    render(<LoadingState />);
    expect(screen.getByText("Searching...")).toBeDefined();
  });

  test("renders loading spinner", () => {
    const { container } = render(<LoadingState />);
    const spinner = container.querySelector(".loading-spinner");
    expect(spinner).toBeDefined();
  });

  test("has correct container class", () => {
    const { container } = render(<LoadingState />);
    const loadingContainer = container.querySelector(".loading-container");
    expect(loadingContainer).toBeDefined();
  });
});
