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
const jobrecruitmenthero1Section = () => {
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

  // Images for first carousel column
  const firstColumnImages = [
    {
      src: t.jobrecruitmenthero1.carousel.firstColumn.images[0].src,
      alt: t.jobrecruitmenthero1.carousel.firstColumn.images[0].alt,
      name: t.jobrecruitmenthero1.carousel.firstColumn.images[0].name,
      role: t.jobrecruitmenthero1.carousel.firstColumn.images[0].role,
    },
    {
      src: t.jobrecruitmenthero1.carousel.firstColumn.images[1].src,
      alt: t.jobrecruitmenthero1.carousel.firstColumn.images[1].alt,
      name: t.jobrecruitmenthero1.carousel.firstColumn.images[1].name,
      role: t.jobrecruitmenthero1.carousel.firstColumn.images[1].role,
    },
    {
      src: t.jobrecruitmenthero1.carousel.firstColumn.images[2].src,
      alt: t.jobrecruitmenthero1.carousel.firstColumn.images[2].alt,
      name: t.jobrecruitmenthero1.carousel.firstColumn.images[2].name,
      role: t.jobrecruitmenthero1.carousel.firstColumn.images[2].role,
    }
  ];

  // Images for second carousel column
  const secondColumnImages = [
    {
      src: t.jobrecruitmenthero1.carousel.secondColumn.images[0].src,
      alt: t.jobrecruitmenthero1.carousel.secondColumn.images[0].alt,
      name: t.jobrecruitmenthero1.carousel.secondColumn.images[0].name,
      role: t.jobrecruitmenthero1.carousel.secondColumn.images[0].role,
      location: t.jobrecruitmenthero1.carousel.secondColumn.images[0].location,
    },
    {
      src: t.jobrecruitmenthero1.carousel.secondColumn.images[1].src,
      alt: t.jobrecruitmenthero1.carousel.secondColumn.images[1].alt,
      name: t.jobrecruitmenthero1.carousel.secondColumn.images[1].name,
      role: t.jobrecruitmenthero1.carousel.secondColumn.images[1].role,
      location: t.jobrecruitmenthero1.carousel.secondColumn.images[1].location,
    },
    {
      src: t.jobrecruitmenthero1.carousel.secondColumn.images[2].src,
      alt: t.jobrecruitmenthero1.carousel.secondColumn.images[2].alt,
      name: t.jobrecruitmenthero1.carousel.secondColumn.images[2].name,
      role: t.jobrecruitmenthero1.carousel.secondColumn.images[2].role,
      location: t.jobrecruitmenthero1.carousel.secondColumn.images[2].location,
    }
  ];

  // State for carousel indices
  const [activeIndex1, setActiveIndex1] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);

  // Auto-scrolling effect with horizontal motion
  useEffect(() => {
    const firstInterval = setInterval(() => {
      setActiveIndex1((prevIndex) => 
        (prevIndex + 1) % firstColumnImages.length
      );
    }, 3500);

    const secondInterval = setInterval(() => {
      setActiveIndex2((prevIndex) => 
        (prevIndex + 1) % secondColumnImages.length
      );
    }, 4500); // Different timing for varied effect

    return () => {
      clearInterval(firstInterval);
      clearInterval(secondInterval);
    };
  }, []);

  return (
    <div className="relative py-16 overflow-hidden bg-white">
      <div className="container grid items-center gap-12 px-4 mx-auto md:grid-cols-2">
        {/* Left Side - Carousel (Moved from right) */}
        <div className="grid grid-cols-2 gap-6 h-[500px]">
          {/* First Column - Horizontal Slide Effect */}
          <div className="space-y-6">
            {/* Top card with horizontal carousel */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 h-3/5">
              <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" 
                   style={{ transform: `translateX(-${activeIndex1 * 100}%)` }}>
                {firstColumnImages.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0 w-full h-full">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-gray-900/80 to-transparent">
                      <span className="inline-block px-2 py-1 mb-1 text-xs text-white rounded-md bg-sky-500">
                        {index + 1}/{firstColumnImages.length}
                      </span>
                      <div className="font-medium text-white">{image.name}</div>
                      <div className="text-sm text-sky-100">{image.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Dots indicator */}
              <div className="absolute flex space-x-1 top-3 right-3">
                {firstColumnImages.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === activeIndex1 ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                    onClick={() => setActiveIndex1(index)}
                  />
                ))}
              </div>
            </div>
            
            {/* Bottom card - static with styled content */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 h-2/5">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <span className="px-3 py-1 mb-2 text-xs text-white bg-indigo-500 rounded-full">
                  {t.jobrecruitmenthero1.carousel.joinCard.badge}
                </span>
                <h3 className="text-lg font-bold text-gray-800">{t.jobrecruitmenthero1.carousel.joinCard.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{t.jobrecruitmenthero1.carousel.joinCard.description}</p>
              </div>
            </div>
          </div>
          
          {/* Second Column - Fade Effect */}
          <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50">
            {secondColumnImages.map((image, index) => (
              <div 
                key={index} 
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === activeIndex2 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="object-cover w-full h-full"
                />
                
                {/* Top info bar */}
                <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-4 bg-gradient-to-b from-gray-900/50 to-transparent">
                  <div>
                    <div className="font-medium text-white">{image.name}</div>
                    <div className="text-sm text-white/80">{image.role}</div>
                  </div>
                  <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                    image.location === t.jobrecruitmenthero1.locationLabels.remote ? 'bg-emerald-500 text-white' : 
                    image.location === t.jobrecruitmenthero1.locationLabels.onsite ? 'bg-amber-400 text-gray-900' : 
                    'bg-indigo-500 text-white'
                  }`}>
                    {image.location}
                  </div>
                </div>
                
                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                
                {/* Side indicator bar */}
                <div className="absolute flex flex-col space-y-1 transform -translate-y-1/2 left-4 top-1/2">
                  {secondColumnImages.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-8 w-1 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex2 ? 'bg-white' : 'bg-white/30'
                      }`}
                      onClick={() => setActiveIndex2(idx)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Side Content (Moved from left) */}
        <div className="max-w-xl">
          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-4xl">
            {t.jobrecruitmenthero1.content.headline}
          </h1>
          
          {/* Description */}
          <p className="mb-8 text-lg text-gray-600">
            {t.jobrecruitmenthero1.content.description}
          </p>
          
          {/* CTA Button */}
          <a href="/contact-us">
            <button className="inline-flex items-center px-8 py-3 font-medium text-white transition-all rounded-full shadow-lg bg-sky-500 hover:bg-sky-500 hover:shadow-xl">
              {t.jobrecruitmenthero1.content.cta}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </a>
          
          {/* Feature tags */}
          <div className="flex flex-wrap gap-3 mt-8">
            {t.jobrecruitmenthero1.content.featureTags.map((tag, index) => (
              <span key={index} className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default jobrecruitmenthero1Section;