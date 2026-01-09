import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { server } from "./index";

describe("Backend Server", () => {
  let baseUrl: string;

  beforeAll(async () => {
    // Unregister happy-dom to use native fetch for server testing
    await GlobalRegistrator.unregister();

    baseUrl = server.url.toString().replace(/\/$/, ""); // Remove trailing slash
  });

  afterAll(() => {
    // Re-register happy-dom for other tests that may need it
    GlobalRegistrator.register();
  });

  describe("GET /search/:term", () => {
    test("returns 200 status for valid search", async () => {
      const response = await fetch(`${baseUrl}/search/OSLO`);
      expect(response.status).toBe(200);
    });

    test("returns JSON content type", async () => {
      const response = await fetch(`${baseUrl}/search/OSLO`);
      expect(response.headers.get("content-type")).toContain(
        "application/json"
      );
    });

    test("returns array of results for valid search term", async () => {
      const response = await fetch(`${baseUrl}/search/OSLO`);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    test("returns empty array for search term less than 3 characters", async () => {
      const response = await fetch(`${baseUrl}/search/OS`);
      const data = await response.json();
      expect(data).toEqual([]);
    });

    test("returns empty array for non-existent search term", async () => {
      const response = await fetch(`${baseUrl}/search/XYZNONEXISTENT123`);
      const data = await response.json();
      expect(data).toEqual([]);
    });

    test("handles URL encoded search terms", async () => {
      const searchTerm = encodeURIComponent("Sentrum Postboks");
      const response = await fetch(`${baseUrl}/search/${searchTerm}`);
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    test("returns results with correct structure", async () => {
      const response = await fetch(`${baseUrl}/search/OSLO`);
      const data = await response.json();
      expect(data.length).toBeGreaterThan(0);

      const firstResult = data[0];
      expect(firstResult).toHaveProperty("postNumber");
      expect(firstResult).toHaveProperty("city");
      expect(firstResult).toHaveProperty("street");
      expect(typeof firstResult.postNumber).toBe("number");
      expect(typeof firstResult.city).toBe("string");
      expect(typeof firstResult.street).toBe("string");
    });

    test("handles case-insensitive search", async () => {
      const responseUpper = await fetch(`${baseUrl}/search/OSLO`);
      const responseLower = await fetch(`${baseUrl}/search/oslo`);

      const dataUpper = await responseUpper.json();
      const dataLower = await responseLower.json();

      expect(dataUpper).toEqual(dataLower);
    });

    test("returns maximum of 20 results", async () => {
      const response = await fetch(`${baseUrl}/search/oslo`);
      const data = await response.json();
      expect(data.length).toBeLessThanOrEqual(20);
    });

    test("handles special characters in search", async () => {
      const response = await fetch(`${baseUrl}/search/123@456`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("GET /* (index.html route)", () => {
    test("returns 200 status for root path", async () => {
      const response = await fetch(`${baseUrl}/`);
      expect(response.status).toBe(200);
    });

    test("returns HTML content type for root path", async () => {
      const response = await fetch(`${baseUrl}/`);
      const contentType = response.headers.get("content-type");
      expect(contentType).toContain("text/html");
    });

    test("returns HTML content", async () => {
      const response = await fetch(`${baseUrl}/`);
      const text = await response.text();
      expect(text).toContain("<!DOCTYPE html>");
      expect(text).toContain("<html");
    });

    test("serves index.html for unmatched routes", async () => {
      const response = await fetch(`${baseUrl}/some-random-path`);
      expect(response.status).toBe(200);
      const contentType = response.headers.get("content-type");
      expect(contentType).toContain("text/html");
    });

    test("serves index.html for nested paths", async () => {
      const response = await fetch(`${baseUrl}/nested/path/here`);
      expect(response.status).toBe(200);
      const contentType = response.headers.get("content-type");
      expect(contentType).toContain("text/html");
    });
  });

  describe("Server Configuration", () => {
    test("server is running and accessible", async () => {
      const response = await fetch(baseUrl);
      expect(response).toBeDefined();
    });

    test("server URL is valid", () => {
      expect(server.url).toBeDefined();
      expect(server.url.toString()).toMatch(/^http:\/\//);
    });
  });
});
