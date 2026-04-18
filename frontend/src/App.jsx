import React, { useState } from 'react';
import { Box } from '@mui/material';
import HeroSection from './components/HeroSection';
import WhyResumeSection from './components/WhyResumeSection';
import DashboardSection from './components/DashboardSection';
import ResumeUploader from './components/ResumeUploader';
import ComprehensiveResumeForm from './components/ComprehensiveResumeForm';
import Footer from './components/Footer';

function App() {
  const [view, setView] = useState('home'); // 'home', 'upload', 'form'

  const handleCreateResume = () => {
    setView('form'); // Go to comprehensive form
  };

  const handleUploadResume = () => {
    setView('upload'); // Go to upload flow
  };

  const handleBackToHome = () => {
    setView('home');
  };

  if (view === 'upload') {
    return (
      <Box sx={{ overflowX: 'hidden' }}>
        <ResumeUploader onBack={handleBackToHome} />
      </Box>
    );
  }

  if (view === 'form') {
    return (
      <Box sx={{ overflowX: 'hidden' }}>
        <ComprehensiveResumeForm onBack={handleBackToHome} />
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <HeroSection 
        onCreateResume={handleCreateResume}
        onUploadResume={handleUploadResume}
      />
      <WhyResumeSection />
      <DashboardSection />
      <Footer />
    </Box>
  );
}

export default App;
