const fs = require("fs");
const path = require("path");
const os = require("os");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { payloadTooLarge, unsupportedMediaType, badRequest } = require("../utils/httpErrors");

const MAX_BYTES = 2 * 1024 * 1024; // 2MB
const TMP_DIR = process.env.UPLOAD_TMP_DIR || path.join(os.tmpdir(), "resume-reviewer");

function ensureTmpDir() {
  try {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  } catch (e) {
    // If this fails, multer will fail later; surface as a 500.
    throw e;
  }
}

function isPdfFile(file) {
  // Multer’s mimetype is client-provided, but still useful for early rejection.
  if (file.mimetype === "application/pdf") return true;
  if (file.originalname && file.originalname.toLowerCase().endsWith(".pdf")) return true;
  return false;
}

function createUploadMiddleware() {
  ensureTmpDir();

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, TMP_DIR),
    filename: (req, file, cb) => {
      const id = uuidv4();
      // Keep extension deterministic
      cb(null, `${id}.pdf`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: MAX_BYTES, files: 1 },
    fileFilter: (req, file, cb) => {
      if (!file) return cb(badRequest("Missing file"));
      if (!isPdfFile(file)) return cb(unsupportedMediaType("Only PDF resumes are supported"));
      return cb(null, true);
    }
  });
}

// Express error adapter for Multer-specific errors
function multerErrorAdapter(err, req, res, next) {
  if (!err) return next();

  if (err.code === "LIMIT_FILE_SIZE") {
    return next(payloadTooLarge("Max file size is 2MB"));
  }

  return next(err);
}

module.exports = { createUploadMiddleware, multerErrorAdapter, TMP_DIR, MAX_BYTES };


