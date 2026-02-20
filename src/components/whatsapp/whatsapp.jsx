import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const WhatsAppButton = ({ 
  phoneNumber = '905011240340', 
  welcomeTexts
}) => {
  const { t } = useTranslation('common');
  const defaultWelcomeTexts = [t('whatsapp.title')];
  const texts = welcomeTexts && welcomeTexts.length > 0 ? welcomeTexts : defaultWelcomeTexts;
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [message, setMessage] = useState(texts[0]);
  
  // Ensure the phone number is properly formatted (remove +, spaces, etc)
  const formattedNumber = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`;
  
  // Rotate through welcome texts
  useEffect(() => {
    const textRotationInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % texts.length;
        setMessage(texts[nextIndex]);
        return nextIndex;
      });
    }, 3000);
    
    // Add fade-in effect when component mounts
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    
    return () => {
      clearInterval(textRotationInterval);
      clearTimeout(visibilityTimer);
    };
  }, [texts]);
  
  // Button bounce animation
  const [isBouncing, setIsBouncing] = useState(false);
  
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 1000);
    }, 5000);
    
    return () => clearInterval(bounceInterval);
  }, []);
  
  return (
    <div className={`fixed bottom-6 right-6 flex flex-col items-end z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Dynamic message bubble that's always visible */}
      
      
      {/* Main WhatsApp button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          flex items-center justify-center
          w-16 h-16 rounded-full
          bg-gradient-to-r from-green-500 to-green-600
          text-white shadow-lg
          transform transition-all duration-300
          ${isHovered ? 'scale-110 shadow-xl' : ''}
          ${isBouncing ? 'animate-bounce' : ''}
        `}
        aria-label={t('whatsapp.ariaLabel')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* WhatsApp logo */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          width="30" 
          height="30" 
          fill="currentColor"
          className="drop-shadow"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm.029 18.88a7.947 7.947 0 01-3.77-.955l-.271-.162-2.805.737.75-2.742-.177-.282a7.954 7.954 0 01-1.042-3.937c0-4.374 3.564-7.938 7.941-7.938 2.121 0 4.112.827 5.609 2.325a7.923 7.923 0 012.331 5.61c0 4.375-3.559 7.944-7.936 7.944z" />
        </svg>
        
        {/* Ripple effect */}
        <span className="absolute w-full h-full rounded-full animate-ping bg-green-400 opacity-25"></span>
      </a>
      
      {/* Online status indicator */}
      <div className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
    </div>
  );
};

export default WhatsAppButton;