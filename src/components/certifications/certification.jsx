import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Download, Award, CheckCircle, Eye, FileText, Bookmark, Calendar, ExternalLink } from 'lucide-react';

// Import translation files for all 7 languages
import enTranslations from '../../../public/locales/en/certifications.json';
// import trTranslations from '../../../public/locales/tr/certifications.json';
// import frTranslations from '../../../public/locales/fr/certifications.json';
// import deTranslations from '../../../public/locales/de/certifications.json';
// import arTranslations from '../../../public/locales/ar/certifications.json';
// import ruTranslations from '../../../public/locales/ru/certifications.json';
// import faTranslations from '../../../public/locales/fa/certifications.json';

// Enhanced download function with success callback
const downloadCertificate = (certificateNumber, onSuccess) => {
  // Path to certificate file based on number
  const filePath = `/certificates/${certificateNumber}.pdf`;
  
  // Create and trigger download link
  const link = document.createElement('a');
  link.href = filePath;
  link.download = `certificate-${certificateNumber}.pdf`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Notify of successful download
  setTimeout(() => {
    if (onSuccess) onSuccess();
  }, 800);
};

// Certificate Card Component
const CertificateCard = ({ number, title, issuer, date, description, color, t }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDownloading(true);
    
    downloadCertificate(number, () => {
      setIsDownloading(false);
    });
  };
  
  return (
    <div 
      className="relative flex flex-col h-full transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Card container with hover effects */}
      <div 
        className={`relative w-full h-full overflow-hidden bg-white rounded-xl border border-gray-100 transition-all duration-300 ${
          isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-sm'
        }`}
        style={{ borderTop: `3px solid ${color}` }}
      >
        {/* Corner accent */}
        <div 
          className="absolute top-0 right-0 w-16 h-16 overflow-hidden"
        >
          <div 
            className="absolute w-16 h-8 transform rotate-45 translate-x-8 -translate-y-8"
            style={{ background: `${color}40` }}
          ></div>
        </div>
        
        {/* Certificate number badge */}
        <div 
          className="absolute flex items-center justify-center text-xs font-bold text-white transition-all duration-300 rounded-full shadow-sm top-3 right-3 w-7 h-7 group-hover:scale-110"
          style={{ background: color }}
        >
          {number}
        </div>
        
        {/* Card content */}
        <div className="flex flex-col h-full p-4">
          {/* Certificate icon & title */}
          <div className="mb-3">
            <div 
              className="flex items-center justify-center w-10 h-10 mb-3 transition-all duration-300 rounded-lg group-hover:scale-110"
              style={{ background: `${color}15` }}
            >
              <Award size={20} style={{ color: color }} />
            </div>
            
            <h3 
              className="text-base font-bold text-gray-800 transition-all duration-300 line-clamp-1 group-hover:text-gray-900"
              style={{ color: isHovered ? color : '' }}
            >
              {title}
            </h3>
          </div>
          
          {/* Issuer & date info */}
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-center gap-1.5">
              <Bookmark size={12} className="text-gray-400" />
              <span className="text-xs text-gray-600">{issuer}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-gray-400" />
              <span className="text-xs text-gray-600">{date}</span>
            </div>
          </div>
          
          {/* Description preview (collapsed) */}
          <div className="mt-auto mb-3">
            <p className="text-xs text-gray-500 line-clamp-2">
              {description}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between">
            {/* Verification badge */}
            <div className="flex items-center gap-1">
              <CheckCircle size={12} style={{ color }} />
              <span className="text-xs text-gray-500">{t.card.verified}</span>
            </div>
            
            {/* Download button */}
            <button 
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                isDownloading ? 'opacity-80' : 'opacity-100'
              }`}
              style={{ 
                background: isHovered ? color : `${color}15`,
                color: isHovered ? 'white' : color
              }}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <span className="flex items-center">
                  <Download size={12} className="mr-1 animate-bounce" />
                  <span>{t.card.downloading}</span>
                </span>
              ) : (
                <span className="flex items-center">
                  <Download size={12} className="mr-1" />
                  <span>{t.card.download}</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal for detailed view */}
      {showDetails && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDetails(false);
          }}
        >
          <div 
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div 
                  className="flex items-center justify-center w-12 h-12 rounded-lg"
                  style={{ background: `${color}15` }}
                >
                  <Award size={24} style={{ color: color }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium" style={{ color }}>#{number}</span>
                    <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-sm text-gray-600">{issuer}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal content */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">{t.modal.issuedOn} {date}</span>
              </div>
              
              <div className="mb-6">
                <h4 className="mb-2 text-sm font-medium text-gray-700">{t.modal.description}</h4>
                <div 
                  className="p-3 text-sm leading-relaxed text-gray-600 rounded-lg bg-gray-50"
                >
                  {description}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-3">
                <button 
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => window.open(`/certificates/${number}.pdf`, '_blank')}
                >
                  <Eye size={16} />
                  <span>{t.modal.preview}</span>
                </button>
                
                <button 
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white transition-colors duration-200"
                  style={{ background: color }}
                  onClick={handleDownload}
                >
                  <Download size={16} />
                  <span>{t.modal.download}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CertificationsPage = () => {
  const router = useRouter();
  const { locale } = router;

  const getTranslations = () => {
    switch (locale) {
      // case 'tr': return trTranslations;
      // case 'fr': return frTranslations;
      // case 'de': return deTranslations;
      // case 'ar': return arTranslations;
      // case 'ru': return ruTranslations;
      // case 'fa': return faTranslations;
      default: return enTranslations;
    }
  };

  const t = getTranslations();

  // Certificate data
  const certificates = [
    {
      number: "1",
      title: t.certificates.cert1.title,
      issuer: t.certificates.cert1.issuer,
      date: t.certificates.cert1.date,
      description: t.certificates.cert1.description,
      color: "#51bae7"
    },
    {
      number: "2",
      title: t.certificates.cert2.title,
      issuer: t.certificates.cert2.issuer,
      date: t.certificates.cert2.date,
      description: t.certificates.cert2.description,
      color: "#51bae7"
    },
    {
      number: "3",
      title: t.certificates.cert3.title,
      issuer: t.certificates.cert3.issuer,
      date: t.certificates.cert3.date,
      description: t.certificates.cert3.description,
      color: "#51bae7"
    },
    {
      number: "4",
      title: t.certificates.cert4.title,
      issuer: t.certificates.cert4.issuer,
      date: t.certificates.cert4.date,
      description: t.certificates.cert4.description,
      color: "#51bae7"
    }
  ];
  
  return (
    <div className="px-6 py-16 bg-gradient-to-b from-blue-50/50 to-white">
      {/* Decorative background elements */}
      <div className="absolute w-32 h-32 rounded-full top-40 right-20 bg-blue-100/30 blur-3xl -z-10"></div>
      <div className="absolute w-40 h-40 rounded-full bottom-20 left-10 bg-blue-200/20 blur-3xl -z-10"></div>
      
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 border rounded-full shadow-sm bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200/30">
            <FileText size={28} className="text-blue-600" />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-800">{t.header.title}</h2>
          <div className="w-16 h-1 mx-auto mb-4 bg-gradient-to-r from-primary to-primary"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            {t.header.description}
          </p>
        </div>
        
        {/* Certification cards grid - 4 columns */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <CertificateCard 
              key={certificate.number}
              {...certificate}
              t={t}
            />
          ))}
        </div>
        
        {/* Additional info section */}
       
      </div>
    </div>
  );
};

export default CertificationsPage;