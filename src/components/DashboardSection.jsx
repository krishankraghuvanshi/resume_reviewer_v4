import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import ResumeCard from './ResumeCard';
import { dashboardAPI } from '../services/api';

const DEFAULT_FILTERS = {
  sort: 'ats_score',
  order: 'desc',
  limit: 10,
  offset: 0
};

const DashboardSection = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await dashboardAPI.getResumes(DEFAULT_FILTERS);
        setResumes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load resumes');
        setResumes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'black',
        color: 'white',
        py: { xs: 8, md: 12 },
        px: { xs: 4, md: 8 }
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 6
            }}
          >
            {resumes.length > 0 ? 'Top Performing Resumes' : 'No Resumes Yet'}
          </Typography>
        </motion.div>

        <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, color: 'white', backgroundColor: 'rgba(255,0,0,0.2)' }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          ) : resumes.length > 0 ? (
            resumes.map((resume, index) => (
              <Box key={resume.resume_id || index} sx={{ mb: 2 }}>
                <motion.div variants={itemVariants}>
                  <ResumeCard resume={resume} />
                </motion.div>
              </Box>
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
              Upload your first resume to see it here!
            </Typography>
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

export default DashboardSection;
