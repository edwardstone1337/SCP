/**
 * HTML Sanitization for SCP Content
 *
 * IMPORTANT: This sanitization currently only runs CLIENT-SIDE.
 * The sanitizeHtml function is designed to be used in Client Components only.
 *
 * Server-side sanitization is planned for v1.1 using isomorphic-dompurify.
 *
 * Current usage:
 * - app/scp/[id]/scp-reader.tsx (Client Component) ✓
 *
 * DO NOT USE in Server Components until server-side sanitization is implemented.
 */
import DOMPurify from 'dompurify'

/**
 * Sanitize HTML content from external sources to prevent XSS
 * Uses DOMPurify with a safe configuration
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: return as-is (will be sanitized on client)
    return html
  }

  return DOMPurify.sanitize(html, {
    // Allow common HTML tags used in SCP articles
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'table', 'thead', 'tbody',
      'tr', 'th', 'td', 'div', 'span', 'code', 'pre', 'hr', 'sup', 'sub'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style'],
    // Keep relative URLs for internal wiki links
    ALLOW_DATA_ATTR: false,
  })
}
