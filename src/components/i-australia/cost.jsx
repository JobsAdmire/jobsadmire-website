import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/australiaimmi.json";
import trTranslations from "../../../public/locales/tr/australiaimmi.json";
// import arTranslations from '../../../public/locales/ar/australiaimmi.json';
// import frTranslations from '../../../public/locales/fr/australiaimmi.json';
// import deTranslations from '../../../public/locales/de/australiaimmi.json';

const AustraliaMovingCostsGuide = () => {
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

  // Get cost sections from translations
  const costSections = t.movingCosts?.costSections || [];

  return (
    <div
      className={`bg-sky-50 w-full p-0 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm p-8">
        <p className="text-gray-700 mb-8">{t.movingCosts?.description}</p>

        {/* Cost Breakdown Cards */}
        <div className="space-y-4 mb-8">
          {costSections.map((section) => (
            <div
              key={section.id}
              className="bg-white border border-sky-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`flex justify-between items-center p-4 cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}
                onClick={() =>
                  setActiveSection(
                    activeSection === section.id ? null : section.id
                  )
                }
              >
                <div
                  className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`${section.color} text-white p-3 rounded-full ${isRTL ? "ml-4" : "mr-4"}`}
                  >
                    <span className="text-xl">{section.icon}</span>
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
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
                    className={`${isRTL ? "ml-3 text-left" : "text-right mr-3"}`}
                  >
                    <span className="font-bold text-sky-700">
                      {section.amount}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-sky-500 transform transition-transform ${activeSection === section.id ? "rotate-180" : ""} ${isRTL ? "rotate-180" : ""}`}
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
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>🔍</span>
            {t.movingCosts?.totalCost?.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.movingCosts?.totalCost?.approaches?.map((approach, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-sky-200 shadow-sm"
              >
                <div
                  className={`flex justify-between items-center mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <h3 className="font-medium text-sky-700">{approach.title}</h3>
                  <span className="text-lg font-bold text-sky-800">
                    {approach.amount}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{approach.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cost-Saving Tips */}
        <div className="bg-sky-50 rounded-lg p-6 border border-sky-100">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>💰</span>
            {t.movingCosts?.savingTips?.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.movingCosts?.savingTips?.tips?.map((tip, index) => (
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

        {/* Additional Cost Considerations */}
        <div className="mt-8 bg-white p-6 border border-sky-100 rounded-lg">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.movingCosts?.additionalConsiderations?.title}
          </h2>

          <div className="space-y-3 text-gray-700">
            {t.movingCosts?.additionalConsiderations?.items?.map(
              (item, index) => (
                <p key={index}>
                  <span className="font-medium text-sky-700">
                    {item.label}:
                  </span>{" "}
                  {item.description}
                </p>
              )
            )}
          </div>
        </div>

        {/* Cost Calculator Section */}
        {t.movingCosts?.calculator && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-sky-50 p-6 border border-sky-100 rounded-lg">
            <h2
              className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>🧮</span>
              {t.movingCosts?.calculator?.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {t.movingCosts?.calculator?.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {t.movingCosts?.calculator?.factors?.map((factor, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-sky-200"
                >
                  <div
                    className={`flex items-center mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className={`text-lg ${isRTL ? "ml-2" : "mr-2"}`}>
                      {factor.icon}
                    </span>
                    <h4 className="font-semibold text-sky-700">
                      {factor.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600">{factor.description}</p>
                  <p className="text-sky-600 font-medium mt-1">
                    {factor.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline and Planning */}
        {t.movingCosts?.timeline && (
          <div className="mt-8 bg-white p-6 border border-sky-100 rounded-lg">
            <h2
              className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>📅</span>
              {t.movingCosts?.timeline?.title}
            </h2>

            <div className="space-y-4">
              {t.movingCosts?.timeline?.phases?.map((phase, index) => (
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
                    <p className="text-sky-600 font-medium text-sm">
                      {phase.estimatedCost}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conclusion */}
        <div className="mt-8 text-center py-6">
          <p className="text-gray-700 w-full">{t.movingCosts?.conclusion}</p>
        </div>
      </div>
    </div>
  );
};

export default AustraliaMovingCostsGuide;
