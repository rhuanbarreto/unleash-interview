import { test, expect, describe } from "bun:test";
import { search } from "./searchService";

describe("searchService", () => {
  describe("search function", () => {
    test("returns empty array for empty string", () => {
      const results = search("");
      expect(results).toEqual([]);
    });

    test("returns empty array for 1 character", () => {
      const results = search("O");
      expect(results).toEqual([]);
    });

    test("returns empty array for 2 characters", () => {
      const results = search("OS");
      expect(results).toEqual([]);
    });

    test("returns results for 3 characters", () => {
      const results = search("OSL");
      expect(results.length).toBeGreaterThan(0);
    });

    test("searches by city name", () => {
      const results = search("OSLO");
      expect(results.length).toBeGreaterThan(0);
      // Trie search matches prefix across all indexed fields (street, postNumber, city)
      // so results may include matches in any of these fields
      expect(results.some((r) => r.city === "OSLO")).toBe(true);
    });

    test("searches by street name", () => {
      const results = search("Sentrum");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.street.includes("Sentrum"))).toBe(true);
    });

    test("searches by post number", () => {
      const results = search("101");
      expect(results.length).toBeGreaterThan(0);
      // Check if any result has postNumber that contains or matches the search
      expect(results.some((r) => String(r.postNumber).includes("101"))).toBe(
        true
      );
    });

    test("searches with partial match on street", () => {
      const results = search("Vik");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.street.includes("Vik"))).toBe(true);
    });

    test("returns multiple results for common terms", () => {
      const results = search("Postboks");
      expect(results.length).toBeGreaterThan(1);
    });

    test("handles case-insensitive search", () => {
      const resultsUpper = search("OSLO");
      const resultsLower = search("oslo");
      const resultsMixed = search("Oslo");

      expect(resultsUpper.length).toBeGreaterThan(0);
      expect(resultsLower.length).toBeGreaterThan(0);
      expect(resultsMixed.length).toBeGreaterThan(0);

      // All should return the same results for OSLO
      expect(resultsUpper.length).toBe(resultsLower.length);
      expect(resultsUpper.length).toBe(resultsMixed.length);
    });

    test("returns exact matches when available", () => {
      const results = search("Sentrum Postboks 1500");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.street === "Sentrum Postboks 1500")).toBe(
        true
      );
    });

    test("handles special characters", () => {
      const results = search("123");
      // Should not throw an error
      expect(Array.isArray(results)).toBe(true);
    });

    test("returns empty for non-existent search terms", () => {
      const results = search("XYZNONEXISTENT123");
      expect(results).toEqual([]);
    });

    test("result objects have correct structure", () => {
      const results = search("OSLO");
      expect(results.length).toBeGreaterThan(0);

      const firstResult = results[0];
      // Small type narrowing
      if (!firstResult) throw new Error("firstResult foesn't exist");
      expect(firstResult).toHaveProperty("postNumber");
      expect(firstResult).toHaveProperty("city");
      expect(firstResult).toHaveProperty("street");
      expect(typeof firstResult.postNumber).toBe("number");
      expect(typeof firstResult.city).toBe("string");
      expect(typeof firstResult.street).toBe("string");
    });

    test("searches with whitespace trimming", () => {
      const results = search("  ODDA  ");
      expect(results.length).toBeGreaterThan(0);
    });

    test("handles numeric strings for post codes", () => {
      const results = search("5750");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.postNumber == 5750)).toBe(true);
    });
  });
});
