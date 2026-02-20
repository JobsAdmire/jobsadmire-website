import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Import your translation files
import enTranslations from '../../../public/locales/en/about.json';
import trTranslations from '../../../public/locales/tr/about.json';
import arTranslations from '../../../public/locales/ar/about.json';
import frTranslations from '../../../public/locales/fr/about.json';
import deTranslations from '../../../public/locales/de/about.json';
import ruTranslations from '../../../public/locales/ru/about.json';
import faTranslations from '../../../public/locales/fa/about.json';

const WhatWeDoSection = () => {
  const router = useRouter();
  const { locale } = router;
  const [activeTab, setActiveTab] = useState('candidates');
  const [animateContent, setAnimateContent] = useState(true);
  const [animateImage, setAnimateImage] = useState(true);

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
          case 'tr':
            return trTranslations;
          case 'ar':
            return arTranslations;
          case 'fr':
            return frTranslations;
          case 'ru':
            return ruTranslations;
          case 'de':
            return deTranslations;
          case 'fa':
            return faTranslations;
          default:
            return enTranslations;
        }
  };

  const t = getTranslations();

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    
    setAnimateContent(false);
    setAnimateImage(false);
    
    setTimeout(() => {
      setActiveTab(tab);
      setAnimateContent(true);
      setAnimateImage(true);
    }, 300);
  };

  useEffect(() => {
    // Initialize animations on load
    setAnimateContent(true);
    setAnimateImage(true);
  }, []);

  return (
    <div className="px-4 py-20 overflow-hidden bg-gradient-to-r from-sky-50 to-blue-50 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
         
           <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
               {t.whatwedo.header.title}
            </span>
          </h1>
        </div>

        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Content Section */}
          <div className="order-2 w-full lg:w-1/2 lg:order-1">
            {/* Tab Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {Object.keys(t.whatwedo.tabs).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 relative ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-white text-sky-700 hover:bg-sky-100'
                  }`}
                >
                  {t.whatwedo.tabs[tab].title}
                  {activeTab === tab && (
                    <span className="absolute w-2 h-2 transform -translate-x-1/2 bg-white rounded-full -bottom-1 left-1/2"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="relative overflow-hidden min-h-[200px]">
              <div
                className={`transition-all duration-500 ${
                  animateContent
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-0 transform translate-y-8'
                }`}
              >
                <h3 className="mb-4 text-2xl font-semibold text-sky-800">
                  {t.whatwedo.tabs[activeTab].title}
                </h3>
                <p className="leading-relaxed text-sky-700">
                  {t.whatwedo.tabs[activeTab].content}
                </p>

               <a href='/contact-us'>  <button className="flex items-center gap-2 px-6 py-3 mt-8 text-white transition-all duration-300 transform rounded-full shadow-md bg-sky-700 hover:bg-sky-800 hover:shadow-lg hover:-translate-y-1">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  {t.whatwedo.cta.text}
                </button>  </a> 
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative order-1 w-full lg:w-1/2 lg:order-2">
            <div className="relative overflow-hidden rounded-full w-[320px] h-[320px] md:w-[400px] md:h-[400px] mx-auto">
              {/* Decorative rings */}
              <div className="absolute inset-0 border-[15px] border-blue-100/50 rounded-full animate-pulse"></div>
              <div className="absolute inset-[15px] border-[10px] border-sky-200/50 rounded-full"></div>
              
              {/* The image */}
              <div 
                className={`absolute inset-[30px] rounded-full overflow-hidden transition-all duration-500 ${
                  animateImage 
                    ? 'opacity-100 transform scale-100' 
                    : 'opacity-0 transform scale-90'
                }`}
              >
                <img 
                  src={t.whatwedo.tabs[activeTab].image} 
                  alt={t.whatwedo.tabs[activeTab].title} 
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute w-12 h-12 rounded-full -top-4 -right-4 bg-blue-500/20 animate-bounce"></div>
              <div className="absolute w-16 h-16 delay-700 rounded-full -bottom-6 -left-6 bg-sky-300/30 animate-pulse"></div>
              <div className="absolute w-8 h-8 rounded-full top-1/2 -right-8 bg-sky-400/20 animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDoSection;