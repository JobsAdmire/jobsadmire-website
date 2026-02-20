import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import enTranslations from '../../../public/locales/en/ukimmi.json';
// import frTranslations from '../../../public/locales/fr/ukimmmi.json';
// import deTranslations from '../../../public/locales/de/ukimmmi.json';
import trTranslations from '../../../public/locales/tr/ukimmi.json';
// import arTranslations from '../../../public/locales/ar/ukimmmi.json';



const UKJobGuide = () => {
  const { t } = useTranslation('common');
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
          <button className="bg-white/90 backdrop-blur-md border border-blue-200 text-blue-700 px-4 py-2 rounded-lg hover:bg-white transition-all duration-300 flex items-center space-x-2 shadow-md">
            <span className="text-sm font-medium">{localeNames[locale]}</span>
            <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="absolute top-full right-0 mt-2 bg-white backdrop-blur-md border border-blue-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[140px] z-50">
            {availableLocales.map((localeOption) => (
              <button
                key={localeOption}
                onClick={() => switchLanguage(localeOption)}
                className={`block w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors ${
                  locale === localeOption ? 'text-blue-600 font-medium bg-blue-50' : 'text-blue-700'
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

  // Render section content dynamically
  const renderSectionContent = (sectionData) => {
    const { type, content } = sectionData;
    
    switch (type) {
      case 'job-market':
        return (
          <div>
            <p className="text-gray-700 mb-4">{content.intro}</p>
            
            <h3 className="text-lg font-medium text-blue-600 mb-3">
              {content.sectorsTitle}
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {content.sectors.map((sector, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-all">
                  <span className="font-medium text-blue-700">{sector.name}</span>
                  <p className="text-sm text-gray-600 mt-1">{sector.description}</p>
                </li>
              ))}
            </ul>
            
            <p className="text-gray-700">{content.conclusion}</p>
          </div>
        );
      
      case 'visa-system':
        return (
          <div>
            <p className="text-gray-700 mb-4">{content.intro}</p>
            
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6">
              <h3 className="text-lg font-medium text-blue-700 mb-3">{content.routesTitle}</h3>
              <div className="space-y-4">
                {content.visaRoutes.map((route, index) => (
                  <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-medium text-blue-800">{route.name}</h4>
                    <p className="text-gray-700 text-sm mt-1">{route.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{content.requirement}</p>
          </div>
        );
      
      case 'sponsorship':
        return (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-blue-600 mb-3">{content.requirementsTitle}</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                {content.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            
            <div className={`flex flex-col md:flex-row gap-6 mb-6 ${locale === 'ar' ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 bg-blue-50 p-5 rounded-lg border border-blue-100">
                <h3 className="text-lg font-medium text-blue-700 mb-3">{content.shortageList.title}</h3>
                <p className="text-gray-700 mb-2">{content.shortageList.description}</p>
                <ul className="list-disc pl-6 text-gray-700">
                  {content.shortageList.occupations.map((occupation, index) => (
                    <li key={index}>{occupation}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex-1 bg-white p-5 rounded-lg border border-blue-100">
                <h3 className="text-lg font-medium text-blue-700 mb-3">{content.proTip.title}</h3>
                <p className="text-gray-700">{content.proTip.description}</p>
                <p className="text-gray-700 mt-3">{content.proTip.additional}</p>
              </div>
            </div>
          </div>
        );
      
      case 'application-process':
        return (
          <div>
            <h3 className="text-lg font-medium text-blue-600 mb-3">{content.stepsTitle}</h3>
            
            <div className="space-y-4 mb-6">
              {content.steps.map((step, index) => (
                <div key={index} className={`bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 ${locale === 'ar' ? 'border-r-4 border-l-0' : ''}`}>
                  <h4 className="font-medium text-blue-700">{step.title}</h4>
                  <p className="text-gray-700 text-sm mt-1">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-blue-700 mb-3">{content.cvTips.title}</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                {content.cvTips.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      case 'finding-jobs':
        return (
          <div>
            <h3 className="text-lg font-medium text-blue-600 mb-3">{content.portalsTitle}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {content.jobPortals.map((portal, index) => (
                <div key={index} className="bg-white p-4 rounded-lg text-center hover:bg-blue-50 border border-blue-100 transition-all shadow-sm hover:shadow">
                  {portal}
                </div>
              ))}
            </div>
            
            <div className={`flex flex-col md:flex-row gap-6 mb-6 ${locale === 'ar' ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 bg-white p-5 rounded-lg shadow-sm border border-blue-100">
                <h3 className="text-lg font-medium text-blue-600 mb-3">{content.recruitmentAgencies.title}</h3>
                <p className="text-gray-700">{content.recruitmentAgencies.description}</p>
              </div>
              
              <div className="flex-1 bg-white p-5 rounded-lg shadow-sm border border-blue-100">
                <h3 className="text-lg font-medium text-blue-600 mb-3">{content.directApplications.title}</h3>
                <p className="text-gray-700">{content.directApplications.description}</p>
              </div>
            </div>
          </div>
        );
      
      case 'cost-of-living':
        return (
          <div>
            <p className="text-gray-700 mb-4">{content.intro}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {content.locations.map((location, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                  <h3 className="text-lg font-medium text-blue-600 mb-2">{location.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                  <ul className="text-gray-700 space-y-1">
                    {location.costs.map((cost, costIndex) => (
                      <li key={costIndex}>
                        <span className="font-medium">{cost.category}:</span> {cost.amount}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-blue-700 mb-3">{content.additionalExpenses.title}</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {content.additionalExpenses.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      case 'healthcare':
        return (
          <div className="space-y-4 text-gray-700">
            <p>{content.intro}</p>
            <p>{content.coverage.description}</p>
            <ul className="list-disc pl-6 space-y-1">
              {content.coverage.includes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>{content.registration}</p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
              <p className="text-blue-700 font-medium">{content.note}</p>
            </div>
          </div>
        );
      
      case 'networking':
        return (
          <div>
            <p className="text-gray-700 mb-4">{content.intro}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                <h3 className="text-lg font-medium text-blue-600 mb-2">{content.online.title}</h3>
                <ul className="list-disc pl-6 text-gray-700">
                  {content.online.platforms.map((platform, index) => (
                    <li key={index}>{platform}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                <h3 className="text-lg font-medium text-blue-600 mb-2">{content.inPerson.title}</h3>
                <ul className="list-disc pl-6 text-gray-700">
                  {content.inPerson.events.map((event, index) => (
                    <li key={index}>{event}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <p className="text-gray-700">{content.advice}</p>
          </div>
        );
      
      default:
        return <div>{content}</div>;
    }
  };
  
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-sky-50 min-h-screen w-full font-sans relative ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Language Switcher */}
      
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <div className={`flex items-center justify-between ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div>
              <h1 className="text-4xl font-bold text-blue-700 mb-2">
                {t.jobGuide.header.title}
              </h1>
              <h2 className="text-xl text-blue-600">{t.jobGuide.header.subtitle}</h2>
            </div>
            <div className="hidden md:block">
              <img src="/api/placeholder/120/80" alt={t("labels.general.ukFlagAlt")} className="rounded-lg shadow-sm" />
            </div>
          </div>
          
          <div className="mt-8 text-gray-700 bg-blue-50 p-6 rounded-xl border border-blue-100">
            <p className="mb-3">{t.jobGuide.header.intro.paragraph1}</p>
            <p>{t.jobGuide.header.intro.paragraph2}</p>
          </div>
        </header>
        
        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">{t.jobGuide.navigation.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.jobGuide.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className={`text-left p-4 rounded-xl flex items-center border transition-all ${locale === 'ar' ? 'flex-row-reverse text-right' : ''} ${
                  activeSection === section.id 
                    ? 'bg-blue-100 border-blue-300 shadow-inner' 
                    : 'bg-white border-blue-100 hover:bg-blue-50 shadow-sm hover:shadow'
                }`}
              >
                <span className={`text-3xl ${locale === 'ar' ? 'ml-4' : 'mr-4'}`}>{section.icon}</span>
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Active Section */}
        {activeSection && (
          <div className="bg-white rounded-2xl shadow-md p-8 mb-10 animate-fadeIn">
            <h2 className={`text-2xl font-semibold text-blue-700 mb-6 flex items-center ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span className={`text-3xl ${locale === 'ar' ? 'ml-4' : 'mr-4'}`}>
                {t.jobGuide.sections.find(s => s.id === activeSection).icon}
              </span>
              {t.jobGuide.sections.find(s => s.id === activeSection).title}
            </h2>
            <div className="transition-all duration-500">
              {renderSectionContent(t.jobGuide.sections.find(s => s.id === activeSection))}
            </div>
            <div className={`mt-8 flex ${locale === 'ar' ? 'justify-start' : 'justify-end'}`}>
              <button 
                onClick={() => setActiveSection(null)}
                className={`text-blue-600 hover:text-blue-800 font-medium flex items-center ${locale === 'ar' ? 'flex-row-reverse' : ''}`}
              >
                {t.jobGuide.navigation.backToAll}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${locale === 'ar' ? 'mr-1 rotate-180' : 'ml-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* All Sections when nothing is active */}
        {!activeSection && (
          <div className="space-y-10">
            {t.jobGuide.sections.map((section) => (
              <div 
                key={section.id}
                className="bg-white rounded-2xl shadow-md p-8"
              >
                <h2 className={`text-2xl font-semibold text-blue-700 mb-6 flex items-center ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-3xl ${locale === 'ar' ? 'ml-4' : 'mr-4'}`}>{section.icon}</span>
                  {section.title}
                </h2>
                <div className="transition-all duration-500">
                  {renderSectionContent(section)}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Final Checklist */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl shadow-lg p-8 mb-10 text-white">
          <h2 className={`text-2xl font-semibold mb-6 flex items-center ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
            <span className={`text-3xl ${locale === 'ar' ? 'ml-4' : 'mr-4'}`}>✅</span>
            {t.jobGuide.checklist.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl">
              <h3 className="font-medium text-lg mb-3">{t.jobGuide.checklist.beforeApplying.title}</h3>
              <ul className="space-y-3">
                {t.jobGuide.checklist.beforeApplying.items.map((item, index) => (
                  <li key={index} className={`flex items-start ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-green-300 ${locale === 'ar' ? 'ml-2' : 'mr-2'} mt-1`}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl">
              <h3 className="font-medium text-lg mb-3">{t.jobGuide.checklist.duringSearch.title}</h3>
              <ul className="space-y-3">
                {t.jobGuide.checklist.duringSearch.items.map((item, index) => (
                  <li key={index} className={`flex items-start ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-green-300 ${locale === 'ar' ? 'ml-2' : 'mr-2'} mt-1`}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Conclusion */}
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <h2 className={`text-2xl font-semibold text-blue-700 mb-4 flex items-center justify-center ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
            <span className={`text-3xl ${locale === 'ar' ? 'ml-3' : 'mr-3'}`}>🌟</span>
            {t.jobGuide.conclusion.title}
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            {t.jobGuide.conclusion.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UKJobGuide;