// components/TurkeyToUSAGuide.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  FileText,
  Users,
  Briefcase,
  GraduationCap,
  Shuffle,
  DollarSign,
  Building,
  Globe,
  CreditCard,
  MapPin,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/usaimmi.json";
import trTranslations from "../../../public/locales/tr/usaimmi.json";
import faTranslations from "../../../public/locales/fa/usaimmi.json";
import arTranslations from "../../../public/locales/ar/usaimmi.json";
import frTranslations from "../../../public/locales/fr/usaimmi.json";
import deTranslations from "../../../public/locales/de/usaimmi.json";
import ruTranslations from "../../../public/locales/ru/usaimmi.json";

const TurkeyToUSAGuide = () => {
  const router = useRouter();
  const { locale } = router;
  const [activeSection, setActiveSection] = useState(1);

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

  // Icon mapping for guide items
  const iconMap = {
    users: <Users className="h-5 w-5 text-sky-600" />,
    briefcase: <Briefcase className="h-5 w-5 text-sky-600" />,
    graduationCap: <GraduationCap className="h-5 w-5 text-sky-600" />,
    shuffle: <Shuffle className="h-5 w-5 text-sky-600" />,
    dollarSign: <DollarSign className="h-5 w-5 text-sky-600" />,
    fileText: <FileText className="h-5 w-5 text-sky-600" />,
    building: <Building className="h-5 w-5 text-sky-600" />,
    globe: <Globe className="h-5 w-5 text-sky-600" />,
    creditCard: <CreditCard className="h-5 w-5 text-sky-600" />,
    mapPin: <MapPin className="h-5 w-5 text-sky-600" />,
  };

  // Get localized sections
  const sections = t.migrationGuide.sections || [];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const getPreviousSection = (currentId) => {
    return currentId > 1 ? currentId - 1 : sections.length;
  };

  const getNextSection = (currentId) => {
    return currentId < sections.length ? currentId + 1 : 1;
  };

  const getSectionTitle = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    return section ? section.title : "";
  };

  return (
    <div
      className={`w-full bg-sky-50 font-sans min-h-screen ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-sky-500 to-sky-400 px-6 py-10 relative overflow-hidden">
        <div className="max-w-full mx-auto relative z-10">
          <div
            className={`flex items-center mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className="text-4xl">
              {t.migrationGuide.header.sourceFlag}
            </span>
            <span className={`text-4xl mx-2 ${isRTL ? "rotate-180" : ""}`}>
              ➡️
            </span>
            <span className="text-4xl">
              {t.migrationGuide.header.destinationFlag}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {t.migrationGuide.header.title}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            {t.migrationGuide.header.description}
          </p>
        </div>
        {/* Decorative background elements */}
        <div
          className={`absolute top-0 w-1/2 h-full opacity-10 ${isRTL ? "left-0" : "right-0"}`}
        >
          <div
            className={`absolute top-8 text-9xl ${isRTL ? "left-20" : "right-20"}`}
          >
            {t.migrationGuide.header.decorativeIcon}
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="w-full bg-white sticky top-0 z-20 shadow-md">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className={`flex min-w-max ${isRTL ? "flex-row-reverse" : ""}`}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeSection === section.id
                    ? "border-sky-500 text-sky-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                aria-label={t.migrationGuide.accessibility.sectionButton.replace(
                  "{title}",
                  section.title
                )}
              >
                {section.id}. {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="w-full bg-white">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`w-full py-8 px-6 ${
              activeSection === section.id ? "block" : "hidden"
            }`}
          >
            <div className="max-w-full mx-auto">
              <div className="mb-6">
                <h2
                  className={`text-2xl font-bold text-gray-800 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span
                    className={`bg-sky-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm ${isRTL ? "ml-3" : "mr-3"}`}
                  >
                    {section.id}
                  </span>
                  {section.title}
                </h2>
                {section.description && (
                  <p
                    className={`mt-2 text-gray-600 text-lg ${isRTL ? "mr-11" : "ml-11"}`}
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: section.description }}
                    ></span>
                  </p>
                )}
              </div>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isRTL ? "mr-11" : "ml-11"}`}
              >
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-sky-100 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div className="flex-shrink-0 mt-1 p-2 bg-sky-50 rounded-full">
                        {iconMap[item.iconKey]}
                      </div>
                      <div className={`${isRTL ? "mr-3" : "ml-3"}`}>
                        <h3 className="font-semibold text-sky-800">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-gray-600 text-sm">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          ></span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <div
                className={`flex justify-between mt-10 ${isRTL ? "mr-11 flex-row-reverse" : "ml-11"}`}
              >
                <button
                  onClick={() =>
                    handleSectionChange(getPreviousSection(section.id))
                  }
                  className="px-4 py-2 text-sm bg-sky-50 text-sky-700 rounded hover:bg-sky-100 transition-colors"
                  aria-label={t.migrationGuide.accessibility.previousButton.replace(
                    "{title}",
                    getSectionTitle(getPreviousSection(section.id))
                  )}
                >
                  {t.migrationGuide.navigation.previous}:{" "}
                  {getSectionTitle(getPreviousSection(section.id))}
                </button>
                <button
                  onClick={() =>
                    handleSectionChange(getNextSection(section.id))
                  }
                  className="px-4 py-2 text-sm bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
                  aria-label={t.migrationGuide.accessibility.nextButton.replace(
                    "{title}",
                    getSectionTitle(getNextSection(section.id))
                  )}
                >
                  {t.migrationGuide.navigation.next}:{" "}
                  {getSectionTitle(getNextSection(section.id))}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer section */}
      <div className="w-full bg-sky-50 border-t border-sky-100 py-6 px-6">
        <div className="max-w-full mx-auto text-center">
          <div
            className={`flex justify-center mb-4 ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}
          >
            <div className="bg-white p-3 rounded-full shadow-sm">
              <span className="text-2xl">
                {t.migrationGuide.footer.sourceFlag}
              </span>
            </div>
            <div className="bg-white p-3 rounded-full shadow-sm">
              <span className="text-2xl">
                {t.migrationGuide.footer.destinationFlag}
              </span>
            </div>
          </div>
          <p className="text-sky-700">
            <span
              dangerouslySetInnerHTML={{
                __html: t.migrationGuide.footer.disclaimer,
              }}
            ></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TurkeyToUSAGuide;
