export const API = {
  BASE_URL: (import.meta.env.VITE_API_BASE_URL || 'https://afsattorneysearch-api-bqfgdfb7fhgrgbgj.eastus2-01.azurewebsites.net').replace(/\/$/, ''),
  TIMEOUT: 600000,
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    USER_PROFILE: '/user/profile',
    GENERATE_VIDEO: '/api/v1/generate-video',
    REGENERATE_VIDEO: '/api/v1/regenerate-video'
  }
};

export const VIDEO_GEN_DEFAULTS = {
  AVATAR_CHARACTER: 'string',
  AVATAR_STYLE: 'string',
  VOICE_NAME: 'string',
  SKIP_LIM: false
};

// MSAL Configuration
export const MSAL_CONFIG = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID || '954749a7-37b1-4118-b5c6-e1a12bac6795',
    authority: import.meta.env.VITE_MSAL_AUTHORITY || 'https://login.microsoftonline.com/c84161cf-b68e-4238-864b-45c5301d6889',
    redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI || 'https://mango-glacier-0a85c100f.1.azurestaticapps.net/new-analysis',
    postLogoutRedirectUri: import.meta.env.VITE_MSAL_POST_LOGOUT_REDIRECT_URI || 'https://mango-glacier-0a85c100f.1.azurestaticapps.net/'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'My React App',
  VERSION: '1.0.0',
  LANGUAGE: 'en',
  THEME: 'light'
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 20,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/
};

// UI Constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  MAX_FILE_SIZE: 5242880, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ITEMS_PER_PAGE: 10
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  MOBILE_SMALL: 360,
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  DESKTOP_LARGE: 1440
};

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10485760, // 10MB
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_DOCUMENT_EXTENSIONS: ['.pdf', '.doc', '.docx'],
  UPLOAD_TEXT: 'Click to upload documents',
  SUPPORTED_FORMATS_TEXT: 'PDF, DOC, DOCX'
};

// Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    LOGOUT: 'Logged out successfully!',
    SAVE: 'Data saved successfully!'
  },
  ERROR: {
    GENERIC: 'Something went wrong!',
    NETWORK: 'Network error. Please try again.',
    UNAUTHORIZED: 'You are not authorized.',
    INVALID_EMAIL: 'Please enter a valid email address.'
  }
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'app_theme',
  LANGUAGE: 'app_language'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PLAYER: '/player/$jobId'
};

// Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// Color Constants
export const COLORS = {
  PRIMARY: '#EE202E',
  TEXT: '#65758B',
  WHITE: '#FFFFFF'
};
