import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Resume API calls
export const resumeAPI = {
  // Upload resume PDF
  uploadResume: async (file, email = '') => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (email) {
        formData.append('email', email);
      }

      const response = await apiClient.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload resume');
    }
  },

  // Generate LaTeX from parsed resume
  generateLatex: async (parsedResume) => {
    try {
      const response = await apiClient.post('/api/resume/generate-latex', {
        parsed_resume: parsedResume,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate LaTeX');
    }
  },

  // Download LaTeX as .tex file
  downloadLatex: async (parsedResume) => {
    try {
      const response = await apiClient.post(
        '/api/resume/download-latex',
        { parsed_resume: parsedResume },
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to download LaTeX');
    }
  },

  // Enhance resume with AI
  enhanceResume: async (parsedResume) => {
    try {
      const response = await apiClient.post('/api/resume/enhance', {
        parsed_resume: parsedResume,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to enhance resume');
    }
  },
};

// Dashboard API calls
export const dashboardAPI = {
  // Get list of resumes
  getResumes: async (filters = {}) => {
    try {
      const { email, sort = 'ats_score', order = 'desc', limit = 10, offset = 0 } = filters;
      const params = {
        sort,
        order,
        limit,
        offset,
      };
      if (email) {
        params.email = email;
      }

      const response = await apiClient.get('/api/resumes', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch resumes');
    }
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend is not available');
  }
};

export default apiClient;
