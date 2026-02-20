import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Star, FileText, Shield, User, Clock, Award, ArrowRight, Sparkles } from 'lucide-react';

// Import translation files for all 7 languages
import enTranslations from '../../../public/locales/en/albania2.json';
import trTranslations from '../../../public/locales/tr/albania2.json';
import frTranslations from '../../../public/locales/fr/albania2.json';
import deTranslations from '../../../public/locales/de/albania2.json';
import arTranslations from '../../../public/locales/ar/albania2.json';
import ruTranslations from '../../../public/locales/ru/albania2.json';
import faTranslations from '../../../public/locales/fa/albania2.json';

// Translation function
const getTranslations = (locale) => {
  switch (locale) {
    case 'tr': return trTranslations;
    case 'fr': return frTranslations;
    case 'de': return deTranslations;
    case 'ar': return arTranslations;
    case 'ru': return ruTranslations;
    case 'fa': return faTranslations;
    default: return enTranslations;
  }
};

const WhyChooseSection = () => {
  const router = useRouter();
  const { locale } = router;
  const t = getTranslations(locale);

  const [activeCard, setActiveCard] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const reasons = [
    {
      icon: Star,
      title: t.reasons.expertGuidance.title,
      shortDesc: t.reasons.expertGuidance.shortDesc,
      fullDesc: t.reasons.expertGuidance.fullDesc,
      image: "https://images.unsplash.com/photo-1564489563601-c0f22e7e6b59?w=600&h=400&fit=crop&crop=center",
      color: "from-sky-400 via-blue-500 to-sky-600",
      lightColor: "from-sky-100 to-blue-100"
    },
    {
      icon: FileText,
      title: t.reasons.documentSupport.title,
      shortDesc: t.reasons.documentSupport.shortDesc,
      fullDesc: t.reasons.documentSupport.fullDesc,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop&crop=center",
      color: "from-blue-400 via-sky-500 to-blue-600",
      lightColor: "from-blue-100 to-sky-100"
    },
    {
      icon: Shield,
      title: t.reasons.legalCompliance.title,
      shortDesc: t.reasons.legalCompliance.shortDesc,
      fullDesc: t.reasons.legalCompliance.fullDesc,
      image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=400&fit=crop&crop=center",
      color: "from-sky-500 via-blue-600 to-sky-700",
      lightColor: "from-sky-100 to-blue-100"
    },
    {
      icon: User,
      title: t.reasons.caseManager.title,
      shortDesc: t.reasons.caseManager.shortDesc,
      fullDesc: t.reasons.caseManager.fullDesc,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center",
      color: "from-blue-500 via-sky-600 to-blue-700",
      lightColor: "from-blue-100 to-sky-100"
    },
    {
      icon: Clock,
      title: t.reasons.fastProcessing.title,
      shortDesc: t.reasons.fastProcessing.shortDesc,
      fullDesc: t.reasons.fastProcessing.fullDesc,
      image: "https://images.unsplash.com/photo-1563230130-9fc9c1ced69b?w=600&h=400&fit=crop&crop=center",
      color: "from-sky-600 via-blue-700 to-sky-800",
      lightColor: "from-sky-100 to-blue-100"
    },
    {
      icon: Award,
      title: t.reasons.successRate.title,
      shortDesc: t.reasons.successRate.shortDesc,
      fullDesc: t.reasons.successRate.fullDesc,
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c17a?w=600&h=400&fit=crop&crop=center",
      color: "from-sky-500 via-blue-600 to-sky-700",
      lightColor: "from-sky-100 to-blue-100"
    }
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setActiveCard((prev) => (prev + 1) % reasons.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, reasons.length]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section className="py-24 bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 relative overflow-hidden min-h-screen flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-sky-200/40 to-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-200/40 to-sky-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-sky-300/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-sky-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-md rounded-full text-sky-700 text-sm font-semibold mb-8 border border-sky-200/50">
            <Sparkles className="w-4 h-4 mr-2 text-sky-500" />
            {t.header.badge}
          </div>
          <h2 className="text-6xl lg:text-7xl font-black text-sky-900 mb-6 leading-tight">
            {t.header.title.line1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-sky-700">
              {t.header.title.highlight}
            </span>
          </h2>
          <p className="text-xl text-sky-600 max-w-4xl mx-auto leading-relaxed">
            {t.header.description}
          </p>
        </div>

        {/* Revolutionary Card Layout */}
        <div className="relative">
          {/* Main Display Card */}
          <div className="flex justify-center mb-12">
            <div 
              className="relative w-full max-w-4xl h-96 rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/40"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div className="absolute inset-0">
                <img 
                  src={reasons[activeCard].image}
                  alt={reasons[activeCard].title}
                  className="w-full h-full object-cover scale-110 transition-transform duration-1000"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${reasons[activeCard].color} mix-blend-multiply opacity-60`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/70 via-sky-800/30 to-transparent"></div>
              </div>

              {/* Mouse follower effect */}
              <div 
                className="absolute w-32 h-32 bg-gradient-to-r from-white/30 to-sky-200/20 rounded-full blur-2xl pointer-events-none transition-all duration-300"
                style={{
                  left: mousePosition.x - 64,
                  top: mousePosition.y - 64,
                }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex items-end p-8">
                <div className="w-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${reasons[activeCard].color} rounded-2xl flex items-center justify-center shadow-2xl`}>
                      {React.createElement(reasons[activeCard].icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      {String(activeCard + 1).padStart(2, '0')} / {String(reasons.length).padStart(2, '0')}
                    </div>
                  </div>
                  
                  <h3 className="text-4xl font-bold text-white mb-3">
                    {reasons[activeCard].title}
                  </h3>
                  
                  <p className="text-xl text-white/90 mb-6 max-w-2xl">
                    {reasons[activeCard].fullDesc}
                  </p>

                  <button className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-md text-sky-700 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 border border-white/50 shadow-lg">
                    {t.buttons.learnMore}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-200/40">
                <div 
                  className={`h-full bg-gradient-to-r ${reasons[activeCard].color} transition-all duration-300`}
                  style={{ width: `${((activeCard + 1) / reasons.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Carousel Navigation */}
          <div className="flex justify-center space-x-4 mb-12">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              const isActive = index === activeCard;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    setActiveCard(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`group relative p-4 rounded-2xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-white/80 backdrop-blur-md scale-110 shadow-2xl border border-sky-200/50' 
                      : 'bg-white/40 hover:bg-white/60 hover:scale-105 border border-sky-100/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-r ${reason.color} shadow-lg` 
                      : 'bg-sky-100/60 group-hover:bg-sky-200/60'
                  }`}>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-sky-600 group-hover:text-sky-700'}`} />
                  </div>
                  
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              
              return (
                <div
                  key={index}
                  className={`group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    index === activeCard
                      ? `bg-white/90 backdrop-blur-md border-sky-300/50 scale-105 shadow-2xl`
                      : 'bg-white/50 backdrop-blur-md border-sky-200/30 hover:bg-white/70 hover:scale-105 hover:border-sky-300/40'
                  }`}
                  onClick={() => setActiveCard(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      index === activeCard
                        ? `bg-gradient-to-r ${reason.color} shadow-lg`
                        : 'bg-sky-100/80 group-hover:bg-sky-200/80'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        index === activeCard ? 'text-white' : 'text-sky-600 group-hover:text-sky-700'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-bold mb-2 transition-colors duration-300 ${
                        index === activeCard ? 'text-sky-900' : 'text-sky-700 group-hover:text-sky-800'
                      }`}>
                        {reason.title}
                      </h4>
                      <p className={`text-sm transition-colors duration-300 ${
                        index === activeCard ? 'text-sky-600' : 'text-sky-500 group-hover:text-sky-600'
                      }`}>
                        {reason.shortDesc}
                      </p>
                    </div>
                  </div>

                  {index === activeCard && (
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-200/20 to-transparent rounded-2xl animate-shimmer" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseSection;