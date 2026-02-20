import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/canadaimmi.json";
import trTranslations from "../../../public/locales/tr/canadaimmi.json";
// import frTranslations from '../../../public/locales/fr/canadaimmi.json';
// import deTranslations from '../../../public/locales/de/canadaimmi.json';
// import arTranslations from '../../../public/locales/ar/canadaimmi.json';

const CanadaMovingCostsGuide = () => {
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
  const costSections = t.canadamovingcosts.costSections;

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Cost Breakdown Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {costSections.map((section) => (
              <div
                key={section.id}
                className="bg-white border border-sky-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div
                  className="flex flex-col md:flex-row md:justify-between md:items-center p-5 cursor-pointer"
                  onClick={() =>
                    setActiveSection(
                      activeSection === section.id ? null : section.id
                    )
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setActiveSection(
                        activeSection === section.id ? null : section.id
                      );
                    }
                  }}
                  aria-expanded={activeSection === section.id}
                  aria-label={`${t.canadamovingcosts.accessibility.toggleSection} ${section.title}`}
                >
                  <div className="flex items-center mb-3 md:mb-0">
                    <div
                      className={`${section.color} text-white p-3 rounded-lg mr-4 flex-shrink-0`}
                    >
                      <span className="text-xl">{section.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-sky-800">
                        {section.title}
                      </h2>
                      {section.details && (
                        <p className="text-sm text-gray-600 mt-1">
                          {section.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                    <div className="text-right md:mr-6">
                      <span className="font-bold text-sky-700 text-xl">
                        {section.amount}
                      </span>
                    </div>
                    <div
                      className={`${section.color} text-white p-2 rounded-lg`}
                    >
                      <svg
                        className={`w-5 h-5 transform transition-transform ${activeSection === section.id ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
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
                </div>

                {/* Expandable Details */}
                {section.subItems && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeSection === section.id ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="bg-sky-50 p-5 space-y-4 border-t border-sky-100">
                      {section.subItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
                        >
                          <span className="text-gray-700 font-medium">
                            {item.title}
                          </span>
                          <span className="font-semibold text-sky-700">
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
          <div className="bg-gradient-to-r from-sky-100 to-blue-50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-sky-800 mb-6 flex items-center">
              <span className="bg-sky-600 text-white p-2 rounded-lg mr-3 text-xl">
                🔢
              </span>
              {t.canadamovingcosts.totalCosts.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.canadamovingcosts.totalCosts.categories
                .slice(0, 2)
                .map((category, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl border border-sky-200 shadow-sm"
                  >
                    <div className="flex flex-col mb-4">
                      <h3 className="font-medium text-lg text-sky-700 mb-2">
                        {category.title}
                      </h3>
                      <span className="text-2xl font-bold text-sky-800">
                        {category.amount}
                      </span>
                    </div>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-sky-200 shadow-sm mt-6">
              <div className="flex flex-col mb-4">
                <h3 className="font-medium text-lg text-sky-700 mb-2">
                  {t.canadamovingcosts.totalCosts.categories[2].title}
                </h3>
                <span className="text-2xl font-bold text-sky-800">
                  {t.canadamovingcosts.totalCosts.categories[2].amount}
                </span>
              </div>
              <p className="text-gray-600">
                {t.canadamovingcosts.totalCosts.categories[2].description}
              </p>
            </div>
          </div>

          {/* Regional Cost Variations */}
          <div className="bg-white rounded-xl border border-sky-100 p-6 mb-8">
            <h2 className="text-2xl font-bold text-sky-800 mb-6 flex items-center">
              <span className="bg-sky-600 text-white p-2 rounded-lg mr-3 text-xl">
                🗺️
              </span>
              {t.canadamovingcosts.regionalCosts.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {t.canadamovingcosts.regionalCosts.categories.map(
                (category, index) => (
                  <div key={index} className="bg-sky-50 p-5 rounded-xl">
                    <h3 className="font-semibold text-sky-700 mb-3 text-center border-b border-sky-200 pb-2">
                      {category.title}
                    </h3>
                    <ul className="space-y-2">
                      {category.cities.map((city, cityIndex) => (
                        <li key={cityIndex} className="flex items-center">
                          <span className="bg-sky-600 w-2 h-2 rounded-full mr-2"></span>
                          {city}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Money-Saving Tips */}
          <div className="bg-sky-50 rounded-xl p-6 border border-sky-100">
            <h2 className="text-2xl font-bold text-sky-800 mb-6 flex items-center">
              <span className="bg-sky-600 text-white p-2 rounded-lg mr-3 text-xl">
                💰
              </span>
              {t.canadamovingcosts.savingTips.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.canadamovingcosts.savingTips.tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500"
                >
                  <h3 className="font-medium text-lg text-sky-700 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-700">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion */}
          <div className="mt-8 text-center py-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {t.canadamovingcosts.conclusion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanadaMovingCostsGuide;
