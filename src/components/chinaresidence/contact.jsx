import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Phone, Mail, MapPin, Clock, Globe, Building } from 'lucide-react';

// Import translation files for all 7 languages
import enTranslations from '../../../public/locales/en/china3.json';
import trTranslations from '../../../public/locales/tr/china3.json';
import frTranslations from '../../../public/locales/fr/china3.json';
import deTranslations from '../../../public/locales/de/china3.json';
import arTranslations from '../../../public/locales/ar/china3.json';
import ruTranslations from '../../../public/locales/ru/china3.json';
import faTranslations from '../../../public/locales/fa/china3.json';

const ContactsSection = () => {
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

  const [activeLocation, setActiveLocation] = useState(0);

  const contacts = [
    {
      id: 1,
      country: t.locations.turkey.country,
      city: t.locations.turkey.city,
      address: t.locations.turkey.address,
      phone: "+90 242 123 4567",
      email: "antalya@uniadmire.com",
      hours: t.locations.turkey.hours,
      icon: Building,
      color: "from-sky-400 to-blue-500",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.123!2d30.713889!3d36.896389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c390e5e6e5e6e5%3A0x123456789!2sAdnan%20Menderes%20Blv.%2C%20Muratpa%C5%9Fa%2FAntalya%2C%20Turkey!5e0!3m2!1sen!2s!4v1640995200000!5m2!1sen!2s"
    },
    {
      id: 2,
      country: t.locations.pakistan.country, 
      city: t.locations.pakistan.city,
      address: t.locations.pakistan.address,
      phone: "+92 21 3456 7890",
      email: "karachi@uniadmire.com", 
      hours: t.locations.pakistan.hours,
      icon: Building,
      color: "from-emerald-400 to-teal-500",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.123!2d67.0011!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e06651d4bbf%3A0x9cf92f44555a0c23!2sShahrah%20e%20Faisal%2C%20Karachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1640995200000!5m2!1sen!2s"
    },
    {
      id: 3,
      country: t.locations.azerbaijan.country,
      city: t.locations.azerbaijan.city, 
      address: t.locations.azerbaijan.address,
      phone: "+994 12 345 6789",
      email: "baku@uniadmire.com",
      hours: t.locations.azerbaijan.hours, 
      icon: Building,
      color: "from-violet-400 to-purple-500",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.123!2d49.8671!3d40.4093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f69143d36b2e4!2sNizami%20St%2C%20Baku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1640995200000!5m2!1sen!2s"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-sky-50 via-blue-50/30 to-sky-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 bg-sky-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-48 h-48 bg-blue-300 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-sky-900 mb-6">
            {t.header.title}
          </h2>
          <p className="text-xl text-sky-600 max-w-3xl">
            {t.header.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information Cards */}
          <div className="space-y-6">
            {/* Main Email */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-sky-900">{t.generalInquiries.title}</h3>
                  <p className="text-sky-600">{t.generalInquiries.subtitle}</p>
                </div>
              </div>
              <a 
                href="mailto:info@uniadmire.com" 
                className="text-2xl font-bold text-sky-700 hover:text-sky-800 transition-colors duration-300"
              >
                info@uniadmire.com
              </a>
            </div>

            {/* Office Locations */}
            {contacts.map((contact, index) => {
              const Icon = contact.icon;
              const isActive = activeLocation === index;
              
              return (
                <div
                  key={contact.id}
                  className={`group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    isActive
                      ? 'bg-white/90 backdrop-blur-lg border-sky-300/50 scale-105 shadow-2xl'
                      : 'bg-white/60 backdrop-blur-lg border-sky-200/30 hover:bg-white/80 hover:scale-102 hover:shadow-lg'
                  }`}
                  onClick={() => setActiveLocation(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${contact.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-sky-900">{contact.country}</h3>
                        <span className="text-sky-600">•</span>
                        <span className="text-lg font-semibold text-sky-700">{contact.city}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-4 h-4 text-sky-500 mt-1 flex-shrink-0" />
                          <p className="text-sky-600 text-sm leading-relaxed">{contact.address}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-sky-500" />
                          <a 
                            href={`tel:${contact.phone}`}
                            className="text-sky-700 font-medium hover:text-sky-800 transition-colors duration-300"
                          >
                            {contact.phone}
                          </a>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-sky-500" />
                          <a 
                            href={`mailto:${contact.email}`}
                            className="text-sky-700 font-medium hover:text-sky-800 transition-colors duration-300"
                          >
                            {contact.email}
                          </a>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-sky-500" />
                          <span className="text-sky-600 text-sm">{contact.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-200/20 to-transparent rounded-2xl animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Google Maps */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-sky-900">{t.map.title}</h3>
              </div>
              
              {/* Google Map Embed */}
              <div className="relative w-full h-96 rounded-xl overflow-hidden border border-sky-200/30 shadow-lg">
                <iframe
                  src={contacts[activeLocation].mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
                
                {/* Map Overlay with Office Selector */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/50">
                    <select 
                      value={activeLocation}
                      onChange={(e) => setActiveLocation(parseInt(e.target.value))}
                      className="bg-transparent text-sky-900 font-semibold text-sm focus:outline-none cursor-pointer"
                    >
                      {contacts.map((contact, index) => (
                        <option key={contact.id} value={index}>
                          📍 {contact.city}, {contact.country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Active Location Info */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="bg-white/95 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-white/50">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${contacts[activeLocation].color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sky-900 mb-1">
                          {contacts[activeLocation].city}, {contacts[activeLocation].country}
                        </h4>
                        <p className="text-sky-600 text-sm mb-2 line-clamp-2">
                          {contacts[activeLocation].address}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <a 
                            href={`tel:${contacts[activeLocation].phone}`}
                            className="flex items-center space-x-1 text-sky-700 hover:text-sky-800 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{contacts[activeLocation].phone}</span>
                          </a>
                          <a 
                            href={`mailto:${contacts[activeLocation].email}`}
                            className="flex items-center space-x-1 text-sky-700 hover:text-sky-800 transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{t.map.email}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Navigation Buttons */}
              <div className="flex justify-center space-x-2 mt-4">
                {contacts.map((contact, index) => (
                  <button
                    key={contact.id}
                    onClick={() => setActiveLocation(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      index === activeLocation
                        ? `bg-gradient-to-r ${contact.color} text-white shadow-lg scale-105`
                        : 'bg-sky-100/80 text-sky-700 hover:bg-sky-200/80 hover:scale-105'
                    }`}
                  >
                    {contact.city}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Contact CTA */}
            <div className="mt-6 text-center">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Phone className="w-5 h-5 mr-3" />
                {t.cta.scheduleConsultation}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;