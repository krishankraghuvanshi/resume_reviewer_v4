import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  AutoFixHigh as AutoFixHighIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { resumeAPI } from '../services/api';

const ResumeUploader = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [enhancing, setEnhancing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await resumeAPI.uploadResume(file, email);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadLatex = async () => {
    if (!result?.parsed_resume) return;
    
    setDownloading(true);
    try {
      const blob = await resumeAPI.downloadLatex(result.parsed_resume);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${Date.now()}.tex`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(err.message || 'Failed to download LaTeX');
    } finally {
      setDownloading(false);
    }
  };

  const handleEnhanceResume = async () => {
    if (!result?.parsed_resume) return;
    
    setEnhancing(true);
    try {
      const data = await resumeAPI.enhanceResume(result.parsed_resume);
      setResult(prev => ({
        ...prev,
        enhanced_resume: data.enhanced_resume,
        llm_usage: data.llm_usage
      }));
    } catch (err) {
      setError(err.message || 'Failed to enhance resume');
    } finally {
      setEnhancing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Upload & Review Resume
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ backgroundColor: 'white', py: 6, px: { xs: 3, md: 6 }, minHeight: '100vh' }}>
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          {!result ? (
            <motion.div variants={itemVariants}>
              <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
                  Upload Your Resume
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Card sx={{ p: 4, mb: 4, border: '2px dashed #000' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CloudUploadIcon sx={{ fontSize: 60, mb: 2, color: 'rgba(0,0,0,0.3)' }} />
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id="file-input"
                    />
                    <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block' }}>
                      <Typography variant="h6" sx={{ mb: 2, color: file ? 'green' : 'black' }}>
                        {file ? `✓ ${file.name}` : 'Click to upload PDF'}
                      </Typography>
                    </label>
                    <Typography variant="body2" color="textSecondary">
                      Maximum file size: 2MB
                    </Typography>
                  </Box>
                </Card>

                <TextField
                  fullWidth
                  type="email"
                  label="Email (Optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleUpload}
                  disabled={!file || loading}
                  sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    py: 1.5,
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Upload & Review'}
                </Button>
              </Box>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4 }}>
                  Resume Analysis
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {/* ATS Score */}
                <Card sx={{ mb: 4, backgroundColor: '#f5f5f5' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                      ATS Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 120, height: 120 }}>
                        <CircularProgress
                          variant="determinate"
                          value={result.ats_score?.total_score || 0}
                          size={120}
                          thickness={4}
                        />
                        <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {result.ats_score?.total_score || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            out of 100
                          </Typography>
                        </Box>
                      </Box>
                      {result.ats_score?.breakdown && (
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableBody>
                              {Object.entries(result.ats_score.breakdown).map(([key, value]) => (
                                <TableRow key={key}>
                                  <TableCell sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                    {key.replace(/_/g, ' ')}
                                  </TableCell>
                                  <TableCell align="right">{value}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  </CardContent>
                </Card>

                {/* Parsed Resume */}
                <Card sx={{ mb: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                      Parsed Resume Information
                    </Typography>

                    {result.parsed_resume?.personal_info && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                          Personal Information
                        </Typography>
                        <Grid container spacing={2}>
                          {Object.entries(result.parsed_resume.personal_info).map(([key, value]) =>
                            value ? (
                              <Grid item xs={12} md={6} key={key}>
                                <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                                  {key.replace(/_/g, ' ')}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {typeof value === 'string' ? value : JSON.stringify(value)}
                                </Typography>
                              </Grid>
                            ) : null
                          )}
                        </Grid>
                      </Box>
                    )}

                    {result.parsed_resume?.skills && result.parsed_resume.skills.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                          Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {result.parsed_resume.skills.map((skill, idx) => (
                            <Chip key={idx} label={skill} />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {result.parsed_resume?.experience && result.parsed_resume.experience.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                          Experience
                        </Typography>
                        {result.parsed_resume.experience.map((exp, idx) => (
                          <Box key={idx} sx={{ mb: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {exp.title || exp.role}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {exp.company} • {exp.dates}
                            </Typography>
                            {exp.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {exp.description}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}

                    {result.parsed_resume?.education && result.parsed_resume.education.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                          Education
                        </Typography>
                        {result.parsed_resume.education.map((edu, idx) => (
                          <Box key={idx} sx={{ mb: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {edu.degree}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {edu.institution} • {edu.dates}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Suggestions */}
                {result.suggestions && (
                  <Card sx={{ mb: 4, backgroundColor: '#fff3cd' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                        💡 Improvement Suggestions
                      </Typography>

                      {result.suggestions.general && result.suggestions.general.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            General
                          </Typography>
                          {result.suggestions.general.map((suggestion, idx) => (
                            <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                              • {suggestion}
                            </Typography>
                          ))}
                        </Box>
                      )}

                      {result.suggestions.skills && result.suggestions.skills.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Skills
                          </Typography>
                          {result.suggestions.skills.map((suggestion, idx) => (
                            <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                              • {suggestion}
                            </Typography>
                          ))}
                        </Box>
                      )}

                      {result.suggestions.experience && result.suggestions.experience.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Experience
                          </Typography>
                          {result.suggestions.experience.map((suggestion, idx) => (
                            <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                              • {suggestion}
                            </Typography>
                          ))}
                        </Box>
                      )}

                      {result.suggestions.projects && result.suggestions.projects.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Projects
                          </Typography>
                          {result.suggestions.projects.map((suggestion, idx) => (
                            <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                              • {suggestion}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Enhanced Resume */}
                {result.enhanced_resume && (
                  <Card sx={{ mb: 4, backgroundColor: '#e8f5e9' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                        ✨ AI-Enhanced Resume
                      </Typography>
                      <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {JSON.stringify(result.enhanced_resume, null, 2).substring(0, 500)}...
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadLatex}
                    disabled={downloading}
                    sx={{ backgroundColor: 'black', color: 'white' }}
                  >
                    {downloading ? 'Downloading...' : 'Download as LaTeX'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AutoFixHighIcon />}
                    onClick={handleEnhanceResume}
                    disabled={enhancing}
                    sx={{ borderColor: 'black', color: 'black' }}
                  >
                    {enhancing ? 'Enhancing...' : 'Enhance with AI'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setResult(null);
                      setFile(null);
                    }}
                    sx={{ borderColor: 'black', color: 'black' }}
                  >
                    Upload Another
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Box>
    </>
  );
};

export default ResumeUploader;
