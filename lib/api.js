import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('healthhub_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('healthhub_user');
        localStorage.removeItem('healthhub_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const ecgAPI = {
  // Get all modules
  getModules: () => api.get('/api/ecg/modules'),
  
  // Get specific module
  getModule: (id) => api.get(`/api/ecg/modules/${id}`),
  
  // Get module progress
  getProgress: (userId, moduleId) => api.get(`/api/ecg/progress/${userId}/${moduleId}`),
  
  // Update module progress (PUT)
  updateProgress: (userId, moduleId, progress) => 
    api.put(`/api/ecg/progress/${userId}/${moduleId}`, progress),

  // Convenience: mark segment progress
  updateSegmentProgress: (userId, moduleId, segmentId, segmentProgress, totals) =>
    api.put(`/api/ecg/progress/${userId}/${moduleId}`, {
      segmentId,
      segmentProgress,
      ...(totals || {})
    }),
  
  // Submit quiz answers
  submitQuiz: (moduleId, answers) => 
    api.post(`/api/ecg/assessments`, { moduleId, answers }),
  
  // Get user analytics (admin/instructor only)
  getAnalytics: () => api.get('/api/ecg/analytics'),
  
  // Health check
  healthCheck: () => api.get('/api/health'),
};

export default api;
