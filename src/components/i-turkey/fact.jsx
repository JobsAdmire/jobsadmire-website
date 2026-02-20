// components/TurkeyFacts.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/turkeyimmi.json";
import trTranslations from "../../../public/locales/tr/turkeyimmi.json";
// import arTranslations from '../../../public/locales/ar/turkeyimmi.json';
// import frTranslations from '../../../public/locales/fr/turkeyimmi.json';
// import deTranslations from '../../../public/locales/de/turkeyimmi.json';

const TurkeyFacts = () => {
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
  const facts = t.turkeyFactsCard.facts || [];

  const handlePreviousFact = () => {
    setActiveFactIndex((prev) => (prev > 0 ? prev - 1 : facts.length - 1));
  };

  const handleNextFact = () => {
    setActiveFactIndex((prev) => (prev < facts.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className={`bg-sky-50 w-full p-0 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm p-8">
        <h1 className="text-3xl font-bold text-sky-800 mb-6">
          {t.turkeyFactsCard.title}
        </h1>

        <p className="text-gray-700 mb-8">{t.turkeyFactsCard.description}</p>

        {/* Fact Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.turkeyFactsCard.navigation.title}
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
                    ? "bg-sky-600 text-white"
                    : "bg-sky-100 text-sky-800 hover:bg-sky-200"
                }`}
                aria-label={t.turkeyFactsCard.accessibility.factButton.replace(
                  "{title}",
                  fact.title
                )}
              >
                <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                  {fact.icon}
                </span>
                {fact.title}
              </button>
            ))}
          </div>
        </div>

        {/* Current Fact Display */}
        <section className="mb-8 bg-sky-50 p-6 border border-sky-100 rounded-lg">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-3xl ${isRTL ? "ml-3" : "mr-3"}`}>
              {facts[activeFactIndex]?.icon}
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
            className={`flex justify-between pt-4 border-t border-sky-100 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <button
              onClick={handlePreviousFact}
              className={`text-sky-700 hover:text-sky-900 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              aria-label={t.turkeyFactsCard.accessibility.previousFact}
            >
              <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                {isRTL ? "→" : "←"}
              </span>
              {t.turkeyFactsCard.navigation.previous}
            </button>
            <button
              onClick={handleNextFact}
              className={`text-sky-700 hover:text-sky-900 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              aria-label={t.turkeyFactsCard.accessibility.nextFact}
            >
              {t.turkeyFactsCard.navigation.next}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {isRTL ? "←" : "→"}
              </span>
            </button>
          </div>
        </section>

        {/* Additional Facts List */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.turkeyFactsCard.allFacts.title}
          </h2>

          {facts.map((fact, index) => (
            <div key={index} className="mb-6">
              <h3
                className={`text-lg font-medium text-sky-600 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className={`text-xl ${isRTL ? "ml-2" : "mr-2"}`}>
                  {fact.icon}
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
      </div>
    </div>
  );
};

export default TurkeyFacts;
