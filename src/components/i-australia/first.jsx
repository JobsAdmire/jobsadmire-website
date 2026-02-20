import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/australiaimmi.json";
import trTranslations from "../../../public/locales/tr/australiaimmi.json";
// import arTranslations from '../../../public/locales/ar/australiaimmi.json';
// import frTranslations from '../../../public/locales/fr/australiaimmi.json';
// import deTranslations from '../../../public/locales/de/australiaimmi.json';

// Import your existing components (you'll need to make these multilingual too)
import Facts from "@components/i-australia/fact";
import Visa from "@components/i-australia/visa-option";
import Requirements from "@components/i-australia/requirements";
import Job from "@components/i-australia/job";
import Moving from "@components/i-australia/moving";
import Tuk from "@components/i-australia/t-uk";
import Cost from "@components/i-australia/cost";
import Pet from "@components/i-australia/pet";

const InteractiveTableOfContents = () => {
  const router = useRouter();
  const { locale } = router;
  const [activeSection, setActiveSection] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      // case 'fr':
      //   return frTranslations;
      // case 'de':
      //   return deTranslations;
      //   case 'ar':
      //     return arTranslations;
      case "tr":
        return trTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();
  const isRTL = locale === "ar" || locale === "fa";

  // Get sections from translations
  const sections = t.tableOfContents?.sections || [];

  // Define section content components (keeping your existing components)
  const SectionOne = () => (
    <div>
      <Requirements />
    </div>
  );

  const SectionTwo = () => (
    <div>
      <Job />
    </div>
  );

  const SectionThree = () => (
    <div>
      <Moving />
    </div>
  );

  // Map section IDs to their component renderers
  const sectionComponents = {
    1: () => (
      <div>
        <Facts />
      </div>
    ),
    2: () => (
      <div>
        <Visa />
      </div>
    ),
    3: SectionOne, // Requirements for Moving to Turkey
    4: SectionTwo, // Getting a Job in Turkey as a Foreigner
    5: SectionThree, // Moving to Turkey from the US
    6: () => (
      <div>
        <Tuk />
      </div>
    ),
    7: () => (
      <div>
        <Cost />
      </div>
    ),
    8: () => (
      <div>
        <Pet />
      </div>
    ),
  };

  useEffect(() => {
    const handleScroll = () => {
      // Get all section elements
      const sectionElements = sections.map((section) =>
        document.getElementById(`section-${section.id}`)
      );

      // Find the section that is currently in view
      const currentSection = sectionElements.findIndex((element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        // Adjusted to account for fixed navbar (increased the top threshold)
        return rect.top <= 200 && rect.bottom > 200;
      });

      if (currentSection !== -1) {
        setActiveSection(sections[currentSection].id);
      } else if (window.scrollY < 100) {
        // At the top of the page
        setActiveSection(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  const scrollToSection = (id) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      // Adjusted to account for fixed navbar
      window.scrollTo({
        top: element.offsetTop - 140,
        behavior: "smooth",
      });
      setShowMobileMenu(false); // Close mobile menu after clicking
    }
  };

  // Render the appropriate section component based on the ID
  const renderSectionContent = (id) => {
    const SectionComponent = sectionComponents[id];
    return SectionComponent ? <SectionComponent /> : null;
  };

  return (
    <div
      className={`w-full bg-gradient-to-br from-sky-50 via-white to-sky-100 min-h-screen ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Mobile Toggle Button - Enhanced with sky blue theme */}
      <div
        className={`fixed top-20 z-40 lg:hidden ${isRTL ? "right-4" : "left-4"}`}
      >
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white p-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl border-2 border-white"
          aria-label={t.tableOfContents?.accessibility?.toggleMenu}
        >
          {showMobileMenu ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`w-full flex flex-col ${isRTL ? "lg:flex-row-reverse" : "lg:flex-row"}`}
      >
        {/* Enhanced Table of Contents with Sky Blue Theme */}
        <div
          className={`lg:w-1/4 lg:sticky transition-all duration-300 ease-in-out z-30 ${
            showMobileMenu
              ? `fixed top-32 w-full h-screen-32 lg:h-screen-32 lg:top-32 transform translate-x-0 ${isRTL ? "right-0" : "left-0"}`
              : `fixed top-32 w-full h-screen-32 lg:h-screen-32 lg:top-32 transform ${isRTL ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"} ${isRTL ? "right-0" : "left-0"}`
          }`}
          style={{ maxHeight: "calc(100vh - 128px)" }}
        >
          {/* Enhanced TOC Container with gradient and modern styling */}
          <div className="bg-gradient-to-br from-white via-sky-50 to-white m-4 rounded-2xl overflow-hidden shadow-2xl border border-sky-100 backdrop-blur-sm">
            {/* Enhanced TOC Header with gradient */}
            <div className="py-8 px-8 bg-gradient-to-r from-sky-500 to-sky-600 relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className={`absolute top-0 w-32 h-32 bg-white rounded-full -translate-y-16 ${isRTL ? "right-0 translate-x-16" : "left-0 -translate-x-16"}`}
                ></div>
                <div
                  className={`absolute bottom-0 w-24 h-24 bg-white rounded-full translate-y-12 ${isRTL ? "left-0 -translate-x-12" : "right-0 translate-x-12"}`}
                ></div>
              </div>

              <div className="relative z-10">
                <h2
                  className={`text-2xl font-bold text-white mb-2 tracking-wide ${isRTL ? "text-right" : "text-left"}`}
                >
                  {t.tableOfContents?.header?.title}
                </h2>
                <div
                  className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-16 h-1 bg-white rounded-full"></div>
                  <div
                    className={`w-3 h-3 bg-white rounded-full ${isRTL ? "mr-2" : "ml-2"}`}
                  ></div>
                </div>
                <p
                  className={`text-sky-100 text-sm mt-2 font-medium ${isRTL ? "text-right" : "text-left"}`}
                >
                  {t.tableOfContents?.header?.subtitle}
                </p>
              </div>
            </div>

            {/* Enhanced TOC Items with improved styling */}
            <nav
              className="py-6 overflow-y-auto bg-white"
              style={{ height: "calc(100vh - 280px)" }}
            >
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`group mb-3 mx-4 rounded-xl cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02] ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg shadow-sky-500/25"
                      : "bg-gradient-to-r from-sky-50 to-white hover:from-sky-100 hover:to-sky-50 hover:shadow-md"
                  }`}
                  onClick={() => scrollToSection(section.id)}
                >
                  <div
                    className={`py-4 px-5 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {/* Enhanced Circle with number and progress ring */}
                    <div
                      className={`relative w-12 h-12 flex-shrink-0 ${isRTL ? "ml-5" : "mr-5"}`}
                    >
                      {/* Outer ring for active state */}
                      {activeSection === section.id && (
                        <div className="absolute inset-0 rounded-full border-2 border-white animate-pulse"></div>
                      )}

                      {/* Progress ring animation */}
                      {activeSection === section.id && (
                        <svg
                          className="absolute top-0 left-0 w-12 h-12 -rotate-90"
                          viewBox="0 0 40 40"
                        >
                          <circle
                            className="text-white/30 stroke-current"
                            fill="none"
                            strokeWidth="2"
                            cx="20"
                            cy="20"
                            r="18"
                          />
                          <circle
                            className="text-white stroke-current transition-all duration-1000 ease-out"
                            fill="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray="113"
                            strokeDashoffset="0"
                            cx="20"
                            cy="20"
                            r="18"
                          />
                        </svg>
                      )}

                      {/* Base circle with enhanced styling */}
                      <div
                        className={`absolute top-0 left-0 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                          activeSection === section.id
                            ? "bg-white text-sky-600 shadow-lg transform scale-110"
                            : "bg-gradient-to-br from-sky-400 to-sky-500 text-white group-hover:from-sky-500 group-hover:to-sky-600 group-hover:shadow-md"
                        }`}
                      >
                        <span className="font-bold text-sm">{section.id}</span>
                      </div>
                    </div>

                    {/* Enhanced Title text with better typography */}
                    <div
                      className={`flex-1 min-w-0 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      <span
                        className={`text-sm font-semibold leading-tight transition-all duration-300 ${
                          activeSection === section.id
                            ? "text-white"
                            : "text-sky-700 group-hover:text-sky-800"
                        }`}
                      >
                        {section.title}
                      </span>

                      {/* Progress indicator for active section */}
                      {activeSection === section.id && (
                        <div
                          className={`mt-2 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <div
                            className={`text-xs text-white/80 font-medium ${isRTL ? "mr-2" : "ml-2"}`}
                          >
                            {t.tableOfContents?.status?.currentlyReading}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Arrow indicator */}
                    <div
                      className={`transition-all duration-300 ${isRTL ? "mr-3" : "ml-3"} ${
                        activeSection === section.id
                          ? `text-white transform ${isRTL ? "-translate-x-1" : "translate-x-1"}`
                          : `text-sky-400 group-hover:text-sky-600 group-hover:transform ${isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* Enhanced Footer with gradient */}
            <div className="py-4 px-6 bg-gradient-to-r from-sky-50 to-white border-t border-sky-100">
              <div
                className={`flex items-center justify-center text-xs text-sky-600 font-medium ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-2 h-2 bg-sky-400 rounded-full animate-pulse ${isRTL ? "ml-2" : "mr-2"}`}
                ></div>
                {t.tableOfContents?.footer?.sectionsCount?.replace(
                  "{count}",
                  sections.length
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content sections - Enhanced with sky blue accents */}
        <div className="lg:w-3/4 px-0 py-10 bg-white shadow-lg">
          {sections.map((section) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="mb-16 scroll-mt-36 w-full mx-auto"
            >
              <div
                className={`flex items-center mb-8 border-b-2 border-gradient-to-r from-sky-200 to-sky-100 pb-6 px-6 relative ${isRTL ? "flex-row-reverse" : ""}`}
              >
                {/* Section number badge */}
                <div
                  className={`absolute -top-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${isRTL ? "right-6" : "left-6"}`}
                >
                  {section.id}
                </div>
                <h1
                  className={`text-3xl font-bold bg-gradient-to-r from-sky-700 to-sky-600 bg-clip-text text-transparent ${isRTL ? "mr-12 text-right" : "ml-12 text-left"}`}
                >
                  {section.title}
                </h1>
              </div>
              <div>
                {/* Render the custom content for each section */}
                {renderSectionContent(section.id)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveTableOfContents;
