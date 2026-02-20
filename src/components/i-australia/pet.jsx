import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Import your translation files
import enTranslations from "../../../public/locales/en/australiaimmi.json";
import trTranslations from "../../../public/locales/tr/australiaimmi.json";
// import arTranslations from '../../../public/locales/ar/australiaimmi.json';
// import frTranslations from '../../../public/locales/fr/australiaimmi.json';
// import deTranslations from '../../../public/locales/de/australiaimmi.json';

const MovingWithPetsToAustralia = () => {
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

  // Get sections from translations
  const sections = t.petsToAustralia?.sections || [];

  const renderCostTable = () => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full bg-white border border-sky-200 rounded-lg">
        <thead>
          <tr className="bg-sky-100">
            <th
              className={`py-3 px-4 border-b border-sky-200 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t.petsToAustralia?.costTable?.headers?.expense}
            </th>
            <th
              className={`py-3 px-4 border-b border-sky-200 ${isRTL ? "text-left" : "text-right"}`}
            >
              {t.petsToAustralia?.costTable?.headers?.cost}
            </th>
          </tr>
        </thead>
        <tbody>
          {t.petsToAustralia?.costTable?.rows?.map((row, index) => (
            <tr key={index} className={index % 2 === 1 ? "bg-sky-50" : ""}>
              <td className="py-3 px-4 border-b border-sky-100 font-medium">
                {row.expense}
              </td>
              <td
                className={`py-3 px-4 border-b border-sky-100 ${isRTL ? "text-left" : "text-right"}`}
              >
                {row.cost}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSectionContent = (section) => {
    switch (section.id) {
      case "key-requirements":
        return (
          <div className="space-y-4">
            {section.content.requirements.map((req, index) => (
              <div
                key={index}
                className={`bg-white p-4 rounded-md border-l-4 border-sky-500 shadow-sm ${isRTL ? "border-l-0 border-r-4" : ""}`}
              >
                <h3
                  className={`text-lg font-medium text-sky-700 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                    {index + 1}.
                  </span>
                  {req.title}
                </h3>
                <p className="text-gray-700">{req.description}</p>
                {req.list && (
                  <ul
                    className={`text-gray-700 space-y-1 mt-2 ${isRTL ? "pr-4" : "pl-4"}`}
                  >
                    {req.list.map((item, itemIndex) => (
                      <li key={itemIndex}>• {item}</li>
                    ))}
                  </ul>
                )}
                {req.highlight && (
                  <p className="text-gray-700 mt-2">
                    <span
                      dangerouslySetInnerHTML={{ __html: req.highlight }}
                    ></span>
                  </p>
                )}
              </div>
            ))}
          </div>
        );

      case "timeline":
        return (
          <div>
            <p className="text-gray-700 mb-4">
              <span
                dangerouslySetInnerHTML={{
                  __html: section.content.description,
                }}
              ></span>
            </p>

            {section.content.phases.map((phase, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-sky-100 overflow-hidden mb-4"
              >
                <div className="p-4 bg-sky-50 border-b border-sky-100">
                  <h3 className="font-medium text-sky-700">
                    {phase.timeframe}
                  </h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-2 text-gray-700">
                    {phase.tasks.map((task, taskIndex) => (
                      <li
                        key={taskIndex}
                        className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <span
                          className={`text-sky-500 ${isRTL ? "ml-2" : "mr-2"}`}
                        >
                          •
                        </span>
                        <span dangerouslySetInnerHTML={{ __html: task }}></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );

      case "quarantine":
        return (
          <div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-4">
              <p
                className={`text-amber-800 flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-amber-500 text-xl ${isRTL ? "ml-2" : "mr-2"}`}
                >
                  ⚠️
                </span>
                <span
                  dangerouslySetInnerHTML={{ __html: section.content.warning }}
                ></span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {section.content.keyInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm"
                >
                  <h3
                    className={`font-medium text-sky-700 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                      {info.icon}
                    </span>
                    {info.title}
                  </h3>
                  <p className="text-gray-700">
                    <span
                      dangerouslySetInnerHTML={{ __html: info.description }}
                    ></span>
                  </p>
                </div>
              ))}
            </div>

            {section.content.details.map((detail, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-sky-100 shadow-sm mb-4"
              >
                <h3 className="font-medium text-sky-700 mb-2">
                  {detail.title}
                </h3>
                <p className="text-gray-700 mb-2">{detail.description}</p>
                {detail.list && (
                  <ul
                    className={`text-gray-700 space-y-1 ${isRTL ? "pr-4" : "pl-4"}`}
                  >
                    {detail.list.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        dangerouslySetInnerHTML={{ __html: item }}
                      ></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case "costs":
        return (
          <div>
            <p className="text-gray-700 mb-4">
              <span
                dangerouslySetInnerHTML={{
                  __html: section.content.description,
                }}
              ></span>
            </p>

            {renderCostTable()}

            <div className="bg-sky-50 p-4 rounded-lg border border-sky-100 mt-4">
              <p
                className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-amber-500 font-bold text-xl ${isRTL ? "ml-2" : "mr-2"}`}
                >
                  💡
                </span>
                <span
                  dangerouslySetInnerHTML={{ __html: section.content.tip }}
                ></span>
              </p>
            </div>
          </div>
        );

      case "pet-life":
        return (
          <div>
            <p className="text-gray-700 mb-4">{section.content.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.content.aspects.map((aspect, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-sky-100"
                >
                  <h3
                    className={`font-medium text-sky-700 mb-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className={`${isRTL ? "ml-2" : "mr-2"}`}>
                      {aspect.icon}
                    </span>
                    {aspect.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{aspect.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mt-4">
              <p
                className={`text-amber-800 flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-amber-500 text-xl ${isRTL ? "ml-2" : "mr-2"}`}
                >
                  ⚠️
                </span>
                <span
                  dangerouslySetInnerHTML={{ __html: section.content.warning }}
                ></span>
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-sky-50 w-full p-0 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm p-8">
        <p className="text-gray-700 mb-8">{t.petsToAustralia?.description}</p>

        {/* Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-sky-700 mb-4">
            {t.petsToAustralia?.navigation?.title}
          </h2>
          <div
            className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {sections.map((section) => (
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
                aria-label={t.petsToAustralia?.accessibility?.sectionButton?.replace(
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
        {sections.map((section) => (
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
                {section.icon}
              </span>
              {section.title}
            </h2>
            <div
              className={`transition-all duration-500 overflow-hidden ${
                activeSection === null || activeSection === section.id
                  ? "max-h-[2000px]"
                  : "max-h-0"
              }`}
            >
              {renderSectionContent(section)}
            </div>
          </section>
        ))}

        {/* Pet Breed Restrictions */}
        {t.petsToAustralia?.breedRestrictions && (
          <section className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-100">
            <h2
              className={`text-2xl font-semibold text-red-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>🚫</span>
              {t.petsToAustralia?.breedRestrictions?.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.petsToAustralia?.breedRestrictions?.categories?.map(
                (category, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm border border-red-100"
                  >
                    <h4 className="font-semibold text-red-700 mb-2">
                      {category.type}
                    </h4>
                    <ul
                      className={`text-gray-700 text-sm space-y-1 ${isRTL ? "pr-4" : "pl-4"}`}
                    >
                      {category.breeds.map((breed, breedIndex) => (
                        <li key={breedIndex}>• {breed}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
            <p className="text-red-600 text-sm mt-4 text-center font-medium">
              {t.petsToAustralia?.breedRestrictions?.note}
            </p>
          </section>
        )}

        {/* Professional Services */}
        {t.petsToAustralia?.professionalServices && (
          <section className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2
              className={`text-2xl font-semibold text-blue-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>🏢</span>
              {t.petsToAustralia?.professionalServices?.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {t.petsToAustralia?.professionalServices?.services?.map(
                (service, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm border border-blue-100"
                  >
                    <div
                      className={`flex items-center mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span className={`text-lg ${isRTL ? "ml-2" : "mr-2"}`}>
                        {service.icon}
                      </span>
                      <h4 className="font-semibold text-blue-700">
                        {service.name}
                      </h4>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      {service.description}
                    </p>
                    <p className="text-blue-600 text-sm font-medium">
                      {service.cost}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* Pet Checklist */}
        <section className="mb-8 bg-sky-50 p-6 rounded-lg border border-sky-100">
          <h2
            className={`text-2xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>📋</span>
            {t.petsToAustralia?.checklist?.title}
          </h2>

          <div className="space-y-3">
            {t.petsToAustralia?.checklist?.items?.map((item, index) => (
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
              <span
                className="text-4xl"
                role="img"
                aria-label={tCommon("labels.general.pawAndAustraliaAria")}
              >
                🐾🇦🇺
              </span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-sky-700 mb-3">
            {t.petsToAustralia?.conclusion?.title}
          </h2>
          <p className="text-gray-700 w-full">
            {t.petsToAustralia?.conclusion?.description}
          </p>
        </section>
      </div>
    </div>
  );
};

export default MovingWithPetsToAustralia;
