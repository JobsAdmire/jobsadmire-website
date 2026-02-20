import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

// Import translation files for all 7 languages
import enTranslations from "../../../public/locales/en/service.json";
import trTranslations from "../../../public/locales/tr/service.json";
import frTranslations from "../../../public/locales/fr/service.json";
import deTranslations from "../../../public/locales/de/service.json";
import arTranslations from "../../../public/locales/ar/service.json";
import ruTranslations from "../../../public/locales/ru/service.json";
import faTranslations from "../../../public/locales/fa/service.json";

const ServicesPage = () => {
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "fr":
        return frTranslations;
      case "de":
        return deTranslations;
      case "ar":
        return arTranslations;
      case "ru":
        return ruTranslations;
      case "fa":
        return faTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  // Get translated services using the translations
  const translatedServices = getTranslatedServices(t);

  const [selectedCard, setSelectedCard] = useState(null);
  const [viewType, setViewType] = useState("grid"); // 'grid', 'masonry', 'carousel'
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesPerView = 3;
  const [isHovering, setIsHovering] = useState(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  // Page fade-in animation
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8 } },
  };

  // Card animation variants
  const cardVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0px 20px 40px rgba(0, 70, 160, 0.18)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const openDetails = (id, e) => {
    // Stop propagation to prevent card click from triggering
    e.stopPropagation();
    setSelectedCard(id);
    setShowModal(true);
  };

  // Carousel navigation
  const navigateCarousel = (direction) => {
    if (
      direction === "next" &&
      currentSlide < Math.ceil(translatedServices.length / slidesPerView) - 1
    ) {
      setCurrentSlide(currentSlide + 1);
    } else if (direction === "prev" && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Set carousel position based on current slide
  useEffect(() => {
    if (carouselRef.current && viewType === "carousel") {
      const slideWidth = 340; // card width + margin
      carouselRef.current.scrollTo({
        left: currentSlide * slideWidth * slidesPerView,
        behavior: "smooth",
      });
    }
  }, [currentSlide, viewType]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="relative min-h-screen pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute bg-purple-200 rounded-full -top-20 -left-20 w-96 h-96 opacity-20 blur-3xl"></div>
        <div className="absolute bg-blue-200 rounded-full top-1/4 -right-20 w-80 h-80 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 bg-indigo-200 rounded-full left-1/4 w-96 h-96 opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="mb-6 text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-sky-500 to-sky-500">
              {t.header.title}
            </h2>
            <p className="max-w-2xl mx-auto mb-16 text-lg font-light text-sky-500">
              {t.header.subtitle}
            </p>
          </motion.div>

          {/* View selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white shadow-xl rounded-full p-1.5 inline-flex backdrop-blur-md bg-opacity-80 border border-indigo-50">
              <button
                onClick={() => setViewType("grid")}
                className={`px-7 py-3 rounded-full text-sm font-medium transition-all duration-400 ${
                  viewType === "grid"
                    ? "bg-gradient-to-r from-sky-500 to-sky-500 text-white shadow-lg shadow-indigo-200"
                    : "text-sky-500 hover:bg-indigo-50"
                }`}
              >
                {t.viewSelector.grid}
              </button>
              <button
                onClick={() => setViewType("masonry")}
                className={`px-7 py-3 rounded-full text-sm font-medium transition-all duration-400 ${
                  viewType === "masonry"
                    ? "bg-gradient-to-r from-sky-500 to-sky-500 text-white shadow-lg shadow-indigo-200"
                    : "text-indigo-700 hover:bg-indigo-50"
                }`}
              >
                {t.viewSelector.masonry}
              </button>
              <button
                onClick={() => setViewType("carousel")}
                className={`px-7 py-3 rounded-full text-sm font-medium transition-all duration-400 ${
                  viewType === "carousel"
                    ? "bg-gradient-to-r from-sky-500 to-sky-500 text-white shadow-lg shadow-indigo-200"
                    : "text-sky-500 hover:bg-indigo-50"
                }`}
              >
                {t.viewSelector.carousel}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Grid View */}
        {viewType === "grid" && (
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {translatedServices.map((service, index) => (
              <motion.div
                key={service.id}
                custom={index}
                variants={cardVariants}
                whileHover="hover"
                className="h-full"
                onMouseEnter={() => setIsHovering(service.id)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div
                  className="relative h-full overflow-hidden transition-all duration-300 bg-white border border-transparent rounded-2xl group hover:border-indigo-100 backdrop-blur-sm bg-opacity-80"
                  style={{
                    boxShadow:
                      isHovering === service.id
                        ? "0px 20px 40px rgba(0, 70, 160, 0.18)"
                        : "0px 10px 30px rgba(0, 70, 160, 0.08)",
                  }}
                >
                  {/* Top gradient accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 to-sky-500 transform origin-left transition-all duration-500 ease-out"
                    style={{
                      transform:
                        isHovering === service.id ? "scaleX(1)" : "scaleX(0.3)",
                    }}
                  ></div>

                  <div className="p-8">
                    {/* Service Icon and Title */}
                    <div className="flex items-center mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.bgGradient} flex items-center justify-center text-2xl shadow-lg mr-5 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden`}
                        style={{
                          boxShadow:
                            isHovering === service.id
                              ? "0 10px 25px -5px rgba(66, 99, 235, 0.4)"
                              : "0 10px 15px -5px rgba(66, 99, 235, 0.2)",
                        }}
                      >
                        <div className="absolute inset-0 transition-opacity bg-white opacity-20 group-hover:opacity-30"></div>
                        <span className="relative z-10 text-3xl text-white">
                          {service.icon}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-500">
                        {service.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="font-light leading-relaxed text-sky-500 mb-7">
                      {service.description}
                    </p>

                    {/* Technology tags - limited to 3 */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {service.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs py-1.5 px-3 bg-indigo-50 rounded-full text-sky-500 font-medium border border-indigo-100 border-opacity-40 shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                      {service.technologies.length > 3 && (
                        <span className="text-xs py-1.5 px-3 bg-indigo-50 rounded-full text-sky-500 font-medium border border-indigo-100 border-opacity-40 shadow-sm">
                          +{service.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Footer with buttons */}
                    <div className="flex items-center justify-between mt-6">
                      <Link
                        href={service.pageUrl}
                        className="relative text-sm font-medium text-sky-500 transition-colors hover:text-sky-500 group/link"
                      >
                        {t.card.viewPage}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 group-hover/link:w-full transition-all duration-300"></span>
                      </Link>
                      <button
                        onClick={(e) => openDetails(service.id, e)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium relative overflow-hidden transition-all duration-300 group/btn`}
                      >
                        <span
                          className={`absolute inset-0 bg-gradient-to-r ${service.bgGradient} transition-all duration-300 group-hover/btn:opacity-90`}
                        ></span>
                        <span className="absolute inset-0 transition-opacity duration-300 bg-white opacity-0 group-hover/btn:opacity-20"></span>
                        <span className="relative z-10 text-white">
                          {t.card.viewDetails}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Masonry View */}
        {viewType === "masonry" && (
          <div className="gap-8 space-y-8 columns-1 md:columns-2 lg:columns-3">
            {translatedServices.map((service, index) => (
              <motion.div
                key={service.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={cardVariants}
                className="mb-8 break-inside-avoid-column"
                onMouseEnter={() => setIsHovering(service.id)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div
                  className="relative overflow-hidden bg-white border border-transparent rounded-2xl group hover:border-indigo-100 backdrop-blur-sm bg-opacity-80"
                  style={{
                    boxShadow:
                      isHovering === service.id
                        ? "0px 20px 40px rgba(0, 70, 160, 0.18)"
                        : "0px 10px 30px rgba(0, 70, 160, 0.08)",
                  }}
                >
                  {/* Top gradient accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 to-sky-500 transform origin-left transition-all duration-500 ease-out"
                    style={{
                      transform:
                        isHovering === service.id ? "scaleX(1)" : "scaleX(0.3)",
                    }}
                  ></div>

                  <div className="p-8">
                    {/* Header with icon */}
                    <div className="flex items-start mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.bgGradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-500 relative overflow-hidden`}
                        style={{
                          boxShadow:
                            isHovering === service.id
                              ? "0 10px 25px -5px rgba(66, 99, 235, 0.4)"
                              : "0 10px 15px -5px rgba(66, 99, 235, 0.2)",
                        }}
                      >
                        <div className="absolute inset-0 transition-opacity bg-white opacity-20 group-hover:opacity-30"></div>
                        <span className="relative z-10 text-3xl text-white">
                          {service.icon}
                        </span>
                      </div>

                      <h3 className="ml-5 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-800">
                        {service.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="mb-6 font-light leading-relaxed text-sky-500">
                      {service.description}
                    </p>

                    {/* Technology tags - limited to 4 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs py-1.5 px-3 bg-indigo-50 rounded-full text-sky-500 font-medium border border-indigo-100 border-opacity-40 shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                      {service.technologies.length > 3 && (
                        <span className="text-xs py-1.5 px-3 bg-indigo-50 rounded-full text-sky-500 font-medium border border-indigo-100 border-opacity-40 shadow-sm">
                          +{service.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Footer with buttons */}
                    <div className="flex items-center justify-between pt-2 mt-6">
                      <Link
                        href={service.pageUrl}
                        className="relative text-sm font-medium text-sky-500 transition-colors hover:text-sky-500 group/link"
                      >
                        {t.card.viewPage}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 group-hover/link:w-full transition-all duration-300"></span>
                      </Link>
                      <button
                        onClick={(e) => openDetails(service.id, e)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium relative overflow-hidden transition-all duration-300 group/btn`}
                      >
                        <span
                          className={`absolute inset-0 bg-gradient-to-r ${service.bgGradient} transition-all duration-300 group-hover/btn:opacity-90`}
                        ></span>
                        <span className="absolute inset-0 transition-opacity duration-300 bg-white opacity-0 group-hover/btn:opacity-20"></span>
                        <span className="relative z-10 text-white">
                          {t.card.viewDetails}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Carousel View */}
        {viewType === "carousel" && (
          <div className="relative max-w-full mx-auto">
            <div
              ref={carouselRef}
              className="pb-20 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex px-4 py-8 space-x-8 w-max">
                {translatedServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    custom={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex-shrink-0 w-80"
                    onMouseEnter={() => setIsHovering(service.id)}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    <div
                      className="relative h-full overflow-hidden bg-white border border-transparent rounded-2xl hover:border-indigo-100 group backdrop-blur-sm bg-opacity-80"
                      style={{
                        boxShadow:
                          isHovering === service.id
                            ? "0px 20px 40px rgba(0, 70, 160, 0.18)"
                            : "0px 10px 30px rgba(0, 70, 160, 0.08)",
                      }}
                    >
                      {/* Top gradient accent */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 to-sky-500 transform origin-left transition-all duration-500 ease-out"
                        style={{
                          transform:
                            isHovering === service.id
                              ? "scaleX(1)"
                              : "scaleX(0.3)",
                        }}
                      ></div>

                      <div className="p-8">
                        {/* Service icon and title */}
                        <div className="flex items-center mb-6">
                          <div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.bgGradient} flex items-center justify-center text-2xl shadow-lg mr-5 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden`}
                            style={{
                              boxShadow:
                                isHovering === service.id
                                  ? "0 10px 25px -5px rgba(66, 99, 235, 0.4)"
                                  : "0 10px 15px -5px rgba(66, 99, 235, 0.2)",
                            }}
                          >
                            <div className="absolute inset-0 transition-opacity bg-white opacity-20 group-hover:opacity-30"></div>
                            <span className="relative z-10 text-3xl text-white">
                              {service.icon}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-500">
                            {service.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="mb-8 font-light leading-relaxed text-sky-500">
                          {service.description}
                        </p>

                        {/* Footer with buttons */}
                        <div className="flex items-center justify-between mt-6">
                          <Link
                            href={service.pageUrl}
                            className="relative text-sm font-medium text-sky-500 transition-colors hover:text-sky-500 group/link"
                          >
                            {t.card.viewPage}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 group-hover/link:w-full transition-all duration-300"></span>
                          </Link>
                          <button
                            onClick={(e) => openDetails(service.id, e)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium relative overflow-hidden transition-all duration-300 group/btn`}
                          >
                            <span
                              className={`absolute inset-0 bg-gradient-to-r ${service.bgGradient} transition-all duration-300 group-hover/btn:opacity-90`}
                            ></span>
                            <span className="absolute inset-0 transition-opacity duration-300 bg-white opacity-0 group-hover/btn:opacity-20"></span>
                            <span className="relative z-10 text-white">
                              {t.card.viewDetails}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Carousel navigation controls */}
            <div className="absolute left-0 right-0 flex items-center justify-between px-4 bottom-2">
              <button
                onClick={() => navigateCarousel("prev")}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                  currentSlide === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-sky-500 hover:bg-indigo-50"
                } transition-all duration-300 focus:outline-none border border-indigo-50`}
                disabled={currentSlide === 0}
                aria-label={t.carousel.previousSlide}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              {/* Carousel navigation dots */}
              <div className="flex justify-center space-x-2">
                {[
                  ...Array(
                    Math.ceil(translatedServices.length / slidesPerView)
                  ),
                ].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`transition-all duration-300 ${
                      i === currentSlide
                        ? "w-8 h-3 bg-gradient-to-r from-sky-500 to-sky-500 rounded-full shadow-md"
                        : "w-3 h-3 bg-indigo-200 hover:bg-indigo-300 rounded-full"
                    }`}
                    aria-label={`${t.carousel.goToSlide} ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => navigateCarousel("next")}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                  currentSlide >=
                  Math.ceil(translatedServices.length / slidesPerView) - 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-sky-500 hover:bg-indigo-50"
                } transition-all duration-300 focus:outline-none border border-indigo-50`}
                disabled={
                  currentSlide >=
                  Math.ceil(translatedServices.length / slidesPerView) - 1
                }
                aria-label={t.carousel.nextSlide}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Modal for service details */}
        <AnimatePresence>
          {showModal && selectedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-60 backdrop-blur-md"
            >
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                {translatedServices
                  .filter((s) => s.id === selectedCard)
                  .map((service) => (
                    <div key={service.id}>
                      {/* Modal Header */}
                      <div className="relative">
                        <div
                          className={`w-full bg-gradient-to-r ${service.bgGradient} p-10 flex justify-between items-center relative overflow-hidden`}
                        >
                          {/* Background pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute w-40 h-40 bg-white rounded-full -left-10 -top-10 opacity-20"></div>
                            <div className="absolute w-24 h-24 bg-white rounded-full right-10 top-20 opacity-20"></div>
                            <div className="absolute w-32 h-32 bg-white rounded-full left-1/2 -bottom-10 opacity-20"></div>
                          </div>

                          <div className="relative z-10 flex items-center">
                            <div className="flex items-center justify-center mr-6 text-3xl text-white bg-white border border-white shadow-xl w-18 h-18 bg-opacity-20 rounded-2xl backdrop-blur-sm border-opacity-20">
                              {service.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-white">
                              {service.title}
                            </h3>
                          </div>
                          <button
                            onClick={() => setShowModal(false)}
                            className="relative z-10 p-2 text-white transition-colors bg-white rounded-full hover:text-gray-200 bg-opacity-10 backdrop-blur-sm"
                            aria-label={t.modal.close}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Modal Content */}
                      <div className="p-10">
                        {/* Main description */}
                        <div className="mb-10">
                          <h4 className="mb-4 text-xl font-semibold text-sky-500">
                            {t.modal.overview}
                          </h4>
                          <p className="font-light leading-relaxed text-sky-500">
                            {service.longDesc}
                          </p>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                          <div className="p-5 text-center bg-indigo-50 rounded-xl">
                            <div className="mb-1 text-2xl font-bold text-sky-500">
                              {service.stats.completed}
                            </div>
                            <div className="text-sm text-indigo-500">
                              {t.modal.stats.projects}
                            </div>
                          </div>
                          <div className="p-5 text-center bg-indigo-50 rounded-xl">
                            <div className="mb-1 text-2xl font-bold text-sky-500">
                              {service.stats.satisfaction}
                            </div>
                            <div className="text-sm text-indigo-500">
                              {t.modal.stats.satisfaction}
                            </div>
                          </div>
                          <div className="p-5 text-center bg-indigo-50 rounded-xl">
                            <div className="mb-1 text-2xl font-bold text-sky-500">
                              {service.stats.support}
                            </div>
                            <div className="text-sm text-sky-500">
                              {t.modal.stats.support}
                            </div>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mb-8">
                          <h4 className="mb-4 text-xl font-semibold text-sky-500">
                            {t.modal.keyFeatures}
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {service.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center p-4 transition-colors bg-indigo-50 rounded-xl hover:bg-indigo-100"
                              >
                                <span
                                  className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r ${service.bgGradient} flex items-center justify-center text-white mr-3 shadow-sm`}
                                >
                                  ✓
                                </span>
                                <span className="font-medium text-sky-500">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technologies */}
                        <div className="mb-10">
                          <h4 className="mb-4 text-xl font-semibold text-sky-500">
                            {t.modal.technologies}
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {service.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 font-medium text-sky-500 transition-colors rounded-lg bg-indigo-50 hover:bg-indigo-100"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Call to action */}
                        <div className="flex justify-between">
                          <button
                            onClick={() => setShowModal(false)}
                            className="px-6 py-3 font-medium text-sky-500 transition-all duration-300 border border-indigo-200 rounded-lg hover:bg-indigo-50"
                          >
                            {t.modal.close}
                          </button>
                          <Link
                            href={`${service.pageUrl}`}
                            className={`px-6 py-3 rounded-lg font-medium bg-gradient-to-r ${service.bgGradient} text-white shadow-md hover:shadow-lg transition-shadow duration-300`}
                          >
                            {t.modal.visitServicePage}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Get translated services data
const getTranslatedServices = (t) => [
  {
    id: 1,
    title: t.services.resumeService.title,
    description: t.services.resumeService.description,
    longDesc: t.services.resumeService.longDesc,
    icon: "📄",
    bgGradient: "from-sky-500 sky-500",
    pageUrl: "/services/resume-service",
    features: t.services.resumeService.features,
    technologies: t.services.resumeService.technologies,
    stats: {
      completed: "250+",
      satisfaction: "98%",
      support: "24/7",
    },
  },
  {
    id: 2,
    title: t.services.globalJobPlacement.title,
    description: t.services.globalJobPlacement.description,
    longDesc: t.services.globalJobPlacement.longDesc,
    icon: "🌎",
    bgGradient: "from-sky-500 to-sky-500",
    pageUrl: "/services/global-job-placement",
    features: t.services.globalJobPlacement.features,
    technologies: t.services.globalJobPlacement.technologies,
    stats: {
      completed: "180+",
      satisfaction: "97%",
      support: "24/7",
    },
  },
  {
    id: 3,
    title: t.services.interviewCoaching.title,
    description: t.services.interviewCoaching.description,
    longDesc: t.services.interviewCoaching.longDesc,
    icon: "🎯",
    bgGradient: "from-sky-500 to-sky-500",
    pageUrl: "/services/interview-coaching-service",
    features: t.services.interviewCoaching.features,
    technologies: t.services.interviewCoaching.technologies,
    stats: {
      completed: "320+",
      satisfaction: "99%",
      support: "24/7",
    },
  },
  {
    id: 4,
    title: t.services.careerCounselling.title,
    description: t.services.careerCounselling.description,
    longDesc: t.services.careerCounselling.longDesc,
    icon: "🧭",
    bgGradient: "from-sky-500 to-sky-500",
    pageUrl: "/services/career-counselling",
    features: t.services.careerCounselling.features,
    technologies: t.services.careerCounselling.technologies,
    stats: {
      completed: "150+",
      satisfaction: "96%",
      support: "24/7",
    },
  },
  {
    id: 5,
    title: t.services.visaRelocation.title,
    description: t.services.visaRelocation.description,
    longDesc: t.services.visaRelocation.longDesc,
    icon: "✈️",
    bgGradient: "from-sky-500 to-sky-500",
    pageUrl: "/services/visa",
    features: t.services.visaRelocation.features,
    technologies: t.services.visaRelocation.technologies,
    stats: {
      completed: "200+",
      satisfaction: "98%",
      support: "24/7",
    },
  },
  {
    id: 6,
    title: t.services.skillDevelopment.title,
    description: t.services.skillDevelopment.description,
    longDesc: t.services.skillDevelopment.longDesc,
    icon: "🧠",
    bgGradient: "from-sky-500 to-sky-500",
    pageUrl: "/services/skill-development-training",
    features: t.services.skillDevelopment.features,
    technologies: t.services.skillDevelopment.technologies,
    stats: {
      completed: "120+",
      satisfaction: "97%",
      support: "24/7",
    },
  },
  {
    id: 7,
    title: t.services.remoteWorkOpportunities.title,
    description: t.services.remoteWorkOpportunities.description,
    longDesc: t.services.remoteWorkOpportunities.longDesc,
    icon: "🏠",
    bgGradient: "from-sky-500 to-sky-500",
    pageUrl: "/services/remote-work-opportunity",
    features: t.services.remoteWorkOpportunities.features,
    technologies: t.services.remoteWorkOpportunities.technologies,
    stats: {
      completed: "180+",
      satisfaction: "97%",
      support: "24/7",
    },
  },
  {
    id: 8,
    title: t.services.talentAcquisition.title,
    description: t.services.talentAcquisition.description,
    longDesc: t.services.talentAcquisition.longDesc,
    icon: "👥",
    bgGradient: "from-sky-500 to-sky-500",
    pageUrl: "/services/talent-acquisition-process",
    features: t.services.talentAcquisition.features,
    technologies: t.services.talentAcquisition.technologies,
    stats: {
      completed: "220+",
      satisfaction: "98%",
      support: "24/7",
    },
  },
  {
    id: 9,
    title: t.services.immigration.title,
    description: t.services.immigration.description,
    longDesc: t.services.immigration.longDesc,
    icon: "🛂",
    bgGradient: "from-sky-500 to-sky-500",
    pageUrl: "/services/immigration",
    features: t.services.immigration.features,
    technologies: t.services.immigration.technologies,
    stats: {
      completed: "275+",
      satisfaction: "99%",
      support: "24/7",
    },
  },
  {
    id: 10,
    title: t.services.jobRecruitment.title,
    description: t.services.jobRecruitment.description,
    longDesc: t.services.jobRecruitment.longDesc,
    icon: "🔍",
    bgGradient: "from-sky-500 to-sky-500",
    pageUrl: "/job-recruitment",
    features: t.services.jobRecruitment.features,
    technologies: t.services.jobRecruitment.technologies,
    stats: {
      completed: "350+",
      satisfaction: "98%",
      support: "24/7",
    },
  },
];

export default ServicesPage;
