import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  MessageSquare,
  FileSearch,
  Scale,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Import translation files for all 7 languages
import enTranslations from "../../../public/locales/en/turkeystages.json";
import trTranslations from "../../../public/locales/tr/turkeystages.json";
import frTranslations from "../../../public/locales/fr/turkeystages.json";
import deTranslations from "../../../public/locales/de/turkeystages.json";
import arTranslations from "../../../public/locales/ar/turkeystages.json";
import ruTranslations from "../../../public/locales/ru/turkeystages.json";
import faTranslations from "../../../public/locales/fa/turkeystages.json";

const TurkeyResidenceProcess = () => {
  const router = useRouter();
  const { locale } = router;
  const [activeStage, setActiveStage] = useState(0);

  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "fr":
        return frTranslations;
      case "de":
        return deTranslations;
      case "ar":
        return arTranslations;
      case "ru":
        return ruTranslations;
      case "fa":
        return faTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  const stages = [
    {
      icon: MessageSquare,
      title: t.stages.stage1.title,
      description: t.stages.stage1.description,
      step: "01",
    },
    {
      icon: FileSearch,
      title: t.stages.stage2.title,
      description: t.stages.stage2.description,
      step: "02",
    },
    {
      icon: Scale,
      title: t.stages.stage3.title,
      description: t.stages.stage3.description,
      step: "03",
    },
    {
      icon: CheckCircle,
      title: t.stages.stage4.title,
      description: t.stages.stage4.description,
      step: "04",
    },
  ];

  return (
    <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(56,189,248,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_rgba(14,165,233,0.1)_0%,_transparent_50%)]"></div>
      </div>

      <div className="relative z-10 w-full px-6 mx-auto max-w-7xl lg:px-8">
        {/* Header */}
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-4xl font-black leading-tight lg:text-5xl text-sky-900">
            {t.header.title.part1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
              {t.header.title.highlight}
            </span>{" "}
            {t.header.title.part2}
          </h2>
          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-sky-700">
            {t.header.description}
          </p>
        </div>

        {/* Main Circular Timeline */}
        <div className="relative max-w-7xl mx-auto">
          {/* Center Circle with Active Stage Info */}
          <div className="flex items-center justify-center mb-16">
            <div className="relative">
              {/* Rotating Border Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400 opacity-20 blur-xl animate-pulse"></div>

              {/* Center Content */}
              <div className="relative z-10 flex flex-col items-center justify-center w-64 h-64 bg-white border-4 shadow-xl rounded-full border-sky-300">
                <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-sky-400 to-blue-600">
                  {React.createElement(stages[activeStage].icon, {
                    className: "w-10 h-10 text-white",
                    strokeWidth: 2.5,
                  })}
                </div>

                <div className="mb-2 text-sm font-bold tracking-wider text-sky-600">
                  STEP {stages[activeStage].step}
                </div>

                <h3 className="px-6 mb-2 text-xl font-bold text-center text-sky-900">
                  {stages[activeStage].title}
                </h3>

                <div className="flex gap-2 mt-3">
                  {stages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStage(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === activeStage
                          ? "bg-sky-600 w-6"
                          : "bg-sky-300 hover:bg-sky-400"
                      }`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Circular Stage Cards */}
          <div className="relative">
            {/* Connection Circle */}
            <svg
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              viewBox="0 0 800 600"
            >
              <circle
                cx="400"
                cy="300"
                r="220"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="2"
                strokeDasharray="8,8"
                className="opacity-50"
              />
            </svg>

            {/* Stage Cards in Grid Layout with Circular Feel */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = activeStage === index;
                const isPast = index < activeStage;

                return (
                  <div
                    key={index}
                    className="relative group"
                    onClick={() => setActiveStage(index)}
                  >
                    {/* Connecting Line */}
                    {index < stages.length - 1 && (
                      <div
                        className={`absolute hidden lg:block transition-all duration-500 ${
                          index % 2 === 0
                            ? "left-full top-1/2 w-12 h-0.5"
                            : "right-full top-1/2 w-12 h-0.5"
                        } ${isPast || isActive ? "bg-sky-400" : "bg-sky-200"}`}
                      ></div>
                    )}

                    {/* Card */}
                    <div
                      className={`
                      relative p-8 transition-all duration-500 border-2 cursor-pointer rounded-3xl
                      ${
                        isActive
                          ? "bg-gradient-to-br from-sky-500 to-blue-600 border-sky-400 shadow-2xl scale-105 text-white"
                          : isPast
                            ? "bg-white border-sky-300 shadow-lg hover:shadow-xl hover:scale-102"
                            : "bg-white border-sky-200 shadow-md hover:shadow-lg hover:border-sky-300 hover:scale-102"
                      }
                    `}
                    >
                      {/* Step Number Badge - Top Right */}
                      <div
                        className={`
                        absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-lg font-black border-4 border-white
                        ${
                          isActive
                            ? "bg-white text-sky-600"
                            : isPast
                              ? "bg-gradient-to-br from-sky-400 to-blue-500 text-white"
                              : "bg-sky-100 text-sky-600"
                        }
                      `}
                      >
                        {isPast && !isActive ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          stage.step
                        )}
                      </div>

                      {/* Icon Circle */}
                      <div
                        className={`
                        inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl transition-all duration-500
                        ${
                          isActive
                            ? "bg-white/20 backdrop-blur-md shadow-lg"
                            : "bg-gradient-to-br from-sky-100 to-blue-100"
                        }
                      `}
                      >
                        <Icon
                          className={`w-8 h-8 ${isActive ? "text-white" : "text-sky-600"}`}
                          strokeWidth={2.5}
                        />
                      </div>

                      {/* Content */}
                      <h3
                        className={`
                        mb-4 text-2xl font-bold transition-colors duration-300
                        ${isActive ? "text-white" : "text-sky-900"}
                      `}
                      >
                        {stage.title}
                      </h3>

                      <p
                        className={`
                        mb-6 text-base leading-relaxed transition-colors duration-300
                        ${isActive ? "text-white/95" : "text-sky-700"}
                      `}
                      >
                        {stage.description}
                      </p>

                      {/* Bottom Action */}
                      <div
                        className={`
                        flex items-center gap-2 text-sm font-semibold transition-all duration-300
                        ${
                          isActive
                            ? "text-white"
                            : "text-sky-600 group-hover:gap-3"
                        }
                      `}
                      >
                        <span>
                          {isActive
                            ? "Current Step"
                            : isPast
                              ? "Completed"
                              : "View Details"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </div>

                      {/* Animated Border Gradient for Active */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      )}

                      {/* Corner Decoration */}
                      <div
                        className={`absolute bottom-4 right-4 w-16 h-16 rounded-full transition-all duration-500 ${
                          isActive ? "bg-white/10" : "bg-sky-50"
                        }`}
                      ></div>
                      <div
                        className={`absolute bottom-6 right-6 w-12 h-12 rounded-full transition-all duration-500 ${
                          isActive ? "bg-white/10" : "bg-sky-100"
                        }`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Timeline at Bottom */}
          <div className="flex items-center justify-center mt-16">
            <div className="relative flex items-center gap-0">
              {stages.map((stage, index) => {
                const isActive = activeStage === index;
                const isPast = index < activeStage;

                return (
                  <React.Fragment key={index}>
                    {/* Stage Button */}
                    <button
                      onClick={() => setActiveStage(index)}
                      className="relative z-10 flex flex-col items-center transition-all duration-300 group"
                    >
                      <div
                        className={`
                        relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-4 border-white shadow-lg
                        ${
                          isActive
                            ? "bg-gradient-to-br from-sky-500 to-blue-600 scale-125"
                            : isPast
                              ? "bg-sky-400 hover:bg-sky-500 scale-110"
                              : "bg-sky-200 hover:bg-sky-300"
                        }
                      `}
                      >
                        {isPast && !isActive ? (
                          <CheckCircle
                            className="w-7 h-7 text-white"
                            strokeWidth={2.5}
                          />
                        ) : (
                          <span
                            className={`text-xl font-black ${isActive || isPast ? "text-white" : "text-sky-700"}`}
                          >
                            {stage.step}
                          </span>
                        )}

                        {/* Active Pulse */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-full bg-sky-400 animate-ping opacity-75"></div>
                        )}
                      </div>

                      {/* Stage Label */}
                      <span
                        className={`
                        mt-3 text-xs font-bold transition-all duration-300
                        ${isActive ? "text-sky-700 scale-110" : "text-sky-500"}
                      `}
                      >
                        {stage.title.split(" ")[0]}
                      </span>
                    </button>

                    {/* Connecting Line */}
                    {index < stages.length - 1 && (
                      <div className="relative flex items-center w-24 h-1 -mx-2">
                        <div
                          className={`
                          w-full h-1 transition-all duration-500 rounded-full
                          ${
                            isPast || (isActive && index < activeStage)
                              ? "bg-gradient-to-r from-sky-400 to-blue-500"
                              : "bg-sky-200"
                          }
                        `}
                        >
                          {/* Animated Progress */}
                          {index === activeStage && (
                            <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full animate-shimmer"></div>
                          )}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <button className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-full shadow-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-2xl hover:scale-105">
            Start Your Journey
            <ArrowRight className="inline-block w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </section>
  );
};

export default TurkeyResidenceProcess;
