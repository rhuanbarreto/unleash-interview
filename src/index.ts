import { serve } from "bun";
import index from "./frontend/index.html";
import { search } from "./api/searchService";

export const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
    "/search/:term": (req) => Response.json(search(req.params.term)),
    "/health": () => new Response("OK", { status: 200 }),
  },

  error: (error) => {
    console.error("Server error:", error, error.stack);
    return new Response("Internal Server Error", { status: 500 });
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
