/**
 * Input Sanitization Utilities
 * Provides functions to sanitize user input and prevent XSS attacks
 */

/**
 * Sanitize a string by escaping HTML entities
 * Prevents XSS attacks when user input is rendered in the DOM
 * @param {string} str - The string to sanitize
 * @returns {string} - Sanitized string with HTML entities escaped
 */
export const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';

    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    return str.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char]);
};

/**
 * Sanitize an object by escaping all string values
 * Useful for sanitizing form data before storing
 * @param {Object} obj - Object with string values to sanitize
 * @returns {Object} - New object with sanitized string values
 */
export const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item =>
                typeof item === 'object' ? sanitizeObject(item) :
                    typeof item === 'string' ? sanitizeString(item) : item
            );
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
};

/**
 * Validate and sanitize phone number
 * @param {string} phone - Phone number to validate
 * @returns {string} - Sanitized phone number (digits only with optional +)
 */
export const sanitizePhone = (phone) => {
    if (typeof phone !== 'string') return '';
    // Allow only digits and optional leading +
    return phone.replace(/[^\d+]/g, '').slice(0, 15);
};

/**
 * Validate and sanitize email
 * @param {string} email - Email to validate
 * @returns {string} - Sanitized email (lowercase, trimmed)
 */
export const sanitizeEmail = (email) => {
    if (typeof email !== 'string') return '';
    return email.toLowerCase().trim();
};

/**
 * Validate transaction ID format
 * @param {string} trxId - Transaction ID to validate
 * @returns {string} - Sanitized transaction ID (alphanumeric only)
 */
export const sanitizeTransactionId = (trxId) => {
    if (typeof trxId !== 'string') return '';
    return trxId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
};
