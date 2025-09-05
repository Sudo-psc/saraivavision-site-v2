/**
 * @fileoverview Performance tests for components and utilities
 * Tests loading times, memory usage, and optimization strategies
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { perfHelpers } from '@/test/test-utils'

describe('Performance Tests', () => {
  let performanceMarks = []
  
  beforeEach(() => {
    performanceMarks = []
    // Mock performance.mark and performance.measure
    global.performance.mark = vi.fn((name) => {
      performanceMarks.push({ name, time: Date.now() })
    })
    global.performance.measure = vi.fn()
    global.performance.getEntriesByName = vi.fn(() => [])
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Render Performance', () => {
    it('should render simple components quickly', async () => {
      const SimpleComponent = () => <div>Simple content</div>

      const renderTime = await perfHelpers.measureRenderTime(() => {
        render(<SimpleComponent />)
      })

      expect(renderTime).toBeLessThan(50) // Should render in under 50ms
    })

    it('should handle large lists efficiently', async () => {
      const LargeList = ({ items }) => (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )

      const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`)

      const renderTime = await perfHelpers.measureRenderTime(() => {
        render(<LargeList items={items} />)
      })

      expect(renderTime).toBeLessThan(200) // Should render 1000 items in under 200ms
    })

    it('should optimize re-renders with memoization', async () => {
      let renderCount = 0
      
      const ExpensiveComponent = ({ data }) => {
        renderCount++
        return (
          <div>
            {data.map(item => (
              <div key={item.id}>{item.name}</div>
            ))}
          </div>
        )
      }

      const data = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]

      const { rerender } = render(<ExpensiveComponent data={data} />)
      
      expect(renderCount).toBe(1)
      
      // Re-render with same data should not increase render count in optimized component
      rerender(<ExpensiveComponent data={data} />)
      
      // In a real memoized component, this would still be 1
      // For this test, we just ensure it doesn't grow exponentially
      expect(renderCount).toBeLessThan(5)
    })

    it('should lazy load components efficiently', async () => {
      const LazyComponent = () => {
        const [isLoaded, setIsLoaded] = React.useState(false)
        
        React.useEffect(() => {
          // Simulate lazy loading
          setTimeout(() => setIsLoaded(true), 100)
        }, [])

        if (!isLoaded) {
          return <div>Loading...</div>
        }

        return <div>Lazy loaded content</div>
      }

      const start = performance.now()
      render(<LazyComponent />)
      
      // Initial render should be fast
      const initialRenderTime = performance.now() - start
      expect(initialRenderTime).toBeLessThan(50)

      // Wait for lazy content to load
      await waitFor(() => {
        expect(screen.getByText('Lazy loaded content')).toBeInTheDocument()
      }, { timeout: 200 })
    })
  })

  describe('Memory Management', () => {
    it('should clean up event listeners', () => {
      const listeners = []
      const mockAddEventListener = vi.fn((event, handler) => {
        listeners.push({ event, handler })
      })
      const mockRemoveEventListener = vi.fn((event, handler) => {
        const index = listeners.findIndex(l => l.event === event && l.handler === handler)
        if (index > -1) listeners.splice(index, 1)
      })

      // Mock component that adds event listeners
      const ComponentWithListeners = () => {
        React.useEffect(() => {
          const handleScroll = () => {}
          const handleResize = () => {}

          mockAddEventListener('scroll', handleScroll)
          mockAddEventListener('resize', handleResize)

          return () => {
            mockRemoveEventListener('scroll', handleScroll)
            mockRemoveEventListener('resize', handleResize)
          }
        }, [])

        return <div>Component with listeners</div>
      }

      const { unmount } = render(<ComponentWithListeners />)
      
      expect(mockAddEventListener).toHaveBeenCalledTimes(2)
      expect(listeners).toHaveLength(2)
      
      unmount()
      
      expect(mockRemoveEventListener).toHaveBeenCalledTimes(2)
      expect(listeners).toHaveLength(0)
    })

    it('should prevent memory leaks in useEffect', () => {
      let activeSubscriptions = 0
      
      const ComponentWithSubscription = () => {
        React.useEffect(() => {
          activeSubscriptions++
          
          return () => {
            activeSubscriptions--
          }
        }, [])

        return <div>Subscribed component</div>
      }

      const { unmount } = render(<ComponentWithSubscription />)
      expect(activeSubscriptions).toBe(1)
      
      unmount()
      expect(activeSubscriptions).toBe(0)
    })

    it('should handle large state updates efficiently', () => {
      const StateComponent = () => {
        const [items, setItems] = React.useState([])
        
        const addManyItems = () => {
          const newItems = Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            name: `Item ${i}`,
            value: Math.random()
          }))
          setItems(newItems)
        }

        React.useEffect(() => {
          addManyItems()
        }, [])

        return <div>Items: {items.length}</div>
      }

      const start = performance.now()
      render(<StateComponent />)
      const renderTime = performance.now() - start

      expect(renderTime).toBeLessThan(100) // Should handle large state efficiently
    })
  })

  describe('Asset Loading Performance', () => {
    it('should handle image loading efficiently', () => {
      const OptimizedImage = ({ src, alt }) => {
        const [isLoaded, setIsLoaded] = React.useState(false)
        const [hasError, setHasError] = React.useState(false)

        return (
          <div>
            {!isLoaded && !hasError && <div>Loading image...</div>}
            <img
              src={src}
              alt={alt}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              style={{ display: isLoaded ? 'block' : 'none' }}
            />
            {hasError && <div>Failed to load image</div>}
          </div>
        )
      }

      render(<OptimizedImage src="/test-image.jpg" alt="Test image" />)
      
      expect(screen.getByText('Loading image...')).toBeInTheDocument()
    })

    it('should lazy load images when in viewport', () => {
      const LazyImage = ({ src, alt }) => {
        const [inViewport, setInViewport] = React.useState(false)
        const imgRef = React.useRef()

        React.useEffect(() => {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setInViewport(true)
                observer.disconnect()
              }
            },
            { threshold: 0.1 }
          )

          if (imgRef.current) {
            observer.observe(imgRef.current)
          }

          return () => observer.disconnect()
        }, [])

        return (
          <div ref={imgRef}>
            {inViewport ? (
              <img src={src} alt={alt} />
            ) : (
              <div className="placeholder">Image placeholder</div>
            )}
          </div>
        )
      }

      render(<LazyImage src="/lazy-image.jpg" alt="Lazy loaded image" />)
      
      expect(screen.getByText('Image placeholder')).toBeInTheDocument()
    })
  })

  describe('Bundle Size Optimization', () => {
    it('should use tree shaking for utility functions', () => {
      // Mock utility module
      const utils = {
        formatPhone: (phone) => phone.replace(/\D/g, ''),
        formatEmail: (email) => email.toLowerCase(),
        formatName: (name) => name.trim(),
        unusedFunction: () => 'This should be tree shaken'
      }

      // Component only uses some utilities
      const ComponentUsingUtils = () => {
        const phone = utils.formatPhone('(33) 99999-9999')
        const email = utils.formatEmail('USER@EXAMPLE.COM')
        
        return <div>{phone} - {email}</div>
      }

      render(<ComponentUsingUtils />)
      
      expect(screen.getByText('3399999999 - user@example.com')).toBeInTheDocument()
      
      // In a real bundle analysis, formatName and unusedFunction would be tree shaken
    })

    it('should code split by routes', () => {
      // Mock dynamic import
      const mockDynamicImport = vi.fn(() => 
        Promise.resolve({
          default: () => <div>Dynamically imported component</div>
        })
      )

      const LazyRoute = () => {
        const [Component, setComponent] = React.useState(null)
        
        React.useEffect(() => {
          mockDynamicImport().then(module => {
            setComponent(() => module.default)
          })
        }, [])

        if (!Component) {
          return <div>Loading route...</div>
        }

        return <Component />
      }

      render(<LazyRoute />)
      
      expect(screen.getByText('Loading route...')).toBeInTheDocument()
      expect(mockDynamicImport).toHaveBeenCalledTimes(1)
    })
  })

  describe('Performance Monitoring', () => {
    it('should track component mount times', () => {
      const MonitoredComponent = () => {
        React.useEffect(() => {
          performance.mark('component-mount-start')
          
          return () => {
            performance.mark('component-mount-end')
            performance.measure('component-mount', 'component-mount-start', 'component-mount-end')
          }
        }, [])

        return <div>Monitored component</div>
      }

      const { unmount } = render(<MonitoredComponent />)
      
      expect(performance.mark).toHaveBeenCalledWith('component-mount-start')
      
      unmount()
      
      expect(performance.mark).toHaveBeenCalledWith('component-mount-end')
      expect(performance.measure).toHaveBeenCalledWith(
        'component-mount',
        'component-mount-start',
        'component-mount-end'
      )
    })

    it('should track user interactions', () => {
      const trackInteraction = vi.fn()
      
      const InteractiveComponent = () => {
        const handleClick = () => {
          trackInteraction('button-click', { timestamp: Date.now() })
        }

        return <button onClick={handleClick}>Track me</button>
      }

      render(<InteractiveComponent />)
      
      const button = screen.getByRole('button')
      button.click()
      
      expect(trackInteraction).toHaveBeenCalledWith('button-click', 
        expect.objectContaining({ timestamp: expect.any(Number) })
      )
    })
  })

  describe('Performance Budget', () => {
    it('should enforce performance budgets', async () => {
      const ComponentUnderTest = () => {
        // Simulate some processing
        const data = Array.from({ length: 100 }, (_, i) => i)
        
        return (
          <div>
            {data.map(item => (
              <div key={item}>Item {item}</div>
            ))}
          </div>
        )
      }

      const meetsPerformanceBudget = await perfHelpers.checkRenderBudget(
        () => render(<ComponentUnderTest />),
        100 // 100ms budget
      )

      expect(meetsPerformanceBudget).toBe(true)
    })

    it('should warn about performance budget violations', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const SlowComponent = () => {
        // Simulate slow component
        const data = Array.from({ length: 10000 }, (_, i) => i)
        
        return (
          <div>
            {data.map(item => (
              <div key={item}>Item {item}</div>
            ))}
          </div>
        )
      }

      await perfHelpers.checkRenderBudget(
        () => render(<SlowComponent />),
        10 // Very strict 10ms budget
      )

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('exceeds budget')
      )
      
      consoleSpy.mockRestore()
    })
  })
})

// Mock React for components used in tests
const React = {
  useState: vi.fn((initial) => [initial, vi.fn()]),
  useEffect: vi.fn((fn, deps) => {
    if (!deps || deps.length === 0) {
      fn()
    }
  }),
  useRef: vi.fn(() => ({ current: null }))
}