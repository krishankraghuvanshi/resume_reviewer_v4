const express = require("express");
const { uploadResume, generateLatex, downloadLatex, generatePdf, enhanceResume } = require("../controllers/resume.controller");
const { createUploadMiddleware, multerErrorAdapter } = require("../middlewares/upload.middleware");

function resumeRoutes() {
  const router = express.Router();

  // multipart/form-data with 'resume' field
  router.post("/upload", createUploadMiddleware().single("resume"), multerErrorAdapter, uploadResume);
  
  // Generate LaTeX resume from parsed data
  router.post("/generate-latex", express.json(), generateLatex);
  
  // Download LaTeX as .tex file
  router.post("/download-latex", express.json(), downloadLatex);
  
  // Generate PDF from LaTeX
  router.post("/generate-pdf", express.json(), generatePdf);
  
  // Enhance resume with AI
  router.post("/enhance", express.json(), enhanceResume);

  return router;
}

module.exports = { resumeRoutes };


