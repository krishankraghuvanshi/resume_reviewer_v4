const http = require("http");
const { createApp } = require("./app");
const { logger } = require("./utils/logger");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

async function start() {
  const app = createApp();

  // Create HTTP server with increased header size limit
  const server = http.createServer({
    maxHeaderSize: 16384 // 16KB (default is 8KB)
  }, app);

  server.listen(PORT, HOST, () => {
    logger.info({ port: PORT, host: HOST }, "server listening");
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    logger.warn({ signal }, "shutdown signal received");
    server.close((err) => {
      if (err) {
        logger.error({ err }, "error during server close");
        process.exitCode = 1;
      }
      logger.info("server closed");
      process.exit();
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  logger.fatal({ err }, "failed to start server");
  process.exit(1);
});


