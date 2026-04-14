function normalizeWhitespace(text) {
  if (!text) return "";
  // Normalize newlines and trim weird spaces
  let t = String(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  t = t.replace(/\u00A0/g, " "); // non-breaking space
  // Collapse repeated spaces but keep newlines for structure
  t = t.replace(/[ \t]+/g, " ");
  // Collapse excessive newlines
  t = t.replace(/\n{4,}/g, "\n\n\n");
  return t.trim();
}

function stripLikelyHeadersFooters(text) {
  if (!text) return "";
  const lines = text.split("\n").map((l) => l.trim());
  if (lines.length < 10) return text;

  // Heuristic: remove frequent short lines that repeat many times (common header/footer artifacts)
  const freq = new Map();
  for (const l of lines) {
    if (!l) continue;
    if (l.length > 60) continue;
    freq.set(l, (freq.get(l) || 0) + 1);
  }

  const threshold = Math.max(3, Math.floor(lines.length * 0.03)); // repeats on multiple pages
  const banned = new Set();
  for (const [l, c] of freq.entries()) {
    if (c >= threshold) banned.add(l);
  }

  const filtered = lines
    .filter((l) => {
      if (!l) return true;
      if (banned.has(l)) return false;
      // remove common page-number-only lines
      if (/^(page\s*)?\d+\s*(of\s*\d+)?$/i.test(l)) return false;
      return true;
    })
    .join("\n");

  return filtered;
}

function compressForLlm(text, opts = {}) {
  const maxChars = Number(opts.maxChars || process.env.LLM_MAX_CHARS || 12000);
  let t = normalizeWhitespace(text);

  // Remove ultra-long runs that add cost but little value
  t = t.replace(/[-_=]{10,}/g, "----------");

  if (t.length <= maxChars) return t;

  // Keep beginning and end: resumes often have contact at top and education/skills at bottom.
  const head = Math.floor(maxChars * 0.7);
  const tail = maxChars - head;
  return `${t.slice(0, head)}\n...\n${t.slice(-tail)}`;
}

function detectLongParagraphs(text) {
  const t = normalizeWhitespace(text);
  const paragraphs = t.split(/\n{2,}/);
  const longOnes = paragraphs.filter((p) => p.replace(/\n/g, " ").length > 500);
  return { paragraphCount: paragraphs.length, longParagraphCount: longOnes.length };
}

module.exports = {
  normalizeWhitespace,
  stripLikelyHeadersFooters,
  compressForLlm,
  detectLongParagraphs
};


