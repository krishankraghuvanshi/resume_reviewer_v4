const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { parsePdfToText } = require("../services/pdfParser.service");
const { extractStructuredResume } = require("../services/resumeExtractor.service");
const { scoreAts } = require("../services/atsScorer.service");
const { buildSuggestions } = require("../services/suggestion.service");
const { generateAvatar } = require("../services/avatar.service");
const { archiveResume } = require("../services/storage.service");
const { generateLatexResume } = require("../services/latexGenerator.service");
const { enhanceResumeWithAI } = require("../services/resumeEnhancer.service");

const { badRequest } = require("../utils/httpErrors");
const { sha256 } = require("../utils/hash");
const { cache } = require("../services/cache.service");
const { logger } = require("../utils/logger");

const db = require("../db");

function validateResumeFile(req) {
  if (!req.file || !req.file.path) {
    throw badRequest("Missing PDF file field 'resume'");
  }
  return req.file;
}

function measureTime() {
  const start = process.hrtime.bigint();
  return {
    getElapsed: () => Number((process.hrtime.bigint() - start) / 1000000n)
  };
}

function normalizeEmail(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().toLowerCase();
  return trimmed || "";
}

function getAtsTotal(atsScore) {
  if (typeof atsScore === "number") return atsScore;
  if (atsScore && typeof atsScore === "object") {
    return Number(atsScore.total_score) || 0;
  }
  return 0;
}

function checkCache(resumeHash, resumeId, log) {
  const cached = cache.get(resumeHash);
  if (cached) {
    log.info({ resume_id: resumeId, resume_hash: resumeHash }, "cache hit");
    return cached;
  }
  return null;
}

async function processResume(cleanedText, resumeId, log) {
  const timer = measureTime();
  
  const extraction = await extractStructuredResume(cleanedText, { resumeId, log });
  const extractMs = timer.getElapsed();
  
  const atsResult = scoreAts(extraction.parsed_resume, cleanedText);
  const atsScore = atsResult.total_score || 0;
  const atsMs = timer.getElapsed();
  
  const suggestionResult = await buildSuggestions(extraction.parsed_resume, cleanedText, { resumeId, log });
  const suggestMs = timer.getElapsed();
  
  return {
    extraction,
    atsResult,
    atsScore,
    suggestionResult,
    timings: { extractMs, atsMs, suggestMs }
  };
}

async function persistResume(email, resumeHash, resumeId, originalFilePath, originalName, atsScore, parsedResume, log) {
  if (!email) {
    log.info({ resume_id: resumeId }, "No email, skipping persistence");
    return null;
  }

  try {
    log.info({ resume_id: resumeId, email }, "Email found, persisting...");

    const existing = await db.query(
      `SELECT id, avatar_url, local_file_path FROM resumes WHERE email = $1 AND resume_hash = $2`,
      [email, resumeHash]
    );

    if (existing.rows.length > 0) {
      const existingRecord = existing.rows[0];
      await db.query(
        `UPDATE resumes SET updated_at = NOW() WHERE id = $1`,
        [existingRecord.id]
      );
      
      return {
        resume_id: existingRecord.id,
        avatar_url: existingRecord.avatar_url,
        resume_url: existingRecord.local_file_path ? `/resumes/${path.basename(existingRecord.local_file_path)}` : null,
        stored: true
      };
    } else {
      const avatarUrl = generateAvatar(email);
      const localFilePath = await archiveResume(email, originalFilePath);

      const insertQuery = `
        INSERT INTO resumes (
          id, email, avatar_url, resume_hash, original_filename, 
          local_file_path, ats_score, parsed_data
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id;
      `;

      await db.query(insertQuery, [
        resumeId, email, avatarUrl, resumeHash, originalName,
        localFilePath, atsScore, parsedResume
      ]);

      return {
        resume_id: resumeId,
        avatar_url: avatarUrl,
        resume_url: `/resumes/${path.basename(localFilePath)}`,
        stored: true
      };
    }
  } catch (e) {
    log.error({ err: e }, "Persistence failed");
    return null;
  }
}

function buildResponse(processedData, persistenceResult) {
  const response = {
    parsed_resume: processedData.extraction.parsed_resume,
    ats_score: processedData.atsResult,
    suggestions: processedData.suggestionResult.suggestions,
    stored: false
  };

  if (persistenceResult) {
    Object.assign(response, persistenceResult);
  }

  return response;
}

