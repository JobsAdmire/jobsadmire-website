import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/turkeyimmi.json";
import trTranslations from "../../../public/locales/tr/turkeyimmi.json";
// import arTranslations from '../../../public/locales/ar/turkeyimmi.json';
// import frTranslations from '../../../public/locales/fr/turkeyimmi.json';
// import deTranslations from '../../../public/locales/de/turkeyimmi.json';

const TurkeyRelocationRequirements = () => {
  const router = useRouter();
  const { locale } = router;
  const [expandedSections, setExpandedSections] = useState(new Set());

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

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const expandAll = () => {
    setExpandedSections(
      new Set(t.relocationRequirements.sections.map((section) => section.id))
    );
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <div
      className={`bg-sky-50 w-full p-0 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm p-8">
        <h1 className="text-3xl font-bold text-sky-800 mb-6">
          {t.relocationRequirements.title}
        </h1>

        <p className="text-gray-700 mb-8">
          {t.relocationRequirements.description}
        </p>

        {/* Quick Navigation */}
        <div className="mb-8 bg-sky-50 p-6 rounded-lg border border-sky-100">
          <h2 className="text-xl font-semibold text-sky-700 mb-4">
            {t.relocationRequirements.navigation.title}
          </h2>
          <div
            className={`flex flex-wrap gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-sm"
            >
              {t.relocationRequirements.navigation.expandAll}
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-sky-100 text-sky-800 rounded-md hover:bg-sky-200 transition-colors text-sm"
            >
              {t.relocationRequirements.navigation.collapseAll}
            </button>
          </div>
          <div
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 ${isRTL ? "text-right" : "text-left"}`}
          >
            {t.relocationRequirements.sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={`p-2 rounded-md text-sm transition-colors ${
                  expandedSections.has(section.id)
                    ? "bg-sky-600 text-white"
                    : "bg-white text-sky-800 hover:bg-sky-100"
                } border border-sky-200 ${isRTL ? "flex flex-row-reverse items-center" : "flex items-center"}`}
                aria-label={t.relocationRequirements.accessibility.sectionButton.replace(
                  "{title}",
                  section.title
                )}
              >
                <span className={`${isRTL ? "ml-1" : "mr-1"}`}>
                  {section.icon}
                </span>
                <span className="truncate">
                  {section.shortTitle || section.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Requirements Sections */}
        {t.relocationRequirements.sections.map((section, index) => (
          <section key={section.id} className="mb-8">
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full text-left transition-all duration-200 ${isRTL ? "text-right" : "text-left"}`}
              aria-expanded={expandedSections.has(section.id)}
              aria-controls={`section-${section.id}`}
            >
              <h2
                className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center hover:text-sky-800 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                  {section.icon}
                </span>
                <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                  {index + 1}.
                </span>
                {section.title}
                <span
                  className={`transition-transform duration-200 ${expandedSections.has(section.id) ? "rotate-90" : ""} ${isRTL ? "mr-auto" : "ml-auto"}`}
                >
                  ▶
                </span>
              </h2>
            </button>

            <div
              id={`section-${section.id}`}
              className={`transition-all duration-300 overflow-hidden ${
                expandedSections.has(section.id)
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="text-gray-700 space-y-4">
                {section.content.map((content, contentIndex) => (
                  <div key={contentIndex}>
                    {content.type === "paragraph" && (
                      <p dangerouslySetInnerHTML={{ __html: content.text }}></p>
                    )}

                    {content.type === "list" && (
                      <div>
                        {content.title && (
                          <p className="mb-2">{content.title}</p>
                        )}
                        <ul
                          className={`${content.listType === "ordered" ? "list-decimal" : "list-disc"} ${isRTL ? "pr-6" : "pl-6"} space-y-1`}
                        >
                          {content.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              dangerouslySetInnerHTML={{ __html: item }}
                            ></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {content.type === "highlight" && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-amber-800">{content.text}</p>
                      </div>
                    )}

                    {content.type === "steps" && (
                      <div>
                        {content.title && (
                          <p className="mb-2">{content.title}</p>
                        )}
                        <ol
                          className={`list-decimal ${isRTL ? "pr-6" : "pl-6"} space-y-2`}
                        >
                          {content.steps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Bonus Section */}
        <section className="mb-4 bg-sky-50 p-6 border border-sky-100 rounded-lg">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
              {t.relocationRequirements.bonus.icon}
            </span>
            {t.relocationRequirements.bonus.title}
          </h2>
          <p className="text-gray-700 mb-4">
            {t.relocationRequirements.bonus.description}
          </p>
          <ul
            className={`list-disc ${isRTL ? "pr-6" : "pl-6"} text-gray-700 space-y-1`}
          >
            {t.relocationRequirements.bonus.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </section>

        {/* Summary Card */}
        <section className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-lg border border-sky-100">
          <h2
            className={`text-xl font-semibold text-sky-700 mb-3 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`${isRTL ? "ml-2" : "mr-2"}`}>📋</span>
            {t.relocationRequirements.summary.title}
          </h2>
          <p className="text-gray-700 mb-4">
            {t.relocationRequirements.summary.description}
          </p>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${isRTL ? "text-right" : "text-left"}`}
          >
            {t.relocationRequirements.summary.keyPoints.map((point, index) => (
              <div
                key={index}
                className={`bg-white p-3 rounded-md flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className={`text-sky-500 ${isRTL ? "ml-2" : "mr-2"}`}>
                  ✓
                </span>
                <span className="text-sm">{point}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TurkeyRelocationRequirements;
