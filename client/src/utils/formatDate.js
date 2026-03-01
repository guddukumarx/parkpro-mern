// src/utils/formatDate.js

/**
 * Format a date to a readable string (e.g., Jan 01, 2025).
 * @param {Date|string|number} date - Date to format.
 * @param {Object} options - Intl.DateTimeFormat options.
 * @returns {string} Formatted date.
 */
export const formatDate = (date, options = {}) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const defaultOptions = { year: 'numeric', month: 'short', day: '2-digit' };
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(d);
};

/**
 * Format date and time (e.g., Jan 01, 2025 02:30 PM).
 * @param {Date|string|number} date - Date to format.
 * @returns {string} Formatted date and time.
 */
export const formatDateTime = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
};

/**
 * Format time only (e.g., 02:30 PM).
 * @param {Date|string|number} date - Date to format.
 * @returns {string} Formatted time.
 */
export const formatTime = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
};

/**
 * Get relative time string (e.g., "5 minutes ago", "yesterday").
 * @param {Date|string|number} date - Date to compare.
 * @returns {string} Relative time.
 */
export const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  if (isNaN(past.getTime())) return '';

  const seconds = Math.floor((now - past) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return seconds <= 5 ? 'just now' : `${seconds} seconds ago`;
  if (minutes < 60) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  if (days < 7) return days === 1 ? 'yesterday' : `${days} days ago`;
  if (weeks < 5) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`;
  return years === 1 ? '1 year ago' : `${years} years ago`;
};

/**
 * Format duration from minutes to a human-readable string.
 * @param {number} minutes - Duration in minutes.
 * @param {Object} options - Format options.
 * @param {boolean} options.compact - If true, returns "2h 30m", else "2 hours 30 minutes".
 * @returns {string} Formatted duration.
 */
export const formatDuration = (minutes, options = { compact: true }) => {
  if (minutes === null || minutes === undefined || minutes < 0) return '';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (options.compact) {
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes}m`);
    return parts.join(' ') || '0m';
  } else {
    const parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`);
    return parts.join(' ') || '0 minutes';
  }
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  timeAgo,
  formatDuration,
};