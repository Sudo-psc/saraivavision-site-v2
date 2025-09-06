/**
 * iOS-safe viewport height utility
 * Fixes the 100vh issue on mobile Safari by setting CSS custom property
 */

let isInitialized = false;

function setViewportHeight() {
  // Calculate viewport height excluding browser UI
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

export function initViewportHeight() {
  if (isInitialized) return;
  
  // Set initial value
  setViewportHeight();
  
  // Update on resize/orientation change
  window.addEventListener('resize', setViewportHeight, { passive: true });
  window.addEventListener('orientationchange', () => {
    // Delay to allow browser UI to settle
    setTimeout(setViewportHeight, 150);
  }, { passive: true });
  
  // For iOS, also listen to visual viewport changes if available
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setViewportHeight, { passive: true });
  }
  
  isInitialized = true;
}

export function cleanupViewportHeight() {
  if (!isInitialized) return;
  
  window.removeEventListener('resize', setViewportHeight);
  window.removeEventListener('orientationchange', setViewportHeight);
  
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', setViewportHeight);
  }
  
  isInitialized = false;
}