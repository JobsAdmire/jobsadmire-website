// components/MovingPetsToUSA.jsx
import React from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/usaimmi.json";
import trTranslations from "../../../public/locales/tr/usaimmi.json";
import faTranslations from "../../../public/locales/fa/usaimmi.json";
import arTranslations from "../../../public/locales/ar/usaimmi.json";
import frTranslations from "../../../public/locales/fr/usaimmi.json";
import deTranslations from "../../../public/locales/de/usaimmi.json";
import ruTranslations from "../../../public/locales/ru/usaimmi.json";

const MovingPetsToUSA = () => {
  const router = useRouter();
  const { locale } = router;

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
  const isRTL = locale === "ar" || locale === "fa";

  // Get localized data
  const requirements = t.petsGuide.requirements || [];
  const arrivalInfo = t.petsGuide.arrivalInfo || [];
  const tips = t.petsGuide.tips || [];

  return (
    <div
      className={`w-full font-sans bg-white ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full border-b">
        {/* Simple Header */}
        <div className="p-8 max-w-7xl mx-auto">
          <div
            className={`flex items-center mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-4xl ${isRTL ? "ml-4" : "mr-4"}`}>
              {t.petsGuide.header.icons[0]}
            </span>
            <span className={`text-4xl ${isRTL ? "ml-4" : "mr-4"}`}>
              {t.petsGuide.header.icons[1]}
            </span>
            <span className="text-4xl">{t.petsGuide.header.icons[2]}</span>
          </div>
          <h1 className="text-3xl font-bold mb-3 text-sky-700">
            {t.petsGuide.header.title}
          </h1>
          <p className="text-xl text-gray-600">
            {t.petsGuide.header.description}
          </p>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Requirements Section */}
        <div className="mb-12">
          <h2
            className={`text-2xl font-bold text-sky-700 mb-6 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>
              {t.petsGuide.sections.requirements.icon}
            </span>
            {t.petsGuide.sections.requirements.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((req) => (
              <div key={req.id} className="border rounded-lg p-4 h-full">
                <div
                  className={`flex items-center mb-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className={`text-3xl ${isRTL ? "ml-3" : "mr-3"}`}>
                    {req.icon}
                  </span>
                  <h3 className="font-bold text-lg">{req.title}</h3>
                </div>
                <p className="text-gray-600">
                  <span
                    dangerouslySetInnerHTML={{ __html: req.description }}
                  ></span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* On Arrival Section */}
        <div className="mb-12 border-t pt-8">
          <h2
            className={`text-2xl font-bold text-sky-700 mb-6 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>
              {t.petsGuide.sections.arrival.icon}
            </span>
            {t.petsGuide.sections.arrival.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {arrivalInfo.map((info) => (
              <div
                key={info.id}
                className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className={`text-3xl ${isRTL ? "ml-4" : "mr-4"}`}>
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                  <p className="text-gray-600">
                    <span
                      dangerouslySetInnerHTML={{ __html: info.description }}
                    ></span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Tips */}
        <div className="border-t pt-8">
          <h2
            className={`text-2xl font-bold text-sky-700 mb-6 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className={`text-2xl ${isRTL ? "ml-3" : "mr-3"}`}>
              {t.petsGuide.sections.tips.icon}
            </span>
            {t.petsGuide.sections.tips.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <div
                key={index}
                className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className={`text-sky-500 ${isRTL ? "ml-3" : "mr-3"}`}>
                  •
                </span>
                <p className="text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resources/Footer */}
        <div className="mt-12 pt-6 border-t text-center">
          <p className="text-gray-600">
            <span
              dangerouslySetInnerHTML={{
                __html: t.petsGuide.footer.disclaimer,
              }}
            ></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovingPetsToUSA;
