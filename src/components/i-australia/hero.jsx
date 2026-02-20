import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Import your translation files
import enTranslations from "../../../public/locales/en/australiaimmi.json";
import trTranslations from "../../../public/locales/tr/australiaimmi.json";
// import arTranslations from '../../../public/locales/ar/australiaimmi.json';
// import frTranslations from '../../../public/locales/fr/australiaimmi.json';
// import deTranslations from '../../../public/locales/de/australiaimmi.json';

const HeroSection = () => {
  const router = useRouter();
  const { locale } = router;
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      // case 'fr':
      //   return frTranslations;
      // case 'de':
      //   return deTranslations;
      //   case 'ar':
      //     return arTranslations;
      case "tr":
        return trTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();
  const isRTL = locale === "ar" || locale === "fa";

  // Get destinations from translations
  const destinations = t.heroSection.destinations || [];

  // Effect for continuous rotation
  useEffect(() => {
    if (isPaused || destinations.length === 0) return;

    const interval = setInterval(() => {
      setRotationAngle((prev) => {
        const newAngle = prev + 0.5; // Slower rotation for elegance

        // Update active index based on rotation
        if (newAngle % (360 / destinations.length) === 0) {
          setActiveIndex((activeIndex + 1) % destinations.length);
        }
        return newAngle;
      });
    }, 30); // Smoother with more frequent but smaller updates

    return () => clearInterval(interval);
  }, [activeIndex, destinations.length, isPaused]);

  // Manual selection handler
  const handleSelectImage = (index) => {
    setActiveIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000); // Resume rotation after 3s
  };

  // Get compass directions based on locale
  const getCompassDirections = () => {
    if (isRTL) {
      return t.heroSection.compass || ["ش", "ج", "ق", "غ"]; // Arabic: North, East, South, West
    }
    return t.heroSection.compass || ["N", "E", "S", "W"];
  };

  return (
    <div
      className={`relative w-full overflow-hidden pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Dynamic background based on active image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-1000"
        style={{
          backgroundImage:
            destinations.length > 0
              ? `url(${destinations[activeIndex]?.img})`
              : "none",
          filter: "blur(12px) brightness(0.4)",
          transform: "scale(1.1)",
        }}
      >
        {/* Color overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-indigo-900/80 z-10"></div>
      </div>

      {/* Light beam effect */}
      <div
        className={`absolute top-0 w-96 h-screen bg-blue-400 opacity-10 rotate-15 transform -skew-x-12 ${isRTL ? "left-1/4" : "right-1/4"}`}
        style={{ filter: "blur(40px)" }}
      ></div>

      {/* Moving star particles */}
      <div className="absolute inset-0 z-5 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `float ${Math.random() * 15 + 15}s linear infinite`,
            }}
          ></div>
        ))}
      </div>

      {/* Content container */}
      <div className="container mx-auto h-full px-4 py-8 relative z-20">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-12 h-5/6 items-center ${isRTL ? "md:grid-flow-col-dense" : ""}`}
        >
          {/* Text content */}
          <div
            className={`text-white z-10 space-y-6 ${isRTL ? "md:col-start-2 md:pl-8 text-right" : "md:pr-8 text-left"}`}
          >
            <div
              className={`flex items-center mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-12 h-1 bg-blue-500 ${isRTL ? "ml-4" : "mr-4"}`}
              ></div>
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-300">
                {t.heroSection.badge}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {t.heroSection.title}
            </h1>

            <p className="text-xl text-gray-200 max-w-xl">
              {t.heroSection.description}
            </p>

            {/* Currently viewing indicator */}
            {destinations.length > 0 && (
              <div className="pt-6 pb-2">
                <p className="text-sm text-blue-300 uppercase tracking-wide">
                  {t.heroSection.currentlyViewing}
                </p>
                <p className="text-2xl font-semibold">
                  {destinations[activeIndex]?.name},{" "}
                  <span className="font-normal text-gray-300">
                    {destinations[activeIndex]?.country}
                  </span>
                </p>
              </div>
            )}

            <div
              className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 pt-4 ${isRTL ? "sm:space-x-reverse sm:flex-row-reverse" : "sm:space-x-4"}`}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center">
                <span>{t.heroSection.buttons.explore}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-bold py-4 px-10 rounded-lg transition duration-300 backdrop-blur-sm">
                {t.heroSection.buttons.viewAll}
              </button>
            </div>
          </div>

          {/* Enhanced Circular Carousel */}
          <div
            className={`flex items-center justify-center z-10 py-8 md:py-0 ${isRTL ? "md:col-start-1" : ""}`}
          >
            <div
              className="relative"
              style={{ width: "540px", height: "540px" }}
            >
              {/* Animated glow effect */}
              <div
                className="absolute top-1/2 left-1/2 w-3/4 h-3/4 rounded-full"
                style={{
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.1) 50%, rgba(0,0,0,0) 70%)",
                  animation: "pulse 3s infinite",
                }}
              ></div>

              {/* Outer decorative rings */}
              <div className="absolute inset-0 rounded-full border border-white opacity-10"></div>
              <div className="absolute inset-4 rounded-full border border-white opacity-20"></div>

              {/* Main orbit path */}
              <div
                className="absolute inset-12 rounded-full border border-white opacity-30"
                style={{ boxShadow: "0 0 20px rgba(59,130,246,0.2)" }}
              ></div>

              {/* Compass points markers */}
              {getCompassDirections().map((direction, i) => {
                const angle = i * 90;
                const radian = angle * (Math.PI / 180);
                const radius = 48;
                const x = 50 + radius * Math.cos(radian);
                const y = 50 + radius * Math.sin(radian);

                return (
                  <div
                    key={direction}
                    className="absolute flex items-center justify-center rounded-full w-6 h-6 text-xs font-bold text-blue-300 border border-blue-300 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      backgroundColor: "rgba(59,130,246,0.2)",
                    }}
                  >
                    {direction}
                  </div>
                );
              })}

              {/* Orbiting Images */}
              {destinations.map((dest, index) => {
                // Calculate position in the circle
                const angle =
                  index * (360 / destinations.length) + rotationAngle;
                const radian = angle * (Math.PI / 180);
                const radius = 42; // Percentage of container size

                // Calculate x and y position
                const x = 50 + radius * Math.cos(radian);
                const y = 50 + radius * Math.sin(radian);

                // Fixed size for all images
                const size = 24; // Same size for all images

                // Calculate z-index (higher when in front)
                const zIndex = Math.round(
                  100 * Math.cos((angle - rotationAngle) * (Math.PI / 180))
                );

                // Calculate front position for additional effects
                const isFront =
                  Math.cos((angle - rotationAngle) * (Math.PI / 180)) > 0.7;

                return (
                  <div
                    key={index}
                    className="absolute rounded-full overflow-hidden shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${size}%`,
                      height: `${size}%`,
                      zIndex,
                      opacity:
                        0.7 +
                        0.3 *
                          Math.cos((angle - rotationAngle) * (Math.PI / 180)),
                      transform: `translate(-50%, -50%) scale(${isFront ? 1.1 : 1})`,
                      border:
                        index === activeIndex
                          ? "4px solid #3B82F6"
                          : "4px solid rgba(255,255,255,0.7)",
                      boxShadow:
                        index === activeIndex
                          ? "0 0 0 4px rgba(59,130,246,0.3), 0 8px 20px rgba(0,0,0,0.4)"
                          : "0 4px 12px rgba(0,0,0,0.25)",
                    }}
                    onClick={() => handleSelectImage(index)}
                  >
                    <img
                      src={dest.img}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Hover and front position label */}
                    {(isFront || index === activeIndex) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-sm font-semibold">
                          {dest.name}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Center Featured Image with info card */}
              {destinations.length > 0 && (
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-150 w-2/5 h-2/5">
                  {/* Featured Image with mask and animated border */}
                  <div
                    className="w-full h-full rounded-full overflow-hidden relative"
                    style={{
                      boxShadow:
                        "0 12px 30px rgba(0,0,0,0.6), 0 0 0 6px rgba(255,255,255,0.2)",
                    }}
                  >
                    {/* Animated border effect */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 0deg, transparent, #3B82F6, transparent, transparent)",
                        animation: "spin 4s linear infinite",
                        zIndex: -1,
                      }}
                    ></div>

                    <img
                      src={destinations[activeIndex]?.img}
                      alt={t.heroSection.featuredAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info panel for center image */}
                  <div
                    className={`absolute bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-lg shadow-lg ${isRTL ? "-left-10 -bottom-10" : "-right-10 -bottom-10"}`}
                  >
                    <div className="text-sm text-blue-300">
                      {t.heroSection.destinationCounter
                        .replace("{current}", activeIndex + 1)
                        .replace("{total}", destinations.length)}
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {destinations.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeIndex ? "w-8 bg-blue-500" : "bg-white/40"
                    }`}
                    onClick={() => handleSelectImage(index)}
                    aria-label={t.heroSection.controlsAria.replace(
                      "{index}",
                      index + 1
                    )}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated wave divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-auto text-white/10 fill-current"
        >
          <path d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 0.3;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
