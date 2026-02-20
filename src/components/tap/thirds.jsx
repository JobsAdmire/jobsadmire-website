import React from 'react';
import { useRouter } from 'next/router';
import { 
  Award, 
  Database, 
  Settings, 
  Zap, 
  Users, 
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  BarChart3,
  Target,
  Building,
  Rocket,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield 
} from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/talentacquisition.json';
import trTranslations from '../../../public/locales/tr/talentacquisition.json';
import frTranslations from '../../../public/locales/fr/talentacquisition.json';
import deTranslations from '../../../public/locales/de/talentacquisition.json';
import arTranslations from '../../../public/locales/ar/talentacquisition.json';
import ruTranslations from '../../../public/locales/ru/talentacquisition.json';
import faTranslations from '../../../public/locales/fa/talentacquisition.json';
const TalentAcquisitionSection2 = () => {
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
      'Award': <Award className={size} />,
      'Database': <Database className={size} />,
      'Settings': <Settings className={size} />,
      'Zap': <Zap className={size} />,
      'Users': <Users className={size} />,
      'Shield': <Shield className={size} />,
      'Clock': <Clock className={size} />,
      'TrendingUp': <TrendingUp className={size} />,
      'Star': <Star className={size} />,
      'BarChart3': <BarChart3 className={size} />,
      'Target': <Target className={size} />,
      'Rocket': <Rocket className={size} />,
      'Building': <Building className={size} />
    };
    return iconMap[iconName] || <Award className={size} />;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white to-slate-50">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Why Partner Section */}
        <div className="mb-20">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 border rounded-full bg-gradient-to-r from-[#38B6FF]/10 to-blue-50 border-[#38B6FF]/20">
              <Sparkles className="w-4 h-4 mr-2 text-[#38B6FF]" />
              <span className="text-sm font-medium text-[#38B6FF]">{t.talentacquisitionsection2.whyPartner.badge}</span>
            </div>
            
            <h2 className="mb-6 text-4xl font-bold text-gray-900">
              {t.talentacquisitionsection2.whyPartner.title.prefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]">{t.talentacquisitionsection2.whyPartner.title.highlight}</span> {t.talentacquisitionsection2.whyPartner.title.suffix}
            </h2>
            
            <div className="w-24 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-[#38B6FF] to-blue-500"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {t.talentacquisitionsection2.whyPartner.reasons.map((reason, index) => (
              <div key={index} className="relative group">
                <div className="h-full p-6 transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-2">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                    <div className={`w-full h-full rounded-full ${reason.color}`}></div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${reason.bgLight} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={reason.textColor}>{getIcon(reason.icon)}</div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#38B6FF] transition-colors duration-300">
                    {reason.title}
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
            <div className="bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] p-8 text-white text-center">
              <h2 className="mb-4 text-4xl font-bold">
                {t.talentacquisitionsection2.benefits.title}
              </h2>
              <p className="text-xl text-blue-100">
                {t.talentacquisitionsection2.benefits.subtitle}
              </p>
            </div>
            
            <div className="p-8 lg:p-12">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {t.talentacquisitionsection2.benefits.items.map((benefit, index) => (
                  <div key={index} className="flex items-center p-4 transition-colors duration-300 rounded-xl bg-slate-50 hover:bg-slate-100 group">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 transition-transform duration-300 bg-white rounded-lg shadow-md group-hover:scale-110">
                      <div className={benefit.color}>{getIcon(benefit.icon, "w-5 h-5")}</div>
                    </div>
                    <span className="font-medium text-gray-800">{benefit.title}</span>
                  </div>
                ))}
              </div>
              
              {/* Stats Highlight */}
              <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-3">
                {t.talentacquisitionsection2.benefits.stats.map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-gradient-to-br from-[#38B6FF]/10 to-blue-50 rounded-xl">
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Who Can Benefit Section */}
        <div className="mb-20">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900">
              {t.talentacquisitionsection2.whoBenefits.title.prefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]">{t.talentacquisitionsection2.whoBenefits.title.highlight}</span>
            </h2>
            <p className="text-lg text-gray-600">
              {t.talentacquisitionsection2.whoBenefits.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {t.talentacquisitionsection2.whoBenefits.audience.map((audience, index) => (
              <div key={index} className="group">
                <div className="h-full p-6 transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${audience.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {getIcon(audience.icon)}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#38B6FF] transition-colors duration-300">
                    {audience.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {audience.description}
                  </p>
                  
                  {/* Check Icon */}
                  <div className="mt-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TalentAcquisitionSection2;