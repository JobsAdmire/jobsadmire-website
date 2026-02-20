// components/EnhancedInterviewTimeline.jsx
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  FileText,
  UserCheck,
  Video,
  MessageSquare,
  Award,
  CheckCircle,
  Calendar,
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
const EnhancedInterviewTimeline = () => {
  const router = useRouter();
  const { locale } = router;
  const [activeStep, setActiveStep] = useState(1);
  const [animateIn, setAnimateIn] = useState(false);
  const [windowWidth, setWindowWidth] = useState(null);
  const timelineRef = useRef(null);

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "ar":
        return arTranslations;
      case "ar":
        return ruTranslations;
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
  const isRTL = locale === "ar" || locale === "fa";

  useEffect(() => {
    // Handle initial animation
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 300);

    // Track window size for responsive adjustments
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Icon mapping for timeline steps
  const stepIconMap = {
    fileText: <FileText />,
    userCheck: <UserCheck />,
    video: <Video />,
    messageSquare: <MessageSquare />,
    award: <Award />,
    checkCircle: <CheckCircle />,
  };

  // Custom timeline for better visualization
  const TimelineConnector = ({ index, isLast }) => {
    if (isLast) return null;

    const connectorStyle = isRTL
      ? { right: "calc(50% + 2.5rem)", left: "calc(-50% + 2.5rem)" }
      : { left: "calc(50% + 2.5rem)", right: "calc(-50% + 2.5rem)" };

    return (
      <div
        className="absolute z-10 hidden md:block"
        style={{
          ...connectorStyle,
          top: "2.75rem",
          height: "0.25rem",
        }}
      >
        <div
          className={`w-full h-full bg-gradient-to-${isRTL ? "l" : "r"} from-sky-${index * 100 + 300} to-sky-${index * 100 + 400} rounded-full`}
        ></div>
      </div>
    );
  };

  return (
    <div
      className={`relative py-20 overflow-hidden bg-gradient-to-b from-sky-50 to-white ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {/* Gradient Orbs */}
        <div
          className={`absolute rounded-full w-96 h-96 opacity-20 bg-sky-200 -top-48 blur-3xl ${isRTL ? "-left-48" : "-right-48"}`}
        ></div>
        <div
          className={`absolute bottom-0 rounded-full w-96 h-96 opacity-20 bg-sky-300 blur-3xl ${isRTL ? "-right-48" : "-left-48"}`}
        ></div>

        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0ea5e9 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        {/* Floating elements */}
        <div
          className={`absolute w-3 h-3 rounded-full bg-sky-300 top-1/4 animate-pulse ${isRTL ? "left-1/3" : "right-1/3"}`}
        ></div>
        <div
          className={`absolute w-4 h-4 rounded-full bg-sky-400 top-2/3 animate-pulse ${isRTL ? "right-1/4" : "left-1/4"}`}
        ></div>
        <div
          className={`absolute w-6 h-6 rounded-full opacity-20 bg-sky-500 bottom-1/4 animate-ping ${isRTL ? "left-1/5" : "right-1/5"}`}
        ></div>
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-7xl">
        {/* Section Title */}
        <div
          className={`mb-20 text-center transition-all duration-1000 transform ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="inline-flex items-center px-4 py-1 mb-4 bg-white rounded-full shadow-sm">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 ${isRTL ? "ml-2" : "mr-2"}`}
            >
              <Star className="w-3 h-3 text-sky-500" />
            </div>
            <span className="text-sm font-medium text-sky-700">
              {t.interviewTimeline.badge}
            </span>
          </div>

          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            <span className="relative inline-block">
              {t.interviewTimeline.title}
              <span className="absolute left-0 w-full h-4 bottom-2 -z-10 bg-sky-100"></span>
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            {t.interviewTimeline.subtitle}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative" ref={timelineRef}>
          {/* Main Timeline Content */}
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {t.interviewTimeline.steps.map((step, index) => (
              <div
                key={step.id}
                className={`relative transition-all duration-1000 transform ${animateIn ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setActiveStep(step.id)}
                aria-label={t.interviewTimeline.accessibility.stepLabel
                  .replace("{number}", step.number)
                  .replace("{title}", step.title)}
              >
                {/* Position indicator & timeline connector */}
                <div className="relative flex justify-center mb-12">
                  {/* Timeline connector to the right/left based on RTL */}
                  <TimelineConnector
                    index={index}
                    isLast={index === t.interviewTimeline.steps.length - 1}
                  />

                  {/* Number indicator with animation effects */}
                  <div className="relative z-20">
                    {/* Pulsing background */}
                    <div
                      className={`absolute inset-0 rounded-full bg-${step.accentColor} animate-pulse opacity-30`}
                    ></div>

                    {/* Main circle */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-16 h-16 text-xl font-bold text-white rounded-full shadow-lg bg-${step.accentColor}`}
                    >
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Step Content Card */}
                <div
                  className={`relative h-full p-8 transition-all duration-300 bg-white rounded-2xl shadow-lg border-2 ${
                    activeStep === step.id
                      ? `border-${step.accentColor} shadow-${step.highlightColor} scale-105`
                      : "border-white"
                  }`}
                >
                  {/* Decorative corner accents */}
                  <div
                    className={`absolute top-0 w-4 h-4 -mt-1 border-t-4 rounded-t${isRTL ? "r" : "l"}-md border-sky-200 ${isRTL ? "right-0 -mr-1 border-r-4" : "left-0 -ml-1 border-l-4"}`}
                  ></div>
                  <div
                    className={`absolute top-0 w-4 h-4 -mt-1 border-t-4 rounded-t${isRTL ? "l" : "r"}-md border-sky-200 ${isRTL ? "left-0 -ml-1 border-l-4" : "right-0 -mr-1 border-r-4"}`}
                  ></div>
                  <div
                    className={`absolute bottom-0 w-4 h-4 -mb-1 border-b-4 rounded-b${isRTL ? "r" : "l"}-md border-sky-200 ${isRTL ? "right-0 -mr-1 border-r-4" : "left-0 -ml-1 border-l-4"}`}
                  ></div>
                  <div
                    className={`absolute bottom-0 w-4 h-4 -mb-1 border-b-4 rounded-b${isRTL ? "l" : "r"}-md border-sky-200 ${isRTL ? "left-0 -ml-1 border-l-4" : "right-0 -mr-1 border-r-4"}`}
                  ></div>

                  {/* Top corner accent */}
                  <div
                    className={`absolute top-0 w-24 h-24 overflow-hidden ${isRTL ? "left-0" : "right-0"}`}
                  >
                    <div
                      className={`absolute top-0 w-12 h-12 -mt-6 transform rotate-45 bg-${step.accentColor} opacity-10 ${isRTL ? "left-0 -ml-6" : "right-0 -mr-6"}`}
                    ></div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-${step.highlightColor}`}
                  >
                    <div className={`text-${step.accentColor}`}>
                      {React.cloneElement(stepIconMap[step.iconKey], {
                        size: 24,
                      })}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <div
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />

                  {/* Decorative watermark icon */}
                  <div
                    className={`absolute opacity-5 ${isRTL ? "left-6" : "right-6"} bottom-6`}
                  >
                    {React.cloneElement(stepIconMap[step.iconKey], {
                      size: 80,
                    })}
                  </div>

                  {/* Progress indicator for mobile */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center -mb-10 md:hidden">
                    <div className="flex space-x-2">
                      {t.interviewTimeline.steps.map((s) => (
                        <div
                          key={s.id}
                          className={`w-8 h-2 rounded-full ${s.id === step.id ? `bg-${step.accentColor}` : "bg-gray-200"}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          className={`mt-28 text-center transition-all duration-1000 transform ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="relative inline-block p-10 mx-auto bg-white shadow-xl rounded-2xl">
            {/* CTA Background accents */}
            <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden rounded-t-2xl -z-10">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #0ea5e9 2px, transparent 2px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>
            </div>

            <h3 className="mb-4 text-3xl font-bold text-gray-900">
              {t.interviewTimeline.cta.title}
            </h3>
            <p className="mb-8 text-xl text-gray-600">
              {t.interviewTimeline.cta.subtitle}
            </p>

            <a
              href={t.interviewTimeline.cta.link}
              aria-label={t.interviewTimeline.accessibility.ctaLabel}
            >
              <button className="relative px-10 py-5 mb-8 overflow-hidden text-lg font-medium text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-sky-500 to-sky-600 hover:shadow-sky-200 hover:-translate-y-1 group">
                <span className="absolute top-0 left-0 w-full h-full transition-opacity bg-white opacity-0 group-hover:opacity-20"></span>
                <span className="flex items-center justify-center">
                  <Calendar className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t.interviewTimeline.cta.buttonText}
                </span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedInterviewTimeline;
