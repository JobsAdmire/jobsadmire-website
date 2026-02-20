import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Building,
  Search,
  Award,
  MapPin,
  Briefcase,
  Star,
  Home,
  Globe,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/visarelocation.json";
import trTranslations from "../../../public/locales/tr/visarelocation.json";
import frTranslations from "../../../public/locales/fr/visarelocation.json";
import deTranslations from "../../../public/locales/de/visarelocation.json";
import arTranslations from "../../../public/locales/ar/visarelocation.json";
import ruTranslations from "../../../public/locales/ru/visarelocation.json";
import faTranslations from "../../../public/locales/fa/visarelocation.json";

const VisaInfoPage = () => {
  const router = useRouter();
  const { locale } = router;
  const { t: tCommon } = useTranslation("common");

  // Get translations based on current locale with safety checks
  const getTranslations = () => {
    let translations;

    try {
      switch (locale) {
        case "tr":
          translations = trTranslations;
          break;
        case "fa":
          translations = faTranslations;
          break;
        case "ar":
          translations = arTranslations;
          break;
        case "fr":
          translations = frTranslations;
          break;
        case "ru":
          translations = ruTranslations;
          break;
        case "de":
          translations = deTranslations;
          break;
        default:
          translations = enTranslations;
      }

      // Debug log for Persian specifically
      if (locale === "fa") {
        console.log("Persian translations loaded:", translations);
        console.log("visainfo structure:", translations?.visainfo);
      }

      // Safety check - if translations are missing or malformed, fallback to English
      if (
        !translations ||
        !translations.visainfo ||
        !translations.visainfo.visaTypes
      ) {
        console.warn(
          `Translations missing or malformed for locale: ${locale}. Falling back to English.`
        );
        return enTranslations;
      }

      return translations;
    } catch (error) {
      console.error(`Error loading translations for locale ${locale}:`, error);
      return enTranslations; // Fallback to English
    }
  };

  const t = getTranslations();

  // Icon mapping function
  const getIcon = (iconName) => {
    const iconMap = {
      Award: <Award size={24} />,
      Briefcase: <Briefcase size={24} />,
      Globe: <Globe size={24} />,
      Star: <Star size={24} />,
      Users: <Users size={24} />,
      Clock: <Clock size={32} />,
      Home: <Home size={32} />,
      Building: <Building size={24} />,
      CheckCircle: <CheckCircle size={24} />,
      Search: <Search size={24} />,
    };
    return iconMap[iconName] || <Briefcase size={24} />;
  };

  // Safety check for rendering - ensure all required data exists
  if (!t?.visainfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">{tCommon("labels.visa.translationError")}</h2>
          <p className="text-gray-600">
            {tCommon("labels.visa.unableToLoadTranslations", { locale })}
          </p>
          <p className="text-sm text-gray-500">
            {tCommon("labels.visa.checkTranslationFiles")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-7xl px-4 pb-20 mx-auto">
        {/* Visa Types Section */}
        <section className="mb-20">
          <div className="flex items-center justify-center mb-10">
            <div className="w-10 h-1 mr-3 rounded-full bg-sky-300"></div>
            <h2 className="text-3xl font-bold text-sky-800">
              {t?.visainfo?.visaTypes?.title || "Visa Types"}
            </h2>
            <div className="w-10 h-1 ml-3 rounded-full bg-sky-300"></div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(t?.visainfo?.visaTypes?.items || []).map((visa, index) => (
              <div
                key={index}
                className="p-6 transition-all duration-300 bg-white shadow-md rounded-2xl hover:shadow-xl group"
              >
                <div className="flex items-center">
                  <div className="p-3 text-white transition-transform duration-300 shadow-md bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl group-hover:scale-110">
                    {getIcon(visa?.icon)}
                  </div>
                  <p className="ml-4 font-medium text-gray-700 transition-colors duration-300 group-hover:text-sky-700">
                    {visa?.title || "Visa Type"}
                  </p>
                  <ArrowRight
                    className="ml-auto transition-transform duration-300 text-sky-400 group-hover:translate-x-1"
                    size={20}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Relocation Section */}
        <section className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-sky-800">
              {t?.visainfo?.whyRelocation?.title?.prefix || "Why"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                {t?.visainfo?.whyRelocation?.title?.highlight || "Relocation"}
              </span>{" "}
              {t?.visainfo?.whyRelocation?.title?.suffix || "Services?"}
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              {t?.visainfo?.whyRelocation?.description ||
                "Professional relocation services for your peace of mind."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {(t?.visainfo?.whyRelocation?.features || []).map(
              (feature, index) => (
                <div
                  key={index}
                  className="p-8 transition-all duration-300 bg-white border-t-4 shadow-md rounded-2xl hover:shadow-lg hover:-translate-y-1 border-sky-400"
                >
                  <div className="flex justify-center mb-6">
                    <div className="p-5 text-white shadow-lg bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl">
                      {getIcon(feature?.icon)}
                    </div>
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-center text-sky-800">
                    {feature?.title || "Feature"}
                  </h3>
                  <p className="text-center text-gray-600">
                    {feature?.description || "Feature description"}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Relocation Package Section */}
        <section>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-sky-800">
              {t?.visainfo?.relocationPackage?.title || "Relocation Packages"}
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full bg-sky-300"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {(t?.visainfo?.relocationPackage?.scenarios || []).map(
              (scenario, index) => (
                <div
                  key={index}
                  className="p-6 overflow-hidden transition-all duration-300 bg-white border-l-4 shadow-md rounded-2xl hover:shadow-xl border-sky-400 group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 -mt-12 -mr-12 transition-colors duration-300 rounded-full bg-sky-100 opacity-30 group-hover:bg-sky-200"></div>
                  <div className="relative flex items-center mb-6">
                    <div className="p-4 text-white shadow-md bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl">
                      {getIcon(scenario?.icon)}
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-sky-800">
                      {scenario?.title || "Package"}
                    </h3>
                  </div>
                  <p className="relative pl-4 text-gray-600 border-l border-sky-100">
                    {scenario?.description || "Package description"}
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VisaInfoPage;
