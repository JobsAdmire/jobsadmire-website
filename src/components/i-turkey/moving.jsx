// components/USToTurkeyGuide.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/turkeyimmi.json";
import trTranslations from "../../../public/locales/tr/turkeyimmi.json";
// import arTranslations from '../../../public/locales/ar/turkeyimmi.json';
// import frTranslations from '../../../public/locales/fr/turkeyimmi.json';
// import deTranslations from '../../../public/locales/de/turkeyimmi.json';

const USToTurkeyGuide = () => {
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

  // Get localized sections
  const sections = t.usTurkeyGuide.sections || [];
  const checklist = t.usTurkeyGuide.checklist || [];

  const handleSectionToggle = (sectionId) => {
    setActiveSection(sectionId === activeSection ? null : sectionId);
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
            <span className={`${isRTL ? "ml-3" : "mr-3"}`}>
              {t.usTurkeyGuide.header.icon}
            </span>
            {t.usTurkeyGuide.header.title}
          </h1>
          <h2 className="text-xl text-sky-600 mb-6">
            {t.usTurkeyGuide.header.subtitle}
          </h2>

          <p className="text-gray-700 mb-4">
            {t.usTurkeyGuide.header.description}
          </p>
          <p className="text-gray-700">
            {t.usTurkeyGuide.header.subDescription}
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.usTurkeyGuide.quickNavigation.title}
          </h2>
          <div
            className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionToggle(section.id)}
                className={`px-3 py-2 rounded-md flex items-center text-sm transition-colors ${isRTL ? "flex-row-reverse" : ""} ${
                  activeSection === section.id
                    ? "bg-sky-600 text-white"
                    : "bg-sky-100 text-sky-800 hover:bg-sky-200"
                }`}
                aria-label={t.usTurkeyGuide.accessibility.sectionToggle.replace(
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
              <div dangerouslySetInnerHTML={{ __html: section.content }}></div>
            </div>
          </section>
        ))}

        {/* Final Checklist */}
        <section className="mb-8 bg-sky-50 p-6 rounded-lg border border-sky-100">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>
              {t.usTurkeyGuide.finalChecklist.icon}
            </span>
            {t.usTurkeyGuide.finalChecklist.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklist.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-3 rounded-md flex items-center ${isRTL ? "flex-row-reverse" : ""} ${item.fullWidth ? "md:col-span-2" : ""}`}
              >
                <span className={`text-green-500 ${isRTL ? "ml-2" : "mr-2"}`}>
                  ✔
                </span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Conclusion */}
        <section className="text-center py-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center justify-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>
              {t.usTurkeyGuide.conclusion.icon}
            </span>
            {t.usTurkeyGuide.conclusion.title}
          </h2>
          <p className="text-gray-700 w-full">
            {t.usTurkeyGuide.conclusion.description}
          </p>
        </section>
      </div>
    </div>
  );
};

export default USToTurkeyGuide;
