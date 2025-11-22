export const ROLES = {
  NURSE: 'nurse',
  HOSPITAL: 'hospital'
};

export const SHIFT_STATUS = {
  OPEN: 'open',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const DEPARTMENTS = [
  'ICU',
  'ER',
  'Pediatrics',
  'Surgery',
  'Oncology',
  'Cardiology',
  'Neurology',
  'General',
  'Mental Health',
  'Geriatrics'
];

export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  EMERGENCY: 'emergency'
};

export const SPECIALIZATIONS = [
  'ICU',
  'ER',
  'Pediatrics',
  'Surgery',
  'Oncology',
  'Cardiology',
  'Neurology',
  'General',
  'Mental Health',
  'Geriatrics'
];

export const CERTIFICATIONS = [
  'BLS',
  'ACLS',
  'PALS',
  'CCRN',
  'TNCC',
  'NRP'
];

export const HOSPITAL_TYPES = [
  'General',
  'Specialty',
  'Teaching',
  'Rehabilitation',
  'Psychiatric',
  "Children's"
];

export const HOSPITAL_SIZES = [
  'Small (1-100 beds)',
  'Medium (101-300 beds)',
  'Large (301-500 beds)',
  'Extra Large (500+ beds)'
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  SHIFTS: '/shifts',
  NURSES: '/nurses',
  HOSPITALS: '/hospitals',
  RATINGS: '/ratings',
  LOCATION: '/location',
  SURGE: '/surge'
};

export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful!',
    SHIFT_CREATED: 'Shift created successfully!',
    SHIFT_APPLIED: 'Applied for shift successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!'
  },
  ERROR: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTER_FAILED: 'Registration failed. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    SHIFT_NOT_FOUND: 'Shift not found.'
  }
};