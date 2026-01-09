import { logRequest } from "../middleware/logger";
import { checkRateLimit } from "../middleware/rateLimit";
import { search } from "../services/searchService";

export const searchRoute = (req: Bun.BunRequest<"/search/:term">) => {
  logRequest(req);

  // Check rate limit
  const rateLimitResponse = checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const results = search(Bun.escapeHTML(req.params.term));
  return Response.json(results);
};
