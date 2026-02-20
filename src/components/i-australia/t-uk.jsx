import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/australiaimmi.json";
import trTranslations from "../../../public/locales/tr/australiaimmi.json";
// import arTranslations from '../../../public/locales/ar/australiaimmi.json';
// import frTranslations from '../../../public/locales/fr/australiaimmi.json';
// import deTranslations from '../../../public/locales/de/australiaimmi.json';
const UKToAustraliaGuide = () => {
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
  const sections = t.ukToAustraliaGuide?.sections || [];

  const renderCostTable = () => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border border-sky-200 rounded-lg">
        <thead>
          <tr className="bg-sky-100">
            <th
              className={`py-3 px-4 border-b border-sky-200 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t.ukToAustraliaGuide?.costTable?.headers?.category}
            </th>
            <th
              className={`py-3 px-4 border-b border-sky-200 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t.ukToAustraliaGuide?.costTable?.headers?.cost}
            </th>
          </tr>
        </thead>
        <tbody>
          {t.ukToAustraliaGuide?.costTable?.rows?.map((row, index) => (
            <tr key={index} className={index % 2 === 1 ? "bg-sky-50" : ""}>
              <td className="py-3 px-4 border-b border-sky-100 font-medium">
                {row.category}
              </td>
              <td className="py-3 px-4 border-b border-sky-100">{row.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSectionContent = (section) => {
    switch (section.id) {
      case "why-move":
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

      case "visa-requirements":
        return (
          <div>
            <p className="text-gray-700 mb-4">{section.content.description}</p>
            <div className="space-y-4">
              {section.content.visaTypes.map((visa, index) => (
                <div
                  key={index}
                  className={`bg-white p-4 rounded-md border-l-4 border-sky-500 shadow-sm ${isRTL ? "border-l-0 border-r-4" : ""}`}
                >
                  <h3 className="text-lg font-medium text-sky-700 mb-2">
                    {visa.title}
                  </h3>
                  <p className="text-gray-700 mb-2">{visa.description}</p>
                  {visa.keyPoints && (
                    <div className="mt-3">
                      <h4 className="font-medium text-sky-600 mb-2">
                        {visa.keyPointsTitle}
                      </h4>
                      <ul
                        className={`text-gray-700 space-y-1 ${isRTL ? "pr-4" : "pl-4"}`}
                      >
                        {visa.keyPoints.map((point, pointIndex) => (
                          <li key={pointIndex}>• {point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "other-requirements":
        return (
          <div className="space-y-3 text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {section.content.requirements.map((req, index) => (
                <div
                  key={index}
                  className={`bg-white p-3 rounded-md shadow-sm border border-sky-100 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className={`text-sky-600 ${isRTL ? "ml-2" : "mr-2"}`}>
                    •
                  </span>
                  <span>{req}</span>
                </div>
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
                  dangerouslySetInnerHTML={{ __html: section.content.tip }}
                ></span>
              </p>
            </div>
          </div>
        );

      case "cost-moving":
        return (
          <div>
            <p
              className="text-gray-700 mb-4"
              dangerouslySetInnerHTML={{ __html: section.content.description }}
            ></p>
            {renderCostTable()}
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
                  dangerouslySetInnerHTML={{ __html: section.content.tip }}
                ></span>
              </p>
            </div>
          </div>
        );

      case "lifestyle":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.content.aspects.map((aspect, index) => (
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

      case "popular-cities":
        return (
          <div>
            <p className="text-gray-700 mb-4">{section.content.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {section.content.cities.map((city, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-sky-100"
                >
                  <h3 className="font-medium text-sky-700 mb-2">{city.name}</h3>
                  <p className="text-gray-700">{city.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "practical-tips":
        return (
          <div className="space-y-3 text-gray-700">
            {section.content.tips.map((tip, index) => (
              <p key={index}>{tip}</p>
            ))}
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
                  dangerouslySetInnerHTML={{ __html: section.content.mainTip }}
                ></span>
              </p>
            </div>
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
            {t.ukToAustraliaGuide?.subtitle}
          </h2>
          <p className="text-gray-700 mb-4">
            {t.ukToAustraliaGuide?.description}
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.ukToAustraliaGuide?.navigation?.title}
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
                aria-label={t.ukToAustraliaGuide?.accessibility?.sectionButton?.replace(
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

        {/* UK vs Australia Comparison */}
        {t.ukToAustraliaGuide?.comparison && (
          <section className="mb-8 bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-lg border border-sky-100">
            <h2
              className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>⚖️</span>
              {t.ukToAustraliaGuide?.comparison?.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.ukToAustraliaGuide?.comparison?.aspects?.map(
                (aspect, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm border border-sky-100"
                  >
                    <div
                      className={`flex items-center mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span className={`text-lg ${isRTL ? "ml-2" : "mr-2"}`}>
                        {aspect.icon}
                      </span>
                      <h4 className="font-semibold text-sky-700">
                        {aspect.category}
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div
                        className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <span className="text-gray-600">🇬🇧 UK:</span>
                        <span className="font-medium">{aspect.uk}</span>
                      </div>
                      <div
                        className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <span className="text-gray-600">🇦🇺 Australia:</span>
                        <span className="font-medium">{aspect.australia}</span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* Moving Timeline */}
        {t.ukToAustraliaGuide?.timeline && (
          <section className="mb-8 bg-white p-6 border border-sky-100 rounded-lg">
            <h2
              className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>📅</span>
              {t.ukToAustraliaGuide?.timeline?.title}
            </h2>
            <div className="space-y-4">
              {t.ukToAustraliaGuide?.timeline?.phases?.map((phase, index) => (
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
            {t.ukToAustraliaGuide?.checklist?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t.ukToAustraliaGuide?.checklist?.items?.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-3 rounded-md flex items-center ${isRTL ? "flex-row-reverse" : ""} ${index === t.ukToAustraliaGuide?.checklist?.items?.length - 1 ? "md:col-span-2" : ""}`}
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
            {t.ukToAustraliaGuide?.conclusion?.title}
          </h2>
          <p className="text-gray-700 w-full">
            {t.ukToAustraliaGuide?.conclusion?.description}
          </p>
        </section>
      </div>
    </div>
  );
};

export default UKToAustraliaGuide;
