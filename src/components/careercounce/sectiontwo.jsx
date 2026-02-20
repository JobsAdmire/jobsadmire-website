import React from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/careercounselling.json";
import trTranslations from "../../../public/locales/tr/careercounselling.json";
import arTranslations from "../../../public/locales/ar/careercounselling.json";
import frTranslations from "../../../public/locales/fr/careercounselling.json";
import deTranslations from "../../../public/locales/de/careercounselling.json";
import ruTranslations from "../../../public/locales/ru/careercounselling.json";
import faTranslations from "../../../public/locales/fa/careercounselling.json";
const CareerCounsellingSection = () => {
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "ar":
        return arTranslations;
      case "fa":
        return faTranslations;
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

  return (
    <div className="p-6 rounded-lg shadow-md bg-sky-50 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-3xl font-bold text-[#38B6FF] md:text-4xl lg:text-5xl">
            {t.careercounselling.mainSection.header.title}
          </h1>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="space-y-6 text-lg leading-relaxed">
            {t.careercounselling.mainSection.content.paragraphs.map(
              (paragraph, index) => (
                <p key={index} className="text-gray-700">
                  {paragraph}
                </p>
              )
            )}
          </div>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {t.careercounselling.mainSection.services.map((service, index) => (
            <div
              key={index}
              className={`p-6 bg-white border-l-4 ${service.borderColor} rounded-lg shadow-md hover:shadow-lg transition-shadow`}
            >
              <h3
                className={`mb-3 text-xl font-semibold ${service.titleColor}`}
              >
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerCounsellingSection;
