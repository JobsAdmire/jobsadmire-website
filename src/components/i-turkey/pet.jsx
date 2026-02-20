import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Import your translation files
import enTranslations from "../../../public/locales/en/turkeyimmi.json";
import trTranslations from "../../../public/locales/tr/turkeyimmi.json";
// import arTranslations from '../../../public/locales/ar/turkeyimmi.json';
// import frTranslations from '../../../public/locales/fr/turkeyimmi.json';
// import deTranslations from '../../../public/locales/de/turkeyimmi.json';

const MovingWithPetsToTurkey = () => {
  const { t: tCommon } = useTranslation("common");
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

  const sections = [
    {
      id: "requirements",
      content: (
        <div className="space-y-4">
          {t.movingWithPets.sections.requirements.items.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-md border-l-4 border-sky-500 shadow-sm"
            >
              <h3
                className={`text-lg font-medium text-sky-700 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                  {index + 1}.
                </span>
                {item.title}
              </h3>
              <div className="text-gray-700">
                {item.content.includes("<span>") ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  ></span>
                ) : item.type === "list" ? (
                  <ul className="space-y-2">
                    {item.listItems.map((listItem, idx) => (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{ __html: listItem }}
                      ></li>
                    ))}
                  </ul>
                ) : (
                  <p>{item.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "airport",
      content: (
        <div>
          <p className="text-gray-700 mb-4">
            <span
              dangerouslySetInnerHTML={{
                __html: t.movingWithPets.sections.airport.description,
              }}
            ></span>
          </p>

          <div className="bg-sky-50 p-5 rounded-lg border border-sky-100 mb-4">
            <h3 className="font-medium text-sky-700 mb-3">
              {t.movingWithPets.sections.airport.documentsTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t.movingWithPets.sections.airport.documents.map((doc, index) => (
                <div
                  key={index}
                  className={`bg-white p-3 rounded-md flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className={`text-green-500 ${isRTL ? "ml-2" : "mr-2"}`}>
                    ✅
                  </span>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "traveling",
      content: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {t.movingWithPets.sections.traveling.options.map(
              (option, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm"
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
                  <h3 className="font-medium text-sky-700 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{option.description}</p>
                </div>
              )
            )}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <p
              className={`text-amber-800 text-sm flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`text-amber-500 text-xl ${isRTL ? "ml-2" : "mr-2"}`}
              >
                ⚠️
              </span>
              <span>{t.movingWithPets.sections.traveling.warning}</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "after-arrival",
      content: (
        <div className="space-y-3 text-gray-700">
          {t.movingWithPets.sections.afterArrival.intro.map((text, index) => (
            <p key={index}>{text}</p>
          ))}

          <div className="mt-4 bg-white rounded-lg border border-sky-100 p-4">
            <h3
              className={`font-medium text-sky-700 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`${isRTL ? "ml-2" : "mr-2"}`}>📝</span>
              {t.movingWithPets.sections.afterArrival.recommendedSteps.title}
            </h3>
            <ul className="space-y-2">
              {t.movingWithPets.sections.afterArrival.recommendedSteps.items.map(
                (step, index) => (
                  <li
                    key={index}
                    className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className={`text-sky-500 ${isRTL ? "ml-2" : "mr-2"}`}>
                      •
                    </span>
                    <span>{step}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "pet-friendly",
      content: (
        <div>
          <p className="text-gray-700 mb-4">
            {t.movingWithPets.sections.petFriendly.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.movingWithPets.sections.petFriendly.features.map(
              (feature, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-sky-100"
                >
                  <h3
                    className={`font-medium text-sky-700 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                      {feature.icon}
                    </span>
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{feature.description}</p>
                </div>
              )
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`bg-sky-50 w-full p-0 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm p-8">
        <h1
          className={`text-3xl font-bold text-sky-800 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <span className={`${isRTL ? "ml-3" : "mr-3"}`}>🐾</span>
          {t.movingWithPets.title}
        </h1>

        <p className="text-gray-700 mb-8">{t.movingWithPets.description}</p>

        {/* Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.movingWithPets.navigation.title}
          </h2>
          <div
            className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {t.movingWithPets.navigation.sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() =>
                  setActiveSection(
                    section.id === activeSection ? null : section.id
                  )
                }
                className={`px-3 py-2 rounded-md flex items-center text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-sky-600 text-white"
                    : "bg-sky-100 text-sky-800 hover:bg-sky-200"
                } ${isRTL ? "flex-row-reverse" : ""}`}
                aria-label={t.movingWithPets.accessibility.sectionButton.replace(
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
        {sections.map((section, index) => {
          const sectionData = t.movingWithPets.navigation.sections[index];
          return (
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
                  {sectionData.icon}
                </span>
                {sectionData.title}
              </h2>
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  activeSection === null || activeSection === section.id
                    ? "max-h-[2000px]"
                    : "max-h-0"
                }`}
              >
                {section.content}
              </div>
            </section>
          );
        })}

        {/* Pet Checklist */}
        <section className="mb-8 bg-sky-50 p-6 rounded-lg border border-sky-100">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>📋</span>
            {t.movingWithPets.checklist.title}
          </h2>

          <div className="space-y-3">
            {t.movingWithPets.checklist.items.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-3 rounded-md flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`bg-sky-100 rounded-full w-8 h-8 flex items-center justify-center ${isRTL ? "ml-3" : "mr-3"}`}
                >
                  <span className="font-medium text-sky-800">{index + 1}</span>
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Conclusion */}
        <section className="text-center py-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-3 shadow-sm">
              <span className="text-4xl" role="img" aria-label={tCommon("labels.general.pawAndHeartAria")}>
                🐾❤️
              </span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-sky-700 mb-3">
            {t.movingWithPets.conclusion.title}
          </h2>
          <p className="text-gray-700 w-full">
            {t.movingWithPets.conclusion.description}
          </p>
        </section>
      </div>
    </div>
  );
};

export default MovingWithPetsToTurkey;
