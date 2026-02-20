import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Facts from '@components/i-canada/fact';
import Visa from '@components/i-canada/visa-option';
import Requirements from '@components/i-canada/requirements';
import Job from '@components/i-canada/job';
import Moving from '@components/i-canada/moving';
import Tuk from '@components/i-canada/t-uk';
import Cost from '@components/i-canada/cost';
import Pet from '@components/i-canada/pet';

// Import your translation files
import enTranslations from '../../../public/locales/en/canadaimmi.json';
import trTranslations from '../../../public/locales/tr/canadaimmi.json';
// import frTranslations from '../../../public/locales/fr/canadaimmi.json';
// import deTranslations from '../../../public/locales/de/canadaimmi.json';
// import arTranslations from '../../../public/locales/ar/canadaimmi.json';

// Define section content components (keeping your existing components)
const SectionOne = () => (
  <div>
    <Requirements/>
  </div>
);

const SectionTwo = () => (
  <div>
   <Job/>
  </div>
);

const SectionThree = () => (
  <div>
    <Moving/>
  </div>
);

// Map section IDs to their component renderers
const sectionComponents = {
  1: () => <div><Facts/></div>,
  2: () => <div><Visa/></div>,
  3: SectionOne, // Requirements for Moving to Canada
  4: SectionTwo, // Getting a Job in Canada as a Foreigner
  5: SectionThree, // Moving to Canada from the US
  6: () => <div><Tuk/></div>,
  7: () => <div><Cost/></div>,
  8: () => <div><Pet/></div>,
};

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
                  case 'tr':
                    return trTranslations;
              default:
                return enTranslations;
            }
  };

  const t = getTranslations();
  const sections = t.tableofcontents.sections;

  useEffect(() => {
    const handleScroll = () => {
      // Get all section elements
      const sectionElements = sections.map(section => 
        document.getElementById(`section-${section.id}`)
      );
      
      // Find the section that is currently in view
      const currentSection = sectionElements.findIndex(element => {
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
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);
  
  const scrollToSection = (id) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      // Adjusted to account for fixed navbar
      window.scrollTo({
        top: element.offsetTop - 140,
        behavior: 'smooth'
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
    <div className="w-full bg-gradient-to-br from-sky-50 via-white to-sky-100 min-h-screen">
      {/* Enhanced Mobile Toggle Button */}
      <div className="fixed top-20 left-4 z-40 lg:hidden">
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white p-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl border-2 border-white"
          aria-label={showMobileMenu ? t.tableofcontents.accessibility.closeMenu : t.tableofcontents.accessibility.openMenu}
        >
          {showMobileMenu ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="w-full flex flex-col lg:flex-row">
        {/* Enhanced Table of Contents with Sky Blue Theme */}
        <div 
          className={`lg:w-1/4 lg:sticky transition-all duration-300 ease-in-out z-30 ${
            showMobileMenu 
              ? "fixed top-32 left-0 w-full h-screen-32 lg:h-screen-32 lg:top-32 transform translate-x-0" 
              : "fixed top-32 left-0 w-full h-screen-32 lg:h-screen-32 lg:top-32 transform -translate-x-full lg:translate-x-0"
          }`}
          style={{ maxHeight: "calc(100vh - 128px)" }}
        >
          {/* Enhanced TOC Container with gradient and modern styling */}
          <div className="bg-gradient-to-br from-white via-sky-50 to-white m-4 rounded-2xl overflow-hidden shadow-2xl border border-sky-100 backdrop-blur-sm">
            {/* Enhanced TOC Header with gradient */}
            <div className="py-8 px-8 bg-gradient-to-r from-sky-500 to-sky-600 relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
                  {t.tableofcontents.header.title}
                </h2>
                <div className="flex items-center">
                  <div className="w-16 h-1 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full ml-2"></div>
                </div>
                <p className="text-sky-100 text-sm mt-2 font-medium">
                  {t.tableofcontents.header.subtitle}
                </p>
              </div>
            </div>
            
            {/* Enhanced TOC Items with improved styling */}
            <nav className="py-6 overflow-y-auto bg-white" style={{ height: "calc(100vh - 280px)" }}>
              {sections.map((section) => (
                <div 
                  key={section.id} 
                  className={`group mb-3 mx-4 rounded-xl cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02] ${
                    activeSection === section.id 
                      ? "bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg shadow-sky-500/25" 
                      : "bg-gradient-to-r from-sky-50 to-white hover:from-sky-100 hover:to-sky-50 hover:shadow-md"
                  }`}
                  onClick={() => scrollToSection(section.id)}
                >
                  <div className="py-4 px-5 flex items-center">
                    {/* Enhanced Circle with number and progress ring */}
                    <div className="relative w-12 h-12 mr-5 flex-shrink-0">
                      {/* Outer ring for active state */}
                      {activeSection === section.id && (
                        <div className="absolute inset-0 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                      
                      {/* Progress ring animation */}
                      {activeSection === section.id && (
                        <svg className="absolute top-0 left-0 w-12 h-12 -rotate-90" viewBox="0 0 40 40">
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
                      <div className={`absolute top-0 left-0 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                        activeSection === section.id 
                          ? "bg-white text-sky-600 shadow-lg transform scale-110" 
                          : "bg-gradient-to-br from-sky-400 to-sky-500 text-white group-hover:from-sky-500 group-hover:to-sky-600 group-hover:shadow-md"
                      }`}>
                        <span className="font-bold text-sm">{section.id}</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Title text with better typography */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-semibold leading-tight transition-all duration-300 ${
                        activeSection === section.id 
                          ? "text-white" 
                          : "text-sky-700 group-hover:text-sky-800"
                      }`}>
                        {section.title}
                      </span>
                      
                      {/* Progress indicator for active section */}
                      {activeSection === section.id && (
                        <div className="mt-2 flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <div className="ml-2 text-xs text-white/80 font-medium">
                            {t.tableofcontents.status.currentlyReading}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Arrow indicator */}
                    <div className={`ml-3 transition-all duration-300 ${
                      activeSection === section.id 
                        ? "text-white transform translate-x-1" 
                        : "text-sky-400 group-hover:text-sky-600 group-hover:transform group-hover:translate-x-1"
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </nav>
            
            {/* Enhanced Footer with gradient */}
            <div className="py-4 px-6 bg-gradient-to-r from-sky-50 to-white border-t border-sky-100">
              <div className="flex items-center justify-center text-xs text-sky-600 font-medium">
                <div className="w-2 h-2 bg-sky-400 rounded-full mr-2 animate-pulse"></div>
                {t.tableofcontents.footer.sectionsCount.replace('{count}', sections.length)}
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
              <div className="flex items-center mb-8 border-b-2 border-gradient-to-r from-sky-200 to-sky-100 pb-6 px-6 relative">
                {/* Section number badge */}
                <div className="absolute -top-3 left-6 bg-gradient-to-r from-sky-500 to-sky-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {section.id}
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-700 to-sky-600 bg-clip-text text-transparent ml-12">
                  {section.title}
                </h2>
              </div>
              <div>
                {/* Render the custom content for each section */}
                {renderSectionContent(section.id)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Enhanced Quick Navigation Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <button 
            className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl focus:outline-none border-2 border-white"
            aria-label={t.tableofcontents.quickNav.buttonLabel}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
            </svg>
          </button>
          
          <div className="absolute bottom-full right-0 mb-4 w-72 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-sky-100 backdrop-blur-sm">
              {/* Quick nav header */}
              <div className="flex items-center mb-4 pb-3 border-b border-sky-100">
                <div className="w-3 h-3 bg-sky-500 rounded-full mr-3"></div>
                <div className="text-sm font-bold text-sky-700">
                  {t.tableofcontents.quickNav.title}
                </div>
              </div>
              
              {/* Section list */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sections.map((section) => (
                  <div 
                    key={`quick-${section.id}`}
                    className={`cursor-pointer p-3 rounded-xl transition-all duration-200 flex items-center group/item ${
                      activeSection === section.id 
                        ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md" 
                        : "hover:bg-sky-50 text-sky-700 hover:shadow-sm"
                    }`}
                    onClick={() => scrollToSection(section.id)}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 transition-all duration-200 ${
                      activeSection === section.id 
                        ? "bg-white text-sky-600 shadow-sm" 
                        : "bg-sky-100 text-sky-600 group-hover/item:bg-sky-200"
                    }`}>
                      <span className="font-bold text-xs">{section.id}</span>
                    </div>
                    <span className="font-medium text-sm leading-tight flex-1">{section.title}</span>
                    
                    {/* Arrow for active section */}
                    {activeSection === section.id && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Quick nav footer */}
              <div className="mt-4 pt-3 border-t border-sky-100 text-center">
                <div className="text-xs text-sky-600 font-medium">
                  {t.tableofcontents.quickNav.footer.replace('{count}', sections.length)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTableOfContents;