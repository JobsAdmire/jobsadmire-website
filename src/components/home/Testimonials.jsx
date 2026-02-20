import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  Shield,
  Award,
  CheckCircle,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "next-i18next";

const CompactTestimonials = () => {
  const { t } = useTranslation("common");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [direction, setDirection] = useState("next");

  // Get testimonials from translations
  const testimonialData = t("testimonials.testimonialsList", {
    returnObjects: true,
  });
  const stats = t("testimonials.stats", { returnObjects: true });

  // Combine translation data with static data (images, metrics, etc.)
  const testimonials = [
    {
      ...testimonialData[0],
      rating: 5,
      profileImage: "/images/bd.jpg",
      metric: "100%",
      metricLabel: stats.retention || "Retention",
    },
    {
      ...testimonialData[1],
      rating: 5,
      profileImage: "/images/bd3.jpg",
      metric: "15+",
      metricLabel: stats.years || "Years",
    },
    {
      ...testimonialData[2],
      rating: 5,
      profileImage: "/images/mk.jpg",
      metric: "500+",
      metricLabel: stats.hires || "Hires",
    },
    {
      ...testimonialData[3],
      rating: 5,
      profileImage: "/images/bd11.jpg",
      metric: "98%",
      metricLabel: stats.retention || "Retention",
    },
    {
      ...testimonialData[4],
      rating: 5,
      profileImage: "/images/aliraza.jpg",
      metric: "24/7",
      metricLabel: stats.support || "Support",
    },
    {
      ...testimonialData[5],
      rating: 5,
      profileImage: "/images/bd9.jpg",
      metric: "10+",
      metricLabel: stats.years || "Years",
    },
  ];

  useEffect(() => {
    const interval = !hovering
      ? setInterval(() => {
          handleNext();
        }, 5000)
      : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeIndex, hovering]);

  const handlePrev = () => {
    if (isAnimating) return;
    setDirection("prev");
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setDirection("next");
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div
      className="relative py-8 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 bg-gradient-to-br from-sky-300/20 to-blue-400/20 rounded-full blur-3xl -top-32 -left-32"></div>
        <div className="absolute w-64 h-64 bg-gradient-to-br from-blue-300/20 to-sky-400/20 rounded-full blur-3xl -bottom-32 -right-32"></div>
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
              {t("testimonials.header.title")}
            </span>
          </h2>
          <p className="max-w-2xl mx-auto mt-2 text-sm text-gray-600">
            {t("testimonials.header.description")}
          </p>
        </div>

        {/* Main Card */}
        <div className="relative mb-6">
          <div className="relative overflow-hidden bg-white shadow-xl rounded-2xl">
            <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-sky-50 via-transparent to-blue-50"></div>

            <div className="relative grid grid-cols-1 lg:grid-cols-5 min-h-[280px]">
              {/* Left - Profile */}
              <div className="relative flex flex-col p-5 lg:col-span-2 lg:border-r border-sky-100 bg-gradient-to-br from-sky-50/30 to-transparent">
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10 bg-gradient-to-br from-sky-500 to-sky-500 rounded-bl-full"></div>

                {/* Metric */}
                <div className="relative z-10 inline-flex items-center self-start px-3 py-1 mb-4 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-sky-600 to-blue-600">
                  <TrendingUp size={14} className="mr-1" />
                  {testimonials[activeIndex].metric}
                  <span className="ml-1 opacity-90">
                    {testimonials[activeIndex].metricLabel}
                  </span>
                </div>

                {/* Profile */}
                <div className="relative flex items-start mb-4">
                  <div className="relative flex-shrink-0 mr-3">
                    <div className="w-14 h-14 overflow-hidden border-2 border-white shadow-lg rounded-xl">
                      <img
                        src={testimonials[activeIndex].profileImage}
                        alt={testimonials[activeIndex].author}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute flex items-center justify-center w-5 h-5 rounded-full shadow-lg bg-gradient-to-br from-green-400 to-emerald-500 -bottom-1 -right-1">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900">
                      {testimonials[activeIndex].author}
                    </h3>
                    <p className="text-xs font-medium text-sky-600">
                      {testimonials[activeIndex].position}
                    </p>
                    <p className="text-xs text-gray-500">
                      {testimonials[activeIndex].company}
                    </p>
                  </div>
                </div>

                {/* Highlight */}
                <div className="inline-flex items-center self-start px-3 py-1 mb-4 text-xs font-semibold border-2 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800">
                  <Award size={12} className="mr-1" />
                  {testimonials[activeIndex].highlight}
                </div>

                {/* Navigation */}
                <div className="flex items-center mt-auto space-x-2">
                  <button
                    onClick={handlePrev}
                    className="flex items-center justify-center w-9 h-9 text-gray-700 transition-all duration-300 transform bg-white border-2 border-gray-200 rounded-lg hover:border-sky-500 hover:text-sky-600 hover:scale-110"
                    aria-label={t("labels.testimonials.previousAria")}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center justify-center w-9 h-9 text-white transition-all duration-300 transform rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:scale-110"
                    aria-label={t("labels.testimonials.nextAria")}
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Dots */}
                  <div className="flex ml-3 space-x-1">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === activeIndex
                            ? "bg-sky-600 w-6"
                            : "bg-gray-300 hover:bg-gray-400 w-1.5"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="relative flex flex-col justify-center p-5 lg:col-span-3 lg:p-8">
                <div className="absolute top-4 left-5 lg:top-6 lg:left-8">
                  <Quote size={40} className="text-sky-200 opacity-50" />
                </div>

                <div className="relative z-10 mt-4">
                  <div
                    className="transition-all duration-500 ease-in-out"
                    style={{
                      opacity: isAnimating ? 0 : 1,
                      transform: isAnimating
                        ? `translateX(${direction === "next" ? "20px" : "-20px"})`
                        : "translateX(0)",
                    }}
                  >
                    <p className="text-lg font-light leading-relaxed text-gray-800 md:text-xl">
                      "{testimonials[activeIndex].text}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
              <div
                className="h-full transition-all duration-500 bg-gradient-to-r from-sky-600 via-blue-600 to-sky-500"
                style={{
                  width: `${((activeIndex + 1) / testimonials.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-3 gap-3 mb-6 md:grid-cols-6">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                activeIndex === index
                  ? "ring-2 ring-sky-600 shadow-lg scale-105"
                  : "ring-1 ring-transparent hover:ring-gray-300 hover:scale-105 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="p-2 bg-white">
                <div className="relative mx-auto mb-2 overflow-hidden rounded-lg w-10 h-10">
                  <img
                    src={testimonial.profileImage}
                    alt={testimonial.author}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-xs font-semibold text-center text-gray-900 truncate">
                  {testimonial.author}
                </p>
                <p className="text-xs text-center text-gray-500 truncate">
                  {testimonial.company}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Trust Stats */}
      </div>
    </div>
  );
};

export default CompactTestimonials;
