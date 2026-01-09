import { test, expect, afterEach, describe } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  afterEach(cleanup);

  test("renders with initial empty value", () => {
    const mockOnChange = () => {};
    render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

    const input = screen.getByRole("searchbox");
    expect(input).toBeDefined();
    expect((input as HTMLInputElement).value).toBe("");
  });

  test("renders with initial value", () => {
    const mockOnChange = () => {};
    const { container } = render(<SearchBar searchTerm="oslo" onSearchChange={mockOnChange} />);

    const input = container.querySelector("input");
    expect((input as HTMLInputElement).value).toBe("oslo");
  });

  test("displays placeholder text", () => {
    const mockOnChange = () => {};
    render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(
      "Type at least 3 characters to search..."
    );
    expect(input).toBeDefined();
  });

  test("has correct aria-label for accessibility", () => {
    const mockOnChange = () => {};
    render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

    const input = screen.getByLabelText("Search for street addresses");
    expect(input).toBeDefined();
  });

  test("renders search icon", () => {
    const mockOnChange = () => {};
    const { container } = render(
      <SearchBar searchTerm="" onSearchChange={mockOnChange} />
    );

    const svg = container.querySelector(".search-icon");
    expect(svg).toBeDefined();
    expect(svg?.tagName.toLowerCase()).toBe("svg");
  });

  test("input has name attribute", () => {
    const mockOnChange = () => {};
    render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

    const input = screen.getByRole("searchbox") as HTMLInputElement;
    expect(input.name).toBe("search");
  });

  test("input has search type", () => {
    const mockOnChange = () => {};
    render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

    const input = screen.getByRole("searchbox") as HTMLInputElement;
    expect(input.getAttribute("type")).toBe("search");
  });

  test("has correct CSS classes", () => {
    const mockOnChange = () => {};
    const { container } = render(
      <SearchBar searchTerm="" onSearchChange={mockOnChange} />
    );

    const searchContainer = container.querySelector(".search-container");
    expect(searchContainer).toBeDefined();

    const searchInput = container.querySelector(".search-input");
    expect(searchInput).toBeDefined();

    const searchIcon = container.querySelector(".search-icon");
    expect(searchIcon).toBeDefined();
  });
});
