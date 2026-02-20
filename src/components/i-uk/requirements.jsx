import React from 'react';
import { useRouter } from 'next/router';

import enTranslations from '../../../public/locales/en/ukimmi.json';
// import frTranslations from '../../../public/locales/fr/ukimmmi.json';
// import deTranslations from '../../../public/locales/de/ukimmmi.json';
import trTranslations from '../../../public/locales/tr/ukimmi.json';
// import arTranslations from '../../../public/locales/ar/ukimmmi.json';



const UKRelocationRequirements = () => {
  const router = useRouter();
  const { locale } = router;

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

  return (
    <div className="bg-sky-100 min-h-screen w-full font-sans">
      <div className="w-full bg-white shadow-lg overflow-hidden">
        <div className="p-10">
          <p className="text-gray-700 mb-8 text-lg">
            {t.ukrelocationrequirements.introduction}
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {t.ukrelocationrequirements.requirements.map((requirement, index) => (
              <div key={index} className="bg-sky-50 p-6 rounded-lg border-l-4 border-sky-500">
                <h2 className="text-2xl font-semibold text-sky-800 flex items-center mb-4">
                  <span className="bg-sky-500 text-white p-2 rounded-full mr-3 flex items-center justify-center w-10 h-10">
                    {index + 1}
                  </span>
                  {requirement.title}
                </h2>
                <p className="text-gray-700 mb-4">
                  {requirement.description}
                </p>
                {requirement.details && (
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    {requirement.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                )}
                {requirement.additionalInfo && (
                  <p className="text-gray-700 mt-4">
                    {requirement.additionalInfo}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-sky-200 p-10 rounded-none">
            <h2 className="text-3xl font-bold text-sky-800 mb-4">
              {t.ukrelocationrequirements.additionalConsiderations.title}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {t.ukrelocationrequirements.additionalConsiderations.items.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-sky-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {item.title}
                  </h3>
                  <p className="text-gray-700">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-sky-500 to-sky-400 p-10 rounded-none text-white">
            <h2 className="text-3xl font-bold mb-4">
              {t.ukrelocationrequirements.helpResources.title}
            </h2>
            <p className="mb-6">
              {t.ukrelocationrequirements.helpResources.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.ukrelocationrequirements.helpResources.resources.map((resource, index) => (
                <div key={index} className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <h3 className="font-semibold text-xl mb-2">{resource.title}</h3>
                  <p>{resource.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-sky-800 text-white p-8 text-center">
          <p className="text-lg">
            {t.ukrelocationrequirements.footer.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UKRelocationRequirements;