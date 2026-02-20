import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/australiaimmi.json";
import trTranslations from "../../../public/locales/tr/australiaimmi.json";
// import arTranslations from '../../../public/locales/ar/australiaimmi.json';
// import frTranslations from '../../../public/locales/fr/australiaimmi.json';
// import deTranslations from '../../../public/locales/de/australiaimmi.json';

const AustraliaJobGuide = () => {
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
  const sections = t.jobGuide?.sections || [];

  const renderSectionContent = (section) => {
    switch (section.id) {
      case "right-to-work":
        return (
          <div>
            <p className="text-gray-700 mb-4">{section.content.description}</p>
            <ul
              className={`list-disc ${isRTL ? "pr-6" : "pl-6"} mb-4 text-gray-700`}
            >
              {section.content.visaOptions.map((visa, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: visa }}></li>
              ))}
            </ul>
            <p className="text-gray-700">{section.content.conclusion}</p>
          </div>
        );

      case "skills-qualifications":
        return (
          <div>
            <ul
              className={`list-disc ${isRTL ? "pr-6" : "pl-6"} mb-4 text-gray-700`}
            >
              {section.content.requirements.map((req, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: req }}></li>
              ))}
            </ul>

            <div className="bg-sky-50 p-4 rounded-md border border-sky-100 mb-4">
              <h3 className="text-lg font-medium text-sky-600 mb-2">
                {section.content.popularFields.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.content.popularFields.fields.map((field, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-md shadow-sm border border-sky-100"
                  >
                    <span className="font-medium">{field.title}</span>
                    <p className="text-sm text-gray-600">{field.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "job-search":
        return (
          <div>
            <p className="text-gray-700 mb-4">{section.content.description}</p>

            <h3 className="text-lg font-medium text-sky-600 mb-3">
              {section.content.jobPortals.title}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {section.content.jobPortals.portals.map((portal, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-md text-center hover:bg-sky-50 border border-sky-100 cursor-pointer transition-colors"
                >
                  {portal}
                </div>
              ))}
            </div>

            <h3 className="text-lg font-medium text-sky-600 mb-3">
              {section.content.proTips.title}
            </h3>
            <ul
              className={`list-disc ${isRTL ? "pr-6" : "pl-6"} mb-4 text-gray-700`}
            >
              {section.content.proTips.tips.map((tip, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: tip }}></li>
              ))}
            </ul>
          </div>
        );

      case "sponsorship":
        return (
          <div>
            <p className="text-gray-700 mb-4">{section.content.description}</p>

            <div
              className={`flex flex-col md:flex-row gap-6 mb-6 ${isRTL ? "md:flex-row-reverse" : ""}`}
            >
              {section.content.types.map((type, index) => (
                <div
                  key={index}
                  className="flex-1 bg-white p-4 rounded-md border border-sky-100"
                >
                  <h3 className="text-lg font-medium text-sky-600 mb-3">
                    {type.title}
                  </h3>
                  <ul
                    className={`list-disc ${isRTL ? "pr-6" : "pl-6"} text-gray-700`}
                  >
                    {type.points.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="space-y-4 text-gray-700">
            <ul
              className={`list-disc ${isRTL ? "pr-6" : "pl-6"} mb-4 text-gray-700`}
            >
              {section.content.requiredDocuments.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>

            <div className="bg-sky-50 p-4 rounded-md border border-sky-100">
              <h3 className="text-lg font-medium text-sky-600 mb-2">
                {section.content.resumeTips.title}
              </h3>
              <ul
                className={`list-disc ${isRTL ? "pr-6" : "pl-6"} text-gray-700`}
              >
                {section.content.resumeTips.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "australian-workplace":
        return (
          <div>
            <p className="text-gray-700 mb-4">{section.content.description}</p>
            <ul
              className={`list-disc ${isRTL ? "pr-6" : "pl-6"} mb-4 text-gray-700`}
            >
              {section.content.characteristics.map((char, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: char }}></li>
              ))}
            </ul>
          </div>
        );

      case "salary-expectations":
        return (
          <div className="space-y-4 text-gray-700">
            <p>{section.content.description}</p>
            <p>{section.content.keyFactsIntro}</p>
            <ul
              className={`list-disc ${isRTL ? "pr-6" : "pl-6"} mb-4 text-gray-700`}
            >
              {section.content.keyFacts.map((fact, index) => (
                <li key={index}>{fact}</li>
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
        <h2 className="text-xl text-sky-600 mb-6">{t.jobGuide?.subtitle}</h2>

        <div className="text-gray-700 mb-8">
          <p>{t.jobGuide?.description}</p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.jobGuide?.navigation?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  setActiveSection(
                    activeSection === section.id ? null : section.id
                  )
                }
                className={`p-3 rounded-md flex items-center border transition-all ${
                  activeSection === section.id
                    ? "bg-sky-100 border-sky-300"
                    : "bg-white border-sky-100 hover:bg-sky-50"
                } ${isRTL ? "text-right flex-row-reverse" : "text-left"}`}
                aria-label={t.jobGuide?.accessibility?.sectionButton?.replace(
                  "{title}",
                  section.title
                )}
              >
                <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>
                  {section.icon}
                </span>
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <section
            key={section.id}
            className={`mb-8 transition-all duration-300 ${
              activeSection === section.id || activeSection === null
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
                activeSection === section.id || activeSection === null
                  ? "max-h-[2000px]"
                  : "max-h-0"
              }`}
            >
              {renderSectionContent(section)}
            </div>
          </section>
        ))}

        {/* Success Stories Section */}
        {t.jobGuide?.successStories && (
          <section className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
            <h2
              className={`text-2xl font-semibold text-green-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>🌟</span>
              {t.jobGuide?.successStories?.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.jobGuide?.successStories?.stories?.map((story, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-green-100"
                >
                  <div
                    className={`flex items-center mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className={`text-lg ${isRTL ? "ml-2" : "mr-2"}`}>
                      {story.flag}
                    </span>
                    <h4 className="font-semibold text-green-700">
                      {story.profession}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{story.origin}</p>
                  <p className="text-gray-700 text-sm">{story.story}</p>
                  <p className="text-green-600 font-medium text-sm mt-2">
                    {story.outcome}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Industry Insights */}
        {t.jobGuide?.industryInsights && (
          <section className="mb-8 bg-white p-6 border border-sky-100 rounded-lg">
            <h2
              className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>📊</span>
              {t.jobGuide?.industryInsights?.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {t.jobGuide?.industryInsights?.insights?.map((insight, index) => (
                <div
                  key={index}
                  className="bg-sky-50 p-4 rounded-lg border border-sky-100"
                >
                  <h4 className="font-semibold text-sky-700 mb-2">
                    {insight.category}
                  </h4>
                  <div className="space-y-2">
                    <div
                      className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span className="text-sm text-gray-600">
                        {insight.metric}
                      </span>
                      <span className="font-bold text-sky-600">
                        {insight.value}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {insight.description}
                    </p>
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
            {t.jobGuide?.checklist?.title}
          </h2>
          <ul className="space-y-3">
            {t.jobGuide?.checklist?.items?.map((item, index) => (
              <li
                key={index}
                className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className={`text-green-500 ${isRTL ? "ml-2" : "mr-2"}`}>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Conclusion */}
        <section className="text-center py-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center justify-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>✈️</span>
            {t.jobGuide?.conclusion?.title}
          </h2>
          <p className="text-gray-700 w-full">
            {t.jobGuide?.conclusion?.description}
          </p>
        </section>
      </div>
    </div>
  );
};

export default AustraliaJobGuide;
