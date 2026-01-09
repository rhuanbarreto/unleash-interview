import { test, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { SearchBar } from "./SearchBar";

test("SearchBar > renders with initial empty value", () => {
  const mockOnChange = () => {};
  render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

  const input = screen.getByRole("searchbox");
  expect(input).toBeDefined();
  expect((input as HTMLInputElement).value).toBe("");
});

test("SearchBar > renders with initial value", () => {
  const mockOnChange = () => {};
  const { container } = render(<SearchBar searchTerm="oslo" onSearchChange={mockOnChange} />);

  const input = container.querySelector("input");
  expect((input as HTMLInputElement).value).toBe("oslo");
});

test("SearchBar > displays placeholder text", () => {
  const mockOnChange = () => {};
  render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

  const input = screen.getByPlaceholderText(
    "Type at least 3 characters to search..."
  );
  expect(input).toBeDefined();
});

test("SearchBar > has correct aria-label for accessibility", () => {
  const mockOnChange = () => {};
  render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

  const input = screen.getByLabelText("Search for street addresses");
  expect(input).toBeDefined();
});

test("SearchBar > renders search icon", () => {
  const mockOnChange = () => {};
  const { container } = render(
    <SearchBar searchTerm="" onSearchChange={mockOnChange} />
  );

  const svg = container.querySelector(".search-icon");
  expect(svg).toBeDefined();
  expect(svg?.tagName.toLowerCase()).toBe("svg");
});

test("SearchBar > input has name attribute", () => {
  const mockOnChange = () => {};
  render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

  const input = screen.getByRole("searchbox") as HTMLInputElement;
  expect(input.name).toBe("search");
});

test("SearchBar > input has search type", () => {
  const mockOnChange = () => {};
  render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

  const input = screen.getByRole("searchbox") as HTMLInputElement;
  expect(input.getAttribute("type")).toBe("search");
});

test("SearchBar > has correct CSS classes", () => {
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
