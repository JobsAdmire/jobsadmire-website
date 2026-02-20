import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/australiaimmi.json";
import trTranslations from "../../../public/locales/tr/australiaimmi.json";
// import arTranslations from '../../../public/locales/ar/australiaimmi.json';
// import frTranslations from '../../../public/locales/fr/australiaimmi.json';
// import deTranslations from '../../../public/locales/de/australiaimmi.json';

const USToAustraliaGuide = () => {
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

  // Get sections from translations
  const sections = t.usToAustraliaGuide?.sections || [];

  const renderCostComparisonTable = () => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border border-sky-200 rounded-lg">
        <thead>
          <tr className="bg-sky-100">
            <th
              className={`py-3 px-4 border-b border-sky-200 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t.usToAustraliaGuide.costComparison.headers.expense}
            </th>
            <th
              className={`py-3 px-4 border-b border-sky-200 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t.usToAustraliaGuide.costComparison.headers.australia}
            </th>
            <th
              className={`py-3 px-4 border-b border-sky-200 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t.usToAustraliaGuide.costComparison.headers.usa}
            </th>
          </tr>
        </thead>
        <tbody>
          {t.usToAustraliaGuide.costComparison.rows.map((row, index) => (
            <tr key={index} className={index % 2 === 1 ? "bg-sky-50" : ""}>
              <td className="py-3 px-4 border-b border-sky-100 font-medium">
                {row.expense}
              </td>
              <td className="py-3 px-4 border-b border-sky-100">
                {row.australia}
              </td>
              <td className="py-3 px-4 border-b border-sky-100">{row.usa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSectionContent = (section) => {
    switch (section.id) {
      case "why-australia":
        return (
          <div>
            <p className="text-gray-700 mb-4">{section.content.description}</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {section.content.reasons.map((reason, index) => (
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
            <p className="text-gray-700">{section.content.conclusion}</p>
          </div>
        );

      case "visa-options":
        return (
          <div>
            <p
              className="text-gray-700 mb-4"
              dangerouslySetInnerHTML={{ __html: section.content.description }}
            ></p>
            <div className="space-y-4">
              {section.content.visaTypes.map((visa, index) => (
                <div
                  key={index}
                  className={`bg-white p-4 rounded-md border-l-4 border-sky-500 shadow-sm ${isRTL ? "border-l-0 border-r-4" : ""}`}
                >
                  <h3 className="text-lg font-medium text-sky-700 mb-2">
                    {visa.title}
                  </h3>
                  {visa.description && (
                    <p className="text-gray-700 mb-2">{visa.description}</p>
                  )}
                  {visa.points && (
                    <ul
                      className={`text-gray-700 space-y-1 ${isRTL ? "pr-4" : "pl-4"}`}
                    >
                      {visa.points.map((point, pointIndex) => (
                        <li key={pointIndex}>• {point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "required-documents":
        return (
          <div>
            <p className="text-gray-700 mb-4">{section.content.description}</p>
            <div className="bg-sky-50 p-5 rounded-lg border border-sky-100">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.content.requirements.map((req, index) => (
                  <li
                    key={index}
                    className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`text-sky-600 font-bold ${isRTL ? "ml-2" : "mr-2"}`}
                    >
                      •
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-700 mt-4">{section.content.note}</p>
          </div>
        );

      case "popular-cities":
        return (
          <div>
            <p className="text-gray-700 mb-4">{section.content.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {section.content.cities.map((city, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm"
                >
                  <h3
                    className={`text-lg font-medium text-sky-700 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                      {city.icon}
                    </span>
                    {city.name}
                  </h3>
                  <ul
                    className={`text-gray-700 space-y-1 ${isRTL ? "pr-4" : "pl-4"}`}
                  >
                    {city.highlights.map((highlight, hIndex) => (
                      <li key={hIndex}>• {highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case "cost-of-living":
        return (
          <div>
            <p
              className="text-gray-700 mb-4"
              dangerouslySetInnerHTML={{ __html: section.content.description }}
            ></p>
            {renderCostComparisonTable()}
            <p className="text-gray-700">{section.content.conclusion}</p>
          </div>
        );

      case "healthcare":
        return (
          <div className="space-y-4 text-gray-700">
            {section.content.paragraphs.map((paragraph, index) => (
              <div key={index}>
                {paragraph.type === "text" && <p>{paragraph.content}</p>}
                {paragraph.type === "list" && (
                  <div>
                    <p>{paragraph.intro}</p>
                    <ul className={`list-disc ${isRTL ? "pr-6" : "pl-6"} mb-4`}>
                      {paragraph.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "lifestyle":
        return (
          <div className="space-y-3 text-gray-700">
            <ul className={`list-disc ${isRTL ? "pr-6" : "pl-6"} mb-4`}>
              {section.content.differences.map((diff, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: diff }}></li>
              ))}
            </ul>
            <p>{section.content.note}</p>
          </div>
        );

      case "moving":
        return (
          <div className="space-y-3 text-gray-700">
            {section.content.sections.map((moveSection, index) => (
              <div key={index}>
                <p>
                  <strong>{moveSection.title}</strong>
                </p>
                <ul className={`list-disc ${isRTL ? "pr-6" : "pl-6"} mb-4`}>
                  {moveSection.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      dangerouslySetInnerHTML={{ __html: item }}
                    ></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case "banking":
        return (
          <div className="space-y-3 text-gray-700">
            <p>{section.content.intro}</p>
            <ul className={`list-disc ${isRTL ? "pr-6" : "pl-6"} mb-4`}>
              {section.content.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <p>{section.content.conclusion}</p>
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
          <h2 className="text-xl text-sky-600 mb-6">
            {t.usToAustraliaGuide?.subtitle}
          </h2>
          <p className="text-gray-700 mb-4">
            {t.usToAustraliaGuide?.description}
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.usToAustraliaGuide?.navigation?.title}
          </h2>
          <div
            className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {sections.map((section) => (
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
                aria-label={t.usToAustraliaGuide?.accessibility?.sectionButton?.replace(
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
        {sections.map((section) => (
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
              {renderSectionContent(section)}
            </div>
          </section>
        ))}

        {/* State Comparison */}
        {t.usToAustraliaGuide?.stateComparison && (
          <section className="mb-8 bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-lg border border-sky-100">
            <h2
              className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>🗺️</span>
              {t.usToAustraliaGuide?.stateComparison?.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.usToAustraliaGuide?.stateComparison?.comparisons?.map(
                (comp, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm border border-sky-100"
                  >
                    <div
                      className={`flex items-center mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span className={`text-lg ${isRTL ? "ml-2" : "mr-2"}`}>
                        {comp.ausIcon}
                      </span>
                      <span className="text-xs mx-2">vs</span>
                      <span className={`text-lg ${isRTL ? "mr-2" : "ml-2"}`}>
                        {comp.usIcon}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sky-700">
                      {comp.comparison}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {comp.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* Timeline */}
        {t.usToAustraliaGuide?.timeline && (
          <section className="mb-8 bg-white p-6 border border-sky-100 rounded-lg">
            <h2
              className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>📅</span>
              {t.usToAustraliaGuide?.timeline?.title}
            </h2>
            <div className="space-y-4">
              {t.usToAustraliaGuide?.timeline?.phases?.map((phase, index) => (
                <div
                  key={index}
                  className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-bold ${isRTL ? "ml-4" : "mr-4"}`}
                  >
                    {index + 1}
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <h4 className="font-semibold text-sky-700">
                      {phase.timeframe}
                    </h4>
                    <h5 className="font-medium text-gray-800">{phase.title}</h5>
                    <p className="text-gray-600 text-sm">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Final Checklist */}
        <section className="mb-8 bg-sky-50 p-6 rounded-lg border border-sky-100">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>✅</span>
            {t.usToAustraliaGuide?.checklist?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t.usToAustraliaGuide?.checklist?.items?.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-3 rounded-md flex items-center ${isRTL ? "flex-row-reverse" : ""} ${index === t.usToAustraliaGuide?.checklist?.items?.length - 1 ? "md:col-span-2" : ""}`}
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
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>✈️</span>
            {t.usToAustraliaGuide?.conclusion?.title}
          </h2>
          <p className="text-gray-700 w-full">
            {t.usToAustraliaGuide?.conclusion?.description}
          </p>
        </section>
      </div>
    </div>
  );
};

export default USToAustraliaGuide;
