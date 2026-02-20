import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/turkeyimmi.json";
import trTranslations from "../../../public/locales/tr/turkeyimmi.json";
// import arTranslations from '../../../public/locales/ar/turkeyimmi.json';
// import frTranslations from '../../../public/locales/fr/turkeyimmi.json';
// import deTranslations from '../../../public/locales/de/turkeyimmi.json';

const UKToTurkeyGuide = () => {
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
  const isRTL = locale === "ar" || locale === "fa";

  const renderCostComparisonTable = () => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border border-sky-200 rounded-lg">
        <thead>
          <tr className="bg-sky-100">
            <th
              className={`py-3 px-4 border-b border-sky-200 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t.ukToTurkeyGuide.sections.costLiving.table.headers.expense}
            </th>
            <th
              className={`py-3 px-4 border-b border-sky-200 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t.ukToTurkeyGuide.sections.costLiving.table.headers.turkey}
            </th>
            <th
              className={`py-3 px-4 border-b border-sky-200 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t.ukToTurkeyGuide.sections.costLiving.table.headers.uk}
            </th>
          </tr>
        </thead>
        <tbody>
          {t.ukToTurkeyGuide.sections.costLiving.table.rows.map(
            (row, index) => (
              <tr key={index} className={index % 2 === 1 ? "bg-sky-50" : ""}>
                <td className="py-3 px-4 border-b border-sky-100 font-medium">
                  {row.expense}
                </td>
                <td className="py-3 px-4 border-b border-sky-100 text-green-600">
                  {row.turkey}
                </td>
                <td className="py-3 px-4 border-b border-sky-100">{row.uk}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );

  const renderSectionContent = (sectionId) => {
    const sectionData = t.ukToTurkeyGuide.sections[sectionId];

    switch (sectionId) {
      case "whyMove":
        return (
          <div>
            <p className="text-gray-700 mb-4">{sectionData.description}</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {sectionData.reasons.map((reason, index) => (
                <li
                  key={index}
                  className={`bg-white p-3 rounded-md shadow-sm border border-sky-100 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className={`text-sky-600 ${isRTL ? "ml-2" : "mr-2"}`}>
                    •
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-700">{sectionData.postBrexitNote}</p>
          </div>
        );

      case "entryRequirements":
        return (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-sky-600 mb-2">
                {sectionData.touristEntry.title}
              </h3>
              <p className="text-gray-700">
                {sectionData.touristEntry.description}
              </p>
            </div>
          </div>
        );

      case "longTermStay":
        return (
          <div className="space-y-4">
            {sectionData.options.map((option, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-md border-l-4 border-sky-500 shadow-sm"
              >
                <h3 className="text-lg font-medium text-sky-700 mb-2">
                  {option.title}
                </h3>
                <p
                  className="text-gray-700 mb-2"
                  dangerouslySetInnerHTML={{ __html: option.description }}
                ></p>
                {option.requirements && (
                  <div className="mt-3">
                    <h4 className="font-medium text-sky-600 mb-2">
                      {option.requirementsTitle}
                    </h4>
                    <ul
                      className={`text-gray-700 space-y-1 ${isRTL ? "pr-4" : "pl-4"}`}
                    >
                      {option.requirements.map((req, reqIndex) => (
                        <li key={reqIndex}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {option.steps && (
                  <ul
                    className={`text-gray-700 space-y-1 ${isRTL ? "pr-4" : "pl-4"}`}
                  >
                    {option.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>• {step}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case "property":
        return (
          <div className="space-y-3 text-gray-700">
            <div className="space-y-2">
              {sectionData.facts.map((fact, index) => (
                <p key={index}>{fact}</p>
              ))}
            </div>
            <div className="bg-sky-50 p-4 rounded-lg border border-sky-100 mt-4">
              <p
                className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-amber-500 font-bold text-xl ${isRTL ? "ml-2" : "mr-2"}`}
                >
                  💡
                </span>
                <span
                  dangerouslySetInnerHTML={{ __html: sectionData.tip }}
                ></span>
              </p>
            </div>
          </div>
        );

      case "costLiving":
        return (
          <div>
            {renderCostComparisonTable()}
            <p className="text-gray-700">{sectionData.conclusion}</p>
          </div>
        );

      case "healthcare":
        return (
          <div className="space-y-3 text-gray-700">
            {sectionData.points.map((point, index) => (
              <p key={index}>{point}</p>
            ))}
          </div>
        );

      case "dailyLife":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionData.aspects.map((aspect, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-sky-100"
              >
                <h3 className="font-medium text-sky-700 mb-2">
                  {aspect.title}
                </h3>
                <p className="text-gray-700">{aspect.description}</p>
              </div>
            ))}
          </div>
        );

      case "movingLogistics":
        return (
          <div className="space-y-3 text-gray-700">
            {sectionData.points.map((point, index) => (
              <p key={index}>{point}</p>
            ))}
          </div>
        );

      case "challenges":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {sectionData.challenges.map((challenge, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-md shadow-sm border-l-2 border-amber-400"
              >
                <h3 className="font-medium text-sky-700 mb-1">
                  {challenge.title}
                </h3>
                <p className="text-gray-700 text-sm">{challenge.description}</p>
              </div>
            ))}
          </div>
        );

      case "expatCommunities":
        return (
          <div>
            <p className="text-gray-700 mb-4">{sectionData.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              {sectionData.locations.map((location, index) => (
                <div
                  key={index}
                  className="bg-white p-2 rounded-md text-center border border-sky-100"
                >
                  {location}
                </div>
              ))}
            </div>
            <p className="text-gray-700">{sectionData.support}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-sky-50 w-full p-0 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm p-8">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold text-sky-800 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`${isRTL ? "ml-3" : "mr-3"}`}>🇬🇧➡️🇹🇷</span>
            {t.ukToTurkeyGuide.title}
          </h1>
          <h2 className="text-xl text-sky-600 mb-6">
            {t.ukToTurkeyGuide.subtitle}
          </h2>

          <p className="text-gray-700 mb-4">{t.ukToTurkeyGuide.description}</p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.ukToTurkeyGuide.navigation.title}
          </h2>
          <div
            className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {t.ukToTurkeyGuide.navigation.sections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  setActiveSection(
                    section.id === activeSection ? null : section.id
                  )
                }
                className={`px-3 py-2 rounded-md flex items-center text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-sky-600 text-white"
                    : "bg-sky-100 text-sky-800 hover:bg-sky-200"
                } ${isRTL ? "flex-row-reverse" : ""}`}
                aria-label={t.ukToTurkeyGuide.accessibility.sectionButton.replace(
                  "{title}",
                  section.title
                )}
              >
                <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                  {section.icon}
                </span>
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        {t.ukToTurkeyGuide.navigation.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={`mb-8 scroll-mt-4 transition-all duration-300 ${
              activeSection === null || activeSection === section.id
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <h2
              className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>
                {section.icon}
              </span>
              {section.title}
            </h2>
            <div
              className={`transition-all duration-500 overflow-hidden ${
                activeSection === null || activeSection === section.id
                  ? "max-h-[2000px]"
                  : "max-h-0"
              }`}
            >
              {renderSectionContent(section.id)}
            </div>
          </section>
        ))}

        {/* Final Checklist */}
        <section className="mb-8 bg-sky-50 p-6 rounded-lg border border-sky-100">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>✅</span>
            {t.ukToTurkeyGuide.checklist.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t.ukToTurkeyGuide.checklist.items.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-3 rounded-md flex items-center ${isRTL ? "flex-row-reverse" : ""} ${index === t.ukToTurkeyGuide.checklist.items.length - 1 ? "md:col-span-2" : ""}`}
              >
                <span className={`text-green-500 ${isRTL ? "ml-2" : "mr-2"}`}>
                  ✔
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Conclusion */}
        <section className="text-center py-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center justify-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>🎯</span>
            {t.ukToTurkeyGuide.conclusion.title}
          </h2>
          <p className="text-gray-700 w-full">
            {t.ukToTurkeyGuide.conclusion.description}
          </p>
        </section>
      </div>
    </div>
  );
};

export default UKToTurkeyGuide;
