import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Chip,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { resumeAPI } from '../services/api';

const SKILL_CATEGORIES = ['Programming', 'Tools', 'Soft Skills', 'Technical', 'Other'];
const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Fluent', 'Native'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];

const ComprehensiveResumeForm = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [latexOutput, setLatexOutput] = useState('');

  const [formData, setFormData] = useState({
    // Personal Information
    personalInfo: {
      first_name: '',
      last_name: '',
      full_name: '',
      email: '',
      phone_number: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      linkedin_url: '',
      github_url: '',
      portfolio_url: '',
      professional_summary: ''
    },
    // Education
    education: [],
    // Work Experience
    experience: [],
    // Skills
    skills: [],
    // Projects
    projects: [],
    // Certifications
    certifications: [],
    // Achievements
    achievements: [],
    // Languages
    languages: [],
    // Interests
    interests: [],
    // Additional sections
    volunteer_experience: [],
    publications: [],
    extracurricular_activities: []
  });

  // Personal Info Handlers
  const handlePersonalInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  // Generic Add Handler
  const addItem = (section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...template, id: Date.now() }]
    }));
  };

  // Generic Update Handler
  const updateItem = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Generic Delete Handler
  const deleteItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Templates
  const educationTemplate = {
    institution_name: '',
    degree: '',
    field_of_study: '',
    education_location: '',
    start_date: '',
    end_date: '',
    grade: '',
    description: ''
  };

  const experienceTemplate = {
    company_name: '',
    job_title: '',
    employment_type: '',
    location: '',
    start_date: '',
    end_date: '',
    currently_working: false,
    job_description: '',
    responsibilities: '',
    achievements: ''
  };

  const skillTemplate = {
    skill_name: '',
    skill_level: '',
    skill_category: ''
  };

  const projectTemplate = {
    project_title: '',
    project_description: '',
    technologies_used: '',
    project_link: '',
    github_repository: '',
    start_date: '',
    end_date: ''
  };

  const certificationTemplate = {
    certification_name: '',
    issuing_organization: '',
    issue_date: '',
    expiration_date: '',
    credential_id: '',
    credential_url: ''
  };

  const achievementTemplate = {
    award_title: '',
    issuer: '',
    date: '',
    description: ''
  };

  const languageTemplate = {
    language_name: '',
    proficiency_level: ''
  };

  const interestTemplate = {
    interest_name: ''
  };

  const volunteerTemplate = {
    organization: '',
    role: '',
    start_date: '',
    end_date: '',
    description: ''
  };

  const publicationTemplate = {
    title: '',
    publication: '',
    date: '',
    authors: '',
    link: ''
  };

  const extracurricularTemplate = {
    activity: '',
    role: '',
    description: '',
    duration: ''
  };

  // Submit Handler
  const handleGenerateLatex = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Transform form data to match backend expectations
      const resumeData = {
        personal_info: {
          name: formData.personalInfo.full_name || `${formData.personalInfo.first_name} ${formData.personalInfo.last_name}`.trim(),
          email: formData.personalInfo.email,
          phone: formData.personalInfo.phone_number,
          location: [formData.personalInfo.city, formData.personalInfo.state, formData.personalInfo.country].filter(Boolean).join(', '),
          linkedin: formData.personalInfo.linkedin_url,
          github: formData.personalInfo.github_url,
          portfolio: formData.personalInfo.portfolio_url,
          professional_title: formData.personalInfo.professional_summary
        },
        education: formData.education.map(edu => ({
          institution: edu.institution_name,
          degree: edu.degree,
          field: edu.field_of_study,
          location: edu.education_location,
          dates: `${edu.start_date} - ${edu.end_date}`,
          grade: edu.grade,
          description: edu.description
        })),
        experience: formData.experience.map(exp => ({
          company: exp.company_name,
          role: exp.job_title,
          type: exp.employment_type,
          location: exp.location,
          dates: `${exp.start_date} - ${exp.currently_working ? 'Present' : exp.end_date}`,
          description: [exp.job_description, exp.responsibilities, exp.achievements].filter(Boolean)
        })),
        skills: formData.skills.reduce((acc, skill) => {
          if (!acc[skill.skill_category]) {
            acc[skill.skill_category] = [];
          }
          acc[skill.skill_category].push(`${skill.skill_name} (${skill.skill_level})`);
          return acc;
        }, {}),
        projects: formData.projects.map(proj => ({
          title: proj.project_title,
          description: proj.project_description,
          technologies: proj.technologies_used.split(',').map(t => t.trim()),
          link: proj.project_link,
          github: proj.github_repository,
          dates: `${proj.start_date} - ${proj.end_date}`
        })),
        certifications: formData.certifications.map(cert => ({
          name: cert.certification_name,
          issuer: cert.issuing_organization,
          date: cert.issue_date,
          expiry: cert.expiration_date,
          credential: cert.credential_id,
          url: cert.credential_url
        })),
        achievements: formData.achievements.map(ach => ({
          title: ach.award_title,
          issuer: ach.issuer,
          date: ach.date,
          description: ach.description
        })),
        languages: formData.languages.map(lang => ({
          name: lang.language_name,
          level: lang.proficiency_level
        })),
        interests: formData.interests.map(int => int.interest_name),
        volunteer_experience: formData.volunteer_experience,
        publications: formData.publications,
        extracurricular: formData.extracurricular_activities
      };

      const response = await resumeAPI.generateLatex(resumeData);
      setLatexOutput(response.latex);
      setSuccess('LaTeX generated successfully! Scroll down to view/download.');
    } catch (err) {
      setError(err.message || 'Failed to generate LaTeX');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadLatex = () => {
    const blob = new Blob([latexOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.personalInfo.full_name.replace(/\s+/g, '_') || 'resume'}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#111111',
        py: 6,
        px: 3,
        '& .MuiAccordion-root': {
          backgroundColor: '#ffffff !important',
          color: '#111111',
          border: '1px solid #e5e7eb',
          borderRadius: '10px !important',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            transform: 'translateY(-1px)'
          }
        },
        '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': {
          color: '#111111 !important'
        },
        '& .MuiCard-root': {
          backgroundColor: '#ffffff !important',
          color: '#111111',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 6px rgba(0,0,0,0.05)'
        },
        '& .MuiTextField-root .MuiOutlinedInput-root': {
          backgroundColor: '#ffffff !important',
          transition: 'all 0.2s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9ca3af'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c73835'
          }
        },
        '& .MuiInputLabel-root': {
          color: '#4b5563'
        },
        '& .MuiButton-outlined': {
          color: '#111111 !important',
          borderColor: '#111111 !important',
          '&:hover': {
            backgroundColor: '#f3f4f6'
          }
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        {onBack && (
          <Box sx={{ maxWidth: '1200px', mx: 'auto', mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              sx={{ color: '#111111', '&:hover': { backgroundColor: '#f3f4f6' } }}
            >
              Back to Home
            </Button>
          </Box>
        )}

        <Typography variant="h3" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
          Comprehensive Resume Builder
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {/* 1️⃣ Personal Information */}
          <Accordion defaultExpanded sx={{ mb: 2, backgroundColor: '#1a1a1a' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <Typography variant="h6">1️⃣ Personal Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.personalInfo.first_name}
                    onChange={(e) => handlePersonalInfoChange('first_name', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.personalInfo.last_name}
                    onChange={(e) => handlePersonalInfoChange('last_name', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.personalInfo.full_name}
                    onChange={(e) => handlePersonalInfoChange('full_name', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.personalInfo.phone_number}
                    onChange={(e) => handlePersonalInfoChange('phone_number', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={formData.personalInfo.address}
                    onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.personalInfo.city}
                    onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.personalInfo.state}
                    onChange={(e) => handlePersonalInfoChange('state', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={formData.personalInfo.country}
                    onChange={(e) => handlePersonalInfoChange('country', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={formData.personalInfo.postal_code}
                    onChange={(e) => handlePersonalInfoChange('postal_code', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn URL"
                    value={formData.personalInfo.linkedin_url}
                    onChange={(e) => handlePersonalInfoChange('linkedin_url', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="GitHub URL"
                    value={formData.personalInfo.github_url}
                    onChange={(e) => handlePersonalInfoChange('github_url', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Portfolio URL"
                    value={formData.personalInfo.portfolio_url}
                    onChange={(e) => handlePersonalInfoChange('portfolio_url', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Professional Summary"
                    value={formData.personalInfo.professional_summary}
                    onChange={(e) => handlePersonalInfoChange('professional_summary', e.target.value)}
                    sx={{ backgroundColor: '#2a2a2a' }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* 2️⃣ Education */}
          <Accordion sx={{ mb: 2, backgroundColor: '#1a1a1a' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <Typography variant="h6">2️⃣ Education</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {formData.education.map((edu, index) => (
                  <Card key={edu.id} sx={{ backgroundColor: '#2a2a2a', p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">Education {index + 1}</Typography>
                          <IconButton onClick={() => deleteItem('education', index)} size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Institution Name"
                          value={edu.institution_name}
                          onChange={(e) => updateItem('education', index, 'institution_name', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Degree"
                          value={edu.degree}
                          onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Field of Study"
                          value={edu.field_of_study}
                          onChange={(e) => updateItem('education', index, 'field_of_study', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Location"
                          value={edu.education_location}
                          onChange={(e) => updateItem('education', index, 'education_location', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Start Date"
                          value={edu.start_date}
                          onChange={(e) => updateItem('education', index, 'start_date', e.target.value)}
                          size="small"
                          placeholder="e.g., Aug 2019"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="End Date"
                          value={edu.end_date}
                          onChange={(e) => updateItem('education', index, 'end_date', e.target.value)}
                          size="small"
                          placeholder="e.g., May 2023"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Grade/CGPA"
                          value={edu.grade}
                          onChange={(e) => updateItem('education', index, 'grade', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Description"
                          value={edu.description}
                          onChange={(e) => updateItem('education', index, 'description', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addItem('education', educationTemplate)}
                  variant="outlined"
                  sx={{ color: '#fff', borderColor: '#fff' }}
                >
                  Add Education
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 3️⃣ Work Experience */}
          <Accordion sx={{ mb: 2, backgroundColor: '#1a1a1a' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <Typography variant="h6">3️⃣ Work Experience</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {formData.experience.map((exp, index) => (
                  <Card key={exp.id} sx={{ backgroundColor: '#2a2a2a', p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">Experience {index + 1}</Typography>
                          <IconButton onClick={() => deleteItem('experience', index)} size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Company Name"
                          value={exp.company_name}
                          onChange={(e) => updateItem('experience', index, 'company_name', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Job Title"
                          value={exp.job_title}
                          onChange={(e) => updateItem('experience', index, 'job_title', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Employment Type"
                          value={exp.employment_type}
                          onChange={(e) => updateItem('experience', index, 'employment_type', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        >
                          {EMPLOYMENT_TYPES.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Location"
                          value={exp.location}
                          onChange={(e) => updateItem('experience', index, 'location', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Start Date"
                          value={exp.start_date}
                          onChange={(e) => updateItem('experience', index, 'start_date', e.target.value)}
                          size="small"
                          placeholder="e.g., Jan 2022"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="End Date"
                          value={exp.end_date}
                          onChange={(e) => updateItem('experience', index, 'end_date', e.target.value)}
                          size="small"
                          placeholder="e.g., Dec 2023 or Present"
                          disabled={exp.currently_working}
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Job Description"
                          value={exp.job_description}
                          onChange={(e) => updateItem('experience', index, 'job_description', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Responsibilities"
                          value={exp.responsibilities}
                          onChange={(e) => updateItem('experience', index, 'responsibilities', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Achievements"
                          value={exp.achievements}
                          onChange={(e) => updateItem('experience', index, 'achievements', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addItem('experience', experienceTemplate)}
                  variant="outlined"
                  sx={{ color: '#fff', borderColor: '#fff' }}
                >
                  Add Experience
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 4️⃣ Skills */}
          <Accordion sx={{ mb: 2, backgroundColor: '#1a1a1a' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <Typography variant="h6">4️⃣ Skills</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {formData.skills.map((skill, index) => (
                  <Card key={skill.id} sx={{ backgroundColor: '#2a2a2a', p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          label="Skill Name"
                          value={skill.skill_name}
                          onChange={(e) => updateItem('skills', index, 'skill_name', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          select
                          fullWidth
                          label="Skill Level"
                          value={skill.skill_level}
                          onChange={(e) => updateItem('skills', index, 'skill_level', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        >
                          {SKILL_LEVELS.map(level => (
                            <MenuItem key={level} value={level}>{level}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          select
                          fullWidth
                          label="Category"
                          value={skill.skill_category}
                          onChange={(e) => updateItem('skills', index, 'skill_category', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        >
                          {SKILL_CATEGORIES.map(cat => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton onClick={() => deleteItem('skills', index)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addItem('skills', skillTemplate)}
                  variant="outlined"
                  sx={{ color: '#fff', borderColor: '#fff' }}
                >
                  Add Skill
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 5️⃣ Projects */}
          <Accordion sx={{ mb: 2, backgroundColor: '#1a1a1a' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <Typography variant="h6">5️⃣ Projects</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {formData.projects.map((proj, index) => (
                  <Card key={proj.id} sx={{ backgroundColor: '#2a2a2a', p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">Project {index + 1}</Typography>
                          <IconButton onClick={() => deleteItem('projects', index)} size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Project Title"
                          value={proj.project_title}
                          onChange={(e) => updateItem('projects', index, 'project_title', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Project Description"
                          value={proj.project_description}
                          onChange={(e) => updateItem('projects', index, 'project_description', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Technologies Used (comma-separated)"
                          value={proj.technologies_used}
                          onChange={(e) => updateItem('projects', index, 'technologies_used', e.target.value)}
                          size="small"
                          placeholder="React, Node.js, MongoDB"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Project Link"
                          value={proj.project_link}
                          onChange={(e) => updateItem('projects', index, 'project_link', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="GitHub Repository"
                          value={proj.github_repository}
                          onChange={(e) => updateItem('projects', index, 'github_repository', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Start Date"
                          value={proj.start_date}
                          onChange={(e) => updateItem('projects', index, 'start_date', e.target.value)}
                          size="small"
                          placeholder="e.g., Jan 2023"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="End Date"
                          value={proj.end_date}
                          onChange={(e) => updateItem('projects', index, 'end_date', e.target.value)}
                          size="small"
                          placeholder="e.g., Mar 2023"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addItem('projects', projectTemplate)}
                  variant="outlined"
                  sx={{ color: '#fff', borderColor: '#fff' }}
                >
                  Add Project
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 6️⃣ Certifications */}
          <Accordion sx={{ mb: 2, backgroundColor: '#1a1a1a' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <Typography variant="h6">6️⃣ Certifications</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {formData.certifications.map((cert, index) => (
                  <Card key={cert.id} sx={{ backgroundColor: '#2a2a2a', p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">Certification {index + 1}</Typography>
                          <IconButton onClick={() => deleteItem('certifications', index)} size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Certification Name"
                          value={cert.certification_name}
                          onChange={(e) => updateItem('certifications', index, 'certification_name', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Issuing Organization"
                          value={cert.issuing_organization}
                          onChange={(e) => updateItem('certifications', index, 'issuing_organization', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Issue Date"
                          value={cert.issue_date}
                          onChange={(e) => updateItem('certifications', index, 'issue_date', e.target.value)}
                          size="small"
                          placeholder="e.g., Jan 2023"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Expiration Date"
                          value={cert.expiration_date}
                          onChange={(e) => updateItem('certifications', index, 'expiration_date', e.target.value)}
                          size="small"
                          placeholder="e.g., Jan 2026 or N/A"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Credential ID"
                          value={cert.credential_id}
                          onChange={(e) => updateItem('certifications', index, 'credential_id', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Credential URL"
                          value={cert.credential_url}
                          onChange={(e) => updateItem('certifications', index, 'credential_url', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addItem('certifications', certificationTemplate)}
                  variant="outlined"
                  sx={{ color: '#fff', borderColor: '#fff' }}
                >
                  Add Certification
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 7️⃣ Achievements/Awards */}
          <Accordion sx={{ mb: 2, backgroundColor: '#1a1a1a' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <Typography variant="h6">7️⃣ Achievements / Awards</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {formData.achievements.map((ach, index) => (
                  <Card key={ach.id} sx={{ backgroundColor: '#2a2a2a', p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">Achievement {index + 1}</Typography>
                          <IconButton onClick={() => deleteItem('achievements', index)} size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Award Title"
                          value={ach.award_title}
                          onChange={(e) => updateItem('achievements', index, 'award_title', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Issuer"
                          value={ach.issuer}
                          onChange={(e) => updateItem('achievements', index, 'issuer', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date"
                          value={ach.date}
                          onChange={(e) => updateItem('achievements', index, 'date', e.target.value)}
                          size="small"
                          placeholder="e.g., Dec 2023"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Description"
                          value={ach.description}
                          onChange={(e) => updateItem('achievements', index, 'description', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addItem('achievements', achievementTemplate)}
                  variant="outlined"
                  sx={{ color: '#fff', borderColor: '#fff' }}
                >
                  Add Achievement
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 8️⃣ Languages */}
          <Accordion sx={{ mb: 2, backgroundColor: '#1a1a1a' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <Typography variant="h6">8️⃣ Languages</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {formData.languages.map((lang, index) => (
                  <Card key={lang.id} sx={{ backgroundColor: '#2a2a2a', p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          label="Language Name"
                          value={lang.language_name}
                          onChange={(e) => updateItem('languages', index, 'language_name', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Proficiency Level"
                          value={lang.proficiency_level}
                          onChange={(e) => updateItem('languages', index, 'proficiency_level', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        >
                          {PROFICIENCY_LEVELS.map(level => (
                            <MenuItem key={level} value={level}>{level}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton onClick={() => deleteItem('languages', index)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addItem('languages', languageTemplate)}
                  variant="outlined"
                  sx={{ color: '#fff', borderColor: '#fff' }}
                >
                  Add Language
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 9️⃣ Interests/Hobbies */}
          <Accordion sx={{ mb: 2, backgroundColor: '#1a1a1a' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <Typography variant="h6">9️⃣ Interests / Hobbies</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {formData.interests.map((interest, index) => (
                  <Card key={interest.id} sx={{ backgroundColor: '#2a2a2a', p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          label="Interest Name"
                          value={interest.interest_name}
                          onChange={(e) => updateItem('interests', index, 'interest_name', e.target.value)}
                          size="small"
                          sx={{ backgroundColor: '#333' }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton onClick={() => deleteItem('interests', index)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addItem('interests', interestTemplate)}
                  variant="outlined"
                  sx={{ color: '#fff', borderColor: '#fff' }}
                >
                  Add Interest
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* 🔟 Additional Sections */}
          <Accordion sx={{ mb: 2, backgroundColor: '#1a1a1a' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              <Typography variant="h6">🔟 Additional Sections (Optional)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                {/* Volunteer Experience */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Volunteer Experience</Typography>
                  <Stack spacing={2}>
                    {formData.volunteer_experience.map((vol, index) => (
                      <Card key={vol.id} sx={{ backgroundColor: '#2a2a2a', p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton onClick={() => deleteItem('volunteer_experience', index)} size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Organization" value={vol.organization} onChange={(e) => updateItem('volunteer_experience', index, 'organization', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Role" value={vol.role} onChange={(e) => updateItem('volunteer_experience', index, 'role', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Start Date" value={vol.start_date} onChange={(e) => updateItem('volunteer_experience', index, 'start_date', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="End Date" value={vol.end_date} onChange={(e) => updateItem('volunteer_experience', index, 'end_date', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth multiline rows={2} label="Description" value={vol.description} onChange={(e) => updateItem('volunteer_experience', index, 'description', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => addItem('volunteer_experience', volunteerTemplate)} variant="outlined" size="small" sx={{ color: '#fff', borderColor: '#fff' }}>
                      Add Volunteer Experience
                    </Button>
                  </Stack>
                </Box>

                {/* Publications */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Publications</Typography>
                  <Stack spacing={2}>
                    {formData.publications.map((pub, index) => (
                      <Card key={pub.id} sx={{ backgroundColor: '#2a2a2a', p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton onClick={() => deleteItem('publications', index)} size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth label="Title" value={pub.title} onChange={(e) => updateItem('publications', index, 'title', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Publication" value={pub.publication} onChange={(e) => updateItem('publications', index, 'publication', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Date" value={pub.date} onChange={(e) => updateItem('publications', index, 'date', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Authors" value={pub.authors} onChange={(e) => updateItem('publications', index, 'authors', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Link" value={pub.link} onChange={(e) => updateItem('publications', index, 'link', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => addItem('publications', publicationTemplate)} variant="outlined" size="small" sx={{ color: '#fff', borderColor: '#fff' }}>
                      Add Publication
                    </Button>
                  </Stack>
                </Box>

                {/* Extracurricular Activities */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Extracurricular Activities</Typography>
                  <Stack spacing={2}>
                    {formData.extracurricular_activities.map((extra, index) => (
                      <Card key={extra.id} sx={{ backgroundColor: '#2a2a2a', p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton onClick={() => deleteItem('extracurricular_activities', index)} size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Activity" value={extra.activity} onChange={(e) => updateItem('extracurricular_activities', index, 'activity', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Role" value={extra.role} onChange={(e) => updateItem('extracurricular_activities', index, 'role', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Duration" value={extra.duration} onChange={(e) => updateItem('extracurricular_activities', index, 'duration', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField fullWidth multiline rows={2} label="Description" value={extra.description} onChange={(e) => updateItem('extracurricular_activities', index, 'description', e.target.value)} size="small" sx={{ backgroundColor: '#333' }} />
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => addItem('extracurricular_activities', extracurricularTemplate)} variant="outlined" size="small" sx={{ color: '#fff', borderColor: '#fff' }}>
                      Add Extracurricular Activity
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Generate Button */}
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DescriptionIcon />}
              onClick={handleGenerateLatex}
              disabled={loading}
              sx={{
                backgroundColor: '#c73835',
                '&:hover': { backgroundColor: '#a02d2a' },
                px: 6,
                py: 2,
                fontSize: '1.1rem'
              }}
            >
              {loading ? 'Generating...' : 'Generate LaTeX Resume'}
            </Button>
          </Box>

          {/* LaTeX Output */}
          {latexOutput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ backgroundColor: '#ffffff', p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Generated LaTeX Code</Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadLatex}
                    sx={{ backgroundColor: '#c73835', '&:hover': { backgroundColor: '#a02d2a' } }}
                  >
                    Download .tex File
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={20}
                  value={latexOutput}
                  InputProps={{ readOnly: true }}
                  sx={{
                    backgroundColor: '#ffffff',
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '0.85rem'
                    }
                  }}
                />
              </Card>
            </motion.div>
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

export default ComprehensiveResumeForm;
