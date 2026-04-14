const { compressForLlm } = require("../utils/textCleaner");
const { createJsonCompletion } = require("./openai.service");
const {
  buildExtractionSystemPrompt,
  buildExtractionUserPrompt
} = require("./promptTemplates");

function coerceParsedResumeShape(json) {
  const safe = json && typeof json === "object" ? json : {};

  const personal = safe.personal_info && typeof safe.personal_info === "object" ? safe.personal_info : {};
  const experience = Array.isArray(safe.experience) ? safe.experience : [];
  const education = Array.isArray(safe.education) ? safe.education : [];
  const skills = Array.isArray(safe.skills) ? safe.skills : [];
  const projects = Array.isArray(safe.projects) ? safe.projects : [];

  return {
    personal_info: {
      name: String(personal.name || ""),
      email: String(personal.email || ""),
      phone: String(personal.phone || ""),
      linkedin: String(personal.linkedin || ""),
      github: String(personal.github || "")
    },
    experience: experience.map((e) => ({
      company: String(e?.company || ""),
      role: String(e?.role || ""),
      duration: String(e?.duration || ""),
      bullets: Array.isArray(e?.bullets) ? e.bullets.map((b) => String(b)) : []
    })),
    education: education.map((ed) => ({
      institution: String(ed?.institution || ""),
      degree: String(ed?.degree || ""),
      year: String(ed?.year || "")
    })),
    skills: skills.map((s) => String(s)),
    projects: projects.map((p) => ({
      name: String(p?.name || ""),
      description: String(p?.description || ""),
      tech_stack: Array.isArray(p?.tech_stack) ? p.tech_stack.map((t) => String(t)) : []
    }))
  };
}

async function extractStructuredResume(cleanedText, { resumeId, log }) {
  const llmText = compressForLlm(cleanedText);

  const system = buildExtractionSystemPrompt();
  const user = buildExtractionUserPrompt(llmText);

  const { json, usage } = await createJsonCompletion({ system, user, resumeId, log });
  const parsed_resume = coerceParsedResumeShape(json);

  return { parsed_resume, llm_usage: usage };
}

module.exports = { extractStructuredResume };


