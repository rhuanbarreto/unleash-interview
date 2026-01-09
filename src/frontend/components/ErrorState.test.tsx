import { test, expect, afterEach, describe } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  afterEach(cleanup);

  test("renders error message", () => {
    render(<ErrorState message="Test error message" />);
    expect(screen.getByText("Test error message")).toBeDefined();
  });

  test("renders error title", () => {
    render(<ErrorState message="Something went wrong" />);
    expect(screen.getByText("Search Error")).toBeDefined();
  });

  test("renders error icon", () => {
    const { container } = render(<ErrorState message="Error" />);
    const icon = container.querySelector(".error-icon");
    expect(icon).toBeDefined();
  });

  test("has correct container class", () => {
    const { container } = render(<ErrorState message="Error" />);
    const errorState = container.querySelector(".error-state");
    expect(errorState).toBeDefined();
  });
});
