import React from "react";
import { useRouter } from "next/router";
import {
  ChevronRight,
  Users,
  ClipboardCheck,
  Search,
  FileText,
  BarChart4,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/immigrationservices.json";
import trTranslations from "../../../public/locales/tr/immigrationservices.json";
import frTranslations from "../../../public/locales/fr/immigrationservices.json";
import deTranslations from "../../../public/locales/de/immigrationservices.json";
import arTranslations from "../../../public/locales/ar/immigrationservices.json";
import ruTranslations from "../../../public/locales/ru/immigrationservices.json";
import faTranslations from "../../../public/locales/fa/immigrationservices.json";

const ImmigrationJourneySection = () => {
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
  const getIcon = (iconName, size = 32) => {
    const iconMap = {
      Search: <Search size={size} />,
      Users: <Users size={size} />,
      ClipboardCheck: <ClipboardCheck size={size} />,
      FileText: <FileText size={size} />,
      BarChart4: <BarChart4 size={size} />,
    };
    return iconMap[iconName] || <Search size={size} />;
  };

  return (
    <section className="px-4 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          className="p-10 mb-12 text-white rounded-xl"
          style={{ background: "linear-gradient(to right, #38B6FF, #1E90FF)" }}
        >
          <h2 className="mb-4 text-4xl font-bold text-center">
            {t.immigrationjourney.header.title}
          </h2>
          <p className="max-w-4xl mx-auto text-lg text-center opacity-90">
            {t.immigrationjourney.header.description.part1}{" "}
            <span className="font-semibold">
              {t.immigrationjourney.header.description.highlight1}
            </span>{" "}
            {t.immigrationjourney.header.description.part2}{" "}
            <span className="font-semibold">
              {t.immigrationjourney.header.description.highlight2}
            </span>
            , {t.immigrationjourney.header.description.part3}{" "}
            <span className="font-semibold">
              {t.immigrationjourney.header.description.highlight3}
            </span>{" "}
            {t.immigrationjourney.header.description.part4}
          </p>
        </div>

        {/* Process Steps - Desktop */}
        <div className="items-start justify-between hidden mb-12 md:flex">
          {t.immigrationjourney.steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center w-48 text-center">
                <div
                  className="p-6 mb-4 rounded-full"
                  style={{ backgroundColor: "#E6F7FF", color: "#38B6FF" }}
                >
                  {getIcon(step.icon)}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-800">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>

              {index < t.immigrationjourney.steps.length - 1 && (
                <div className="flex items-center justify-center flex-1">
                  <div
                    className="h-0.5 w-full relative"
                    style={{ backgroundColor: "#E6F7FF" }}
                  >
                    <div
                      className="absolute right-0 -top-2"
                      style={{ color: "#38B6FF" }}
                    >
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Process Steps - Mobile */}
        <div className="mb-12 space-y-8 md:hidden">
          {t.immigrationjourney.steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start p-4 space-x-4 border rounded-lg"
              style={{ borderColor: "#E6F7FF" }}
            >
              <div
                className="flex-shrink-0 p-4 rounded-full"
                style={{ backgroundColor: "#E6F7FF", color: "#38B6FF" }}
              >
                {getIcon(step.icon)}
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <span
                    className="flex items-center justify-center w-6 h-6 mr-2 text-xs font-bold text-white rounded-full"
                    style={{ backgroundColor: "#38B6FF" }}
                  >
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-gray-800">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Our Services */}
        <div className="p-8 bg-gray-50 rounded-xl">
          <h3 className="mb-8 text-2xl font-bold text-center text-gray-800">
            {t.immigrationjourney.whyChoose.title}
          </h3>

          <div className="grid gap-6 md:grid-cols-3">
            {t.immigrationjourney.whyChoose.services.map((service, index) => (
              <div
                key={index}
                className="p-6 transition-shadow bg-white border-t-4 rounded-lg shadow-md hover:shadow-lg"
                style={{ borderTopColor: "#38B6FF" }}
              >
                <h4
                  className="mb-3 text-xl font-semibold"
                  style={{ color: "#38B6FF" }}
                >
                  {service.title}
                </h4>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImmigrationJourneySection;
