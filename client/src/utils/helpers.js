// src/utils/helpers.js

/**
 * Format a number as currency.
 * @param {number} amount - The amount to format.
 * @param {string} currency - Currency code (default: 'USD').
 * @param {string} locale - Locale string (default: 'en-US').
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount == null) return '';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Get color based on status and type for MUI chips.
 * @param {string} status - Status value.
 * @param {string} type - Type of status: 'booking', 'payment', 'slot'.
 * @returns {string} Color name (e.g., 'success', 'error', 'warning', 'info').
 */
export const getStatusColor = (status, type = 'booking') => {
  const statusMap = {
    booking: {
      active: 'success',
      completed: 'info',
      cancelled: 'error',
      refunded: 'warning',
      flagged: 'secondary',
    },
    payment: {
      paid: 'success',
      pending: 'warning',
      refunded: 'info',
      failed: 'error',
    },
    slot: {
      available: 'success',
      booked: 'error',
      reserved: 'warning',
      maintenance: 'secondary',
    },
  };
  return statusMap[type]?.[status] || 'default';
};

/**
 * Capitalize the first letter of a string.
 * @param {string} str - Input string.
 * @returns {string} Capitalized string.
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Generate a random ID with optional prefix.
 * @param {string} prefix - Prefix string.
 * @returns {string} Generated ID.
 */
export const generateId = (prefix = '') => {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  return prefix ? `${prefix}_${timestamp}_${randomPart}` : `${timestamp}_${randomPart}`;
};

/**
 * Check if a given date/time is expired (before current time).
 * @param {string|Date} dateTime - Date to check.
 * @returns {boolean} True if expired.
 */
export const isExpired = (dateTime) => {
  if (!dateTime) return false;
  const targetDate = new Date(dateTime);
  return targetDate < new Date();
};

/**
 * Debounce a function.
 * @param {Function} func - Function to debounce.
 * @param {number} wait - Milliseconds to wait.
 * @returns {Function} Debounced function.
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Truncate a string to a specified length.
 * @param {string} str - Input string.
 * @param {number} length - Maximum length.
 * @param {string} suffix - Suffix to add (default: '...').
 * @returns {string} Truncated string.
 */
export const truncate = (str, length, suffix = '...') => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

/**
 * Build a query string from an object.
 * @param {Object} params - Key-value pairs.
 * @returns {string} Query string (e.g., '?key=value&foo=bar').
 */
export const buildQueryParams = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      query.append(key, value);
    }
  });
  const str = query.toString();
  return str ? `?${str}` : '';
};

/**
 * Validate email format.
 * @param {string} email - Email to validate.
 * @returns {boolean} True if valid.
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Parse JWT token (simple decode, no verification).
 * @param {string} token - JWT token.
 * @returns {Object|null} Decoded payload or null.
 */
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Default export for convenience
export default {
  formatCurrency,
  getStatusColor,
  capitalize,
  generateId,
  isExpired,
  debounce,
  truncate,
  buildQueryParams,
  validateEmail,
  parseJwt,
};