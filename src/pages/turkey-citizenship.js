import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { showSuccess, showError, showWarning } from "@/lib/utils/toast";
import {
  CheckCircle,
  ChevronDown,
  Users,
  Globe,
  FileText,
  Award,
  Shield,
  Clock,
  Star,
  TrendingUp,
  ArrowRight,
  MapPin,
  Calendar,
  Briefcase,
  Heart,
  Phone,
  Mail,
  User,
} from "lucide-react";

// Import translation files for all 7 languages
import enTranslations from "../../public/locales/en/citizenship.json";
import trTranslations from "../../public/locales/tr/citizenship.json";
import frTranslations from "../../public/locales/fr/citizenship.json";
import deTranslations from "../../public/locales/de/citizenship.json";
import arTranslations from "../../public/locales/ar/citizenship.json";
import ruTranslations from "../../public/locales/ru/citizenship.json";
import faTranslations from "../../public/locales/fa/citizenship.json";
import { createInquiry } from "@/utils/crmUtils";
import { COUNTRIES_LIST } from "@/lib/utils/countries";

export default function TurkishCitizenshipPage() {
  const router = useRouter();
  const { locale } = router;
  const { t: tCommon } = useTranslation("common");
  const [isVisible, setIsVisible] = useState(false);
  // Translation system
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
  useEffect(() => {
    setIsVisible(true);
  }, []);
  // Get countries list - fallback to comprehensive list if translation not available
  const getCountries = () => {
    return t?.countries || COUNTRIES_LIST;
  };
  const t = getTranslations();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    citizenshipType: "",
    currentCitizenship: "", // ADD THIS LINE
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    if (!formData.name) {
      showWarning(t.alerts.nameRequired);
      setLoading(false);
      return;
    }
    if (!formData.email) {
      showWarning(t.alerts.emailRequired);
      setLoading(false);
      return;
    }
    if (!formData.phone) {
      showWarning(t.alerts.phoneRequired);
      setLoading(false);
      return;
    }

    const response = await createInquiry({
      name: formData.name,
      interested_service: "Turkish Citizenship",
      mobile_no: formData.phone,
      email: formData.email,
      address: "",
      additional_details: `${formData.citizenshipType ? "Citizenship Type: " + formData.citizenshipType : ""}${formData.currentCitizenship ? ", Current Citizenship: " + formData.currentCitizenship : ""}${formData.message ? ", Message: " + formData.message : ""}`,
    });

    if (response.status === 1) {
      showSuccess(t.alerts.thankYouMessage);
      router.push("/thankyou");
    } else {
      showError("Error: " + response.data.message);
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      citizenshipType: "",
      currentCitizenship: "", // ADD THIS LINE
      message: "",
    });
    setLoading(false);
  };

  const citizenshipTypes = [
    {
      title: t.citizenshipTypes.investment.title,
      description: t.citizenshipTypes.investment.description,
      requirements: t.citizenshipTypes.investment.requirements,
      timeframe: t.citizenshipTypes.investment.timeframe,
      icon: <Award className="w-6 h-6 text-white" />,
      popular: true,
    },
    {
      title: t.citizenshipTypes.birth.title,
      description: t.citizenshipTypes.birth.description,
      requirements: t.citizenshipTypes.birth.requirements,
      timeframe: t.citizenshipTypes.birth.timeframe,
      icon: <Users className="w-6 h-6 text-white" />,
    },
    {
      title: t.citizenshipTypes.marriage.title,
      description: t.citizenshipTypes.marriage.description,
      requirements: t.citizenshipTypes.marriage.requirements,
      timeframe: t.citizenshipTypes.marriage.timeframe,
      icon: <Heart className="w-6 h-6 text-white" />,
    },
    {
      title: t.citizenshipTypes.naturalization.title,
      description: t.citizenshipTypes.naturalization.description,
      requirements: t.citizenshipTypes.naturalization.requirements,
      timeframe: t.citizenshipTypes.naturalization.timeframe,
      icon: <MapPin className="w-6 h-6 text-white" />,
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: t.processSteps.consultation.title,
      description: t.processSteps.consultation.description,
      icon: <User className="w-6 h-6" />,
      detail: t.processSteps.consultation.detail,
    },
    {
      step: "02",
      title: t.processSteps.documentation.title,
      description: t.processSteps.documentation.description,
      icon: <FileText className="w-6 h-6" />,
      detail: t.processSteps.documentation.detail,
    },
    {
      step: "03",
      title: t.processSteps.filing.title,
      description: t.processSteps.filing.description,
      icon: <Globe className="w-6 h-6" />,
      detail: t.processSteps.filing.detail,
    },
    {
      step: "04",
      title: t.processSteps.review.title,
      description: t.processSteps.review.description,
      icon: <Shield className="w-6 h-6" />,
      detail: t.processSteps.review.detail,
    },
    {
      step: "05",
      title: t.processSteps.approval.title,
      description: t.processSteps.approval.description,
      icon: <Award className="w-6 h-6" />,
      detail: t.processSteps.approval.detail,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className={`bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 relative overflow-hidden pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] ${locale === "ar" || locale === "fa" ? "rtl" : "ltr"}`}
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
              <linearGradient
                id="buildingGrad"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
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

        <div className="relative z-10 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Content */}
              <div
                className={`space-y-6 sm:space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              >
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-sky-900 leading-tight">
                    {t.header.title.line1}
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 mt-2">
                      {t.header.title.line2}
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-sky-600 max-w-lg leading-relaxed">
                    {t.header.subtitle}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white text-sm sm:text-base font-bold rounded-2xl hover:from-sky-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                    {t.header.buttons.startJourney}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </button>
                  <button className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-sky-600 text-sky-600 text-sm sm:text-base font-bold rounded-2xl hover:bg-sky-50 transition-all duration-300">
                    {t.header.buttons.scheduleConsultation}
                  </button>
                </div>
              </div>

              {/* Right Form */}
              <div
                className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              >
                <div className="relative">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/50 relative z-10">
                    {/* Form Header */}
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-sky-900 mb-2">
                        {t.form.title}
                      </h3>
                    </div>

                    {/* Form */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="relative group">
                        <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-sky-600 transition-colors" />
                        <input
                          type="text"
                          name="name"
                          placeholder={t.form.fields.name.placeholder}
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-sky-50/50 border-2 border-sky-100 rounded-xl text-sm sm:text-base focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400"
                        />
                      </div>

                      <div className="relative group">
                        <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-sky-600 transition-colors" />
                        <input
                          type="email"
                          name="email"
                          placeholder={t.form.fields.email.placeholder}
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-sky-50/50 border-2 border-sky-100 rounded-xl text-sm sm:text-base focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                          <input
                            type="tel"
                            name="phone"
                            placeholder={t.form.fields.phone.placeholder}
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400"
                          />
                        </div>

                        <div className="relative group">
                          <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors z-10" />
                          <select
                            name="currentCitizenship"
                            value={formData.currentCitizenship}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-12 py-4 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="text-sky-400">
                              {tCommon("labels.turkeyCitizenship.currentCitizenship")}
                            </option>
                            {getCountries().map((country) => (
                              <option
                                key={country}
                                value={country}
                                className="text-sky-800"
                              >
                                {country}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 pointer-events-none" />
                        </div>
                      </div>

                      <div className="relative group">
                        <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors z-10" />
                        <select
                          name="citizenshipType"
                          value={formData.citizenshipType}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-12 py-4 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 appearance-none cursor-pointer"
                        >
                          <option value="" disabled className="text-sky-400">
                            {t.form.fields.pathway.placeholder}
                          </option>
                          <option value="investment" className="text-sky-800">
                            {t.form.fields.pathway.options.investment}
                          </option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 pointer-events-none" />
                      </div>

                      <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-sky-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <Clock className="w-5 h-5" />
                        {t.form.submitButton}
                      </button>

                      <div className="text-center">
                        <p className="text-xs text-sky-500 text-center">
                          {t.form.disclaimer}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating decorative blurs */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-sky-200/30 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6">
        {/* Citizenship Pathways */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
                {t.sections.pathways.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.sections.pathways.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {citizenshipTypes.map((type, index) => (
              <div
                key={index}
                className="relative bg-white border border-sky-200 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                {type.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {t.sections.pathways.popularBadge}
                    </span>
                  </div>
                )}

                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500 rounded-lg flex items-center justify-center mr-4">
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {type.title}
                    </h3>
                    <span className="text-sky-600 font-medium">
                      {type.timeframe}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{type.description}</p>

                <div className="space-y-3 mb-6">
                  {type.requirements.map((req, reqIndex) => (
                    <div key={reqIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 p-8 bg-sky-50 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
                {t.sections.benefits.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              {t.sections.benefits.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.sections.benefits.items.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <CheckCircle className="w-8 h-8 text-sky-500 mx-auto mb-4" />
                <p className="text-gray-800 font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
                {t.sections.process.title}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.sections.process.subtitle}
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500 hidden lg:block"></div>

            <div className="space-y-12">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                    {/* Step Circle */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        {step.step}
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-white border border-sky-100 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                        {/* Icon and Title */}
                        <div className="lg:col-span-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600">
                              {step.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {step.title}
                              </h3>
                              <div className="w-12 h-1 bg-sky-500 rounded-full mt-2"></div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="lg:col-span-2">
                          <p className="text-gray-600 mb-3 font-medium">
                            {step.description}
                          </p>
                          <p className="text-gray-500 text-sm leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      </div>

                      {/* Progress Indicator */}
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex space-x-2">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i <= index ? "bg-sky-500" : "bg-gray-200"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <span className="text-sm text-sky-600 font-medium">
                          {t.sections.process.stepIndicator
                            .replace("{current}", index + 1)
                            .replace("{total}", 5)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow for mobile */}
                  {index < processSteps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-6">
                      <ArrowRight className="w-6 h-6 text-sky-400 transform rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
      </div>
    </div>
  );
}

export const getStaticProps = async ({ locale }) => {
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
