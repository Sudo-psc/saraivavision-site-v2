/**
 * @fileoverview Comprehensive tests for code quality and performance utilities
 * Tests utility functions, error handling, and performance optimizations
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Code Quality Utilities', () => {
  describe('Error Handling', () => {
    it('should handle async errors gracefully', async () => {
      const errorFn = async () => {
        throw new Error('Test error')
      }

      const safeErrorFn = async () => {
        try {
          await errorFn()
        } catch (error) {
          console.error('Handled error:', error.message)
          return null
        }
      }

      const result = await safeErrorFn()
      expect(result).toBeNull()
    })

    it('should validate function parameters', () => {
      const validateParams = (required, optional = null) => {
        if (!required) {
          throw new Error('Required parameter missing')
        }
        return { required, optional }
      }

      expect(() => validateParams()).toThrow('Required parameter missing')
      expect(() => validateParams('test')).not.toThrow()
      expect(validateParams('test', 'optional')).toEqual({
        required: 'test',
        optional: 'optional'
      })
    })

    it('should handle edge cases in string manipulation', () => {
      const safeStringOperation = (str) => {
        if (!str || typeof str !== 'string') {
          return ''
        }
        return str.trim().toLowerCase()
      }

      expect(safeStringOperation()).toBe('')
      expect(safeStringOperation(null)).toBe('')
      expect(safeStringOperation(undefined)).toBe('')
      expect(safeStringOperation(123)).toBe('')
      expect(safeStringOperation('  TEST  ')).toBe('test')
    })
  })

  describe('Performance Optimizations', () => {
    it('should debounce function calls', (done) => {
      let callCount = 0
      const debouncedFn = debounce(() => {
        callCount++
      }, 100)

      // Call multiple times quickly
      debouncedFn()
      debouncedFn()
      debouncedFn()

      // Should only execute once after delay
      setTimeout(() => {
        expect(callCount).toBe(1)
        done()
      }, 150)
    })

    it('should throttle function calls', (done) => {
      let callCount = 0
      const throttledFn = throttle(() => {
        callCount++
      }, 100)

      // Call multiple times
      throttledFn()
      throttledFn()
      throttledFn()

      // Should execute immediately once
      expect(callCount).toBe(1)

      setTimeout(() => {
        throttledFn()
        expect(callCount).toBe(2)
        done()
      }, 150)
    })

    it('should memoize expensive calculations', () => {
      const expensiveCalculation = vi.fn((n) => {
        let result = 0
        for (let i = 0; i < n; i++) {
          result += i
        }
        return result
      })

      const memoizedCalculation = memoize(expensiveCalculation)

      // First call should execute function
      const result1 = memoizedCalculation(1000)
      expect(expensiveCalculation).toHaveBeenCalledTimes(1)

      // Second call with same input should use cache
      const result2 = memoizedCalculation(1000)
      expect(expensiveCalculation).toHaveBeenCalledTimes(1)
      expect(result1).toBe(result2)

      // Different input should execute function again
      memoizedCalculation(2000)
      expect(expensiveCalculation).toHaveBeenCalledTimes(2)
    })

    it('should handle memory cleanup', () => {
      const cleanupFunctions = []
      
      const addCleanupFunction = (fn) => {
        cleanupFunctions.push(fn)
      }

      const cleanup = () => {
        cleanupFunctions.forEach(fn => fn())
        cleanupFunctions.length = 0
      }

      const mockCleanup = vi.fn()
      addCleanupFunction(mockCleanup)

      expect(cleanupFunctions).toHaveLength(1)
      
      cleanup()
      
      expect(mockCleanup).toHaveBeenCalledTimes(1)
      expect(cleanupFunctions).toHaveLength(0)
    })
  })

  describe('Type Checking', () => {
    it('should validate object types', () => {
      const isValidUser = (user) => {
        if (!user || typeof user !== 'object') {
          return false
        }
        return (
          typeof user.name === 'string' &&
          typeof user.email === 'string' &&
          user.email.includes('@')
        )
      }

      expect(isValidUser(null)).toBe(false)
      expect(isValidUser({})).toBe(false)
      expect(isValidUser({ name: 'John' })).toBe(false)
      expect(isValidUser({ name: 'John', email: 'invalid' })).toBe(false)
      expect(isValidUser({ name: 'John', email: 'john@example.com' })).toBe(true)
    })

    it('should validate array types', () => {
      const isValidArray = (arr, validator) => {
        return Array.isArray(arr) && arr.every(validator)
      }

      const isString = (item) => typeof item === 'string'
      const isNumber = (item) => typeof item === 'number'

      expect(isValidArray(['a', 'b', 'c'], isString)).toBe(true)
      expect(isValidArray(['a', 1, 'c'], isString)).toBe(false)
      expect(isValidArray([1, 2, 3], isNumber)).toBe(true)
      expect(isValidArray(null, isString)).toBe(false)
    })
  })

  describe('Data Transformation', () => {
    it('should safely transform data', () => {
      const transformUserData = (rawData) => {
        if (!rawData || typeof rawData !== 'object') {
          return null
        }

        return {
          id: rawData.id || null,
          name: (rawData.name || '').trim(),
          email: (rawData.email || '').toLowerCase().trim(),
          age: parseInt(rawData.age) || 0,
          isActive: Boolean(rawData.isActive)
        }
      }

      expect(transformUserData(null)).toBeNull()
      expect(transformUserData('invalid')).toBeNull()
      
      const result = transformUserData({
        id: '123',
        name: '  John Doe  ',
        email: '  JOHN@EXAMPLE.COM  ',
        age: '25',
        isActive: 1
      })

      expect(result).toEqual({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        isActive: true
      })
    })

    it('should normalize phone numbers', () => {
      const normalizePhone = (phone) => {
        if (!phone || typeof phone !== 'string') {
          return ''
        }
        
        // Remove all non-digits
        const digits = phone.replace(/\D/g, '')
        
        // Brazilian phone format
        if (digits.length === 12 && digits.startsWith('55')) {
          return `+${digits}`
        }
        if (digits.length === 11) {
          return `+55${digits}`
        }
        if (digits.length === 10) {
          return `+55${digits}`
        }
        
        return digits
      }

      expect(normalizePhone('(33) 99999-9999')).toBe('+5533999999999')
      expect(normalizePhone('33 99999-9999')).toBe('+5533999999999')
      expect(normalizePhone('553399999999')).toBe('+553399999999')
      expect(normalizePhone('+55 33 99999-9999')).toBe('+553399999999')
      expect(normalizePhone('')).toBe('')
      expect(normalizePhone(null)).toBe('')
    })
  })

  describe('Security Utilities', () => {
    it('should sanitize user input', () => {
      const sanitizeInput = (input) => {
        if (!input || typeof input !== 'string') {
          return ''
        }
        
        return input
          .trim()
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]*>/g, '')
      }

      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('')
      expect(sanitizeInput('Hello <b>world</b>')).toBe('Hello world')
      expect(sanitizeInput('  Normal text  ')).toBe('Normal text')
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput(null)).toBe('')
    })

    it('should validate email format', () => {
      const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return typeof email === 'string' && emailRegex.test(email)
      }

      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('user.name@example.co.uk')).toBe(true)
      expect(isValidEmail('invalid.email')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail(null)).toBe(false)
    })
  })
})

// Utility function implementations for testing
function debounce(fn, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

function throttle(fn, delay) {
  let lastCall = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return fn.apply(this, args)
    }
  }
}

function memoize(fn) {
  const cache = new Map()
  return function (...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}