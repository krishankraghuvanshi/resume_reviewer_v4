const fs = require("fs");
const axios = require("axios");
const { normalizeWhitespace, stripLikelyHeadersFooters } = require("../utils/textCleaner");
const { serviceUnavailable, gatewayTimeout, badRequest } = require("../utils/httpErrors");

const TIKA_URL = process.env.TIKA_URL || "http://localhost:9998";
const TIKA_TIMEOUT_MS = Number(process.env.TIKA_TIMEOUT_MS || 15000);

async function extractTextWithTika(pdfPath, { resumeId, log }) {
  const url = `${TIKA_URL.replace(/\/$/, "")}/tika`;

  try {
    const stream = fs.createReadStream(pdfPath);
    const resp = await axios({
      method: "put",
      url,
      data: stream,
      headers: {
        "Content-Type": "application/pdf",
        Accept: "text/plain"
      },
      timeout: TIKA_TIMEOUT_MS,
      maxContentLength: 5 * 1024 * 1024,
      maxBodyLength: 5 * 1024 * 1024,
      validateStatus: (s) => s >= 200 && s < 300
    });
    return resp.data;
  } catch (err) {
    if (err.code === "ECONNABORTED") throw gatewayTimeout("PDF parsing timed out (Tika)");
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      throw serviceUnavailable("PDF parsing service unavailable (Tika)");
    }
    log.error({ resume_id: resumeId, err }, "tika extraction failed");
    throw serviceUnavailable("PDF parsing failed");
  }
}

async function parsePdfToText(pdfPath, { resumeId, log }) {
  const raw = await extractTextWithTika(pdfPath, { resumeId, log });
  const cleaned = normalizeWhitespace(stripLikelyHeadersFooters(raw));

  // Ensure we have enough signal for LLM extraction; keep deterministic error.
  if (!cleaned || cleaned.length < 50) {
    throw badRequest("Unable to extract readable text from PDF");
  }

  return cleaned;
}

module.exports = { parsePdfToText };


