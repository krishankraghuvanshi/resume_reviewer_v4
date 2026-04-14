/**
 * LaTeX Resume Generator Service
 * Generates a formatted LaTeX resume from parsed resume data
 */

/**
 * Escapes special LaTeX characters in text
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text safe for LaTeX
 */
function escapeLatex(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Formats a URL for LaTeX hyperref
 * @param {string} url - URL to format
 * @returns {string} - Formatted URL
 */
function formatUrl(url) {
  if (!url) return '';
  // Remove http:// or https:// for display
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/**
 * Generates the header section with personal info
 * @param {Object} personalInfo - Personal information object
 * @returns {string} - LaTeX code for header
 */
function generateHeader(personalInfo) {
  const name = escapeLatex(personalInfo.name || 'Your Name');
  const professionalTitle = escapeLatex(personalInfo.professional_title || '');
  const phone = escapeLatex(personalInfo.phone || '');
  const email = escapeLatex(personalInfo.email || '');
  const linkedin = personalInfo.linkedin || '';
  const github = personalInfo.github || '';
  const portfolio = personalInfo.portfolio || '';
  const location = escapeLatex(personalInfo.location || '');
  
  let contactParts = [];
  
  if (phone) {
    contactParts.push(`\\small \\faPhone* \\texttt{${phone}}`);
  }
  
  if (email) {
    contactParts.push(`\\faEnvelope \\hspace{2pt} \\texttt{${email}}`);
  }
  
  if (linkedin) {
    const linkedinFormatted = formatUrl(linkedin);
    contactParts.push(`\\faLinkedin \\hspace{2pt} \\texttt{${escapeLatex(linkedinFormatted)}}`);
  }
  
  if (github) {
    const githubFormatted = formatUrl(github);
    contactParts.push(`\\faGithub \\hspace{2pt} \\texttt{${escapeLatex(githubFormatted)}}`);
  }
  
  if (portfolio) {
    const portfolioFormatted = formatUrl(portfolio);
    contactParts.push(`\\faGlobe \\hspace{2pt} \\texttt{${escapeLatex(portfolioFormatted)}}`);
  }
  
  if (location) {
    contactParts.push(`\\faMapMarker* \\hspace{2pt}\\texttt{${location}}`);
  }
  
  const contactLine = contactParts.join(' \\hspace{1pt} $|$ \\hspace{1pt} ');
  
  let header = `%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge ${name}} \\\\ \\vspace{5pt}`;
  
  if (professionalTitle) {
    header += `\n    \\vspace{3pt}\n    \\textit{${professionalTitle}} \\\\ \\vspace{5pt}`;
  }
  
  header += `\n    ${contactLine}
    \\\\ \\vspace{-3pt}
\\end{center}`;
  
  return header;
}

/**
 * Generates the experience section
 * @param {Array} experience - Array of experience objects
 * @returns {string} - LaTeX code for experience section
 */
function generateExperience(experience) {
  if (!Array.isArray(experience) || experience.length === 0) {
    return '';
  }
  
  let latex = `
%-----------EXPERIENCE-----------
\\section{EXPERIENCE}
  \\resumeSubHeadingListStart\n`;
  
  experience.forEach((exp) => {
    const company = escapeLatex(exp.company || exp.title || 'Company');
    const role = escapeLatex(exp.role || exp.position || 'Position');
    const duration = escapeLatex(exp.duration || exp.dates || '');
    const location = escapeLatex(exp.location || '');
    const bullets = Array.isArray(exp.bullets) ? exp.bullets : 
                    Array.isArray(exp.description) ? exp.description :
                    exp.description ? [exp.description] : [];
    
    latex += `
    \\resumeSubheading
      {${company}}{${duration}}
      {${role}}{${location}}`;
    
    if (bullets.length > 0) {
      latex += `
      \\resumeItemListStart`;
      
      bullets.forEach((bullet) => {
        const bulletText = escapeLatex(String(bullet));
        latex += `
        \\resumeItem{${bulletText}}`;
      });
      
      latex += `
      \\resumeItemListEnd\n`;
    }
  });
  
  latex += `
  \\resumeSubHeadingListEnd\n`;
  
  return latex;
}

/**
 * Generates the projects section
 * @param {Array} projects - Array of project objects
 * @returns {string} - LaTeX code for projects section
 */
function generateProjects(projects) {
  if (!Array.isArray(projects) || projects.length === 0) {
    return '';
  }
  
  let latex = `
%-----------PROJECTS-----------
\\section{PROJECTS}
    \\resumeSubHeadingListStart`;
  
  projects.forEach((project) => {
    const name = escapeLatex(project.name || project.title || 'Project');
    const duration = escapeLatex(project.duration || project.dates || '');
    const description = escapeLatex(project.description || '');
    const techStack = Array.isArray(project.tech_stack) ? project.tech_stack :
                     Array.isArray(project.technologies) ? project.technologies : [];
    
    latex += `
      \\resumeProjectHeading
          {\\textbf{${name}}} {${duration}}`;
    
    const bullets = [];
    if (description) {
      bullets.push(description);
    }
    if (techStack.length > 0) {
      const tech = techStack.map(t => escapeLatex(String(t))).join(', ');
      bullets.push(`\\textbf{Technologies}: ${tech}`);
    }
    
    if (bullets.length > 0) {
      latex += `
          \\resumeItemListStart`;
      
      bullets.forEach((bullet) => {
        latex += `
            \\resumeItem{${bullet}}`;
      });
      
      latex += `
          \\resumeItemListEnd
          `;
    }
  });
  
  latex += `
    \\resumeSubHeadingListEnd\n`;
  
  return latex;
}

/**
 * Generates the education section
 * @param {Array} education - Array of education objects
 * @returns {string} - LaTeX code for education section
 */
function generateEducation(education) {
  if (!Array.isArray(education) || education.length === 0) {
    return '';
  }
  
  let latex = `
%-----------EDUCATION-----------
\\section {EDUCATION}
  \\resumeSubHeadingListStart`;
  
  education.forEach((edu) => {
    const institution = escapeLatex(edu.institution || edu.school || 'Institution');
    const degree = escapeLatex(edu.degree || edu.major || '');
    const year = escapeLatex(edu.year || edu.graduation_date || edu.dates || '');
    const location = escapeLatex(edu.location || '');
    const gpa = escapeLatex(edu.gpa || '');
    const coursework = edu.coursework || edu.relevant_coursework || '';
    
    latex += `
    \\resumeSubheading
      {${institution}}{${year}}
      {${degree}}{${location}}`;
    
    if (gpa || coursework) {
      latex += `
      	\\resumeItemListStart`;
      
      if (gpa) {
        latex += `
        \\resumeItem {\\textbf{GPA}: ${gpa}}`;
      }
      
      if (coursework) {
        const courseworkText = escapeLatex(String(coursework));
        latex += `
    	\\resumeItem {\\textbf{Relevant Coursework}: ${courseworkText}}`;
      }
      
      latex += `
        \\resumeItemListEnd`;
    }
  });
  
  latex += `
  \\resumeSubHeadingListEnd\n`;
  
  return latex;
}

/**
 * Generates the professional summary section
 * @param {string} summary - Professional summary text
 * @returns {string} - LaTeX code for summary section
 */
function generateSummary(summary) {
  if (!summary || !summary.trim()) {
    return '';
  }
  
  const summaryText = escapeLatex(summary);
  
  return `
%-----------SUMMARY-----------
\\section{PROFESSIONAL SUMMARY}
 \\begin{itemize}[leftmargin=0in, label={}]
    \\small{\\item{
     ${summaryText}
    }}
 \\end{itemize}
`;
}

/**
 * Generates the achievements & certifications section
 * @param {Array} achievements - Array of achievement strings
 * @returns {string} - LaTeX code for achievements section
 */
function generateAchievements(achievements) {
  if (!Array.isArray(achievements) || achievements.length === 0) {
    return '';
  }
  
  let latex = `
%-----------ACHIEVEMENTS-----------
\\section{ACHIEVEMENTS \\& AWARDS}
  \\resumeSubHeadingListStart\n`;
  
  achievements.forEach(achievement => {
    if (typeof achievement === 'object') {
      const title = escapeLatex(achievement.title || achievement.award_title || '');
      const issuer = escapeLatex(achievement.issuer || '');
      const date = escapeLatex(achievement.date || '');
      const description = escapeLatex(achievement.description || '');
      
      if (title) {
        latex += `    \\resumeItem{\\textbf{${title}}`;
        if (issuer) latex += ` - ${issuer}`;
        if (date) latex += ` (${date})`;
        if (description) latex += `: ${description}`;
        latex += `}\n`;
      }
    } else if (achievement && achievement.trim()) {
      latex += `    \\resumeItem{${escapeLatex(achievement)}}\n`;
    }
  });
  
  latex += `  \\resumeSubHeadingListEnd\n`;
  
  return latex;
}

/**
 * Generates the certifications section
 * @param {Array} certifications - Array of certification objects
 * @returns {string} - LaTeX code for certifications section
 */
function generateCertifications(certifications) {
  if (!Array.isArray(certifications) || certifications.length === 0) {
    return '';
  }
  
  let latex = `
%-----------CERTIFICATIONS-----------
\\section{CERTIFICATIONS}
  \\resumeSubHeadingListStart\n`;
  
  certifications.forEach(cert => {
    const name = escapeLatex(cert.name || cert.certification_name || '');
    const issuer = escapeLatex(cert.issuer || cert.issuing_organization || '');
    const date = escapeLatex(cert.date || cert.issue_date || '');
    const expiry = escapeLatex(cert.expiry || cert.expiration_date || '');
    const credential = escapeLatex(cert.credential || cert.credential_id || '');
    const url = cert.url || cert.credential_url || '';
    
    if (name) {
      latex += `    \\resumeItem{\\textbf{${name}}`;
      if (issuer) latex += ` - ${issuer}`;
      if (date) latex += ` (${date}`;
      if (expiry && expiry !== 'N/A') latex += ` - ${expiry}`;
      if (date) latex += `)`;
      if (credential) latex += ` | Credential ID: ${credential}`;
      latex += `}\n`;
    }
  });
  
  latex += `  \\resumeSubHeadingListEnd\n`;
  
  return latex;
}

/**
 * Generates the languages section
 * @param {Array} languages - Array of language objects
 * @returns {string} - LaTeX code for languages section
 */
function generateLanguages(languages) {
  if (!Array.isArray(languages) || languages.length === 0) {
    return '';
  }
  
  const langStrings = languages.map(lang => {
    const name = escapeLatex(lang.name || lang.language_name || '');
    const level = escapeLatex(lang.level || lang.proficiency_level || '');
    return level ? `${name} (${level})` : name;
  }).filter(Boolean);
  
  if (langStrings.length === 0) return '';
  
  return `
%-----------LANGUAGES-----------
\\section{LANGUAGES}
 \\begin{itemize}[leftmargin=0in, label={}]
    \\small{\\item{
     ${langStrings.join(', ')}
    }}
 \\end{itemize}
`;
}

/**
 * Generates the interests section
 * @param {Array} interests - Array of interest strings or objects
 * @returns {string} - LaTeX code for interests section
 */
function generateInterests(interests) {
  if (!Array.isArray(interests) || interests.length === 0) {
    return '';
  }
  
  const interestStrings = interests.map(interest => {
    if (typeof interest === 'string') return escapeLatex(interest);
    return escapeLatex(interest.interest_name || interest.name || '');
  }).filter(Boolean);
  
  if (interestStrings.length === 0) return '';
  
  return `
%-----------INTERESTS-----------
\\section{INTERESTS}
 \\begin{itemize}[leftmargin=0in, label={}]
    \\small{\\item{
     ${interestStrings.join(', ')}
    }}
 \\end{itemize}
`;
}

/**
 * Generates the volunteer experience section
 * @param {Array} volunteer - Array of volunteer experience objects
 * @returns {string} - LaTeX code for volunteer section
 */
function generateVolunteer(volunteer) {
  if (!Array.isArray(volunteer) || volunteer.length === 0) {
    return '';
  }
  
  let latex = `
%-----------VOLUNTEER EXPERIENCE-----------
\\section{VOLUNTEER EXPERIENCE}
  \\resumeSubHeadingListStart\n`;
  
  volunteer.forEach(vol => {
    const organization = escapeLatex(vol.organization || '');
    const role = escapeLatex(vol.role || '');
    const dates = vol.start_date && vol.end_date 
      ? escapeLatex(`${vol.start_date} - ${vol.end_date}`)
      : '';
    const description = escapeLatex(vol.description || '');
    
    if (organization && role) {
      latex += `
    \\resumeSubheading
      {${organization}}{${dates}}
      {${role}}{}`;
      
      if (description) {
        latex += `
      \\resumeItemListStart
        \\resumeItem{${description}}
      \\resumeItemListEnd
`;
      }
    }
  });
  
  latex += `
  \\resumeSubHeadingListEnd\n`;
  
  return latex;
}

/**
 * Generates the publications section
 * @param {Array} publications - Array of publication objects
 * @returns {string} - LaTeX code for publications section
 */
function generatePublications(publications) {
  if (!Array.isArray(publications) || publications.length === 0) {
    return '';
  }
  
  let latex = `
%-----------PUBLICATIONS-----------
\\section{PUBLICATIONS}
  \\resumeSubHeadingListStart\n`;
  
  publications.forEach(pub => {
    const title = escapeLatex(pub.title || '');
    const publication = escapeLatex(pub.publication || '');
    const date = escapeLatex(pub.date || '');
    const authors = escapeLatex(pub.authors || '');
    
    if (title) {
      latex += `    \\resumeItem{\\textbf{${title}}`;
      if (publication) latex += ` - ${publication}`;
      if (date) latex += ` (${date})`;
      if (authors) latex += ` | Authors: ${authors}`;
      latex += `}\n`;
    }
  });
  
  latex += `  \\resumeSubHeadingListEnd\n`;
  
  return latex;
}

/**
 * Generates the extracurricular activities section
 * @param {Array} extracurricular - Array of extracurricular objects
 * @returns {string} - LaTeX code for extracurricular section
 */
function generateExtracurricular(extracurricular) {
  if (!Array.isArray(extracurricular) || extracurricular.length === 0) {
    return '';
  }
  
  let latex = `
%-----------EXTRACURRICULAR ACTIVITIES-----------
\\section{EXTRACURRICULAR ACTIVITIES}
  \\resumeSubHeadingListStart\n`;
  
  extracurricular.forEach(extra => {
    const activity = escapeLatex(extra.activity || '');
    const role = escapeLatex(extra.role || '');
    const duration = escapeLatex(extra.duration || '');
    const description = escapeLatex(extra.description || '');
    
    if (activity) {
      latex += `    \\resumeItem{\\textbf{${activity}}`;
      if (role) latex += ` - ${role}`;
      if (duration) latex += ` (${duration})`;
      if (description) latex += `: ${description}`;
      latex += `}\n`;
    }
  });
  
  latex += `  \\resumeSubHeadingListEnd\n`;
  
  return latex;
}


/**
 * Generates the skills section
 * @param {Array} skills - Array of skills or object with skill categories
 * @param {Object} parsedResume - Full parsed resume for context
 * @returns {string} - LaTeX code for skills section
 */
function generateSkills(skills, parsedResume) {
  if ((!Array.isArray(skills) || skills.length === 0) && !parsedResume?.skills_categories) {
    return '';
  }
  
  let latex = `
%-----------PROGRAMMING SKILLS-----------
\\section{SKILLS}
 \\begin{itemize}[leftmargin=0in, label={}]
    \\small{\\item{`;
  
  // Check if skills are categorized
  if (parsedResume?.skills_categories) {
    const categories = parsedResume.skills_categories;
    const entries = [];
    
    for (const [category, categorySkills] of Object.entries(categories)) {
      if (Array.isArray(categorySkills) && categorySkills.length > 0) {
        const skillsList = categorySkills.map(s => escapeLatex(String(s))).join(', ');
        const categoryName = escapeLatex(String(category));
        entries.push(`\\textbf{${categoryName}} {: ${skillsList}}`);
      }
    }
    
    latex += entries.join('\\vspace{2pt} \\\\\n     ');
  } else if (Array.isArray(skills) && skills.length > 0) {
    // Flat skills array - try to group intelligently
    const skillsList = skills.map(s => escapeLatex(String(s))).join(', ');
    latex += `
     \\textbf{Skills} {: ${skillsList}}`;
  }
  
  latex += `
    }}
 \\end{itemize}\n`;
  
  return latex;
}

/**
 * Generates a complete LaTeX resume from parsed resume data
 * @param {Object} parsedResume - Parsed resume data object
 * @returns {string} - Complete LaTeX document
 */
function generateLatexResume(parsedResume) {
  const preamble = `%-------------------------
% Resume in Latex
% Author : Harshibar
% Based off of: https://github.com/jakeryang/resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

% fontawesome
\\usepackage{fontawesome5}

% fixed width
\\usepackage[scale=0.90,lf]{FiraMono}

% light-grey
\\definecolor{light-grey}{gray}{0.83}
\\definecolor{dark-grey}{gray}{0.3}
\\definecolor{text-grey}{gray}{.08}

\\DeclareRobustCommand{\\ebseries}{\\fontseries{eb}\\selectfont}
\\DeclareTextFontCommand{\\texteb}{\\ebseries}

% custom underilne
\\usepackage{contour}
\\usepackage[normalem]{ulem}
\\renewcommand{\\ULdepth}{1.8pt}
\\contourlength{0.8pt}
\\newcommand{\\myuline}[1]{%
  \\uline{\\phantom{#1}}%
  \\llap{\\contour{white}{#1}}%
}

% custom font: helvetica-style
\\usepackage{tgheros}
\\renewcommand*\\familydefault{\\sfdefault} 
\\usepackage[T1]{fontenc}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{0in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% sans serif sections
\\titleformat {\\section}{
    \\bfseries \\vspace{2pt} \\raggedright \\large
}{}{0em}{}[\\color{light-grey} {\\titlerule[2pt]} \\vspace{-4pt}]

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-1pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & {\\color{dark-grey}\\small #2}\\vspace{1pt}\\\\ % top row of resume entry
      \\textit{#3} & {\\color{dark-grey} \\small #4}\\\\ % second row of resume entry
    \\end{tabular*}\\vspace{-4pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
      #1 & {\\color{dark-grey}} \\\\
    \\end{tabular*}\\vspace{-4pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{0pt}}

\\color{text-grey}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}
`;

  const closing = `
%-------------------------------------------
\\end{document}`;

  // Generate each section
  const header = generateHeader(parsedResume.personal_info || {});
  const summary = parsedResume.summary || parsedResume.professional_summary 
    ? generateSummary(parsedResume.summary || parsedResume.professional_summary) 
    : '';
  const experience = generateExperience(parsedResume.experience || []);
  const projects = generateProjects(parsedResume.projects || []);
  const education = generateEducation(parsedResume.education || []);
  const skills = generateSkills(parsedResume.skills || [], parsedResume);
  const achievements = parsedResume.achievements && parsedResume.achievements.length > 0 
    ? generateAchievements(parsedResume.achievements) 
    : '';
  const certifications = parsedResume.certifications && parsedResume.certifications.length > 0
    ? generateCertifications(parsedResume.certifications)
    : '';
  const languages = parsedResume.languages && parsedResume.languages.length > 0
    ? generateLanguages(parsedResume.languages)
    : '';
  const interests = parsedResume.interests && parsedResume.interests.length > 0
    ? generateInterests(parsedResume.interests)
    : '';
  const volunteer = parsedResume.volunteer_experience && parsedResume.volunteer_experience.length > 0
    ? generateVolunteer(parsedResume.volunteer_experience)
    : '';
  const publications = parsedResume.publications && parsedResume.publications.length > 0
    ? generatePublications(parsedResume.publications)
    : '';
  const extracurricular = parsedResume.extracurricular && parsedResume.extracurricular.length > 0
    ? generateExtracurricular(parsedResume.extracurricular)
    : '';
  
  // Combine all sections
  let document = preamble;
  document += '\n' + header + '\n';
  
  // Add sections in order
  if (summary) document += '\n' + summary;
  if (experience) document += '\n' + experience;
  if (projects) document += '\n' + projects;
  if (education) document += '\n' + education;
  if (skills) document += '\n' + skills;
  if (certifications) document += '\n' + certifications;
  if (achievements) document += '\n' + achievements;
  if (volunteer) document += '\n' + volunteer;
  if (publications) document += '\n' + publications;
  if (extracurricular) document += '\n' + extracurricular;
  if (languages) document += '\n' + languages;
  if (interests) document += '\n' + interests;
  
  document += closing;
  
  return document;
}

module.exports = {
  generateLatexResume,
  escapeLatex
};
