import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  Grid,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAPI } from '../services/api';

const SKILL_CATEGORIES = ['Programming', 'Tools', 'Soft Skills', 'Technical', 'Other'];
const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Fluent', 'Native'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];

const steps = [
  'Personal Info',
  'Education',
  'Experience',
  'Projects',
  'Skills & Languages',
  'Review & Extras'
];

const ComprehensiveResumeForm = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [latexOutput, setLatexOutput] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
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
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    interests: [],
    volunteer_experience: [],
    publications: [],
    extracurricular_activities: []
  });

  const handlePersonalInfoChange = (field, value) => {
    setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const addItem = (section, template) => {
    setFormData(prev => ({ ...prev, [section]: [...prev[section], { ...template, id: Date.now() }] }));
  };

  const updateItem = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const deleteItem = (section, index) => {
    setFormData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
  };

  const educationTemplate = { institution_name: '', degree: '', field_of_study: '', education_location: '', start_date: '', end_date: '', grade: '', description: '' };
  const experienceTemplate = { company_name: '', job_title: '', employment_type: '', location: '', start_date: '', end_date: '', currently_working: false, job_description: '', responsibilities: '', achievements: '' };
  const skillTemplate = { skill_name: '', skill_level: '', skill_category: '' };
  const projectTemplate = { project_title: '', project_description: '', technologies_used: '', project_link: '', github_repository: '', start_date: '', end_date: '' };
  const certificationTemplate = { certification_name: '', issuing_organization: '', issue_date: '', expiration_date: '', credential_id: '', credential_url: '' };
  const achievementTemplate = { award_title: '', issuer: '', date: '', description: '' };
  const languageTemplate = { language_name: '', proficiency_level: '' };
  const interestTemplate = { interest_name: '' };
  const volunteerTemplate = { organization: '', role: '', start_date: '', end_date: '', description: '' };
  const publicationTemplate = { title: '', publication: '', date: '', authors: '', link: '' };
  const extracurricularTemplate = { activity: '', role: '', description: '', duration: '' };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateLatex = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

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
          if (!acc[skill.skill_category]) acc[skill.skill_category] = [];
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Personal Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" value={formData.personalInfo.first_name} onChange={(e) => handlePersonalInfoChange('first_name', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" value={formData.personalInfo.last_name} onChange={(e) => handlePersonalInfoChange('last_name', e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Full Name (for document header)" value={formData.personalInfo.full_name} onChange={(e) => handlePersonalInfoChange('full_name', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" type="email" value={formData.personalInfo.email} onChange={(e) => handlePersonalInfoChange('email', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number" value={formData.personalInfo.phone_number} onChange={(e) => handlePersonalInfoChange('phone_number', e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Address" value={formData.personalInfo.address} onChange={(e) => handlePersonalInfoChange('address', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="City" value={formData.personalInfo.city} onChange={(e) => handlePersonalInfoChange('city', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="State" value={formData.personalInfo.state} onChange={(e) => handlePersonalInfoChange('state', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Country" value={formData.personalInfo.country} onChange={(e) => handlePersonalInfoChange('country', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="LinkedIn URL" value={formData.personalInfo.linkedin_url} onChange={(e) => handlePersonalInfoChange('linkedin_url', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="GitHub URL" value={formData.personalInfo.github_url} onChange={(e) => handlePersonalInfoChange('github_url', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Portfolio / Website URL" value={formData.personalInfo.portfolio_url} onChange={(e) => handlePersonalInfoChange('portfolio_url', e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={4} label="Professional Summary" value={formData.personalInfo.professional_summary} onChange={(e) => handlePersonalInfoChange('professional_summary', e.target.value)} />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Education History</Typography>
            <Stack spacing={3}>
              <AnimatePresence>
                {formData.education.map((edu, index) => (
                  <motion.div key={edu.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
                    <Card sx={{ p: 3, border: '1px solid #e2e8f0', boxShadow: 'none', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" color="primary">Education #{index + 1}</Typography>
                        <IconButton onClick={() => deleteItem('education', index)} color="error"><DeleteIcon /></IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Institution Name" value={edu.institution_name} onChange={(e) => updateItem('education', index, 'institution_name', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Degree" value={edu.degree} onChange={(e) => updateItem('education', index, 'degree', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Field of Study" value={edu.field_of_study} onChange={(e) => updateItem('education', index, 'field_of_study', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Location" value={edu.education_location} onChange={(e) => updateItem('education', index, 'education_location', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField fullWidth label="Start Date" value={edu.start_date} placeholder="Aug 2018" onChange={(e) => updateItem('education', index, 'start_date', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField fullWidth label="End Date" value={edu.end_date} placeholder="May 2022" onChange={(e) => updateItem('education', index, 'end_date', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField fullWidth label="Grade/CGPA" value={edu.grade} onChange={(e) => updateItem('education', index, 'grade', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth multiline rows={2} label="Description / Coursework" value={edu.description} onChange={(e) => updateItem('education', index, 'description', e.target.value)} />
                        </Grid>
                      </Grid>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button startIcon={<AddIcon />} onClick={() => addItem('education', educationTemplate)} variant="outlined" sx={{ py: 1.5, borderStyle: 'dashed' }}>
                Add New Education
              </Button>
            </Stack>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Work Experience</Typography>
            <Stack spacing={3}>
              <AnimatePresence>
                {formData.experience.map((exp, index) => (
                  <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
                    <Card sx={{ p: 3, border: '1px solid #e2e8f0', boxShadow: 'none', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" color="primary">Experience #{index + 1}</Typography>
                        <IconButton onClick={() => deleteItem('experience', index)} color="error"><DeleteIcon /></IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Company Name" value={exp.company_name} onChange={(e) => updateItem('experience', index, 'company_name', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Job Title" value={exp.job_title} onChange={(e) => updateItem('experience', index, 'job_title', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField select fullWidth label="Employment Type" value={exp.employment_type} onChange={(e) => updateItem('experience', index, 'employment_type', e.target.value)}>
                            {EMPLOYMENT_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Location" value={exp.location} onChange={(e) => updateItem('experience', index, 'location', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Start Date" value={exp.start_date} placeholder="e.g. Jan 2022" onChange={(e) => updateItem('experience', index, 'start_date', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="End Date" value={exp.end_date} placeholder="e.g. Present" onChange={(e) => updateItem('experience', index, 'end_date', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth multiline rows={3} label="Job Description & Responsibilities" value={exp.job_description} onChange={(e) => updateItem('experience', index, 'job_description', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth multiline rows={3} label="Key Achievements" placeholder="- Increased sales by 20%..." value={exp.achievements} onChange={(e) => updateItem('experience', index, 'achievements', e.target.value)} />
                        </Grid>
                      </Grid>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button startIcon={<AddIcon />} onClick={() => addItem('experience', experienceTemplate)} variant="outlined" sx={{ py: 1.5, borderStyle: 'dashed' }}>
                Add New Experience
              </Button>
            </Stack>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Projects</Typography>
            <Stack spacing={3}>
              <AnimatePresence>
                {formData.projects.map((proj, index) => (
                  <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
                    <Card sx={{ p: 3, border: '1px solid #e2e8f0', boxShadow: 'none', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" color="primary">Project #{index + 1}</Typography>
                        <IconButton onClick={() => deleteItem('projects', index)} color="error"><DeleteIcon /></IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField fullWidth label="Project Title" value={proj.project_title} onChange={(e) => updateItem('projects', index, 'project_title', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth multiline rows={3} label="Project Description" value={proj.project_description} onChange={(e) => updateItem('projects', index, 'project_description', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth label="Technologies Used (comma-separated)" value={proj.technologies_used} onChange={(e) => updateItem('projects', index, 'technologies_used', e.target.value)} placeholder="React, Node, MongoDB" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Live Link" value={proj.project_link} onChange={(e) => updateItem('projects', index, 'project_link', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="GitHub Repo" value={proj.github_repository} onChange={(e) => updateItem('projects', index, 'github_repository', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Start Date" value={proj.start_date} onChange={(e) => updateItem('projects', index, 'start_date', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="End Date" value={proj.end_date} onChange={(e) => updateItem('projects', index, 'end_date', e.target.value)} />
                        </Grid>
                      </Grid>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button startIcon={<AddIcon />} onClick={() => addItem('projects', projectTemplate)} variant="outlined" sx={{ py: 1.5, borderStyle: 'dashed' }}>
                Add New Project
              </Button>
            </Stack>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Skills & Languages</Typography>
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Technical Setup</Typography>
            <Stack spacing={2} sx={{ mb: 4 }}>
              <AnimatePresence>
                {formData.skills.map((skill, index) => (
                  <motion.div key={skill.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Skill Name" value={skill.skill_name} onChange={(e) => updateItem('skills', index, 'skill_name', e.target.value)} />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField select fullWidth label="Skill Level" value={skill.skill_level} onChange={(e) => updateItem('skills', index, 'skill_level', e.target.value)}>
                          {SKILL_LEVELS.map(level => <MenuItem key={level} value={level}>{level}</MenuItem>)}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField select fullWidth label="Category" value={skill.skill_category} onChange={(e) => updateItem('skills', index, 'skill_category', e.target.value)}>
                          {SKILL_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton onClick={() => deleteItem('skills', index)} color="error"><DeleteIcon /></IconButton>
                      </Grid>
                    </Grid>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button startIcon={<AddIcon />} onClick={() => addItem('skills', skillTemplate)} variant="text" sx={{ width: 'fit-content' }}>
                Add Skill
              </Button>
            </Stack>

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Languages</Typography>
            <Stack spacing={2}>
              <AnimatePresence>
                {formData.languages.map((lang, index) => (
                  <motion.div key={lang.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Language" value={lang.language_name} onChange={(e) => updateItem('languages', index, 'language_name', e.target.value)} />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField select fullWidth label="Proficiency Level" value={lang.proficiency_level} onChange={(e) => updateItem('languages', index, 'proficiency_level', e.target.value)}>
                          {PROFICIENCY_LEVELS.map(level => <MenuItem key={level} value={level}>{level}</MenuItem>)}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton onClick={() => deleteItem('languages', index)} color="error"><DeleteIcon /></IconButton>
                      </Grid>
                    </Grid>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button startIcon={<AddIcon />} onClick={() => addItem('languages', languageTemplate)} variant="text" sx={{ width: 'fit-content' }}>
                Add Language
              </Button>
            </Stack>
          </Box>
        );
      case 5:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>Review & Additional Sections</Typography>
            <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>Add any certifications, achievements, or volunteer history below, or leave them blank.</Typography>
            
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Certifications</Typography>
                <Stack spacing={2}>
                  {formData.certifications.map((cert, index) => (
                    <Card key={cert.id} sx={{ p: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={11}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Name" value={cert.certification_name} onChange={(e) => updateItem('certifications', index, 'certification_name', e.target.value)} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Issuer" value={cert.issuing_organization} onChange={(e) => updateItem('certifications', index, 'issuing_organization', e.target.value)} /></Grid>
                            <Grid item xs={12} sm={4}><TextField fullWidth size="small" label="Issue Date" value={cert.issue_date} onChange={(e) => updateItem('certifications', index, 'issue_date', e.target.value)} /></Grid>
                            <Grid item xs={12} sm={8}><TextField fullWidth size="small" label="URL / Credential ID" value={cert.credential_url} onChange={(e) => updateItem('certifications', index, 'credential_url', e.target.value)} /></Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton onClick={() => deleteItem('certifications', index)} color="error"><DeleteIcon /></IconButton>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                  <Button startIcon={<AddIcon />} onClick={() => addItem('certifications', certificationTemplate)} variant="text">Add Certification</Button>
                </Stack>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Achievements</Typography>
                <Stack spacing={2}>
                  {formData.achievements.map((ach, index) => (
                    <Card key={ach.id} sx={{ p: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                      <Grid container spacing={2}>
                         <Grid item xs={11}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}><TextField fullWidth size="small" label="Title" value={ach.award_title} onChange={(e) => updateItem('achievements', index, 'award_title', e.target.value)} /></Grid>
                            <Grid item xs={12} sm={4}><TextField fullWidth size="small" label="Date" value={ach.date} onChange={(e) => updateItem('achievements', index, 'date', e.target.value)} /></Grid>
                            <Grid item xs={12}><TextField fullWidth size="small" multiline rows={2} label="Description" value={ach.description} onChange={(e) => updateItem('achievements', index, 'description', e.target.value)} /></Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton onClick={() => deleteItem('achievements', index)} color="error"><DeleteIcon /></IconButton>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                  <Button startIcon={<AddIcon />} onClick={() => addItem('achievements', achievementTemplate)} variant="text">Add Achievement</Button>
                </Stack>
              </Box>

            </Stack>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      py: { xs: 4, md: 8 },
      px: { xs: 2, md: 4 },
      '& .MuiTextField-root .MuiOutlinedInput-root': {
        transition: 'all 0.2s',
        backgroundColor: '#fff',
        borderRadius: 2,
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0f172a', borderWidth: '2px' }
      },
      '& .MuiInputLabel-root.Mui-focused': { color: '#0f172a' }
    }}>
      
      {onBack && (
        <Box sx={{ maxWidth: '900px', mx: 'auto', mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ color: '#475569', '&:hover': { backgroundColor: '#f1f5f9' }, textTransform: 'none', fontWeight: 600 }}>
            Back to Dashboard
          </Button>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ maxWidth: '900px', mx: 'auto', mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ maxWidth: '900px', mx: 'auto', mb: 2 }}>{success}</Alert>}

      <Card sx={{ maxWidth: '900px', mx: 'auto', borderRadius: 4, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', overflow: 'hidden', backgroundColor: '#fff' }}>
        
        {/* Stepper Header */}
        <Box sx={{ backgroundColor: '#fff', p: 4, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 4, color: '#0f172a' }}>
            Resume Wizard
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel={!isMobile} orientation={isMobile ? 'vertical' : 'horizontal'}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Dynamic Step Content */}
        <Box sx={{ minHeight: '400px', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent(activeStep)}
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Action Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBackStep}
            sx={{ fontWeight: 600, px: 4, py: 1.5, borderRadius: 2 }}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleGenerateLatex}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DescriptionIcon />}
              sx={{ backgroundColor: '#c73835', '&:hover': { backgroundColor: '#a02d2a' }, fontWeight: 700, px: 4, py: 1.5, borderRadius: 2 }}
            >
              {loading ? 'Compiling...' : 'Generate Resume'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ backgroundColor: '#0f172a', '&:hover': { backgroundColor: '#1e293b' }, fontWeight: 700, px: 6, py: 1.5, borderRadius: 2 }}
            >
              Next Step
            </Button>
          )}
        </Box>
      </Card>

      {/* LaTeX Output Viewer */}
      {latexOutput && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card sx={{ maxWidth: '900px', mx: 'auto', mt: 4, p: 4, borderRadius: 4, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Generated LaTeX Output</Typography>
              <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadLatex} sx={{ backgroundColor: '#0f172a' }}>
                Download .tex
              </Button>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={20}
              value={latexOutput}
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#f1f5f9', '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.85rem' } }}
            />
          </Card>
        </motion.div>
      )}

    </Box>
  );
};

export default ComprehensiveResumeForm;
