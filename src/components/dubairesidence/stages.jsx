import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { MessageSquare, FileSearch, Scale, CheckCircle, ArrowRight, Clock, Users, Award, MapPin } from 'lucide-react';

// Import translation files for all 7 languages
import enTranslations from '../../../public/locales/en/dubai5.json';
import trTranslations from '../../../public/locales/tr/dubai5.json';
import frTranslations from '../../../public/locales/fr/dubai5.json';
import deTranslations from '../../../public/locales/de/dubai5.json';
import arTranslations from '../../../public/locales/ar/dubai5.json';
import ruTranslations from '../../../public/locales/ru/dubai5.json';
import faTranslations from '../../../public/locales/fa/dubai5.json';

const DubaiResidenceProcess = () => {
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

  const [hoveredCard, setHoveredCard] = useState(null);

  const stages = [
    {
      icon: MessageSquare,
      title: t.stages.consultation.title,
      description: t.stages.consultation.description,
      step: "01"
    },
    {
      icon: FileSearch,
      title: t.stages.documentation.title,
      description: t.stages.documentation.description,
      step: "02"
    },
    {
      icon: Scale,
      title: t.stages.submission.title,
      description: t.stages.submission.description,
      step: "03"
    },
    {
      icon: CheckCircle,
      title: t.stages.approval.title,
      description: t.stages.approval.description,
      step: "04"
    }
  ];

  const images = [
    {
      src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&h=400&fit=crop&crop=center",
      alt: t.images.burjKhalifa.alt,
      location: t.images.burjKhalifa.location,
      description: t.images.burjKhalifa.description
    },
    {
      src: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=500&h=400&fit=crop&crop=center",
      alt: t.images.dubaiMarina.alt,
      location: t.images.dubaiMarina.location,
      description: t.images.dubaiMarina.description
    },
    {
      src: "https://www.emiratessetup.ae/img/containers/main/img/liveandwork/dubai-residence-visa-a.jpg/86713e5c3f6bde539f768b7ae4afbe8c.jpg",
      alt: t.images.dubaiMall.alt,
      location: t.images.dubaiMall.location,
      description: t.images.dubaiMall.description
    },
    { 
      src: "https://static.zawya.com/view/acePublic/alias/contentid/MzkxNjg3Y2YtYWRmZC00/0/thumbnail_img_0466-jpg.webp?f=3%3A2&q=0.75&w=3840",
      alt: t.images.palmJumeirah.alt,
      location: t.images.palmJumeirah.location,
      description: t.images.palmJumeirah.description
    }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50/40 to-sky-100 relative overflow-hidden flex items-center">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-sky-200/30 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-r from-blue-200/25 to-sky-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-sky-100/20 to-blue-100/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-sky-400/20 rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-3/4 left-1/4 w-6 h-6 bg-blue-400/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-sky-300/30 rounded-full animate-bounce delay-1500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-sky-100/60 backdrop-blur-sm rounded-full text-sky-700 text-sm font-semibold mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            {t.header.badge}
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-sky-900 leading-tight mb-4">
            {t.header.title.line1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
              {t.header.title.dubaiResidenceVisa}
            </span>{' '}
            {t.header.title.line2}
          </h2>
          <p className="text-lg text-sky-600 max-w-3xl mx-auto leading-relaxed">
            {t.header.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Enhanced Left side - Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-700 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                    index === 0 ? 'row-span-1 transform rotate-1' : 
                    index === 1 ? 'row-span-1 mt-8 transform -rotate-1' : 
                    index === 2 ? 'row-span-1 -mt-6 transform rotate-1' : 
                    'row-span-1 transform -rotate-1'
                  }`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Enhanced overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-900/70 via-sky-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  
                  {/* Enhanced content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                      <span className="text-sky-200 text-sm font-medium">{image.location}</span>
                    </div>
                    <h3 className="font-bold text-base">{image.location}</h3>
                    <p className="text-sky-200 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {image.description}
                    </p>
                  </div>

                  {/* Hover effect border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-sky-400/50 transition-colors duration-300"></div>
                </div>
              ))}
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sky-800 font-semibold text-xs">{t.badge.visasProcessing}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Right side - Process Steps */}
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div 
                  key={index}
                  className="group relative"
                >
                  {/* Connection line */}
                  {index < stages.length - 1 && (
                    <div className="absolute left-7 top-14 w-0.5 h-12 bg-gradient-to-b from-sky-300 to-sky-200"></div>
                  )}
                  
                  <div className="flex items-start space-x-4 p-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 hover:bg-white/90 hover:shadow-lg hover:border-sky-200/50 transition-all duration-500 transform hover:scale-102 hover:-translate-y-1">
                    {/* Enhanced Icon with step number */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {stage.step}
                      </div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="flex-1 pt-1">
                      <h3 className="text-xl font-bold text-sky-900 mb-2 leading-tight group-hover:text-sky-700 transition-colors duration-300">
                        {stage.title}
                      </h3>
                      <p className="text-sky-600 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight className="w-5 h-5 text-sky-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DubaiResidenceProcess;