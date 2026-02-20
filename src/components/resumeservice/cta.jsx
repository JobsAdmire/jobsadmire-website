import React from 'react';
import { useRouter } from 'next/router';

// Import your translation files
import enTranslations from '../../../public/locales/en/resumeservice.json';
import trTranslations from '../../../public/locales/tr/resumeservice.json';
import frTranslations from '../../../public/locales/fr/resumeservice.json';
import deTranslations from '../../../public/locales/de/resumeservice.json';
import arTranslations from '../../../public/locales/ar/resumeservice.json';
import ruTranslations from '../../../public/locales/ru/resumeservice.json';
import faTranslations from '../../../public/locales/fa/resumeservice.json';


const ResumeHRSection = () => {
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
      case 'fa':
        return faTranslations;
      case 'de':
        return deTranslations;
         case 'ru':
                return ruTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  return (
    <div className="relative w-full py-16 overflow-hidden bg-gradient-to-b from-white to-sky-50">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0" 
           style={{
             backgroundImage: `
               linear-gradient(to right, rgba(186, 230, 253, 0.3) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(186, 230, 253, 0.3) 1px, transparent 1px)
             `,
             backgroundSize: '40px 40px',
             backgroundPosition: '0 0'
           }}>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 rounded-full w-96 h-96 bg-sky-100 opacity-40 blur-3xl translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 bg-blue-100 rounded-full w-96 h-96 opacity-40 blur-3xl -translate-x-1/3"></div>
      
      <div className="container relative z-10 px-4 mx-auto">
        {/* Main Text Section */}
        <div className="max-w-5xl mx-auto mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-800 md:text-5xl">
            {t.resumeservice.hrSection.headline.prefix} <span className="font-extrabold">{t.resumeservice.hrSection.headline.understand}</span> {t.resumeservice.hrSection.headline.what} <span className="font-extrabold">{t.resumeservice.hrSection.headline.hrManagers}</span> {t.resumeservice.hrSection.headline.in} <span className="font-extrabold">{t.resumeservice.hrSection.headline.sectors}</span> {t.resumeservice.hrSection.headline.lookFor},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">{t.resumeservice.hrSection.headline.enabling}</span>{' '}
            {t.resumeservice.hrSection.headline.from} <span className="font-bold">{t.resumeservice.hrSection.headline.atsApproved}</span> {t.resumeservice.hrSection.headline.to} <span className="font-bold">{t.resumeservice.hrSection.headline.interviewBooked}</span>
          </h2>
          
          <p className="max-w-3xl mx-auto mb-8 text-lg text-gray-600">
            {t.resumeservice.hrSection.description}
          </p>
        </div>
        
        {/* Resume Visualization */}
        <div className="relative max-w-4xl mx-auto">
          {/* Light blue backdrop */}
          <div className="absolute inset-0 bg-sky-100 rounded-3xl -right-12 -bottom-12"></div>
          
          {/* Resume document */}
          <div className="relative p-8 bg-white border border-gray-100 shadow-xl rounded-xl">
            <div className="space-y-10">
              {t.resumeservice.hrSection.resumeSections.map((section, index) => (
                <div key={index} className="flex items-center gap-6">
                  {section.position === 'right' ? (
                    <>
                      <div className="w-1/3">
                        <div className="relative">
                          <div className="flex justify-end">
                            <div className="absolute right-0 transform translate-x-full top-1/2">
                              <svg width="100" height="30" className="overflow-visible">
                                <path d="M0,15 H85" stroke={section.type === 'positive' ? '#38BDF8' : '#F87171'} strokeWidth="2" fill="none"/>
                                <circle cx="92" cy="15" r="7" fill={section.type === 'positive' ? '#38BDF8' : '#F87171'}/>
                              </svg>
                            </div>
                            <div className={`p-3 pr-6 text-right border rounded-lg ${section.type === 'positive' ? 'bg-sky-50 border-sky-200' : 'bg-red-50 border-red-200'}`}>
                              <p className="text-sm font-medium text-gray-700">{section.comment}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-2/3">
                        <div className={`p-4 border rounded-lg ${section.type === 'positive' ? 'border-sky-200 bg-sky-50' : 'border-red-200'}`}>
                          <div className="w-full h-2 mb-3 bg-gray-200 rounded"></div>
                          <div className="w-3/4 h-2 mb-3 bg-gray-200 rounded"></div>
                          <div className="w-full h-2 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-2/3">
                        <div className={`p-4 border rounded-lg ${section.type === 'positive' ? 'border-sky-200 bg-sky-50' : 'border-red-200'}`}>
                          <div className="w-full h-2 mb-3 bg-gray-200 rounded"></div>
                          <div className="w-3/4 h-2 mb-3 bg-gray-200 rounded"></div>
                          <div className="w-full h-2 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      
                      <div className="w-1/3">
                        <div className="relative">
                          <div className="flex justify-start">
                            <div className="absolute left-0 transform -translate-x-full top-1/2">
                              <svg width="100" height="30" className="overflow-visible">
                                <path d="M15,15 H100" stroke={section.type === 'positive' ? '#38BDF8' : '#F87171'} strokeWidth="2" fill="none"/>
                                <circle cx="8" cy="15" r="7" fill={section.type === 'positive' ? '#38BDF8' : '#F87171'}/>
                              </svg>
                            </div>
                            <div className={`p-3 pl-6 text-left border rounded-lg ${section.type === 'positive' ? 'bg-sky-50 border-sky-200' : 'bg-red-50 border-red-200'}`}>
                              <p className="text-sm font-medium text-gray-700">{section.comment}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {/* Bottom lines */}
              <div className="mt-4">
                <div className="w-full h-2 mb-3 bg-gray-200 rounded"></div>
                <div className="w-5/6 h-2 mb-3 bg-gray-200 rounded"></div>
                <div className="w-full h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Get Your Resume Now button */}
        <div className="mt-12 text-center">
         <a href='/resume-generator'> <button className="px-8 py-3 font-medium text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-sky-500 to-blue-500 hover:shadow-xl hover:-translate-y-1">
            {t.resumeservice.hrSection.cta.text}
          </button> </a>
        </div>
      </div>
    </div>
  );
};

export default ResumeHRSection;