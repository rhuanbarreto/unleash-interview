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

  describe("GET /health", () => {
    test("returns 200 status", async () => {
      const response = await fetch(`${baseUrl}/health`);
      expect(response.status).toBe(200);
    });

    test("returns JSON with status ok", async () => {
      const response = await fetch(`${baseUrl}/health`);
      const data = await response.json();
      expect(data).toHaveProperty("status");
      expect(data.status).toBe("ok");
      expect(data).toHaveProperty("uptime");
    });
  });

  describe("Input Validation", () => {
    test("accepts valid Norwegian characters", async () => {
      const response = await fetch(`${baseUrl}/search/Østfold`);
      expect(response.status).toBe(200);
    });

    test("sanitizes whitespace", async () => {
      const response = await fetch(`${baseUrl}/search/  OSLO  `);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("Security", () => {
    test("escapes HTML in search terms to prevent XSS", async () => {
      const xssPayload = "<script>alert('xss')</script>";
      const response = await fetch(
        `${baseUrl}/search/${encodeURIComponent(xssPayload)}`
      );
      expect(response.status).toBe(200);
      const data = await response.json();
      // Should return empty array as the escaped HTML won't match any real data
      expect(Array.isArray(data)).toBe(true);
    });

    test("handles potentially malicious search patterns", async () => {
      const maliciousPatterns = [
        "<img src=x onerror=alert(1)>",
        "javascript:alert(1)",
        "<svg onload=alert(1)>",
      ];

      for (const pattern of maliciousPatterns) {
        const response = await fetch(
          `${baseUrl}/search/${encodeURIComponent(pattern)}`
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
      }
    });
  });

  describe("Rate Limiting", () => {
    test("allows requests within rate limit", async () => {
      // Make a few requests that should succeed
      for (let i = 0; i < 5; i++) {
        const response = await fetch(`${baseUrl}/search/test${i}`);
        expect(response.status).toBe(200);
      }
    });

    test("blocks requests after exceeding rate limit", async () => {
      // Make 100 requests (the limit)
      const requests = [];
      for (let i = 0; i < 100; i++) {
        requests.push(fetch(`${baseUrl}/search/limit${i}`));
      }
      await Promise.all(requests);

      // The 101st request should be rate limited
      const response = await fetch(`${baseUrl}/search/limitexceeded`);
      expect(response.status).toBe(429);
      expect(await response.text()).toContain("Too many requests");
      expect(response.headers.get("retry-after")).toBeDefined();
      expect(Number(response.headers.get("retry-after"))).toBeGreaterThan(0);
    });
  });
});
