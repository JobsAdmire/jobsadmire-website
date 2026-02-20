import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/turkeyimmi.json";
import trTranslations from "../../../public/locales/tr/turkeyimmi.json";
// import arTranslations from '../../../public/locales/ar/turkeyimmi.json';
// import frTranslations from '../../../public/locales/fr/turkeyimmi.json';
// import deTranslations from '../../../public/locales/de/turkeyimmi.json';

const TurkeyVisaGuide = () => {
  const router = useRouter();
  const { locale } = router;
  const [activeVisa, setActiveVisa] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVisas, setSelectedVisas] = useState(new Set());

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

  const toggleVisaSelection = (visaId) => {
    const newSelected = new Set(selectedVisas);
    if (newSelected.has(visaId)) {
      newSelected.delete(visaId);
    } else if (newSelected.size < 3) {
      newSelected.add(visaId);
    }
    setSelectedVisas(newSelected);
  };

  const renderVisaCard = (visa, index) => {
    const isSelected = selectedVisas.has(visa.id);
    const isActive = activeVisa === visa.id;

    return (
      <div
        key={visa.id}
        className={`bg-white rounded-lg border-2 transition-all duration-300 ${
          isSelected
            ? "border-sky-500 shadow-lg"
            : "border-sky-100 hover:border-sky-300"
        } ${isActive ? "ring-2 ring-sky-300" : ""}`}
      >
        <div
          className={`p-6 cursor-pointer ${isRTL ? "text-right" : "text-left"}`}
          onClick={() => setActiveVisa(isActive ? null : visa.id)}
        >
          <div
            className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>
                {visa.icon}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-sky-700">
                  {visa.title}
                </h3>
                <p className="text-sm text-gray-500">{visa.subtitle}</p>
              </div>
            </div>
            <div
              className={`flex items-center space-x-2 ${isRTL ? "space-x-reverse" : ""}`}
            >
              {compareMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisaSelection(visa.id);
                  }}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    isSelected
                      ? "bg-sky-600 text-white"
                      : "bg-sky-100 text-sky-800 hover:bg-sky-200"
                  }`}
                  disabled={!isSelected && selectedVisas.size >= 3}
                >
                  {isSelected
                    ? t.visaGuide.compare.selected
                    : t.visaGuide.compare.select}
                </button>
              )}
              <span
                className={`transition-transform duration-200 ${isActive ? "rotate-90" : ""} text-sky-600`}
              >
                ▶
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sky-600 font-medium mb-2">
              {t.visaGuide.labels.bestFor}
            </h4>
            <div
              className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              {visa.bestFor.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="bg-sky-50 text-sky-700 px-2 py-1 rounded-md text-sm"
                >
                  {item}
                </span>
              ))}
              {visa.bestFor.length > 3 && (
                <span className="text-gray-500 text-sm">
                  +{visa.bestFor.length - 3} {t.visaGuide.labels.more}
                </span>
              )}
            </div>
          </div>

          <div
            className={`grid grid-cols-2 gap-4 text-sm ${isRTL ? "text-right" : "text-left"}`}
          >
            <div>
              <span className="text-gray-500">
                {t.visaGuide.labels.validity}:
              </span>
              <span className={`block font-medium ${isRTL ? "mr-1" : "ml-1"}`}>
                {visa.validity}
              </span>
            </div>
            <div>
              <span className="text-gray-500">
                {t.visaGuide.labels.renewable}:
              </span>
              <span
                className={`block font-medium ${isRTL ? "mr-1" : "ml-1"} ${visa.renewable ? "text-green-600" : "text-gray-600"}`}
              >
                {visa.renewable
                  ? t.visaGuide.labels.yes
                  : t.visaGuide.labels.no}
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isActive ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-6 border-t border-gray-100">
            {visa.bestFor.length > 0 && (
              <div className="mb-4 pt-4">
                <h4 className="font-medium text-sky-600 mb-2">
                  {t.visaGuide.labels.bestFor}:
                </h4>
                <ul className={`${isRTL ? "pr-4" : "pl-4"} space-y-1`}>
                  {visa.bestFor.map((item, idx) => (
                    <li
                      key={idx}
                      className={`text-gray-700 flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span
                        className={`text-sky-500 ${isRTL ? "ml-2" : "mr-2"} mt-1`}
                      >
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {visa.requirements && visa.requirements.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-sky-600 mb-2">
                  {t.visaGuide.labels.requirements}:
                </h4>
                <ul className={`${isRTL ? "pr-4" : "pl-4"} space-y-1`}>
                  {visa.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className={`text-gray-700 flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span
                        className={`text-sky-500 ${isRTL ? "ml-2" : "mr-2"} mt-1`}
                      >
                        •
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {visa.process && visa.process.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-sky-600 mb-2">
                  {t.visaGuide.labels.process}:
                </h4>
                <ol className={`${isRTL ? "pr-4" : "pl-4"} space-y-2`}>
                  {visa.process.map((step, idx) => (
                    <li
                      key={idx}
                      className={`text-gray-700 flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span
                        className={`bg-sky-100 text-sky-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium ${isRTL ? "ml-3" : "mr-3"} mt-0.5 flex-shrink-0`}
                      >
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {visa.benefits && visa.benefits.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-sky-600 mb-2">
                  {t.visaGuide.labels.benefits}:
                </h4>
                <ul className={`${isRTL ? "pr-4" : "pl-4"} space-y-1`}>
                  {visa.benefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      className={`text-gray-700 flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span
                        className={`text-green-500 ${isRTL ? "ml-2" : "mr-2"} mt-1`}
                      >
                        ✓
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {visa.options && visa.options.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-sky-600 mb-2">
                  {t.visaGuide.labels.options}:
                </h4>
                <ul className={`${isRTL ? "pr-4" : "pl-4"} space-y-1`}>
                  {visa.options.map((option, idx) => (
                    <li
                      key={idx}
                      className={`text-gray-700 flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span
                        className={`text-sky-500 ${isRTL ? "ml-2" : "mr-2"} mt-1`}
                      >
                        •
                      </span>
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-sky-50 w-full p-0 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm p-8">
        <h1 className="text-3xl font-bold text-sky-800 mb-6">
          {t.visaGuide.title}
        </h1>

        <p className="text-gray-700 mb-8">{t.visaGuide.description}</p>

        {/* Controls */}
        <div
          className={`mb-8 flex flex-wrap gap-4 items-center ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <button
            onClick={() => {
              setCompareMode(!compareMode);
              setSelectedVisas(new Set());
            }}
            className={`px-4 py-2 rounded-md transition-colors ${
              compareMode
                ? "bg-sky-600 text-white"
                : "bg-sky-100 text-sky-800 hover:bg-sky-200"
            }`}
          >
            {compareMode
              ? t.visaGuide.compare.exit
              : t.visaGuide.compare.enable}
          </button>

          {compareMode && selectedVisas.size > 0 && (
            <span className="text-gray-600">
              {t.visaGuide.compare.selected}: {selectedVisas.size}/3
            </span>
          )}

          <button
            onClick={() => setActiveVisa(activeVisa ? null : "all")}
            className="px-4 py-2 bg-sky-100 text-sky-800 rounded-md hover:bg-sky-200 transition-colors"
          >
            {activeVisa
              ? t.visaGuide.controls.collapseAll
              : t.visaGuide.controls.expandAll}
          </button>
        </div>

        {/* Quick Comparison Table */}
        {compareMode && selectedVisas.size > 1 && (
          <div className="mb-8 bg-white rounded-lg border border-sky-200 overflow-hidden">
            <div className="bg-sky-100 px-6 py-3">
              <h3 className="text-lg font-semibold text-sky-700">
                {t.visaGuide.compare.table.title}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sky-100">
                    <th
                      className={`px-6 py-3 font-medium text-sky-700 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {t.visaGuide.compare.table.headers.type}
                    </th>
                    <th
                      className={`px-6 py-3 font-medium text-sky-700 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {t.visaGuide.compare.table.headers.validity}
                    </th>
                    <th
                      className={`px-6 py-3 font-medium text-sky-700 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {t.visaGuide.compare.table.headers.renewable}
                    </th>
                    <th
                      className={`px-6 py-3 font-medium text-sky-700 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {t.visaGuide.compare.table.headers.bestFor}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {t.visaGuide.visas
                    .filter((visa) => selectedVisas.has(visa.id))
                    .map((visa) => (
                      <tr key={visa.id} className="border-b border-sky-50">
                        <td className="px-6 py-4">
                          <div
                            className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <span
                              className={`text-lg ${isRTL ? "ml-2" : "mr-2"}`}
                            >
                              {visa.icon}
                            </span>
                            <span className="font-medium">{visa.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {visa.validity}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`${visa.renewable ? "text-green-600" : "text-gray-600"}`}
                          >
                            {visa.renewable
                              ? t.visaGuide.labels.yes
                              : t.visaGuide.labels.no}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {visa.bestFor.slice(0, 2).join(", ")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Visa Cards */}
        <div className="space-y-6">
          {t.visaGuide.visas.map((visa, index) =>
            renderVisaCard(
              {
                ...visa,
                // Override active state when "expand all" is selected
                ...(activeVisa === "all" && { forceExpand: true }),
              },
              index
            )
          )}
        </div>

        {/* Quick Reference Summary */}
        <section className="mt-12 bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-lg">
          <h2
            className={`text-xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-xl ${isRTL ? "ml-2" : "mr-2"}`}>📋</span>
            {t.visaGuide.summary.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.visaGuide.summary.tips.map((tip, index) => (
              <div
                key={index}
                className={`bg-white p-4 rounded-md flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-sky-500 ${isRTL ? "ml-3" : "mr-3"} mt-1`}
                >
                  💡
                </span>
                <div>
                  <h4 className="font-medium text-sky-700 mb-1">{tip.title}</h4>
                  <p className="text-gray-700 text-sm">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TurkeyVisaGuide;
