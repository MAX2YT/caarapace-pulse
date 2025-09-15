export const APP_CONFIG = {
  name: 'Caarapace Pulse',
  version: '1.0.0',
  companyName: 'Caarapace',
  description: 'Employee Management System'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  EMPLOYEE: 'employee'
};

export const LEAVE_TYPES = [
  'Annual Leave',
  'Sick Leave',
  'Personal Leave',
  'Maternity/Paternity Leave',
  'Emergency Leave',
  'Bereavement Leave',
  'Study Leave'
];

export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Finance',
  'Sales',
  'Operations',
  'Customer Support',
  'Quality Assurance'
];

export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const EMPLOYEE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  TERMINATED: 'Terminated'
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  HALF_DAY: 'Half Day'
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  FULL: 'dddd, MMMM DD, YYYY'
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_PATTERN: /^[\+]?[1-9]?\d{9,15}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMPLOYEE_ID_PATTERN: /^[A-Z]{2,4}\d{3,6}$/
};

export const THEME_COLORS = {
  PRIMARY: '#C85A54',
  SECONDARY: '#E6816D',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#3B82F6'
};

export const STORAGE_KEYS = {
  USERS: 'caarapace_users',
  EMPLOYEES: 'caarapace_employees',
  ATTENDANCE: 'caarapace_attendance',
  LEAVE_REQUESTS: 'caarapace_leave_requests',
  CURRENT_USER: 'caarapace_current_user',
  THEME: 'caarapace_theme',
  PREFERENCES: 'caarapace_preferences'
};

export const API_ENDPOINTS = {
  // For future API integration
  BASE_URL: '/api/v1',
  AUTH: '/auth',
  EMPLOYEES: '/employees',
  ATTENDANCE: '/attendance',
  LEAVE_REQUESTS: '/leave-requests'
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username or password',
  ACCESS_DENIED: 'Access denied. Insufficient permissions.',
  NETWORK_ERROR: 'Network error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  DATA_SAVED: 'Data saved successfully',
  DATA_UPDATED: 'Data updated successfully',
  DATA_DELETED: 'Data deleted successfully',
  LEAVE_SUBMITTED: 'Leave request submitted successfully',
  LEAVE_APPROVED: 'Leave request approved successfully',
  LEAVE_REJECTED: 'Leave request rejected successfully'
};