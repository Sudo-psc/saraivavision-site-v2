import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, MessageCircle, X, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clinicInfo } from '@/lib/clinicInfo';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { safeOpenUrl } from '@/utils/safeNavigation';

const StickyScheduleCTA = () => {
  const { t } = useTranslation();
  const { generateWhatsAppUrl } = useWhatsApp();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling past the hero section (approximately 600px)
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 600 && !isDismissed);
    };

    // Check if user previously dismissed this session
    const dismissed = sessionStorage.getItem('stickyCtaDismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleScheduleClick = () => {
    const validUrl = clinicInfo.validateSchedulingUrl();
    if (validUrl) {
      safeOpenUrl(validUrl);
    } else {
      console.error('Scheduling URL validation failed');
    }
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = generateWhatsAppUrl('Olá! Gostaria de agendar uma consulta oftalmológica.');
    safeOpenUrl(whatsappUrl);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('stickyCtaDismissed', 'true');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-6 md:max-w-sm"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden backdrop-blur-sm">
          {/* Compact View */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  {t('cta.sticky.title', 'Agende sua consulta')}
                </h3>
                <p className="text-slate-600 text-xs md:text-sm">
                  {t('cta.sticky.subtitle', 'Atendimento rápido e especializado')}
                </p>
              </div>
              
              {/* Minimize/Expand Button */}
              <button
                onClick={toggleExpanded}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors ml-2"
                aria-label={isExpanded ? 'Minimizar' : 'Expandir opções'}
              >
                <ChevronUp 
                  size={16} 
                  className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors ml-1"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>

            {/* Primary CTA - Always Visible */}
            <div className="mt-3">
              <Button
                onClick={handleScheduleClick}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calendar size={18} className="mr-2" />
                {t('cta.sticky.schedule_online', 'Agendar Online')}
              </Button>
            </div>
          </div>

          {/* Expanded View */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-slate-100"
              >
                <div className="p-4 bg-slate-50">
                  <p className="text-xs text-slate-600 mb-3">
                    {t('cta.sticky.or_contact', 'Ou fale conosco diretamente:')}
                  </p>
                  
                  {/* Secondary CTA - WhatsApp */}
                  <Button
                    onClick={handleWhatsAppClick}
                    variant="outline"
                    size="sm"
                    className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                  >
                    <MessageCircle size={16} className="mr-2" />
                    {t('cta.sticky.whatsapp', 'WhatsApp')}
                  </Button>

                  {/* Quick Info */}
                  <div className="mt-3 text-xs text-slate-500">
                    <p>📍 {clinicInfo.address.street}, {clinicInfo.address.city}</p>
                    <p>📞 {clinicInfo.phoneDisplay}</p>
                    <p>⏰ {t('cta.sticky.hours', 'Segunda a Sexta, 8h às 18h')}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* High contrast border for accessibility */}
        <div className="absolute inset-0 rounded-2xl border-2 border-blue-600 opacity-20 pointer-events-none"></div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StickyScheduleCTA;