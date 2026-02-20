import React from 'react';
import { useRouter } from 'next/router';
import { Globe, Briefcase, Settings, Shield, Plane, Heart } from 'lucide-react';

// Import translation files for all 7 languages
import enTranslations from '../../../public/locales/en/china1.json';
import trTranslations from '../../../public/locales/tr/china1.json';
import frTranslations from '../../../public/locales/fr/china1.json';
import deTranslations from '../../../public/locales/de/china1.json';
import arTranslations from '../../../public/locales/ar/china1.json';
import ruTranslations from '../../../public/locales/ru/china1.json';
import faTranslations from '../../../public/locales/fa/china1.json';

const ChinaResidenceBenefitsSection = () => {
  const router = useRouter();
  const { locale } = router;

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

  const benefits = [
    {
      icon: Globe,
      title: t.benefits.legalResidency.title,
      description: t.benefits.legalResidency.description
    },
    {
      icon: Briefcase,
      title: t.benefits.workPermit.title,
      description: t.benefits.workPermit.description
    },
    {
      icon: Settings,
      title: t.benefits.banking.title,
      description: t.benefits.banking.description
    },
    {
      icon: Shield,
      title: t.benefits.socialInsurance.title,
      description: t.benefits.socialInsurance.description
    },
    {
      icon: Plane,
      title: t.benefits.familyReunification.title,
      description: t.benefits.familyReunification.description
    },
    {
      icon: Heart,
      title: t.benefits.permanentResidence.title,
      description: t.benefits.permanentResidence.description
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-sky-50 via-sky-100/30 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 bg-sky-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-48 h-48 bg-blue-300 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Main Benefits Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/50 relative overflow-hidden">
          
          {/* China Flag Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-sky-500 to-sky-700 relative">
              {/* China Flag inspired design */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32">
                  {/* Large star */}
                  <div className="absolute top-6 left-6 w-6 h-6 bg-white transform rotate-12"
                       style={{
                         clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                       }}>
                  </div>
                  {/* Small stars */}
                  <div className="absolute top-4 left-16 w-3 h-3 bg-white opacity-80 transform rotate-45"
                       style={{
                         clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                       }}>
                  </div>
                  <div className="absolute top-8 left-18 w-2 h-2 bg-white opacity-70 transform rotate-30"
                       style={{
                         clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                       }}>
                  </div>
                  <div className="absolute top-12 left-16 w-2 h-2 bg-white opacity-60 transform rotate-60"
                       style={{
                         clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                       }}>
                  </div>
                  <div className="absolute top-14 left-12 w-2 h-2 bg-white opacity-50 transform rotate-90"
                       style={{
                         clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                       }}>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="relative z-10 mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-sky-800 mb-4">
              <span className="text-sky-600">{t.header.benefits}</span> {t.header.ofChinaResidencePermit}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"></div>
          </div>

          {/* Benefits Grid */}
          <div className="grid lg:grid-cols-2 gap-8 relative z-10">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-sky-100"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg font-bold text-sky-800 mb-2 leading-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-sky-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center relative z-10">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
              <Globe className="w-5 h-5 mr-2" />
              {t.cta.getYourChinaResidencePermit}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ChinaResidenceBenefitsSection;