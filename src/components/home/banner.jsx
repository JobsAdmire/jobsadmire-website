import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';

// Intersection Observer Hook for animations
const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

const ServiceBanner = ({ 
  variant = "default", // New prop to select banner variant
  customTitle = "",
  customSubtitle = "",
  customDescription = "",
  customButtonText = "",
  customButtonLink = "",
  customServiceLabel = ""
}) => {
  const { t } = useTranslation('common');
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  
  // Get translations based on variant or use custom props
  const getContent = () => {
    if (customTitle || customDescription || customButtonText || customServiceLabel) {
      // Use custom props if provided
      return {
        serviceLabel: customServiceLabel || t('serviceBanner.default.serviceLabel'),
        title: customTitle || t('serviceBanner.default.title'),
        description: customDescription || t('serviceBanner.default.description'),
        buttonText: customButtonText || t('serviceBanner.default.buttonText')
      };
    } else {
      // Use predefined variant or default
      const basePath = variant === "default" 
        ? 'serviceBanner.default' 
        : `serviceBanner.variants.${variant}`;
      
      return {
        serviceLabel: t(`${basePath}.serviceLabel`),
        title: t(`${basePath}.title`),
        description: t(`${basePath}.description`),
        buttonText: t(`${basePath}.buttonText`)
      };
    }
  };

  const content = getContent();
  const buttonLink = customButtonLink || "/services"; // Default link
  
  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background elements */}
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Call to Action Section */}
        <div 
          ref={ref}
          className={`relative overflow-hidden shadow-2xl rounded-3xl transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-indigo-700"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 transform bg-white rounded-full opacity-10 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 transform bg-white rounded-full opacity-10 -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-between p-12 md:p-16 md:flex-row">
            <div className="mb-8 md:mb-0 md:mr-8">
              <div className="flex items-center mb-4">
                <div className="p-2 mr-3 bg-white rounded-lg bg-opacity-20">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-white">{content.serviceLabel}</h3>
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                {content.title}
              </h2>
              <p className="max-w-xl mb-8 text-sky-100 md:mb-0">
                {content.description}
              </p>
            </div>
            
            <div>
              <a href={buttonLink}>
                <button className="flex items-center px-8 py-4 font-semibold transition-all bg-white whitespace-nowrap text-sky-600 rounded-xl hover:shadow-lg group hover:scale-105 transform duration-300">
                  {content.buttonText}
                  <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBanner;