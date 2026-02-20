import React from 'react';
import { useRouter } from 'next/router';

// Import your translation files
import enTranslations from '../../../public/locales/en/canadaimmi.json';
import trTranslations from '../../../public/locales/tr/canadaimmi.json';
// import frTranslations from '../../../public/locales/fr/canadaimmi.json';
// import deTranslations from '../../../public/locales/de/canadaimmi.json';
// import arTranslations from '../../../public/locales/ar/canadaimmi.json';


const CanadaVisaGuide = () => {
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
    <div className="bg-sky-50 w-full min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-gray-700 text-lg mb-6">
            {t.canadavisaguide.introduction}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t.canadavisaguide.mainPrograms.map((program, index) => (
              <section key={index} className="bg-sky-50 rounded-lg p-6 border-l-4 border-sky-600 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-sky-800 mb-3">
                  {program.title}
                </h2>
                
                {program.bestFor && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.bestFor}
                    </h3>
                    {Array.isArray(program.bestFor) ? (
                      <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        {program.bestFor.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700">{program.bestFor}</p>
                    )}
                  </div>
                )}
                
                {program.programs && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.programs}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {program.programs.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {program.process && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.process}
                    </h3>
                    <ol className="list-decimal pl-6 text-gray-700 space-y-1">
                      {program.process.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                {program.types && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.types}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {program.types.map((type, typeIndex) => (
                        <li key={typeIndex}>{type}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {program.eligibleMembers && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.eligibleMembers}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {program.eligibleMembers.map((member, memberIndex) => (
                        <li key={memberIndex}>{member}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {program.requirements && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.requirements}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {program.requirements.map((req, reqIndex) => (
                        <li key={reqIndex}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {program.sponsorRequirements && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.sponsorRequirements}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {program.sponsorRequirements.map((req, reqIndex) => (
                        <li key={reqIndex}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {program.benefits && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.benefits}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {program.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {program.tfwpRequirements && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.tfwpRequirements}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {program.tfwpRequirements.map((req, reqIndex) => (
                        <li key={reqIndex}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {program.impBenefits && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.impBenefits}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {program.impBenefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {program.startupRequirements && (
                  <div>
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.startupRequirements}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {program.startupRequirements.map((req, reqIndex) => (
                        <li key={reqIndex}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {program.notablePNPs && (
                  <div>
                    <h3 className="text-lg font-medium text-sky-700 mb-2">
                      {t.canadavisaguide.labels.notablePNPs}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {program.notablePNPs.map((pnp, pnpIndex) => (
                        <li key={pnpIndex}>{pnp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-sky-800 mb-4">
            {t.canadavisaguide.additionalOptions.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t.canadavisaguide.additionalOptions.programs.map((program, index) => (
              <section key={index} className="border border-sky-200 rounded-lg p-6 hover:bg-sky-50 transition-colors">
                <h3 className="text-xl font-semibold text-sky-700 mb-3">
                  {program.title}
                </h3>
                <p className="text-gray-700 mb-3">
                  {program.description}
                </p>
                <div className="text-sky-600 font-medium">
                  {program.requirement}
                </div>
              </section>
            ))}
          </div>
        </div>
        
        <div className="bg-sky-600 text-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {t.canadavisaguide.importantConsiderations.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.canadavisaguide.importantConsiderations.considerations.map((consideration, index) => (
              <div key={index} className="bg-sky-700 bg-opacity-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{consideration.title}</h3>
                <p>{consideration.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanadaVisaGuide;