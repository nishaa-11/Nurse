import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 5000, // 5 second timeout for faster feedback
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method
    });
    
    // Handle different types of errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Network Error: Cannot connect to backend server');
      error.message = 'Cannot connect to server. Please check if the backend is running on http://localhost:5000';
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      error.message = 'Request timed out. Please try again.';
    } else if (error.response?.status === 401) {
      console.warn('Authentication failed:', {
        url: error.config?.url,
        token: localStorage.getItem('token') ? 'Present' : 'Missing',
        user: localStorage.getItem('user') ? 'Present' : 'Missing',
        response: error.response?.data
      });
      
      // Add specific error message for auth failures
      if (!error.response.data?.message) {
        error.response.data = { 
          message: 'Authentication failed. Please log in again.' 
        };
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;