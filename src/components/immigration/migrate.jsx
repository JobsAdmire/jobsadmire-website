import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  ChevronRight,
  Home,
  Briefcase,
  TrendingUp,
  Globe,
  Award,
  GraduationCap,
  Heart,
  Compass,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/immigrationservices.json";
import trTranslations from "../../../public/locales/tr/immigrationservices.json";
import frTranslations from "../../../public/locales/fr/immigrationservices.json";
import deTranslations from "../../../public/locales/de/immigrationservices.json";
import arTranslations from "../../../public/locales/ar/immigrationservices.json";
import ruTranslations from "../../../public/locales/ru/immigrationservices.json";
import faTranslations from "../../../public/locales/fa/immigrationservices.json";

const MigrationOpportunitiesSection = () => {
  const router = useRouter();
  const { locale } = router;
  const [hoveredItem, setHoveredItem] = useState(null);

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
      Home: <Home size={20} />,
      Briefcase: <Briefcase size={20} />,
      TrendingUp: <TrendingUp size={20} />,
      Globe: <Globe size={20} />,
      Award: <Award size={20} />,
      GraduationCap: <GraduationCap size={20} />,
      Heart: <Heart size={20} />,
      Compass: <Compass size={20} />,
    };
    return iconMap[iconName] || <Home size={20} />;
  };

  const Card = ({ title, items }) => (
    <div className="h-full overflow-hidden bg-white border border-gray-100 rounded-lg shadow-lg">
      <div
        className="px-6 py-4"
        style={{ background: "linear-gradient(to right, #38B6FF, #1E90FF)" }}
      >
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.id}
            className={`px-6 py-4 flex justify-between items-center cursor-pointer transition-colors duration-200 ${
              hoveredItem === `${title}-${item.id}`
                ? "bg-blue-50"
                : "hover:bg-gray-50"
            }`}
            onMouseEnter={() => setHoveredItem(`${title}-${item.id}`)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className="font-medium text-gray-800">{item.name}</span>
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  hoveredItem === `${title}-${item.id}`
                    ? "opacity-100"
                    : "opacity-0"
                } transition-opacity duration-200`}
                style={{ backgroundColor: "#38B6FF" }}
              ></div>
              <ChevronRight
                className={`h-5 w-5 transform transition-transform duration-200 ${
                  hoveredItem === `${title}-${item.id}` ? "translate-x-1" : ""
                }`}
                style={{ color: "#38B6FF" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      className="px-4 py-16"
      style={{ background: "linear-gradient(to br, #E6F7FF, #F0F9FF)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="p-8 mb-16 -mt-20 bg-white shadow-xl rounded-xl md:p-10">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-800">
            {t.migrationopportunities.title.prefix}{" "}
            <span style={{ color: "#38B6FF" }}>
              {t.migrationopportunities.title.highlight}
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3">
            <Card
              title={t.migrationopportunities.cards.countries.title}
              items={t.migrationopportunities.cards.countries.items}
            />
            <Card
              title={t.migrationopportunities.cards.prVisas.title}
              items={t.migrationopportunities.cards.prVisas.items}
            />
            <Card
              title={t.migrationopportunities.cards.workVisas.title}
              items={t.migrationopportunities.cards.workVisas.items}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {t.migrationopportunities.benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 transition-colors rounded-lg hover:bg-blue-50"
              >
                <div
                  className="p-2 rounded-full"
                  style={{ backgroundColor: "#E6F7FF", color: "#38B6FF" }}
                >
                  {getIcon(benefit.icon)}
                </div>
                <p className="font-medium text-gray-800">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MigrationOpportunitiesSection;
