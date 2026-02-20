import React, { useState } from 'react';
import { useRouter } from 'next/router';

// Import your translation files
import enTranslations from '../../../public/locales/en/canadaimmi.json';
import trTranslations from '../../../public/locales/tr/canadaimmi.json';
// import frTranslations from '../../../public/locales/fr/canadaimmi.json';
// import deTranslations from '../../../public/locales/de/canadaimmi.json';
// import arTranslations from '../../../public/locales/ar/canadaimmi.json';

const CanadaJobGuide = () => {
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
  
  const renderJobMarketContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.canadajobguide.sections.jobMarket.description}
      </p>
      
      <h3 className="text-lg font-medium text-sky-600 mb-3">
        {t.canadajobguide.sections.jobMarket.inDemandTitle}
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {t.canadajobguide.sections.jobMarket.sectors.map((sector, index) => (
          <li key={index} className="bg-white p-3 rounded-lg shadow-sm border border-sky-100 hover:shadow-md transition-all">
            <span className="font-medium">{sector.name}</span>
            <p className="text-sm text-gray-600">{sector.description}</p>
          </li>
        ))}
      </ul>
      
      <p className="text-gray-700">
        {t.canadajobguide.sections.jobMarket.languageNote}
      </p>
    </div>
  );

  const renderImmigrationContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.canadajobguide.sections.immigration.description}
      </p>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-sky-600 mb-2">
          {t.canadajobguide.sections.immigration.expressEntry.title}
        </h3>
        <p className="text-gray-700 mb-4">
          {t.canadajobguide.sections.immigration.expressEntry.description}
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          {t.canadajobguide.sections.immigration.expressEntry.points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
      
      <div className="bg-sky-50 p-4 rounded-lg border border-sky-100 mb-4">
        <h3 className="text-lg font-medium text-sky-600 mb-2">
          {t.canadajobguide.sections.immigration.otherPathways.title}
        </h3>
        <ul className="space-y-2 text-gray-700">
          {t.canadajobguide.sections.immigration.otherPathways.programs.map((program, index) => (
            <li key={index}>
              <span className="font-medium">{program.name}:</span> {program.description}
            </li>
          ))}
        </ul>
      </div>
      
      <p className="text-gray-700">
        {t.canadajobguide.sections.immigration.conclusion}
      </p>
    </div>
  );

  const renderJobOpportunitiesContent = () => (
    <div>
      <h3 className="text-lg font-medium text-sky-600 mb-3">
        {t.canadajobguide.sections.jobOpportunities.portalsTitle}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {t.canadajobguide.sections.jobOpportunities.portals.map((portal, index) => (
          <a 
            key={index} 
            href="#" 
            className="bg-white p-3 rounded-lg text-center hover:bg-sky-50 border border-sky-100 transition-all"
          >
            {portal}
          </a>
        ))}
      </div>
      
      <h3 className="text-lg font-medium text-sky-600 mb-3">
        {t.canadajobguide.sections.jobOpportunities.tipsTitle}
      </h3>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        {t.canadajobguide.sections.jobOpportunities.tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );

  const renderNOCContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.canadajobguide.sections.noc.description}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg border border-sky-100">
          <h3 className="text-lg font-medium text-sky-600 mb-3">
            {t.canadajobguide.sections.noc.categories.title}
          </h3>
          <ul className="list-disc pl-6 text-gray-700">
            {t.canadajobguide.sections.noc.categories.teer.map((category, index) => (
              <li key={index}>
                <span className="font-medium">{category.name}:</span> {category.description}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-sky-100">
          <h3 className="text-lg font-medium text-sky-600 mb-3">
            {t.canadajobguide.sections.noc.importance.title}
          </h3>
          <ul className="list-disc pl-6 text-gray-700">
            {t.canadajobguide.sections.noc.importance.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <p className="text-gray-700">
        {t.canadajobguide.sections.noc.findCode}
      </p>
    </div>
  );

  const renderRemoteWorkContent = () => (
    <div className="space-y-4 text-gray-700">
      <p>{t.canadajobguide.sections.remoteWork.intro}</p>
      
      <ul className="list-disc pl-6 mb-4">
        {t.canadajobguide.sections.remoteWork.points.map((point, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: point }} />
        ))}
      </ul>
      
      <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
        <h3 className="text-lg font-medium text-sky-600 mb-2">
          {t.canadajobguide.sections.remoteWork.taxConsiderations.title}
        </h3>
        <ul className="list-disc pl-6">
          {t.canadajobguide.sections.remoteWork.taxConsiderations.points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderTeachingContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.canadajobguide.sections.teaching.description}
      </p>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1 bg-white p-4 rounded-lg border border-sky-100">
          <h3 className="text-lg font-medium text-sky-600 mb-3">
            {t.canadajobguide.sections.teaching.k12.title}
          </h3>
          <ul className="list-disc pl-6 text-gray-700">
            {t.canadajobguide.sections.teaching.k12.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex-1 bg-white p-4 rounded-lg border border-sky-100">
          <h3 className="text-lg font-medium text-sky-600 mb-3">
            {t.canadajobguide.sections.teaching.esl.title}
          </h3>
          <ul className="list-disc pl-6 text-gray-700">
            {t.canadajobguide.sections.teaching.esl.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <p className="text-gray-700">
        {t.canadajobguide.sections.teaching.conclusion}
      </p>
    </div>
  );

  const renderResumeInterviewContent = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-sky-600 mb-3">
          {t.canadajobguide.sections.resumeInterview.resume.title}
        </h3>
        <ul className="list-disc pl-6 text-gray-700">
          {t.canadajobguide.sections.resumeInterview.resume.points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-sky-600 mb-3">
          {t.canadajobguide.sections.resumeInterview.interview.title}
        </h3>
        <ul className="list-disc pl-6 text-gray-700">
          {t.canadajobguide.sections.resumeInterview.interview.expectations.map((expectation, index) => (
            <li key={index}>{expectation}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderNetworkingContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.canadajobguide.sections.networking.description}
      </p>
      
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        {t.canadajobguide.sections.networking.strategies.map((strategy, index) => (
          <li key={index}>{strategy}</li>
        ))}
      </ul>
      
      <div className="bg-sky-50 p-4 rounded-lg border border-sky-100 mt-4">
        <h3 className="text-lg font-medium text-sky-600 mb-2">
          {t.canadajobguide.sections.networking.resources.title}
        </h3>
        <ul className="list-disc pl-6 text-gray-700">
          {t.canadajobguide.sections.networking.resources.list.map((resource, index) => (
            <li key={index}>{resource}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const sections = [
    {
      id: "job-market",
      icon: "🔍",
      title: t.canadajobguide.sections.jobMarket.title,
      content: renderJobMarketContent()
    },
    {
      id: "immigration-system",
      icon: "🍁",
      title: t.canadajobguide.sections.immigration.title,
      content: renderImmigrationContent()
    },
    {
      id: "job-opportunities",
      icon: "🏢",
      title: t.canadajobguide.sections.jobOpportunities.title,
      content: renderJobOpportunitiesContent()
    },
    {
      id: "noc-system",
      icon: "📊",
      title: t.canadajobguide.sections.noc.title,
      content: renderNOCContent()
    },
    {
      id: "remote-work",
      icon: "💻",
      title: t.canadajobguide.sections.remoteWork.title,
      content: renderRemoteWorkContent()
    },
    {
      id: "teaching",
      icon: "🧑‍🏫",
      title: t.canadajobguide.sections.teaching.title,
      content: renderTeachingContent()
    },
    {
      id: "resume-interview",
      icon: "📝",
      title: t.canadajobguide.sections.resumeInterview.title,
      content: renderResumeInterviewContent()
    },
    {
      id: "networking",
      icon: "👥",
      title: t.canadajobguide.sections.networking.title,
      content: renderNetworkingContent()
    }
  ];
  
  return (
    <div className="bg-gradient-to-b from-sky-50 to-blue-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-10">
        {/* Table of Contents */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-sky-100">
          <h2 className="text-2xl font-semibold text-sky-700 mb-6">
            {t.canadajobguide.tableOfContents.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                  activeSection === section.id 
                    ? 'bg-sky-100 border-sky-300 shadow-inner' 
                    : 'bg-sky-50 border border-sky-100 hover:bg-sky-100'
                }`}
                aria-label={`${t.canadajobguide.accessibility.toggleSection} ${section.title}`}
              >
                <span className="text-2xl mr-3">{section.icon}</span>
                <span className="font-medium text-sky-800 text-sm md:text-base">{section.title}</span>
              </button>
            ))}
          </div>
        </section>
        
        {/* Sections */}
        {sections.map((section) => (
          <section 
            key={section.id}
            className={`bg-white rounded-2xl shadow-lg p-6 mb-8 border transition-all duration-300 ${
              activeSection === section.id
                ? 'border-sky-300 ring-4 ring-sky-100' 
                : 'border-sky-100'
            }`}
          >
            <h2 className="text-2xl font-semibold text-sky-700 mb-6 flex items-center">
              <span className="text-3xl mr-4">{section.icon}</span>
              {section.title}
            </h2>
            <div className={`transition-all duration-500 overflow-hidden ${
              activeSection === section.id || activeSection === null
                ? 'max-h-[2000px] opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              {section.content}
            </div>
          </section>
        ))}
        
        {/* Final Checklist */}
        <section className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl shadow-lg p-8 mb-8 border border-sky-200">
          <h2 className="text-2xl font-semibold text-sky-700 mb-6 flex items-center">
            <span className="text-3xl mr-4">✅</span>
            {t.canadajobguide.checklist.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.canadajobguide.checklist.categories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-sky-100">
                <h3 className="text-lg font-medium text-sky-600 mb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CanadaJobGuide;