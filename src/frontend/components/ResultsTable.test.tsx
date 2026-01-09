import { test, expect, afterEach } from "bun:test";
import { render, cleanup } from "@testing-library/react";
import { ResultsTable } from "./ResultsTable";

afterEach(cleanup);

const mockResults = [
  {
    street: "Karl Johans gate",
    postNumber: 101,
    city: "OSLO",
  },
  {
    street: "Storgata",
    postNumber: 5015,
    city: "BERGEN",
  },
  {
    street: "Fjordgata",
    postNumber: 7010,
    city: "TRONDHEIM",
  },
];

test("ResultsTable > renders table with correct headers", () => {
  const { container } = render(<ResultsTable results={mockResults} />);

  const headers = container.querySelectorAll("th");
  expect(headers.length).toBe(4);
});

test("ResultsTable > displays correct count for single address", () => {
  const { container } = render(<ResultsTable results={[mockResults[0]!]} />);

  const resultCount = container.querySelector(".results-count");
  expect(resultCount?.textContent).toContain("1");
  expect(resultCount?.textContent).toContain("address");
});

test("ResultsTable > displays correct count for multiple addresses", () => {
  const { container } = render(<ResultsTable results={mockResults} />);

  const resultCount = container.querySelector(".results-count");
  expect(resultCount?.textContent).toContain("3");
  expect(resultCount?.textContent).toContain("addresses");
});

test("ResultsTable > renders correct number of table rows", () => {
  const { container } = render(<ResultsTable results={mockResults} />);

  const rows = container.querySelectorAll("tbody tr");
  expect(rows.length).toBe(3);
});

test("ResultsTable > renders map links for each result", () => {
  const { container } = render(<ResultsTable results={mockResults} />);

  const mapLinks = container.querySelectorAll(".map-link");
  expect(mapLinks.length).toBe(3);
});

test("ResultsTable > map links have correct href format", () => {
  const { container } = render(<ResultsTable results={[mockResults[0]!]} />);

  const mapLink = container.querySelector(".map-link") as HTMLAnchorElement;
  expect(mapLink).toBeDefined();
  expect(mapLink.href).toContain("https://www.google.com/maps/search/");
  // URL encoding can use either + or %20 for spaces
  expect(
    mapLink.href.includes("Karl+Johans+gate") ||
      mapLink.href.includes("Karl%20Johans%20gate")
  ).toBe(true);
  expect(mapLink.href).toContain("101");
  expect(mapLink.href).toContain("OSLO");
  expect(mapLink.href).toContain("Norway");
});

test("ResultsTable > map links open in new tab", () => {
  const { container } = render(<ResultsTable results={[mockResults[0]!]} />);

  const mapLink = container.querySelector(".map-link") as HTMLAnchorElement;
  expect(mapLink.target).toBe("_blank");
  expect(mapLink.rel).toBe("noopener noreferrer");
});

test("ResultsTable > renders map icon for each result", () => {
  const { container } = render(<ResultsTable results={mockResults} />);

  const mapIcons = container.querySelectorAll(".map-link svg");
  expect(mapIcons.length).toBe(3);
});

test("ResultsTable > handles empty results array", () => {
  const { container } = render(<ResultsTable results={[]} />);

  const resultCount = container.querySelector(".results-count");
  expect(resultCount?.textContent).toContain("0");
  expect(resultCount?.textContent).toContain("addresses");
});

test("ResultsTable > encodes special characters in map URL", () => {
  const specialResult = [
    {
      street: "Øvre gate & søndre vei",
      postNumber: 1234,
      city: "ÆØÅ",
    },
  ];

  const { container } = render(<ResultsTable results={specialResult} />);

  const mapLink = container.querySelector(".map-link") as HTMLAnchorElement;
  expect(mapLink.href).toContain("%C3%98vre"); // Ø encoded
  expect(mapLink.href).toContain("%26"); // & encoded
});

test("ResultsTable > generates unique keys for rows", () => {
  const duplicateResults = [
    {
      street: "Same Street",
      postNumber: 1000,
      city: "OSLO",
    },
    {
      street: "Same Street",
      postNumber: 1000,
      city: "OSLO",
    },
  ];

  const { container } = render(<ResultsTable results={duplicateResults} />);

  const rows = container.querySelectorAll("tbody tr");
  expect(rows.length).toBe(2);
});

test("ResultsTable > has correct CSS classes", () => {
  const { container } = render(<ResultsTable results={mockResults} />);

  expect(container.querySelector(".results-container")).toBeDefined();
  expect(container.querySelector(".results-header")).toBeDefined();
  expect(container.querySelector(".table-wrapper")).toBeDefined();
  expect(container.querySelector(".results-table")).toBeDefined();
});

test("ResultsTable > renders all address data correctly", () => {
  const { container } = render(<ResultsTable results={mockResults} />);

  const tableText = container.textContent;
  expect(tableText).toContain("Karl Johans gate");
  expect(tableText).toContain("101");
  expect(tableText).toContain("OSLO");
  expect(tableText).toContain("Storgata");
  expect(tableText).toContain("5015");
  expect(tableText).toContain("BERGEN");
  expect(tableText).toContain("Fjordgata");
  expect(tableText).toContain("7010");
  expect(tableText).toContain("TRONDHEIM");
});
