// components/USAMoveRequirements.jsx
import React from "react";
import { useRouter } from "next/router";
import {
  FileText,
  BookOpen,
  Stethoscope,
  Syringe,
  DollarSign,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/usaimmi.json";
import trTranslations from "../../../public/locales/tr/usaimmi.json";
import faTranslations from "../../../public/locales/fa/usaimmi.json";
import arTranslations from "../../../public/locales/ar/usaimmi.json";
import frTranslations from "../../../public/locales/fr/usaimmi.json";
import deTranslations from "../../../public/locales/de/usaimmi.json";
import ruTranslations from "../../../public/locales/ru/usaimmi.json";

const USAMoveRequirements = () => {
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

  // Icon mapping for requirements
  const iconMap = {
    fileText: <FileText className="h-6 w-6 text-blue-600" />,
    bookOpen: <BookOpen className="h-6 w-6 text-blue-600" />,
    stethoscope: <Stethoscope className="h-6 w-6 text-blue-600" />,
    syringe: <Syringe className="h-6 w-6 text-blue-600" />,
    dollarSign: <DollarSign className="h-6 w-6 text-blue-600" />,
    shieldCheck: <ShieldCheck className="h-6 w-6 text-blue-600" />,
    messageSquare: <MessageSquare className="h-6 w-6 text-blue-600" />,
  };

  // Get localized requirements
  const requirements = t.moveRequirements.requirements || [];

  return (
    <div
      className={`w-full min-h-screen bg-sky-50 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm">
        <div className="w-full py-6 px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div
                    className={`flex items-center mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 ${isRTL ? "ml-3" : "mr-3"}`}
                    >
                      {iconMap[req.iconKey]}
                    </div>
                    <h2 className="text-lg font-semibold text-blue-800">
                      {req.id}. {req.title}
                    </h2>
                  </div>

                  <p className="text-gray-700 mb-3">
                    <span
                      dangerouslySetInnerHTML={{ __html: req.description }}
                    ></span>
                  </p>

                  {req.note && (
                    <p className="text-sm text-blue-600 italic">
                      <span
                        dangerouslySetInnerHTML={{ __html: req.note }}
                      ></span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              {t.moveRequirements.importantNote.title}
            </h3>
            <p className="text-gray-700">
              {t.moveRequirements.importantNote.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USAMoveRequirements;
