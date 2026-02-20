import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Star, Play, Globe, Newspaper, Radio, Video, ExternalLink, Award } from 'lucide-react';

// Import translation files for all 7 languages
import enTranslations from '../../../public/locales/en/media.json';
import trTranslations from '../../../public/locales/tr/media.json';
import frTranslations from '../../../public/locales/fr/media.json';
import deTranslations from '../../../public/locales/de/media.json';
import arTranslations from '../../../public/locales/ar/media.json';
import ruTranslations from '../../../public/locales/ru/media.json';
import faTranslations from '../../../public/locales/fa/media.json';

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

export default function FeaturedMediaSection() {
  const router = useRouter();
  const { locale } = router;
  const t = getTranslations(locale);

  const [activeCard, setActiveCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const mediaOutlets = [
    {
      id: 1,
      name: t.mediaOutlets.globalVisaToday.name,
      category: t.mediaOutlets.globalVisaToday.category,
      logoUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=center",
      logoAlt: t.mediaOutlets.globalVisaToday.logoAlt,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      description: t.mediaOutlets.globalVisaToday.description,
      reach: t.mediaOutlets.globalVisaToday.reach,
      type: t.mediaOutlets.globalVisaToday.type,
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 2,
      name: t.mediaOutlets.travelHerald.name,
      category: t.mediaOutlets.travelHerald.category,
      logoUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=100&fit=crop&crop=center",
      logoAlt: t.mediaOutlets.travelHerald.logoAlt,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      description: t.mediaOutlets.travelHerald.description,
      reach: t.mediaOutlets.travelHerald.reach,
      type: t.mediaOutlets.travelHerald.type,
      icon: <Newspaper className="w-5 h-5" />
    },
    {
      id: 3,
      name: t.mediaOutlets.migrationNews.name,
      category: t.mediaOutlets.migrationNews.category,
      logoUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=200&h=100&fit=crop&crop=center",
      logoAlt: t.mediaOutlets.migrationNews.logoAlt,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      description: t.mediaOutlets.migrationNews.description,
      reach: t.mediaOutlets.migrationNews.reach,
      type: t.mediaOutlets.migrationNews.type,
      icon: <Video className="w-5 h-5" />
    },
    {
      id: 4,
      name: t.mediaOutlets.visaTimes.name,
      category: t.mediaOutlets.visaTimes.category,
      logoUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&crop=faces",
      logoAlt: t.mediaOutlets.visaTimes.logoAlt,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      description: t.mediaOutlets.visaTimes.description,
      reach: t.mediaOutlets.visaTimes.reach,
      type: t.mediaOutlets.visaTimes.type,
      icon: <Radio className="w-5 h-5" />
    },
    {
      id: 5,
      name: t.mediaOutlets.nextBorder.name,
      category: t.mediaOutlets.nextBorder.category,
      logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&crop=center",
      logoAlt: t.mediaOutlets.nextBorder.logoAlt,
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700",
      description: t.mediaOutlets.nextBorder.description,
      reach: t.mediaOutlets.nextBorder.reach,
      type: t.mediaOutlets.nextBorder.type,
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 6,
      name: t.mediaOutlets.immigrationDaily.name,
      category: t.mediaOutlets.immigrationDaily.category,
      logoUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=100&fit=crop&crop=faces",
      logoAlt: t.mediaOutlets.immigrationDaily.logoAlt,
      color: "from-amber-500 to-yellow-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      description: t.mediaOutlets.immigrationDaily.description,
      reach: t.mediaOutlets.immigrationDaily.reach,
      type: t.mediaOutlets.immigrationDaily.type,
      icon: <Newspaper className="w-5 h-5" />
    },
    {
      id: 7,
      name: t.mediaOutlets.passportChronicle.name,
      category: t.mediaOutlets.passportChronicle.category,
      logoUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=200&h=100&fit=crop&crop=faces",
      logoAlt: t.mediaOutlets.passportChronicle.logoAlt,
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
      description: t.mediaOutlets.passportChronicle.description,
      reach: t.mediaOutlets.passportChronicle.reach,
      type: t.mediaOutlets.passportChronicle.type,
      icon: <ExternalLink className="w-5 h-5" />
    },
    {
      id: 8,
      name: t.mediaOutlets.worldEntry.name,
      category: t.mediaOutlets.worldEntry.category,
      logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop&crop=faces",
      logoAlt: t.mediaOutlets.worldEntry.logoAlt,
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      description: t.mediaOutlets.worldEntry.description,
      reach: t.mediaOutlets.worldEntry.reach,
      type: t.mediaOutlets.worldEntry.type,
      icon: <Award className="w-5 h-5" />
    },
    {
      id: 9,
      name: t.mediaOutlets.visaScope.name,
      category: t.mediaOutlets.visaScope.category,
      logoUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=100&fit=crop&crop=entropy",
      logoAlt: t.mediaOutlets.visaScope.logoAlt,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      description: t.mediaOutlets.visaScope.description,
      reach: t.mediaOutlets.visaScope.reach,
      type: t.mediaOutlets.visaScope.type,
      icon: <Star className="w-5 h-5" />
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-24 px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className={`inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg border border-emerald-200 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Award className="w-5 h-5" />
            <span>{t.header.badge}</span>
          </div>
          
          <h2 className={`text-5xl md:text-7xl font-bold mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-slate-800">{t.header.title.line1} </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">{t.header.title.highlight} </span>
            <span className="text-slate-800">{t.header.title.line2}</span>
          </h2>
          
          <p className={`text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {t.header.description}
          </p>
        </div>

        {/* Media Outlets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaOutlets.map((outlet, index) => (
            <div
              key={outlet.id}
              className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 cursor-pointer transform hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              style={{transitionDelay: `${800 + index * 100}ms`}}
              onMouseEnter={() => setActiveCard(outlet.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${outlet.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${outlet.bgColor} ${outlet.textColor} font-bold text-lg group-hover:scale-110 transition-transform duration-300`}>
                  {outlet.logoType === 'number' ? outlet.logo : outlet.logo}
                </div>
                <div className={`flex items-center space-x-2 ${outlet.textColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  {outlet.icon}
                  <span className="text-sm font-medium">{outlet.type}</span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-900">
                    {outlet.name}
                  </h3>
                  <div className={`inline-block ${outlet.bgColor} ${outlet.textColor} px-3 py-1 rounded-full text-sm font-medium`}>
                    {outlet.category}
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                  {outlet.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-500 font-medium">{outlet.reach}</span>
                  </div>
                  
                  <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-${outlet.color.split('-')[1]}-600`}>
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Animated Border */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${outlet.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className={`text-center mt-20 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-transparent"></div>
            </div>
            
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                {t.cta.title}
              </h3>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                {t.cta.description}
              </p>
              <button className="group bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto">
                <span>{t.cta.buttonText}</span>
                <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}