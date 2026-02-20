import React, { useState } from "react";
import { useRouter } from "next/router";
import { Crown, GraduationCap, Waves, Lightbulb, Mountain } from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/ukimmmi.json";
// import frTranslations from '../../../public/locales/fr/ukimmmi.json';
// import deTranslations from '../../../public/locales/de/ukimmmi.json';
import trTranslations from "../../../public/locales/tr/ukimmmi.json";
// import arTranslations from '../../../public/locales/ar/ukimmmi.json';

// CSS-in-JS style definition for hiding scrollbars
const HideScrollbarStyles = () => (
  <style jsx global>{`
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `}</style>
);

const UKInfoCard = () => {
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
  const ukFacts = t.ukInfoCard.facts;

  // Language switcher component
  const LanguageSwitcher = () => {
    const availableLocales = ["en", "fr", "de", "es", "ar"];
    const localeNames = {
      en: "English",
      fr: "Français",
      de: "Deutsch",
      es: "Español",
      ar: "العربية",
    };

    const switchLanguage = (newLocale) => {
      router.push(router.pathname, router.asPath, { locale: newLocale });
    };

    return (
      <div className="absolute top-4 right-4 z-30">
        <div className="relative group">
          <button className="bg-white/90 backdrop-blur-md border border-sky-200 text-sky-700 px-4 py-2 rounded-lg hover:bg-white transition-all duration-300 flex items-center space-x-2 shadow-md">
            <span className="text-sm font-medium">{localeNames[locale]}</span>
            <svg
              className="w-4 h-4 transform group-hover:rotate-180 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="absolute top-full right-0 mt-2 bg-white backdrop-blur-md border border-sky-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[140px] z-50">
            {availableLocales.map((localeOption) => (
              <button
                key={localeOption}
                onClick={() => switchLanguage(localeOption)}
                className={`block w-full text-left px-4 py-3 text-sm hover:bg-sky-50 transition-colors ${
                  locale === localeOption
                    ? "text-sky-600 font-medium bg-sky-50"
                    : "text-sky-700"
                } first:rounded-t-lg last:rounded-b-lg`}
              >
                {localeNames[localeOption]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Icon mapping
  const iconMap = {
    crown: <Crown className="w-6 h-6" />,
    graduation: <GraduationCap className="w-6 h-6" />,
    waves: <Waves className="w-6 h-6" />,
    lightbulb: <Lightbulb className="w-6 h-6" />,
    mountain: <Mountain className="w-6 h-6" />,
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-sky-50 to-white font-sans relative ${locale === "ar" ? "rtl" : "ltr"}`}
    >
      {/* Include the styles component */}
      <HideScrollbarStyles />

      {/* Language Switcher */}

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            {t.ukInfoCard.title}
          </h1>
          <div className="h-1 w-24 bg-sky-600 mx-auto mb-6"></div>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            {t.ukInfoCard.description}
          </p>
        </header>

        {/* Main Feature Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-12">
          {/* Feature Navigation */}
          <div
            className={`flex overflow-x-auto hide-scrollbar border-b border-slate-100 ${locale === "ar" ? "flex-row-reverse" : ""}`}
          >
            {ukFacts.map((fact, index) => (
              <button
                key={index}
                onClick={() => setActiveFactIndex(index)}
                className={`px-6 py-4 flex items-center whitespace-nowrap transition-colors ${locale === "ar" ? "flex-row-reverse" : ""} ${
                  activeFactIndex === index
                    ? "border-b-2 border-sky-600 text-sky-600 bg-sky-50"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${locale === "ar" ? "ml-3" : "mr-3"} ${fact.color}`}
                >
                  {iconMap[fact.iconType]}
                </div>
                {fact.title}
              </button>
            ))}
          </div>

          {/* Feature Content */}
          <div className="p-8 md:p-12">
            <div
              className={`flex flex-col md:flex-row ${locale === "ar" ? "md:flex-row-reverse" : ""}`}
            >
              <div
                className={`md:w-1/3 mb-6 md:mb-0 ${locale === "ar" ? "md:pl-8" : "md:pr-8"}`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 ${ukFacts[activeFactIndex].color}`}
                >
                  <span className="text-2xl">
                    {ukFacts[activeFactIndex].emoji}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                  {ukFacts[activeFactIndex].title}
                </h2>
                <p className="text-slate-600 font-medium">
                  {ukFacts[activeFactIndex].content}
                </p>
              </div>

              <div className="md:w-2/3 bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h3 className="text-lg font-medium text-slate-700 mb-3">
                  {t.ukInfoCard.didYouKnow}
                </h3>
                <p className="text-slate-600">
                  {ukFacts[activeFactIndex].detail}
                </p>

                {/* Navigation buttons */}
                <div
                  className={`flex justify-between mt-8 pt-4 border-t border-slate-200 ${locale === "ar" ? "flex-row-reverse" : ""}`}
                >
                  <button
                    onClick={() =>
                      setActiveFactIndex((prev) =>
                        prev > 0 ? prev - 1 : ukFacts.length - 1
                      )
                    }
                    className={`text-sky-600 hover:text-sky-800 flex items-center font-medium ${locale === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    <span className={`${locale === "ar" ? "ml-2" : "mr-2"}`}>
                      {locale === "ar" ? "→" : "←"}
                    </span>
                    {t.ukInfoCard.navigation.previous}
                  </button>
                  <div className="text-slate-400">
                    {t.ukInfoCard.navigation.counter
                      .replace("{{current}}", activeFactIndex + 1)
                      .replace("{{total}}", ukFacts.length)}
                  </div>
                  <button
                    onClick={() =>
                      setActiveFactIndex((prev) =>
                        prev < ukFacts.length - 1 ? prev + 1 : 0
                      )
                    }
                    className={`text-sky-600 hover:text-sky-800 flex items-center font-medium ${locale === "ar" ? "flex-row-reverse" : ""}`}
                  >
                    {t.ukInfoCard.navigation.next}
                    <span className={`${locale === "ar" ? "mr-2" : "ml-2"}`}>
                      {locale === "ar" ? "←" : "→"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-8">
          <button className="px-6 py-3 bg-sky-600 text-white font-medium rounded-lg shadow-md hover:bg-sky-700 transition duration-300">
            {t.ukInfoCard.cta}
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>{t.ukInfoCard.footer}</p>
        </footer>
      </div>
    </div>
  );
};

export default UKInfoCard;
