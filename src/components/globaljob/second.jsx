import React from 'react';
import { useRouter } from 'next/router';
import { Star, MessageSquare, Briefcase, Award, CheckCircle, Globe, Send } from 'lucide-react';

// Import your translation files
import enTranslations from '../../../public/locales/en/globaljobs.json';
import trTranslations from '../../../public/locales/tr/globaljobs.json';
import arTranslations from '../../../public/locales/ar/globaljobs.json';
import frTranslations from '../../../public/locales/fr/globaljobs.json';
import deTranslations from '../../../public/locales/de/globaljobs.json';
import ruTranslations from '../../../public/locales/ru/globaljobs.json';
import faTranslations from '../../../public/locales/fa/globaljobs.json';
const GlobalJobPlacementSection = () => {
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
          case 'ru':
            return ruTranslations;
          case 'de':
            return deTranslations;
          default:
            return enTranslations;
        }
  };

  const t = getTranslations();

  return (
    <section className="py-20 bg-gradient-to-b from-sky-50 to-white">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center px-3 py-1 mb-4 bg-white border rounded-full shadow-sm border-sky-100">
            <div className="flex items-center justify-center w-5 h-5 mr-2 text-xs text-white rounded-full bg-sky-500">
              <Globe size={12} />
            </div>
            <span className="text-sm font-medium text-[#38B6FF]">{t.globaljob.section.header.badge}</span>
          </div>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            {t.globaljob.section.header.title.prefix} <span className="text-[#38B6FF]">{t.globaljob.section.header.title.highlight}</span>
          </h2>
          <div className="w-24 h-1 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]"></div>
          <p className="text-lg text-gray-600">
            {t.globaljob.section.header.description}
          </p>
        </div>

        {/* Content Area */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column - Info Card and Testimonials */}
          <div className="flex flex-col space-y-8">
            {/* Professional Journey Card */}
            <div className="relative flex-grow">
              {/* Animated accent */}
              <div className="absolute w-20 h-20 border-t-2 border-l-2 border-[#38B6FF] -left-4 -top-4 opacity-60"></div>
              
              <div className="relative h-full p-8 overflow-hidden bg-white shadow-xl rounded-xl">
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-full h-full opacity-5">
                  <div className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 rounded-full bg-[#38B6FF]"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 -mb-20 -ml-20 bg-[#38B6FF] rounded-full"></div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="mb-6 text-2xl font-bold text-gray-800">{t.globaljob.section.journey.title}</h3>
                  
                  <div className="space-y-6">
                    {t.globaljob.section.journey.features.map((feature, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100">
                            <CheckCircle className="w-4 h-4 text-[#38B6FF]" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-gray-800">{feature.title}</h4>
                          <p className="mt-1 text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <a href="/services">
                    <button className="inline-flex items-center px-6 py-3 font-medium text-white transition duration-300 transform rounded-lg bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] hover:shadow-lg hover:-translate-y-1">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {t.globaljob.section.journey.cta.text}
                    </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonials */}
            <div className="p-1 shadow-lg bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] rounded-xl">
              <div className="p-6 bg-white rounded-lg">
                <div className="flex items-center mb-4">
                  <Award className="w-6 h-6 mr-2 text-yellow-500" />
                  <h3 className="text-xl font-bold text-gray-800">{t.globaljob.section.testimonials.title}</h3>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {t.globaljob.section.testimonials.reviews.map((review, index) => (
                    <div key={index} className="p-4 transition-all duration-300 rounded-lg bg-sky-50 hover:shadow-md">
                      <div className="flex mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <p className="mb-4 text-sm text-gray-600">
                        {review.comment}
                      </p>
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-gradient-to-r from-sky-500 to-blue-500">
                            <span className="font-medium">{review.initials}</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{review.name}</p>
                          <p className="text-xs text-gray-500">{review.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact Form */}
          <div className="h-full">
            <div className="flex flex-col overflow-hidden bg-white shadow-xl rounded-xl">
              <div className="p-6 bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]">
                <h3 className="text-xl font-bold text-white">{t.globaljob.section.contact.title}</h3>
                <p className="mt-1 text-sky-100">{t.globaljob.section.contact.subtitle}</p>
              </div>
              
              <div className="flex flex-col flex-grow p-6">
                <div className="flex flex-col flex-grow space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">{t.globaljob.section.contact.form.name.label}</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 text-gray-700 border-none rounded-lg bg-gray-50 focus:ring-2 focus:ring-sky-400"
                      placeholder={t.globaljob.section.contact.form.name.placeholder}
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">{t.globaljob.section.contact.form.email.label}</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 text-gray-700 border-none rounded-lg bg-gray-50 focus:ring-2 focus:ring-sky-400"
                      placeholder={t.globaljob.section.contact.form.email.placeholder}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <label className="block mb-2 text-sm font-medium text-gray-700">{t.globaljob.section.contact.form.message.label}</label>
                    <textarea 
                      className="flex-grow w-full h-40 px-4 py-3 text-gray-700 border-none rounded-lg bg-gray-50 focus:ring-2 focus:ring-sky-400"
                      placeholder={t.globaljob.section.contact.form.message.placeholder}
                    ></textarea>
                  </div>
                  
                  <div className="mt-auto">
                    <button type="submit" className="flex items-center justify-center w-full px-6 py-3 font-medium text-white transition duration-300 rounded-lg bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] hover:shadow-lg">
                      <Send className="w-4 h-4 mr-2" />
                      {t.globaljob.section.contact.form.submit}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalJobPlacementSection;