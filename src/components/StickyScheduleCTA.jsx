import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, MessageCircle, X, ChevronUp, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clinicInfo } from '@/lib/clinicInfo';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { safeOpenUrl } from '@/utils/safeNavigation';

// Throttle function for performance
const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          func.apply(this, args);
          lastExecTime = Date.now();
        },
        delay - (currentTime - lastExecTime)
      );
    }
  };
};

const StickyScheduleCTA = () => {
  const { t } = useTranslation();
  const { generateWhatsAppUrl } = useWhatsApp();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const expandButtonRef = useRef(null);
  const dismissButtonRef = useRef(null);
  const liveRegionRef = useRef(null);

  // Throttled scroll handler for performance
  const handleScroll = useCallback(
    throttle(() => {
      const scrollPosition = window.scrollY;
      const shouldBeVisible = scrollPosition > 600 && !isDismissed;

      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);

        // Announce to screen readers when CTA appears
        if (shouldBeVisible && liveRegionRef.current) {
          liveRegionRef.current.textContent = t(
            'accessibility.cta_appeared',
            'Opção de agendamento apareceu na tela'
          );
        }
      }
    }, 100),
    [isDismissed, isVisible, t]
  );

  useEffect(() => {
    // Safe sessionStorage access
    try {
      const dismissed = sessionStorage.getItem('stickyCtaDismissed');
      if (dismissed) {
        setIsDismissed(true);
      }
    } catch (error) {
      console.warn('SessionStorage not available:', error);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleScheduleClick = useCallback(() => {
    try {
      const validUrl = clinicInfo.validateSchedulingUrl();
      if (validUrl) {
        safeOpenUrl(validUrl);

        // Track interaction for analytics (accessibility-friendly)
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = t(
            'accessibility.schedule_clicked',
            'Redirecionando para agendamento online'
          );
        }
      } else {
        console.error('Scheduling URL validation failed');
      }
    } catch (error) {
      console.error('Error handling schedule click:', error);
    }
  }, [t]);

  const handleWhatsAppClick = useCallback(() => {
    try {
      const whatsappUrl = generateWhatsAppUrl(
        'Olá! Gostaria de agendar uma consulta oftalmológica.'
      );
      safeOpenUrl(whatsappUrl);

      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = t(
          'accessibility.whatsapp_clicked',
          'Abrindo WhatsApp para contato'
        );
      }
    } catch (error) {
      console.error('Error handling WhatsApp click:', error);
    }
  }, [generateWhatsAppUrl, t]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);

    try {
      sessionStorage.setItem('stickyCtaDismissed', 'true');
    } catch (error) {
      console.warn('Unable to save dismiss state:', error);
    }

    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = t(
        'accessibility.cta_dismissed',
        'Opção de agendamento foi removida'
      );
    }
  }, [t]);

  const toggleExpanded = useCallback(() => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    // Announce state change to screen readers
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = newExpanded
        ? t('accessibility.options_expanded', 'Opções de contato expandidas')
        : t('accessibility.options_collapsed', 'Opções de contato recolhidas');
    }

    // Focus management for better UX
    setTimeout(() => {
      if (newExpanded) {
        // Focus first interactive element when expanded
        const firstButton = document.querySelector('[data-cta-whatsapp]');
        firstButton?.focus();
      } else {
        // Return focus to expand button when collapsed
        expandButtonRef.current?.focus();
      }
    }, 150);
  }, [isExpanded, t]);

  if (!isVisible || isDismissed) return null;

  return (
    <>
      {/* Screen reader live region for announcements */}
      <div ref={liveRegionRef} aria-live="polite" aria-atomic="true" className="sr-only" />

      <AnimatePresence>
        <motion.aside
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-6 md:max-w-sm"
          role="complementary"
          aria-labelledby="sticky-cta-title"
          aria-describedby="sticky-cta-desc"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden backdrop-blur-sm">
            {/* Compact View */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3
                    id="sticky-cta-title"
                    className="font-bold text-slate-900 text-sm md:text-base"
                  >
                    {t('cta.sticky.title', 'Agende sua consulta')}
                  </h3>
                  <p id="sticky-cta-desc" className="text-slate-600 text-xs md:text-sm">
                    {t('cta.sticky.subtitle', 'Atendimento rápido e especializado')}
                  </p>
                </div>

                {/* Minimize/Expand Button */}
                <button
                  ref={expandButtonRef}
                  onClick={toggleExpanded}
                  className="p-2 hover:bg-slate-100 focus:bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-lg transition-colors ml-2"
                  aria-label={
                    isExpanded
                      ? t('accessibility.minimize_options', 'Minimizar opções de contato')
                      : t('accessibility.expand_options', 'Expandir opções de contato')
                  }
                  aria-expanded={isExpanded}
                  aria-controls="sticky-cta-expanded"
                >
                  <ChevronUp
                    size={16}
                    className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dismiss Button */}
                <button
                  ref={dismissButtonRef}
                  onClick={handleDismiss}
                  className="p-2 hover:bg-slate-100 focus:bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-lg transition-colors ml-1"
                  aria-label={t('accessibility.close_cta', 'Fechar opção de agendamento')}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              {/* Primary CTA - Always Visible */}
              <div className="mt-3">
                <Button
                  onClick={handleScheduleClick}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  aria-describedby="sticky-cta-desc"
                >
                  <Calendar size={18} className="mr-2" aria-hidden="true" />
                  {t('cta.sticky.schedule_online', 'Agendar Online')}
                </Button>
              </div>
            </div>

            {/* Expanded View */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  id="sticky-cta-expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-slate-100"
                  role="region"
                  aria-labelledby="sticky-cta-additional-title"
                >
                  <div className="p-4 bg-slate-50">
                    <p id="sticky-cta-additional-title" className="text-xs text-slate-600 mb-3">
                      {t('cta.sticky.or_contact', 'Ou fale conosco diretamente:')}
                    </p>

                    {/* Secondary CTA - WhatsApp */}
                    <Button
                      onClick={handleWhatsAppClick}
                      variant="outline"
                      size="sm"
                      data-cta-whatsapp
                      className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                      aria-describedby="sticky-cta-additional-title"
                    >
                      <MessageCircle size={16} className="mr-2" aria-hidden="true" />
                      {t('cta.sticky.whatsapp', 'WhatsApp')}
                    </Button>

                    {/* Quick Info - Improved accessibility */}
                    <div
                      className="mt-3 text-xs text-slate-500"
                      role="list"
                      aria-label={t('accessibility.contact_info', 'Informações de contato')}
                    >
                      <p role="listitem" className="flex items-center gap-1">
                        <MapPin size={12} aria-hidden="true" className="text-blue-600" />
                        <span className="sr-only">{t('accessibility.address', 'Endereço:')}</span>
                        {clinicInfo.address.street}, {clinicInfo.address.city}
                      </p>
                      <p role="listitem" className="flex items-center gap-1">
                        <Phone size={12} aria-hidden="true" className="text-blue-600" />
                        <span className="sr-only">{t('accessibility.phone', 'Telefone:')}</span>
                        {clinicInfo.phoneDisplay}
                      </p>
                      <p role="listitem" className="flex items-center gap-1">
                        <Clock size={12} aria-hidden="true" className="text-blue-600" />
                        <span className="sr-only">{t('accessibility.hours', 'Horário:')}</span>
                        {t('cta.sticky.hours', 'Segunda a Sexta, 8h às 18h')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* High contrast border for accessibility - Enhanced */}
          <div
            className="absolute inset-0 rounded-2xl border-2 border-blue-600 opacity-20 pointer-events-none"
            aria-hidden="true"
          />
        </motion.aside>
      </AnimatePresence>
    </>
  );
};

export default StickyScheduleCTA;
