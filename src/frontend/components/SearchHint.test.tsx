import { test, expect, afterEach } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { SearchHint } from "./SearchHint";

afterEach(cleanup);

test("SearchHint > renders hint message", () => {
  render(<SearchHint />);

  expect(
    screen.getByText("Type at least 3 characters to start searching")
  ).toBeDefined();
});

test("SearchHint > has correct className", () => {
  const { container } = render(<SearchHint />);

  const hintDiv = container.querySelector(".hint");
  expect(hintDiv).toBeDefined();
});
