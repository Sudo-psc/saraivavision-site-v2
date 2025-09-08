/**
 * Performance optimization utilities for bundle analysis and monitoring
 */

// Bundle size monitoring
export const BUNDLE_SIZE_LIMITS = {
  MAIN_JS: 600 * 1024, // 600KB
  MAIN_CSS: 150 * 1024, // 150KB
  CHUNK_JS: 200 * 1024, // 200KB per chunk
  TOTAL_INITIAL: 1 * 1024 * 1024, // 1MB total initial load
};

// Performance budget thresholds
export const PERFORMANCE_BUDGETS = {
  LCP: 2500, // 2.5s
  FID: 100, // 100ms
  CLS: 0.1, // 0.1
  FCP: 1800, // 1.8s
  TTI: 3800, // 3.8s
};

/**
 * Check if current bundle sizes exceed limits
 */
export const checkBundleSizes = async () => {
  if (typeof window === 'undefined') return null;

  try {
    // Use Performance Observer API to get resource sizes
    const entries = performance.getEntriesByType('resource');
    const jsEntries = entries.filter(entry => entry.name.includes('.js'));
    const cssEntries = entries.filter(entry => entry.name.includes('.css'));

    const results = {
      js: {
        main: 0,
        chunks: [],
        total: 0,
      },
      css: {
        main: 0,
        total: 0,
      },
      warnings: [],
    };

    // Analyze JS bundles
    jsEntries.forEach(entry => {
      const size = entry.transferSize || entry.encodedBodySize || 0;
      
      if (entry.name.includes('index-') && entry.name.includes('.js')) {
        results.js.main = size;
        if (size > BUNDLE_SIZE_LIMITS.MAIN_JS) {
          results.warnings.push(`Main JS bundle (${(size / 1024).toFixed(1)}KB) exceeds limit`);
        }
      } else {
        results.js.chunks.push({ name: entry.name, size });
        if (size > BUNDLE_SIZE_LIMITS.CHUNK_JS) {
          results.warnings.push(`JS chunk ${entry.name} (${(size / 1024).toFixed(1)}KB) exceeds limit`);
        }
      }
      
      results.js.total += size;
    });

    // Analyze CSS bundles
    cssEntries.forEach(entry => {
      const size = entry.transferSize || entry.encodedBodySize || 0;
      
      if (entry.name.includes('index-') && entry.name.includes('.css')) {
        results.css.main = size;
        if (size > BUNDLE_SIZE_LIMITS.MAIN_CSS) {
          results.warnings.push(`Main CSS bundle (${(size / 1024).toFixed(1)}KB) exceeds limit`);
        }
      }
      
      results.css.total += size;
    });

    // Check total initial load
    const totalInitial = results.js.main + results.css.main;
    if (totalInitial > BUNDLE_SIZE_LIMITS.TOTAL_INITIAL) {
      results.warnings.push(`Total initial load (${(totalInitial / 1024 / 1024).toFixed(2)}MB) exceeds limit`);
    }

    return results;
  } catch (error) {
    console.warn('Bundle size analysis failed:', error);
    return null;
  }
};

/**
 * Monitor Core Web Vitals and report issues
 */
export const monitorWebVitals = () => {
  if (typeof window === 'undefined') return;

  // LCP monitoring
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry.startTime > PERFORMANCE_BUDGETS.LCP) {
          console.warn(`LCP (${lastEntry.startTime.toFixed(0)}ms) exceeds budget (${PERFORMANCE_BUDGETS.LCP}ms)`);
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // CLS monitoring
      const clsObserver = new PerformanceObserver(list => {
        let clsValue = 0;
        
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        
        if (clsValue > PERFORMANCE_BUDGETS.CLS) {
          console.warn(`CLS (${clsValue.toFixed(3)}) exceeds budget (${PERFORMANCE_BUDGETS.CLS})`);
        }
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // FID monitoring (if supported)
      const fidObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.processingStart - entry.startTime > PERFORMANCE_BUDGETS.FID) {
            console.warn(`FID (${(entry.processingStart - entry.startTime).toFixed(0)}ms) exceeds budget (${PERFORMANCE_BUDGETS.FID}ms)`);
          }
        }
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('Performance monitoring setup failed:', error);
    }
  }
};

/**
 * Lazy load images with intersection observer
 */
export const createLazyImageObserver = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    return null;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
        
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01,
  });

  return imageObserver;
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  if (typeof document === 'undefined') return;

  // Preload critical fonts
  const criticalFonts = [
    '/fonts/inter-var.woff2',
    '/fonts/inter-var-italic.woff2',
  ];

  criticalFonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = fontUrl;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload hero image
  const heroImage = '/img/hero-background.webp';
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = heroImage;
  link.as = 'image';
  document.head.appendChild(link);
};

/**
 * Initialize performance monitoring
 */
export const initializePerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Start Web Vitals monitoring
  monitorWebVitals();

  // Initialize lazy loading
  const imageObserver = createLazyImageObserver();
  if (imageObserver) {
    // Observe all lazy images
    document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Preload critical resources
  preloadCriticalResources();

  // Schedule bundle size check after initial load
  setTimeout(() => {
    checkBundleSizes().then(results => {
      if (results && results.warnings.length > 0) {
        console.group('📦 Bundle Size Warnings');
        results.warnings.forEach(warning => console.warn(warning));
        console.groupEnd();
      }
    });
  }, 2000);
};