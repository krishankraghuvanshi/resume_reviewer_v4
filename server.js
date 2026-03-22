/**
 * Integrated Backend Server for Resume Reviewer
 * Runs backend API and serves files needed for frontend
 */

require("dotenv").config({ path: ".env.backend" });
const http = require("http");
const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Try to load real backend, fall back to mock
let resumeRoutes, dashboardRoutes, errorMiddleware, logger;

try {
  ({ resumeRoutes } = require("./backend-src/api/resume.routes"));
  ({ dashboardRoutes } = require("./backend-src/api/dashboard.routes"));
  ({ errorMiddleware } = require("./backend-src/middlewares/error.middleware"));
  ({ logger } = require("./backend-src/utils/logger"));
  console.log("✅ Loaded real backend modules");
} catch (err) {
  console.warn("⚠️  Could not load real backend, using mock fallback:", err.message);
  
  // Mock logger
  logger = {
    info: (msg) => console.log("[INFO]", msg),
    error: (msg) => console.error("[ERROR]", msg),
    warn: (msg) => console.warn("[WARN]", msg),
    child: () => logger
  };
  
  // Mock routes - inline for fallback
  resumeRoutes = () => {
    const router = express.Router();
    const upload = multer({ dest: "/tmp" });
    
    router.post("/upload", upload.single("resume"), (req, res) => {
      if (!req.file) return res.status(400).json({ error: "Missing file" });
      
      const resumeId = require("uuid").v4();
      const mockData = {
        resume_id: resumeId,
        parsed_resume: {
          personal_info: { name: "Sample User", email: req.body.email || "sample@test.com" },
          skills: ["JavaScript", "React", "Node.js"],
          experience: [{ title: "Developer", company: "Tech Co", dates: "2020-2024" }],
          education: [{ degree: "BS CS", institution: "University", dates: "2016-2020" }]
        },
        ats_score: { total_score: 82, breakdown: { contact: 10, experience: 25, skills: 20 } },
        suggestions: {
          general: ["Add more metrics to your experience"],
          skills: ["Add cloud technologies"],
          experience: ["Quantify your impact"],
          projects: []
        },
        stored: !!req.body.email
      };
      
      if (req.file?.path) fs.unlink(req.file.path, () => {});
      res.json(mockData);
    });
    
    return router;
  };
  
  dashboardRoutes = () => {
    const router = express.Router();
    router.get("/", (req, res) => {
      res.json([
        { resume_id: "1", email: "test@example.com", name: "Sample Resume", ats_score: 82, avatar_url: "#FF6B6B", created_at: new Date().toISOString(), summary: { skills_count: 5, experience_count: 2 } }
      ]);
    });
    return router;
  };
  
  errorMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
  };
}

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:3001", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Logging
if (pinoHttp) {
  app.use(pinoHttp({ logger }));
}

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, backend: "integrated" });
});

// API Routes
app.use("/api/resume", resumeRoutes());
app.use("/api/resumes", dashboardRoutes());

// Serve stored resumes
const resumeStoragePath = path.join(process.cwd(), "storage", "resumes");
if (fs.existsSync(resumeStoragePath)) {
  app.use("/resumes", express.static(resumeStoragePath));
}

// Serve frontend build in production (single-service deployment)
const buildPath = path.join(process.cwd(), "build");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  // Keep API routes above this catch-all route.
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/") || req.path === "/health" || req.path.startsWith("/resumes")) {
      return next();
    }

    return res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Error middleware
if (errorMiddleware) {
  app.use(errorMiddleware);
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
  });
}

// Start server
const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`\n🚀 Backend Server running on http://localhost:${PORT}`);
  console.log(`📝 Frontend will connect to: http://localhost:${PORT}\n`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n⏹️  ${signal} received, shutting down...`);
  server.close((err) => {
    if (err) {
      console.error("Error during server close:", err);
      process.exitCode = 1;
    }
    console.log("✅ Server closed");
    process.exit();
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
