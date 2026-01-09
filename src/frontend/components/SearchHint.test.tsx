import { test, expect, afterEach, describe } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { SearchHint } from "./SearchHint";

describe("SearchHint", () => {
  afterEach(cleanup);

  test("renders hint message", () => {
    render(<SearchHint />);

    expect(
      screen.getByText("Type at least 3 characters to start searching")
    ).toBeDefined();
  });

  test("has correct className", () => {
    const { container } = render(<SearchHint />);

    const hintDiv = container.querySelector(".hint");
    expect(hintDiv).toBeDefined();
  });
});
