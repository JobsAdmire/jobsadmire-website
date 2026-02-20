import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, ChevronUp, ChevronDown, Users, Target, Award, TrendingUp } from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/jobrecruitmenthero.json';
import trTranslations from '../../../public/locales/tr/jobrecruitmenthero.json';
import frTranslations from '../../../public/locales/fr/jobrecruitmenthero.json';
 import deTranslations from '../../../public/locales/de/jobrecruitmenthero.json';
import arTranslations from '../../../public/locales/ar/jobrecruitmenthero.json';
import ruTranslations from '../../../public/locales/ru/jobrecruitmenthero.json';
import faTranslations from '../../../public/locales/fa/jobrecruitmenthero.json';
const RecruitmentSection = () => {
  const router = useRouter();
  const { locale } = router;
  
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 3;
  
  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
          case 'tr':
            return trTranslations;
          case 'ar':
            return arTranslations;
          case 'fr':
            return frTranslations;
          case 'fa':
            return faTranslations;
          case 'de':
            return deTranslations;
             case 'ru':
                    return ruTranslations;
          default:
            return enTranslations;
        }
  };

  const t = getTranslations();
  
  // Auto-scroll carousel every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Manual navigation
  const goToSlide = (index) => {
    setActiveSlide(index);
  };
  
  // Slide content with translations
  const slides = [
    {
      title: t.recruitment.slides.talentAcquisition.title,
      subtitle: t.recruitment.slides.talentAcquisition.subtitle,
      content: (
        <>
          <p className="mb-6 leading-relaxed text-gray-700">
            {t.recruitment.slides.talentAcquisition.description}
          </p>
          
          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <div className="p-2 bg-blue-100 rounded-full">
                <Target className="w-4 h-4 text-sky-500" />
              </div>
              <span className="font-medium">{t.recruitment.slides.talentAcquisition.steps.requirements}</span>
            </div>
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <div className="p-2 bg-green-100 rounded-full">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-medium">{t.recruitment.slides.talentAcquisition.steps.sourcing}</span>
            </div>
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <div className="p-2 bg-purple-100 rounded-full">
                <Award className="w-4 h-4 text-sky-500" />
              </div>
              <span className="font-medium">{t.recruitment.slides.talentAcquisition.steps.interview}</span>
            </div>
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <div className="p-2 bg-orange-100 rounded-full">
                <CheckCircle className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-medium">{t.recruitment.slides.talentAcquisition.steps.selection}</span>
            </div>
          </div>
          
          <a href="/contact-us">
           <button className="bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] hover:from-sky-500 hover:to-sky-500 text-white py-3 px-8 rounded-full inline-flex items-center font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
            {t.recruitment.slides.talentAcquisition.cta}
            <span className="ml-2">→</span>
          </button></a>
        </>
      )
    },
    {
      title: t.recruitment.slides.hrDocumentation.title,
      subtitle: t.recruitment.slides.hrDocumentation.subtitle,
      content: (
        <>
          <p className="mb-6 leading-relaxed text-gray-700">
            {t.recruitment.slides.hrDocumentation.description}
          </p>
          
          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-emerald-500" />
              <span className="font-medium">{t.recruitment.slides.hrDocumentation.services.contracts}</span>
            </div>
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-emerald-500" />
              <span className="font-medium">{t.recruitment.slides.hrDocumentation.services.policies}</span>
            </div>
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-emerald-500" />
              <span className="font-medium">{t.recruitment.slides.hrDocumentation.services.performance}</span>
            </div>
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-emerald-500" />
              <span className="font-medium">{t.recruitment.slides.hrDocumentation.services.compliance}</span>
            </div>
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-emerald-500" />
              <span className="font-medium">{t.recruitment.slides.hrDocumentation.services.compensation}</span>
            </div>
          </div>
          
          <a href="/contact-us">
          <button className="bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] hover:from-sky-500 hover:to-sky-500 text-white py-3 px-8 rounded-full inline-flex items-center font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
            {t.recruitment.slides.hrDocumentation.cta}
            <span className="ml-2">→</span>
          </button>
          </a>
        </>
      )
    },
    {
      title: t.recruitment.slides.strategicConsulting.title,
      subtitle: t.recruitment.slides.strategicConsulting.subtitle,
      content: (
        <>
          <p className="mb-6 leading-relaxed text-gray-700">
            {t.recruitment.slides.strategicConsulting.description}
          </p>
          
          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <div className="p-2 bg-indigo-100 rounded-full">
                <TrendingUp className="w-4 h-4 text-sky-500" />
              </div>
              <span className="font-medium">{t.recruitment.slides.strategicConsulting.services.workforce}</span>
            </div>
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <div className="p-2 bg-pink-100 rounded-full">
                <Users className="w-4 h-4 text-pink-600" />
              </div>
              <span className="font-medium">{t.recruitment.slides.strategicConsulting.services.teamStructure}</span>
            </div>
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="font-medium">{t.recruitment.slides.strategicConsulting.services.retention}</span>
            </div>
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg shadow-sm">
              <div className="p-2 bg-teal-100 rounded-full">
                <Target className="w-4 h-4 text-teal-600" />
              </div>
              <span className="font-medium">{t.recruitment.slides.strategicConsulting.services.culture}</span>
            </div>
          </div>
          
          <a href="/contact-us">
          <button className="bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] hover:from-sky-500 hover:to-sky-500 text-white py-3 px-8 rounded-full inline-flex items-center font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
            {t.recruitment.slides.strategicConsulting.cta}
            <span className="ml-2">→</span>
          </button>
          </a>
        </>
      )
    }
  ];

  return (
    <div className="flex flex-col w-full lg:flex-row">
      {/* Left Section */}
      <div className="w-full p-8 lg:w-1/2 lg:p-8">
        <div className="max-w-xl mx-auto">
          <h2 className="mb-6 text-5xl font-bold leading-tight lg:text-5xl">
            {t.recruitment.header.title.prefix} <span className="text-sky-500">{t.recruitment.header.title.highlight}</span> {t.recruitment.header.title.suffix}
          </h2>
          
          <p className="mb-8 text-lg leading-relaxed text-gray-600">
            {t.recruitment.header.description}
          </p>
          
          {/* Enhanced Image Section */}
          <div className="relative">
            <div className="overflow-hidden transition-transform duration-300 transform shadow-2xl bg-gradient-to-br from-sky-500 to-sky-500 rounded-2xl hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <img 
                src={t.recruitment.header.image.src}
                alt={t.recruitment.header.image.alt}
                className="object-cover w-full h-80"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section with Enhanced Vertical Carousel */}
      <div className="w-full p-8 lg:w-1/2 lg:p-8">
        <div className="relative p-8 overflow-hidden bg-white shadow-2xl rounded-3xl">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 translate-x-16 -translate-y-16 rounded-full opacity-50 bg-gradient-to-br from-blue-100 to-purple-100"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 -translate-x-12 translate-y-12 rounded-full opacity-50 bg-gradient-to-br from-emerald-100 to-blue-100"></div>
          
          <div className="relative z-10">
            {/* Carousel Navigation */}
            <div className="absolute top-0 right-0 z-20 flex flex-col space-y-2">
              <button 
                onClick={() => goToSlide((activeSlide - 1 + totalSlides) % totalSlides)}
                className="p-2 text-white transition-all duration-200 transform rounded-full shadow-lg bg-gradient-to-r from-sky-500 to-sky-500 hover:from-sky-500 hover:to-sky-500 hover:scale-110"
              >
                <ChevronUp size={18} />
              </button>
              <button 
                onClick={() => goToSlide((activeSlide + 1) % totalSlides)}
                className="p-2 text-white transition-all duration-200 transform rounded-full shadow-lg bg-gradient-to-r from-sky-500 to-sky-500 hover:from-sky-500 hover:to-sky-500 hover:scale-110"
              >
                <ChevronDown size={18} />
              </button>
            </div>
            
            {/* Carousel Indicators */}
            <div className="absolute z-20 flex flex-col space-y-2 right-16 top-2">
              {slides.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeSlide 
                      ? 'bg-sky-500 scale-125 shadow-lg' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            {/* Carousel Content */}
            <div className="relative">
              {slides.map((slide, index) => (
                <div 
                  key={index} 
                  className={`transition-all duration-500 ease-in-out ${
                    index === activeSlide 
                      ? 'opacity-100 transform translate-y-0 z-10 relative' 
                      : 'opacity-0 transform translate-y-4 z-0 absolute top-0 left-0 right-0'
                  }`}
                >
                  <div className="mb-4">
                    <h2 className="mb-2 text-3xl font-bold text-gray-800">{slide.title}</h2>
                    <p className="font-semibold text-sky-500">{slide.subtitle}</p>
                  </div>
                  <div className="pr-20">
                    {slide.content}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress bar */}
            <div className="pr-20 mt-6">
              <div className="w-full h-1 bg-gray-200 rounded-full">
                <div 
                  className="h-1 transition-all duration-300 rounded-full bg-gradient-to-r from-sky-500 to-sky-500"
                  style={{ width: `${((activeSlide + 1) / totalSlides) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentSection;