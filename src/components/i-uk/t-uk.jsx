import React, { useState } from 'react';
import { useRouter } from 'next/router';

import enTranslations from '../../../public/locales/en/ukimmi.json';
// import frTranslations from '../../../public/locales/fr/ukimmmi.json';
// import deTranslations from '../../../public/locales/de/ukimmmi.json';
import trTranslations from '../../../public/locales/tr/ukimmi.json';
// import arTranslations from '../../../public/locales/ar/ukimmmi.json';



const UKFromTurkeyGuide = () => {
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

  const renderWhyMoveContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.ukfromturkeyguide.sections.whyMove.description}
      </p>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {t.ukfromturkeyguide.sections.whyMove.reasons.map((reason, index) => (
          <li key={index} className="bg-white p-3 rounded-md shadow-sm border border-sky-100 flex items-center">
            <span className="text-sky-600 mr-2">•</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
      
      <p className="text-gray-700">
        {t.ukfromturkeyguide.sections.whyMove.conclusion}
      </p>
    </div>
  );

  const renderEntryRequirementsContent = () => (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-sky-600 mb-2">
          {t.ukfromturkeyguide.sections.entryRequirements.visitorEntry.title}
        </h3>
        <p className="text-gray-700">
          {t.ukfromturkeyguide.sections.entryRequirements.visitorEntry.description}
        </p>
      </div>
      
      <div className="bg-sky-50 p-4 rounded-lg border border-sky-100 mt-4">
        <p className="flex items-start">
          <span className="text-amber-500 font-bold text-xl mr-2">💡</span>
          <span>{t.ukfromturkeyguide.sections.entryRequirements.tip}</span>
        </p>
      </div>
    </div>
  );

  const renderLongTermStayContent = () => (
    <div>
      <div className="space-y-4">
        {t.ukfromturkeyguide.sections.longTermStay.options.map((option, index) => (
          <div key={index} className="bg-white p-4 rounded-md border-l-4 border-sky-500 shadow-sm">
            <h3 className="text-lg font-medium text-sky-700 mb-2">{option.title}</h3>
            <p className="text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: option.description }}></p>
            {option.requirements && (
              <div className="mt-3">
                <h4 className="font-medium text-sky-600 mb-2">
                  {t.ukfromturkeyguide.labels.youllNeed}
                </h4>
                <ul className="text-gray-700 space-y-1 pl-4">
                  {option.requirements.map((req, reqIndex) => (
                    <li key={reqIndex}>• {req}</li>
                  ))}
                </ul>
              </div>
            )}
            {option.details && (
              <ul className="text-gray-700 space-y-1 pl-4 mt-2">
                {option.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>• {detail}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPropertyContent = () => (
    <div className="space-y-3 text-gray-700">
      <div className="space-y-2">
        {t.ukfromturkeyguide.sections.property.points.map((point, index) => (
          <p key={index}>{point}</p>
        ))}
      </div>
      
      <div className="bg-sky-50 p-4 rounded-lg border border-sky-100 mt-4">
        <p className="flex items-start">
          <span className="text-amber-500 font-bold text-xl mr-2">💡</span>
          <span dangerouslySetInnerHTML={{ __html: t.ukfromturkeyguide.sections.property.tip }}></span>
        </p>
      </div>
    </div>
  );

  const renderCostLivingContent = () => (
    <div>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-sky-200 rounded-lg">
          <thead>
            <tr className="bg-sky-100">
              <th className="py-3 px-4 text-left border-b border-sky-200">
                {t.ukfromturkeyguide.sections.costLiving.table.headers.expense}
              </th>
              <th className="py-3 px-4 text-left border-b border-sky-200">
                {t.ukfromturkeyguide.sections.costLiving.table.headers.uk}
              </th>
              <th className="py-3 px-4 text-left border-b border-sky-200">
                {t.ukfromturkeyguide.sections.costLiving.table.headers.turkey}
              </th>
            </tr>
          </thead>
          <tbody>
            {t.ukfromturkeyguide.sections.costLiving.table.rows.map((row, index) => (
              <tr key={index} className={index % 2 === 1 ? "bg-sky-50" : ""}>
                <td className="py-3 px-4 border-b border-sky-100 font-medium">{row.expense}</td>
                <td className={`py-3 px-4 border-b border-sky-100 ${row.ukHighlight ? 'text-red-600' : ''}`}>
                  {row.uk}
                </td>
                <td className="py-3 px-4 border-b border-sky-100">{row.turkey}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="text-gray-700">
        {t.ukfromturkeyguide.sections.costLiving.note}
      </p>
    </div>
  );

  const renderHealthcareContent = () => (
    <div className="space-y-3 text-gray-700">
      {t.ukfromturkeyguide.sections.healthcare.points.map((point, index) => (
        <p key={index}>{point}</p>
      ))}
    </div>
  );

  const renderDailyLifeContent = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {t.ukfromturkeyguide.sections.dailyLife.aspects.map((aspect, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-sky-100">
            <h3 className="font-medium text-sky-700 mb-2">{aspect.title}</h3>
            <p className="text-gray-700">{aspect.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMovingLogisticsContent = () => (
    <div className="space-y-3 text-gray-700">
      {t.ukfromturkeyguide.sections.movingLogistics.points.map((point, index) => (
        <p key={index}>{point}</p>
      ))}
    </div>
  );

  const renderChallengesContent = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {t.ukfromturkeyguide.sections.challenges.challenges.map((challenge, index) => (
          <div key={index} className="bg-white p-3 rounded-md shadow-sm border-l-2 border-amber-400">
            <h3 className="font-medium text-sky-700 mb-1">{challenge.title}</h3>
            <p className="text-gray-700 text-sm">{challenge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTurkishCommunitiesContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.ukfromturkeyguide.sections.turkishCommunities.description}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {t.ukfromturkeyguide.sections.turkishCommunities.cities.map((city, index) => (
          <div key={index} className="bg-white p-2 rounded-md text-center border border-sky-100">
            {city}
          </div>
        ))}
      </div>
      
      <p className="text-gray-700">
        {t.ukfromturkeyguide.sections.turkishCommunities.supportNote}
      </p>
    </div>
  );

  const sections = [
    {
      id: "why-move",
      icon: "🧳",
      title: t.ukfromturkeyguide.sections.whyMove.title,
      content: renderWhyMoveContent()
    },
    {
      id: "entry-requirements",
      icon: "🛂",
      title: t.ukfromturkeyguide.sections.entryRequirements.title,
      content: renderEntryRequirementsContent()
    },
    {
      id: "long-term-stay",
      icon: "🏠",
      title: t.ukfromturkeyguide.sections.longTermStay.title,
      content: renderLongTermStayContent()
    },
    {
      id: "property",
      icon: "🏘️",
      title: t.ukfromturkeyguide.sections.property.title,
      content: renderPropertyContent()
    },
    {
      id: "cost-living",
      icon: "💷",
      title: t.ukfromturkeyguide.sections.costLiving.title,
      content: renderCostLivingContent()
    },
    {
      id: "healthcare",
      icon: "🏥",
      title: t.ukfromturkeyguide.sections.healthcare.title,
      content: renderHealthcareContent()
    },
    {
      id: "daily-life",
      icon: "📱",
      title: t.ukfromturkeyguide.sections.dailyLife.title,
      content: renderDailyLifeContent()
    },
    {
      id: "moving-logistics",
      icon: "🛫",
      title: t.ukfromturkeyguide.sections.movingLogistics.title,
      content: renderMovingLogisticsContent()
    },
    {
      id: "challenges",
      icon: "🧾",
      title: t.ukfromturkeyguide.sections.challenges.title,
      content: renderChallengesContent()
    },
    {
      id: "turkish-communities",
      icon: "👥",
      title: t.ukfromturkeyguide.sections.turkishCommunities.title,
      content: renderTurkishCommunitiesContent()
    }
  ];
  
  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 min-h-screen w-full font-sans">
      <div className="w-full bg-white shadow-md">
        <div className="px-6 py-8 md:px-10 md:py-12">
          {/* Quick Navigation */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-sky-700 mb-4 flex items-center">
              <span className="text-sky-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              {t.ukfromturkeyguide.navigation.title}
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id === activeSection ? null : section.id)}
                  className={`px-4 py-2 rounded-full flex items-center text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                  }`}
                  aria-label={`${t.ukfromturkeyguide.accessibility.toggleSection} ${section.title}`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sections */}
          {sections.map((section) => (
            <section 
              key={section.id}
              id={section.id}
              className={`mb-12 scroll-mt-4 transition-all duration-300 ${
                activeSection === null || activeSection === section.id
                  ? 'opacity-100'
                  : 'opacity-50'
              }`}
            >
              <div className="flex items-center border-b border-sky-100 pb-2 mb-4">
                <span className="text-3xl mr-4">{section.icon}</span>
                <h2 className="text-2xl font-semibold text-sky-700">
                  {section.title}
                </h2>
              </div>
              
              <div className={`transition-all duration-500 overflow-hidden ${
                activeSection === null || activeSection === section.id
                  ? 'max-h-[2000px]'
                  : 'max-h-0'
              }`}>
                {section.content}
              </div>
            </section>
          ))}
          
          {/* Final Checklist */}
          <section className="mb-12 bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-lg border border-sky-100">
            <h2 className="text-2xl font-semibold text-sky-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">✅</span>
              {t.ukfromturkeyguide.checklist.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.ukfromturkeyguide.checklist.items.map((item, index) => (
                <div key={index} className={`bg-white p-3 rounded-md flex items-center ${
                  index === t.ukfromturkeyguide.checklist.items.length - 1 ? 'md:col-span-2' : ''
                }`}>
                  <span className="text-green-500 mr-2">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
          
          {/* Conclusion */}
          <section className="text-center py-8 bg-gradient-to-r from-sky-100 to-blue-100 rounded-lg">
            <h2 className="text-2xl font-semibold text-sky-700 mb-4 flex items-center justify-center">
              <span className="text-2xl mr-3">🎯</span>
              {t.ukfromturkeyguide.conclusion.title}
            </h2>
            <p className="text-gray-700 px-4">
              {t.ukfromturkeyguide.conclusion.text}
            </p>
          </section>
        </div>
      </div>
      
      <footer className="text-center py-6 text-gray-600 text-sm">
        <p>{t.ukfromturkeyguide.footer.lastUpdated}</p>
      </footer>
    </div>
  );
};

export default UKFromTurkeyGuide;