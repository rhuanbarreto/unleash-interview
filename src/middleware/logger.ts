type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
}

function formatLog(entry: LogEntry): string {
  const { timestamp, level, message, metadata } = entry;
  const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metadataStr}`;
}

export const logger = {
  info: (message: string, metadata?: Record<string, unknown>) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "info",
      message,
      metadata,
    };
    console.log(formatLog(entry));
  },

  warn: (message: string, metadata?: Record<string, unknown>) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "warn",
      message,
      metadata,
    };
    console.warn(formatLog(entry));
  },

  error: (message: string, metadata?: Record<string, unknown>) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      metadata,
    };
    console.error(formatLog(entry));
  },
};

export function logRequest(request: Request): void {
  const url = new URL(request.url);
  logger.info("Incoming request", {
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown",
    method: request.method,
    path: url.pathname,
    userAgent: request.headers.get("user-agent") || "unknown",
  });
}
