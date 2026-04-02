require("dotenv").config();
const path = require("path");

const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");
const { resumeRoutes } = require("./api/resume.routes");
const { dashboardRoutes } = require("./api/dashboard.routes");
const { errorMiddleware } = require("./middlewares/error.middleware");
const { logger } = require("./utils/logger");

function createApp() {
  const app = express();

  // Enable CORS for frontend
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true
  }));

  // NOTE: this API primarily accepts multipart uploads; JSON parsing is for future-proofing.
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ limit: "5mb", extended: true }));

  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => req.headers["x-request-id"] || undefined,
      customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
      customErrorMessage: (req, res, err) => `${req.method} ${req.url} ${res.statusCode} (${err.message})`,
      serializers: {
        req(req) {
          return { id: req.id, method: req.method, url: req.url };
        },
        res(res) {
          return { statusCode: res.statusCode };
        }
      }
    })
  );

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/resume", resumeRoutes());
  app.use("/api/resumes", dashboardRoutes());

  // Serve stored resumes statically
  // URL: /resumes/filename.pdf
  app.use('/resumes', express.static(path.join(process.cwd(), 'storage', 'resumes')));

  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };


