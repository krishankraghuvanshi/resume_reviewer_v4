import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Add as AddIcon, CloudUpload as UploadIcon } from '@mui/icons-material';

const HeroSection = ({ onCreateResume, onUploadResume }) => {

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background effects */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)',
          zIndex: 1
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            zIndex: 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Gradient overlay animation */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.03) 60deg, transparent 120deg, rgba(255,255,255,0.03) 180deg, transparent 240deg, rgba(255,255,255,0.03) 300deg, transparent 360deg)',
          zIndex: 1,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Subtle mesh gradient */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.03) 0%, transparent 50%)
          `,
          zIndex: 1,
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          textAlign: 'center',
          zIndex: 2,
          maxWidth: '800px',
          px: 4
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
              fontWeight: 'bold',
              mb: 3,
              lineHeight: 1.2
            }}
          >
            Build Resumes That{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(to right, #6366f1, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Get Interviews
            </Box>
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              mb: 5,
              lineHeight: 1.6,
              opacity: 0.9,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Create, analyze and improve your resume with ATS-aware insights and intelligent feedback.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                onClick={onCreateResume}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 2
                }}
              >
                Create from Scratch
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                startIcon={<UploadIcon />}
                onClick={onUploadResume}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                  }
                }}
              >
                Upload Existing Resume
              </Button>
            </motion.div>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default HeroSection;
