import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (window.location.pathname.startsWith('/dashboard')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  demoLogin: () => api.post('/auth/demo'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Resume Endpoints
export const resumeAPI = {
  getAll: () => api.get('/resumes'),
  getById: (id) => api.get(`/resumes/${id}`),
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
  generateSummary: (data) => api.post('/resumes/ai/summary', data),
  reviewATS: (data) => api.post('/resumes/ai/review', data),
};

// Portfolio Endpoints
export const portfolioAPI = {
  getAll: () => api.get('/portfolios'),
  getById: (id) => api.get(`/portfolios/${id}`),
  create: (data) => api.post('/portfolios', data),
  update: (id, data) => api.put(`/portfolios/${id}`, data),
  delete: (id) => api.delete(`/portfolios/${id}`),
  exportHTMLUrl: (id) => `/api/portfolios/${id}/export-html`,
};

// Cover Letter Endpoints
export const coverLetterAPI = {
  getAll: () => api.get('/cover-letters'),
  getById: (id) => api.get(`/cover-letters/${id}`),
  create: (data) => api.post('/cover-letters', data),
  update: (id, data) => api.put(`/cover-letters/${id}`, data),
  delete: (id) => api.delete(`/cover-letters/${id}`),
  generateAI: (data) => api.post('/cover-letters/ai/generate', data),
};

// Career Endpoints
export const careerAPI = {
  getLatest: () => api.get('/career/latest'),
  getHistory: () => api.get('/career/history'),
  analyze: (data) => api.post('/career/analyze', data),
};

// System Health & Engine Status
export const systemAPI = {
  getHealth: () => api.get('/health'),
};

export default api;
