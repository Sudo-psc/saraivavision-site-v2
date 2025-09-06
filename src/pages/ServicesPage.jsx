import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import SchemaMarkup from '@/components/SchemaMarkup';
import Services from '@/components/Services';
import { useTranslation } from 'react-i18next';

const ServicesPage = () => {
  const { t } = useTranslation();
  const seo = {
    title: t('services.title') + ' | Saraiva Vision',
    description: t('services.subtitle'),
    keywords: 'oftalmologia, serviços, consultas, exames, cirurgias',
  };

  const pageInfo = {
    url: '/servicos',
    title: seo.title,
    description: seo.description,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead {...seo} />
      <SchemaMarkup 
        type="webpage" 
        pageInfo={pageInfo}
      />
      <Navbar />
      <main className="flex-1 pt-28">
        <Services full />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
