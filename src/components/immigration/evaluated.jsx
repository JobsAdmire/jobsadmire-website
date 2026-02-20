import React from "react";
import { useRouter } from "next/router";
import {
  Mail,
  Settings,
  Users,
  FileText,
  DollarSign,
  ArrowRight,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/immigrationservices.json";
import trTranslations from "../../../public/locales/tr/immigrationservices.json";
import frTranslations from "../../../public/locales/fr/immigrationservices.json";
import deTranslations from "../../../public/locales/de/immigrationservices.json";
import arTranslations from "../../../public/locales/ar/immigrationservices.json";
import ruTranslations from "../../../public/locales/ru/immigrationservices.json";
import faTranslations from "../../../public/locales/fa/immigrationservices.json";
const EvaluationSection = () => {
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
      Mail: (
        <Mail
          className="w-12 h-12 transition-colors duration-300 group-hover:text-white"
          style={{ color: "#38B6FF" }}
        />
      ),
      Settings: (
        <Settings
          className="w-12 h-12 transition-colors duration-300 group-hover:text-white"
          style={{ color: "#38B6FF" }}
        />
      ),
      Users: (
        <Users
          className="w-12 h-12 transition-colors duration-300 group-hover:text-white"
          style={{ color: "#38B6FF" }}
        />
      ),
      FileText: (
        <FileText
          className="w-12 h-12 transition-colors duration-300 group-hover:text-white"
          style={{ color: "#38B6FF" }}
        />
      ),
      DollarSign: (
        <DollarSign
          className="w-12 h-12 transition-colors duration-300 group-hover:text-white"
          style={{ color: "#38B6FF" }}
        />
      ),
    };
    return (
      iconMap[iconName] || (
        <Mail
          className="w-12 h-12 transition-colors duration-300 group-hover:text-white"
          style={{ color: "#38B6FF" }}
        />
      )
    );
  };

  return (
    <section
      className="px-4 py-16"
      style={{ background: "linear-gradient(to br, #E6F7FF, #F0F9FF)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
          <div
            className="relative p-10 text-white"
            style={{
              background: "linear-gradient(to right, #38B6FF, #1E90FF)",
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16 bg-white rounded-full opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 transform -translate-x-12 translate-y-10 bg-white rounded-full opacity-20"></div>

            <h2 className="relative z-10 mb-4 text-4xl font-bold text-center">
              {t.evaluation.title}
            </h2>
            <p className="relative z-10 max-w-3xl mx-auto text-lg text-center opacity-90">
              {t.evaluation.description}
            </p>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
              {t.evaluation.services.map((service, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden transition-all duration-300 transform bg-white border-2 shadow-md group rounded-xl hover:shadow-xl hover:-translate-y-1"
                  style={{ borderColor: "#E6F7FF" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#38B6FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E6F7FF";
                  }}
                >
                  <div className="flex flex-col items-center h-full p-6 text-center">
                    <div
                      className="p-4 mb-4 transition-colors duration-300 rounded-full"
                      style={{ backgroundColor: "#E6F7FF" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#38B6FF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#E6F7FF";
                      }}
                    >
                      {getIcon(service.icon)}
                    </div>
                    <h3
                      className="mb-2 font-bold transition-colors duration-300"
                      style={{ color: "#1F2937" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#38B6FF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#1F2937";
                      }}
                    >
                      {service.title}
                    </h3>
                    <p className="hidden mt-2 text-sm text-gray-600 md:block">
                      {service.description}
                    </p>

                    <div
                      className="absolute bottom-0 left-0 w-full h-1 transition-transform duration-300 origin-left transform scale-x-0 group-hover:scale-x-100"
                      style={{ backgroundColor: "#38B6FF" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex flex-col items-center justify-center p-10 border-t"
            style={{ backgroundColor: "#E6F7FF", borderColor: "#38B6FF" }}
          >
            <a href="/contact-us">
              <button
                className="relative px-8 py-4 overflow-hidden font-semibold text-white transition-all duration-300 transform rounded-full shadow-lg group hover:-translate-y-1"
                style={{
                  background: "linear-gradient(to right, #38B6FF, #1E90FF)",
                }}
              >
                <span className="relative z-10 flex items-center">
                  {t.evaluation.cta.text}
                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute top-0 left-0 w-full h-full transition-transform duration-500 transform -translate-x-full -skew-x-12 bg-white opacity-10 group-hover:translate-x-0"></span>
              </button>
            </a>

            <p
              className="max-w-lg mt-4 text-sm text-center"
              style={{ color: "#38B6FF" }}
            >
              {t.evaluation.cta.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EvaluationSection;
