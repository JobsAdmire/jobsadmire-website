import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowRight } from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/jobrecruitmenthero.json';
import trTranslations from '../../../public/locales/tr/jobrecruitmenthero.json';
import frTranslations from '../../../public/locales/fr/jobrecruitmenthero.json';
import deTranslations from '../../../public/locales/de/jobrecruitmenthero.json';
import arTranslations from '../../../public/locales/ar/jobrecruitmenthero.json';
import ruTranslations from '../../../public/locales/ru/jobrecruitmenthero.json';
import faTranslations from '../../../public/locales/fa/jobrecruitmenthero.json';
const JobRecruitmentHeroSection = () => {
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

  // State for carousel position
  const [firstColumnIndex, setFirstColumnIndex] = useState(0);
  const [secondColumnIndex, setSecondColumnIndex] = useState(1);

  // Auto-scrolling effect for both carousels
  useEffect(() => {
    const firstInterval = setInterval(() => {
      setFirstColumnIndex((prevIndex) => 
        (prevIndex + 1) % t.jobrecruitmentfull.carousel.firstColumn.length
      );
    }, 3000);

    const secondInterval = setInterval(() => {
      setSecondColumnIndex((prevIndex) => 
        (prevIndex + 1) % t.jobrecruitmentfull.carousel.secondColumn.length
      );
    }, 4000); // Different timing to create staggered effect

    return () => {
      clearInterval(firstInterval);
      clearInterval(secondInterval);
    };
  }, [t.jobrecruitmentfull.carousel.firstColumn.length, t.jobrecruitmentfull.carousel.secondColumn.length]);

  return (
    <div className="relative py-16 overflow-hidden bg-white">
      <div className="container grid items-center gap-12 px-4 mx-auto md:grid-cols-2">
        {/* Left Side Content */}
        <div className="max-w-xl">
          {/* Main Heading */}
          <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-4xl">
            {t.jobrecruitmentfull.content.headline}
          </h1>
          
          {/* Description */}
          <p className="mb-8 text-lg text-gray-600">
            {t.jobrecruitmentfull.content.description}
          </p>
          
          {/* CTA Button */}
          <a href="/contact-us">
            <button className="inline-flex items-center px-8 py-3 font-medium text-white transition-all rounded-full bg-sky-500 hover:bg-sky-600">
              {t.jobrecruitmentfull.content.cta.text}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </a>
        </div>
        
        {/* Right Side Vertical Carousels */}
        <div className="grid grid-cols-2 gap-4 h-[500px]">
          {/* First Column Carousel */}
          <div className="relative h-full overflow-hidden rounded-2xl">
            <div 
              className="absolute inset-0 flex flex-col transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateY(-${firstColumnIndex * 100}%)` }}
            >
              {t.jobrecruitmentfull.carousel.firstColumn.map((image, index) => (
                <div key={index} className="relative flex-shrink-0 w-full h-full bg-sky-100">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900/70 to-transparent">
                    <div className="font-medium text-white">{image.name}</div>
                    <div className="text-sm text-sky-200">{image.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Second Column Carousel */}
          <div className="grid h-full grid-rows-2 gap-4">
            {/* Upper card in second column */}
            <div className="relative overflow-hidden rounded-2xl bg-rose-100">
              <div 
                className="absolute inset-0 flex flex-col transition-transform duration-700 ease-in-out" 
                style={{ transform: `translateY(-${secondColumnIndex * 100}%)` }}
              >
                {t.jobrecruitmentfull.carousel.secondColumn.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0 w-full h-full">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-0 left-0 right-0 flex justify-between p-4">
                      <div>
                        <div className="font-medium text-gray-900">{image.name}</div>
                        <div className="text-sm text-gray-700">{image.role}</div>
                      </div>
                      <div className={`px-3 py-1 text-xs rounded-full ${
                        image.location === 'Remote' ? 'bg-gray-900 text-white' : 
                        image.location === 'On-site' ? 'bg-gray-100 text-gray-900' : 
                        'bg-gray-700 text-gray-100'
                      }`}>
                        {image.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Lower card in second column - static image */}
            <div className="relative overflow-hidden rounded-2xl bg-sky-100">
              <img 
                src={t.jobrecruitmentfull.carousel.staticImage.src}
                alt={t.jobrecruitmentfull.carousel.staticImage.alt}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobRecruitmentHeroSection;