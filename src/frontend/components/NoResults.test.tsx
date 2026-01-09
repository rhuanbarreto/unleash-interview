import { test, expect, afterEach, describe } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { NoResults } from "./NoResults";

describe("NoResults", () => {
  afterEach(cleanup);

  test("renders main message", () => {
    render(<NoResults />);

    expect(screen.getByText("No addresses found")).toBeDefined();
  });

  test("renders hint message", () => {
    render(<NoResults />);

    expect(screen.getByText("Try a different search term")).toBeDefined();
  });

  test("has correct className for container", () => {
    const { container } = render(<NoResults />);

    const noResultsDiv = container.querySelector(".no-results");
    expect(noResultsDiv).toBeDefined();
  });

  test("has correct className for hint", () => {
    const { container } = render(<NoResults />);

    const hintP = container.querySelector(".no-results-hint");
    expect(hintP).toBeDefined();
  });

  test("renders icon SVG", () => {
    const { container } = render(<NoResults />);

    const svg = container.querySelector("svg");
    expect(svg).toBeDefined();
    expect(svg?.getAttribute("width")).toBe("48");
    expect(svg?.getAttribute("height")).toBe("48");
  });
});
