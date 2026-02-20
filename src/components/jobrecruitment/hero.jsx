import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowRight, Briefcase, Search, Users } from "lucide-react"; // Added icons for potential future use or consistency

// Import your translation files
import enTranslations from "../../../public/locales/en/jobrecruitmenthero.json";
import trTranslations from "../../../public/locales/tr/jobrecruitmenthero.json";
import frTranslations from "../../../public/locales/fr/jobrecruitmenthero.json";
import deTranslations from "../../../public/locales/de/jobrecruitmenthero.json";
import arTranslations from "../../../public/locales/ar/jobrecruitmenthero.json";
import ruTranslations from "../../../public/locales/ru/jobrecruitmenthero.json";
import faTranslations from "../../../public/locales/fa/jobrecruitmenthero.json";

const SimplifiedJobRecruitmentHeroSection = () => {
  const router = useRouter();
  const { locale } = router;

  // Animation reveal state (kept for subtle entry animation)
  const [isVisible, setIsVisible] = useState(false);

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

  // Animation for page load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    // Outer div: Apply full screen height and overflow hidden for consistent hero section
    <div
      className={`relative pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] overflow-hidden transition-all duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0 translate-y-10"}`}
    >
      {/* Enhanced Background Elements (consistent across heroes) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-10 right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-sky-200/30 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-tr from-purple-200/30 to-sky-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-2xl animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Subtle grid pattern (updated stroke color for consistency) */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(14 165 233) 1px, transparent 0)`, // sky-500
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Main Content Container: Apply flex for vertical centering and max-width wrapper */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="w-full max-w-7xl mx-auto">
          {/* Grid Layout: Ensure vertical alignment on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
            {/* LEFT SIDE - Content */}
            <div
              className={`space-y-6 lg:space-y-8 order-1 lg:order-1 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
            >
              {/* Main Headline (consistent font sizes, and gradient) */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="text-gray-900">
                    {t.jobrecruitmenthero.headline.line1}
                  </span>{" "}
                  <span className="font-extrabold text-transparent bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text">
                    {t.jobrecruitmenthero.headline.highlight}
                  </span>
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                    {t.jobrecruitmenthero.headline.line2}
                  </span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl font-medium">
                  {t.jobrecruitmenthero.description}
                </p>
              </div>

              {/* CTA Section (consistent padding, gradients, and hover effects) */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl blur opacity-20"></div>
                <div className="relative p-6 sm:p-8 border shadow-2xl bg-white/95 backdrop-blur-sm border-white/50 rounded-3xl">
                  <a href="/contact-us" className="block">
                    <button className="group relative w-full py-3 sm:py-4 px-6 font-bold text-white transition-all duration-300 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="relative flex items-center justify-center">
                        <Briefcase className="w-5 h-5 mr-2" />{" "}
                        {/* Example icon, adjust as needed */}
                        <span className="mr-2">
                          {t.jobrecruitmenthero.cta.text}
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Image Showcase */}
            <div
              className={`space-y-6 order-2 lg:order-2 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              <div className="relative p-6 sm:p-8 border shadow-2xl bg-white/90 backdrop-blur-sm border-white/50 rounded-3xl">
                <div className="relative overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50">
                  <img
                    src={t.jobrecruitmenthero.image.src}
                    alt={t.jobrecruitmenthero.image.alt}
                    className="object-cover w-full h-auto rounded-2xl" // Ensure image fills container and maintains aspect ratio
                  />
                  {/* Optional: Add an overlay or subtle elements on the image if desired for consistency */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-900/10 via-sky-700/5 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedJobRecruitmentHeroSection;
