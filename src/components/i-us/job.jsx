// components/USAMoveRequirementsGuide.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  FileText,
  BookOpen,
  Stethoscope,
  Syringe,
  DollarSign,
  ShieldCheck,
  MessageSquare,
  CreditCard,
  Search,
  PanelRight,
  Info,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/usaimmi.json";
import trTranslations from "../../../public/locales/tr/usaimmi.json";
import faTranslations from "../../../public/locales/fa/usaimmi.json";
import arTranslations from "../../../public/locales/ar/usaimmi.json";
import frTranslations from "../../../public/locales/fr/usaimmi.json";
import deTranslations from "../../../public/locales/de/usaimmi.json";
import ruTranslations from "../../../public/locales/ru/usaimmi.json";
const USAMoveRequirementsGuide = () => {
  const router = useRouter();
  const { locale } = router;
  const [activeTab, setActiveTab] = useState("all");

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "fa":
        return faTranslations;
      case "ar":
        return arTranslations;
      case "fr":
        return frTranslations;
      case "ru":
        return ruTranslations;
      case "de":
        return deTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();
  const isRTL = locale === "ar";

  // Icon mapping for requirements
  const iconMap = {
    fileText: <FileText className="h-6 w-6 text-blue-600" />,
    bookOpen: <BookOpen className="h-6 w-6 text-blue-600" />,
    stethoscope: <Stethoscope className="h-6 w-6 text-blue-600" />,
    syringe: <Syringe className="h-6 w-6 text-blue-600" />,
    dollarSign: <DollarSign className="h-6 w-6 text-blue-600" />,
    shieldCheck: <ShieldCheck className="h-6 w-6 text-blue-600" />,
    messageSquare: <MessageSquare className="h-6 w-6 text-blue-600" />,
    creditCard: <CreditCard className="h-6 w-6 text-blue-600" />,
  };

  // Get localized requirements
  const requirements = t.requirementsGuide.requirements || [];
  const tabs = t.requirementsGuide.tabs || {};

  const filteredRequirements =
    activeTab === "all"
      ? requirements
      : requirements.filter((req) => req.category === activeTab);

  const getCategoryConfig = (category) => {
    const configs = {
      essential: {
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        label: t.requirementsGuide.categoryLabels.essential,
      },
      recommended: {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        label: t.requirementsGuide.categoryLabels.recommended,
      },
      "after-arrival": {
        bgColor: "bg-amber-100",
        textColor: "text-amber-800",
        label: t.requirementsGuide.categoryLabels.afterArrival,
      },
    };
    return configs[category] || configs.essential;
  };

  return (
    <div
      className={`w-full min-h-screen bg-gray-50 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-md">
        {/* Navigation tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div
              className={`flex space-x-1 overflow-x-auto ${isRTL ? "space-x-reverse" : ""}`}
            >
              {Object.entries(tabs).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  aria-label={t.requirementsGuide.accessibility.tabButton.replace(
                    "{label}",
                    label
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredRequirements.map((req) => {
              const categoryConfig = getCategoryConfig(req.category);

              return (
                <div
                  key={req.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow transition-shadow"
                >
                  <div className="p-6">
                    <div
                      className={`flex items-center mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`flex items-center justify-center h-10 w-10 rounded-full ${categoryConfig.bgColor}`}
                      >
                        {iconMap[req.iconKey]}
                      </div>
                      <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                        <h2 className="text-xl font-semibold text-gray-800">
                          {req.id}. {req.title}
                        </h2>
                        <div className="mt-1">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryConfig.bgColor} ${categoryConfig.textColor}`}
                          >
                            {categoryConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">
                      <span
                        dangerouslySetInnerHTML={{ __html: req.description }}
                      ></span>
                    </p>

                    {req.details && req.details.length > 0 && (
                      <div className="mb-4">
                        <ul className={`space-y-2 ${isRTL ? "mr-6" : "ml-6"}`}>
                          {req.details.map((detail, index) => (
                            <li
                              key={index}
                              className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                            >
                              <span
                                className={`text-blue-500 ${isRTL ? "ml-2" : "mr-2"}`}
                              >
                                •
                              </span>
                              <span className="text-gray-600">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {req.tip && (
                      <div
                        className={`bg-blue-50 p-4 mt-4 rounded ${isRTL ? "border-r-4 border-blue-400" : "border-l-4 border-blue-400"}`}
                      >
                        <div
                          className={`flex ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="flex-shrink-0">
                            {req.id === 3 ? (
                              <Search className="h-5 w-5 text-blue-500" />
                            ) : (
                              <Info className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className={`${isRTL ? "mr-3" : "ml-3"}`}>
                            <p className="text-sm text-blue-700">{req.tip}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 bg-blue-50 border border-blue-100 rounded-lg p-5">
            <div className={`flex ${isRTL ? "flex-row-reverse" : ""}`}>
              <PanelRight
                className={`h-6 w-6 text-blue-500 flex-shrink-0 mt-1 ${isRTL ? "rotate-180" : ""}`}
              />
              <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  {t.requirementsGuide.importantReminder.title}
                </h3>
                <p className="text-gray-700">
                  {t.requirementsGuide.importantReminder.description}
                </p>
                <p className="mt-3 text-sm text-blue-600">
                  {t.requirementsGuide.importantReminder.lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USAMoveRequirementsGuide;
