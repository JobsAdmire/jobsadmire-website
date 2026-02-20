import React from "react";
import { useRouter } from "next/router";
import { TrendingUp, Briefcase, Heart } from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/immigrationservices.json";
import trTranslations from "../../../public/locales/tr/immigrationservices.json";
import frTranslations from "../../../public/locales/fr/immigrationservices.json";
import deTranslations from "../../../public/locales/de/immigrationservices.json";
import arTranslations from "../../../public/locales/ar/immigrationservices.json";
import ruTranslations from "../../../public/locales/ru/immigrationservices.json";
import faTranslations from "../../../public/locales/fa/immigrationservices.json";

const GlobalMigrationSection = () => {
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "ar":
        return arTranslations;
      case "ru":
        return ruTranslations;
      case "fa":
        return faTranslations;
      case "fr":
        return frTranslations;
      case "de":
        return deTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  // Icon mapping function
  const getIcon = (iconName) => {
    const iconMap = {
      TrendingUp: <TrendingUp size={20} />,
      Briefcase: <Briefcase size={20} />,
      Heart: <Heart size={20} />,
    };
    return iconMap[iconName] || <TrendingUp size={20} />;
  };

  return (
    <section className="px-4 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-4">
          <div
            className="w-12 h-1 mr-4"
            style={{ backgroundColor: "#38B6FF" }}
          ></div>
          <p className="font-semibold" style={{ color: "#38B6FF" }}>
            {t.globalmigration.badge}
          </p>
        </div>
        <p className="mb-12 text-gray-700">
          {t.globalmigration.introduction.prefix}{" "}
          <span className="font-semibold">
            {t.globalmigration.introduction.highlight}
          </span>
          {t.globalmigration.introduction.suffix}
        </p>

        <h3 className="mb-3 text-3xl font-bold text-gray-800">
          {t.globalmigration.reasons.title}
        </h3>
        <p className="max-w-3xl mb-8 text-gray-700">
          {t.globalmigration.reasons.description.part1}{" "}
          <span className="font-semibold">
            {t.globalmigration.reasons.description.highlight1}
          </span>{" "}
          {t.globalmigration.reasons.description.part2}{" "}
          <span className="font-semibold">
            {t.globalmigration.reasons.description.highlight2}
          </span>
          {t.globalmigration.reasons.description.part3}
        </p>

        <div className="grid gap-8 mb-12 md:grid-cols-3">
          {t.globalmigration.reasons.items.map((reason, index) => (
            <div
              key={index}
              className="p-6 transition-shadow border shadow-sm rounded-xl hover:shadow-md"
              style={{ backgroundColor: "#E6F7FF", borderColor: "#38B6FF" }}
            >
              <div
                className="inline-block p-3 mb-4 rounded-lg"
                style={{ backgroundColor: "#F0F9FF", color: "#38B6FF" }}
              >
                {getIcon(reason.icon)}
              </div>
              <h4 className="mb-2 text-xl font-semibold text-gray-800">
                {reason.text}
              </h4>
              <div
                className="w-12 h-1 mb-4"
                style={{ backgroundColor: "#38B6FF" }}
              ></div>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>

        <div
          className="p-6 border-l-4 rounded-r-lg"
          style={{ backgroundColor: "#E6F7FF", borderColor: "#38B6FF" }}
        >
          <p className="text-gray-700">{t.globalmigration.definition}</p>
        </div>
      </div>
    </section>
  );
};

export default GlobalMigrationSection;
