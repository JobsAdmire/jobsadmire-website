import React, { useState } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/australiaimmi.json";
import trTranslations from "../../../public/locales/tr/australiaimmi.json";
// import arTranslations from '../../../public/locales/ar/australiaimmi.json';
// import frTranslations from '../../../public/locales/fr/australiaimmi.json';
// import deTranslations from '../../../public/locales/de/australiaimmi.json';

const AustraliaVisaGuide = () => {
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
                <p className="text-sm text-gray-500">{visa.category}</p>
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
                    ? t.australiaVisaGuide?.compare?.selected
                    : t.australiaVisaGuide?.compare?.select}
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
              {t.australiaVisaGuide?.labels?.idealFor}
            </h4>
            <p className="text-gray-700 text-sm">{visa.idealFor}</p>
          </div>

          <div
            className={`grid grid-cols-2 gap-4 text-sm ${isRTL ? "text-right" : "text-left"}`}
          >
            <div>
              <span className="text-gray-500">
                {t.australiaVisaGuide?.labels?.duration}:
              </span>
              <span className={`block font-medium ${isRTL ? "mr-1" : "ml-1"}`}>
                {visa.duration}
              </span>
            </div>
            <div>
              <span className="text-gray-500">
                {t.australiaVisaGuide?.labels?.pathway}:
              </span>
              <span
                className={`block font-medium ${isRTL ? "mr-1" : "ml-1"} ${visa.pathway === "Permanent" ? "text-green-600" : "text-orange-600"}`}
              >
                {visa.pathway}
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
            {visa.visaTypes && visa.visaTypes.length > 0 && (
              <div className="mb-4 pt-4">
                <h4 className="font-medium text-sky-600 mb-2">
                  {t.australiaVisaGuide?.labels?.visaTypes}:
                </h4>
                <div className="space-y-3">
                  {visa.visaTypes.map((type, idx) => (
                    <div key={idx} className="bg-sky-50 p-3 rounded-md">
                      <h5 className="font-medium text-sky-700 mb-1">
                        {type.name}
                      </h5>
                      <p className="text-gray-600 text-sm">
                        {type.description}
                      </p>
                      {type.subclass && (
                        <p className="text-sky-600 text-xs mt-1">
                          Subclass: {type.subclass}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {visa.requirements && visa.requirements.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-sky-600 mb-2">
                  {t.australiaVisaGuide?.labels?.requirements}:
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

            {visa.benefits && visa.benefits.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-sky-600 mb-2">
                  {t.australiaVisaGuide?.labels?.benefits}:
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

            {visa.processingTime && (
              <div className="bg-blue-50 p-3 rounded-md">
                <h5 className="font-medium text-blue-700 mb-1">
                  {t.australiaVisaGuide?.labels?.processingTime}
                </h5>
                <p className="text-blue-600 text-sm">{visa.processingTime}</p>
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
        <p className="text-gray-700 mb-8">
          {t.australiaVisaGuide?.description}
        </p>

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
              ? t.australiaVisaGuide?.compare?.exit
              : t.australiaVisaGuide?.compare?.enable}
          </button>

          {compareMode && selectedVisas.size > 0 && (
            <span className="text-gray-600">
              {t.australiaVisaGuide?.compare?.selected}: {selectedVisas.size}/3
            </span>
          )}

          <button
            onClick={() => setActiveVisa(activeVisa ? null : "all")}
            className="px-4 py-2 bg-sky-100 text-sky-800 rounded-md hover:bg-sky-200 transition-colors"
          >
            {activeVisa
              ? t.australiaVisaGuide?.controls?.collapseAll
              : t.australiaVisaGuide?.controls?.expandAll}
          </button>
        </div>

        {/* Quick Comparison Table */}
        {compareMode && selectedVisas.size > 1 && (
          <div className="mb-8 bg-white rounded-lg border border-sky-200 overflow-hidden">
            <div className="bg-sky-100 px-6 py-3">
              <h3 className="text-lg font-semibold text-sky-700">
                {t.australiaVisaGuide?.compare?.table?.title}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sky-100">
                    <th
                      className={`px-6 py-3 font-medium text-sky-700 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {t.australiaVisaGuide?.compare?.table?.headers?.type}
                    </th>
                    <th
                      className={`px-6 py-3 font-medium text-sky-700 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {t.australiaVisaGuide?.compare?.table?.headers?.duration}
                    </th>
                    <th
                      className={`px-6 py-3 font-medium text-sky-700 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {t.australiaVisaGuide?.compare?.table?.headers?.pathway}
                    </th>
                    <th
                      className={`px-6 py-3 font-medium text-sky-700 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {t.australiaVisaGuide?.compare?.table?.headers?.idealFor}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {t.australiaVisaGuide?.visas
                    ?.filter((visa) => selectedVisas.has(visa.id))
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
                          {visa.duration}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`${visa.pathway === "Permanent" ? "text-green-600" : "text-orange-600"}`}
                          >
                            {visa.pathway}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {visa.idealFor}
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
          {t.australiaVisaGuide?.visas?.map((visa, index) =>
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

        {/* Visa Selection Helper */}
        <section className="mt-12 bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-lg">
          <h2
            className={`text-xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-xl ${isRTL ? "ml-2" : "mr-2"}`}>🧭</span>
            {t.australiaVisaGuide?.helper?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.australiaVisaGuide?.helper?.scenarios?.map((scenario, index) => (
              <div
                key={index}
                className={`bg-white p-4 rounded-md flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`text-sky-500 ${isRTL ? "ml-3" : "mr-3"} mt-1`}
                >
                  {scenario.icon}
                </span>
                <div>
                  <h4 className="font-medium text-sky-700 mb-1">
                    {scenario.situation}
                  </h4>
                  <p className="text-gray-700 text-sm mb-2">
                    {scenario.description}
                  </p>
                  <p className="text-sky-600 text-sm font-medium">
                    {scenario.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Processing Times Overview */}
        <section className="mt-8 bg-white p-6 border border-sky-100 rounded-lg">
          <h2
            className={`text-xl font-semibold text-sky-700 mb-4 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-xl ${isRTL ? "ml-2" : "mr-2"}`}>⏱️</span>
            {t.australiaVisaGuide?.processingTimes?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.australiaVisaGuide?.processingTimes?.visaTypes?.map(
              (visa, index) => (
                <div key={index} className="bg-sky-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sky-700 mb-2">
                    {visa.type}
                  </h4>
                  <div
                    className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <span className="text-gray-600 text-sm">
                      {t.australiaVisaGuide?.processingTimes?.averageTime}
                    </span>
                    <span className="font-bold text-sky-600">{visa.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{visa.note}</p>
                </div>
              )
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            {t.australiaVisaGuide?.processingTimes?.disclaimer}
          </p>
        </section>
      </div>
    </div>
  );
};

export default AustraliaVisaGuide;
