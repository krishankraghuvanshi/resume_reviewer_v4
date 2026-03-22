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
  Chip,
  Collapse,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  EmojiEvents as EmojiEventsIcon,
  Book as BookIcon,
  Psychology as PsychologyIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ResumeBuilder = ({ onBack }) => {
  const [formData, setFormData] = useState({
    personalDetails: {
      fullName: '',
      email: '',
      linkedinUrl: '',
      githubUrl: '',
      leetcodeUrl: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: '',
    achievements: [],
    courses: ''
  });

  const [expandedSections, setExpandedSections] = useState({
    education: true,
    experience: true,
    projects: true,
    achievements: true
  });

  // Personal Details Handlers
  const handlePersonalDetailsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  // Education Handlers
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        institution: '',
        degree: '',
        dates: '',
        bulletPoints: ['']
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducationBulletPoint = (eduIndex) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === eduIndex
          ? { ...edu, bulletPoints: [...edu.bulletPoints, ''] }
          : edu
      )
    }));
  };

  const updateEducationBulletPoint = (eduIndex, bulletIndex, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === eduIndex
          ? {
              ...edu,
              bulletPoints: edu.bulletPoints.map((bullet, j) =>
                j === bulletIndex ? value : bullet
              )
            }
          : edu
      )
    }));
  };

  const removeEducationBulletPoint = (eduIndex, bulletIndex) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === eduIndex
          ? {
              ...edu,
              bulletPoints: edu.bulletPoints.filter((_, j) => j !== bulletIndex)
            }
          : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Experience Handlers
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        company: '',
        role: '',
        dates: '',
        bulletPoints: ['']
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperienceBulletPoint = (expIndex) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex
          ? { ...exp, bulletPoints: [...exp.bulletPoints, ''] }
          : exp
      )
    }));
  };

  const updateExperienceBulletPoint = (expIndex, bulletIndex, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              bulletPoints: exp.bulletPoints.map((bullet, j) =>
                j === bulletIndex ? value : bullet
              )
            }
          : exp
      )
    }));
  };

  const removeExperienceBulletPoint = (expIndex, bulletIndex) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              bulletPoints: exp.bulletPoints.filter((_, j) => j !== bulletIndex)
            }
          : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Projects Handlers
  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now(),
        title: '',
        technologies: '',
        bulletPoints: ['']
      }]
    }));
  };

  const updateProject = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addProjectBulletPoint = (projectIndex) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === projectIndex
          ? { ...project, bulletPoints: [...project.bulletPoints, ''] }
          : project
      )
    }));
  };

  const updateProjectBulletPoint = (projectIndex, bulletIndex, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              bulletPoints: project.bulletPoints.map((bullet, j) =>
                j === bulletIndex ? value : bullet
              )
            }
          : project
      )
    }));
  };

  const removeProjectBulletPoint = (projectIndex, bulletIndex) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              bulletPoints: project.bulletPoints.filter((_, j) => j !== bulletIndex)
            }
          : project
      )
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Achievements Handlers
  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const updateAchievement = (index, value) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) =>
        i === index ? value : achievement
      )
    }));
  };

  const removeAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: 'black', color: 'white' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Resume Builder
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundColor: 'white',
          color: 'black',
          py: { xs: 6, md: 10 },
          px: { xs: 3, md: 6 }
        }}
      >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 6
            }}
          >
            Resume Builder
          </Typography>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} lg={10} xl={8}>
            {/* Personal Details Section */}
            <motion.div variants={itemVariants}>
              <Card sx={{ mb: 4, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PsychologyIcon sx={{ mr: 2, fontSize: '2rem', color: 'black' }} />
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                      Personal Details
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={formData.personalDetails.fullName}
                        onChange={(e) => handlePersonalDetailsChange('fullName', e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.personalDetails.email}
                        onChange={(e) => handlePersonalDetailsChange('email', e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="LinkedIn URL"
                        value={formData.personalDetails.linkedinUrl}
                        onChange={(e) => handlePersonalDetailsChange('linkedinUrl', e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="GitHub URL"
                        value={formData.personalDetails.githubUrl}
                        onChange={(e) => handlePersonalDetailsChange('githubUrl', e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="LeetCode URL"
                        value={formData.personalDetails.leetcodeUrl}
                        onChange={(e) => handlePersonalDetailsChange('leetcodeUrl', e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>

            {/* Education Section */}
            <motion.div variants={itemVariants}>
              <Card sx={{ mb: 4, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon sx={{ mr: 2, fontSize: '2rem', color: 'black' }} />
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                        Education
                      </Typography>
                    </Box>
                    <IconButton onClick={() => toggleSection('education')}>
                      {expandedSections.education ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedSections.education}>
                    {formData.education.map((edu, eduIndex) => (
                      <Box key={edu.id} sx={{ mb: 3, p: 3, border: '1px solid rgba(0,0,0,0.05)', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: '600' }}>
                            Education Entry {eduIndex + 1}
                          </Typography>
                          <IconButton onClick={() => removeEducation(eduIndex)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Institution"
                              value={edu.institution}
                              onChange={(e) => updateEducation(eduIndex, 'institution', e.target.value)}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Degree"
                              value={edu.degree}
                              onChange={(e) => updateEducation(eduIndex, 'degree', e.target.value)}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Dates"
                              placeholder="e.g., 2018 - 2022"
                              value={edu.dates}
                              onChange={(e) => updateEducation(eduIndex, 'dates', e.target.value)}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: '600' }}>
                            Coursework & Honors
                          </Typography>
                          {edu.bulletPoints.map((bullet, bulletIndex) => (
                            <Box key={bulletIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <TextField
                                fullWidth
                                placeholder="• Enter coursework or honor..."
                                value={bullet}
                                onChange={(e) => updateEducationBulletPoint(eduIndex, bulletIndex, e.target.value)}
                                variant="outlined"
                                size="small"
                              />
                              {edu.bulletPoints.length > 1 && (
                                <IconButton
                                  onClick={() => removeEducationBulletPoint(eduIndex, bulletIndex)}
                                  size="small"
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => addEducationBulletPoint(eduIndex)}
                            sx={{ mt: 1 }}
                            variant="outlined"
                            size="small"
                          >
                            Add Bullet Point
                          </Button>
                        </Box>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addEducation}
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Add Education
                    </Button>
                  </Collapse>
                </CardContent>
              </Card>
            </motion.div>

            {/* Experience Section */}
            <motion.div variants={itemVariants}>
              <Card sx={{ mb: 4, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WorkIcon sx={{ mr: 2, fontSize: '2rem', color: 'black' }} />
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                        Experience
                      </Typography>
                    </Box>
                    <IconButton onClick={() => toggleSection('experience')}>
                      {expandedSections.experience ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedSections.experience}>
                    {formData.experience.map((exp, expIndex) => (
                      <Box key={exp.id} sx={{ mb: 3, p: 3, border: '1px solid rgba(0,0,0,0.05)', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: '600' }}>
                            Experience Entry {expIndex + 1}
                          </Typography>
                          <IconButton onClick={() => removeExperience(expIndex)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Company"
                              value={exp.company}
                              onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Role"
                              value={exp.role}
                              onChange={(e) => updateExperience(expIndex, 'role', e.target.value)}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Dates"
                              placeholder="e.g., Jan 2022 - Present"
                              value={exp.dates}
                              onChange={(e) => updateExperience(expIndex, 'dates', e.target.value)}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: '600' }}>
                            Responsibilities & Achievements
                          </Typography>
                          {exp.bulletPoints.map((bullet, bulletIndex) => (
                            <Box key={bulletIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <TextField
                                fullWidth
                                placeholder="• Describe your responsibility or achievement..."
                                value={bullet}
                                onChange={(e) => updateExperienceBulletPoint(expIndex, bulletIndex, e.target.value)}
                                variant="outlined"
                                size="small"
                              />
                              {exp.bulletPoints.length > 1 && (
                                <IconButton
                                  onClick={() => removeExperienceBulletPoint(expIndex, bulletIndex)}
                                  size="small"
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => addExperienceBulletPoint(expIndex)}
                            sx={{ mt: 1 }}
                            variant="outlined"
                            size="small"
                          >
                            Add Bullet Point
                          </Button>
                        </Box>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addExperience}
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Add Experience
                    </Button>
                  </Collapse>
                </CardContent>
              </Card>
            </motion.div>

            {/* Projects Section */}
            <motion.div variants={itemVariants}>
              <Card sx={{ mb: 4, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CodeIcon sx={{ mr: 2, fontSize: '2rem', color: 'black' }} />
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                        Projects
                      </Typography>
                    </Box>
                    <IconButton onClick={() => toggleSection('projects')}>
                      {expandedSections.projects ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedSections.projects}>
                    {formData.projects.map((project, projectIndex) => (
                      <Box key={project.id} sx={{ mb: 3, p: 3, border: '1px solid rgba(0,0,0,0.05)', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: '600' }}>
                            Project {projectIndex + 1}
                          </Typography>
                          <IconButton onClick={() => removeProject(projectIndex)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Project Title"
                              value={project.title}
                              onChange={(e) => updateProject(projectIndex, 'title', e.target.value)}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Technologies"
                              placeholder="e.g., React, Node.js, MongoDB"
                              value={project.technologies}
                              onChange={(e) => updateProject(projectIndex, 'technologies', e.target.value)}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: '600' }}>
                            Project Details
                          </Typography>
                          {project.bulletPoints.map((bullet, bulletIndex) => (
                            <Box key={bulletIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <TextField
                                fullWidth
                                placeholder="• Describe project feature or achievement..."
                                value={bullet}
                                onChange={(e) => updateProjectBulletPoint(projectIndex, bulletIndex, e.target.value)}
                                variant="outlined"
                                size="small"
                              />
                              {project.bulletPoints.length > 1 && (
                                <IconButton
                                  onClick={() => removeProjectBulletPoint(projectIndex, bulletIndex)}
                                  size="small"
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => addProjectBulletPoint(projectIndex)}
                            sx={{ mt: 1 }}
                            variant="outlined"
                            size="small"
                          >
                            Add Bullet Point
                          </Button>
                        </Box>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addProject}
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Add Project
                    </Button>
                  </Collapse>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills Section */}
            <motion.div variants={itemVariants}>
              <Card sx={{ mb: 4, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PsychologyIcon sx={{ mr: 2, fontSize: '2rem', color: 'black' }} />
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                      Skills
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Technical Skills"
                    placeholder="List your technical proficiencies separated by commas..."
                    value={formData.skills}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements Section */}
            <motion.div variants={itemVariants}>
              <Card sx={{ mb: 4, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmojiEventsIcon sx={{ mr: 2, fontSize: '2rem', color: 'black' }} />
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                        Achievements
                      </Typography>
                    </Box>
                    <IconButton onClick={() => toggleSection('achievements')}>
                      {expandedSections.achievements ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedSections.achievements}>
                    {formData.achievements.map((achievement, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          fullWidth
                          placeholder="• Describe your achievement..."
                          value={achievement}
                          onChange={(e) => updateAchievement(index, e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                        <IconButton
                          onClick={() => removeAchievement(index)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addAchievement}
                      variant="contained"
                    >
                      Add Achievement
                    </Button>
                  </Collapse>
                </CardContent>
              </Card>
            </motion.div>

            {/* Courses Section */}
            <motion.div variants={itemVariants}>
              <Card sx={{ mb: 4, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <BookIcon sx={{ mr: 2, fontSize: '2rem', color: 'black' }} />
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                      Courses & Certifications
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Courses & Certifications"
                    placeholder="List relevant courses, certifications, or completed training programs..."
                    value={formData.courses}
                    onChange={(e) => setFormData(prev => ({ ...prev, courses: e.target.value }))}
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.8)'
                    }
                  }}
                >
                  Save Resume
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'black',
                    color: 'black',
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    textTransform: 'none',
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'black',
                      backgroundColor: 'rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  Preview Resume
                </Button>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
      </Box>
    </>
  );
};

export default ResumeBuilder;
