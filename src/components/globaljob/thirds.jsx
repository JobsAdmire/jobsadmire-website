import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  User, 
  FileText, 
  Search, 
  Mic, 
  Globe, 
  ArrowRight, 
  ChevronRight, 
  Briefcase, 
  Check, 
  MapPin,
  Star,
  Building,
  UsersRound,
  Sparkles,
  Medal,
  Clock,
  TrendingUp,
  Target,
  BarChart4,
  Zap
} from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/globaljobs.json';
import trTranslations from '../../../public/locales/tr/globaljobs.json';
import arTranslations from '../../../public/locales/ar/globaljobs.json';
import frTranslations from '../../../public/locales/fr/globaljobs.json';
import deTranslations from '../../../public/locales/de/globaljobs.json';
import ruTranslations from '../../../public/locales/ru/globaljobs.json';
import faTranslations from '../../../public/locales/fa/globaljobs.json';
const CareerHorizons = () => {
  const router = useRouter();
  const { locale } = router;
  const [visible, setVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(0);

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
              case 'ru':
                return ruTranslations;
              case 'de':
                return deTranslations;
              default:
                return enTranslations;
            }
  };

  const t = getTranslations();
  
  useEffect(() => {
    setVisible(true);
  }, []);

  // Icon mapping for job seeker services
  const serviceIconMap = {
    user: <User className="w-5 h-5" />,
    fileText: <FileText className="w-5 h-5" />,
    search: <Search className="w-5 h-5" />,
    mic: <Mic className="w-5 h-5" />
  };

  // Icon mapping for benefits
  const benefitIconMap = {
    fileText: <FileText className="w-5 h-5 text-[#38B6FF]" />,
    mic: <Mic className="w-5 h-5 text-[#38B6FF]" />,
    globe: <Globe className="w-5 h-5 text-[#38B6FF]" />,
    zap: <Zap className="w-5 h-5 text-[#38B6FF]" />
  };

  // Icon mapping for features
  const featureIconMap = {
    target: <Target className="w-5 h-5" />,
    barChart4: <BarChart4 className="w-5 h-5" />,
    trendingUp: <TrendingUp className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute rounded-full -top-40 -right-40 w-96 h-96 bg-emerald-50 filter blur-3xl opacity-70"></div>
        <div className="absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-blue-50 filter blur-3xl opacity-70"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Main Header Section */}
        <section className="px-6 pt-24 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <div className="inline-block px-4 py-1 mb-4 border rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-100">
                <span className="text-sm font-medium text-transparent bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] bg-clip-text">{t.globaljob.careerHorizons.header.badge}</span>
              </div>
              <h1 className="mb-6 text-5xl font-bold text-gray-900">
                {t.globaljob.careerHorizons.header.title.prefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]">{t.globaljob.careerHorizons.header.title.highlight}</span>
              </h1>
              <p className="max-w-3xl mx-auto text-lg text-gray-600">
                {t.globaljob.careerHorizons.header.description}
              </p>
            </div>
          </div>
        </section>

        {/* World Map and Hiring Section */}
        <section className="px-6 py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="grid grid-cols-1 gap-10 mx-auto max-w-7xl md:grid-cols-2">
            {/* Interactive World Map Visualization */}
            <div className="overflow-hidden transition-all duration-500 transform bg-white shadow-md rounded-2xl hover:-translate-y-1 hover:shadow-xl">
              <div className="px-8 pt-6 pb-2 border-b border-gray-100">
                <div className="flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-[#38B6FF]" />
                  <h3 className="text-lg font-bold text-gray-900">{t.globaljob.careerHorizons.worldMap.title}</h3>
                </div>
              </div>
              <div className="p-8">
                <div className="relative h-80 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 rounded-xl">
                  {/* World map abstract representation */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,100 Q100,50 180,100 T340,100" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" fill="none" />
                    <path d="M20,120 Q100,70 180,120 T340,120" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1" fill="none" />
                    <path d="M20,80 Q100,30 180,80 T340,80" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" fill="none" />
                    <path d="M20,140 Q100,90 180,140 T340,140" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" fill="none" />
                    <path d="M20,60 Q100,10 180,60 T340,60" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" fill="none" />
                  </svg>

                  {/* Interactive location dots */}
                  {t.globaljob.careerHorizons.worldMap.locations.map((location, index) => (
                    <div 
                      key={location.id}
                      className="absolute"
                      style={{ 
                        top: `${Math.random() * 60 + 20}%`, 
                        left: `${Math.random() * 60 + 20}%`,
                        animationDelay: `${location.delay}s`
                      }}
                    >
                      <div className="relative group">
                        <div 
                          className={`w-${location.size} h-${location.size} rounded-full pulse-animation`}
                          style={{ 
                            backgroundColor: location.color,
                            boxShadow: `0 0 0 rgba(${parseInt(location.color.slice(1, 3), 16)}, ${parseInt(location.color.slice(3, 5), 16)}, ${parseInt(location.color.slice(5, 7), 16)}, 0.4)`,
                            animation: `pulse 2s infinite`
                          }}
                        ></div>
                        <div className="absolute z-10 transition-opacity duration-300 transform -translate-x-1/2 -translate-y-2 opacity-0 bottom-full left-1/2 group-hover:opacity-100">
                          <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium whitespace-nowrap flex items-center">
                            <MapPin className="w-3 h-3 mr-1" style={{ color: location.color }} />
                            <span style={{ color: location.color }}>{location.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Connection lines animation */}
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M80,100 C150,50 250,150 320,100"
                        stroke="url(#gradient)"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        fill="none"
                        className="path-animation"
                      />
                      <path
                        d="M100,150 C170,100 230,100 300,150"
                        stroke="url(#gradient)"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        fill="none"
                        className="path-animation"
                        style={{ animationDelay: '1s' }}
                      />
                      <path
                        d="M120,50 C190,100 210,100 280,50"
                        stroke="url(#gradient)"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        fill="none"
                        className="path-animation"
                        style={{ animationDelay: '2s' }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.3 }} />
                          <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0.3 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Location legend */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {t.globaljob.careerHorizons.worldMap.locations.slice(0, 4).map(location => (
                    <div key={location.id} className="flex items-center px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
                      <div className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: location.color }}></div>
                      <span className="text-xs font-medium text-gray-700">{location.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seamless Hiring Content */}
            <div className="overflow-hidden transition-all duration-500 transform bg-white shadow-md rounded-2xl hover:-translate-y-1 hover:shadow-xl">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t.globaljob.careerHorizons.hiring.title.prefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]">{t.globaljob.careerHorizons.hiring.title.highlight}</span>
                </h2>
              </div>

              <div className="p-8">
                <p className="mb-6 text-gray-600">
                  {t.globaljob.careerHorizons.hiring.description}
                </p>

                <div className="mb-8 space-y-6">
                  {t.globaljob.careerHorizons.hiring.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start p-4 transition-all duration-300 bg-gray-50 rounded-xl hover:bg-gray-100">
                      <div className="flex-shrink-0 p-3 mr-4 bg-white rounded-lg shadow-sm">
                        {benefitIconMap[benefit.iconKey]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                        <p className="mt-1 text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 border border-blue-100 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-3 mr-4 bg-white rounded-lg shadow-sm">
                      <Zap className="w-5 h-5 text-[#38B6FF]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.globaljob.careerHorizons.hiring.fastTrack.title}</h4>
                      <p className="mt-1 text-gray-600">{t.globaljob.careerHorizons.hiring.fastTrack.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex mt-8">
                  <a href="/services">
                  <button className="flex items-center justify-center flex-1 px-4 py-3 font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] hover:shadow-lg group">
                    <span>{t.globaljob.careerHorizons.hiring.cta.text}</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </button></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">{t.globaljob.careerHorizons.features.title}</h2>
              <p className="max-w-2xl mx-auto text-gray-600">{t.globaljob.careerHorizons.features.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {t.globaljob.careerHorizons.features.items.map((feature, index) => (
                <div key={index} className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-md rounded-xl hover:shadow-lg">
                  <div className={`w-12 h-12 rounded-lg ${feature.color.replace('text', 'bg')}/10 flex items-center justify-center mb-4`}>
                    <div className={feature.color}>{featureIconMap[feature.iconKey]}</div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Job Seekers Section */}
        <section className="px-6 py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-between mb-12 md:flex-row">
              <h2 className="text-3xl font-bold text-gray-900">{t.globaljob.careerHorizons.jobSeekers.title}</h2>
              <div className="flex mt-4 space-x-2 md:mt-0">
                {t.globaljob.careerHorizons.jobSeekers.services.map((service, index) => (
                  <button 
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      selectedService === service.id 
                        ? service.accentColor 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  ></button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {/* Service List */}
              <div className="space-y-4">
                {t.globaljob.careerHorizons.jobSeekers.services.map((service) => (
                  <div 
                    key={service.id}
                    className={`p-0.5 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedService === service.id 
                        ? `bg-gradient-to-r ${service.gradientFrom} ${service.gradientTo} shadow-md` 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className={`p-5 bg-white rounded-lg ${
                      selectedService === service.id ? service.borderColor : 'border-gray-200'
                    } border`}>
                      <div className="flex items-start">
                        <div className={`w-10 h-10 rounded-lg ${service.bgColor} flex items-center justify-center mr-4`}>
                          <div className={service.color}>{serviceIconMap[service.iconKey]}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{service.title}</h3>
                            {selectedService === service.id && (
                              <div className={`${service.color} p-1 rounded-full`}>
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <p className="mt-1 text-gray-600">{service.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Service Details */}
              <div className="overflow-hidden transition-all duration-500 transform bg-white shadow-md rounded-xl hover:-translate-y-1 hover:shadow-xl">
                <div className={`p-1 ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].accentColor}`}>
                  <div className="p-6 bg-white rounded-t-lg">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-lg ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].bgColor} flex items-center justify-center mr-4`}>
                        <div className={t.globaljob.careerHorizons.jobSeekers.services[selectedService].color}>{serviceIconMap[t.globaljob.careerHorizons.jobSeekers.services[selectedService].iconKey]}</div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{t.globaljob.careerHorizons.jobSeekers.services[selectedService].title}</h3>
                        <p className={`text-sm ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].color}`}>{t.globaljob.careerHorizons.jobSeekers.premiumService}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Visual representation */}
                  <div className={`p-6 rounded-xl ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].bgColor} mb-6`}>
                    <div className="p-4 bg-white rounded-lg shadow-md">
                      <div className="flex mb-4 space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="w-3/4 h-4 bg-gray-100 rounded-md"></div>
                        <div className="w-1/2 h-4 bg-gray-100 rounded-md"></div>
                        <div className="w-5/6 h-4 bg-gray-100 rounded-md"></div>
                        <div className="w-2/3 h-4 bg-gray-100 rounded-md"></div>
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <div className={`px-4 py-2 rounded-md ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].bgColor}`}>
                          <div className="w-16 h-4 rounded-md bg-white/50"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service highlights */}
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].bgColor} mr-3`}>
                        <Clock className={`w-4 h-4 ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="w-1/2 h-4 bg-gray-100 rounded-md"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].bgColor} mr-3`}>
                        <Star className={`w-4 h-4 ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="w-2/3 h-4 bg-gray-100 rounded-md"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].bgColor} mr-3`}>
                        <TrendingUp className={`w-4 h-4 ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="w-3/4 h-4 bg-gray-100 rounded-md"></div>
                      </div>
                    </div>
                  </div>
                  
                 <a href="https://www.jobsadmire.com/blog/-the-big-question-what-should-i-do-with-my-life"> <button className={`w-full py-3 rounded-lg font-medium text-white ${t.globaljob.careerHorizons.jobSeekers.services[selectedService].accentColor} hover:opacity-90 transition-opacity flex items-center justify-center`}>
                    {t.globaljob.careerHorizons.jobSeekers.learnMore} {t.globaljob.careerHorizons.jobSeekers.services[selectedService].title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button></a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
              }
              100% {
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                }
                }
                
                .pulse-animation {
                  animation: pulse 2s infinite;
                  }
                  
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -1000;
                      }
                      }
                      
                      .path-animation {
                        animation: dash 20s linear infinite;
                        }
                        `}</style>
    </div>
  );
};

export default CareerHorizons;