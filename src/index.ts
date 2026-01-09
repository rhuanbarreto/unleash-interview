import { serve } from "bun";
import index from "./frontend/index.html";
import { search } from "./api/searchService";
import { checkRateLimit } from "./api/middleware/rateLimit";
import { logger, logRequest } from "./api/middleware/logger";

export const server = serve({
  routes: {
    // Healthcheck endpoint for k8s deployments
    "/health": () =>
      Response.json({
        status: "ok",
        uptime: process.uptime(),
      }),

    // Search API endpoint with validation and rate limiting
    "/search/:term": (req) => {
      logRequest(req);

      // Check rate limit
      const rateLimitResponse = checkRateLimit(req);
      if (rateLimitResponse) return rateLimitResponse;

      const results = search(Bun.escapeHTML(req.params.term));
      return Response.json(results);
    },

    // Serve index.html for all other routes (SPA fallback)
    "/*": index,
  },

  error: (error) => {
    logger.error("Server error", {
      message: error.message,
      stack: error.stack,
    });
    return new Response("Internal Server Error", { status: 500 });
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

logger.info("Server started", {
  url: server.url.toString(),
  env: process.env.NODE_ENV || "development",
});
