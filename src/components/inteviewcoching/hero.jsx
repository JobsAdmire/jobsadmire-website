import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Video,
  ArrowRight,
  MessageSquare,
  Award,
  Clock,
  Target,
  CheckCircle, // Not used in this component, but present in imports
  Star,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/interview.json";
import trTranslations from "../../../public/locales/tr/interview.json";
import arTranslations from "../../../public/locales/ar/interview.json";
import frTranslations from "../../../public/locales/fr/interview.json";
import deTranslations from "../../../public/locales/de/interview.json";
import faTranslations from "../../../public/locales/fa/interview.json";
import ruTranslations from "../../../public/locales/ru/interview.json";

const InterviewCoachingHero = () => {
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
      case "ru": // Corrected duplicate 'ar' case
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
        (prevIndex) => (prevIndex + 1) % t.interview.hero.animatedWords.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [t.interview.hero.animatedWords.length]);

  // Icon mapping for coaching features (kept for reference, but changing approach for consistency)
  // const featureIconMap = {
  //   messageSquare: <MessageSquare className="w-6 h-6 text-white" />,
  //   target: <Target className="w-6 h-6 text-white" />,
  //   clock: <Clock className="w-6 h-6 text-white" />,
  //   award: <Award className="w-6 h-6 text-white" />
  // };

  return (
    // Outer div: Apply full screen height and overflow hidden for consistent hero section
    <div className="relative pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-10 right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-sky-200/30 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>{" "}
        {/* Adjusted sizes */}
        <div className="absolute bottom-10 left-10 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-tr from-purple-200/30 to-sky-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>{" "}
        {/* Adjusted sizes */}
        <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-2xl animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2"></div>{" "}
        {/* Adjusted sizes and added transform */}
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(56 182 255) 1px, transparent 0)`, // Matched color with the original code's stroke
          backgroundSize: "40px 40px", // Consistent grid size
        }}
      ></div>

      {/* Main Content Container: Apply flex for vertical centering and max-width wrapper */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="w-full max-w-7xl mx-auto">
          {/* Grid Layout: Ensure vertical alignment on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
            {/* LEFT SIDE - Content */}
            <div className="space-y-6 lg:space-y-8 order-1 lg:order-1">
              {/* Status Badge */}
              <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-sky-100 border border-slate-200">
                {" "}
                {/* Matched styling with ResumeServiceHero */}
                <Star className="w-4 h-4 mr-2 text-sky-600" />{" "}
                {/* Consistent icon size and color */}
                <span className="text-sm font-semibold text-sky-600">
                  {t.interview.hero.badge}
                </span>{" "}
                {/* Consistent font size and color */}
                <div className="w-2 h-2 ml-3 rounded-full bg-green-500 animate-pulse"></div>{" "}
                {/* Consistent pulse indicator */}
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  {" "}
                  {/* Consistent font sizes */}
                  <span className="text-gray-900">
                    {t.interview.hero.headline.prefix}
                  </span>{" "}
                  <span className="relative inline-block min-w-[200px] sm:min-w-[280px] md:min-w-[350px] lg:min-w-[420px] xl:min-w-[500px]">
                    {" "}
                    {/* Consistent min-width */}
                    <span className="opacity-0">
                      {t.interview.hero.animatedWords[0]}
                    </span>
                    <span className="absolute top-0 left-0">
                      <span className="font-extrabold text-transparent bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text animate-pulse">
                        {" "}
                        {/* Consistent gradient */}
                        {t.interview.hero.animatedWords[currentWordIndex]}
                      </span>
                    </span>
                  </span>
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                    {" "}
                    {/* Consistent gradient */}
                    {t.interview.hero.headline.suffix}
                  </span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl font-medium">
                  {" "}
                  {/* Consistent text sizes and max-width */}
                  {t.interview.hero.description}
                </p>
              </div>

              {/* CTA Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl blur opacity-20"></div>{" "}
                {/* Consistent gradient */}
                <div className="relative p-6 sm:p-8 border shadow-2xl bg-white/95 backdrop-blur-sm border-white/50 rounded-3xl">
                  {" "}
                  {/* Consistent padding and styling */}
                  <a href="/contact-us" className="block">
                    <button className="group relative w-full py-3 sm:py-4 px-6 font-bold text-white transition-all duration-300 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                      {" "}
                      {/* Consistent styling */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="relative flex items-center justify-center">
                        <Video className="w-5 h-5 mr-2" />
                        <span className="mr-2">
                          {t.interview.hero.cta.text}
                        </span>{" "}
                        {/* Wrapped text in span for consistency */}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Interview Coaching Showcase */}
            <div className="space-y-6 order-2 lg:order-2">
              {" "}
              {/* Consistent spacing and order */}
              {/* Interview Coaching Showcase Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-purple-600 rounded-3xl blur opacity-10"></div>{" "}
                {/* Consistent gradient */}
                <div className="relative p-6 sm:p-8 border shadow-2xl bg-white/90 backdrop-blur-sm border-white/50 rounded-3xl">
                  {" "}
                  {/* Consistent padding and styling */}
                  {/* Header */}
                  <div className="text-center mb-6 sm:mb-8">
                    {" "}
                    {/* Consistent margin-bottom */}
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {" "}
                      {/* Consistent font sizes and color */}
                      {t.interview.showcase.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      {t.interview.showcase.subtitle}
                    </p>{" "}
                    {/* Consistent text sizes */}
                  </div>
                  {/* Simple Content */}
                  <div className="space-y-6">
                    {/* Video Interview Visual */}
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl">
                      {" "}
                      {/* Consistent padding, gradient, border */}
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <div className="w-32 h-20 bg-gradient-to-r from-sky-200 to-blue-200 rounded-2xl flex items-center justify-center">
                            <Video className="w-16 h-16 text-sky-600" />{" "}
                            {/* Consistent icon color */}
                          </div>
                          {/* Recording indicator */}
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          {/* Progress indicators */}
                          <div className="absolute -bottom-1 left-1/4 w-3 h-3 bg-green-500 rounded-full animate-pulse delay-300"></div>
                          <div className="absolute top-1/2 -left-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-600"></div>
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <div className="text-lg font-semibold text-gray-800 mb-2">
                          {t.interview.showcase.mockInterview.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t.interview.showcase.mockInterview.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Coaching Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {" "}
                      {/* Consistent grid and gap */}
                      {t.interview.showcase.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-4 bg-white/60 rounded-2xl border border-white/50"
                        >
                          {" "}
                          {/* Consistent styling */}
                          <div
                            className={`w-2 h-2 ${feature.color} rounded-full flex-shrink-0`}
                          ></div>{" "}
                          {/* Using color from data for consistency */}
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {feature.text}
                          </span>{" "}
                          {/* Consistent font sizes */}
                        </div>
                      ))}
                    </div>

                    {/* Success Stats */}
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl">
                      {" "}
                      {/* Consistent padding, gradient, border */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        {t.interview.showcase.stats.map((stat, index) => (
                          <div key={index}>
                            <div
                              className={`text-xl sm:text-2xl font-bold ${stat.color} mb-1`}
                            >
                              {stat.value}
                            </div>{" "}
                            {/* Consistent font sizes */}
                            <div className="text-xs sm:text-sm text-gray-600">
                              {stat.label}
                            </div>{" "}
                            {/* Consistent font sizes */}
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
    </div>
  );
};

export default InterviewCoachingHero;
