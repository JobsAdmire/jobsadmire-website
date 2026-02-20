// components/USAVisaOptions.jsx
import React from "react";
import { useRouter } from "next/router";
import {
  Users,
  Briefcase,
  GraduationCap,
  DollarSign,
  Shuffle,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/usaimmi.json";
import trTranslations from "../../../public/locales/tr/usaimmi.json";
import faTranslations from "../../../public/locales/fa/usaimmi.json";
import arTranslations from "../../../public/locales/ar/usaimmi.json";
import frTranslations from "../../../public/locales/fr/usaimmi.json";
import deTranslations from "../../../public/locales/de/usaimmi.json";
import ruTranslations from "../../../public/locales/ru/usaimmi.json";

const USAVisaOptions = () => {
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

  // Icon mapping for visa types
  const iconMap = {
    users: <Users className="h-6 w-6 text-blue-600" />,
    briefcase: <Briefcase className="h-6 w-6 text-blue-600" />,
    graduationCap: <GraduationCap className="h-6 w-6 text-blue-600" />,
    dollarSign: <DollarSign className="h-6 w-6 text-blue-600" />,
    shuffle: <Shuffle className="h-6 w-6 text-blue-600" />,
  };

  // Get localized visa types
  const visaTypes = t.visaOptions.visaTypes || [];

  return (
    <div
      className={`w-full min-h-screen bg-sky-50 font-sans ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full bg-white shadow-sm">
        <div className="w-full py-6 px-6">
          <div className="space-y-8">
            {visaTypes.map((visa) => (
              <div
                key={visa.id}
                className="border-b border-gray-200 pb-8 last:border-0"
              >
                <div
                  className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex-shrink-0 mt-1 ${isRTL ? "ml-4" : "mr-4"}`}
                  >
                    {iconMap[visa.iconKey]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-blue-800 mb-3">
                      {visa.title}
                    </h2>
                    <p className="text-gray-700 mb-4">
                      <span
                        dangerouslySetInnerHTML={{ __html: visa.description }}
                      ></span>
                    </p>

                    {visa.examples && visa.examples.length > 0 && (
                      <div className="bg-sky-50 p-4 rounded-md">
                        <h3 className="font-medium text-blue-700 mb-2">
                          {visa.examples.length > 1
                            ? t.visaOptions.labels.examples
                            : t.visaOptions.labels.note}
                        </h3>
                        <ul
                          className={`list-disc space-y-1 text-gray-600 ${isRTL ? "pr-5" : "pl-5"}`}
                        >
                          {visa.examples.map((example, index) => (
                            <li key={index}>
                              <span
                                dangerouslySetInnerHTML={{ __html: example }}
                              ></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default USAVisaOptions;
