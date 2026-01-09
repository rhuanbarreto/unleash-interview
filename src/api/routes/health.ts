export const healthRoute = () =>
  Response.json({
    status: "ok",
    uptime: process.uptime(),
  });
