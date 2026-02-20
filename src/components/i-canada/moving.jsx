import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/canadaimmi.json";
import trTranslations from "../../../public/locales/tr/canadaimmi.json";
// import frTranslations from '../../../public/locales/fr/canadaimmi.json';
// import deTranslations from '../../../public/locales/de/canadaimmi.json';
// import arTranslations from '../../../public/locales/ar/canadaimmi.json';

const USToCanadaGuide = () => {
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

  const renderWhyCanadaContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.ustocanadaguide.sections.whyCanada.description}
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {t.ustocanadaguide.sections.whyCanada.reasons.map((reason, index) => (
          <li
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 flex items-center"
          >
            <span className="text-blue-500 font-bold mr-3">•</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>

      <p className="text-gray-700">
        {t.ustocanadaguide.sections.whyCanada.conclusion}
      </p>
    </div>
  );

  const renderImmigrationOptionsContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.ustocanadaguide.sections.immigrationOptions.description}
      </p>

      <div className="space-y-5">
        {t.ustocanadaguide.sections.immigrationOptions.options.map(
          (option, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg border-l-4 border-blue-500 shadow-sm"
            >
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                {option.title}
              </h3>
              <ul className="text-gray-700 space-y-2">
                {option.points.map((point, pointIndex) => (
                  <li key={pointIndex}>• {point}</li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );

  const renderRequiredDocumentsContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.ustocanadaguide.sections.requiredDocuments.description}
      </p>

      <div className="bg-blue-100 p-6 rounded-lg border border-blue-200">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t.ustocanadaguide.sections.requiredDocuments.documents.map(
            (document, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-700 font-bold mr-2">•</span>
                <span>{document}</span>
              </li>
            )
          )}
        </ul>
      </div>

      <p className="text-gray-700 mt-4">
        <span className="font-medium">
          {t.ustocanadaguide.sections.requiredDocuments.tip.label}
        </span>{" "}
        {t.ustocanadaguide.sections.requiredDocuments.tip.text}
      </p>
    </div>
  );

  const renderPopularCitiesContent = () => (
    <div>
      <p className="text-gray-700 mb-4">
        {t.ustocanadaguide.sections.popularCities.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {t.ustocanadaguide.sections.popularCities.mainCities.map(
          (city, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm"
            >
              <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
                <span className="mr-2">{city.icon}</span>
                {city.name}
              </h3>
              <ul className="text-gray-700 space-y-2">
                {city.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex}>• {highlight}</li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>

      <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm">
        <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
          <span className="mr-2">💼</span>
          {t.ustocanadaguide.sections.popularCities.emergingOptions.title}
        </h3>
        <ul className="text-gray-700 space-y-2">
          {t.ustocanadaguide.sections.popularCities.emergingOptions.cities.map(
            (city, index) => (
              <li key={index}>
                • <span className="font-medium">{city.name}:</span>{" "}
                {city.description}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );

  const renderCostOfLivingContent = () => (
    <div>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border border-blue-200 rounded-lg">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-3 px-4 text-left border-b border-blue-200">
                {t.ustocanadaguide.sections.costOfLiving.table.headers.expense}
              </th>
              <th className="py-3 px-4 text-left border-b border-blue-200">
                {t.ustocanadaguide.sections.costOfLiving.table.headers.canada}
              </th>
              <th className="py-3 px-4 text-left border-b border-blue-200">
                {t.ustocanadaguide.sections.costOfLiving.table.headers.usa}
              </th>
            </tr>
          </thead>
          <tbody>
            {t.ustocanadaguide.sections.costOfLiving.table.rows.map(
              (row, index) => (
                <tr key={index} className={index % 2 === 1 ? "bg-blue-50" : ""}>
                  <td className="py-3 px-4 border-b border-blue-100 font-medium">
                    {row.expense}
                  </td>
                  <td
                    className={`py-3 px-4 border-b border-blue-100 ${row.canadaHighlight ? "text-green-600" : ""}`}
                  >
                    {row.canada}
                  </td>
                  <td className="py-3 px-4 border-b border-blue-100">
                    {row.usa}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <p className="text-gray-700">
        {t.ustocanadaguide.sections.costOfLiving.note}
      </p>
    </div>
  );

  const renderHealthcareContent = () => (
    <div className="space-y-4 text-gray-700">
      <p>{t.ustocanadaguide.sections.healthcare.description}</p>

      <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          {t.ustocanadaguide.sections.healthcare.newcomersInfo.title}
        </h3>
        <ul className="text-gray-700 space-y-2">
          {t.ustocanadaguide.sections.healthcare.newcomersInfo.points.map(
            (point, index) => (
              <li key={index}>• {point}</li>
            )
          )}
        </ul>
      </div>

      <p>{t.ustocanadaguide.sections.healthcare.privateInsurance}</p>
    </div>
  );

  const renderLanguageContent = () => (
    <div className="space-y-4 text-gray-700">
      <p>{t.ustocanadaguide.sections.language.description}</p>

      <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          {t.ustocanadaguide.sections.language.details.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">
              {t.ustocanadaguide.sections.language.details.terms.title}
            </p>
            <ul className="text-gray-700 space-y-1">
              {t.ustocanadaguide.sections.language.details.terms.examples.map(
                (term, index) => (
                  <li key={index}>• {term}</li>
                )
              )}
            </ul>
          </div>
          <div>
            <p className="font-medium">
              {t.ustocanadaguide.sections.language.details.cultural.title}
            </p>
            <ul className="text-gray-700 space-y-1">
              {t.ustocanadaguide.sections.language.details.cultural.points.map(
                (point, index) => (
                  <li key={index}>• {point}</li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      <p>{t.ustocanadaguide.sections.language.frenchNote}</p>
    </div>
  );

  const renderMovingContent = () => (
    <div className="space-y-4 text-gray-700">
      <p>{t.ustocanadaguide.sections.moving.description}</p>

      <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          {t.ustocanadaguide.sections.moving.belongings.title}
        </h3>
        <ul className="text-gray-700 space-y-2">
          {t.ustocanadaguide.sections.moving.belongings.points.map(
            (point, index) => (
              <li key={index}>
                • <span className="font-medium">{point.label}:</span>{" "}
                {point.description}
              </li>
            )
          )}
        </ul>
      </div>

      <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          {t.ustocanadaguide.sections.moving.vehicles.title}
        </h3>
        <ul className="text-gray-700 space-y-2">
          {t.ustocanadaguide.sections.moving.vehicles.points.map(
            (point, index) => (
              <li key={index}>• {point}</li>
            )
          )}
        </ul>
      </div>

      <p>{t.ustocanadaguide.sections.moving.note}</p>
    </div>
  );

  const renderBankingContent = () => (
    <div className="space-y-4 text-gray-700">
      <p>{t.ustocanadaguide.sections.banking.description}</p>

      <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          {t.ustocanadaguide.sections.banking.bankingInfo.title}
        </h3>
        <ul className="text-gray-700 space-y-2">
          {t.ustocanadaguide.sections.banking.bankingInfo.points.map(
            (point, index) => (
              <li key={index}>• {point}</li>
            )
          )}
        </ul>
      </div>

      <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          {t.ustocanadaguide.sections.banking.financialConsiderations.title}
        </h3>
        <ul className="text-gray-700 space-y-2">
          {t.ustocanadaguide.sections.banking.financialConsiderations.points.map(
            (point, index) => (
              <li key={index}>• {point}</li>
            )
          )}
        </ul>
      </div>

      <p>{t.ustocanadaguide.sections.banking.recommendation}</p>
    </div>
  );

  const sections = [
    {
      id: "why-canada",
      icon: "🇨🇦",
      title: t.ustocanadaguide.sections.whyCanada.title,
      content: renderWhyCanadaContent(),
    },
    {
      id: "immigration-options",
      icon: "🛂",
      title: t.ustocanadaguide.sections.immigrationOptions.title,
      content: renderImmigrationOptionsContent(),
    },
    {
      id: "required-documents",
      icon: "📄",
      title: t.ustocanadaguide.sections.requiredDocuments.title,
      content: renderRequiredDocumentsContent(),
    },
    {
      id: "popular-cities",
      icon: "🏙️",
      title: t.ustocanadaguide.sections.popularCities.title,
      content: renderPopularCitiesContent(),
    },
    {
      id: "cost-of-living",
      icon: "💰",
      title: t.ustocanadaguide.sections.costOfLiving.title,
      content: renderCostOfLivingContent(),
    },
    {
      id: "healthcare",
      icon: "🏥",
      title: t.ustocanadaguide.sections.healthcare.title,
      content: renderHealthcareContent(),
    },
    {
      id: "language",
      icon: "🗣️",
      title: t.ustocanadaguide.sections.language.title,
      content: renderLanguageContent(),
    },
    {
      id: "moving",
      icon: "📦",
      title: t.ustocanadaguide.sections.moving.title,
      content: renderMovingContent(),
    },
    {
      id: "banking",
      icon: "💳",
      title: t.ustocanadaguide.sections.banking.title,
      content: renderBankingContent(),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen w-full font-sans pb-10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Quick Navigation */}
        <div className="mb-10 bg-white rounded-lg shadow-sm p-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            {t.ustocanadaguide.navigation.title}
          </h2>
          <div className="flex flex-wrap gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  setActiveSection(
                    section.id === activeSection ? null : section.id
                  )
                }
                className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                }`}
                aria-label={`${t.ustocanadaguide.accessibility.toggleSection} ${section.title}`}
              >
                <span className="mr-2 text-lg">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-6 max-w-7xl mx-auto">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
                activeSection === section.id ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div
                className={`p-5 cursor-pointer transition-colors ${
                  activeSection === section.id
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-blue-50"
                }`}
                onClick={() =>
                  setActiveSection(
                    section.id === activeSection ? null : section.id
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveSection(
                      section.id === activeSection ? null : section.id
                    );
                  }
                }}
                aria-expanded={activeSection === section.id}
              >
                <h2 className="text-2xl font-semibold flex items-center">
                  <span className="text-2xl mr-3">{section.icon}</span>
                  {section.title}
                  <span className="ml-auto">
                    {activeSection === section.id ? "▼" : "▶"}
                  </span>
                </h2>
              </div>

              <div
                className={`transition-all duration-500 overflow-hidden ${
                  activeSection === section.id
                    ? "max-h-[2000px] opacity-100 p-6"
                    : "max-h-0 opacity-0 p-0"
                }`}
              >
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Pre-Move Checklist */}
        <section className="my-10 bg-gradient-to-r from-blue-100 to-sky-50 p-6 rounded-lg shadow-sm max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">✅</span>
            {t.ustocanadaguide.checklist.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.ustocanadaguide.checklist.items.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center"
              >
                <span className="text-green-600 text-xl mr-3">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm mb-10 max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            {t.ustocanadaguide.resources.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.ustocanadaguide.resources.categories.map((category, index) => (
              <div
                key={index}
                className="bg-blue-50 p-5 rounded-lg border border-blue-100"
              >
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  {category.title}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Footer with Final Tips */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-t-lg shadow-md max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">
            {t.ustocanadaguide.finalTips.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.ustocanadaguide.finalTips.categories.map((category, index) => (
              <div key={index}>
                <h3 className="text-xl font-medium mb-2">{category.title}</h3>
                <ul className="space-y-2">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start">
                      <span className="text-blue-200 mr-2">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-blue-100 text-center">
            {t.ustocanadaguide.finalTips.conclusion}
          </p>
        </section>
      </div>
    </div>
  );
};

export default USToCanadaGuide;
