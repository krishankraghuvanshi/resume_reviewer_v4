const pino = require("pino");

const level = process.env.LOG_LEVEL || "info";

// Pretty printing is intentionally NOT enabled by default (production-friendly).
// If you want pretty logs locally, run: LOG_PRETTY=1 npm run dev
const transport =
  process.env.LOG_PRETTY === "1"
    ? {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "SYS:standard", singleLine: true }
      }
    : undefined;

const logger = pino({
  level,
  base: null,
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie"],
    remove: true
  },
  transport
});

module.exports = { logger };


