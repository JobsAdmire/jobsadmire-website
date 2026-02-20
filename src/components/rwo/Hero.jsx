import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Monitor, 
  ArrowRight,
  Globe,
  Wifi,
  Clock,
  MapPin, // Not used in current render logic
  CheckCircle, // Not used in current render logic
  Star,
  Home,
  Briefcase
} from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/remotejobs.json';
import trTranslations from '../../../public/locales/tr/remotejobs.json';
import frTranslations from '../../../public/locales/fr/remotejobs.json';
import deTranslations from '../../../public/locales/de/remotejobs.json';
import arTranslations from '../../../public/locales/ar/remotejobs.json';
import ruTranslations from '../../../public/locales/ru/remotejobs.json';
import faTranslations from '../../../public/locales/fa/remotejobs.json';

const RemoteJobsHero = () => {
  const router = useRouter();
  const { locale } = router;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case 'tr':
        return trTranslations;
      case 'ar':
        return arTranslations;
      case 'ru':
        return ruTranslations;
      case 'fr':
        return frTranslations;
      case 'fa':
        return faTranslations;
      case 'de':
        return deTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  // Animation effect for word rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % t.remotejobs.hero.animatedWords.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [t.remotejobs.hero.animatedWords.length]);

  // Helper to map icon names to Lucide-React components
  const iconMap = {
    Clock: Clock,
    Globe: Globe,
    Home: Home,
    Briefcase: Briefcase,
  };

  return (
    // Outer div: Apply full screen height and overflow hidden for consistent hero section
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient orbs (re-added with consistent styling) */}
        <div className="absolute top-10 right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-sky-200/30 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-tr from-purple-200/30 to-sky-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-2xl animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Subtle grid pattern (updated stroke color for consistency) */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(14 165 233) 1px, transparent 0)`, // sky-500
        backgroundSize: '40px 40px'
      }}></div>

      {/* Main Content Container: Apply flex for vertical centering and max-width wrapper */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 min-h-screen lg:h-full flex items-center py-8 lg:py-0">
        <div className="w-full max-w-7xl mx-auto">
          {/* Grid Layout: Ensure vertical alignment on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center min-h-screen lg:h-full">
            
            {/* LEFT SIDE - Content */}
            <div className="space-y-6 lg:space-y-8 order-1 lg:order-1">
              
              {/* Status Badge (consistent styling) */}
              <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-sky-100 border border-slate-200">
                <Star className="w-4 h-4 mr-2 text-sky-600" />
                <span className="text-sm font-semibold text-sky-600">✨ {t.remotejobs.hero.badge}</span>
                <div className="w-2 h-2 ml-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>

              {/* Main Headline (consistent font sizes, min-width, and gradient) */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="text-gray-900">{t.remotejobs.hero.headline.prefix}</span>{" "}
                  <span className="relative inline-block min-w-[200px] sm:min-w-[280px] md:min-w-[350px] lg:min-w-[420px] xl:min-w-[500px]">
                    <span className="opacity-0">{t.remotejobs.hero.animatedWords[0]}</span>
                    <span className="absolute top-0 left-0">
                      <span className="font-extrabold text-transparent bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text animate-pulse">
                        {t.remotejobs.hero.animatedWords[currentWordIndex]}
                      </span>
                    </span>
                  </span>
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                    {t.remotejobs.hero.headline.suffix}
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl font-medium">
                  {t.remotejobs.hero.description}
                </p>
              </div>

              {/* CTA Section (consistent padding, gradients, and hover effects) */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl blur opacity-20"></div>
                <div className="relative p-6 sm:p-8 border shadow-2xl bg-white/95 backdrop-blur-sm border-white/50 rounded-3xl">
                  <a href="/job" className="block">
                    <button className="group relative w-full py-3 sm:py-4 px-6 font-bold text-white transition-all duration-300 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="relative flex items-center justify-center">
                        <Monitor className="w-5 h-5 mr-2" />
                        <span className="mr-2">{t.remotejobs.hero.cta.text}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </button>
                  </a>
                </div>
              </div>
            </div>
            
            {/* RIGHT SIDE - Remote Work Showcase */}
            <div className="space-y-6 order-2 lg:order-2">
              
              {/* Remote Work Showcase Card (consistent styling) */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-purple-600 rounded-3xl blur opacity-10"></div>
                <div className="relative p-6 sm:p-8 border shadow-2xl bg-white/90 backdrop-blur-sm border-white/50 rounded-3xl">
                  
                  {/* Header (consistent font sizes and color) */}
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {t.remotejobs.showcase.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">{t.remotejobs.showcase.subtitle}</p>
                  </div>
                  
                  {/* Simple Content */}
                  <div className="space-y-6">
                    {/* Remote Work Visual (consistent padding, gradients, and border) */}
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl">
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <div className="flex items-center justify-center w-32 h-20 bg-gradient-to-r from-sky-200 to-blue-200 rounded-2xl">
                            <Monitor className="w-16 h-16 text-sky-600" />
                          </div>
                          {/* Connectivity indicators (consistent sizing and animation) */}
                          <div className="absolute flex items-center justify-center w-4 h-4 bg-green-500 rounded-full -top-2 -right-2 animate-pulse">
                            <Wifi className="w-3 h-3 text-white" /> {/* Used Wifi instead of CheckCircle */}
                          </div>
                          {/* Global reach points (kept for visual consistency, adjust as needed) */}
                          <div className="absolute w-3 h-3 delay-300 bg-blue-500 rounded-full -bottom-1 left-1/4 animate-pulse"></div>
                          <div className="absolute w-2 h-2 bg-purple-500 rounded-full top-1/2 -left-3 animate-pulse delay-600"></div>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <div className="text-lg font-semibold text-gray-800 mb-2">{t.remotejobs.showcase.workAnywhere.title}</div>
                        <div className="text-sm text-gray-600">{t.remotejobs.showcase.workAnywhere.subtitle}</div>
                      </div>
                    </div>
                    
                    {/* Remote Work Benefits (features updated for consistency with other heroes) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {t.remotejobs.showcase.benefits.map((benefit, index) => {
                        const IconComponent = iconMap[benefit.icon]; // Dynamically get icon component
                        return (
                          <div key={index} className="flex items-center space-x-3 p-4 bg-white/60 rounded-2xl border border-white/50">
                            {IconComponent ? (
                              <IconComponent className={`w-5 h-5 flex-shrink-0 ${benefit.color || 'text-sky-500'}`} />
                            ) : (
                              <div className={`w-2 h-2 ${benefit.color || 'bg-sky-400'} rounded-full flex-shrink-0`}></div> 
                            )}
                            <span className="text-xs sm:text-sm font-medium text-gray-700">{benefit.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Remote Job Highlights (added for consistency, assuming data structure similar to other heroes' features) */}
                    {/* If you have specific highlight data for remote jobs, you can replace this with a dedicated section */}
                    {t.remotejobs.showcase.highlights && ( // Check if highlights data exists
                      <div className="p-4 sm:p-6 border bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200 rounded-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {t.remotejobs.showcase.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className={`w-2 h-2 ${highlight.color || 'bg-sky-400'} rounded-full flex-shrink-0`}></div>
                              <span className="text-xs sm:text-sm font-medium text-gray-700">{highlight.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

export default RemoteJobsHero;