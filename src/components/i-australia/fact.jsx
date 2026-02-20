import React, { useState } from "react";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/australiaimmi.json";
import trTranslations from "../../../public/locales/tr/australiaimmi.json";
// import arTranslations from '../../../public/locales/ar/australiaimmi.json';
// import frTranslations from '../../../public/locales/fr/australiaimmi.json';
// import deTranslations from '../../../public/locales/de/australiaimmi.json';

const AustraliaFactsCard = () => {
  const router = useRouter();
  const { locale } = router;
  const [activeFactIndex, setActiveFactIndex] = useState(0);

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

  // Get localized facts
  const facts = t.australiaFacts?.facts || [];

  const handlePreviousFact = () => {
    setActiveFactIndex((prev) => (prev > 0 ? prev - 1 : facts.length - 1));
  };

  const handleNextFact = () => {
    setActiveFactIndex((prev) => (prev < facts.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className={`bg-green-50 w-full p-0 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm p-8">
        <p className="text-gray-700 mb-8">{t.australiaFacts?.description}</p>

        {/* Fact Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            {t.australiaFacts?.navigation?.title}
          </h2>
          <div
            className={`flex flex-wrap gap-2 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {facts.map((fact, index) => (
              <button
                key={index}
                onClick={() => setActiveFactIndex(index)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeFactIndex === index
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
                aria-label={t.australiaFacts?.accessibility?.factButton?.replace(
                  "{title}",
                  fact.title
                )}
              >
                <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                  {fact.emoji}
                </span>
                {fact.title}
              </button>
            ))}
          </div>
        </div>

        {/* Current Fact Display */}
        <section className="mb-8 bg-green-50 p-6 border border-green-100 rounded-lg">
          <h2
            className={`text-2xl font-semibold text-green-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-3xl ${isRTL ? "ml-3" : "mr-3"}`}>
              {facts[activeFactIndex]?.emoji}
            </span>
            {facts[activeFactIndex]?.title}
          </h2>

          <p className="text-gray-700 text-lg mb-6">
            <span
              dangerouslySetInnerHTML={{
                __html: facts[activeFactIndex]?.description,
              }}
            ></span>
          </p>

          {/* Navigation buttons */}
          <div
            className={`flex justify-between pt-4 border-t border-green-100 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <button
              onClick={handlePreviousFact}
              className={`text-green-700 hover:text-green-900 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              aria-label={t.australiaFacts?.accessibility?.previousFact}
            >
              <ChevronLeft
                className={`w-5 h-5 ${isRTL ? "ml-1 rotate-180" : "mr-1"}`}
              />
              {t.australiaFacts?.navigation?.previous}
            </button>
            <button
              onClick={handleNextFact}
              className={`text-green-700 hover:text-green-900 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              aria-label={t.australiaFacts?.accessibility?.nextFact}
            >
              {t.australiaFacts?.navigation?.next}
              <ChevronRight
                className={`w-5 h-5 ${isRTL ? "mr-1 rotate-180" : "ml-1"}`}
              />
            </button>
          </div>
        </section>

        {/* All Facts List */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            {t.australiaFacts?.allFacts?.title}
          </h2>

          {facts.map((fact, index) => (
            <div key={index} className="mb-6">
              <h3
                className={`text-lg font-medium text-green-600 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className={`text-xl ${isRTL ? "ml-2" : "mr-2"}`}>
                  {fact.emoji}
                </span>
                {fact.title}
              </h3>
              <p className={`text-gray-700 ${isRTL ? "pr-8" : "pl-8"}`}>
                <span
                  dangerouslySetInnerHTML={{ __html: fact.description }}
                ></span>
              </p>
            </div>
          ))}
        </section>

        {/* Statistics Section */}
        {t.australiaFacts?.statistics && (
          <section className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
            <h2
              className={`text-2xl font-semibold text-green-700 mb-6 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>📊</span>
              {t.australiaFacts?.statistics?.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.australiaFacts?.statistics?.items?.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-green-100"
                >
                  <div
                    className={`flex items-center mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className={`text-lg ${isRTL ? "ml-2" : "mr-2"}`}>
                      {stat.icon}
                    </span>
                    <h4 className="font-semibold text-green-700">
                      {stat.label}
                    </h4>
                  </div>
                  <p className="text-xl font-bold text-green-600">
                    {stat.value}
                  </p>
                  {stat.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {stat.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Did You Know Section */}
        {t.australiaFacts?.didYouKnow && (
          <section className="bg-green-100 p-6 rounded-lg border-l-4 border-green-500">
            <h3
              className={`text-lg font-semibold text-green-700 mb-3 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-xl ${isRTL ? "ml-2" : "mr-2"}`}>💡</span>
              {t.australiaFacts?.didYouKnow?.title}
            </h3>
            <ul className={`space-y-2 ${isRTL ? "pr-6" : "pl-6"}`}>
              {t.australiaFacts?.didYouKnow?.items?.map((item, index) => (
                <li
                  key={index}
                  className={`text-gray-700 flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span
                    className={`text-green-500 ${isRTL ? "ml-2" : "mr-2"} mt-1`}
                  >
                    •
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: item }}></span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default AustraliaFactsCard;
