import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FileText, ArrowRight, Sparkles } from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/resumeservice.json";
import trTranslations from "../../../public/locales/tr/resumeservice.json";
import frTranslations from "../../../public/locales/fr/resumeservice.json";
import deTranslations from "../../../public/locales/de/resumeservice.json";
import arTranslations from "../../../public/locales/ar/resumeservice.json";
import ruTranslations from "../../../public/locales/ru/resumeservice.json";
import faTranslations from "../../../public/locales/fa/resumeservice.json";

const ResumeServiceHero = () => {
  const router = useRouter();
  const { locale } = router;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

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

  // Animation effect for word rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(
        (prevIndex) =>
          (prevIndex + 1) % t.resumeservice.hero.animatedWords.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [t.resumeservice.hero.animatedWords.length]);

  return (
    <>
      {/* RESPONSIVE HERO SECTION - Full screen on desktop, scrollable on mobile */}
      <div className="relative pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute top-10 right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-sky-200/30 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-tr from-purple-200/30 to-sky-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-emerald-200/20 to-sky-200/20 rounded-full blur-2xl animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(14 165 233) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Single Container - Everything fits here */}
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
              {/* LEFT SIDE - Content */}
              <div className="space-y-6 lg:space-y-8 order-1 lg:order-1">
                {/* Badge */}
                <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-sky-100 border border-slate-200">
                  <Sparkles className="w-4 h-4 mr-2 text-sky-600" />
                  <span className="text-sm font-semibold text-sky-600">
                    ✨ Professional Resume Service
                  </span>
                  <div className="w-2 h-2 ml-3 rounded-full bg-green-500 animate-pulse"></div>
                </div>

                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                    <span className="text-gray-900">
                      {t.resumeservice.hero.headline.prefix}
                    </span>{" "}
                    <span className="relative inline-block min-w-[200px] sm:min-w-[280px] md:min-w-[350px] lg:min-w-[420px] xl:min-w-[500px]">
                      <span className="opacity-0">
                        {t.resumeservice.hero.animatedWords[0]}
                      </span>
                      <span className="absolute top-0 left-0">
                        <span className="font-extrabold text-transparent bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text animate-pulse">
                          {t.resumeservice.hero.animatedWords[currentWordIndex]}
                        </span>
                      </span>
                    </span>
                    <br />
                    <span className="text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                      {t.resumeservice.hero.headline.suffix}
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl font-medium">
                    {t.resumeservice.hero.description}
                  </p>
                </div>

                {/* CTA Section */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl blur opacity-20"></div>
                  <div className="relative p-6 sm:p-8 border shadow-2xl bg-white/95 backdrop-blur-sm border-white/50 rounded-3xl">
                    <a href="/resume-generator" className="block">
                      <button className="group relative w-full py-3 sm:py-4 px-6 font-bold text-white transition-all duration-300 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative flex items-center justify-center">
                          <FileText className="w-5 h-5 mr-2" />
                          <span className="mr-2">
                            {t.resumeservice.hero.cta.text}
                          </span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </button>
                    </a>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - Resume Service Showcase */}
              <div className="space-y-6 order-2 lg:order-2">
                {/* Services Header */}
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {t.resumeservice.showcase.title}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {t.resumeservice.showcase.subtitle}
                  </p>
                </div>

                {/* Resume Preview Mockup */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-purple-600 rounded-3xl blur opacity-10"></div>
                  <div className="relative p-6 sm:p-8 border shadow-2xl bg-white/90 backdrop-blur-sm border-white/50 rounded-3xl">
                    {/* Mini Resume Preview */}
                    <div className="p-4 sm:p-6 bg-white border-2 border-gray-200 shadow-sm rounded-2xl mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="w-24 sm:w-32 h-3 sm:h-4 mb-2 bg-gray-800 rounded"></div>
                          <div className="w-20 sm:w-24 h-2 sm:h-3 rounded bg-sky-500"></div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="w-16 sm:w-20 h-2 ml-auto bg-gray-300 rounded"></div>
                          <div className="w-12 sm:w-16 h-2 ml-auto bg-gray-300 rounded"></div>
                          <div className="w-14 sm:w-18 h-2 ml-auto bg-gray-300 rounded"></div>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <div className="w-12 sm:w-16 h-2 sm:h-3 mb-2 text-xs font-semibold rounded bg-sky-600"></div>
                          <div className="space-y-1">
                            <div className="w-full h-2 bg-gray-200 rounded"></div>
                            <div className="w-full h-2 bg-gray-200 rounded"></div>
                            <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                          </div>
                        </div>

                        <div>
                          <div className="w-16 sm:w-20 h-2 sm:h-3 mb-2 rounded bg-sky-600"></div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-sky-400"></div>
                            <div className="flex-1 space-y-1">
                              <div className="w-full h-2 bg-gray-200 rounded"></div>
                              <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-4">
                          <div className="flex-1">
                            <div className="w-10 sm:w-12 h-2 sm:h-3 mb-2 rounded bg-sky-600"></div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="w-8 sm:w-12 h-2 bg-gray-300 rounded"></div>
                                <div className="w-6 sm:w-8 h-1 rounded bg-sky-400"></div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="w-8 sm:w-10 h-2 bg-gray-300 rounded"></div>
                                <div className="w-4 sm:w-6 h-1 rounded bg-sky-400"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Features */}
                    <div className="p-4 sm:p-6 border bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200 rounded-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {t.resumeservice.showcase.features.map(
                          (feature, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <div
                                className={`w-2 h-2 ${feature.color} rounded-full flex-shrink-0`}
                              ></div>
                              <span className="text-xs sm:text-sm font-medium text-gray-700">
                                {feature.text}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeServiceHero;
