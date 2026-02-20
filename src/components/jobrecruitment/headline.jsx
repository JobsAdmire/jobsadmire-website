import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

// Import your translation files
import enTranslations from '../../../public/locales/en/jobrecruitmenthero.json';
import trTranslations from '../../../public/locales/tr/jobrecruitmenthero.json';
import frTranslations from '../../../public/locales/fr/jobrecruitmenthero.json';
import deTranslations from '../../../public/locales/de/jobrecruitmenthero.json';
import arTranslations from '../../../public/locales/ar/jobrecruitmenthero.json';
import ruTranslations from '../../../public/locales/ru/jobrecruitmenthero.json';
import faTranslations from '../../../public/locales/fa/jobrecruitmenthero.json';
const EnhancedScrollingHeadline = () => {
  const router = useRouter();
  const { locale } = router;
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const [previousScroll, setPreviousScroll] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(null);
  const containerRef = useRef(null);
  const primaryHeadlineRef = useRef(null);
  const secondaryHeadlineRef = useRef(null);
  
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
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollPos > previousScroll) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      setPreviousScroll(currentScrollPos);
      setScrollPosition(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [previousScroll]);

  // Primary and secondary headlines move in opposite directions
  const getPrimaryTransform = () => {
    if (scrollDirection === 'down') {
      return `translateX(-${scrollPosition * 0.4}px)`;
    } else {
      return `translateX(${scrollPosition * 0.4}px)`;
    }
  };

  const getSecondaryTransform = () => {
    if (scrollDirection === 'down') {
      return `translateX(${scrollPosition * 0.3}px)`;
    } else {
      return `translateX(-${scrollPosition * 0.3}px)`;
    }
  };

  // Background gradient that shifts with scroll
  const getGradientPosition = () => {
    return `${50 + (scrollPosition * 0.05) % 100}%`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full py-24 overflow-hidden"
      style={{ 
        background: `linear-gradient(120deg, rgba(186, 230, 253, 1) ${getGradientPosition()}, rgba(125, 211, 252, 1) 100%)`,
        boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Animated shapes in background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/20 backdrop-blur-sm"
            style={{
              width: `${Math.random() * 10 + 5}rem`,
              height: `${Math.random() * 10 + 5}rem`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translateX(${scrollDirection === 'down' ? -scrollPosition * 0.1 : scrollPosition * 0.1}px)`,
              transition: 'transform 0.5s ease-out'
            }}
          />
        ))}
      </div>

      {/* Primary headline row */}
      <div className="mb-6">
        <div 
          ref={primaryHeadlineRef}
          className="flex transition-transform duration-150 ease-out whitespace-nowrap"
          style={{ transform: getPrimaryTransform() }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="px-8 font-extrabold tracking-tighter text-teal-900 text-8xl opacity-90">
              {t.scrollingheadline.primary}
            </div>
          ))}
        </div>
      </div>

      {/* Secondary headline row */}
      <div>
        <div 
          ref={secondaryHeadlineRef}
          className="flex transition-transform duration-200 ease-out whitespace-nowrap"
          style={{ transform: getSecondaryTransform() }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="px-8 font-bold tracking-tight text-sky-600 text-7xl opacity-90">
              {t.scrollingheadline.secondary}
            </div>
          ))}
        </div>
      </div>

      {/* Vertical lines for visual interest */}
      <div className="absolute inset-0 flex justify-between pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="w-px h-full bg-gradient-to-b from-transparent via-sky-300/30 to-transparent"
          />
        ))}
      </div>

      {/* Subtle overlay */}
      <div 
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-sky-100/30 to-sky-100/5"
        style={{
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  );
};

export default EnhancedScrollingHeadline;