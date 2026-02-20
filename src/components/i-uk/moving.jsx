import React, { useState } from "react";
import { useRouter } from "next/router";

import enTranslations from "../../../public/locales/en/ukimmi.json";
// import frTranslations from '../../../public/locales/fr/ukimmmi.json';
// import deTranslations from '../../../public/locales/de/ukimmmi.json';
import trTranslations from "../../../public/locales/tr/ukimmi.json";
// import arTranslations from '../../../public/locales/ar/ukimmmi.json';

const USToUKGuide = () => {
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

  // Render section content dynamically
  const renderSectionContent = (sectionData) => {
    const { type, content } = sectionData;

    switch (type) {
      case "why-uk":
        return (
          <div>
            <p className="text-gray-700 mb-4">{content.intro}</p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {content.reasons.map((reason, index) => (
                <li
                  key={index}
                  className={`bg-white p-4 rounded-lg shadow-sm border border-sky-200 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                >
                  <span
                    className={`text-sky-500 font-bold ${locale === "ar" || locale === "fa" ? "ml-3" : "mr-3"}`}
                  >
                    •
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            <p className="text-gray-700">{content.conclusion}</p>
          </div>
        );

      case "visa-options":
        return (
          <div>
            <p className="text-gray-700 mb-4">{content.intro}</p>

            <div className="space-y-5">
              {content.visaTypes.map((visa, index) => (
                <div
                  key={index}
                  className={`bg-white p-5 rounded-lg border-l-4 border-sky-500 shadow-sm ${locale === "ar" || locale === "fa" ? "border-r-4 border-l-0" : ""}`}
                >
                  <h3 className="text-lg font-medium text-sky-800 mb-2">
                    {visa.title}
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    {visa.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>• {req}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case "required-documents":
        return (
          <div>
            <p className="text-gray-700 mb-4">{content.intro}</p>

            <div className="bg-sky-100 p-6 rounded-lg border border-sky-200">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.documents.map((doc, index) => (
                  <li
                    key={index}
                    className={`flex items-start ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`text-sky-700 font-bold ${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                    >
                      •
                    </span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-gray-700 mt-4">
              <span className="font-medium">{content.proTip.label}:</span>{" "}
              {content.proTip.text}
            </p>
          </div>
        );

      case "popular-cities":
        return (
          <div>
            <p className="text-gray-700 mb-4">{content.intro}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              {content.cities.map((city, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-lg border border-sky-200 shadow-sm"
                >
                  <h3
                    className={`text-lg font-medium text-sky-800 mb-2 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                    >
                      {city.icon}
                    </span>
                    {city.name}
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    {city.highlights.map((highlight, hIndex) => (
                      <li key={hIndex}>• {highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-lg border border-sky-200 shadow-sm">
              <h3
                className={`text-lg font-medium text-sky-800 mb-2 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                >
                  {content.risingLocations.icon}
                </span>
                {content.risingLocations.title}
              </h3>
              <ul className="text-gray-700 space-y-2">
                {content.risingLocations.locations.map((location, index) => (
                  <li key={index}>
                    • <span className="font-medium">{location.name}:</span>{" "}
                    {location.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "cost-of-living":
        return (
          <div>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-sky-200 rounded-lg">
                <thead>
                  <tr className="bg-sky-100">
                    <th
                      className={`py-3 px-4 ${locale === "ar" || locale === "fa" ? "text-right" : "text-left"} border-b border-sky-200`}
                    >
                      {content.table.headers.expense}
                    </th>
                    <th
                      className={`py-3 px-4 ${locale === "ar" || locale === "fa" ? "text-right" : "text-left"} border-b border-sky-200`}
                    >
                      {content.table.headers.uk}
                    </th>
                    <th
                      className={`py-3 px-4 ${locale === "ar" || locale === "fa" ? "text-right" : "text-left"} border-b border-sky-200`}
                    >
                      {content.table.headers.usa}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {content.table.rows.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 1 ? "bg-sky-50" : ""}
                    >
                      <td className="py-3 px-4 border-b border-sky-100 font-medium">
                        {row.expense}
                      </td>
                      <td
                        className={`py-3 px-4 border-b border-sky-100 ${row.ukHighlight ? "text-green-600" : ""}`}
                      >
                        {row.uk}
                      </td>
                      <td className="py-3 px-4 border-b border-sky-100">
                        {row.usa}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-gray-700">{content.conclusion}</p>
          </div>
        );

      case "healthcare":
        return (
          <div className="space-y-4 text-gray-700">
            <p>{content.intro}</p>

            <div className="bg-white p-5 rounded-lg border border-sky-200 shadow-sm">
              <h3 className="text-lg font-medium text-sky-800 mb-2">
                {content.nhsAccess.title}
              </h3>
              <ul className="text-gray-700 space-y-2">
                {content.nhsAccess.points.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            </div>

            <p>{content.conclusion}</p>
          </div>
        );

      case "language":
        return (
          <div className="space-y-4 text-gray-700">
            <p>{content.intro}</p>

            <div className="bg-white p-5 rounded-lg border border-sky-200 shadow-sm">
              <h3 className="text-lg font-medium text-sky-800 mb-2">
                {content.differences.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">
                    {content.differences.vocabulary.title}
                  </p>
                  <ul className="text-gray-700 space-y-1">
                    {content.differences.vocabulary.examples.map(
                      (example, index) => (
                        <li key={index}>• {example}</li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">
                    {content.differences.cultural.title}
                  </p>
                  <ul className="text-gray-700 space-y-1">
                    {content.differences.cultural.points.map((point, index) => (
                      <li key={index}>• {point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <p>{content.conclusion}</p>
          </div>
        );

      case "moving":
        return (
          <div className="space-y-4 text-gray-700">
            <p>{content.intro}</p>

            <div className="bg-white p-5 rounded-lg border border-sky-200 shadow-sm">
              <h3 className="text-lg font-medium text-sky-800 mb-2">
                {content.shipping.title}
              </h3>
              <ul className="text-gray-700 space-y-2">
                {content.shipping.options.map((option, index) => (
                  <li key={index}>
                    • <span className="font-medium">{option.type}:</span>{" "}
                    {option.description}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-lg border border-sky-200 shadow-sm">
              <h3 className="text-lg font-medium text-sky-800 mb-2">
                {content.customs.title}
              </h3>
              <ul className="text-gray-700 space-y-2">
                {content.customs.considerations.map((consideration, index) => (
                  <li key={index}>• {consideration}</li>
                ))}
              </ul>
            </div>

            <p>{content.conclusion}</p>
          </div>
        );

      case "banking":
        return (
          <div className="space-y-4 text-gray-700">
            <p>{content.intro}</p>

            <div className="bg-white p-5 rounded-lg border border-sky-200 shadow-sm">
              <h3 className="text-lg font-medium text-sky-800 mb-2">
                {content.ukAccount.title}
              </h3>
              <ul className="text-gray-700 space-y-2">
                {content.ukAccount.points.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-lg border border-sky-200 shadow-sm">
              <h3 className="text-lg font-medium text-sky-800 mb-2">
                {content.usUkFinances.title}
              </h3>
              <ul className="text-gray-700 space-y-2">
                {content.usUkFinances.points.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            </div>

            <p>{content.conclusion}</p>
          </div>
        );

      default:
        return <div>{content}</div>;
    }
  };

  return (
    <div
      className={`bg-gradient-to-b from-sky-50 to-white min-h-screen w-full font-sans relative ${locale === "ar" || locale === "fa" ? "rtl" : "ltr"}`}
    >
      {/* Language Switcher */}

      <div className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-800 mb-4">
            {t.usToUkGuide.header.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.usToUkGuide.header.subtitle}
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-10 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-sky-800 mb-4">
            {t.usToUkGuide.navigation.title}
          </h2>
          <div className="flex flex-wrap gap-3">
            {t.usToUkGuide.sections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  setActiveSection(
                    section.id === activeSection ? null : section.id
                  )
                }
                className={`px-4 py-3 rounded-lg flex items-center text-sm font-medium transition-all ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""} ${
                  activeSection === section.id
                    ? "bg-sky-700 text-white shadow-md"
                    : "bg-sky-50 text-sky-800 hover:bg-sky-100"
                }`}
              >
                <span
                  className={`text-lg ${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                >
                  {section.icon}
                </span>
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-10">
          {t.usToUkGuide.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
                activeSection === section.id ? "ring-2 ring-sky-500" : ""
              }`}
            >
              <div
                className="p-6 cursor-pointer bg-gradient-to-r from-sky-50 to-white"
                onClick={() =>
                  setActiveSection(
                    section.id === activeSection ? null : section.id
                  )
                }
              >
                <h2
                  className={`text-2xl font-semibold text-sky-800 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                >
                  <span
                    className={`text-3xl ${locale === "ar" || locale === "fa" ? "ml-3" : "mr-3"}`}
                  >
                    {section.icon}
                  </span>
                  {section.title}
                  <span
                    className={`${locale === "ar" || locale === "fa" ? "mr-auto" : "ml-auto"} text-sky-600`}
                  >
                    {activeSection === section.id
                      ? "▼"
                      : locale === "ar" || locale === "fa"
                        ? "◀"
                        : "▶"}
                  </span>
                </h2>
              </div>

              <div
                className={`transition-all duration-500 px-6 overflow-hidden ${
                  activeSection === section.id
                    ? "max-h-[2000px] opacity-100 py-5"
                    : "max-h-0 opacity-0 py-0"
                }`}
              >
                {renderSectionContent(section)}
              </div>
            </section>
          ))}
        </div>

        {/* Final Checklist */}
        <section className="my-10 bg-gradient-to-r from-sky-100 to-blue-50 p-8 rounded-lg shadow-sm">
          <h2
            className={`text-2xl font-semibold text-sky-800 mb-6 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
          >
            <span
              className={`text-3xl ${locale === "ar" || locale === "fa" ? "ml-3" : "mr-3"}`}
            >
              ✅
            </span>
            {t.usToUkGuide.checklist.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.usToUkGuide.checklist.items.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-4 rounded-lg shadow-sm flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""} ${index === t.usToUkGuide.checklist.items.length - 1 ? "md:col-span-2" : ""}`}
              >
                <span
                  className={`text-green-600 text-xl ${locale === "ar" || locale === "fa" ? "ml-3" : "mr-3"}`}
                >
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Resources */}
        <section className="mb-16 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-sky-800 mb-4">
            {t.usToUkGuide.resources.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.usToUkGuide.resources.categories.map((category, index) => (
              <div
                key={index}
                className="bg-sky-50 p-5 rounded-lg border border-sky-100"
              >
                <h3 className="text-lg font-medium text-sky-800 mb-2">
                  {category.title}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex}>• {link}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default USToUKGuide;
