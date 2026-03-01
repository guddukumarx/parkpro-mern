// src/utils/constants.js

// User roles
export const ROLES = {
  USER: 'user',
  OWNER: 'owner',
  ADMIN: 'admin',
};

// Booking statuses
export const BOOKING_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  FLAGGED: 'flagged',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  REFUNDED: 'refunded',
  FAILED: 'failed',
};

// Slot statuses
export const SLOT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    DELETE_ACCOUNT: '/users/account',
    ADMIN: {
      GET_ALL: '/admin/users',
      GET_BY_ID: (id) => `/admin/users/${id}`,
      UPDATE_ROLE: (id) => `/admin/users/${id}/role`,
      TOGGLE_STATUS: (id) => `/admin/users/${id}/toggle-status`,
    },
  },
  PARKINGS: {
    GET_ALL: '/parkings',
    GET_BY_ID: (id) => `/parkings/${id}`,
    AVAILABILITY: (id) => `/parkings/${id}/slots/availability`,
    OWNER: {
      GET_ALL: '/owner/parkings',
      ADD_SLOT: (id) => `/parkings/${id}/slots`,
    },
    ADMIN: {
      GET_ALL: '/admin/parkings',
    },
  },
  SLOTS: {
    UPDATE: (id) => `/slots/${id}`,
    DELETE: (id) => `/slots/${id}`,
  },
  BOOKINGS: {
    CREATE: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings',
    GET_BY_ID: (id) => `/bookings/${id}`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
    EXTEND: (id) => `/bookings/${id}/extend`,
    ADMIN: {
      GET_ALL: '/admin/bookings',
      REFUND: (id) => `/admin/bookings/${id}/refund`,
    },
  },
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard/stats',
    REPORTS: '/admin/reports',
    OWNERS: {
      PENDING: '/admin/owners/pending',
      APPROVE: (id) => `/admin/owners/${id}/approve`,
      REJECT: (id) => `/admin/owners/${id}/reject`,
    },
    SETTINGS: '/admin/settings',
    LOGS: '/admin/logs',
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'parkpro_access_token',
  USER: 'parkpro_user',
  THEME: 'parkpro_theme',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 25, 50, 100],
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_TIME: 'hh:mm A',
  DISPLAY_DATETIME: 'MMM DD, YYYY hh:mm A',
  API_DATE: 'YYYY-MM-DD',
  API_DATETIME: 'YYYY-MM-DD HH:mm:ss',
};

// Theme modes
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// HTTP status codes (optional)
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export default {
  ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  SLOT_STATUS,
  API_ENDPOINTS,
  STORAGE_KEYS,
  PAGINATION,
  DATE_FORMATS,
  THEME_MODES,
  HTTP_STATUS,
};