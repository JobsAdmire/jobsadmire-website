import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { showSuccess, showError, showWarning } from "@/lib/utils/toast";
import {
  Phone,
  Mail,
  User,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Loader2,
  ChevronDown,
  Globe,
} from "lucide-react";

// Import translation files for all 7 languages
import enTranslations from "../../../public/locales/en/turkeyherosection.json";
import trTranslations from "../../../public/locales/tr/turkeyherosection.json";
import frTranslations from "../../../public/locales/fr/turkeyherosection.json";
import deTranslations from "../../../public/locales/de/turkeyherosection.json";
import arTranslations from "../../../public/locales/ar/turkeyherosection.json";
import ruTranslations from "../../../public/locales/ru/turkeyherosection.json";
import faTranslations from "../../../public/locales/fa/turkeyherosection.json";
import { createInquiry } from "@/utils/crmUtils";
import { COUNTRIES_LIST } from "@/lib/utils/countries";

const TurkeyHeroSection = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;

  // Translation function
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

  const translations = getTranslations();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    citizenship: "",
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  // Service options for the select dropdown
  const serviceOptions = [
    { value: "short-term", label: "Short Term Residence Permit" },
    { value: "long-term", label: "Long Term Residence Permit" },
    { value: "student", label: "Student Residence Permit" },
    { value: "work", label: "Work Residence Permit" },
    { value: "family", label: "Family Residence Permit" },
    { value: "humanitarian", label: "Humanitarian Residence Permit" },
  ];

  // Get countries list - fallback to comprehensive list if translation not available
  const getCountries = () => {
    return t?.countries || COUNTRIES_LIST;
  };

  // Convert countries array to options format for the select dropdown
  const countryOptions = getCountries().map((country) => ({
    value: country.toLowerCase().replace(/\s+/g, "-"),
    label: country,
  }));

  const benefits = [
    translations.benefits.expertGuidance,
    translations.benefits.legalCompliance,
    translations.benefits.fastTrackProcessing,
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % benefits.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [benefits.length]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (!formData.name) {
      showWarning(t("labels.residenceHero.nameRequired"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.email) {
      showWarning(t("labels.residenceHero.emailRequired"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.phone) {
      showWarning(t("labels.residenceHero.phoneRequired"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.serviceType) {
      showWarning("Service type is required");
      setIsSubmitting(false);
      return;
    }
    if (!formData.citizenship) {
      showWarning("Current citizenship is required");
      setIsSubmitting(false);
      return;
    }

    const selectedService = serviceOptions.find(
      (option) => option.value === formData.serviceType
    );
    const selectedCountry = countryOptions.find(
      (option) => option.value === formData.citizenship
    );

    const response = await createInquiry({
      name: formData.name,
      interested_service: `Turkey Residence Permit - ${selectedService?.label || formData.serviceType}`,
      mobile_no: formData.phone,
      email: formData.email,
      address: "",
      additional_details: `Service Type: ${selectedService?.label || formData.serviceType}, Current Citizenship: ${selectedCountry?.label || formData.citizenship}`,
    });

    if (response.status === 1) {
      setSubmitStatus("success");

      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "formSubmitted",
          formType: "Turkey Residence Permit",
        });
      }
      showSuccess("Thanks, We will contact you soon.");
      router.push("/thankyou");
    } else {
      setSubmitStatus("error");
      showError("Error: " + response.data.message);
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      citizenship: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div
      className={`bg-gradient-to-br pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] from-sky-50 via-blue-50 to-cyan-50 relative overflow-hidden ${locale === "ar" || locale === "fa" ? "rtl" : "ltr"}`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-cyan-200/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Turkish Landmarks SVG Background */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-10">
        <svg viewBox="0 0 1400 600" className="w-full h-full">
          <defs>
            <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <g transform="translate(300,200)">
            <rect
              x="0"
              y="150"
              width="200"
              height="120"
              fill="url(#buildingGrad)"
              rx="10"
            />
            <ellipse
              cx="100"
              cy="150"
              rx="120"
              ry="60"
              fill="#0ea5e9"
              opacity="0.2"
            />
            <circle cx="60" cy="120" r="30" fill="#0ea5e9" opacity="0.25" />
            <circle cx="140" cy="120" r="30" fill="#0ea5e9" opacity="0.25" />
            <rect
              x="220"
              y="50"
              width="12"
              height="200"
              fill="#0ea5e9"
              opacity="0.3"
              rx="6"
            />
            <rect
              x="240"
              y="70"
              width="10"
              height="180"
              fill="#0ea5e9"
              opacity="0.3"
              rx="5"
            />
            <circle cx="226" cy="45" r="12" fill="#0ea5e9" opacity="0.3" />
          </g>

          <g transform="translate(700,100)">
            <rect
              x="0"
              y="0"
              width="30"
              height="350"
              fill="url(#buildingGrad)"
              rx="15"
            />
            <circle cx="15" cy="350" r="40" fill="#0ea5e9" opacity="0.15" />
            <rect
              x="10"
              y="50"
              width="3"
              height="30"
              fill="#0ea5e9"
              opacity="0.4"
            />
            <rect
              x="17"
              y="50"
              width="3"
              height="30"
              fill="#0ea5e9"
              opacity="0.4"
            />
          </g>

          <g transform="translate(900,300)">
            <rect
              x="0"
              y="50"
              width="400"
              height="8"
              fill="#0ea5e9"
              opacity="0.2"
              rx="4"
            />
            <rect
              x="0"
              y="0"
              width="12"
              height="58"
              fill="#0ea5e9"
              opacity="0.3"
              rx="6"
            />
            <rect
              x="388"
              y="0"
              width="12"
              height="58"
              fill="#0ea5e9"
              opacity="0.3"
              rx="6"
            />
          </g>
        </svg>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left Content - Hero Text */}
            <div
              className={`space-y-6 sm:space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-sky-900 leading-tight">
                  {translations.header.title.line1}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                    {translations.header.title.line2}
                  </span>
                  <span className="block text-sky-800">
                    {translations.header.title.line3}
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-sky-600 max-w-lg leading-relaxed">
                  {translations.header.subtitle}
                </p>
              </div>

              <div className="h-12 overflow-hidden">
                <div
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(-${currentSlide * 48}px)` }}
                >
                  {benefits.map((benefit, index) => (
                    <div key={index} className="h-12 flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                      <span className="text-lg text-sky-700 font-medium">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button className="flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white text-sm sm:text-base font-bold rounded-2xl hover:from-sky-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                  {translations.buttons.getPermit}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </button>
                <button className="flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-sky-600 text-sky-600 text-sm sm:text-base font-bold rounded-2xl hover:bg-sky-50 transition-all duration-300">
                  {translations.buttons.learnMore}
                </button>
              </div>
            </div>

            {/* Right Content - Contact Form */}
            <div
              className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/50 relative z-10">
                  {/* Success/Error Messages */}
                  {submitStatus === "success" && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center text-green-800">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">
                          {translations.alerts.successMessage}
                        </span>
                      </div>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center text-red-800">
                        <span className="font-medium">
                          {translations.alerts.errorMessage}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Form Header */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-sky-900 mb-2">
                      {translations.form.title}
                    </h3>
                    <p className="text-sky-600 text-sm sm:text-base">
                      {translations.form.subtitle}
                    </p>
                  </div>

                  {/* Form */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                      <input
                        type="text"
                        name="name"
                        placeholder={translations.form.placeholders.fullName}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                      />
                    </div>

                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder={translations.form.placeholders.phoneNumber}
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                      />
                    </div>

                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        placeholder={translations.form.placeholders.emailAddress}
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                      />
                    </div>

                    {/* Current Citizenship Select Field */}
                    <div className="relative group">
                      <Globe className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-sky-600 transition-colors z-10" />
                      <select
                        name="citizenship"
                        value={formData.citizenship}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full pl-10 sm:pl-12 pr-8 sm:pr-12 py-2.5 sm:py-3 md:py-4 bg-sky-50/50 border-2 border-sky-100 rounded-xl text-sm sm:text-base focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 disabled:opacity-50 appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-sky-400">
                          Select Current Citizenship
                        </option>
                        {countryOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className="text-sky-800"
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                    </div>

                    {/* Service Type Select Field */}
                    <div className="relative group">
                      <Shield className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-sky-600 transition-colors z-10" />
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full pl-10 sm:pl-12 pr-8 sm:pr-12 py-2.5 sm:py-3 md:py-4 bg-sky-50/50 border-2 border-sky-100 rounded-xl text-sm sm:text-base focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 disabled:opacity-50 appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-sky-400">
                          Select Service Type
                        </option>
                        {serviceOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className="text-sky-800"
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-xl hover:from-sky-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                          {translations.form.sendingText}
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          {translations.form.submitButton}
                        </>
                      )}
                    </button>

                    <p className="text-xs text-sky-500 text-center">
                      {translations.form.termsText}
                    </p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-20 h-20 bg-sky-200/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Achievement Badge */}
      <div className="fixed bottom-8 left-8 z-30 hidden lg:block">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/50">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-sky-900">
                {translations.badge.verifiedService}
              </div>
              <div className="text-xs text-sky-600">
                {translations.badge.trustedClients}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurkeyHeroSection;
