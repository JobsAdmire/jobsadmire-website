import React from 'react';
import { useRouter } from 'next/router';
import { Search, FileText, CheckCircle, TrendingUp, Award, Users, Target, ArrowRight } from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/resumeservice.json';
import trTranslations from '../../../public/locales/tr/resumeservice.json';
import frTranslations from '../../../public/locales/fr/resumeservice.json';
import deTranslations from '../../../public/locales/de/resumeservice.json';
import arTranslations from '../../../public/locales/ar/resumeservice.json';
import ruTranslations from '../../../public/locales/ru/resumeservice.json';
import faTranslations from '../../../public/locales/fa/resumeservice.json';
const ResumeServiceSections = () => {
  const router = useRouter();
  const { locale } = router;

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
          case 'de':
            return deTranslations;
             case 'ru':
                    return ruTranslations;
          default:
            return enTranslations;
        }
  };

  const t = getTranslations();

  // Icon mapping for service cards
  const iconMap = {
    search: <Search className="w-10 h-10 text-sky-500" />,
    fileText: <FileText className="w-10 h-10 text-sky-500" />,
    checkCircle: <CheckCircle className="w-10 h-10 text-sky-500" />
  };

  return (
    <div className="w-full overflow-hidden font-sans bg-gradient-to-b from-white to-sky-50">
      {/* How Our Professional Resume Service Works Section */}
      <section className="relative py-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
                 linear-gradient(to right, rgba(186, 230, 253, 0.2) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(186, 230, 253, 0.2) 1px, transparent 1px)
               `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0'
          }}>
        </div>
        <div className="absolute top-0 right-0 rounded-full w-96 h-96 bg-sky-100 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 bg-blue-100 rounded-full w-80 h-80 opacity-30 blur-3xl"></div>

        {/* Dots Pattern */}
        <div className="absolute left-0 transform -translate-y-1/2 top-1/2">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-sky-300 opacity-30"></div>
            ))}
          </div>
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              {t.resumeservice.serviceProcess.title.prefix} <span className="text-transparent bg-clip-text bg-[#38B6FF]">{t.resumeservice.serviceProcess.title.highlight}</span> {t.resumeservice.serviceProcess.title.suffix}
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-teal-400 to-sky-500"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {t.resumeservice.serviceProcess.cards.map((card, index) => (
              <div key={index} className="relative group">
                {/* Glowing background on hover */}
                <div className="absolute inset-0 transition-all duration-300 transform scale-95 opacity-0 bg-gradient-to-r from-sky-100 to-teal-100 rounded-xl group-hover:opacity-100 group-hover:scale-105 blur-md"></div>

                <div className="relative z-10 h-full p-8 transition-all duration-300 transform bg-white border shadow-lg rounded-xl border-sky-100 group-hover:-translate-y-2">
                  <div className="flex items-center justify-center w-20 h-20 p-5 mx-auto mb-6 transition-colors duration-300 rounded-full bg-sky-50 group-hover:bg-sky-100">
                    {iconMap[card.iconKey]}
                  </div>

                  <h3 className="mb-4 text-xl font-bold text-center">{card.title}</h3>

                  <p className="mb-6 text-center text-gray-600">
                    {card.description}
                  </p>

                  <div className="text-center">
                    <a href="#" className="inline-flex items-center font-medium transition-colors duration-300 text-sky-500 hover:text-sky-600">
                      {card.linkText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instant Change Section */}
      <section className="relative py-20 bg-white">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `
                 radial-gradient(circle, rgba(186, 230, 253, 0.4) 1px, transparent 1px)
               `,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0'
          }}>
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            {/* Image Side */}
            <div className="relative lg:w-1/2">
              <div className="absolute inset-0 transform scale-110 rounded-full opacity-50 bg-sky-100 blur-3xl"></div>

              <div className="relative">
                {/* Paper airplane animations */}
                <div className="absolute transform -top-10 -right-8 rotate-12 animate-float">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.7519 2.24814C21.3604 1.85775 20.8664 1.58974 20.3275 1.47277C19.7886 1.3558 19.2279 1.39592 18.7169 1.58814L2.71694 7.58814C2.17819 7.78711 1.7165 8.14453 1.3972 8.61324C1.0779 9.08194 0.916198 9.63786 0.935842 10.2013C0.955486 10.7647 1.15572 11.3069 1.5102 11.7482C1.86468 12.1894 2.34812 12.5057 2.89694 12.6581L8.89694 14.6581L10.8969 20.6581C11.0343 21.1384 11.3089 21.5666 11.6871 21.8881C12.0653 22.2095 12.5311 22.4113 13.0269 22.4681C13.5227 22.5248 14.0249 22.4337 14.4672 22.2058C14.9094 21.9779 15.2702 21.6236 15.5069 21.1881L21.5069 5.18814C21.6937 4.67432 21.7282 4.11268 21.6059 3.57553C21.4836 3.03838 21.2095 2.5462 20.8169 2.15814L21.7519 2.24814Z" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 15L15 9" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="absolute bottom-0 transform -left-12 -rotate-12 animate-float-delayed">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.7519 2.24814C21.3604 1.85775 20.8664 1.58974 20.3275 1.47277C19.7886 1.3558 19.2279 1.39592 18.7169 1.58814L2.71694 7.58814C2.17819 7.78711 1.7165 8.14453 1.3972 8.61324C1.0779 9.08194 0.916198 9.63786 0.935842 10.2013C0.955486 10.7647 1.15572 11.3069 1.5102 11.7482C1.86468 12.1894 2.34812 12.5057 2.89694 12.6581L8.89694 14.6581L10.8969 20.6581C11.0343 21.1384 11.3089 21.5666 11.6871 21.8881C12.0653 22.2095 12.5311 22.4113 13.0269 22.4681C13.5227 22.5248 14.0249 22.4337 14.4672 22.2058C14.9094 21.9779 15.2702 21.6236 15.5069 21.1881L21.5069 5.18814C21.6937 4.67432 21.7282 4.11268 21.6059 3.57553C21.4836 3.03838 21.2095 2.5462 20.8169 2.15814L21.7519 2.24814Z" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 15L15 9" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Image with border effect */}
                <div className="relative overflow-hidden ">
                  <div className="absolute inset-0 mix-blend-overlay"></div>
                  <img src={t.resumeservice.instantChange.image.src} alt={t.resumeservice.instantChange.image.alt} className="w-full h-[78vh]" />
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:w-1/2">
              <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
                {t.resumeservice.instantChange.headline.prefix} <span className="font-extrabold">{t.resumeservice.instantChange.headline.instant}</span> {t.resumeservice.instantChange.headline.middle}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38B6FF] to-sky-500">{t.resumeservice.instantChange.headline.highlight}</span> {t.resumeservice.instantChange.headline.suffix}
              </h2>

              <p className="mb-8 text-gray-600">
                {t.resumeservice.instantChange.description}
              </p>

              <div className="p-6 mb-8 border bg-sky-50 rounded-xl border-sky-100">
                <h3 className="mb-3 font-bold text-gray-800">{t.resumeservice.instantChange.expertBox.title}</h3>
                <ul className="space-y-3">
                  {t.resumeservice.instantChange.expertBox.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="p-1 mt-1 mr-3 rounded bg-sky-100">
                        {feature.iconKey === 'target' && <Target className="w-4 h-4 text-sky-500" />}
                        {feature.iconKey === 'users' && <Users className="w-4 h-4 text-sky-500" />}
                        {feature.iconKey === 'award' && <Award className="w-4 h-4 text-sky-500" />}
                      </div>
                      <span className="text-gray-700">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center">
                <a href='/about'> 
                  <button className="inline-flex items-center px-6 py-3 font-medium text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-[#38B6FF] to-sky-500 hover:shadow-xl hover:-translate-y-1">
                    {t.resumeservice.instantChange.cta.text}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button> 
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeServiceSections;