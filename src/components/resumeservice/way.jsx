import React from "react";
import { useRouter } from "next/router";
import {
  Check,
  X,
  Award,
  Zap,
  Clock,
  Shield,
  FileText,
  Users,
  Star,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/resumeservice.json";
import trTranslations from "../../../public/locales/tr/resumeservice.json";
import frTranslations from "../../../public/locales/fr/resumeservice.json";
import deTranslations from "../../../public/locales/de/resumeservice.json";
import arTranslations from "../../../public/locales/ar/resumeservice.json";
import ruTranslations from "../../../public/locales/ru/resumeservice.json";
import faTranslations from "../../../public/locales/fa/resumeservice.json";
const EnhancedResumeComparisonSection = () => {
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "ar":
        return arTranslations;
      case "fr":
        return frTranslations;
      case "fa":
        return faTranslations;
      case "de":
        return deTranslations;
      case "ru":
        return ruTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  // Icon mapping for their way items
  const theirWayIconMap = {
    clock: <Clock className="w-5 h-5 text-red-500" />,
    fileText: <FileText className="w-5 h-5 text-red-500" />,
    x: <X className="w-5 h-5 text-red-500" />,
  };

  // Icon mapping for our way items
  const ourWayIconMap = {
    zap: <Zap className="w-5 h-5 text-white" />,
    award: <Award className="w-5 h-5 text-white" />,
    star: <Star className="w-5 h-5 text-white" />,
    users: <Users className="w-5 h-5 text-white" />,
    check: <Check className="w-5 h-5 text-white" />,
    shield: <Shield className="w-5 h-5 text-white" />,
    fileText: <FileText className="w-5 h-5 text-white" />,
  };

  return (
    <div className="relative w-full py-20 overflow-hidden font-sans bg-gradient-to-b from-white to-sky-50">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-64 rounded-bl-full bg-gradient-to-br from-sky-100 to-blue-100 opacity-70 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 rounded-tr-full h-96 bg-gradient-to-tr from-teal-100 to-sky-100 opacity-60 blur-3xl"></div>

      {/* Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
               linear-gradient(to right, rgba(186, 230, 253, 0.2) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(186, 230, 253, 0.2) 1px, transparent 1px)
             `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0",
        }}
      ></div>

      {/* Floating Elements */}
      <div className="absolute w-16 h-16 rounded-full top-20 left-10 bg-sky-100 opacity-80 animate-float"></div>
      <div className="absolute w-24 h-24 bg-teal-100 rounded-full bottom-40 right-20 opacity-80 animate-float-delayed"></div>
      <div className="absolute w-12 h-12 bg-blue-100 rounded-full top-1/3 right-1/4 opacity-70 animate-pulse"></div>

      <div className="container relative z-10 px-4 mx-auto">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full shadow-sm bg-gradient-to-r from-sky-50 to-teal-50">
            <div className="flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-500">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {t.resumeservice.comparison.header.badge}
            </span>
          </div>

          <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-800 md:text-5xl">
            {t.resumeservice.comparison.header.title.prefix}{" "}
            <span className="relative">
              <span className="relative z-10 text-transparent bg-clip-text bg-[#38B6FF]">
                {t.resumeservice.comparison.header.title.highlight}
              </span>
              <span className="absolute left-0 w-full h-3 bg-teal-100 bottom-1 opacity-70 -z-10"></span>
            </span>{" "}
            {t.resumeservice.comparison.header.title.suffix}
          </h2>

          <p className="max-w-3xl mx-auto text-lg text-gray-600">
            {t.resumeservice.comparison.header.description}
          </p>
        </div>

        <div className="flex flex-col justify-center max-w-7xl gap-8 mx-auto md:flex-row">
          {/* Their Way */}
          <div className="w-full p-8 transition-all duration-500 transform bg-white border border-gray-100 shadow-lg md:w-1/2 rounded-2xl hover:shadow-xl">
            <div className="relative mb-8">
              <h3 className="pt-1 ml-6 text-2xl font-bold text-gray-800">
                {t.resumeservice.comparison.theirWay.title}
              </h3>
            </div>

            <div className="space-y-6">
              {t.resumeservice.comparison.theirWay.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 transition-all duration-300 rounded-lg hover:bg-red-50"
                >
                  <div className="p-2 mr-4 bg-red-100 rounded-full shadow-sm">
                    {theirWayIconMap[item.iconKey]}
                  </div>
                  <p className="font-medium text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="p-4 mt-8 border border-red-100 rounded-lg bg-red-50">
              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-red-100 rounded-full">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-800">
                    {t.resumeservice.comparison.theirWay.result.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t.resumeservice.comparison.theirWay.result.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Resumeble Way */}
          <div className="relative w-full p-8 transition-all duration-500 transform border-2 border-teal-400 shadow-xl md:w-1/2 bg-gradient-to-br from-white to-sky-50 rounded-2xl hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute z-20 px-4 py-2 font-bold text-white transform rounded-lg shadow-lg -top-5 -right-5 bg-[#38B6FF] rotate-3">
              {t.resumeservice.comparison.ourWay.badge}
            </div>

            <div className="relative mb-8">
              <div className="absolute flex items-center justify-center w-12 h-12 rounded-full -top-4 -left-4 bg-gradient-to-r from-[#38B6FF] to-sky-500">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="pt-1 ml-6 text-2xl font-bold text-transparent bg-clip-text bg-[#38B6FF] to-sky-500">
                {t.resumeservice.comparison.ourWay.title}
              </h3>
            </div>

            <div className="space-y-6">
              {t.resumeservice.comparison.ourWay.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 transition-all duration-300 rounded-lg hover:bg-sky-50"
                >
                  <div className="p-2 mr-4 rounded-full shadow-sm bg-gradient-to-r from-[#38B6FF] to-sky-400">
                    {ourWayIconMap[item.iconKey]}
                  </div>
                  <p className="font-medium text-gray-700">
                    {item.text}{" "}
                    <span className="font-bold text-transparent bg-clip-text bg-[#38B6FF]">
                      {item.highlight}
                    </span>{" "}
                    {item.postText}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 mt-8 border rounded-lg bg-gradient-to-r from-teal-50 to-sky-50 border-sky-100">
              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#38B6FF] to-sky-400">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-800">
                    {t.resumeservice.comparison.ourWay.result.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t.resumeservice.comparison.ourWay.result.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedResumeComparisonSection;
