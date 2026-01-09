import { serve } from "bun";
import index from "./frontend/index.html";
import { logger } from "./api/middleware/logger";
import { searchRoute } from "./api/routes/search";
import { healthRoute } from "./api/routes/health";
import { errorHander } from "./api/routes/errorHandler";

export const server = serve({
  routes: {
    // Healthcheck endpoint for k8s deployments
    "/health": healthRoute,
    // Search API endpoint with validation and rate limiting
    "/search/:term": searchRoute,
    // Serve index.html for all other routes (SPA fallback)
    "/*": index,
  },
  error: errorHander,

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
