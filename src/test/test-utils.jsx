import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { vi } from 'vitest';

// Comprehensive mock translations covering all components
const mockTranslations = {
  // Contact component
  'contact.title': 'Entre em Contato',
  'contact.subtitle': 'Estamos prontos para cuidar da sua visão. Entre em contato conosco para agendar sua consulta.',
  'contact.form_title': 'Formulário de Contato',
  'contact.name_label': 'Nome completo',
  'contact.name_placeholder': 'Seu nome',
  'contact.email_label': 'E-mail',
  'contact.email_placeholder': 'seu@email.com',
  'contact.phone_label': 'Telefone',
  'contact.phone_placeholder': '(33) 99999-9999',
  'contact.message_label': 'Mensagem',
  'contact.message_placeholder': 'Sua mensagem',
  'contact.send_button': 'Enviar Mensagem',
  'contact.sending_label': 'Enviando...',
  'contact.online_scheduling_title': 'Agendamento Online',
  'contact.chatbot_title': 'Assistente IA',
  'contact.info.address_title': 'Endereço',
  'contact.info.phone_title': 'Telefone',
  'contact.info.email_title': 'E-mail',
  'contact.info.hours_title': 'Horários de Funcionamento',
  'contact.info.phone_whatsapp': 'Falar no WhatsApp',
  
  // Services component  
  'services.title': 'Nossos Serviços',
  'services.subtitle': 'Cuidamos da sua visão com excelência e tecnologia de ponta',
  'services.learn_more': 'Saiba Mais',
  'services.items.consultations.title': 'Consultas Oftalmológicas',
  'services.items.consultations.description': 'Exames completos para cuidar da sua visão',
  
  // Hero component
  'hero.title': 'Cuidando da sua <1>visão</1> com excelência',
  'hero.subtitle': 'Na Saraiva Vision, combinamos tecnologia de ponta com um atendimento humanizado',
  'hero.schedule_button': 'Agendar Consulta',
  'hero.services_button': 'Nossos Serviços',
  'hero.microcopy_fast_confirmation': 'Preencha seus dados e receba confirmação em 1 minuto',
  'hero.more_contact_options': 'Outras formas de contato',
  
  // Navbar component
  'navbar.home': 'Início',
  'navbar.services': 'Serviços', 
  'navbar.lenses': 'Lentes',
  'navbar.about': 'Sobre',
  'navbar.testimonials': 'Depoimentos',
  'navbar.contact': 'Contato',
  'navbar.schedule': 'Agendar',
  
  // Podcast component
  'podcast.title': 'Podcast Saraiva Vision',
  'podcast.subtitle': 'Conteúdo especializado sobre saúde ocular',
  
  // Privacy/LGPD
  'privacy.form_consent_html': 'Aceito os termos de privacidade',
  
  // Common
  'common.loading': 'Carregando...',
};

// Mock i18next hook
export const mockUseTranslation = () => ({
  t: (key, defaultValue) => {
    return mockTranslations[key] || defaultValue || key;
  },
  i18n: { 
    language: 'pt',
    changeLanguage: vi.fn()
  }
});

// Mock framer-motion components
export const mockMotionComponents = {
  motion: {
    div: ({ children, whileInView, initial, viewport, transition, whileHover, ...props }) => 
      <div {...props}>{children}</div>,
    form: ({ children, whileInView, initial, viewport, transition, ...props }) => 
      <form {...props}>{children}</form>,
    section: ({ children, whileInView, initial, viewport, transition, ...props }) => 
      <section {...props}>{children}</section>,
    h1: ({ children, whileHover, initial, animate, transition, ...props }) => 
      <h1 {...props}>{children}</h1>,
    h2: ({ children, whileHover, initial, animate, transition, ...props }) => 
      <h2 {...props}>{children}</h2>,
    h3: ({ children, whileHover, initial, animate, transition, ...props }) => 
      <h3 {...props}>{children}</h3>,
    p: ({ children, whileHover, initial, animate, transition, ...props }) => 
      <p {...props}>{children}</p>,
    button: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => 
      <button {...props}>{children}</button>,
    a: ({ children, whileHover, whileTap, initial, animate, transition, ...props }) => 
      <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
};

// Custom render function with providers
export const renderWithProviders = (ui, options = {}) => {
  const AllTheProviders = ({ children }) => {
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

/**
 * Renders component with HelmetProvider and MemoryRouter for testing
 * @param {React.ReactElement} ui - Component to render
 * @param {string} route - Initial route
 * @param {Object} options - Additional render options
 */
export const renderWithHelmetAndRoute = (ui, route = '/', options = {}) => {
  const AllTheProviders = ({ children }) => (
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        {children}
      </MemoryRouter>
    </HelmetProvider>
  );

  return render(ui, { wrapper: AllTheProviders, ...options });
};

/**
 * Creates a mock fetch function for API testing
 * @param {Object} mockData - Mock response data
 * @param {number} status - HTTP status code
 * @param {boolean} ok - Whether response is ok
 */
export const createMockFetch = (mockData = {}, status = 200, ok = true) => {
  return vi.fn(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(mockData),
      text: () => Promise.resolve(JSON.stringify(mockData)),
    })
  );
};

/**
 * Accessibility testing helpers
 */
export const a11yHelpers = {
  /**
   * Checks if element has proper ARIA attributes
   * @param {HTMLElement} element 
   * @param {Array} requiredAttributes 
   */
  checkAriaAttributes: (element, requiredAttributes = []) => {
    requiredAttributes.forEach(attr => {
      if (!element.getAttribute(attr)) {
        throw new Error(`Element missing required ARIA attribute: ${attr}`);
      }
    });
  },

  /**
   * Checks if form has proper validation attributes
   * @param {HTMLElement} form 
   */
  checkFormValidation: (form) => {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      if (input.hasAttribute('required') && !input.hasAttribute('aria-invalid')) {
        console.warn(`Required input missing aria-invalid: ${input.name || input.id}`);
      }
    });
  }
};

/**
 * Performance testing utilities
 */
export const perfHelpers = {
  /**
   * Measures component render time
   * @param {Function} renderFn - Function that renders the component
   */
  measureRenderTime: async (renderFn) => {
    const start = performance.now();
    await renderFn();
    const end = performance.now();
    return end - start;
  },

  /**
   * Checks if component renders within performance budget
   * @param {Function} renderFn - Function that renders the component
   * @param {number} budget - Maximum render time in ms
   */
  checkRenderBudget: async (renderFn, budget = 100) => {
    const renderTime = await perfHelpers.measureRenderTime(renderFn);
    if (renderTime > budget) {
      console.warn(`Component render time ${renderTime}ms exceeds budget ${budget}ms`);
    }
    return renderTime <= budget;
  }
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { renderWithProviders as render };