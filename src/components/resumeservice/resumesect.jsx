import React from 'react';
import { useRouter } from 'next/router';
import { Lightbulb, Leaf, CheckCircle, Star, Award, Users } from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/resumeservice.json';
import trTranslations from '../../../public/locales/tr/resumeservice.json';
import frTranslations from '../../../public/locales/fr/resumeservice.json';
import deTranslations from '../../../public/locales/de/resumeservice.json';
import arTranslations from '../../../public/locales/ar/resumeservice.json';
import ruTranslations from '../../../public/locales/ru/resumeservice.json';
import faTranslations from '../../../public/locales/fa/resumeservice.json';
const ResumeServiceSection = () => {
  const router = useRouter();
  const { locale } = router;

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

  return (
    <div className="relative w-full p-8 overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 ">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-32 h-32 rounded-full top-20 right-10 bg-gradient-to-br from-sky-200 to-blue-300 blur-xl"></div>
        <div className="absolute w-24 h-24 rounded-full bottom-32 left-16 bg-gradient-to-br from-indigo-200 to-purple-300 blur-lg"></div>
        <div className="absolute w-16 h-16 rounded-full top-1/2 right-1/4 bg-gradient-to-br from-pink-200 to-rose-300 blur-md"></div>
      </div>

      {/* Animated decorative dots */}
      <div className="absolute space-y-3 top-16 right-8">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-between mx-auto lg:flex-row">
        {/* Left content section */}
        <div className="pr-8 mb-12 lg:w-1/2 lg:mb-0">
          {/* Trust indicators */}
      

          <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 lg:text-5xl">
            {t.resumeservice.expertSection.headline.start} <span className="text-transparent bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text">{t.resumeservice.expertSection.headline.expert}</span> {t.resumeservice.expertSection.headline.who} 
            <span className="font-black text-gray-900"> {t.resumeservice.expertSection.headline.understands}</span> {t.resumeservice.expertSection.headline.your} <span className="font-black text-gray-900">{t.resumeservice.expertSection.headline.position}</span>
          </h1>
          
          <p className="mb-8 text-lg leading-relaxed text-gray-600">
            {t.resumeservice.expertSection.description}
          </p>
          
          {/* Key benefits */}
          <div className="mb-8 space-y-3">
            {t.resumeservice.expertSection.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
          
          <p className="mb-8 leading-relaxed text-gray-600">
            <a href="#process" className="font-medium underline text-sky-600 hover:text-sky-800 decoration-2 underline-offset-2">{t.resumeservice.expertSection.processLink.text}</a> {t.resumeservice.expertSection.processLink.description} <a href="#service" className="font-medium underline text-sky-600 hover:text-sky-800 decoration-2 underline-offset-2">{t.resumeservice.expertSection.serviceLink.text}</a>,
            {t.resumeservice.expertSection.serviceLink.description}
          </p>
          
          <div className="flex flex-col gap-4 mb-10 sm:flex-row">
            <a href="/resume-generator">
            <button className="px-8 py-4 font-bold text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 hover:shadow-xl hover:-translate-y-1">
              {t.resumeservice.expertSection.cta.text}
            </button>
           </a>
          </div>
          
         
        </div>
        
        {/* Right image section with enhanced design */}
        <div className="relative lg:w-1/2">
          <div className="relative mx-auto w-96 h-96">
            {/* Main circular background with gradient */}
            <div className="absolute inset-0 rounded-full shadow-2xl bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100"></div>
            
            {/* Person image */}
            <div className="absolute overflow-hidden rounded-full shadow-xl inset-4">
              <img 
                src={t.resumeservice.expertSection.image.src} 
                alt={t.resumeservice.expertSection.image.alt} 
                className="object-cover w-full h-full"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4">
              <div className="p-4 bg-white rounded-full shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                <Lightbulb className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            
            <div className="absolute top-8 -right-8">
              <div className="p-3 rounded-full shadow-lg bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="absolute -bottom-6 right-12">
              <div className="p-3 rounded-full shadow-lg bg-gradient-to-r from-purple-400 to-pink-500">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Decorative leaves with better positioning */}
            <div className="absolute bottom-8 -right-12">
              <Leaf className="w-12 h-12 transform rotate-45 text-sky-400 animate-pulse" />
              <Leaf className="absolute w-8 h-8 text-emerald-400 -top-6 left-8 animate-pulse" style={{ animationDelay: '1s' }} />
              <Leaf className="absolute w-10 h-10 text-teal-400 transform -top-12 -left-4 -rotate-15 animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
            
            {/* Additional decorative elements */}
            <div className="absolute transform -translate-y-1/2 -left-8 top-1/2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 animate-ping"></div>
            </div>
            
            <div className="absolute -right-6 bottom-1/4">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 animate-pulse"></div>
            </div>
          </div>
          
         
        </div>
      </div>
    </div>
  );
};

export default ResumeServiceSection;