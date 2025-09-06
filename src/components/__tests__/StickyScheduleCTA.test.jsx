import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import StickyScheduleCTA from '../StickyScheduleCTA';

// Mock the hooks and utilities
vi.mock('@/hooks/useWhatsApp', () => ({
  useWhatsApp: () => ({
    generateWhatsAppUrl: vi.fn(() => 'https://wa.me/123456789'),
  }),
}));

vi.mock('@/utils/safeNavigation', () => ({
  safeOpenUrl: vi.fn(),
}));

vi.mock('@/lib/clinicInfo', () => ({
  clinicInfo: {
    validateSchedulingUrl: () => 'https://example.com/schedule',
    address: {
      street: 'Rua Exemplo, 123',
      city: 'Caratinga',
      state: 'MG',
    },
    phoneDisplay: '(33) 3321-1234',
  },
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => fallback || key,
  }),
}));

// Mock framer-motion to avoid animation complexities in tests
vi.mock('framer-motion', () => ({
  motion: {
    aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('StickyScheduleCTA Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    
    // Mock window.scrollY to trigger component visibility
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 700, // Above 600px threshold
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have proper ARIA labels and roles', () => {
    render(
      <TestWrapper>
        <StickyScheduleCTA />
      </TestWrapper>
    );

    // Check main container has proper role and labeling
    const ctaSection = screen.getByRole('complementary');
    expect(ctaSection).toHaveAttribute('aria-labelledby', 'sticky-cta-title');
    expect(ctaSection).toHaveAttribute('aria-describedby', 'sticky-cta-desc');

    // Check heading structure
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveAttribute('id', 'sticky-cta-title');

    // Check expand button has proper ARIA attributes
    const expandButton = screen.getByLabelText(/expandir opções/i);
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    expect(expandButton).toHaveAttribute('aria-controls', 'sticky-cta-expanded');
  });

  it('should have proper focus management', async () => {
    render(
      <TestWrapper>
        <StickyScheduleCTA />
      </TestWrapper>
    );

    const expandButton = screen.getByLabelText(/expandir opções/i);
    
    // Expand the CTA
    fireEvent.click(expandButton);
    
    // Wait for expansion
    await waitFor(() => {
      expect(expandButton).toHaveAttribute('aria-expanded', 'true');
    });

    // Check that WhatsApp button is focusable
    const whatsappButton = screen.getByRole('button', { name: /whatsapp/i });
    expect(whatsappButton).toBeInTheDocument();
  });

  it('should announce state changes to screen readers', async () => {
    render(
      <TestWrapper>
        <StickyScheduleCTA />
      </TestWrapper>
    );

    // Check live region exists
    const liveRegion = screen.getByLabelText('', { selector: '[aria-live="polite"]' });
    expect(liveRegion).toBeInTheDocument();

    const expandButton = screen.getByLabelText(/expandir opções/i);
    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(liveRegion).toHaveTextContent('options_expanded');
    });
  });

  it('should have proper keyboard navigation', () => {
    render(
      <TestWrapper>
        <StickyScheduleCTA />
      </TestWrapper>
    );

    const expandButton = screen.getByLabelText(/expandir opções/i);
    const dismissButton = screen.getByLabelText(/fechar/i);
    const scheduleButton = screen.getByRole('button', { name: /agendar online/i });

    // All interactive elements should be focusable
    expect(expandButton).toHaveAttribute('tabIndex', '0');
    expect(dismissButton).not.toHaveAttribute('tabIndex', '-1');
    expect(scheduleButton).not.toHaveAttribute('tabIndex', '-1');

    // Check focus styles
    fireEvent.focus(expandButton);
    expect(expandButton).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
  });

  it('should use semantic icons instead of emojis', () => {
    render(
      <TestWrapper>
        <StickyScheduleCTA />
      </TestWrapper>
    );

    const expandButton = screen.getByLabelText(/expandir opções/i);
    fireEvent.click(expandButton);

    // Check that proper icons are used instead of emojis
    const iconElements = screen.getAllByLabelText('', { selector: '[aria-hidden="true"]' });
    expect(iconElements.length).toBeGreaterThan(0);

    // Should not contain emoji characters in accessible text
    const addressText = screen.getByText(/rua exemplo/i);
    expect(addressText).not.toHaveTextContent('📍');
  });

  it('should have proper color contrast and focus indicators', () => {
    render(
      <TestWrapper>
        <StickyScheduleCTA />
      </TestWrapper>
    );

    const scheduleButton = screen.getByRole('button', { name: /agendar online/i });
    
    // Check button has proper focus styles
    expect(scheduleButton).toHaveClass('focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2');
    
    // Check high contrast border exists
    const container = screen.getByRole('complementary');
    const highContrastBorder = container.querySelector('[aria-hidden="true"]');
    expect(highContrastBorder).toBeInTheDocument();
  });

  it('should handle sessionStorage gracefully when not available', () => {
    // Mock sessionStorage to throw an error
    const originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: vi.fn(() => { throw new Error('Not available'); }),
        setItem: vi.fn(() => { throw new Error('Not available'); }),
      },
      writable: true,
    });

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <TestWrapper>
        <StickyScheduleCTA />
      </TestWrapper>
    );

    // Component should still render
    expect(screen.getByRole('complementary')).toBeInTheDocument();

    // Should log warning about sessionStorage
    expect(consoleSpy).toHaveBeenCalledWith('SessionStorage not available:', expect.any(Error));

    // Restore original sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true,
    });

    consoleSpy.mockRestore();
  });

  it('should provide proper alternative text for screen readers', () => {
    render(
      <TestWrapper>
        <StickyScheduleCTA />
      </TestWrapper>
    );

    const expandButton = screen.getByLabelText(/expandir opções/i);
    fireEvent.click(expandButton);

    // Check that contact info has proper labels for screen readers
    const contactList = screen.getByLabelText(/informações de contato/i);
    expect(contactList).toBeInTheDocument();

    // Check individual contact items have proper structure
    const addressLabel = screen.getByText('Endereço:');
    const phoneLabel = screen.getByText('Telefone:');
    const hoursLabel = screen.getByText('Horário:');

    expect(addressLabel).toHaveClass('sr-only');
    expect(phoneLabel).toHaveClass('sr-only');
    expect(hoursLabel).toHaveClass('sr-only');
  });
});