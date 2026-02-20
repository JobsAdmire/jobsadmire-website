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
} from "lucide-react";

// Import translation files for all 7 languages
import enTranslations from "../../../public/locales/en/albania3.json";
import trTranslations from "../../../public/locales/tr/albania3.json";
import frTranslations from "../../../public/locales/fr/albania3.json";
import deTranslations from "../../../public/locales/de/albania3.json";
import arTranslations from "../../../public/locales/ar/albania3.json";
import ruTranslations from "../../../public/locales/ru/albania3.json";
import faTranslations from "../../../public/locales/fa/albania3.json";
import { createInquiry } from "@/utils/crmUtils";

// Translation function
const getTranslations = (locale) => {
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

const AlbaniaHeroSection = () => {
  const router = useRouter();
  const { locale } = router;
  const { t: tCommon } = useTranslation("common");
  const t = getTranslations(locale);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const benefits = [
    t.benefits.expertGuidance,
    t.benefits.legalCompliance,
    t.benefits.fastTrackProcessing,
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
      showWarning(tCommon("labels.residenceHero.nameRequired"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.email) {
      showWarning(tCommon("labels.residenceHero.emailRequired"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.phone) {
      showWarning(tCommon("labels.residenceHero.phoneRequired"));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await createInquiry({
        name: formData.name,
        interested_service: "Albania Residence Permit",
        mobile_no: formData.phone,
        email: formData.email,
        address: "",
        additional_details: "",
      });

      if (response.status === 1) {
        showSuccess("Thanks, We will contact you soon.");
        router.push("/thankyou");
      } else {
        setSubmitStatus("error");
        showError("Error: " + response.data.message);
      }
    } catch (error) {
      showError("Error: " + error);
    } finally {
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] from-sky-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-cyan-200/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Albania Landmarks SVG Background */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-10">
        <svg viewBox="0 0 1400 600" className="w-full h-full">
          <defs>
            <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <g transform="translate(200,120)">
            <rect
              x="0"
              y="0"
              width="30"
              height="280"
              fill="url(#buildingGrad)"
              rx="15"
            />
            <rect
              x="40"
              y="40"
              width="25"
              height="240"
              fill="#0ea5e9"
              opacity="0.3"
              rx="12"
            />
            <rect
              x="75"
              y="20"
              width="35"
              height="260"
              fill="#0ea5e9"
              opacity="0.35"
              rx="17"
            />
            <rect
              x="120"
              y="60"
              width="20"
              height="220"
              fill="#0ea5e9"
              opacity="0.25"
              rx="10"
            />
            <circle cx="132" cy="55" r="8" fill="#0ea5e9" opacity="0.4" />
          </g>

          <g transform="translate(400,180)">
            <rect
              x="0"
              y="50"
              width="120"
              height="80"
              fill="#0ea5e9"
              opacity="0.25"
              rx="5"
            />
            <rect
              x="20"
              y="30"
              width="20"
              height="100"
              fill="#0ea5e9"
              opacity="0.3"
              rx="10"
            />
            <rect
              x="80"
              y="30"
              width="20"
              height="100"
              fill="#0ea5e9"
              opacity="0.3"
              rx="10"
            />
            <rect
              x="45"
              y="20"
              width="30"
              height="110"
              fill="#0ea5e9"
              opacity="0.35"
              rx="15"
            />
            <rect
              x="55"
              y="10"
              width="10"
              height="30"
              fill="#0ea5e9"
              opacity="0.4"
              rx="5"
            />
            <circle cx="60" cy="5" r="6" fill="#0ea5e9" opacity="0.45" />
          </g>

          <g transform="translate(600,200)">
            <rect
              x="0"
              y="80"
              width="80"
              height="60"
              fill="#0ea5e9"
              opacity="0.2"
              rx="8"
            />
            <path d="M0,80 L40,50 L80,80 Z" fill="#0ea5e9" opacity="0.3" />
            <rect
              x="90"
              y="70"
              width="60"
              height="70"
              fill="#0ea5e9"
              opacity="0.25"
              rx="6"
            />
            <path d="M90,70 L120,45 L150,70 Z" fill="#0ea5e9" opacity="0.35" />
            <rect
              x="35"
              y="100"
              width="10"
              height="15"
              fill="#0ea5e9"
              opacity="0.4"
              rx="5"
            />
            <rect
              x="115"
              y="95"
              width="8"
              height="12"
              fill="#0ea5e9"
              opacity="0.4"
              rx="4"
            />
          </g>

          <g transform="translate(800,250)">
            <path
              d="M0,150 L50,80 L100,120 L150,70 L200,110 L250,150 Z"
              fill="#0ea5e9"
              opacity="0.2"
            />
            <path
              d="M50,150 L100,100 L150,130 L200,90 L250,120 L300,150 Z"
              fill="#0ea5e9"
              opacity="0.15"
            />
          </g>

          <g transform="translate(1050,300)">
            <ellipse
              cx="150"
              cy="50"
              rx="120"
              ry="30"
              fill="#0ea5e9"
              opacity="0.1"
            />
            <path
              d="M30,50 Q80,30 130,50 Q180,70 230,50"
              stroke="#0ea5e9"
              strokeWidth="3"
              fill="none"
              opacity="0.2"
            />
            <circle cx="60" cy="45" r="4" fill="#0ea5e9" opacity="0.25" />
            <circle cx="120" cy="40" r="3" fill="#0ea5e9" opacity="0.3" />
            <circle cx="180" cy="55" r="5" fill="#0ea5e9" opacity="0.2" />
          </g>
        </svg>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-8 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - Hero Text */}
            <div
              className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="inline-flex items-center px-4 py-2 bg-sky-100 rounded-full text-sky-700 text-sm font-semibold">
                <Star className="w-4 h-4 mr-2" />
                {t.hero.badge}
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black text-sky-900 leading-tight">
                  {t.hero.title.line1}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                    {t.hero.title.albania}
                  </span>
                  <span className="block text-sky-800">
                    {t.hero.title.residency}
                  </span>
                </h1>
                <p className="text-xl text-sky-600 max-w-lg leading-relaxed">
                  {t.hero.description}
                </p>
              </div>

              <div className="h-16 overflow-hidden">
                <div
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(-${currentSlide * 64}px)` }}
                >
                  {benefits.map((benefit, index) => (
                    <div key={index} className="h-16 flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                      <span className="text-lg text-sky-700 font-medium">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold rounded-2xl hover:from-sky-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                  {t.hero.buttons.getPermit}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="flex items-center justify-center px-8 py-4 border-2 border-sky-600 text-sky-600 font-bold rounded-2xl hover:bg-sky-50 transition-all duration-300">
                  {t.hero.buttons.learnMore}
                </button>
              </div>
            </div>

            {/* Right Content - Contact Form */}
            <div
              className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 relative z-10">
                  {/* Success/Error Messages */}
                  {submitStatus === "success" && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center text-green-800">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">
                          {t.form.messages.success}
                        </span>
                      </div>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center text-red-800">
                        <span className="font-medium">
                          {t.form.messages.error}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Form Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-sky-900 mb-2">
                      {t.form.header.title}
                    </h3>
                    <p className="text-sky-600">{t.form.header.subtitle}</p>
                  </div>

                  {/* Form */}
                  <div className="space-y-6">
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                      <input
                        type="text"
                        name="name"
                        placeholder={t.form.fields.fullName}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full pl-12 pr-4 py-4 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                      />
                    </div>

                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder={t.form.fields.phoneNumber}
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full pl-12 pr-4 py-4 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                      />
                    </div>

                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        placeholder={t.form.fields.emailAddress}
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full pl-12 pr-4 py-4 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-sky-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t.form.buttons.sending}
                        </>
                      ) : (
                        <>
                          <Clock className="w-5 h-5 mr-2" />
                          {t.form.buttons.getFreeConsultation}
                        </>
                      )}
                    </button>

                    <p className="text-xs text-sky-500 text-center">
                      {t.form.disclaimer}
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
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-sky-900">
                {t.badge.verifiedService}
              </div>
              <div className="text-xs text-sky-600">
                {t.badge.trustedByClients}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbaniaHeroSection;
