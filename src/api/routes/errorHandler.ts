import { logger } from "../middleware/logger";

export const errorHander = (error: Error) => {
  logger.error("Server error", {
    message: error.message,
    stack: error.stack,
  });
  return new Response("Internal Server Error", { status: 500 });
};
