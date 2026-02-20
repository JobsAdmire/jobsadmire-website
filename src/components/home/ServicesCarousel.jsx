import React, { useState, useEffect, useCallback } from "react";
// Updated imports - using more standard icon names
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  MessageCircle,
  TrendingUp,
  Plane,
  BookOpen,
  Monitor,
  Users,
  Building,
  Play,
  Pause,
  ArrowRight,
  CheckCircle,
  Award,
} from "lucide-react";
import { useTranslation } from "next-i18next";

const ServicesCarousel = () => {
  const { t } = useTranslation("common");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const services = [
    {
      id: 1,
      titleKey: "resumeWriting.title",
      subtitleKey: "resumeWriting.subtitle",
      descriptionKey: "resumeWriting.description",
      featuresKey: "resumeWriting.features",
      ctaPrimaryKey: "resumeWriting.ctaPrimary",
      icon: <FileText className="w-8 h-8" />,
      primaryColor: "custom",
      image: "📄",
      link: "/services/resume-service",
    },
    {
      id: 2,
      titleKey: "globalJobPlacement.title",
      subtitleKey: "globalJobPlacement.subtitle",
      descriptionKey: "globalJobPlacement.description",
      featuresKey: "globalJobPlacement.features",
      ctaPrimaryKey: "globalJobPlacement.ctaPrimary",
      icon: <Globe className="w-8 h-8" />,
      primaryColor: "custom",
      image: "🌍",
      link: "/services/global-job-placement",
    },
    {
      id: 3,
      titleKey: "interviewCoaching.title",
      subtitleKey: "interviewCoaching.subtitle",
      descriptionKey: "interviewCoaching.description",
      featuresKey: "interviewCoaching.features",
      ctaPrimaryKey: "interviewCoaching.ctaPrimary",
      icon: <MessageCircle className="w-8 h-8" />,
      primaryColor: "custom",
      image: "🎯",
      link: "/services/interview-coaching-service",
    },
    {
      id: 4,
      titleKey: "careerCounselling.title",
      subtitleKey: "careerCounselling.subtitle",
      descriptionKey: "careerCounselling.description",
      featuresKey: "careerCounselling.features",
      ctaPrimaryKey: "careerCounselling.ctaPrimary",
      icon: <TrendingUp className="w-8 h-8" />,
      primaryColor: "custom",
      image: "🎯",
      link: "/services/career-counselling",
    },
    {
      id: 5,
      titleKey: "visaSupport.title",
      subtitleKey: "visaSupport.subtitle",
      descriptionKey: "visaSupport.description",
      featuresKey: "visaSupport.features",
      ctaPrimaryKey: "visaSupport.ctaPrimary",
      icon: <Plane className="w-8 h-8" />,
      primaryColor: "custom",
      image: "✈️",
      link: "/services/visa",
    },
    {
      id: 6,
      titleKey: "skillDevelopment.title",
      subtitleKey: "skillDevelopment.subtitle",
      descriptionKey: "skillDevelopment.description",
      featuresKey: "skillDevelopment.features",
      ctaPrimaryKey: "skillDevelopment.ctaPrimary",
      icon: <BookOpen className="w-8 h-8" />,
      primaryColor: "custom",
      image: "📚",
      link: "/services/skill-development-training",
    },
    {
      id: 7,
      titleKey: "remoteWork.title",
      subtitleKey: "remoteWork.subtitle",
      descriptionKey: "remoteWork.description",
      featuresKey: "remoteWork.features",
      ctaPrimaryKey: "remoteWork.ctaPrimary",
      icon: <Monitor className="w-8 h-8" />,
      primaryColor: "custom",
      image: "💻",
      link: "/services/remote-work-opportunity",
    },
    {
      id: 8,
      titleKey: "talentAcquisition.title",
      subtitleKey: "talentAcquisition.subtitle",
      descriptionKey: "talentAcquisition.description",
      featuresKey: "talentAcquisition.features",
      ctaPrimaryKey: "talentAcquisition.ctaPrimary",
      icon: <Users className="w-8 h-8" />,
      primaryColor: "custom",
      image: "👥",
      link: "/services/talent-acquisition-process",
    },
    {
      id: 9,
      titleKey: "immigrationConsultation.title",
      subtitleKey: "immigrationConsultation.subtitle",
      descriptionKey: "immigrationConsultation.description",
      featuresKey: "immigrationConsultation.features",
      ctaPrimaryKey: "immigrationConsultation.ctaPrimary",
      icon: <Building className="w-8 h-8" />,
      primaryColor: "custom",
      image: "🏠",
      link: "/services/immigration",
    },
    {
      id: 10,
      titleKey: "jobRecruitment.title",
      subtitleKey: "jobRecruitment.subtitle",
      descriptionKey: "jobRecruitment.description",
      featuresKey: "jobRecruitment.features",
      ctaPrimaryKey: "jobRecruitment.ctaPrimary",
      icon: <Users className="w-8 h-8" />,
      primaryColor: "custom",
      image: "🤝",
      link: "/job-recruitment",
    },
  ];

  // Custom theme colors using #38B6FF
  const colorMap = {
    custom: {
      primary: "bg-[#38B6FF]",
      light: "bg-[#38B6FF]/5",
      border: "border-[#38B6FF]/20",
      text: "text-[#38B6FF]",
      hover: "hover:bg-[#2BA3EC]",
      gradient: "from-[#38B6FF] to-[#2BA3EC]",
    },
  };

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % services.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [services.length, isTransitioning]);

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === " ") {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAutoPlaying, nextSlide]);

  const currentService = services[currentSlide];
  const currentColors = colorMap[currentService.primaryColor];

  // Add error boundary for missing translations
  const safeTranslate = (key, options = {}) => {
    try {
      const result = t(key, options);
      return result || key; // Fallback to key if translation is missing
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-16 px-4">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <div className="inline-flex items-center space-x-2 mb-4">
          <Award className="w-6 h-6 text-[#38B6FF]" />
          <span className="text-[#38B6FF] font-semibold text-sm uppercase tracking-wide">
            {safeTranslate("servicesCarousel.header.badge")}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {safeTranslate("servicesCarousel.header.title")}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {safeTranslate("servicesCarousel.header.description")}
        </p>
      </div>

      {/* Main Carousel */}
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
          {/* Content Area */}
          <div className="relative h-[600px] md:h-[550px]">
            {services.map((service, index) => {
              // Get translated content for current service with safe fallbacks
              const title = safeTranslate(
                `servicesCarousel.services.${service.titleKey}`
              );
              const subtitle = safeTranslate(
                `servicesCarousel.services.${service.subtitleKey}`
              );
              const description = safeTranslate(
                `servicesCarousel.services.${service.descriptionKey}`
              );
              const features = safeTranslate(
                `servicesCarousel.services.${service.featuresKey}`,
                { returnObjects: true }
              );
              const ctaPrimary = safeTranslate(
                `servicesCarousel.services.${service.ctaPrimaryKey}`
              );

              // Ensure features is an array
              const featuresArray = Array.isArray(features) ? features : [];

              return (
                <div
                  key={service.id}
                  className={`absolute inset-0 transition-all duration-500 ease-out ${
                    index === currentSlide
                      ? "opacity-100 translate-x-0"
                      : index < currentSlide
                        ? "opacity-0 -translate-x-full"
                        : "opacity-0 translate-x-full"
                  }`}
                >
                  <div className="grid md:grid-cols-2 h-full">
                    {/* Content Side */}
                    <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                      {/* Badge and Service Info */}
                      <div className="space-y-4">
                        {/* Icon and Title */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                              {title}
                            </h3>
                            <p
                              className={`text-lg font-semibold ${currentColors.text}`}
                            >
                              {subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {description}
                      </p>

                      {/* Features Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {featuresArray.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                          >
                            <CheckCircle
                              className={`w-5 h-5 ${currentColors.text} flex-shrink-0`}
                            />
                            <span className="text-gray-700 font-medium text-sm">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <a
                          href={service.link}
                          className={`group px-8 py-4 bg-gradient-to-r ${currentColors.gradient} ${currentColors.hover} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-[#38B6FF]/30 no-underline`}
                          aria-label={`Navigate to ${title} service page`}
                        >
                          <span>{ctaPrimary}</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </a>
                      </div>
                    </div>

                    {/* Visual Side */}
                    <div
                      className={`${currentColors.light} relative flex items-center justify-center p-8 md:p-12`}
                    >
                      {/* Main Visual Container */}
                      <div className="relative">
                        {/* Animated Background Rings */}
                        <div
                          className={`w-80 h-80 ${currentColors.border} border-2 border-dashed rounded-full flex items-center justify-center animate-spin-slow`}
                        >
                          <div
                            className={`w-64 h-64 bg-white rounded-full shadow-xl flex items-center justify-center border ${currentColors.border}`}
                          >
                            <div className="w-48 h-48 bg-gradient-to-br from-white to-gray-50 rounded-full shadow-inner flex items-center justify-center">
                              <div className="text-8xl filter drop-shadow-lg">
                                {service.image}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Floating Elements */}
                        <div
                          className={`absolute -top-4 -left-4 w-8 h-8 ${currentColors.primary} rounded-full shadow-lg animate-bounce`}
                          style={{ animationDelay: "0s" }}
                        ></div>
                        <div
                          className={`absolute -bottom-4 -right-4 w-6 h-6 ${currentColors.primary} rounded-full shadow-lg animate-bounce`}
                          style={{ animationDelay: "1s" }}
                        ></div>
                        <div
                          className={`absolute top-1/2 -left-6 w-4 h-4 ${currentColors.primary} rounded-full shadow-lg animate-bounce`}
                          style={{ animationDelay: "2s" }}
                        ></div>
                        <div
                          className={`absolute top-1/4 -right-8 w-5 h-5 ${currentColors.primary} rounded-full shadow-lg animate-bounce`}
                          style={{ animationDelay: "3s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-xl transition-all duration-300 disabled:opacity-50 z-10 group"
            aria-label={safeTranslate("servicesCarousel.navigation.previous")}
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform duration-300" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-xl transition-all duration-300 disabled:opacity-50 z-10 group"
            aria-label={safeTranslate("servicesCarousel.navigation.next")}
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>

        {/* Enhanced Bottom Controls */}
        <div className="flex items-center justify-between mt-8">
          {/* Pagination Dots */}
          <div className="flex items-center space-x-2">
            {services.map((service, index) => {
              const serviceTitle = safeTranslate(
                `servicesCarousel.services.${service.titleKey}`
              );
              return (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`group relative transition-all duration-300 ${
                    index === currentSlide ? "w-10 h-3" : "w-3 h-3 hover:w-5"
                  }`}
                  aria-label={`${safeTranslate("servicesCarousel.navigation.goTo")} ${serviceTitle}`}
                  title={serviceTitle}
                >
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? `bg-gradient-to-r ${colorMap.custom.gradient} shadow-lg`
                        : "bg-gray-300 group-hover:bg-gray-400 shadow-md"
                    }`}
                  />
                  {index === currentSlide && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${colorMap.custom.gradient} rounded-full blur-sm opacity-50 animate-pulse`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Auto-play Control and Counter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 font-medium">
              {currentSlide + 1}{" "}
              {safeTranslate("servicesCarousel.navigation.counter")}{" "}
              {services.length}
            </span>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                isAutoPlaying
                  ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
              aria-label={
                isAutoPlaying
                  ? safeTranslate("servicesCarousel.navigation.pause")
                  : safeTranslate("servicesCarousel.navigation.resume")
              }
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {safeTranslate("servicesCarousel.navigation.autoPlay")}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {safeTranslate("servicesCarousel.navigation.play")}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${currentColors.gradient} transition-all duration-500 ease-out shadow-lg relative overflow-hidden`}
            style={{
              width: `${((currentSlide + 1) / services.length) * 100}%`,
            }}
          >
            <div className="absolute inset-0 bg-white/30 animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%,
          100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
};

export default ServicesCarousel;
