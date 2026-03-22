const { createJsonCompletion } = require("./openai.service");
const {
  buildSuggestionSystemPrompt,
  buildSuggestionUserPrompt
} = require("./promptTemplates");
const { detectLongParagraphs } = require("../utils/textCleaner");

function uniq(arr) {
  const seen = new Set();
  const out = [];
  for (const s of arr || []) {
    const v = String(s || "").trim();
    if (!v) continue;
    const k = v.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(v);
  }
  return out;
}

function computeRuleSuggestions(parsedResume, cleanedText) {
  const suggestions = { experience: [], skills: [], projects: [], general: [] };

  const p = parsedResume.personal_info || {};
  const missingLinkedIn = !String(p.linkedin || "").trim();
  const missingGithub = !String(p.github || "").trim();
  if (missingLinkedIn) suggestions.general.push("Add a LinkedIn URL to your contact info.");
  if (missingGithub) suggestions.general.push("Add a GitHub URL (if applicable) to strengthen credibility.");

  const expBullets = (parsedResume.experience || []).flatMap((e) => e.bullets || []).map((b) => String(b || ""));
  const numBullets = expBullets.length;
  const numeric = expBullets.filter((b) => /\d/.test(b)).length;
  const ratio = numBullets > 0 ? numeric / numBullets : 0;
  if (numBullets > 0 && ratio < 0.3) {
    suggestions.experience.push(
      "Increase quantified impact in experience bullets (add metrics like %, $, time saved, scale, or latency improvements)."
    );
  }
  if (numBullets === 0 && (parsedResume.experience || []).length > 0) {
    suggestions.experience.push("Add bullet points under each role focusing on achievements, not just responsibilities.");
  }

  const skillCount = (parsedResume.skills || []).filter((s) => String(s || "").trim()).length;
  if (skillCount < 8) {
    suggestions.skills.push(
      "Expand the Skills section (aim for 10–15 relevant tools/technologies, grouped by category)."
    );
  }

  const { longParagraphCount } = detectLongParagraphs(cleanedText);
  if (longParagraphCount >= 1) {
    suggestions.general.push("Break long paragraphs into concise bullet points for readability and ATS scanning.");
  }

  // Projects suggestions
  const projects = Array.isArray(parsedResume.projects) ? parsedResume.projects : [];
  const missingTech = projects.some((p) => !Array.isArray(p.tech_stack) || p.tech_stack.length === 0);
  if (projects.length > 0 && missingTech) {
    suggestions.projects.push("Add a tech stack for each project (languages, frameworks, databases, tools).");
  }

  return suggestions;
}

function coerceSuggestionShape(json) {
  const safe = json && typeof json === "object" ? json : {};
  return {
    experience: Array.isArray(safe.experience) ? safe.experience.map(String) : [],
    skills: Array.isArray(safe.skills) ? safe.skills.map(String) : [],
    projects: Array.isArray(safe.projects) ? safe.projects.map(String) : [],
    general: Array.isArray(safe.general) ? safe.general.map(String) : []
  };
}

async function buildSuggestions(parsedResume, cleanedText, { resumeId, log }) {
  const ruleBased = computeRuleSuggestions(parsedResume, cleanedText);

  const system = buildSuggestionSystemPrompt();
  const user = buildSuggestionUserPrompt(parsedResume);

  const { json, usage } = await createJsonCompletion({ system, user, resumeId, log });
  const llmBased = coerceSuggestionShape(json);

  // Merge and de-duplicate
  const suggestions = {
    experience: uniq([...(ruleBased.experience || []), ...(llmBased.experience || [])]),
    skills: uniq([...(ruleBased.skills || []), ...(llmBased.skills || [])]),
    projects: uniq([...(ruleBased.projects || []), ...(llmBased.projects || [])]),
    general: uniq([...(ruleBased.general || []), ...(llmBased.general || [])])
  };

  return { suggestions, llm_usage: usage };
}

module.exports = { buildSuggestions };


