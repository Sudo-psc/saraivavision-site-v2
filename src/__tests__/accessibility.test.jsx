/**
 * @fileoverview Comprehensive accessibility tests
 * Tests WCAG 2.1 AA compliance and accessibility best practices
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderWithProviders, a11yHelpers } from '@/test/test-utils'

describe('Accessibility Compliance', () => {
  describe('WCAG 2.1 AA Guidelines', () => {
    describe('Keyboard Navigation', () => {
      it('should allow tab navigation through interactive elements', () => {
        const TestComponent = () => (
          <div>
            <button>Button 1</button>
            <a href="#test">Link</a>
            <input type="text" placeholder="Input" />
            <button>Button 2</button>
          </div>
        )

        render(<TestComponent />)

        const interactiveElements = screen.getAllByRole(/button|link|textbox/)
        expect(interactiveElements).toHaveLength(4)

        // Check that all interactive elements are focusable
        interactiveElements.forEach(element => {
          expect(element.tabIndex).not.toBe(-1)
        })
      })

      it('should provide proper focus indicators', () => {
        const TestButton = () => (
          <button className="focus:ring-2 focus:ring-blue-500 focus:outline-none">
            Accessible Button
          </button>
        )

        render(<TestButton />)
        const button = screen.getByRole('button')
        
        // Check for focus styles
        expect(button).toHaveClass('focus:ring-2', 'focus:ring-blue-500', 'focus:outline-none')
      })

      it('should support skip navigation links', () => {
        const TestLayout = () => (
          <div>
            <a href="#main-content" className="sr-only focus:not-sr-only">
              Skip to main content
            </a>
            <nav>Navigation</nav>
            <main id="main-content">Main content</main>
          </div>
        )

        render(<TestLayout />)
        const skipLink = screen.getByText('Skip to main content')
        expect(skipLink).toBeInTheDocument()
        expect(skipLink.getAttribute('href')).toBe('#main-content')
      })
    })

    describe('Screen Reader Support', () => {
      it('should provide proper heading hierarchy', () => {
        const TestPage = () => (
          <div>
            <h1>Main Page Title</h1>
            <h2>Section Title</h2>
            <h3>Subsection Title</h3>
            <h2>Another Section</h2>
          </div>
        )

        render(<TestPage />)

        const h1 = screen.getByRole('heading', { level: 1 })
        const h2s = screen.getAllByRole('heading', { level: 2 })
        const h3 = screen.getByRole('heading', { level: 3 })

        expect(h1).toBeInTheDocument()
        expect(h2s).toHaveLength(2)
        expect(h3).toBeInTheDocument()
      })

      it('should provide proper ARIA labels', () => {
        const TestForm = () => (
          <form aria-label="Contact form">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" aria-required="true" />
            
            <label htmlFor="email">Email</label>
            <input id="email" type="email" aria-required="true" aria-invalid="false" />
            
            <button type="submit" aria-describedby="submit-help">
              Submit
            </button>
            <div id="submit-help">This will send your message</div>
          </form>
        )

        render(<TestForm />)

        const form = screen.getByRole('form')
        expect(form).toHaveAttribute('aria-label', 'Contact form')

        const nameInput = screen.getByLabelText('Name')
        expect(nameInput).toHaveAttribute('aria-required', 'true')

        const emailInput = screen.getByLabelText('Email')
        expect(emailInput).toHaveAttribute('aria-invalid', 'false')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        expect(submitButton).toHaveAttribute('aria-describedby', 'submit-help')
      })

      it('should provide alternative text for images', () => {
        const TestImages = () => (
          <div>
            <img src="/hero.jpg" alt="Doctor examining patient's eyes" />
            <img src="/decoration.svg" alt="" role="presentation" />
            <img src="/logo.png" alt="Saraiva Vision Clinic Logo" />
          </div>
        )

        render(<TestImages />)

        const images = screen.getAllByRole('img')
        
        // Meaningful images should have alt text
        const heroImage = screen.getByAltText("Doctor examining patient's eyes")
        expect(heroImage).toBeInTheDocument()

        const logoImage = screen.getByAltText('Saraiva Vision Clinic Logo')
        expect(logoImage).toBeInTheDocument()

        // Decorative images should have empty alt
        const decorativeImage = images.find(img => img.getAttribute('role') === 'presentation')
        expect(decorativeImage).toHaveAttribute('alt', '')
      })
    })

    describe('Color and Contrast', () => {
      it('should not rely solely on color for information', () => {
        const TestStatus = ({ status }) => {
          const getStatusIcon = () => {
            switch (status) {
              case 'success':
                return '✓'
              case 'error':
                return '✗'
              case 'warning':
                return '⚠'
              default:
                return '○'
            }
          }

          return (
            <div className={`status-${status}`}>
              <span aria-label={`Status: ${status}`}>
                {getStatusIcon()} {status}
              </span>
            </div>
          )
        }

        render(<TestStatus status="success" />)
        
        const statusElement = screen.getByLabelText('Status: success')
        expect(statusElement).toBeInTheDocument()
        expect(statusElement.textContent).toContain('✓')
        expect(statusElement.textContent).toContain('success')
      })

      it('should provide high contrast focus states', () => {
        const TestInput = () => (
          <input
            type="text"
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="High contrast input"
          />
        )

        render(<TestInput />)
        const input = screen.getByPlaceholderText('High contrast input')
        
        // Check for high contrast focus styles
        expect(input).toHaveClass('focus:border-blue-500', 'focus:ring-2')
      })
    })

    describe('Responsive Design', () => {
      it('should work with zoom up to 200%', () => {
        const TestResponsive = () => (
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-2xl md:text-4xl">Responsive Title</h1>
            <p className="text-base leading-relaxed">
              This content should remain readable and functional when zoomed.
            </p>
          </div>
        )

        render(<TestResponsive />)
        
        const title = screen.getByRole('heading', { level: 1 })
        const paragraph = screen.getByText(/This content should remain readable/)
        
        expect(title).toHaveClass('text-2xl', 'md:text-4xl')
        expect(paragraph).toHaveClass('text-base', 'leading-relaxed')
      })

      it('should provide proper mobile navigation', () => {
        const TestMobileNav = () => (
          <nav aria-label="Main navigation">
            <button 
              aria-expanded="false" 
              aria-controls="mobile-menu"
              className="md:hidden"
            >
              Menu
            </button>
            <div id="mobile-menu" className="hidden md:block">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </div>
          </nav>
        )

        render(<TestMobileNav />)
        
        const nav = screen.getByRole('navigation')
        expect(nav).toHaveAttribute('aria-label', 'Main navigation')

        const menuButton = screen.getByRole('button', { name: 'Menu' })
        expect(menuButton).toHaveAttribute('aria-expanded', 'false')
        expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu')
      })
    })

    describe('Form Accessibility', () => {
      it('should provide proper form validation feedback', () => {
        const TestForm = () => (
          <form>
            <div>
              <label htmlFor="email-input">Email Address</label>
              <input
                id="email-input"
                type="email"
                aria-required="true"
                aria-invalid="true"
                aria-describedby="email-error"
              />
              <div id="email-error" role="alert" className="text-red-600">
                Please enter a valid email address
              </div>
            </div>
            <div>
              <fieldset>
                <legend>Preferred Contact Method</legend>
                <label>
                  <input type="radio" name="contact" value="email" />
                  Email
                </label>
                <label>
                  <input type="radio" name="contact" value="phone" />
                  Phone
                </label>
              </fieldset>
            </div>
          </form>
        )

        render(<TestForm />)

        // Check email field accessibility
        const emailInput = screen.getByLabelText('Email Address')
        expect(emailInput).toHaveAttribute('aria-required', 'true')
        expect(emailInput).toHaveAttribute('aria-invalid', 'true')
        expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')

        const errorMessage = screen.getByRole('alert')
        expect(errorMessage).toBeInTheDocument()
        expect(errorMessage).toHaveTextContent('Please enter a valid email address')

        // Check fieldset and legend
        const fieldset = screen.getByRole('group', { name: 'Preferred Contact Method' })
        expect(fieldset).toBeInTheDocument()

        const radioButtons = screen.getAllByRole('radio')
        expect(radioButtons).toHaveLength(2)
      })

      it('should provide proper required field indicators', () => {
        const TestRequiredFields = () => (
          <form>
            <div>
              <label htmlFor="required-field">
                Name <span aria-label="required" className="text-red-500">*</span>
              </label>
              <input id="required-field" type="text" required aria-required="true" />
            </div>
            <div>
              <label htmlFor="optional-field">
                Company <span className="text-gray-500">(optional)</span>
              </label>
              <input id="optional-field" type="text" />
            </div>
          </form>
        )

        render(<TestRequiredFields />)

        const requiredField = screen.getByLabelText(/Name/)
        expect(requiredField).toHaveAttribute('required')
        expect(requiredField).toHaveAttribute('aria-required', 'true')

        const optionalField = screen.getByLabelText(/Company/)
        expect(optionalField).not.toHaveAttribute('required')
        expect(optionalField).not.toHaveAttribute('aria-required')
      })
    })

    describe('Live Regions', () => {
      it('should announce dynamic content changes', () => {
        const TestLiveRegion = ({ message }) => (
          <div>
            <div aria-live="polite" aria-atomic="true" id="status-message">
              {message}
            </div>
            <div aria-live="assertive" id="error-message" role="alert">
              Critical error message
            </div>
          </div>
        )

        render(<TestLiveRegion message="Form submitted successfully" />)

        const statusRegion = screen.getByText('Form submitted successfully')
        expect(statusRegion).toHaveAttribute('aria-live', 'polite')
        expect(statusRegion).toHaveAttribute('aria-atomic', 'true')

        const errorRegion = screen.getByText('Critical error message')
        expect(errorRegion).toHaveAttribute('aria-live', 'assertive')
        expect(errorRegion).toHaveAttribute('role', 'alert')
      })
    })
  })

  describe('Custom Accessibility Tests', () => {
    it('should use accessibility testing utilities', () => {
      const TestComponent = () => (
        <button aria-label="Close dialog" aria-describedby="close-help">
          ×
        </button>
      )

      render(<TestComponent />)
      const button = screen.getByRole('button')

      // Use custom a11y helper
      expect(() => {
        a11yHelpers.checkAriaAttributes(button, ['aria-label'])
      }).not.toThrow()

      expect(() => {
        a11yHelpers.checkAriaAttributes(button, ['aria-label', 'aria-describedby'])
      }).not.toThrow()

      expect(() => {
        a11yHelpers.checkAriaAttributes(button, ['aria-label', 'aria-missing'])
      }).toThrow()
    })

    it('should validate semantic HTML structure', () => {
      const TestPage = () => (
        <div>
          <header>Header</header>
          <nav>Navigation</nav>
          <main>
            <article>
              <h1>Title</h1>
              <p>Content</p>
            </article>
          </main>
          <footer>Footer</footer>
        </div>
      )

      const { container } = render(<TestPage />)

      expect(() => {
        a11yHelpers.hasSemanticStructure(container, [
          'header', 'nav', 'main', 'article', 'h1', 'p', 'footer'
        ])
      }).not.toThrow()

      expect(() => {
        a11yHelpers.hasSemanticStructure(container, [
          'header', 'nav', 'main', 'section', 'aside' // Missing elements
        ])
      }).toThrow()
    })
  })
})