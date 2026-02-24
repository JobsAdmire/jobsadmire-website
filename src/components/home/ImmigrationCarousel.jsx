import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink, Star, Users, Award, Globe } from 'lucide-react';
import { useCms } from '@/lib/context/CmsContext';

const ICON_MAP = {
  Globe: <Globe className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  Star: <Star className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
};

const COUNTRY_IMAGES = {
  canada: "https://images.unsplash.com/photo-1503756234508-e32369269deb?w=800&h=600&fit=crop",
  "united-kingdom": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
  "united-states": "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop",
  australia: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  turkey: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop",
};

const PremiumImmigrationCarousel = () => {
  const { t } = useTranslation('common');
  const { destinations: cmsDestinations } = useCms();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const intervalRef = useRef(null);

  const buildFromCms = () => {
    if (!cmsDestinations?.length) return null;
    return cmsDestinations
      .filter((d) => d.visible !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((dest) => {
        const content = dest.contents?.[0] || {};
        return {
          id: dest.id,
          title: content.title || dest.slug,
          subtitle: content.subtitle || "",
          description: content.description || "",
          image: dest.image?.url || COUNTRY_IMAGES[dest.slug] || COUNTRY_IMAGES.canada,
          category: content.title || "",
          rating: dest.rating ?? 4.8,
          clients: dest.clientCount || "",
          icon: ICON_MAP[dest.slug] || <Globe className="w-6 h-6" />,
          gradient: dest.gradient || "from-sky-400 via-sky-500 to-blue-500",
          glowColor: "sky-500/40",
          link: dest.link || `/immigration/immigrate-to-${dest.slug}`,
          buttonText: t('immigrationCarousel.common.learnMore', { defaultValue: 'Learn More' }),
        };
      });
  };

  const fallbackServices = [
    { id: 1, title: t('immigrationCarousel.services.canada.title', { defaultValue: 'Canada' }), subtitle: t('immigrationCarousel.services.canada.subtitle', { defaultValue: '' }), description: t('immigrationCarousel.services.canada.description', { defaultValue: '' }), image: COUNTRY_IMAGES.canada, category: t('immigrationCarousel.services.canada.category', { defaultValue: '' }), rating: 4.9, clients: "25,000+", icon: <Globe className="w-6 h-6" />, gradient: "from-sky-400 via-sky-500 to-blue-500", glowColor: "sky-500/40", link: "/immigration/immigrate-to-canada", buttonText: t('immigrationCarousel.services.canada.buttonText', { defaultValue: 'Learn More' }) },
    { id: 2, title: t('immigrationCarousel.services.uk.title', { defaultValue: 'United Kingdom' }), subtitle: t('immigrationCarousel.services.uk.subtitle', { defaultValue: '' }), description: t('immigrationCarousel.services.uk.description', { defaultValue: '' }), image: COUNTRY_IMAGES["united-kingdom"], category: t('immigrationCarousel.services.uk.category', { defaultValue: '' }), rating: 4.8, clients: "18,000+", icon: <Award className="w-6 h-6" />, gradient: "from-blue-400 via-sky-500 to-cyan-500", glowColor: "blue-500/40", link: "/immigration/immigrate-to-uk", buttonText: t('immigrationCarousel.services.uk.buttonText', { defaultValue: 'Learn More' }) },
    { id: 3, title: t('immigrationCarousel.services.usa.title', { defaultValue: 'United States' }), subtitle: t('immigrationCarousel.services.usa.subtitle', { defaultValue: '' }), description: t('immigrationCarousel.services.usa.description', { defaultValue: '' }), image: COUNTRY_IMAGES["united-states"], category: t('immigrationCarousel.services.usa.category', { defaultValue: '' }), rating: 4.9, clients: "30,000+", icon: <Star className="w-6 h-6" />, gradient: "from-sky-500 via-blue-500 to-sky-600", glowColor: "sky-500/40", link: "/immigration/immigrate-to-usa", buttonText: t('immigrationCarousel.services.usa.buttonText', { defaultValue: 'Learn More' }) },
    { id: 4, title: t('immigrationCarousel.services.australia.title', { defaultValue: 'Australia' }), subtitle: t('immigrationCarousel.services.australia.subtitle', { defaultValue: '' }), description: t('immigrationCarousel.services.australia.description', { defaultValue: '' }), image: COUNTRY_IMAGES.australia, category: t('immigrationCarousel.services.australia.category', { defaultValue: '' }), rating: 4.7, clients: "22,000+", icon: <Users className="w-6 h-6" />, gradient: "from-cyan-400 via-sky-400 to-blue-500", glowColor: "cyan-500/40", link: "/immigration/immigrate-to-australia", buttonText: t('immigrationCarousel.services.australia.buttonText', { defaultValue: 'Learn More' }) },
    { id: 5, title: t('immigrationCarousel.services.turkey.title', { defaultValue: 'Turkey' }), subtitle: t('immigrationCarousel.services.turkey.subtitle', { defaultValue: '' }), description: t('immigrationCarousel.services.turkey.description', { defaultValue: '' }), image: COUNTRY_IMAGES.turkey, category: t('immigrationCarousel.services.turkey.category', { defaultValue: '' }), rating: 4.8, clients: "15,000+", icon: <Globe className="w-6 h-6" />, gradient: "from-sky-300 via-sky-400 to-blue-400", glowColor: "sky-400/40", link: "/immigration/immigrate-to-turkey", buttonText: t('immigrationCarousel.services.turkey.buttonText', { defaultValue: 'Learn More' }) },
  ];

  const immigrationServices = buildFromCms() || fallbackServices;

  const totalSlides = immigrationServices.length;

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, isHovered, totalSlides]);

  // Navigation functions
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAutoPlaying]);

  const getSlideStyle = (index) => {
    const offset = index - currentSlide;
    const absOffset = Math.abs(offset);
    
    let transform = '';
    let opacity = 1;
    let scale = 1;
    let zIndex = 10;
    let blur = 0;

    if (offset === 0) {
      // Current slide - center stage
      transform = 'translateX(0) rotateY(0deg)';
      scale = 1;
      zIndex = 30;
    } else if (offset === 1 || (offset === -(totalSlides - 1))) {
      // Next slide
      transform = 'translateX(120%) rotateY(-25deg)';
      scale = 0.85;
      opacity = 0.7;
      zIndex = 20;
      blur = 1;
    } else if (offset === -1 || (offset === totalSlides - 1)) {
      // Previous slide
      transform = 'translateX(-120%) rotateY(25deg)';
      scale = 0.85;
      opacity = 0.7;
      zIndex = 20;
      blur = 1;
    } else {
      // Hidden slides
      transform = offset > 0 ? 'translateX(200%) rotateY(-45deg)' : 'translateX(-200%) rotateY(45deg)';
      scale = 0.6;
      opacity = 0;
      zIndex = 10;
      blur = 3;
    }

    return {
      transform: `${transform} scale(${scale})`,
      opacity,
      zIndex,
      filter: `blur(${blur}px)`,
      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-sky-200 via-sky-100 to-blue-100 overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.06),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(125,211,252,0.04),transparent_50%)]"></div>
        
        {/* Enhanced floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-sky-400 to-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      <div 
        className="relative py-20 px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-sky-600 bg-clip-text text-transparent mb-6">
            {t('immigrationCarousel.header.title', { defaultValue: 'Global Immigration Destinations' })}
          </h2>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
            {t('immigrationCarousel.header.description', { 
              defaultValue: 'Explore premium immigration pathways to your dream destination' 
            })}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[600px] flex items-center justify-center perspective-1000">
          {immigrationServices.map((service, index) => (
            <div
              key={service.id}
              className="absolute w-full max-w-md sm:max-w-lg"
              style={getSlideStyle(index)}
            >
              <div className="relative group cursor-pointer">
                {/* Enhanced glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${service.gradient} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700`}></div>
                
                {/* Enhanced main card */}
                <div className="relative bg-white/95 backdrop-blur-3xl border border-sky-200/50 rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/60">
                  {/* Image section */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60`}></div>
                    
                    {/* Enhanced category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md border border-sky-200 rounded-full text-slate-700 text-sm font-medium shadow-lg">
                        {service.category}
                      </span>
                    </div>

                    {/* Enhanced rating badge */}
                    <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 backdrop-blur-md border border-sky-200 rounded-full px-3 py-1 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-slate-700 text-sm font-medium">{service.rating}</span>
                    </div>
                  </div>

                  {/* Enhanced content section */}
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2 bg-gradient-to-r ${service.gradient} rounded-xl text-white shadow-lg`}>
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          {service.title}
                        </h3>
                        <p className="text-slate-600 text-sm">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-700 text-base leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-sky-600" />
                          <span className="text-slate-600 text-sm">
                            {service.clients} {t('immigrationCarousel.common.clients', { defaultValue: 'clients' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced CTA Button with Custom Text */}
                    <button 
                      className={`w-full bg-gradient-to-r ${service.gradient} text-white font-bold py-4 px-6 rounded-xl hover:shadow-2xl hover:shadow-${service.glowColor} transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105 shadow-lg text-lg`}
                      onClick={() => window.open(service.link, '_blank')}
                    >
                      <span>{service.buttonText}</span>
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Navigation Controls */}
        <div className="flex items-center justify-center space-x-8 mt-12">
          {/* Enhanced Previous button */}
          <button
            onClick={prevSlide}
            className="p-4 bg-white/80 backdrop-blur-md border border-sky-200 rounded-full text-slate-700 hover:bg-white hover:border-sky-300 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-sky-200/50"
            aria-label={t('immigrationCarousel.navigation.previous', { defaultValue: 'Previous slide' })}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Enhanced Dot indicators */}
          <div className="flex space-x-3">
            {immigrationServices.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-gradient-to-r from-sky-400 to-blue-500 scale-125 shadow-lg shadow-sky-400/50' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={t('immigrationCarousel.navigation.goToSlide', { 
                  defaultValue: 'Go to slide {{number}}',
                  number: index + 1 
                })}
              />
            ))}
          </div>

          {/* Enhanced Next button */}
          <button
            onClick={nextSlide}
            className="p-4 bg-white/80 backdrop-blur-md border border-sky-200 rounded-full text-slate-700 hover:bg-white hover:border-sky-300 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-sky-200/50"
            aria-label={t('immigrationCarousel.navigation.next', { defaultValue: 'Next slide' })}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Enhanced Auto-play control */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-sky-200 rounded-full text-slate-700 hover:bg-white hover:border-sky-300 transition-all duration-300 shadow-lg"
            aria-label={isAutoPlaying 
              ? t('immigrationCarousel.navigation.pause', { defaultValue: 'Pause autoplay' })
              : t('immigrationCarousel.navigation.play', { defaultValue: 'Play autoplay' })
            }
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-sm">
              {isAutoPlaying 
                ? t('immigrationCarousel.navigation.pauseText', { defaultValue: 'Pause' })
                : t('immigrationCarousel.navigation.playText', { defaultValue: 'Play' })
              }
            </span>
          </button>
        </div>

        {/* Enhanced Progress bar */}
        <div className="mt-6 w-full max-w-md mx-auto">
          <div className="h-1 bg-sky-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PremiumImmigrationCarousel;  