import React from 'react';
import { Box, Typography, LinearProgress, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

const ResumeCard = ({ resume }) => {

  // Generate color based on email
  const getAvatarColor = (email) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    const hash = email.charCodeAt(0) + email.charCodeAt(email.length - 1);
    return colors[hash % colors.length];
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const email = resume.email || 'Unknown';
  const name = resume.name || 'Unknown Resume';
  const score = resume.ats_score || 0;
  const initials = getInitials(name);
  const avatarColor = resume.avatar_url ? undefined : getAvatarColor(email);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 2,
          p: 3,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.08)'
          }
        }}
      >
        {/* Person thumbnail */}
        <Avatar
          sx={{
            width: 60,
            height: 60,
            backgroundColor: avatarColor,
            color: 'white',
            mr: 3,
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
          src={resume.avatar_url}
        >
          {!resume.avatar_url && initials}
        </Avatar>

        {/* Resume info */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              mb: 0.5,
              lineHeight: 1.3
            }}
          >
            {name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.85rem',
              mb: 1
            }}
          >
            {email}
          </Typography>

          {/* ATS Score with progress bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 120 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.85rem'
                  }}
                >
                  ATS Score
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  {score}/100
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={Math.min(score, 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor:
                      score >= 80 ? '#4CAF50' : score >= 60 ? '#FFC107' : '#F44336',
                    borderRadius: 3
                  }
                }}
              />
            </Box>
          </Box>

          {/* Summary info */}
          {resume.summary && (
            <Box sx={{ display: 'flex', gap: 3, mt: 1.5 }}>
              {resume.summary.skills_count > 0 && (
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                  👤 {resume.summary.skills_count} skills
                </Typography>
              )}
              {resume.summary.experience_count > 0 && (
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                  💼 {resume.summary.experience_count} experiences
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default ResumeCard;
