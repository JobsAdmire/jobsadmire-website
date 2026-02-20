import React, { useState } from "react";
import { useRouter } from "next/router";

import enTranslations from "../../../public/locales/en/ukimmi.json";
// import frTranslations from '../../../public/locales/fr/ukimmmi.json';
// import deTranslations from '../../../public/locales/de/ukimmmi.json';
import trTranslations from "../../../public/locales/tr/ukimmi.json";
// import arTranslations from '../../../public/locales/ar/ukimmmi.json';

const MovingWithPetsToUK = () => {
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
      case "requirements":
        return (
          <div className="space-y-4">
            {content.keyRequirements.map((requirement, index) => (
              <div
                key={index}
                className={`bg-white p-4 rounded-md border-l-4 border-sky-600 shadow-sm ${locale === "ar" || locale === "fa" ? "border-r-4 border-l-0" : ""}`}
              >
                <h3
                  className={`text-lg font-medium text-sky-800 mb-2 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                >
                  <span
                    className={`${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                  >
                    {requirement.number}.
                  </span>
                  {requirement.title}
                  {requirement.note && (
                    <span
                      className={`text-sm font-normal text-gray-500 ${locale === "ar" || locale === "fa" ? "mr-2" : "ml-2"}`}
                    >
                      {requirement.note}
                    </span>
                  )}
                </h3>
                {typeof requirement.description === "string" ? (
                  <p className="text-gray-700">{requirement.description}</p>
                ) : (
                  <ul className="text-gray-700 space-y-2">
                    {requirement.description.map((desc, descIndex) => (
                      <li key={descIndex}>• {desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case "entry-routes":
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-sky-200 shadow-sm">
              <h3 className="font-medium text-sky-800 mb-3">
                {content.approvedEntry.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {content.approvedEntry.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.approvedEntry.routes.map((route, index) => (
                  <div key={index} className="bg-sky-50 p-3 rounded-md">
                    <h4 className="font-medium text-sky-700 mb-1">
                      {route.title}
                    </h4>
                    <p className="text-sm text-gray-600">{route.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <p
                className={`text-amber-800 text-sm flex items-start ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-amber-500 ${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"} text-xl`}
                >
                  ⚠️
                </span>
                <span>{content.warning}</span>
              </p>
            </div>
          </div>
        );

      case "traveling":
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {content.travelOptions.map((option, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-white to-sky-50 p-4 rounded-lg border border-sky-100 shadow-sm"
                >
                  <div className="bg-sky-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <span
                      className="text-xl"
                      role="img"
                      aria-label={option.ariaLabel}
                    >
                      {option.icon}
                    </span>
                  </div>
                  <h3 className="font-medium text-sky-800 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{option.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-sky-50 p-5 rounded-lg border border-sky-100 mb-4">
              <h3 className="font-medium text-sky-800 mb-3">
                {content.costConsiderations.title}
              </h3>
              <div className="space-y-2">
                {content.costConsiderations.costs.map((cost, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`text-sky-500 ${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                    >
                      •
                    </span>
                    <span className="text-gray-700">{cost}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <p
                className={`text-amber-800 text-sm flex items-start ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-amber-500 ${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"} text-xl`}
                >
                  ⚠️
                </span>
                <span>{content.warning}</span>
              </p>
            </div>
          </div>
        );

      case "arrival-process":
        return (
          <div>
            <p className="text-gray-700 mb-4">{content.intro}</p>

            <div className="bg-sky-50 p-5 rounded-lg border border-sky-100 mb-4">
              <h3 className="font-medium text-sky-800 mb-3">
                {content.documentChecks.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.documentChecks.items.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white p-3 rounded-md flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`text-green-500 ${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                    >
                      ✅
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm mb-4">
              <h3
                className={`font-medium text-sky-800 mb-2 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                >
                  🔄
                </span>
                {content.processFlow.title}
              </h3>
              <ol
                className={`space-y-2 ${locale === "ar" || locale === "fa" ? "mr-5" : "ml-5"} list-decimal text-gray-700`}
              >
                {content.processFlow.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <p
                className={`text-red-800 text-sm flex items-start ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-red-500 ${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"} text-xl`}
                >
                  ⚠️
                </span>
                <span>{content.warning}</span>
              </p>
            </div>
          </div>
        );

      case "after-arrival":
        return (
          <div className="space-y-4 text-gray-700">
            <p>{content.intro}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.livingAspects.map((aspect, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-white to-sky-50 p-4 rounded-lg border border-sky-100"
                >
                  <h3
                    className={`font-medium text-sky-800 mb-2 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                    >
                      {aspect.icon}
                    </span>
                    {aspect.title}
                  </h3>
                  <p className="text-sm">{aspect.description}</p>
                  {aspect.cost && <p className="text-sm mt-2">{aspect.cost}</p>}
                </div>
              ))}
            </div>

            <div className="bg-sky-50 p-5 rounded-lg border border-sky-100">
              <h3 className="font-medium text-sky-800 mb-2">
                {content.firstWeekChecklist.title}
              </h3>
              <div className="space-y-2">
                {content.firstWeekChecklist.items.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`text-sky-500 ${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                    >
                      •
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "resources":
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
              <h3 className="font-medium text-sky-800 mb-3">
                {content.officialInfo.title}
              </h3>
              <div className="space-y-2">
                {content.officialInfo.resources.map((resource, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`text-sky-600 ${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                    >
                      🔗
                    </span>
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-sm text-gray-600">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
              <h3 className="font-medium text-sky-800 mb-3">
                {content.petServices.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.petServices.services.map((service, index) => (
                  <div key={index} className="bg-sky-50 p-3 rounded-md">
                    <h4 className="font-medium text-sky-700">
                      {service.category}
                    </h4>
                    <p className="text-sm text-gray-600">{service.providers}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div>{content}</div>;
    }
  };

  return (
    <div
      className={`bg-gradient-to-b from-sky-50 to-white w-full min-h-screen font-sans relative ${locale === "ar" || locale === "fa" ? "rtl" : "ltr"}`}
    >
      {/* Language Switcher */}

      <div className="max-w-full px-4 md:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-800 mb-4">
            {t.petsToUkGuide.header.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.petsToUkGuide.header.subtitle}
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-sky-800 mb-4 border-b border-sky-100 pb-2">
            {t.petsToUkGuide.navigation.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            {t.petsToUkGuide.sections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  setActiveSection(
                    section.id === activeSection ? null : section.id
                  )
                }
                className={`px-4 py-2 rounded-md flex items-center text-sm transition-all duration-300 ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""} ${
                  activeSection === section.id
                    ? "bg-sky-700 text-white shadow-md transform scale-105"
                    : "bg-sky-100 text-sky-800 hover:bg-sky-200"
                }`}
              >
                <span
                  className={`${locale === "ar" || locale === "fa" ? "ml-2" : "mr-2"}`}
                >
                  {section.icon}
                </span>
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Active Section Content */}
          <div className="lg:col-span-2">
            {activeSection && (
              <div className="bg-white rounded-lg shadow-sm border border-sky-100 p-6 mb-8">
                {t.petsToUkGuide.sections.find(
                  (s) => s.id === activeSection
                ) && (
                  <>
                    <h2
                      className={`text-2xl font-semibold text-sky-800 mb-4 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                    >
                      <span
                        className={`text-2xl ${locale === "ar" || locale === "fa" ? "ml-3" : "mr-3"}`}
                      >
                        {
                          t.petsToUkGuide.sections.find(
                            (s) => s.id === activeSection
                          ).icon
                        }
                      </span>
                      {
                        t.petsToUkGuide.sections.find(
                          (s) => s.id === activeSection
                        ).title
                      }
                    </h2>
                    <div className="transition-all duration-500">
                      {renderSectionContent(
                        t.petsToUkGuide.sections.find(
                          (s) => s.id === activeSection
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* If no section is active, show all in sequence */}
            {!activeSection &&
              t.petsToUkGuide.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="bg-white rounded-lg shadow-sm border border-sky-100 p-6 mb-8"
                >
                  <h2
                    className={`text-2xl font-semibold text-sky-800 mb-4 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`text-2xl ${locale === "ar" || locale === "fa" ? "ml-3" : "mr-3"}`}
                    >
                      {section.icon}
                    </span>
                    {section.title}
                  </h2>
                  <div className="transition-all duration-500">
                    {renderSectionContent(section)}
                  </div>
                </section>
              ))}
          </div>

          {/* Right Column - Static Information */}
          <div className="space-y-8">
            {/* Pet Checklist */}
            <div className="bg-white rounded-lg shadow-sm border border-sky-100 p-6">
              <h2
                className={`text-xl font-semibold text-sky-800 mb-4 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-xl ${locale === "ar" || locale === "fa" ? "ml-3" : "mr-3"}`}
                >
                  📋
                </span>
                {t.petsToUkGuide.sidebar.checklist.title}
              </h2>

              <div className="space-y-3">
                {t.petsToUkGuide.sidebar.checklist.items.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-sky-50 p-3 rounded-md flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`bg-sky-200 rounded-full w-8 h-8 flex items-center justify-center ${locale === "ar" || locale === "fa" ? "ml-3" : "mr-3"} text-sky-800`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-sm border border-sky-100 p-6">
              <h2
                className={`text-xl font-semibold text-sky-800 mb-4 flex items-center ${locale === "ar" || locale === "fa" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-xl ${locale === "ar" || locale === "fa" ? "ml-3" : "mr-3"}`}
                >
                  ❓
                </span>
                {t.petsToUkGuide.sidebar.faq.title}
              </h2>

              <div className="space-y-4">
                {t.petsToUkGuide.sidebar.faq.questions.map(
                  (question, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-sky-700">
                        {question.question}
                      </h3>
                      <p className="text-sm text-gray-700 mt-1">
                        {question.answer}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovingWithPetsToUK;
