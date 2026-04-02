const { logger } = require("../utils/logger");

// Centralized error handler. Keep responses consistent and safe.
function errorMiddleware(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;

  // Log with request context; pino-http attaches req.log.
  const log = req.log || logger;
  const isServerError = statusCode >= 500;

  const payload = {
    message: err.publicMessage || err.message || "Internal Server Error"
  };

  if (isServerError) {
    log.error({ err, statusCode }, "request error");
  } else {
    log.warn({ err: { message: err.message }, statusCode }, "request error");
  }

  res.status(statusCode).json(payload);
}

module.exports = { errorMiddleware };


