import React from 'react';
import { useRouter } from 'next/router';
import { Clock, Users, Shield, TrendingUp, Zap, Award, CheckCircle, Star } from 'lucide-react';

// Import translation files for all 7 languages
import enTranslations from '../../../public/locales/en/whychoose.json';
import trTranslations from '../../../public/locales/tr/whychoose.json';
import frTranslations from '../../../public/locales/fr/whychoose.json';
import deTranslations from '../../../public/locales/de/whychoose.json';
import arTranslations from '../../../public/locales/ar/whychoose.json';
import ruTranslations from '../../../public/locales/ru/whychoose.json';
import faTranslations from '../../../public/locales/fa/whychoose.json';

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

export default function WhyChooseUsSection() {
  const router = useRouter();
  const { locale } = router;
  const t = getTranslations(locale);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: t.features.fastHassleFree.title,
      description: t.features.fastHassleFree.description,
      gradient: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t.features.expertSupport.title,
      description: t.features.expertSupport.description,
      gradient: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t.features.secureConfidential.title,
      description: t.features.secureConfidential.description,
      gradient: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t.features.highApprovalRate.title,
      description: t.features.highApprovalRate.description,
      gradient: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  const stats = [
    
    { number: t.stats.successRate.number, label: t.stats.successRate.label, icon: <TrendingUp className="w-6 h-6" /> },
    { number: t.stats.support.number, label: t.stats.support.label, icon: <Clock className="w-6 h-6" /> },
    
  ];

  const achievements = [
    t.achievements.iso27001,
    
    t.achievements.aiPowered,
    t.achievements.realTimeTracking
  ];

  return (
    <div className="relative px-4 py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-sky-200 opacity-20 blur-3xl"></div>
        <div className="absolute bg-blue-200 rounded-full -bottom-40 -left-40 w-80 h-80 opacity-20 blur-3xl"></div>
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-96 h-96 bg-cyan-100 opacity-10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center px-4 py-2 mb-6 space-x-2 text-sm font-medium rounded-full bg-sky-100 text-sky-700">
            <CheckCircle className="w-4 h-4" />
            <span>{t.header.badge}</span>
          </div>
          
          
           <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
            {t.header.title.line1} {t.header.title.line2} 
               
            </span>
            
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-slate-600">
            {t.header.description}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-6 mb-20 md:grid-cols-2">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="p-6 transition-all duration-300 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl hover:shadow-xl border-white/50 group-hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 transition-colors bg-sky-100 rounded-xl text-sky-600 group-hover:bg-sky-200">
                  {stat.icon}
                </div>
                <div className="mb-2 text-3xl font-bold text-slate-800">{stat.number}</div>
                <div className="font-medium text-slate-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative p-8 transition-all duration-500 border shadow-lg group bg-white/80 backdrop-blur-sm rounded-3xl hover:shadow-2xl border-white/50 hover:scale-105"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-2xl mb-6 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="mb-4 text-2xl font-bold text-slate-800 group-hover:text-slate-900">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-slate-600 group-hover:text-slate-700">
                {feature.description}
              </p>
              
              {/* Hover Arrow */}
              <div className="absolute transition-opacity duration-300 opacity-0 bottom-8 right-8 group-hover:opacity-100">
                <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-sky-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Experience Badge & Image Section */}
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              
              <h3 className="text-4xl font-bold tracking-tight text-gray-900 md:text-4xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
               {t.trusted.title}
            </span>
            
          </h3>
              <p className="text-lg text-slate-600">
                {t.trusted.description}
              </p>
            </div>

            {/* Achievement List */}
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-100">
                    <CheckCircle className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="font-medium text-slate-700">{achievement}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
           <a href="/contact-us">   <button className="flex items-center px-8 py-4 space-x-2 font-semibold text-white transition-all duration-300 shadow-lg group bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl hover:shadow-xl">
                <span>{t.cta.startJourney}</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button></a>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
                alt={t.image.alt}
                className="w-full h-auto shadow-2xl rounded-3xl"
              />
              
              {/* Experience Badge */}
              <div className="absolute p-6 bg-white border border-gray-100 shadow-xl -bottom-6 -left-6 rounded-2xl">
                <div className="text-center">
                  <div className="mb-1 text-4xl font-bold text-sky-600">{t.experienceBadge.years}</div>
                  <div className="text-sm font-medium text-slate-600">{t.experienceBadge.yearsOf}</div>
                  <div className="text-sm font-medium text-slate-600">{t.experienceBadge.experience}</div>
                </div>
              </div>

              {/* Floating Reviews */}
              
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 scale-110 bg-gradient-to-br from-sky-200 to-blue-200 rounded-3xl blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}