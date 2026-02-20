import React from "react";
import { useRouter } from "next/router";
import {
  Briefcase,
  CheckCircle,
  HelpCircle,
  Award,
  Compass,
  FileQuestion,
  Target,
  Clock,
  DollarSign,
  MapPin,
  Heart,
  PenTool,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/careercounselling.json";
import trTranslations from "../../../public/locales/tr/careercounselling.json";
import arTranslations from "../../../public/locales/ar/careercounselling.json";
import frTranslations from "../../../public/locales/fr/careercounselling.json";
import deTranslations from "../../../public/locales/de/careercounselling.json";
import ruTranslations from "../../../public/locales/ru/careercounselling.json";
import faTranslations from "../../../public/locales/fa/careercounselling.json";
const CareerCounsellingAdditionalSections = () => {
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "ar":
        return arTranslations;
      case "fa":
        return faTranslations;
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

  return (
    <div className="font-sans bg-gradient-to-b from-white to-sky-50">
      {/* Why to choose Transformation section */}
      <section className="px-4 py-16 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute w-64 h-64 rounded-full -z-10 top-20 right-20 bg-sky-100 opacity-30 blur-3xl"></div>

          <div className="grid items-center grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl">
                {t.careercounselling.whyChoose.title.prefix}{" "}
                <span className="relative text-[#38B6FF]">
                  {" "}
                  <br />
                  {t.careercounselling.whyChoose.title.highlight}
                  <div className="absolute w-full h-3 bg-sky-100 bottom-1 -z-10"></div>
                </span>{" "}
                <br />
                {t.careercounselling.whyChoose.title.suffix}
              </h2>

              <p className="mb-8 text-lg text-gray-700">
                {t.careercounselling.whyChoose.description}
              </p>

              <div className="space-y-4">
                {t.careercounselling.whyChoose.features.map(
                  (feature, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 transition-all bg-white border shadow-sm rounded-xl hover:shadow-md border-sky-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 rounded-full bg-sky-100 text-[#38B6FF]">
                        {index === 0 && <CheckCircle className="w-5 h-5" />}
                        {index === 1 && <Award className="w-5 h-5" />}
                        {index === 2 && <Target className="w-5 h-5" />}
                        {index === 3 && <Briefcase className="w-5 h-5" />}
                      </div>
                      <div className="text-gray-700">{feature}</div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-8">
                <a href="/contact-us">
                  <button className="inline-flex items-center px-6 py-3 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] hover:shadow-lg hover:-translate-y-1">
                    <span>{t.careercounselling.whyChoose.cta.text}</span>
                    <Compass className="w-4 h-4 ml-2" />
                  </button>
                </a>
              </div>
            </div>

            <div className="relative h-full">
              {/* Enhanced decorative background layers */}
              <div className="absolute inset-0 transform scale-105 opacity-50 bg-gradient-to-tr from-sky-100 via-blue-50 to-blue-100 rounded-3xl rotate-3"></div>
              <div className="absolute inset-0 transform scale-95 bg-gradient-to-bl from-sky-200 to-blue-200 opacity-30 rounded-3xl -rotate-3"></div>
              <div className="absolute inset-0 transform border-2 border-sky-200/60 rounded-3xl -rotate-2"></div>
              <div className="absolute inset-0 transform bg-gradient-to-r from-sky-50 to-blue-50 opacity-20 rounded-3xl rotate-1 scale-102"></div>

              {/* Main image container with enhanced styling */}
              <div className="relative z-10 overflow-hidden shadow-2xl rounded-3xl group h-full min-h-[500px] lg:min-h-[600px]">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt={t.careercounselling.whyChoose.image.alt}
                  className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />

                {/* Enhanced gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-sky-100/10 to-blue-200/20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choosing a career and How can counselling help section */}
      <section className="px-4 py-16 mx-auto sm:px-6 lg:px-8 max-w-7xl bg-gradient-to-b from-sky-50/50 to-white">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Choosing a career column */}
          <div className="relative">
            <div className="absolute w-40 h-40 rounded-full -z-10 top-10 right-10 bg-sky-100 opacity-40 blur-xl"></div>

            <div className="relative z-10 p-8 bg-white border shadow-xl rounded-2xl border-sky-100">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 to-blue-500 rounded-t-2xl"></div>

              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-xl bg-sky-100 text-sky-600">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {t.careercounselling.choosingCareer.title}
                </h2>
              </div>

              <p className="mb-6 text-gray-700">
                {t.careercounselling.choosingCareer.description}
              </p>

              <div className="mt-6 space-y-4">
                {t.careercounselling.choosingCareer.questions.map(
                  (question, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-100">
                          <FileQuestion className="w-3 h-3 text-sky-600" />
                        </div>
                      </div>
                      <div className="ml-3 text-gray-700">{question}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* How can career counselling help column */}
          <div className="relative">
            <div className="absolute w-40 h-40 bg-blue-100 rounded-full -z-10 bottom-10 left-10 opacity-40 blur-xl"></div>

            <div className="relative z-10 p-8 bg-white border shadow-xl rounded-2xl border-sky-100">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-sky-400 rounded-t-2xl"></div>

              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 mr-4 text-blue-600 bg-blue-100 rounded-xl">
                  <Compass className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {t.careercounselling.howCounsellingHelps.title}
                </h2>
              </div>

              <p className="mb-6 text-gray-700">
                {t.careercounselling.howCounsellingHelps.description}
              </p>

              <div className="mb-6">
                <div className="mb-3 font-semibold text-gray-800">
                  {t.careercounselling.howCounsellingHelps.sessionTopics.title}
                </div>

                <div className="space-y-4">
                  {t.careercounselling.howCounsellingHelps.sessionTopics.items.map(
                    (topic, index) => (
                      <div
                        key={index}
                        className="flex items-start p-3 rounded-lg bg-sky-50"
                      >
                        <div className="flex-shrink-0 mr-3">
                          <CheckCircle className="w-5 h-5 text-sky-600" />
                        </div>
                        <div className="text-gray-700">{topic}</div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 mt-6 rounded-lg bg-blue-50">
                <div className="text-gray-700">
                  <span className="block font-medium text-blue-600">
                    {
                      t.careercounselling.howCounsellingHelps
                        .professionalGuidance.title
                    }
                  </span>
                  {
                    t.careercounselling.howCounsellingHelps.professionalGuidance
                      .description
                  }
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="flex items-center justify-center w-12 h-12 text-white bg-blue-500 rounded-full">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerCounsellingAdditionalSections;
