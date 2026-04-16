import axios from 'axios';
import { API } from '@/config/constants';

/**
 * Centralized Axios instance for all API communications.
 * Configured with base URL, timeout, and basic headers.
 */
const apiClient = axios.create({
  baseURL: API.BASE_URL,
  timeout: API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Inject Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status code out of 2xx range
      console.error('API Error Response:', error.response.data);

      // Handle 401 Unauthorized (optional: trigger logout)
      if (error.response.status === 401) {
        // localStorage.removeItem('auth_token');
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Network Error:', error.request);
    } else {
      // Something else happened in setting up the request
      console.error('API Configuration Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
