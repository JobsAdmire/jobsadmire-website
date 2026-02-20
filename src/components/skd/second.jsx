import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  CheckCircle, 
  Users, 
  BookOpen, 
  Award, 
  Clock, 
  Globe, 
  Code, 
  TrendingUp, 
  Briefcase, 
  MessageSquare, 
  Star,
  ArrowRight,
  Laptop,
  Building,
  GraduationCap,
  Target,
  Zap,
  Shield,
  Lightbulb,
  BarChart3,
  Send,
  Phone,
  Mail
} from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/skilldevelopment.json';
import trTranslations from '../../../public/locales/tr/skilldevelopment.json';
import frTranslations from '../../../public/locales/fr/skilldevelopment.json';
import deTranslations from '../../../public/locales/de/skilldevelopment.json';
import arTranslations from '../../../public/locales/ar/skilldevelopment.json';
import ruTranslations from '../../../public/locales/ru/skilldevelopment.json';
import faTranslations from '../../../public/locales/fa/skilldevelopment.json';
const SkillDevelopmentPage = () => {
  const router = useRouter();
  const { locale } = router;
  const [selectedTrainingArea, setSelectedTrainingArea] = useState(0);

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
                          case 'tr':
                            return trTranslations;
                          case 'ar':
                            return arTranslations;
                          case 'ru':
                            return ruTranslations;
                          case 'fr':
                            return frTranslations;
                          case 'fa':
                            return faTranslations;
                          case 'de':
                            return deTranslations;
                          default:
                            return enTranslations;
                        }
  };

  const t = getTranslations();

  // Icon mapping function
  const getIcon = (iconName, size = "w-6 h-6") => {
    const iconMap = {
      'Building': <Building className={size} />,
      'Users': <Users className={size} />,
      'Target': <Target className={size} />,
      'Clock': <Clock className={size} />,
      'Briefcase': <Briefcase className={size} />,
      'Code': <Code className={size} />,
      'TrendingUp': <TrendingUp className={size} />,
      'MessageSquare': <MessageSquare className={size} />,
      'Shield': <Shield className={size} />,
      'GraduationCap': <GraduationCap className={size} />,
      'Lightbulb': <Lightbulb className={size} />,
      'BookOpen': <BookOpen className={size} />,
      'BarChart3': <BarChart3 className={size} />,
      'Award': <Award className={size} />,
      'Globe': <Globe className={size} />
    };
    return iconMap[iconName] || <BookOpen className={size} />;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#38B6FF]/10 via-white to-emerald-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-40 -right-40 bg-[#38B6FF]/20 rounded-full filter blur-3xl opacity-50"></div>
          <div className="absolute rounded-full opacity-50 w-96 h-96 -bottom-40 -left-40 bg-emerald-100 filter blur-3xl"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 bg-white border border-[#38B6FF]/20 rounded-full shadow-sm">
              <Zap className="w-4 h-4 mr-2 text-[#38B6FF]" />
              <span className="text-sm font-medium text-[#38B6FF]">{t.skilldevpage.hero.badge}</span>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900">
              {t.skilldevpage.hero.title.prefix} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]/80">
                {t.skilldevpage.hero.title.highlight}
              </span>
            </h2>
            
            <p className="max-w-3xl mx-auto mb-8 text-xl text-gray-600">
              {t.skilldevpage.hero.description}
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a href="/contact-us">
                <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]/80 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t.skilldevpage.hero.cta.primary}
                </button>
              </a>
              
              <a href="/contact-us">
                <button className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-[#38B6FF]/30 hover:shadow-md transition-all duration-300">
                  <Phone className="w-5 h-5 mr-2" />
                  {t.skilldevpage.hero.cta.secondary}
                </button>
              </a>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {t.skilldevpage.stats.map((stat, index) => (
              <div key={index} className="p-6 transition-shadow duration-300 bg-white shadow-md rounded-xl hover:shadow-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-[#38B6FF]/10 rounded-lg mb-4 mx-auto">
                  <div className="text-[#38B6FF]">{getIcon(stat.icon)}</div>
                </div>
                <div className="mb-1 text-3xl font-bold text-center text-gray-900">{stat.value}</div>
                <div className="text-center text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              {t.skilldevpage.benefits.title.prefix} <span className="text-[#38B6FF]">{t.skilldevpage.benefits.title.highlight}</span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t.skilldevpage.benefits.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {t.skilldevpage.benefits.items.map((benefit, index) => (
              <div key={index} className="p-8 transition-all duration-300 bg-white border border-gray-100 group rounded-xl hover:shadow-xl hover:-translate-y-2">
                <div className={`w-16 h-16 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={benefit.color}>{getIcon(benefit.icon)}</div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">{benefit.title}</h3>
                <p className="leading-relaxed text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Areas Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-[#38B6FF]/10">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              {t.skilldevpage.trainingAreas.title.prefix} <span className="text-[#38B6FF]">{t.skilldevpage.trainingAreas.title.highlight}</span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t.skilldevpage.trainingAreas.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Training Area Selector */}
            <div className="space-y-4">
              {t.skilldevpage.trainingAreas.items.map((area, index) => (
                <div 
                  key={area.id}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedTrainingArea === area.id 
                      ? 'bg-white shadow-lg border-2 border-[#38B6FF]/30' 
                      : 'bg-white hover:shadow-md border border-gray-100'
                  }`}
                  onClick={() => setSelectedTrainingArea(area.id)}
                >
                  <div className="flex items-start">
                    <div className={`w-16 h-16 ${area.bgColor} rounded-lg flex items-center justify-center mr-6 flex-shrink-0`}>
                      <div className={area.color}>{getIcon(area.icon, "w-8 h-8")}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-bold text-gray-900">{area.title}</h3>
                      <p className="text-sm text-gray-600">{area.description}</p>
                    </div>
                    {selectedTrainingArea === area.id && (
                      <CheckCircle className="w-6 h-6 text-[#38B6FF] ml-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Training Area Details */}
            <div className="overflow-hidden bg-white shadow-lg rounded-xl">
              <div className={`p-6 ${t.skilldevpage.trainingAreas.items[selectedTrainingArea].accentColor} text-white`}>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 mr-4 bg-white rounded-lg bg-opacity-20">
                    {getIcon(t.skilldevpage.trainingAreas.items[selectedTrainingArea].icon, "w-8 h-8")}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t.skilldevpage.trainingAreas.items[selectedTrainingArea].title}</h3>
                    <p className="text-white text-opacity-90">{t.skilldevpage.trainingAreas.programLabel}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h4 className="mb-4 text-lg font-bold text-gray-900">{t.skilldevpage.trainingAreas.skillsLabel}</h4>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {t.skilldevpage.trainingAreas.items[selectedTrainingArea].skills.map((skill, index) => (
                    <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50">
                      <CheckCircle className="flex-shrink-0 w-4 h-4 mr-2 text-emerald-600" />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-[#38B6FF]/10 to-emerald-50 p-6 rounded-lg mb-6">
                  <h5 className="mb-2 font-semibold text-gray-900">{t.skilldevpage.trainingAreas.highlightsLabel}</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {t.skilldevpage.trainingAreas.highlights.map((highlight, index) => (
                      <li key={index}>• {highlight}</li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full py-3 ${t.skilldevpage.trainingAreas.items[selectedTrainingArea].accentColor} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center`}>
                  {t.skilldevpage.trainingAreas.enrollButton} {t.skilldevpage.trainingAreas.items[selectedTrainingArea].title.split(' ')[0]} {t.skilldevpage.trainingAreas.programText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              <span className="text-[#38B6FF]">{t.skilldevpage.targetAudience.title}</span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t.skilldevpage.targetAudience.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {t.skilldevpage.targetAudience.items.map((audience, index) => (
              <div key={index} className="p-8 transition-all duration-300 border border-gray-100 group bg-gradient-to-br from-white to-gray-50 rounded-xl hover:shadow-lg">
                <div className={`w-14 h-14 bg-white rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <div className={audience.color}>{getIcon(audience.icon)}</div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{audience.title}</h3>
                <p className="text-gray-600">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 bg-gradient-to-br from-[#38B6FF]/10 to-emerald-50">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              {t.skilldevpage.approach.title.prefix} <span className="text-[#38B6FF]">{t.skilldevpage.approach.title.highlight}</span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t.skilldevpage.approach.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {t.skilldevpage.approach.points.map((point, index) => (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < t.skilldevpage.approach.points.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#38B6FF]/50 to-emerald-300 z-0"></div>
                )}
                
                <div className="relative z-10 p-8 transition-shadow duration-300 bg-white shadow-md rounded-xl hover:shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#38B6FF] to-[#38B6FF] rounded-lg flex items-center justify-center mb-6 mx-auto">
                    <div className="text-white">{getIcon(point.icon, "w-5 h-5")}</div>
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-center text-gray-900">{point.title}</h3>
                  <p className="text-center text-gray-600">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification & Placement Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-gray-900">
                <span className="text-[#38B6FF]">{t.skilldevpage.certification.title.prefix}</span> & <br />
                {t.skilldevpage.certification.title.suffix}
              </h2>
              <p className="mb-8 text-xl text-gray-600">
                {t.skilldevpage.certification.description}
              </p>

              <div className="mb-8 space-y-4">
                {t.skilldevpage.certification.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-6 h-6 mr-4 text-emerald-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]/80 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <Award className="w-5 h-5 mr-2" />
                {t.skilldevpage.certification.cta}
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#38B6FF]/10 to-emerald-50 p-8 rounded-xl">
              <div className="p-8 bg-white rounded-lg shadow-md">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">{t.skilldevpage.form.title}</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">{t.skilldevpage.form.fields.name}</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                      placeholder={t.skilldevpage.form.placeholders.name}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">{t.skilldevpage.form.fields.email}</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent"
                      placeholder={t.skilldevpage.form.placeholders.email}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">{t.skilldevpage.form.fields.training}</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent">
                      <option value="">{t.skilldevpage.form.placeholders.training}</option>
                      {t.skilldevpage.form.options.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]/80 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                    <Send className="w-4 h-4 mr-2" />
                    {t.skilldevpage.form.submit}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillDevelopmentPage;