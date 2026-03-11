import DOMPurify from 'dompurify';

/**
 * Sanitizes an HTML string to prevent XSS attacks.
 *
 * @param {string} html - The dirty HTML string.
 * @returns {string} - The sanitized HTML string.
 */
export const sanitizeHtml = (html) => {
    if (!html) return '';
    return DOMPurify.sanitize(html);
};
