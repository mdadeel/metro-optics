import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes safely with clsx and twMerge.
 * @param {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric value into a USD currency string.
 * @param {number|string} price
 * @returns {string}
 */
export function formatPrice(price) {
  const numeric = typeof price === 'string' ? parseFloat(price) : price;
  if (numeric == null || isNaN(numeric)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(numeric);
}

/**
 * Computes the percentage discount between an original price and sale price.
 * @param {number} original
 * @param {number} current
 * @returns {number} Percentage discount rounded to nearest integer
 */
export function calculateDiscount(original, current) {
  if (!original || !current || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

/**
 * Truncates text to a specified maximum length with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 60) {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Converts a string into a URL-friendly slug.
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
