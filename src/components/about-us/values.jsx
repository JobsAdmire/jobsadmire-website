import React from 'react';
import { useRouter } from 'next/router';

// Import your translation files
import enTranslations from '../../../public/locales/en/about.json';
import trTranslations from '../../../public/locales/tr/about.json';
import arTranslations from '../../../public/locales/ar/about.json';
import frTranslations from '../../../public/locales/fr/about.json';
import deTranslations from '../../../public/locales/de/about.json';
import ruTranslations from '../../../public/locales/ru/about.json';
import faTranslations from '../../../public/locales/fa/about.json';
const CompanyValues = () => {
  const router = useRouter();
  const { locale } = router;

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

  return (
    <div className="px-4 py-20 bg-gradient-to-br from-sky-50 via-sky-100 to-sky-50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
               {t.values.header.title}
            </span>
          </h1>
          <p className="max-w-3xl mx-auto mt-8 text-xl text-sky-700">
            {t.values.header.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {t.values.items.map((value) => (
            <div 
              key={value.id} 
              className="relative group"
            >
              {/* Top curved section */}
              <div className="absolute inset-x-0 top-0 z-10 h-12 bg-white rounded-t-3xl"></div>
              
              {/* Image container - oval shaped */}
              <div className="relative z-20 flex justify-center -mt-6">
                <div className="w-40 h-40 overflow-hidden transition-all duration-500 border-4 border-white rounded-full shadow-xl group-hover:shadow-sky-300">
                  <img 
                    src={value.image} 
                    alt={value.title} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
              
              {/* Main card body */}
              <div className="relative z-10 px-6 pt-20 pb-8 -mt-16 transition-all duration-500 bg-white shadow-lg rounded-3xl group-hover:shadow-xl group-hover:shadow-sky-200">
                <div className="absolute flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full top-4 right-4 bg-sky-100 group-hover:bg-sky-500 group-hover:scale-110">
                  <span className="font-bold transition-colors duration-300 text-sky-700 group-hover:text-white">{value.id}</span>
                </div>
                
                <h3 className="mb-4 text-2xl font-bold text-center transition-colors duration-300 text-sky-800 group-hover:text-sky-600">
                  {value.title}
                </h3>
                
                <div className="w-12 h-1 mx-auto mb-4 transition-all duration-300 rounded-full bg-sky-300 group-hover:bg-sky-500"></div>
                
                <p className="text-center text-sky-700">
                  {value.description}
                </p>
                
                <div className="flex justify-center mt-6">
                  <span className="flex items-center justify-center w-8 h-8 transition-all duration-500 transform translate-y-4 rounded-full opacity-0 bg-sky-50 group-hover:opacity-100 group-hover:translate-y-0">
                    <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute z-0 w-20 h-20 transition-opacity duration-500 rounded-full opacity-0 -right-4 -bottom-4 bg-sky-100 group-hover:opacity-30"></div>
              <div className="absolute z-0 w-12 h-12 transition-opacity duration-500 rounded-full opacity-0 -left-2 top-1/2 bg-sky-200 group-hover:opacity-30"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyValues;