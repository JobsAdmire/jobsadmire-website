import React, { useState } from 'react';
import { useRouter } from 'next/router';

// Import your translation files
import enTranslations from '../../../public/locales/en/ukimmi.json';
// import frTranslations from '../../../public/locales/fr/ukimmmi.json';
// import deTranslations from '../../../public/locales/de/ukimmmi.json';
import trTranslations from '../../../public/locales/tr/ukimmi.json';
// import arTranslations from '../../../public/locales/ar/ukimmmi.json';




const UKMovingCostsGuide = () => {
  const router = useRouter();
  const { locale } = router;
  
  const [activeSection, setActiveSection] = useState(null);

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      // case 'fr':
      //   return frTranslations;
      // case 'de':
      //   return deTranslations;
      //   case 'ar':
      //     return arTranslations;
          case 'tr':
            return trTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();
  const costSections = t.costsGuide.sections;

  // Language switcher component
  const LanguageSwitcher = () => {
    const availableLocales = ['en', 'fr', 'de', 'es', 'ar'];
    const localeNames = {
      en: 'English',
      fr: 'Français', 
      de: 'Deutsch',
      es: 'Español',
      ar: 'العربية'
    };

    const switchLanguage = (newLocale) => {
      router.push(router.pathname, router.asPath, { locale: newLocale });
    };

    return (
      <div className="absolute top-4 right-4 z-30">
        <div className="relative group">
          <button className="bg-white/90 backdrop-blur-md border border-sky-200 text-sky-700 px-4 py-2 rounded-lg hover:bg-white transition-all duration-300 flex items-center space-x-2 shadow-md">
            <span className="text-sm font-medium">{localeNames[locale]}</span>
            <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="absolute top-full right-0 mt-2 bg-white backdrop-blur-md border border-sky-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[140px] z-50">
            {availableLocales.map((localeOption) => (
              <button
                key={localeOption}
                onClick={() => switchLanguage(localeOption)}
                className={`block w-full text-left px-4 py-3 text-sm hover:bg-sky-50 transition-colors ${
                  locale === localeOption ? 'text-sky-600 font-medium bg-sky-50' : 'text-sky-700'
                } first:rounded-t-lg last:rounded-b-lg`}
              >
                {localeNames[localeOption]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`bg-gradient-to-br from-sky-50 to-blue-50 w-full p-6 font-sans relative ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Language Switcher */}
      <LanguageSwitcher />
      
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">
            {t.costsGuide.title}
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {t.costsGuide.description}
          </p>
        </div>
        
        {/* Cost Breakdown Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {costSections.map((section) => (
            <div 
              key={section.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div 
                className={`flex justify-between items-center p-5 cursor-pointer ${locale === 'ar' ? 'flex-row-reverse' : ''}`}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              >
                <div className={`flex items-center ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className={`${section.color} text-white p-4 rounded-lg ${locale === 'ar' ? 'ml-5' : 'mr-5'}`}>
                    <span className="text-2xl">{section.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-sky-900">{section.title}</h2>
                    {section.details && <p className="text-gray-600 mt-1">{section.details}</p>}
                  </div>
                </div>
                <div className={`flex items-center ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className={`text-${locale === 'ar' ? 'left' : 'right'} ${locale === 'ar' ? 'ml-4' : 'mr-4'}`}>
                    <span className="font-bold text-xl text-sky-800">{section.amount}</span>
                  </div>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${activeSection === section.id ? 'bg-sky-100' : 'bg-white'}`}>
                    <svg 
                      className={`w-5 h-5 text-sky-600 transform transition-all duration-300 ${activeSection === section.id ? 'rotate-180' : ''} ${locale === 'ar' ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Expandable Details */}
              {section.subItems && (
                <div 
                  className={`bg-gradient-to-r from-sky-50 to-blue-50 overflow-hidden transition-all duration-300 ${
                    activeSection === section.id ? 'max-h-96 py-4 px-6' : 'max-h-0'
                  }`}
                >
                  <div className="space-y-4">
                    {section.subItems.map((item, index) => (
                      <div key={index} className={`flex justify-between items-center py-2 border-b border-sky-100 last:border-0 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-gray-800">{item.title}</span>
                        <span className="font-semibold text-sky-800">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Total Cost Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className={`text-2xl font-bold text-sky-900 mb-6 flex items-center ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
            <span className={`text-3xl ${locale === 'ar' ? 'ml-3' : 'mr-3'}`}>💷</span>
            {t.costsGuide.totalCosts.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.costsGuide.totalCosts.options.map((option, index) => (
              <div 
                key={index}
                className={`${option.featured ? 'bg-gradient-to-br from-sky-100 to-blue-100 border-sky-200 transform scale-105 shadow-md' : 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-100'} p-6 rounded-xl border`}
              >
                <div className="text-center mb-3">
                  <h3 className="font-semibold text-sky-800 text-lg">{option.title}</h3>
                  <span className="block text-2xl font-bold text-sky-900 mt-2">{option.amount}</span>
                </div>
                <p className="text-gray-700 text-center text-sm">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Money-Saving Tips */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h2 className={`text-2xl font-bold text-sky-900 mb-6 flex items-center ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
            <span className={`text-3xl ${locale === 'ar' ? 'ml-3' : 'mr-3'}`}>💰</span>
            {t.costsGuide.savingTips.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.costsGuide.savingTips.tips.map((tip, index) => (
              <div key={index} className={`bg-gradient-to-r from-sky-50 to-blue-50 p-5 rounded-lg border-l-4 border-sky-400 ${locale === 'ar' ? 'border-r-4 border-l-0' : ''}`}>
                <h3 className="font-semibold text-sky-800 mb-2">{tip.title}</h3>
                <p className="text-gray-700">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional Tips Section */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl shadow-lg p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-6">{t.costsGuide.considerations.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.costsGuide.considerations.items.map((item, index) => (
              <div key={index} className={`flex items-start ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`bg-white p-2 rounded-lg ${locale === 'ar' ? 'ml-4' : 'mr-4'}`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Conclusion */}
        <div className="text-center py-6 px-4 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-sky-900 mb-4">{t.costsGuide.conclusion.title}</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {t.costsGuide.conclusion.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UKMovingCostsGuide;