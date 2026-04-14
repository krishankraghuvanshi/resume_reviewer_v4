const STRUCTURED_RESUME_SCHEMA = `{
  "personal_info": {
    "name": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": ""
  },
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "bullets": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "year": ""
    }
  ],
  "skills": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "tech_stack": []
    }
  ]
}`;

const SUGGESTIONS_SCHEMA = `{
  "experience": [],
  "skills": [],
  "projects": [],
  "general": []
}`;

function buildExtractionSystemPrompt() {
  return [
    "You are a resume parsing engine.",
    "Return STRICT JSON only. No markdown. No explanations.",
    "If information is missing, use empty strings or empty arrays.",
    "Do NOT invent facts. Only extract what is present.",
    "Follow the schema exactly."
  ].join("\n");
}

function buildExtractionUserPrompt(cleanedResumeText) {
  return [
    "Extract the resume into the following JSON schema (exact keys, exact nesting):",
    STRUCTURED_RESUME_SCHEMA,
    "",
    "IMPORTANT RULES:",
    "- Extract ALL skills mentioned (programming languages, frameworks, tools, databases, etc.)",
    "- Put all skills in the 'skills' array as a flat list",
    "- Include both technical and soft skills",
    "- Do NOT skip the skills section even if it seems small",
    "",
    "Resume text:",
    cleanedResumeText
  ].join("\n");
}

function buildSuggestionSystemPrompt() {
  return [
    "You are an expert resume reviewer optimizing for ATS and clarity.",
    "Return STRICT JSON only. No markdown. No explanations.",
    "Provide concise, actionable suggestions per section.",
    "Do NOT add any extra keys."
  ].join("\n");
}

function buildSuggestionUserPrompt(parsedResumeJson) {
  return [
    "Given this structured resume JSON, produce improvement suggestions per section.",
    "Output must match this JSON schema exactly:",
    SUGGESTIONS_SCHEMA,
    "",
    "Rules:",
    "- Suggestions must be specific and actionable.",
    "- Avoid generic advice (e.g., 'improve your resume').",
    "- Do not rewrite the resume; only suggest improvements.",
    "",
    "Structured resume JSON:",
    JSON.stringify(parsedResumeJson)
  ].join("\n");
}

module.exports = {
  buildExtractionSystemPrompt,
  buildExtractionUserPrompt,
  buildSuggestionSystemPrompt,
  buildSuggestionUserPrompt
};


