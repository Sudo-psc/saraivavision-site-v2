/**
 * Internationalization utilities for pt-BR locale
 * Handles currency formatting, decimal separators, and Brazilian-specific formatting
 */

/**
 * Format currency for pt-BR locale with proper decimal separator (,)
 * @param {number} amount - The amount to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string (e.g., "R$ 150,00")
 */
export const formatCurrencyBR = (amount, options = {}) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'R$ 0,00';
  }
  
  const defaultOptions = {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  };
  
  try {
    return new Intl.NumberFormat('pt-BR', defaultOptions).format(amount);
  } catch (error) {
    console.warn('Currency formatting failed:', error);
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  }
};

/**
 * Format decimal numbers for pt-BR locale (comma as decimal separator)
 * @param {number} number - The number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string (e.g., "4,9" for rating)
 */
export const formatDecimalBR = (number, decimals = 1) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0,0';
  }
  
  try {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  } catch (error) {
    console.warn('Decimal formatting failed:', error);
    return number.toFixed(decimals).replace('.', ',');
  }
};

/**
 * Format percentage for pt-BR locale
 * @param {number} value - The percentage value (0-1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string (e.g., "95,5%")
 */
export const formatPercentageBR = (value, decimals = 1) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    console.warn('Percentage formatting failed:', error);
    return `${(value * 100).toFixed(decimals).replace('.', ',')}%`;
  }
};

/**
 * Format phone numbers for Brazilian standard
 * @param {string} phone - The phone number to format
 * @returns {string} Formatted phone number (e.g., "(33) 3321-1234")
 */
export const formatPhoneBR = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length === 11) {
    // Mobile: (XX) 9XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    // Landline: (XX) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 8) {
    // Local: XXXX-XXXX
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  
  return phone; // Return original if format not recognized
};

/**
 * Format CEP (Brazilian postal code)
 * @param {string} cep - The CEP to format
 * @returns {string} Formatted CEP (e.g., "35300-000")
 */
export const formatCEP = (cep) => {
  if (!cep || typeof cep !== 'string') {
    return '';
  }
  
  const digits = cep.replace(/\D/g, '');
  
  if (digits.length === 8) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  
  return cep; // Return original if not 8 digits
};

/**
 * Format CPF (Brazilian individual taxpayer ID)
 * @param {string} cpf - The CPF to format
 * @returns {string} Formatted CPF (e.g., "123.456.789-00")
 */
export const formatCPF = (cpf) => {
  if (!cpf || typeof cpf !== 'string') {
    return '';
  }
  
  const digits = cpf.replace(/\D/g, '');
  
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  
  return cpf; // Return original if not 11 digits
};

/**
 * Format date for pt-BR locale
 * @param {Date|string} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDateBR = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  };
  
  try {
    return new Intl.DateTimeFormat('pt-BR', defaultOptions).format(dateObj);
  } catch (error) {
    console.warn('Date formatting failed:', error);
    return dateObj.toLocaleDateString('pt-BR');
  }
};

/**
 * Format time for pt-BR locale (24-hour format)
 * @param {Date|string} date - The date/time to format
 * @returns {string} Formatted time string (e.g., "14:30")
 */
export const formatTimeBR = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(dateObj);
  } catch (error) {
    console.warn('Time formatting failed:', error);
    return dateObj.toLocaleTimeString('pt-BR', { hour12: false });
  }
};

/**
 * Format medical service prices with consultation context
 * @param {number} price - The price to format
 * @param {string} context - Context for the price (consultation, exam, procedure)
 * @returns {string} Formatted price with context
 */
export const formatMedicalPriceBR = (price, context = 'consultation') => {
  if (typeof price !== 'number' || isNaN(price)) {
    return 'Consulte valores';
  }
  
  const formattedPrice = formatCurrencyBR(price);
  
  const contextMap = {
    consultation: 'Consulta a partir de',
    exam: 'Exame a partir de',
    procedure: 'Procedimento a partir de',
    surgery: 'Cirurgia a partir de',
  };
  
  const prefix = contextMap[context] || 'A partir de';
  
  return `${prefix} ${formattedPrice}`;
};

/**
 * Validate and format Brazilian documents
 */
export const validateAndFormatBrazilianDoc = {
  cpf: (cpf) => {
    const formatted = formatCPF(cpf);
    const digits = cpf.replace(/\D/g, '');
    
    // Basic CPF validation (simplified)
    if (digits.length !== 11 || /^(.)\1{10}$/.test(digits)) {
      return { isValid: false, formatted: cpf };
    }
    
    return { isValid: true, formatted };
  },
  
  cep: (cep) => {
    const formatted = formatCEP(cep);
    const digits = cep.replace(/\D/g, '');
    
    return {
      isValid: digits.length === 8,
      formatted,
    };
  },
  
  phone: (phone) => {
    const formatted = formatPhoneBR(phone);
    const digits = phone.replace(/\D/g, '');
    
    return {
      isValid: digits.length >= 8 && digits.length <= 11,
      formatted,
    };
  },
};

/**
 * Get locale-specific medical terms
 */
export const getMedicalTermsBR = () => ({
  consultation: 'Consulta',
  exam: 'Exame',
  procedure: 'Procedimento',
  surgery: 'Cirurgia',
  treatment: 'Tratamento',
  diagnosis: 'Diagnóstico',
  prescription: 'Receita',
  followUp: 'Retorno',
  emergency: 'Emergência',
  appointment: 'Agendamento',
  schedule: 'Agendar',
  reschedule: 'Reagendar',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  availability: 'Disponibilidade',
  doctor: 'Médico',
  patient: 'Paciente',
  clinic: 'Clínica',
  hospital: 'Hospital',
  insurance: 'Convênio',
  privatePayment: 'Particular',
});

/**
 * Format medical ratings for pt-BR
 * @param {number} rating - Rating value (0-5)
 * @param {number} totalReviews - Total number of reviews
 * @returns {Object} Formatted rating object
 */
export const formatMedicalRatingBR = (rating, totalReviews) => {
  const formattedRating = formatDecimalBR(rating, 1);
  const formattedTotal = totalReviews > 1000 
    ? `${Math.floor(totalReviews / 1000)}k+`
    : totalReviews.toString();
  
  return {
    rating: formattedRating,
    display: `${formattedRating} ⭐ (${formattedTotal} avaliações)`,
    short: `${formattedRating}⭐`,
    accessibility: `Avaliação ${formattedRating} de 5 estrelas, baseada em ${formattedTotal} avaliações`,
  };
};