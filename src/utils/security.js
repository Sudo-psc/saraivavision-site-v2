/**
 * Security utilities for input sanitization, XSS prevention, and safe URL handling
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - The HTML content to sanitize
 * @returns {string} Sanitized HTML content
 */
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== 'string') return '';

  // Create a temporary div element
  const tempDiv = document.createElement('div');
  tempDiv.textContent = html; // This automatically escapes HTML entities
  
  return tempDiv.innerHTML;
};

/**
 * Sanitize user input for form fields
 * @param {string} input - The user input to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input, options = {}) => {
  if (!input || typeof input !== 'string') return '';

  const {
    maxLength = 1000,
    allowNewlines = false,
    allowSpecialChars = true,
  } = options;

  let sanitized = input
    .trim()
    .slice(0, maxLength); // Limit length

  // Remove or escape potentially dangerous characters
  if (!allowNewlines) {
    sanitized = sanitized.replace(/[\r\n]/g, ' ');
  }

  if (!allowSpecialChars) {
    // Remove HTML tags and script content
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  return sanitized;
};

/**
 * Validate and sanitize email addresses
 * @param {string} email - The email to validate
 * @returns {Object} Validation result with sanitized email
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, sanitized: '', error: 'Email is required' };
  }

  const sanitized = sanitizeInput(email.toLowerCase(), { 
    maxLength: 254,
    allowNewlines: false,
    allowSpecialChars: false 
  });

  // Enhanced email regex for better validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(sanitized)) {
    return { 
      isValid: false, 
      sanitized, 
      error: 'Formato de email inválido' 
    };
  }

  // Check for potentially dangerous email patterns
  const dangerousPatterns = [
    /script/i,
    /javascript/i,
    /vbscript/i,
    /data:/i,
    /\.\./,
  ];

  const hasDangerousPattern = dangerousPatterns.some(pattern => 
    pattern.test(sanitized)
  );

  if (hasDangerousPattern) {
    return { 
      isValid: false, 
      sanitized, 
      error: 'Email contém caracteres não permitidos' 
    };
  }

  return { isValid: true, sanitized, error: null };
};

/**
 * Validate and sanitize phone numbers
 * @param {string} phone - The phone number to validate
 * @returns {Object} Validation result with sanitized phone
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, sanitized: '', error: 'Telefone é obrigatório' };
  }

  // Remove all non-digit characters
  const sanitized = phone.replace(/\D/g, '');

  // Brazilian phone number validation
  if (sanitized.length < 8 || sanitized.length > 11) {
    return { 
      isValid: false, 
      sanitized, 
      error: 'Telefone deve ter entre 8 e 11 dígitos' 
    };
  }

  // Check for invalid patterns (all same digits)
  if (/^(.)\1+$/.test(sanitized)) {
    return { 
      isValid: false, 
      sanitized, 
      error: 'Número de telefone inválido' 
    };
  }

  return { isValid: true, sanitized, error: null };
};

/**
 * Validate and sanitize URLs to prevent malicious redirects
 * @param {string} url - The URL to validate
 * @param {Array} allowedDomains - List of allowed domains
 * @returns {Object} Validation result
 */
export const validateURL = (url, allowedDomains = []) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, sanitized: '', error: 'URL é obrigatória' };
  }

  const sanitized = sanitizeInput(url, { 
    maxLength: 2048,
    allowNewlines: false 
  });

  try {
    const urlObj = new URL(sanitized);
    
    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { 
        isValid: false, 
        sanitized, 
        error: 'Protocolo não permitido' 
      };
    }

    // Check for dangerous patterns
    const dangerousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
    ];

    const hasDangerousPattern = dangerousPatterns.some(pattern => 
      pattern.test(sanitized)
    );

    if (hasDangerousPattern) {
      return { 
        isValid: false, 
        sanitized, 
        error: 'URL contém padrões não permitidos' 
      };
    }

    // Check allowed domains if specified
    if (allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );

      if (!isAllowed) {
        return { 
          isValid: false, 
          sanitized, 
          error: 'Domínio não permitido' 
        };
      }
    }

    return { isValid: true, sanitized, error: null };
    
  } catch (error) {
    return { 
      isValid: false, 
      sanitized, 
      error: 'URL inválida' 
    };
  }
};

/**
 * Generate Content Security Policy for the application
 * @returns {string} CSP header value
 */
export const generateCSP = () => {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: http:",
    "connect-src 'self' https://www.google-analytics.com https://maps.googleapis.com https://api.whatsapp.com",
    "frame-src 'self' https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];

  return cspDirectives.join('; ');
};

/**
 * Secure environment variable validation
 * @param {Object} env - Environment variables object
 * @returns {Object} Validation results
 */
export const validateEnvironment = (env) => {
  const required = [
    'VITE_GOOGLE_MAPS_API_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];

  const optional = [
    'VITE_GA_MEASUREMENT_ID',
    'VITE_GTM_ID',
    'VITE_RECAPTCHA_SITE_KEY',
  ];

  const results = {
    missing: [],
    invalid: [],
    warnings: [],
    secure: true,
  };

  // Check required variables
  required.forEach(key => {
    if (!env[key]) {
      results.missing.push(key);
      results.secure = false;
    } else if (env[key].length < 10) {
      results.invalid.push(`${key} appears to be too short`);
      results.secure = false;
    }
  });

  // Check for potentially leaked secrets in client-side code
  Object.entries(env).forEach(([key, value]) => {
    if (key.includes('SECRET') || key.includes('PRIVATE')) {
      results.warnings.push(`${key} should not be exposed to client-side code`);
    }

    if (value && value.includes('localhost') && process.env.NODE_ENV === 'production') {
      results.warnings.push(`${key} contains localhost URL in production`);
    }
  });

  return results;
};

/**
 * Rate limiting utility for API calls
 */
export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  /**
   * Check if request is allowed
   * @param {string} identifier - Unique identifier (IP, user ID, etc.)
   * @returns {boolean} Whether request is allowed
   */
  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );

    // Check if under limit
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  /**
   * Get remaining requests for identifier
   * @param {string} identifier - Unique identifier
   * @returns {number} Remaining requests
   */
  getRemaining(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Honey pot field for form protection
 */
export const createHoneyPot = () => ({
  name: `website_${Date.now()}`, // Dynamic name to avoid detection
  style: {
    display: 'none',
    visibility: 'hidden',
    position: 'absolute',
    left: '-9999px',
    height: '0px',
    width: '0px',
  },
  attributes: {
    'aria-hidden': 'true',
    tabIndex: '-1',
    autoComplete: 'off',
  },
});

/**
 * Check if honey pot was filled (indicating bot activity)
 * @param {string} value - Honey pot field value
 * @returns {boolean} True if bot detected
 */
export const isHoneyPotFilled = (value) => {
  return value && value.trim().length > 0;
};

/**
 * CSRF token utilities
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token, storedToken) => {
  if (!token || !storedToken) return false;
  return token === storedToken;
};