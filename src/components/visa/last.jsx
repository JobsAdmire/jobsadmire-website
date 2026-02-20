import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { CheckCircle, FileText, Euro, Home, Shield, DollarSign, Mail } from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/visarelocation.json';
import trTranslations from '../../../public/locales/tr/visarelocation.json';
import frTranslations from '../../../public/locales/fr/visarelocation.json';
import deTranslations from '../../../public/locales/de/visarelocation.json';
import arTranslations from '../../../public/locales/ar/visarelocation.json';
import ruTranslations from '../../../public/locales/ru/visarelocation.json';
import faTranslations from '../../../public/locales/fa/visarelocation.json';

const AdvantagesSection = () => {
  const router = useRouter();
  const { locale } = router;
  const { t: tCommon } = useTranslation('common');

  // Get translations based on current locale with safety checks
  const getTranslations = () => {
    let translations;
    
    try {
      switch (locale) {
        case 'tr':
          translations = trTranslations;
          break;
        case 'fa':
          translations = faTranslations;
          break;
        case 'ar':
          translations = arTranslations;
          break;
        case 'fr':
          translations = frTranslations;
          break;
        case 'ru':
          translations = ruTranslations;
          break;
        case 'de':
          translations = deTranslations;
          break;
        default:
          translations = enTranslations;
      }

      // Debug log for Persian specifically
      if (locale === 'fa') {
        console.log('Persian translations loaded:', translations);
        console.log('advantages structure:', translations?.advantages);
      }

      // Safety check - if translations are missing or malformed, fallback to English
      if (!translations || !translations.advantages) {
        console.warn(`Translations missing or malformed for locale: ${locale}. Falling back to English.`);
        return enTranslations;
      }

      return translations;
    } catch (error) {
      console.error(`Error loading translations for locale ${locale}:`, error);
      return enTranslations; // Fallback to English
    }
  };

  const t = getTranslations();

  // Icon mapping function
  const getIcon = (iconName) => {
    const iconMap = {
      'FileText': <FileText size={20} />,
      'Shield': <Shield size={20} />,
      'Euro': <Euro size={20} />,
      'Home': <Home size={20} />,
      'DollarSign': <DollarSign size={20} />
    };
    return iconMap[iconName] || <FileText size={20} />;
  };

  // Safety check for rendering - ensure all required data exists
  if (!t?.advantages) {
    return (
      <div className="py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">{tCommon("labels.visa.translationError")}</h2>
            <p className="text-gray-600">{tCommon("labels.visa.unableToLoad", { locale })}</p>
            <p className="text-sm text-gray-500">{tCommon("labels.visa.checkTranslationFiles")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-sky-700 to-blue-800 bg-clip-text">
            {t?.advantages?.title || 'Our Advantages'}
          </h2>
          {t?.advantages?.subtitle && (
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              {t.advantages.subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-stretch">
          {/* Left Section - Advantages */}
          <div className="lg:w-1/2 xl:w-7/12">
            <div className="space-y-4">
              {(t?.advantages?.items || []).map((advantage, index) => (
                <div 
                  key={index} 
                  className="flex items-start p-4 transition-all duration-300 border shadow-sm group bg-white/80 backdrop-blur-sm border-sky-100 rounded-xl hover:shadow-lg hover:bg-white hover:border-sky-200"
                >
                  <div className="p-2 mr-4 transition-all duration-300 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 text-sky-600 group-hover:from-sky-200 group-hover:to-blue-200 shrink-0">
                    {getIcon(advantage?.icon)}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                    {advantage?.text || `Advantage ${index + 1}`}
                  </p>
                </div>
              ))}
              
              <div className="flex justify-center pt-6 lg:justify-start">
                <a href="/contact-us">
                  <button className="flex items-center gap-2 px-5 py-3 font-semibold text-white transition-all duration-300 rounded-lg shadow-lg group bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 hover:shadow-xl">
                    <Mail size={18} />
                    <span>{t?.advantages?.cta?.text || 'Contact Us'}</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
          
          {/* Right Section - Enhanced Image */}
          <div className="lg:w-1/2 xl:w-5/12">
            <div className="relative h-full">
              {/* Decorative background elements */}
              <div className="absolute w-24 h-24 rounded-full -top-6 -right-6 bg-gradient-to-br from-sky-200/30 to-blue-300/30 blur-2xl"></div>
              <div className="absolute w-20 h-20 rounded-full -bottom-6 -left-6 bg-gradient-to-br from-indigo-200/30 to-purple-300/30 blur-xl"></div>
              
              {/* Main image container */}
              <div className="relative overflow-hidden transition-all duration-500 shadow-2xl rounded-3xl hover:shadow-3xl group">
                <img 
                  src={t?.advantages?.image?.src || '/api/placeholder/600/600'}
                  alt={t?.advantages?.image?.alt || 'Advantages Image'}
                  className="object-cover w-full h-[600px] group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/600/600';
                  }}
                />
                
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-transparent to-transparent"></div>
                <div className="absolute inset-0 transition-all duration-500 bg-gradient-to-br from-transparent via-transparent to-blue-900/20 group-hover:to-blue-900/30"></div>
                
                {/* Animated border effect */}
                <div className="absolute inset-0 transition-opacity duration-500 border-2 opacity-0 rounded-3xl border-gradient-to-r from-sky-400/0 via-sky-400/50 to-sky-400/0 group-hover:opacity-100"></div>
              </div>
              
              {/* Side floating icons */}
              <div className="absolute flex items-center justify-center w-12 h-12 delay-300 rounded-full shadow-lg -right-4 top-1/3 bg-white/90 backdrop-blur-sm animate-bounce">
                <CheckCircle size={20} className="text-emerald-500" />
              </div>
              
              <div className="absolute flex items-center justify-center w-12 h-12 delay-700 rounded-full shadow-lg -left-4 bottom-1/3 bg-white/90 backdrop-blur-sm animate-bounce">
                <FileText size={20} className="text-sky-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvantagesSection;