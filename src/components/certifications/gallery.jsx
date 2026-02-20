import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

// Import translation files for all 7 languages
import enTranslations from "../../../public/locales/en/certificationcarousel.json";
// import trTranslations from '../../../public/locales/tr/certificationcarousel.json';
// import frTranslations from '../../../public/locales/fr/certificationcarousel.json';
// import deTranslations from '../../../public/locales/de/certificationcarousel.json';
// import arTranslations from '../../../public/locales/ar/certificationcarousel.json';
// import ruTranslations from '../../../public/locales/ru/certificationcarousel.json';
// import faTranslations from '../../../public/locales/fa/certificationcarousel.json';

const CertificationCarousel = () => {
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
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  // Data from your existing code - we'll extract the images from the events
  const events = [
    {
      id: 1,
      title: t.events.event1.title,
      location: t.events.event1.location,
      date: t.events.event1.date,
      description: t.events.event1.description,
      logo: "/api/placeholder/150/60",
      images: [
        {
          url: "/logos/1.jpg",
          alt: t.events.event1.images.image1.alt,
          caption: t.events.event1.images.image1.caption,
        },
        {
          url: "/logos/2.jpg",
          alt: t.events.event1.images.image2.alt,
          caption: t.events.event1.images.image2.caption,
        },
        {
          url: "/logos/3.jpg",
          alt: t.events.event1.images.image3.alt,
          caption: t.events.event1.images.image3.caption,
        },
        {
          url: "/logos/4.jpg",
          alt: t.events.event1.images.image4.alt,
          caption: t.events.event1.images.image4.caption,
        },
        {
          url: "/logos/5.jpg",
          alt: t.events.event1.images.image5.alt,
          caption: t.events.event1.images.image5.caption,
        },
      ],
    },
    {
      id: 2,
      title: t.events.event2.title,
      location: t.events.event2.location,
      date: t.events.event2.date,
      description: t.events.event2.description,
      logo: "/api/placeholder/150/60",
      images: [
        {
          url: "/logos/6.jpg",
          alt: t.events.event2.images.image1.alt,
          caption: t.events.event2.images.image1.caption,
        },
        {
          url: "/logos/7.jpg",
          alt: t.events.event2.images.image2.alt,
          caption: t.events.event2.images.image2.caption,
        },
        {
          url: "/logos/8.jpg",
          alt: t.events.event2.images.image3.alt,
          caption: t.events.event2.images.image3.caption,
        },
      ],
    },
  ];

  // Combine all images from events to use as certification images
  const certifications = events.flatMap((event) =>
    event.images.map((img) => ({
      id: `${event.id}-${img.url.split("/").pop()}`,
      image: img.url,
      title: img.alt,
    }))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const sliderRef = useRef(null);
  const autoplayTimeoutRef = useRef(null);

  // Calculate the position and rotation for each card
  const calculateCardStyle = (index) => {
    const totalCards = certifications.length;
    const cardsVisible = 5; // Show 5 cards

    // Calculate distance from the current card (centered at 0)
    const normalizedIndex =
      (((index - currentIndex) % totalCards) + totalCards) % totalCards;
    const distance = Math.min(normalizedIndex, totalCards - normalizedIndex);

    // Only show a limited number of cards on each side
    if (distance > Math.floor(cardsVisible / 2)) {
      return {
        opacity: 0,
        transform: "translateX(-200%) scale(0.5)",
        zIndex: -10,
        pointerEvents: "none",
      };
    }

    // Calculate position for 5 cards layout
    const position = (() => {
      if (normalizedIndex === 0) return 0; // Center card
      if (normalizedIndex === 1 || normalizedIndex === totalCards - 1)
        return normalizedIndex === 1 ? 1 : -1; // Cards adjacent to center
      if (normalizedIndex === 2 || normalizedIndex === totalCards - 2)
        return normalizedIndex === 2 ? 2 : -2; // Cards on outer positions

      // For other cards, determine if they're on left or right side
      const side = normalizedIndex <= totalCards / 2 ? 1 : -1;
      const distanceFromCenter = Math.min(
        normalizedIndex,
        totalCards - normalizedIndex
      );
      return side * distanceFromCenter;
    })();

    // Apply different transformations based on position
    if (position === 0) {
      // Center card
      return {
        opacity: 1,
        transform: "translateZ(150px) scale(1.1)",
        zIndex: 30,
        filter: "brightness(1) drop-shadow(0 15px 25px rgba(0,0,0,0.2))",
      };
    } else {
      // Side cards - positioned with proper spacing for 5 cards
      const xPosition = position * 210; // Increased spacing between cards
      const zPosition = -Math.abs(position) * 25; // Less z-depth to reduce overlapping
      const yRotation = position * -12; // Reduced rotation for better visibility

      const distanceFromCenter = Math.abs(position);
      const scale = 1 - distanceFromCenter * 0.08; // Reduced scaling difference
      const zIndex = 20 - distanceFromCenter * 5;
      const brightness = 1 - distanceFromCenter * 0.08;

      return {
        opacity: 1,
        transform: `translateX(${xPosition}px) translateZ(${zPosition}px) rotateY(${yRotation}deg) scale(${scale})`,
        zIndex: zIndex,
        filter: `brightness(${brightness}) drop-shadow(0 8px 15px rgba(0,0,0,0.15))`,
      };
    }
  };

  // Handle navigation
  const navigate = (direction) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newIndex =
      (currentIndex + direction + certifications.length) %
      certifications.length;
    setCurrentIndex(newIndex);

    // Reset animation flag
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Autoplay effect
  useEffect(() => {
    if (autoplay) {
      autoplayTimeoutRef.current = setTimeout(() => {
        navigate(1);
      }, 3000);
    }

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [currentIndex, autoplay]);

  // Key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        navigate(-1);
      } else if (e.key === "ArrowRight") {
        navigate(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex]);

  // Toggle autoplay
  const toggleAutoplay = () => {
    setAutoplay(!autoplay);
  };

  // Primary color from requested hex
  const primaryColor = "#51bae7";

  return (
    <div className="relative pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] flex flex-col items-center justify-center overflow-hidden">
      {/* Enhanced background with geometric patterns and professional elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-white"></div>

        {/* Modern geometric pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, ${primaryColor} 0.5px, transparent 0.5px), 
              radial-gradient(circle at 80% 80%, ${primaryColor} 0.5px, transparent 0.5px),
              radial-gradient(circle at 20% 80%, ${primaryColor} 0.5px, transparent 0.5px),
              radial-gradient(circle at 80% 20%, ${primaryColor} 0.5px, transparent 0.5px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Abstract certificate shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-5"
          >
            <path
              d="M-100 250C250 150 350 -50 600 100C850 250 1000 0 1300 200"
              stroke={primaryColor}
              strokeWidth="1.5"
            />
            <path
              d="M-100 450C200 400 450 300 650 500C850 700 1050 500 1300 600"
              stroke={primaryColor}
              strokeWidth="1.5"
            />
            <path
              d="M-100 750C150 600 350 800 600 650C900 450 1100 700 1300 600"
              stroke={primaryColor}
              strokeWidth="1.5"
            />
            <circle
              cx="200"
              cy="200"
              r="80"
              stroke={primaryColor}
              strokeWidth="1.5"
            />
            <circle
              cx="1000"
              cy="600"
              r="100"
              stroke={primaryColor}
              strokeWidth="1.5"
            />
            <circle
              cx="600"
              cy="400"
              r="200"
              stroke={primaryColor}
              strokeWidth="1.5"
              strokeDasharray="5,5"
            />
          </svg>
        </div>

        {/* Layered circular glows */}
        <div
          className="absolute w-64 h-64 rounded-full top-1/4 left-1/4 opacity-10"
          style={{ backgroundColor: primaryColor, filter: "blur(80px)" }}
        ></div>
        <div
          className="absolute rounded-full bottom-1/4 right-1/5 w-80 h-80 opacity-10"
          style={{ backgroundColor: primaryColor, filter: "blur(100px)" }}
        ></div>

        {/* Certificate ribbon elements */}
        <div
          className="absolute top-0 right-0 w-48 h-48 opacity-10"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, transparent 50%)`,
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-48 h-48 opacity-10"
          style={{
            background: `linear-gradient(-45deg, ${primaryColor} 0%, transparent 50%)`,
          }}
        ></div>

        {/* Professional seal patterns */}
        <div className="absolute w-40 h-40 top-8 left-1/3 opacity-8">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke={primaryColor}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <circle
              cx="100"
              cy="100"
              r="60"
              stroke={primaryColor}
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="40"
              stroke={primaryColor}
              strokeWidth="1"
              strokeDasharray="8,8"
            />
            <path
              d="M100 40L105 60H125L110 70L115 90L100 80L85 90L90 70L75 60H95L100 40Z"
              fill={primaryColor}
              fillOpacity="0.2"
            />
          </svg>
        </div>

        <div className="absolute w-40 h-40 bottom-8 right-1/3 opacity-8">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke={primaryColor}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <circle
              cx="100"
              cy="100"
              r="60"
              stroke={primaryColor}
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="40"
              stroke={primaryColor}
              strokeWidth="1"
              strokeDasharray="8,8"
            />
            <path
              d="M100 40L105 60H125L110 70L115 90L100 80L85 90L90 70L75 60H95L100 40Z"
              fill={primaryColor}
              fillOpacity="0.2"
            />
          </svg>
        </div>

        {/* Elegant "CERTIFICATIONS" watermark */}
        <div
          className="absolute z-0 font-bold tracking-widest transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-9xl opacity-5 whitespace-nowrap"
          style={{
            color: primaryColor,
            textShadow: `0 0 50px ${primaryColor}30`,
          }}
        >
          {t.background.watermark}
        </div>
      </div>

      {/* Header with subtle branding */}
      <div className="relative z-10 flex items-center mb-6">
        <div className="flex items-center"></div>
      </div>

      {/* 3D Perspective container - centered and with more space */}
      <div className="relative w-full max-w-7xl h-[32rem] perspective-1200 mb-12 z-10 mx-auto flex items-center justify-center">
        <div
          ref={sliderRef}
          className="relative flex items-center justify-center w-full h-full transition-transform duration-500 ease-out transform-style-3d"
        >
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="absolute overflow-hidden transition-all duration-500 ease-out bg-white border border-gray-200 shadow-lg transform-style-3d w-72 h-96 rounded-xl hover:shadow-xl"
              style={calculateCardStyle(index)}
            >
              <div className="relative flex flex-col w-full h-full">
                {/* Image container */}
                <div className="flex items-center justify-center w-full overflow-hidden h-[86%] bg-gray-50">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="object-contain w-full h-full transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Title bar - using requested color */}
                <div
                  className="flex items-center justify-between h-[14%] px-5"
                  style={{ backgroundColor: primaryColor }}
                >
                  <h3 className="text-sm font-medium text-white truncate">
                    {cert.title}
                  </h3>

                  {/* Number indicator */}
                  <div
                    className="flex items-center justify-center w-6 h-6 text-xs font-bold bg-white rounded-full shadow-sm"
                    style={{ color: primaryColor }}
                  >
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Certificate seal effect */}
              <div className="absolute w-14 h-14 top-4 right-4 opacity-90">
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0 border-2 border-dashed rounded-full"
                    style={{ borderColor: `${primaryColor}30` }}
                  ></div>
                  <div
                    className="absolute rounded-full inset-1 opacity-10"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 12L22 18H28L23 22L25 28L20 24L15 28L17 22L12 18H18L20 12Z"
                      fill={primaryColor}
                      fillOpacity="0.3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls - using the requested color, larger and better positioned */}
      <div className="z-20 flex items-center justify-center space-x-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-16 h-16 text-white transition-all duration-300 rounded-full shadow-md hover:shadow-xl"
          style={{ backgroundColor: primaryColor }}
          disabled={isAnimating}
          aria-label={t.controls.previous}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={toggleAutoplay}
          className={`text-white rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl ${
            !autoplay ? "opacity-70 hover:opacity-100" : ""
          }`}
          style={{ backgroundColor: primaryColor }}
          aria-label={autoplay ? t.controls.pause : t.controls.play}
        >
          {autoplay ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </button>

        <button
          onClick={() => navigate(1)}
          className="flex items-center justify-center w-16 h-16 text-white transition-all duration-300 rounded-full shadow-md hover:shadow-xl"
          style={{ backgroundColor: primaryColor }}
          disabled={isAnimating}
          aria-label={t.controls.next}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Indicator dots - using the requested color, larger and better spaced */}
      <div className="z-20 flex justify-center mt-5 mb-5 space-x-3">
        {certifications.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setCurrentIndex(index);
              }
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-10 h-3"
                : "w-3 h-3 opacity-60 hover:opacity-100"
            }`}
            style={{ backgroundColor: primaryColor }}
            aria-label={`${t.controls.goToSlide} ${index + 1}`}
          />
        ))}
      </div>

      {/* Custom CSS Classes */}
      <style jsx global>{`
        .perspective-1200 {
          perspective: 1200px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default CertificationCarousel;
