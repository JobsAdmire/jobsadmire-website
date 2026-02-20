// components/TurkeyJobGuide.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/turkeyimmi.json";
import trTranslations from "../../../public/locales/tr/turkeyimmi.json";
// import arTranslations from '../../../public/locales/ar/turkeyimmi.json';
// import frTranslations from '../../../public/locales/fr/turkeyimmi.json';
// import deTranslations from '../../../public/locales/de/turkeyimmi.json';

const TurkeyJobGuide = () => {
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
  const sections = t.turkeyJobGuide.sections || [];
  const checklist = t.turkeyJobGuide.checklist || [];

  const handleSectionToggle = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div
      className={`bg-sky-50 w-full p-0 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm p-8">
        <h1
          className={`text-3xl font-bold text-sky-800 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <span className={`${isRTL ? "ml-3" : "mr-3"}`}>
            {t.turkeyJobGuide.header.icon}
          </span>
          {t.turkeyJobGuide.header.title}
        </h1>
        <h2 className="text-xl text-sky-600 mb-6">
          {t.turkeyJobGuide.header.subtitle}
        </h2>

        <div className="text-gray-700 mb-8">
          <p>{t.turkeyJobGuide.header.description}</p>
          <p className="mt-4">{t.turkeyJobGuide.header.subDescription}</p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.turkeyJobGuide.navigation.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionToggle(section.id)}
                className={`text-left p-3 rounded-md flex items-center border transition-all ${isRTL ? "flex-row-reverse text-right" : ""} ${
                  activeSection === section.id
                    ? "bg-sky-100 border-sky-300"
                    : "bg-white border-sky-100 hover:bg-sky-50"
                }`}
                aria-label={t.turkeyJobGuide.accessibility.sectionToggle.replace(
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
              {t.turkeyJobGuide.finalChecklist.icon}
            </span>
            {t.turkeyJobGuide.finalChecklist.title}
          </h2>
          <ul className="space-y-3">
            {checklist.map((item, index) => (
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
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>
              {t.turkeyJobGuide.conclusion.icon}
            </span>
            {t.turkeyJobGuide.conclusion.title}
          </h2>
          <p className="text-gray-700 w-full">
            {t.turkeyJobGuide.conclusion.description}
          </p>
        </section>
      </div>
    </div>
  );
};

export default TurkeyJobGuide;
