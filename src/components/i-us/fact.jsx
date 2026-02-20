// components/USAFactsCard.jsx - DEBUG VERSION
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Flag, Map, Building, Globe, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/usaimmi.json';
import trTranslations from '../../../public/locales/tr/usaimmi.json';
import faTranslations from '../../../public/locales/fa/usaimmi.json';
import arTranslations from '../../../public/locales/ar/usaimmi.json';
import frTranslations from '../../../public/locales/fr/usaimmi.json';
import deTranslations from '../../../public/locales/de/usaimmi.json';
import ruTranslations from '../../../public/locales/ru/usaimmi.json';

const USAFactsCard = () => {
  const router = useRouter();
  const { locale } = router;
  const [activeFactIndex, setActiveFactIndex] = useState(0);

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case 'tr':
        return trTranslations;
      case 'fa':
        return faTranslations;
      case 'ar':
        return arTranslations;
      case 'fr':
        return frTranslations;
      case 'ru':
        return ruTranslations;
      case 'de':
        return deTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();
  const isRTL = locale === 'ar' || locale === 'fa'; // Added 'fa' for Persian

  // Debug logging
  useEffect(() => {
    console.log('🔍 USAFactsCard Debug Info:');
    console.log('Current locale:', locale);
    console.log('Translations object:', t);
    console.log('factsCard section:', t?.factsCard);
    console.log('Facts array:', t?.factsCard?.facts);
    console.log('Facts length:', t?.factsCard?.facts?.length);
    console.log('isRTL:', isRTL);
    
    // Check if facts exist and have the expected structure
    if (t?.factsCard?.facts && Array.isArray(t.factsCard.facts)) {
      console.log('✅ Facts array is valid');
      t.factsCard.facts.forEach((fact, index) => {
        console.log(`Fact ${index}:`, {
          title: fact?.title,
          emoji: fact?.emoji,
          description: fact?.description?.substring(0, 50) + '...'
        });
      });
    } else {
      console.log('❌ Facts array is missing or invalid');
    }
  }, [locale, t]);

  // Get localized facts with fallback
  const facts = t?.factsCard?.facts || [];

  // Debug: Log when facts change
  useEffect(() => {
    console.log('Facts updated:', facts.length, 'facts available');
  }, [facts]);

  // Icon mapping for facts
  const iconMap = {
    map: <Map className="h-6 w-6 text-blue-600" />,
    flag: <Flag className="h-6 w-6 text-blue-600" />,
    building: <Building className="h-6 w-6 text-blue-600" />,
    globe: <Globe className="h-6 w-6 text-blue-600" />,
    lightbulb: <Lightbulb className="h-6 w-6 text-blue-600" />
  };

  const handlePreviousFact = () => {
    setActiveFactIndex((prev) => (prev > 0 ? prev - 1 : facts.length - 1));
  };

  const handleNextFact = () => {
    setActiveFactIndex((prev) => (prev < facts.length - 1 ? prev + 1 : 0));
  };

  // Add error boundary for rendering
  if (!t || !t.factsCard) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <h3 className="text-red-700 font-semibold">Translation Error</h3>
        <p className="text-red-600">
          Missing factsCard translations for locale: {locale}
        </p>
        <pre className="text-xs mt-2 text-red-500">
          {JSON.stringify({ locale, hasTranslations: !!t, hasFactsCard: !!t?.factsCard }, null, 2)}
        </pre>
      </div>
    );
  }

  if (!facts || facts.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h3 className="text-yellow-700 font-semibold">No Facts Available</h3>
        <p className="text-yellow-600">
          Facts array is empty or missing for locale: {locale}
        </p>
        <pre className="text-xs mt-2 text-yellow-500">
          {JSON.stringify({ 
            locale, 
            factsCardExists: !!t?.factsCard,
            factsExists: !!t?.factsCard?.facts,
            factsLength: t?.factsCard?.facts?.length 
          }, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className={`bg-sky-50 w-full p-0 font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Debug info panel - remove in production */}
      <div className="bg-gray-100 p-2 text-xs border-l-4 border-blue-500 mb-4">
        <strong>Debug:</strong> Locale: {locale} | Facts: {facts.length} | isRTL: {isRTL.toString()}
      </div>

      <div className="w-full bg-white shadow-sm p-8">
        <p className="text-gray-700 mb-8">
          {t.factsCard.description || 'Description missing'}
        </p>
        
        {/* Fact Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.factsCard.navigation?.title || 'Navigation title missing'}
          </h2>
          <div className={`flex flex-wrap gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {facts.map((fact, index) => (
              <button 
                key={fact.id || index}
                onClick={() => setActiveFactIndex(index)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeFactIndex === index 
                    ? 'bg-sky-600 text-white' 
                    : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                }`}
                aria-label={t.factsCard.accessibility?.factButton?.replace('{title}', fact.title) || 'Select fact'}
              >
                <span className={`${isRTL ? 'ml-2' : 'mr-2'}`}>{fact.emoji}</span>
                {fact.title}
              </button>
            ))}
          </div>
        </div>
        
        {/* Current Fact Display */}
        <section className="mb-8 bg-sky-50 p-6 border border-sky-100 rounded-lg">
          <h2 className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className={`text-3xl ${isRTL ? 'ml-3' : 'mr-3'}`}>{facts[activeFactIndex]?.emoji}</span>
            {facts[activeFactIndex]?.title}
          </h2>
          
          <p className="text-gray-700 text-lg mb-6">
            <span dangerouslySetInnerHTML={{ __html: facts[activeFactIndex]?.description }}></span>
          </p>
          
          {/* Navigation buttons */}
          <div className={`flex justify-between pt-4 border-t border-sky-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button 
              onClick={handlePreviousFact}
              className={`text-sky-700 hover:text-sky-900 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={t.factsCard.accessibility?.previousFact || 'Previous fact'}
            >
              <ChevronLeft className={`w-5 h-5 ${isRTL ? 'ml-1 rotate-180' : 'mr-1'}`} />
              {t.factsCard.navigation?.previous || 'Previous'}
            </button>
            <button 
              onClick={handleNextFact}
              className={`text-sky-700 hover:text-sky-900 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}
              aria-label={t.factsCard.accessibility?.nextFact || 'Next fact'}
            >
              {t.factsCard.navigation?.next || 'Next'}
              <ChevronRight className={`w-5 h-5 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
            </button>
          </div>
        </section>
        
        {/* All Facts List */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.factsCard.allFacts?.title || 'All facts title missing'}
          </h2>
          
          {facts.map((fact, index) => (
            <div key={fact.id || index} className="mb-6">
              <h3 className={`text-lg font-medium text-sky-600 mb-2 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`text-xl ${isRTL ? 'ml-2' : 'mr-2'}`}>{fact.emoji}</span>
                {fact.title}
              </h3>
              <p className={`text-gray-700 ${isRTL ? 'pr-8' : 'pl-8'}`}>
                <span dangerouslySetInnerHTML={{ __html: fact.description }}></span>
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default USAFactsCard;