import React from 'react';
import { useRouter } from 'next/router';
import { 
  Users, 
  Search, 
  UserCheck, 
  Calendar, 
  CheckCircle, 
  UserPlus,
  Target,
  Network,
  Filter,
  ArrowRight,
  Briefcase,
  Award
} from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/talentacquisition.json';
import trTranslations from '../../../public/locales/tr/talentacquisition.json';
import frTranslations from '../../../public/locales/fr/talentacquisition.json';
import deTranslations from '../../../public/locales/de/talentacquisition.json';
import arTranslations from '../../../public/locales/ar/talentacquisition.json';
import ruTranslations from '../../../public/locales/ru/talentacquisition.json';
import faTranslations from '../../../public/locales/fa/talentacquisition.json';
const TalentAcquisitionSection1 = () => {
  const router = useRouter();
  const { locale } = router;

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
      'Target': <Target className={size} />,
      'Network': <Network className={size} />,
      'Filter': <Filter className={size} />,
      'Calendar': <Calendar className={size} />,
      'UserCheck': <UserCheck className={size} />,
      'UserPlus': <UserPlus className={size} />
    };
    return iconMap[iconName] || <Target className={size} />;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="container px-4 mx-auto max-w-7xl">
      
        {/* Process Overview */}
        <div className="mb-20">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900">
              {t.talentacquisitionsection1.process.title.prefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]">{t.talentacquisitionsection1.process.title.highlight}</span>
            </h2>
            <p className="text-lg text-gray-600">
              {t.talentacquisitionsection1.process.description}
            </p>
          </div>

          {/* Process Steps Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {t.talentacquisitionsection1.process.steps.map((step, index) => (
              <div key={step.id} className="relative group">
                {/* Connection Line */}
                {index < t.talentacquisitionsection1.process.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-gradient-to-r from-[#38B6FF] to-blue-300 opacity-30 z-0"></div>
                )}
                
                {/* Step Card */}
                <div className="relative h-full p-6 transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1 group">
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-[#38B6FF] to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {step.id}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${step.bgLight} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={step.textColor}>{getIcon(step.icon)}</div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#38B6FF] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                  
                  {/* Hover Arrow */}
                  <div className="mt-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight className="w-5 h-5 text-[#38B6FF]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Flow Visualization */}
        <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl lg:p-12">
          <div className="mb-10 text-center">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              {t.talentacquisitionsection1.flow.title}
            </h3>
            <p className="text-gray-600">{t.talentacquisitionsection1.flow.description}</p>
          </div>
          
          {/* Flow Chart */}
          <div className="relative">
            {/* Desktop Flow */}
            <div className="items-center justify-between hidden lg:flex">
              {t.talentacquisitionsection1.process.steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center text-center max-w-32">
                    <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center text-white mb-3 shadow-lg`}>
                      {getIcon(step.icon)}
                    </div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-900">
                      {step.title.split(' ').slice(0, 2).join(' ')}
                    </h4>
                    <p className="text-xs text-gray-500">{t.talentacquisitionsection1.flow.stepLabel} {step.id}</p>
                  </div>
                  
                  {index < t.talentacquisitionsection1.process.steps.length - 1 && (
                    <div className="flex items-center mx-4">
                      <div className="w-12 h-0.5 bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]"></div>
                      <ArrowRight className="w-4 h-4 text-[#38B6FF] ml-1" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Mobile Flow */}
            <div className="space-y-6 lg:hidden">
              {t.talentacquisitionsection1.process.steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white mr-4 flex-shrink-0`}>
                    {getIcon(step.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-500">{t.talentacquisitionsection1.flow.stepLabel} {step.id}</p>
                  </div>
                  {index < t.talentacquisitionsection1.process.steps.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-[#38B6FF] ml-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a href="/contact-us">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <span>{t.talentacquisitionsection1.cta}</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TalentAcquisitionSection1;