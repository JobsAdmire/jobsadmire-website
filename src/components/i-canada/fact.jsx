import React, { useState } from 'react';
import { useRouter } from 'next/router';

// Import your translation files
import enTranslations from '../../../public/locales/en/canadaimmi.json';
import trTranslations from '../../../public/locales/tr/canadaimmi.json';
// import frTranslations from '../../../public/locales/fr/canadaimmi.json';
// import deTranslations from '../../../public/locales/de/canadaimmi.json';
// import arTranslations from '../../../public/locales/ar/canadaimmi.json';

const CanadaFacts = () => {
  const router = useRouter();
  const { locale } = router;
  
  const [activeFactIndex, setActiveFactIndex] = useState(0);

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
  const facts = t.canadafacts.facts;

  const handleNextFact = () => {
    setActiveFactIndex((prev) => (prev < facts.length - 1 ? prev + 1 : 0));
  };

  const handlePrevFact = () => {
    setActiveFactIndex((prev) => (prev > 0 ? prev - 1 : facts.length - 1));
  };

  return (
    <div className="bg-sky-50 w-full min-h-screen p-6">
      {/* Facts Display */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        {/* Fact Navigation Buttons */}
        <div className="flex overflow-x-auto bg-sky-100 p-2">
          {facts.map((fact, index) => (
            <button
              key={index}
              onClick={() => setActiveFactIndex(index)}
              className={`px-4 py-2 rounded-md mr-2 whitespace-nowrap ${
                activeFactIndex === index
                  ? 'bg-sky-600 text-white'
                  : 'bg-white text-sky-800 hover:bg-sky-50'
              }`}
              aria-label={`${t.canadafacts.accessibility.selectFact} ${index + 1}: ${fact.title}`}
            >
              <span className="mr-2">{fact.icon}</span>
              {fact.title}
            </button>
          ))}
        </div>
        
        {/* Current Fact */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4 bg-sky-100 p-3 rounded-full">
              {facts[activeFactIndex].icon}
            </span>
            <h2 className="text-2xl font-bold text-sky-800">
              {facts[activeFactIndex].title}
            </h2>
          </div>
          
          <p className="text-gray-700 text-lg mb-6">
            {facts[activeFactIndex].description}
          </p>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrevFact}
              className="px-4 py-2 bg-sky-100 text-sky-800 rounded-md hover:bg-sky-200"
              aria-label={t.canadafacts.accessibility.previousFact}
            >
              ← {t.canadafacts.navigation.previous}
            </button>
            
            <div className="flex space-x-1">
              {facts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFactIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    activeFactIndex === index ? 'bg-sky-600' : 'bg-sky-200'
                  }`}
                  aria-label={`${t.canadafacts.accessibility.goToFact} ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNextFact}
              className="px-4 py-2 bg-sky-100 text-sky-800 rounded-md hover:bg-sky-200"
              aria-label={t.canadafacts.accessibility.nextFact}
            >
              {t.canadafacts.navigation.next} →
            </button>
          </div>
        </div>
      </div>
      
      {/* All Facts List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-sky-800 mb-4">
          {t.canadafacts.allFactsSection.title}
        </h2>
        
        <div className="space-y-4">
          {facts.map((fact, index) => (
            <div 
              key={index}
              className={`p-4 border-l-4 border-sky-400 rounded-r-lg cursor-pointer transition-all duration-200 ${
                activeFactIndex === index ? 'bg-sky-50' : 'bg-white hover:bg-sky-50'
              }`}
              onClick={() => setActiveFactIndex(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveFactIndex(index);
                }
              }}
              aria-label={`${t.canadafacts.accessibility.selectFact} ${index + 1}: ${fact.title}`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{fact.icon}</span>
                <div>
                  <h3 className="font-medium text-sky-800">{fact.title}</h3>
                  <p className="text-gray-600 text-sm">{fact.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CanadaFacts;