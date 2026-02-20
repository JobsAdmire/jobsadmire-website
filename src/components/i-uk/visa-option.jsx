import React from 'react';
import { useRouter } from 'next/router';

import enTranslations from '../../../public/locales/en/ukimmi.json';
// import frTranslations from '../../../public/locales/fr/ukimmmi.json';
// import deTranslations from '../../../public/locales/de/ukimmmi.json';
import trTranslations from '../../../public/locales/tr/ukimmi.json';
// import arTranslations from '../../../public/locales/ar/ukimmmi.json';


const UKVisaGuide = () => {
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
    <div className="bg-sky-50 w-full p-0 font-sans">
      <div className="w-full bg-white shadow-sm p-8">
        <header className="border-b border-sky-100 pb-6 mb-8">
          <p className="text-gray-700">
            {t.ukvisaguide.introduction}
          </p>
        </header>
        
        {t.ukvisaguide.visaTypes.map((visaType, index) => (
          <section key={index} className="mb-10">
            <h2 className="text-2xl font-semibold text-sky-700 mb-4 flex items-center">
              <span className="bg-sky-100 text-sky-800 rounded-full w-8 h-8 flex items-center justify-center mr-2 text-sm">
                {index + 1}
              </span>
              {visaType.title}
            </h2>
            
            <div className="pl-10">
              <h3 className="text-lg font-medium text-sky-600 mb-2">
                {t.ukvisaguide.labels.bestFor}
              </h3>
              {Array.isArray(visaType.bestFor) ? (
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  {visaType.bestFor.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 mb-4">{visaType.bestFor}</p>
              )}
              
              {visaType.requirements && (
                <>
                  <h3 className="text-lg font-medium text-sky-600 mb-2">
                    {t.ukvisaguide.labels.requirements}
                  </h3>
                  <ul className="list-disc pl-6 mb-4 text-gray-700">
                    {visaType.requirements.map((requirement, reqIndex) => (
                      <li key={reqIndex}>{requirement}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {visaType.benefits && (
                <>
                  <h3 className="text-lg font-medium text-sky-600 mb-2">
                    {t.ukvisaguide.labels.benefits}
                  </h3>
                  <ul className="list-disc pl-6 mb-4 text-gray-700">
                    {visaType.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex}>{benefit}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {visaType.validity && (
                <>
                  <h3 className="text-lg font-medium text-sky-600 mb-2">
                    {t.ukvisaguide.labels.validity}
                  </h3>
                  <p className="text-gray-700">{visaType.validity}</p>
                </>
              )}
            </div>
          </section>
        ))}
        
        <footer className="mt-10 pt-6 border-t border-sky-100 text-center text-gray-600 text-sm">
          <p>{t.ukvisaguide.footer.disclaimer}</p>
        </footer>
      </div>
    </div>
  );
};

export default UKVisaGuide;