import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { motion } from 'framer-motion';

const WhyResumeSection = () => {
  const checklistItems = [
    'Clear contact information',
    'Strong professional summary',
    'Quantified achievements',
    'Clean formatting',
    'ATS-friendly keywords',
    'Relevant skills section',
    'Impact-driven work experience',
    'Education and certifications'
  ];

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
    <Box
      sx={{
        backgroundColor: 'white',
        color: 'black',
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
              mb: 4
            }}
          >
            Why a Strong Resume Matters
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography
            variant="body1"
            component="p"
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.8,
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto',
              mb: 6,
              color: 'rgba(0,0,0,0.8)'
            }}
          >
            Recruiters scan resumes in seconds, and ATS systems filter candidates automatically. 
            Structured, keyword-optimized resumes significantly increase your chances of landing 
            interviews by standing out in both human and automated reviews.
          </Typography>
        </motion.div>

        <Grid container spacing={3} justifyContent="center">
          {checklistItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <motion.div
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 }
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircleOutline
                        sx={{
                          color: 'black',
                          mr: 2,
                          fontSize: '1.5rem'
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: '1rem',
                          fontWeight: '500',
                          lineHeight: 1.4
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default WhyResumeSection;