async function uploadResume(req, res, next) {
  const resumeId = uuidv4();
  const log = req.log;
  const totalTimer = measureTime();

  try {
    const file = validateResumeFile(req);
    const originalFilePath = file.path;
    const submittedEmail = normalizeEmail(req.body?.email);
    
    log.info(
      { resume_id: resumeId, originalname: file.originalname, size: file.size },
      "resume upload received"
    );

    const parseTimer = measureTime();
    const cleanedText = await parsePdfToText(originalFilePath, { resumeId, log });
    const parsedMs = parseTimer.getElapsed();

    const resumeHash = sha256(cleanedText);
    log.info({ resume_id: resumeId, resume_hash: resumeHash, parsed_ms: parsedMs }, "pdf parsed");

    const cached = checkCache(resumeHash, resumeId, log);
    if (cached) {
      const cachedParsed = cached.parsed_resume || {};
      const cachedEmail = normalizeEmail(cachedParsed.personal_info?.email) || submittedEmail;
      const cachedAtsScore = getAtsTotal(cached.ats_score);

      let persistenceResult = null;
      if (cachedEmail) {
        persistenceResult = await persistResume(
          cachedEmail,
          resumeHash,
          resumeId,
          originalFilePath,
          file.originalname,
          cachedAtsScore,
          cachedParsed,
          log
        );
      }

      const response = {
        parsed_resume: cached.parsed_resume,
        ats_score: cached.ats_score,
        suggestions: cached.suggestions,
        stored: false
      };

      if (persistenceResult) {
        Object.assign(response, persistenceResult);
      }

      return res.json({ resume_id: resumeId, ...response });
    }

    const processedData = await processResume(cleanedText, resumeId, log);
    
    const parsedEmail = normalizeEmail(processedData.extraction.parsed_resume.personal_info?.email);
    const email = parsedEmail || submittedEmail;
    const persistenceResult = await persistResume(
      email, resumeHash, resumeId, originalFilePath, file.originalname,
      processedData.atsScore, processedData.extraction.parsed_resume, log
    );

    const response = buildResponse(processedData, persistenceResult);
    cache.set(resumeHash, {
      parsed_resume: response.parsed_resume,
      ats_score: response.ats_score,
      suggestions: response.suggestions
    });

    const totalMs = totalTimer.getElapsed();
    log.info(
      {
        resume_id: resumeId,
        resume_hash: resumeHash,
        timings_ms: { pdf_parse: parsedMs, ...processedData.timings },
        total_ms: totalMs,
        llm: {
          extraction: processedData.extraction.llm_usage,
          suggestions: processedData.suggestionResult.llm_usage
        }
      },
      "resume review completed"
    );

    return res.json({ resume_id: resumeId, ...response });
  } catch (err) {
    return next(err);
  } finally {
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (e) {
        // ignore cleanup errors
      }
    }
  }
}

/**
 * Generate LaTeX resume from parsed resume data
 * POST /api/resume/generate-latex
 * Body: { parsed_resume: {...} }
 */
async function generateLatex(req, res, next) {
  try {
    const { parsed_resume } = req.body;
    
    if (!parsed_resume || typeof parsed_resume !== 'object') {
      throw badRequest("Missing or invalid 'parsed_resume' in request body");
    }
    
    // Generate LaTeX code
    const latexCode = generateLatexResume(parsed_resume);
    
    // Return as JSON
    return res.json({ latex_code: latexCode });
  } catch (err) {
    return next(err);
  }
}

/**
 * Generate LaTeX and return as downloadable .tex file
 * POST /api/resume/download-latex
 * Body: { parsed_resume: {...} }
 */
async function downloadLatex(req, res, next) {
  try {
    const { parsed_resume } = req.body;
    
    if (!parsed_resume || typeof parsed_resume !== 'object') {
      throw badRequest("Missing or invalid 'parsed_resume' in request body");
    }
    
    // Generate LaTeX code
    const latexCode = generateLatexResume(parsed_resume);
    const fileName = `resume_${Date.now()}.tex`;
    
    // Return as downloadable file
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    return res.send(latexCode);
  } catch (err) {
    return next(err);
  }
}

/**
 * Enhance resume with AI-generated details
 * POST /api/resume/enhance
 * Body: { parsed_resume: {...} }
 */
async function enhanceResume(req, res, next) {
  try {
    const { parsed_resume } = req.body;
    
    if (!parsed_resume || typeof parsed_resume !== 'object') {
      throw badRequest("Missing or invalid 'parsed_resume' in request body");
    }
    
    const resumeId = `enhance-${Date.now()}`;
    const log = logger.child({ resume_id: resumeId });
    
    log.info('Starting resume enhancement');
    
    // Enhance resume using AI
    const result = await enhanceResumeWithAI(parsed_resume, { resumeId, log });
    
    log.info({ usage: result.llm_usage }, 'Resume enhancement completed');
    
    return res.json({
      success: true,
      enhanced_resume: result.enhanced_resume,
      llm_usage: result.llm_usage
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { uploadResume, generateLatex, downloadLatex, enhanceResume };
