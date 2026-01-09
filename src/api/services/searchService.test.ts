import { test, expect, describe } from "bun:test";
import { search } from "./searchService";

describe("searchService", () => {
  describe("search function", () => {
    test("returns empty array for empty string", async () => {
      const results = await search("");
      expect(results).toEqual([]);
    });

    test("returns empty array for 1 character", async () => {
      const results = await search("O");
      expect(results).toEqual([]);
    });

    test("returns empty array for 2 characters", async () => {
      const results = await search("OS");
      expect(results).toEqual([]);
    });

    test("returns results for 3 characters", async () => {
      const results = await search("OSL");
      expect(results.length).toBeGreaterThan(0);
    });

    test("searches by city name", async () => {
      const results = await search("OSLO");
      expect(results.length).toBeGreaterThan(0);
      // Search matches across all indexed fields (street, postNumber, city)
      // so results may include matches in any of these fields
      expect(results.some((r) => r.city === "OSLO")).toBe(true);
    });

    test("searches by street name", async () => {
      const results = await search("Sentrum");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.street.includes("Sentrum"))).toBe(true);
    });

    test("searches by post number", async () => {
      const results = await search("101");
      expect(results.length).toBeGreaterThan(0);
      // Check if any result has postNumber that contains or matches the search
      expect(results.some((r) => String(r.postNumber).includes("101"))).toBe(
        true
      );
    });

    test("searches with partial match on street", async () => {
      const results = await search("Vik");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.street.includes("Vik"))).toBe(true);
    });

    test("returns multiple results for common terms", async () => {
      const results = await search("Postboks");
      expect(results.length).toBeGreaterThan(1);
    });

    test("handles case-insensitive search", async () => {
      const resultsUpper = await search("OSLO");
      const resultsLower = await search("oslo");
      const resultsMixed = await search("Oslo");

      expect(resultsUpper.length).toBeGreaterThan(0);
      expect(resultsLower.length).toBeGreaterThan(0);
      expect(resultsMixed.length).toBeGreaterThan(0);

      // All should return the same results for OSLO
      expect(resultsUpper.length).toBe(resultsLower.length);
      expect(resultsUpper.length).toBe(resultsMixed.length);
    });

    test("returns exact matches when available", async () => {
      const results = await search("Sentrum Postboks 1500");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.street === "Sentrum Postboks 1500")).toBe(
        true
      );
    });

    test("handles special characters", async () => {
      const results = await search("123");
      // Should not throw an error
      expect(Array.isArray(results)).toBe(true);
    });

    test("returns empty for non-existent search terms", async () => {
      const results = await search("XYZNONEXISTENT123");
      expect(results).toEqual([]);
    });

    test("result objects have correct structure", async () => {
      const results = await search("OSLO");
      expect(results.length).toBeGreaterThan(0);

      const firstResult = results[0];
      // Small type narrowing
      if (!firstResult) throw new Error("firstResult doesn't exist");
      expect(firstResult).toHaveProperty("postNumber");
      expect(firstResult).toHaveProperty("city");
      expect(firstResult).toHaveProperty("street");
      expect(typeof firstResult.postNumber).toBe("number");
      expect(typeof firstResult.city).toBe("string");
      expect(typeof firstResult.street).toBe("string");
    });

    test("searches with whitespace trimming", async () => {
      const results = await search("  ODDA  ");
      expect(results.length).toBeGreaterThan(0);
    });

    test("handles numeric strings for post codes", async () => {
      const results = await search("5750");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.postNumber == 5750)).toBe(true);
    });

    test("limits results to maximum of 20 items", async () => {
      // Search for a very common term that would return more than 20 results
      const results = await search("Postboks");
      // Should not exceed the limit of 20 results
      expect(results.length).toBeLessThanOrEqual(20);
    });

    test("does not include $tsid property in results", async () => {
      const results = await search("OSLO");
      expect(results.length).toBeGreaterThan(0);

      const firstResult = results[0];
      if (!firstResult) throw new Error("firstResult doesn't exist");
      // Orama doesn't add extra properties to results
      expect(firstResult).not.toHaveProperty("$tsid");
    });
  });
});
