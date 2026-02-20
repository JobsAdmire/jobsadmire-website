import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Star, FileText, Shield, User, Clock, Award, ArrowRight } from 'lucide-react';

// Import translation files for all 7 languages
import enTranslations from '../../../public/locales/en/turkeychoose.json';
import trTranslations from '../../../public/locales/tr/turkeychoose.json';
import frTranslations from '../../../public/locales/fr/turkeychoose.json';
import deTranslations from '../../../public/locales/de/turkeychoose.json';
import arTranslations from '../../../public/locales/ar/turkeychoose.json';
import ruTranslations from '../../../public/locales/ru/turkeychoose.json';
import faTranslations from '../../../public/locales/fa/turkeychoose.json';

const WhyChooseSection = () => {
  const { locale } = useRouter();
  const { t: tCommon } = useTranslation('common');
  
  const getTranslations = () => {
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

  const t = getTranslations();

  const [activeCard, setActiveCard] = useState(0);

  const reasons = [
    {
      icon: Star,
      title: t.reasons.expertGuidance.title,
      shortDesc: t.reasons.expertGuidance.shortDesc,
      fullDesc: t.reasons.expertGuidance.fullDesc,
    },
    {
      icon: FileText,
      title: t.reasons.documentSupport.title,
      shortDesc: t.reasons.documentSupport.shortDesc,
      fullDesc: t.reasons.documentSupport.fullDesc,
    },
    {
      icon: Shield,
      title: t.reasons.legalCompliance.title,
      shortDesc: t.reasons.legalCompliance.shortDesc,
      fullDesc: t.reasons.legalCompliance.fullDesc,
    },
    {
      icon: User,
      title: t.reasons.caseManager.title,
      shortDesc: t.reasons.caseManager.shortDesc,
      fullDesc: t.reasons.caseManager.fullDesc,
    },
    {
      icon: Clock,
      title: t.reasons.fastProcessing.title,
      shortDesc: t.reasons.fastProcessing.shortDesc,
      fullDesc: t.reasons.fastProcessing.fullDesc,
    },
    {
      icon: Award,
      title: t.reasons.successRate.title,
      shortDesc: t.reasons.successRate.shortDesc,
      fullDesc: t.reasons.successRate.fullDesc,
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % reasons.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reasons.length]);

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(56,189,248,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_rgba(14,165,233,0.1)_0%,_transparent_50%)]"></div>
      </div>

      <div className="relative z-10 w-full px-6 mx-auto max-w-7xl lg:px-8">
        {/* Main Content Card */}
        <div className="relative p-8 overflow-hidden bg-white shadow-2xl lg:p-12 rounded-3xl">
          {/* Decorative corner element */}
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-sky-500 to-blue-600 rounded-tr-3xl"></div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Side - Image */}
            <div className="relative">
              <div className="relative overflow-hidden shadow-2xl rounded-3xl h-full min-h-[400px]">
                <img 
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop" 
                  alt={tCommon("labels.general.whyChooseUsAlt")}
                  className="object-cover w-full h-full"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/50 to-transparent"></div>
                
                {/* Floating badge */}
               
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center">
              {/* Header */}
              <div className="mb-8">
                
                <h2 className="mb-4 text-4xl font-black leading-tight lg:text-5xl text-sky-900">
                  When You{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10">{t.header.titleHighlight}</span>
                    <span className="absolute bottom-2 left-0 right-0 h-3 bg-sky-400 -z-0"></span>
                  </span>{' '}
                  It Most
                </h2>
                <p className="text-lg leading-relaxed text-sky-700">
                  {t.header.subtitle}
                </p>
              </div>

              {/* Features Grid - 2x3 */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {reasons.map((reason, index) => {
                  const Icon = reason.icon;
                  
                  return (
                    <div 
                      key={index}
                      className="relative transition-all duration-300 cursor-pointer group"
                      onClick={() => setActiveCard(index)}
                      onMouseEnter={() => setActiveCard(index)}
                    >
                      <div className={`
                        flex items-start gap-4 p-4 transition-all duration-300 border-2 rounded-2xl
                        ${index === activeCard 
                          ? 'bg-sky-50 border-sky-400 shadow-lg' 
                          : 'bg-white border-sky-100 hover:border-sky-300 hover:shadow-md'
                        }
                      `}>
                        {/* Icon */}
                        <div className={`
                          flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                          ${index === activeCard 
                            ? 'bg-gradient-to-br from-sky-400 to-blue-600' 
                            : 'bg-sky-100 group-hover:bg-sky-200'
                          }
                        `}>
                          <Icon className={`w-6 h-6 ${index === activeCard ? 'text-white' : 'text-sky-600'}`} strokeWidth={2.5} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="mb-1 text-lg font-bold text-sky-900">
                            {reason.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-sky-600">
                            {reason.shortDesc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              {/* <div className="mt-8">
                <button className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl hover:shadow-2xl hover:scale-105 group">
                  <span>Get Started Today</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
       
      </div>
    </section>
  );
};

export default WhyChooseSection;