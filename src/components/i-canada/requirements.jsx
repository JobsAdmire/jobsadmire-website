import React from 'react';
import { useRouter } from 'next/router';

// Import your translation files
import enTranslations from '../../../public/locales/en/canadaimmi.json';
import trTranslations from '../../../public/locales/tr/canadaimmi.json';
// import frTranslations from '../../../public/locales/fr/canadaimmi.json';
// import deTranslations from '../../../public/locales/de/canadaimmi.json';
// import arTranslations from '../../../public/locales/ar/canadaimmi.json';


const CanadaRelocationRequirements = () => {
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
    <div className="bg-sky-50 min-h-screen w-full p-4 font-sans">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <p className="text-gray-700 mb-8 text-lg">
            {t.relocationrequirements.introduction}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.relocationrequirements.requirements.map((requirement, index) => (
              <div key={index} className="bg-sky-50 p-6 rounded-lg border-l-4 border-sky-600">
                <h2 className="text-2xl font-semibold text-sky-800 mb-4 flex items-center">
                  <span className="bg-sky-600 text-white p-2 rounded-full mr-3 flex items-center justify-center w-10 h-10">
                    {requirement.icon}
                  </span>
                  {requirement.title}
                </h2>
                <p className="text-gray-700 mb-4">
                  {requirement.description}
                </p>
                {requirement.details && (
                  <ul className="list-disc pl-6 mb-4 text-gray-700">
                    {requirement.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-10 bg-sky-100 p-6 rounded-lg border border-sky-200">
            <h2 className="text-2xl font-semibold text-sky-800 mb-4 flex items-center">
              <span className="bg-sky-600 text-white p-2 rounded-full mr-3 flex items-center justify-center w-10 h-10">
                🍁
              </span>
              {t.relocationrequirements.postArrival.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.relocationrequirements.postArrival.timeframes.map((timeframe, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-sky-700 mb-2">{timeframe.period}</h3>
                  <ul className="list-disc pl-6 mb-4 text-gray-700">
                    {timeframe.tasks.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanadaRelocationRequirements;