const { detectLongParagraphs } = require("../utils/textCleaner");

function hasValue(s) {
  return typeof s === "string" && s.trim().length > 0;
}

function flattenBullets(parsedResume) {
  const expBullets = (parsedResume.experience || []).flatMap((e) => e.bullets || []);
  const projBullets = (parsedResume.projects || []).flatMap((p) => {
    // projects schema has description (string) and tech_stack; no bullets.
    // Still treat description as a single "bullet" for some signals.
    return p.description ? [p.description] : [];
  });
  return [...expBullets, ...projBullets].map((b) => String(b || ""));
}

function countNumberBullets(bullets) {
  const re = /\d/; // simple & fast: digits present
  let n = 0;
  for (const b of bullets) {
    if (re.test(b)) n += 1;
  }
  return n;
}

function keywordRichnessScore(text) {
  const t = String(text || "").toLowerCase();
  const keywords = [
    // roles/process
    "api",
    "microservice",
    "backend",
    "frontend",
    "full stack",
    "agile",
    "scrum",
    "ci/cd",
    "docker",
    "kubernetes",
    "aws",
    "gcp",
    "azure",
    // data
    "sql",
    "postgres",
    "mysql",
    "mongodb",
    "redis",
    "kafka",
    // web
    "rest",
    "graphql",
    "oauth",
    "jwt",
    // common stacks
    "node",
    "express",
    "python",
    "java",
    "typescript",
    "javascript",
    "react",
    "linux",
    // quality
    "testing",
    "unit test",
    "integration",
    "observability",
    "monitoring",
    "logging",
    "tracing"
  ];

  let hits = 0;
  for (const k of keywords) {
    if (t.includes(k)) hits += 1;
  }

  // map hits -> 0..15 (diminishing returns)
  const capped = Math.min(hits, 20);
  return Math.round((capped / 20) * 15);
}

function formattingClarityScore(text) {
  const t = String(text || "");
  const lines = t.split("\n");
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (nonEmpty.length === 0) return 0;

  const bulletLike = nonEmpty.filter((l) => /^(\-|\*|•|\u2022)\s+/.test(l.trim())).length;
  const bulletRatio = bulletLike / nonEmpty.length;

  const veryLongLines = nonEmpty.filter((l) => l.length > 140).length;
  const longLineRatio = veryLongLines / nonEmpty.length;

  const { longParagraphCount } = detectLongParagraphs(t);

  // Start from baseline and adjust with deterministic heuristics
  let score = 8;
  if (bulletRatio >= 0.25) score += 5;
  if (bulletRatio >= 0.4) score += 2;
  if (longLineRatio > 0.1) score -= 3;
  if (longParagraphCount >= 2) score -= 3;

  return Math.max(0, Math.min(15, score));
}

function scoreAts(parsedResume, cleanedText) {
  const personal = parsedResume.personal_info || {};

  // 1) Contact info completeness (10)
  const contactFields = ["name", "email", "phone", "linkedin", "github"];
  const contactHits = contactFields.reduce((acc, k) => acc + (hasValue(personal[k]) ? 1 : 0), 0);
  const contact_info = contactHits * 2; // 5 fields * 2 = 10

  // 2) Experience clarity (20)
  const exps = Array.isArray(parsedResume.experience) ? parsedResume.experience : [];
  const expCount = exps.length;
  const withCompanyRole = exps.filter((e) => hasValue(e.company) && hasValue(e.role)).length;
  const withDuration = exps.filter((e) => hasValue(e.duration)).length;
  const totalBullets = exps.reduce((acc, e) => acc + (Array.isArray(e.bullets) ? e.bullets.length : 0), 0);
  let experience = 0;
  if (expCount > 0) experience += 5;
  experience += Math.min(8, withCompanyRole * 4); // up to 8
  experience += Math.min(4, withDuration * 2); // up to 4
  experience += Math.min(3, Math.floor(totalBullets / 4)); // up to 3
  experience = Math.max(0, Math.min(20, experience));

  // 3) Quantified impact (20)
  const bullets = flattenBullets(parsedResume);
  const numericBullets = countNumberBullets(bullets);
  const ratio = bullets.length > 0 ? numericBullets / bullets.length : 0;
  const quantified_impact = Math.round(ratio * 20);

  // 4) Skills density (20)
  const skills = Array.isArray(parsedResume.skills) ? parsedResume.skills : [];
  const skillCount = skills.filter((s) => String(s).trim()).length;
  let skills_density = 0;
  if (skillCount >= 15) skills_density = 20;
  else if (skillCount >= 12) skills_density = 18;
  else if (skillCount >= 10) skills_density = 16;
  else if (skillCount >= 8) skills_density = 14;
  else if (skillCount >= 6) skills_density = 12;
  else if (skillCount >= 4) skills_density = 8;
  else if (skillCount >= 2) skills_density = 5;
  else skills_density = 2;

  // 5) Keyword richness (15)
  const keyword_richness = keywordRichnessScore(cleanedText);

  // 6) Formatting clarity (15)
  const formatting_clarity = formattingClarityScore(cleanedText);

  const breakdown = {
    contact_info,
    experience,
    quantified_impact,
    skills_density,
    keyword_richness,
    formatting_clarity
  };

  const total_score = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return { total_score, breakdown };
}

module.exports = { scoreAts };


