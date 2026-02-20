import React, { useState } from 'react';
import { useRouter } from 'next/router';

// Import your translation files
import enTranslations from '../../../public/locales/en/canadaimmi.json';
import trTranslations from '../../../public/locales/tr/canadaimmi.json';
// import frTranslations from '../../../public/locales/fr/canadaimmi.json';
// import deTranslations from '../../../public/locales/de/canadaimmi.json';
// import arTranslations from '../../../public/locales/ar/canadaimmi.json';


const MovingWithPetsToCanada = () => {
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

  const renderRequirementsContent = () => (
    <div className="space-y-4">
      {t.movingwithpets.sections.requirements.steps.map((step, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
          <h3 className="text-lg font-medium text-blue-700 mb-2 flex items-center">
            <span className="mr-2">{index + 1}.</span>{step.title}
          </h3>
          {step.description && <p className="text-gray-700">{step.description}</p>}
          {step.details && (
            <ul className="text-gray-700 space-y-2 mt-2">
              {step.details.map((detail, detailIndex) => (
                <li key={detailIndex} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-lg font-medium text-blue-700 mb-2 flex items-center">
          <span className="mr-2">ℹ️</span>{t.movingwithpets.sections.requirements.importantNote.title}
        </h3>
        <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: t.movingwithpets.sections.requirements.importantNote.text }}></p>
      </div>
    </div>
  );

  const renderDogSpecificContent = () => (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-blue-700 mb-3">
          {t.movingwithpets.sections.dogSpecific.breedRestrictions.title}
        </h3>
        <p className="text-gray-700 mb-3">
          {t.movingwithpets.sections.dogSpecific.breedRestrictions.description}
        </p>
        
        <div className="bg-red-50 p-3 rounded-md border border-red-100 mb-3">
          <h4 className="font-medium text-red-700 mb-1">
            {t.movingwithpets.sections.dogSpecific.breedRestrictions.restrictedTitle}
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
            {t.movingwithpets.sections.dogSpecific.breedRestrictions.breeds.map((breed, index) => (
              <li key={index} className="flex items-center">
                <span className="text-red-500 mr-2">•</span>
                <span>{breed}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <p className="text-sm text-gray-600 italic">
          {t.movingwithpets.sections.dogSpecific.breedRestrictions.note}
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-blue-700 mb-2">
          {t.movingwithpets.sections.dogSpecific.commercialDogs.title}
        </h3>
        <p className="text-gray-700">
          {t.movingwithpets.sections.dogSpecific.commercialDogs.description}
        </p>
      </div>
    </div>
  );

  const renderCatSpecificContent = () => (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <p className="text-gray-700 mb-4">
        {t.movingwithpets.sections.catSpecific.goodNews}
      </p>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
        <h3 className="font-medium text-blue-700 mb-2">
          {t.movingwithpets.sections.catSpecific.basicRequirements.title}
        </h3>
        <ul className="space-y-2 text-gray-700">
          {t.movingwithpets.sections.catSpecific.basicRequirements.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <p className="text-gray-700 italic">
        {t.movingwithpets.sections.catSpecific.noBreedRestrictions}
      </p>
    </div>
  );

  const renderTravelOptionsContent = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {t.movingwithpets.sections.travelOptions.options.map((option, index) => (
          <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-blue-50">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <span className="text-xl" role="img" aria-label={option.ariaLabel}>{option.icon}</span>
            </div>
            <h3 className="font-medium text-blue-700 mb-2">{option.title}</h3>
            <p className="text-gray-700">{option.description}</p>
            <p className="text-blue-600 text-sm mt-2 font-medium">
              {option.fee}
            </p>
          </div>
        ))}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
        <p className="text-yellow-800 flex items-start">
          <span className="text-yellow-500 mr-2 text-xl">⚠️</span>
          <span>{t.movingwithpets.sections.travelOptions.warning}</span>
        </p>
      </div>
    </div>
  );

  const renderAfterArrivalContent = () => (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="font-medium text-blue-700 mb-3 flex items-center">
          <span className="mr-2">🛂</span>{t.movingwithpets.sections.afterArrival.atTheBorder.title}
        </h3>
        <p className="text-gray-700 mb-3">
          {t.movingwithpets.sections.afterArrival.atTheBorder.description}
        </p>
        <ul className="space-y-2 text-gray-700">
          {t.movingwithpets.sections.afterArrival.atTheBorder.steps.map((step, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="font-medium text-blue-700 mb-3 flex items-center">
          <span className="mr-2">📝</span>{t.movingwithpets.sections.afterArrival.firstWeekChecklist.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {t.movingwithpets.sections.afterArrival.firstWeekChecklist.items.map((item, index) => (
            <div key={index} className="bg-blue-50 p-3 rounded-md">
              <span className="font-medium text-blue-700">{item.title}</span>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCanadianClimateContent = () => (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <p className="text-gray-700 mb-4">
        {t.movingwithpets.sections.canadianClimate.description}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {t.movingwithpets.sections.canadianClimate.seasons.map((season, index) => (
          <div key={index} className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-700 mb-2 flex items-center">
              <span className="mr-2">{season.icon}</span>{season.title}
            </h3>
            <ul className="space-y-2 text-gray-700">
              {season.tips.map((tip, tipIndex) => (
                <li key={tipIndex} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="bg-red-50 p-3 rounded-md border border-red-100">
        <p className="text-red-800 text-sm flex items-start">
          <span className="text-red-500 mr-2">⚠️</span>
          <span dangerouslySetInnerHTML={{ __html: t.movingwithpets.sections.canadianClimate.warning }}></span>
        </p>
      </div>
    </div>
  );

  const renderPetFriendlyContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.movingwithpets.sections.petFriendly.description}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {t.movingwithpets.sections.petFriendly.aspects.map((aspect, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-blue-700 mb-2 flex items-center">
              <span className="mr-2">{aspect.icon}</span>{aspect.title}
            </h3>
            <p className="text-gray-700">{aspect.description}</p>
            {aspect.additionalInfo && (
              <p className="text-sm text-blue-600 mt-2">{aspect.additionalInfo}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const sections = [
    {
      id: "requirements",
      icon: "✅",
      title: t.movingwithpets.sections.requirements.title,
      content: renderRequirementsContent()
    },
    {
      id: "dog-specific",
      icon: "🐕",
      title: t.movingwithpets.sections.dogSpecific.title,
      content: renderDogSpecificContent()
    },
    {
      id: "cat-specific",
      icon: "🐱",
      title: t.movingwithpets.sections.catSpecific.title,
      content: renderCatSpecificContent()
    },
    {
      id: "travel-options",
      icon: "✈️",
      title: t.movingwithpets.sections.travelOptions.title,
      content: renderTravelOptionsContent()
    },
    {
      id: "after-arrival",
      icon: "🏠",
      title: t.movingwithpets.sections.afterArrival.title,
      content: renderAfterArrivalContent()
    },
    {
      id: "canadian-climate",
      icon: "❄️",
      title: t.movingwithpets.sections.canadianClimate.title,
      content: renderCanadianClimateContent()
    },
    {
      id: "pet-friendly",
      icon: "🍁",
      title: t.movingwithpets.sections.petFriendly.title,
      content: renderPetFriendlyContent()
    }
  ];
  
  return (
    <div className="bg-blue-50 w-full font-sans">
      <div className="max-w-full px-4 md:px-8 py-8 mx-auto">
        {/* Navigation */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            {t.movingwithpets.navigation.title}
          </h2>
          <div className="flex flex-wrap gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id === activeSection ? null : section.id)}
                className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
                aria-label={`${t.movingwithpets.accessibility.toggleSection} ${section.title}`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 gap-8">
          {sections.map((section) => (
            <section 
              key={section.id}
              id={section.id}
              className={`bg-white rounded-lg p-6 shadow-sm transition-all duration-300 ${
                activeSection === null || activeSection === section.id
                  ? 'opacity-100 transform translate-y-0'
                  : 'opacity-60 transform translate-y-0'
              }`}
            >
              <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center border-b border-blue-100 pb-3">
                <span className="text-3xl mr-3">{section.icon}</span>
                {section.title}
              </h2>
              <div className={`transition-all duration-500 overflow-hidden ${
                activeSection === null || activeSection === section.id
                  ? 'max-h-[2000px]'
                  : 'max-h-0'
              }`}>
                {section.content}
              </div>
            </section>
          ))}
        </div>
        
        {/* Pet Travel Checklist */}
        <section className="bg-white rounded-lg p-6 mt-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center border-b border-blue-100 pb-3">
            <span className="text-3xl mr-3">📋</span>
            {t.movingwithpets.checklist.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t.movingwithpets.checklist.items.map((item, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg flex items-center">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-medium">{index + 1}</span>
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovingWithPetsToCanada;