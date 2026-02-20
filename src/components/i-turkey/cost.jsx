// components/TurkeyMovingCostsGuide.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/turkeyimmi.json";
import trTranslations from "../../../public/locales/tr/turkeyimmi.json";
// import arTranslations from '../../../public/locales/ar/turkeyimmi.json';
// import frTranslations from '../../../public/locales/fr/turkeyimmi.json';
// import deTranslations from '../../../public/locales/de/turkeyimmi.json';

const TurkeyMovingCostsGuide = () => {
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

  // Get localized cost sections
  const costSections = t.turkeyMovingCostsGuide.costSections || [];

  const handleSectionToggle = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div
      className={`bg-sky-50 w-full p-0 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm p-8">
        <h1 className="text-3xl font-bold text-sky-800 mb-6">
          {t.turkeyMovingCostsGuide.title}
        </h1>

        <p className="text-gray-700 mb-8">
          {t.turkeyMovingCostsGuide.description}
        </p>

        {/* Cost Breakdown Cards */}
        <div className="space-y-4 mb-8">
          {costSections.map((section) => (
            <div
              key={section.id}
              className="bg-white border border-sky-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`flex justify-between items-center p-4 cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}
                onClick={() => handleSectionToggle(section.id)}
                role="button"
                tabIndex={0}
                aria-expanded={activeSection === section.id}
                aria-label={t.turkeyMovingCostsGuide.accessibility.toggleSection.replace(
                  "{title}",
                  section.title
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSectionToggle(section.id);
                  }
                }}
              >
                <div
                  className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`${section.color} text-white p-3 rounded-full ${isRTL ? "ml-4" : "mr-4"}`}
                  >
                    <span className="text-xl">{section.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-sky-800">
                      {section.title}
                    </h2>
                    {section.details && (
                      <p className="text-sm text-gray-600">{section.details}</p>
                    )}
                  </div>
                </div>
                <div
                  className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`text-${isRTL ? "left" : "right"} ${isRTL ? "ml-3" : "mr-3"}`}
                  >
                    <span className="font-bold text-sky-700">
                      {section.amount}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-sky-500 transform transition-transform ${isRTL ? "rotate-180" : ""} ${activeSection === section.id ? (isRTL ? "rotate-0" : "rotate-180") : isRTL ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Expandable Details */}
              {section.subItems && (
                <div
                  className={`bg-sky-50 overflow-hidden transition-all duration-300 ${
                    activeSection === section.id ? "max-h-96 p-4" : "max-h-0"
                  }`}
                >
                  <div className="space-y-3">
                    {section.subItems.map((item, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <span className="text-gray-700">{item.title}</span>
                        <span className="font-medium text-sky-700">
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total Cost Summary */}
        <div className="bg-gradient-to-r from-sky-100 to-blue-50 rounded-lg p-6 mb-8">
          <h2
            className={`text-2xl font-semibold text-sky-800 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>
              {t.turkeyMovingCostsGuide.totalBudget.icon}
            </span>
            {t.turkeyMovingCostsGuide.totalBudget.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.turkeyMovingCostsGuide.totalBudget.categories.map(
              (category, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-sky-200 shadow-sm"
                >
                  <div
                    className={`flex justify-between items-center mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <h3 className="font-medium text-sky-700">
                      {category.title}
                    </h3>
                    <span className="text-lg font-bold text-sky-800">
                      {category.amount}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Money-Saving Tips */}
        <div className="bg-sky-50 rounded-lg p-6 border border-sky-100">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>
              {t.turkeyMovingCostsGuide.moneySavingTips.icon}
            </span>
            {t.turkeyMovingCostsGuide.moneySavingTips.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.turkeyMovingCostsGuide.moneySavingTips.tips.map((tip, index) => (
              <div
                key={index}
                className={`bg-white p-4 rounded-md border-l-4 border-green-500 ${isRTL ? "border-l-0 border-r-4" : ""}`}
              >
                <h3 className="font-medium text-sky-700 mb-2">{tip.title}</h3>
                <p className="text-gray-700">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div className="mt-8 text-center py-6">
          <p className="text-gray-700 w-full">
            {t.turkeyMovingCostsGuide.conclusion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TurkeyMovingCostsGuide;
