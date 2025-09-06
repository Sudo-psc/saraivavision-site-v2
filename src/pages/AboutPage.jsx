import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import SchemaMarkup from '@/components/SchemaMarkup';
import About from '@/components/About';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();
  const seo = {
    title: t('homeMeta.title'),
    description: t('homeMeta.description'),
    keywords: t('homeMeta.keywords'),
  };

  const pageInfo = {
    url: '/sobre',
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
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;

