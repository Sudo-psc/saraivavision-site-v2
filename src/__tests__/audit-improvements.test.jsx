/**
 * @fileoverview Tests for P1 audit improvements
 * Validates Google Maps integration, WhatsApp enhancements, and Schema markup
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import FAQPage from '@/pages/FAQPage';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => defaultValue || key,
    i18n: { language: 'pt' }
  })
}));

// Mock Google Maps component to avoid API loading in tests
vi.mock('@/components/GoogleMapNew', () => ({
  default: ({ height }) => (
    <div data-testid="google-map" style={{ height: `${height}px` }}>
      Google Maps Component
    </div>
  )
}));

// Mock hooks
vi.mock('@/hooks/useWhatsApp', () => ({
  useWhatsApp: () => ({
    openWhatsApp: vi.fn(),
    generateWhatsAppUrl: vi.fn(),
  })
}));

vi.mock('@/hooks/useRecaptcha', () => ({
  useRecaptcha: () => ({
    ready: true,
    execute: vi.fn()
  })
}));

vi.mock('@/hooks/useSEO', () => ({
  useFAQSEO: () => ({
    title: 'FAQ - Saraiva Vision',
    description: 'Perguntas frequentes sobre oftalmologia',
    keywords: 'faq, dúvidas, oftalmologia'
  })
}));

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <HelmetProvider>
      {children}
    </HelmetProvider>
  </BrowserRouter>
);

describe('Audit Improvements - P1 Priority', () => {
  describe('Google Maps Integration', () => {
    it('should render Google Maps component on Contact page', () => {
      render(
        <TestWrapper>
          <ContactPage />
        </TestWrapper>
      );

      const mapComponent = screen.getByTestId('google-map');
      expect(mapComponent).toBeInTheDocument();
      expect(mapComponent).toHaveStyle({ height: '320px' });
    });

    it('should display location information with maps', () => {
      render(
        <TestWrapper>
          <ContactPage />
        </TestWrapper>
      );

      // Check for location title
      expect(screen.getByText(/nossa localização|location/i)).toBeInTheDocument();
      
      // Check for clinic address information
      expect(screen.getByText(/catarina maria passos/i)).toBeInTheDocument();
      expect(screen.getByText(/caratinga/i)).toBeInTheDocument();
    });
  });

  describe('WhatsApp CTAs Enhancement', () => {
    it('should render enhanced WhatsApp buttons with proper accessibility', () => {
      render(
        <TestWrapper>
          <ContactPage />
        </TestWrapper>
      );

      // Check for WhatsApp call-to-action buttons
      const whatsappButtons = screen.getAllByRole('button');
      const whatsappButton = whatsappButtons.find(button => 
        button.textContent?.toLowerCase().includes('whatsapp')
      );
      
      expect(whatsappButton).toBeInTheDocument();
      expect(whatsappButton).toHaveAttribute('aria-label');
    });

    it('should render phone number as clickable for WhatsApp', () => {
      render(
        <TestWrapper>
          <ContactPage />
        </TestWrapper>
      );

      // Check for clickable phone number
      const phoneButtons = screen.getAllByRole('button');
      const phoneButton = phoneButtons.find(button => 
        button.textContent?.includes('+55 33 99860-1427')
      );
      
      expect(phoneButton).toBeInTheDocument();
    });
  });

  describe('Schema Markup Integration', () => {
    it('should include SchemaMarkup component in Contact page', () => {
      const { container } = render(
        <TestWrapper>
          <ContactPage />
        </TestWrapper>
      );

      // Check for JSON-LD script tags (schema markup)
      const scriptTags = container.querySelectorAll('script[type="application/ld+json"]');
      expect(scriptTags.length).toBeGreaterThan(0);
    });

    it('should include SchemaMarkup component in About page', () => {
      const { container } = render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      const scriptTags = container.querySelectorAll('script[type="application/ld+json"]');
      expect(scriptTags.length).toBeGreaterThan(0);
    });

    it('should include SchemaMarkup component in Services page', () => {
      const { container } = render(
        <TestWrapper>
          <ServicesPage />
        </TestWrapper>
      );

      const scriptTags = container.querySelectorAll('script[type="application/ld+json"]');
      expect(scriptTags.length).toBeGreaterThan(0);
    });

    it('should include SchemaMarkup component in FAQ page', () => {
      const { container } = render(
        <TestWrapper>
          <FAQPage />
        </TestWrapper>
      );

      const scriptTags = container.querySelectorAll('script[type="application/ld+json"]');
      expect(scriptTags.length).toBeGreaterThan(0);
    });
  });

  describe('Medical Compliance & Accessibility', () => {
    it('should maintain ARIA labels and accessibility standards', () => {
      render(
        <TestWrapper>
          <ContactPage />
        </TestWrapper>
      );

      // Check for proper heading structure
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toBeInTheDocument();

      // Check for proper form labels
      const nameInput = screen.getByLabelText(/nome/i);
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute('required');

      const emailInput = screen.getByLabelText(/e-mail/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('required');
    });

    it('should include professional medical information', () => {
      render(
        <TestWrapper>
          <ContactPage />
        </TestWrapper>
      );

      // Check for medical professional information
      expect(screen.getByText(/clínica.*saraiva.*vision/i)).toBeInTheDocument();
    });
  });
});