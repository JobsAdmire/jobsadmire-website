import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/canadaimmi.json";
import trTranslations from "../../../public/locales/tr/canadaimmi.json";
// import frTranslations from '../../../public/locales/fr/canadaimmi.json';
// import deTranslations from '../../../public/locales/de/canadaimmi.json';
// import arTranslations from '../../../public/locales/ar/canadaimmi.json';

const UKToCanadaGuide = () => {
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
      case "tr":
        return trTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  const renderWhyMoveContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.uktocanadaguide.sections.whyMove.description}
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {t.uktocanadaguide.sections.whyMove.reasons.map((reason, index) => (
          <li
            key={index}
            className="bg-white p-3 rounded-md shadow-sm border border-sky-100 flex items-center"
          >
            <span className="text-sky-600 mr-2">•</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>

      <p className="text-gray-700">
        {t.uktocanadaguide.sections.whyMove.conclusion}
      </p>
    </div>
  );

  const renderEntryRequirementsContent = () => (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-sky-600 mb-2">
          {t.uktocanadaguide.sections.entryRequirements.touristEntry.title}
        </h3>
        <p className="text-gray-700">
          {
            t.uktocanadaguide.sections.entryRequirements.touristEntry
              .description
          }
        </p>
      </div>
    </div>
  );

  const renderImmigrationPathwaysContent = () => (
    <div>
      <div className="space-y-4">
        {t.uktocanadaguide.sections.immigrationPathways.pathways.map(
          (pathway, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-md border-l-4 border-sky-500 shadow-sm"
            >
              <h3 className="text-lg font-medium text-sky-700 mb-2">
                {pathway.title}
              </h3>
              <p
                className="text-gray-700 mb-2"
                dangerouslySetInnerHTML={{ __html: pathway.description }}
              ></p>
              {pathway.subPrograms && (
                <div className="mt-3">
                  <h4 className="font-medium text-sky-600 mb-2">
                    {pathway.subProgramsTitle}
                  </h4>
                  <ul className="text-gray-700 space-y-1 pl-4">
                    {pathway.subPrograms.map((program, programIndex) => (
                      <li key={programIndex}>• {program}</li>
                    ))}
                  </ul>
                </div>
              )}
              {pathway.details && (
                <ul className="text-gray-700 space-y-1 pl-4 mt-2">
                  {pathway.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>• {detail}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );

  const renderPropertyContent = () => (
    <div className="space-y-3 text-gray-700">
      <div className="space-y-2">
        {t.uktocanadaguide.sections.property.points.map((point, index) => (
          <p key={index}>{point}</p>
        ))}
      </div>

      <div className="bg-sky-50 p-4 rounded-lg border border-sky-100 mt-4">
        <p className="flex items-start">
          <span className="text-amber-500 font-bold text-xl mr-2">💡</span>
          <span
            dangerouslySetInnerHTML={{
              __html: t.uktocanadaguide.sections.property.tip,
            }}
          ></span>
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
                {t.uktocanadaguide.sections.costLiving.table.headers.expense}
              </th>
              <th className="py-3 px-4 text-left border-b border-sky-200">
                {t.uktocanadaguide.sections.costLiving.table.headers.canada}
              </th>
              <th className="py-3 px-4 text-left border-b border-sky-200">
                {t.uktocanadaguide.sections.costLiving.table.headers.uk}
              </th>
            </tr>
          </thead>
          <tbody>
            {t.uktocanadaguide.sections.costLiving.table.rows.map(
              (row, index) => (
                <tr key={index} className={index % 2 === 1 ? "bg-sky-50" : ""}>
                  <td className="py-3 px-4 border-b border-sky-100 font-medium">
                    {row.expense}
                  </td>
                  <td className="py-3 px-4 border-b border-sky-100">
                    {row.canada}
                  </td>
                  <td className="py-3 px-4 border-b border-sky-100">
                    {row.uk}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <p className="text-gray-700">
        {t.uktocanadaguide.sections.costLiving.note}
      </p>
    </div>
  );

  const renderHealthcareContent = () => (
    <div className="space-y-3 text-gray-700">
      {t.uktocanadaguide.sections.healthcare.points.map((point, index) => (
        <p key={index}>{point}</p>
      ))}
    </div>
  );

  const renderWeatherContent = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {t.uktocanadaguide.sections.weather.seasons.map((season, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border border-sky-100"
          >
            <h3 className="font-medium text-sky-700 mb-2">{season.title}</h3>
            <p className="text-gray-700">{season.description}</p>
          </div>
        ))}

        <div className="bg-white p-4 rounded-lg border border-sky-100 md:col-span-2">
          <h3 className="font-medium text-sky-700 mb-2">
            {t.uktocanadaguide.sections.weather.regionalVariations.title}
          </h3>
          <p className="text-gray-700">
            {t.uktocanadaguide.sections.weather.regionalVariations.description}
          </p>
        </div>
      </div>
    </div>
  );

  const renderDailyLifeContent = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {t.uktocanadaguide.sections.dailyLife.aspects.map((aspect, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border border-sky-100"
          >
            <h3 className="font-medium text-sky-700 mb-2">{aspect.title}</h3>
            <p className="text-gray-700">{aspect.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMovingLogisticsContent = () => (
    <div className="space-y-3 text-gray-700">
      {t.uktocanadaguide.sections.movingLogistics.points.map((point, index) => (
        <p key={index}>{point}</p>
      ))}
    </div>
  );

  const renderChallengesContent = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {t.uktocanadaguide.sections.challenges.challenges.map(
          (challenge, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-md shadow-sm border-l-2 border-amber-400"
            >
              <h3 className="font-medium text-sky-700 mb-1">
                {challenge.title}
              </h3>
              <p className="text-gray-700 text-sm">{challenge.description}</p>
            </div>
          )
        )}
      </div>
    </div>
  );

  const renderBritishCommunitiesContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.uktocanadaguide.sections.britishCommunities.description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {t.uktocanadaguide.sections.britishCommunities.cities.map(
          (city, index) => (
            <div
              key={index}
              className="bg-white p-2 rounded-md text-center border border-sky-100"
            >
              {city}
            </div>
          )
        )}
      </div>

      <p className="text-gray-700">
        {t.uktocanadaguide.sections.britishCommunities.supportNote}
      </p>
    </div>
  );

  const sections = [
    {
      id: "why-move",
      icon: "🍁",
      title: t.uktocanadaguide.sections.whyMove.title,
      content: renderWhyMoveContent(),
    },
    {
      id: "entry-requirements",
      icon: "🛂",
      title: t.uktocanadaguide.sections.entryRequirements.title,
      content: renderEntryRequirementsContent(),
    },
    {
      id: "immigration-pathways",
      icon: "🗺️",
      title: t.uktocanadaguide.sections.immigrationPathways.title,
      content: renderImmigrationPathwaysContent(),
    },
    {
      id: "property",
      icon: "🏘️",
      title: t.uktocanadaguide.sections.property.title,
      content: renderPropertyContent(),
    },
    {
      id: "cost-living",
      icon: "💵",
      title: t.uktocanadaguide.sections.costLiving.title,
      content: renderCostLivingContent(),
    },
    {
      id: "healthcare",
      icon: "🏥",
      title: t.uktocanadaguide.sections.healthcare.title,
      content: renderHealthcareContent(),
    },
    {
      id: "weather",
      icon: "❄️",
      title: t.uktocanadaguide.sections.weather.title,
      content: renderWeatherContent(),
    },
    {
      id: "daily-life",
      icon: "📱",
      title: t.uktocanadaguide.sections.dailyLife.title,
      content: renderDailyLifeContent(),
    },
    {
      id: "moving-logistics",
      icon: "🛫",
      title: t.uktocanadaguide.sections.movingLogistics.title,
      content: renderMovingLogisticsContent(),
    },
    {
      id: "challenges",
      icon: "⚠️",
      title: t.uktocanadaguide.sections.challenges.title,
      content: renderChallengesContent(),
    },
    {
      id: "british-communities",
      icon: "👥",
      title: t.uktocanadaguide.sections.britishCommunities.title,
      content: renderBritishCommunitiesContent(),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 w-full min-h-screen p-4 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-10">
          {/* Quick Navigation */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-sky-700 mb-4">
              {t.uktocanadaguide.navigation.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() =>
                    setActiveSection(
                      section.id === activeSection ? null : section.id
                    )
                  }
                  className={`px-4 py-2 rounded-lg flex items-center text-sm md:text-base transition-colors ${
                    activeSection === section.id
                      ? "bg-sky-600 text-white shadow-md"
                      : "bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-100"
                  }`}
                  aria-label={`${t.uktocanadaguide.accessibility.toggleSection} ${section.title}`}
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
              className={`mb-10 scroll-mt-4 transition-all duration-300 ${
                activeSection === null || activeSection === section.id
                  ? "opacity-100"
                  : "opacity-60"
              }`}
            >
              <div className="flex items-center pb-2 border-b border-sky-100 mb-4">
                <span className="text-3xl mr-3">{section.icon}</span>
                <h2 className="text-2xl font-semibold text-sky-700">
                  {section.title}
                </h2>
              </div>
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  activeSection === null || activeSection === section.id
                    ? "max-h-[2000px]"
                    : "max-h-0"
                }`}
              >
                {section.content}
              </div>
            </section>
          ))}

          {/* Final Checklist */}
          <section className="mb-10 bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-xl border border-sky-100">
            <h2 className="text-2xl font-semibold text-sky-700 mb-4 flex items-center">
              <span className="text-2xl mr-3">✅</span>
              {t.uktocanadaguide.checklist.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.uktocanadaguide.checklist.items.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white p-4 rounded-lg shadow-sm flex items-center ${
                    index === t.uktocanadaguide.checklist.items.length - 1
                      ? "md:col-span-2"
                      : ""
                  }`}
                >
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Conclusion */}
          <section className="text-center py-8 px-6 bg-gradient-to-r from-sky-100 to-blue-100 rounded-xl">
            <h2 className="text-2xl font-semibold text-sky-700 mb-4 flex items-center justify-center">
              <span className="text-2xl mr-3">🍁</span>
              {t.uktocanadaguide.conclusion.title}
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              {t.uktocanadaguide.conclusion.text}
            </p>
          </section>
        </div>
      </div>

      <div className="text-center text-sky-600 text-sm mt-6">
        {t.uktocanadaguide.footer.disclaimer}
      </div>
    </div>
  );
};

export default UKToCanadaGuide;
