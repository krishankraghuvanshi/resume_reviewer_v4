const { createJsonCompletion } = require("./openai.service");

/**
 * Build system prompt for resume enhancement
 */
function buildEnhancementSystemPrompt() {
  return `You are an expert resume writer and career coach. Your task is to enhance resume content by:
1. Expanding bullet points with quantifiable achievements and impact metrics
2. Adding relevant technical details and technologies
3. Improving action verbs and professional language
4. Maintaining truthfulness - only add realistic, industry-standard details
5. Keeping the professional tone and structure

IMPORTANT: Return a complete, enhanced resume in the same JSON structure. Do NOT make up false information.`;
}

/**
 * Build user prompt for enhancing specific resume data
 */
function buildEnhancementUserPrompt(parsedResume) {
  return `Please enhance this resume by adding more professional details, metrics, and accomplishments. 
Expand bullet points to be more specific and impactful. Add realistic quantifiable achievements where appropriate.

Current Resume Data:
${JSON.stringify(parsedResume, null, 2)}

Return an enhanced version in the EXACT SAME JSON structure with:
- More detailed experience bullets (3-5 bullets per role with quantifiable metrics)
- Quantifiable metrics and achievements where realistic (e.g., "Improved performance by 40%", "Managed team of 5 developers")
- Expanded project descriptions with impact and tech details
- CATEGORIZED skills (Languages, Frameworks, Tools, Databases, etc.)
- More comprehensive education details (GPA if strong, relevant coursework)

Return ONLY valid JSON in this exact structure:
{
  "personal_info": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "linkedin": "string",
    "github": "string",
    "location": "string (optional)"
  },
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "location": "string (optional)",
      "bullets": ["detailed achievement 1 with metrics", "detailed achievement 2 with impact", ...]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string",
      "location": "string (optional)",
      "gpa": "string (optional)",
      "coursework": "string (optional)"
    }
  ],
  "skills_categories": {
    "Languages": ["Python", "JavaScript", "Java", ...],
    "Frameworks": ["React", "Node.js", "Django", ...],
    "Tools": ["Git", "Docker", "AWS", ...],
    "Databases": ["PostgreSQL", "MongoDB", ...]
  },
  "projects": [
    {
      "name": "string",
      "description": "detailed description with technologies used and impact/results",
      "duration": "string (optional)",
      "tech_stack": ["tech1", "tech2", ...]
    }
  ]
}

CRITICAL: Always return "skills_categories" as an object with categories (Languages, Frameworks, Tools, Databases, etc.), NOT a flat "skills" array.`;
}

/**
 * Enhance resume data using AI
 * @param {Object} parsedResume - The original parsed resume
 * @param {Object} options - Options with resumeId and log
 * @returns {Promise<Object>} Enhanced resume data
 */
async function enhanceResumeWithAI(parsedResume, { resumeId, log }) {
  try {
    const system = buildEnhancementSystemPrompt();
    const user = buildEnhancementUserPrompt(parsedResume);

    log.info({ resume_id: resumeId }, "Enhancing resume with AI");

    const { json, usage } = await createJsonCompletion({
      system,
      user,
      resumeId,
      log
    });

    // Ensure skills are categorized
    let skillsCategories = json.skills_categories || {};
    
    // If AI returned flat skills array, categorize them
    if (!json.skills_categories && json.skills && Array.isArray(json.skills)) {
      skillsCategories = {
        "Programming Languages": json.skills.filter(s => 
          /python|java|javascript|c\+\+|c#|go|rust|ruby|php|swift|kotlin/i.test(s)
        ),
        "Frameworks & Libraries": json.skills.filter(s => 
          /react|angular|vue|node|express|django|flask|spring|.net|laravel/i.test(s)
        ),
        "Tools & Technologies": json.skills.filter(s => 
          /git|docker|kubernetes|aws|azure|gcp|jenkins|ci\/cd|terraform/i.test(s)
        ),
        "Databases": json.skills.filter(s => 
          /sql|mysql|postgresql|mongodb|redis|elasticsearch|oracle|dynamodb/i.test(s)
        ),
        "Other": json.skills.filter(s => {
          const matched = /python|java|javascript|c\+\+|c#|go|rust|ruby|php|swift|kotlin|react|angular|vue|node|express|django|flask|spring|.net|laravel|git|docker|kubernetes|aws|azure|gcp|jenkins|ci\/cd|terraform|sql|mysql|postgresql|mongodb|redis|elasticsearch|oracle|dynamodb/i.test(s);
          return !matched;
        })
      };
      
      // Remove empty categories
      Object.keys(skillsCategories).forEach(key => {
        if (!skillsCategories[key] || skillsCategories[key].length === 0) {
          delete skillsCategories[key];
        }
      });
    }

    // Merge enhanced data with original, keeping personal info intact
    const enhanced = {
      personal_info: parsedResume.personal_info || json.personal_info,
      experience: json.experience || parsedResume.experience || [],
      education: json.education || parsedResume.education || [],
      skills: json.skills || parsedResume.skills || [],
      skills_categories: Object.keys(skillsCategories).length > 0 ? skillsCategories : undefined,
      projects: json.projects || parsedResume.projects || []
    };

    log.info({ resume_id: resumeId, usage }, "Resume enhanced successfully");

    return {
      enhanced_resume: enhanced,
      llm_usage: usage
    };
  } catch (error) {
    log.error({ resume_id: resumeId, error: error.message }, "Failed to enhance resume");
    throw error;
  }
}

module.exports = {
  enhanceResumeWithAI
};
