import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Globe,
  ArrowRight,
  MapPin,
  Briefcase,
  Search, // Not used in this component, but present in imports
  Users,
  ExternalLink,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/globaljobs.json";
import trTranslations from "../../../public/locales/tr/globaljobs.json";
import arTranslations from "../../../public/locales/ar/globaljobs.json";
import frTranslations from "../../../public/locales/fr/globaljobs.json";
import deTranslations from "../../../public/locales/de/globaljobs.json";
import ruTranslations from "../../../public/locales/ru/globaljobs.json";
import faTranslations from "../../../public/locales/fa/globaljobs.json";

const GlobalJobPlacementHero = () => {
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
      case "ru":
        return ruTranslations;
      case "de":
        return deTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  // Animation effect for word rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(
        (prevIndex) => (prevIndex + 1) % t.globaljob.hero.animatedWords.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [t.globaljob.hero.animatedWords.length]);

  // Icon mapping for benefits
  const benefitIconMap = {
    briefcase: <Briefcase className="w-6 h-6 text-white" />,
    users: <Users className="w-6 h-6 text-white" />,
    mapPin: <MapPin className="w-6 h-6 text-white" />,
    externalLink: <ExternalLink className="w-6 h-6 text-white" />,
  };

  return (
    // Outer div: Apply full screen height and overflow hidden
    <div className="relative pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-sky-200/20 to-emerald-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 60L60 0M0 0L60 60" stroke="#10B981" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Content Container: Apply flex for vertical centering */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        {" "}
        {/* Adjusted classes here */}
        <div className="w-full max-w-7xl mx-auto">
          {" "}
          {/* Added this wrapper div for max-width control */}
          {/* Grid Layout: Ensure vertical alignment on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
            {" "}
            {/* Adjusted items-start/items-center and height classes */}
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8 order-1 lg:order-1">
              {" "}
              {/* Consistent spacing */}
              <div className="space-y-4">
                {/* Main Headline */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  {" "}
                  {/* Adjusted font sizes to match ResumeServiceHero better for consistency */}
                  <span className="text-gray-900">
                    {t.globaljob.hero.headline.prefix}
                  </span>{" "}
                  <span className="relative inline-block min-w-[200px] sm:min-w-[280px] md:min-w-[350px] lg:min-w-[420px] xl:min-w-[500px]">
                    {" "}
                    {/* Adjusted min-width for consistency */}
                    <span className="opacity-0">
                      {t.globaljob.hero.animatedWords[0]}
                    </span>
                    <span className="absolute top-0 left-0">
                      <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent font-extrabold animate-pulse">
                        {" "}
                        {/* Adjusted gradient to match ResumeServiceHero */}
                        {t.globaljob.hero.animatedWords[currentWordIndex]}
                      </span>
                    </span>
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {t.globaljob.hero.headline.suffix}
                  </span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl font-medium">
                  {" "}
                  {/* Adjusted text sizes and added max-w-2xl */}
                  {t.globaljob.hero.description}
                </p>
              </div>
              {/* CTA Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl blur opacity-20"></div>{" "}
                {/* Adjusted gradient to match ResumeServiceHero */}
                <div className="relative bg-white/95 backdrop-blur-sm border border-white/50 shadow-2xl rounded-3xl p-6 sm:p-8">
                  {" "}
                  {/* Adjusted padding */}
                  <a href="/job" className="block">
                    <button className="group relative w-full py-3 sm:py-4 px-6 font-bold text-white transition-all duration-300 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                      {" "}
                      {/* Adjusted gradient, hover, and translateY */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="relative flex items-center justify-center">
                        <Globe className="w-5 h-5 mr-2" />
                        <span className="mr-2">
                          {t.globaljob.hero.cta.text}
                        </span>{" "}
                        {/* Added span to wrap text, consistent with ResumeServiceHero */}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />{" "}
                        {/* Adjusted margin and transition */}
                      </div>
                    </button>
                  </a>
                </div>
              </div>
            </div>
            {/* Right Content - Simple Global Service Showcase */}
            <div className="space-y-6 order-2 lg:order-2">
              {" "}
              {/* Consistent spacing and order */}
              {/* Simple Service Showcase Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-purple-600 rounded-3xl blur opacity-10"></div>{" "}
                {/* Adjusted gradient to match ResumeServiceHero */}
                <div className="relative bg-white/90 backdrop-blur-sm border border-white/50 shadow-2xl rounded-3xl p-6 sm:p-8">
                  {" "}
                  {/* Adjusted padding */}
                  {/* Header */}
                  <div className="text-center mb-6 sm:mb-8">
                    {" "}
                    {/* Adjusted margin-bottom */}
                    <h2 className="mb-2 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {" "}
                      {/* Adjusted font size and removed gradient from text, consistent with ResumeServiceHero */}
                      {t.globaljob.showcase.title}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {t.globaljob.showcase.subtitle}
                    </p>{" "}
                    {/* Adjusted text size */}
                  </div>
                  {/* Simple Content */}
                  <div className="space-y-6">
                    {/* World Map Visual */}
                    <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-4 sm:p-6">
                      {" "}
                      {/* Adjusted gradient, border, and padding */}
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <div className="w-32 h-20 bg-gradient-to-r from-sky-200 to-blue-200 rounded-2xl flex items-center justify-center">
                            {" "}
                            {/* Adjusted gradient */}
                            <Globe className="w-16 h-16 text-sky-600" />{" "}
                            {/* Adjusted text color */}
                          </div>
                          {/* Floating location pins */}
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="absolute top-1/2 -left-3 w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                          <div className="absolute -bottom-1 left-1/3 w-3 h-3 bg-green-500 rounded-full animate-pulse delay-600"></div>
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <div className="text-lg font-semibold text-gray-800 mb-2">
                          {t.globaljob.showcase.worldMap.countries}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t.globaljob.showcase.worldMap.description}
                        </div>
                      </div>
                    </div>

                    {/* Key Benefits */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {" "}
                      {/* Adjusted grid columns and gap to match ResumeServiceHero features */}
                      {t.globaljob.showcase.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="text-left p-4 bg-white/60 rounded-2xl border border-white/50 flex items-start space-x-3"
                        >
                          {" "}
                          {/* Adjusted alignment and added flex/items-start */}
                          <div
                            className={`w-2 h-2 ${benefit.color} rounded-full flex-shrink-0 mt-2`}
                          ></div>{" "}
                          {/* Adjusted sizing and added color from data, removed icon map */}
                          <div>
                            <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                              {benefit.title}
                            </div>{" "}
                            {/* Adjusted font size */}
                            <div className="text-xs sm:text-sm text-gray-600">
                              {benefit.description}
                            </div>{" "}
                            {/* Adjusted font size */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalJobPlacementHero;
