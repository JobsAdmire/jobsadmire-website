import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Briefcase,
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
  FileText,
  Users,
  TrendingUp,
  Award,
  Building,
  Phone,
} from "lucide-react";
import WorkPermitPopupForm from "@/components/workpermit/WorkPermitPopupForm";

const WorkPermitPage = () => {
  const { t } = useTranslation("work-permit");
  const router = useRouter();
  const { locale } = router;
  const isRTL = locale === "ar" || locale === "fa";

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const benefits = [
    t("hero.benefits.fastTrack"),
    t("hero.benefits.legalConsultation"),
    t("hero.benefits.documentPreparation"),
  ];

  const keyBenefits = [
    {
      icon: Shield,
      title: t("benefits.items.legalEmployment.title"),
      description: t("benefits.items.legalEmployment.description"),
    },
    {
      icon: Building,
      title: t("benefits.items.turkishMarket.title"),
      description: t("benefits.items.turkishMarket.description"),
    },
    {
      icon: Users,
      title: t("benefits.items.familyResidence.title"),
      description: t("benefits.items.familyResidence.description"),
    },
    {
      icon: TrendingUp,
      title: t("benefits.items.careerGrowth.title"),
      description: t("benefits.items.careerGrowth.description"),
    },
    {
      icon: Award,
      title: t("benefits.items.socialSecurity.title"),
      description: t("benefits.items.socialSecurity.description"),
    },
    {
      icon: Globe,
      title: t("benefits.items.residencePermit.title"),
      description: t("benefits.items.residencePermit.description"),
    },
  ];

  const processSteps = [
    {
      step: t("process.steps.consultation.step"),
      title: t("process.steps.consultation.title"),
      description: t("process.steps.consultation.description"),
    },
    {
      step: t("process.steps.preparation.step"),
      title: t("process.steps.preparation.title"),
      description: t("process.steps.preparation.description"),
    },
    {
      step: t("process.steps.submission.step"),
      title: t("process.steps.submission.title"),
      description: t("process.steps.submission.description"),
    },
    {
      step: t("process.steps.approval.step"),
      title: t("process.steps.approval.title"),
      description: t("process.steps.approval.description"),
    },
  ];

  const requirements = [
    t("requirements.documents.passport"),
    t("requirements.documents.employmentContract"),
    t("requirements.documents.degree"),
    t("requirements.documents.companyDocuments"),
    t("requirements.documents.healthInsurance"),
    t("requirements.documents.photos"),
    t("requirements.documents.translations"),
  ];

  const workPermitTypes = [
    {
      type: t("workPermitTypes.types.indefinite.type"),
      description: t("workPermitTypes.types.indefinite.description"),
      duration: t("workPermitTypes.types.indefinite.duration"),
    },
    {
      type: t("workPermitTypes.types.definite.type"),
      description: t("workPermitTypes.types.definite.description"),
      duration: t("workPermitTypes.types.definite.duration"),
    },
    {
      type: t("workPermitTypes.types.independent.type"),
      description: t("workPermitTypes.types.independent.description"),
      duration: t("workPermitTypes.types.independent.duration"),
    },
    {
      type: t("workPermitTypes.types.turquoiseCard.type"),
      description: t("workPermitTypes.types.turquoiseCard.description"),
      duration: t("workPermitTypes.types.turquoiseCard.duration"),
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % benefits.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [benefits.length]);

  return (
    <div
      className=" bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Head>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
      </Head>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-cyan-200/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 md:px-8 pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div
              className={`space-y-6 sm:space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-sky-900 leading-tight">
                  {t("hero.title.line1")}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                    {t("hero.title.line2")}
                  </span>
                  <span className="block text-sky-800">
                    {t("hero.title.line3")}
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-sky-600 max-w-lg leading-relaxed">
                  {t("hero.subtitle")}
                </p>
              </div>

              <div className="h-12 sm:h-16 overflow-hidden">
                <div
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(-${currentSlide * 48}px)` }}
                >
                  {benefits.map((benefit, index) => (
                    <div key={index} className="h-12 sm:h-16 flex items-center">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="text-sm sm:text-base md:text-lg text-sky-700 font-medium line-clamp-1">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  onClick={() => setShowPopup(true)}
                  className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold text-sm sm:text-base rounded-2xl hover:from-sky-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  {t("hero.buttons.applyNow")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </button>
                <button className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-sky-600 text-sky-600 font-bold text-sm sm:text-base rounded-2xl hover:bg-sky-50 transition-all duration-300">
                  {t("hero.buttons.learnMore")}
                </button>
              </div>
            </div>

            {/* Right Content - Work Permit Illustration */}
            <div
              className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="relative">
                {/* Work Permit Card Illustration */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 relative overflow-hidden">
                  {/* Decorative Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-full h-full">
                      <svg viewBox="0 0 400 500" className="w-full h-full">
                        <defs>
                          <pattern
                            id="grid"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                          >
                            <circle cx="20" cy="20" r="1" fill="#0ea5e9" />
                          </pattern>
                        </defs>
                        <rect width="400" height="500" fill="url(#grid)" />
                      </svg>
                    </div>
                  </div>

                  {/* Work Permit Document Illustration */}
                  <div className="relative z-10 space-y-6">
                    {/* Header with Turkey Flag */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border-l-4 border-red-500">
                      <div className="flex items-center space-x-3">
                        {/* Turkey Flag Image */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden">
                          <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAZlBMVEXjChf////iAADjABPqbm/jAAn63t/0ubr++fn409P//Pz3ysvnTlD86OnjAA3vkpPnSUz98/PmP0HtgoTjFh3yp6nuiIn1xcT2wcLkMTPpXWHnRUjwnp/kJinzsrPrdXfpZ2joVlkSm7nFAAABuklEQVRoge2Y23KCMBCGkw0BFCFEQaFS0Pd/yQbaSmqVRGA705n9b7yJH5s9ZRPGSCQSiUQi/VcJgYLNoFfBhp9VPyEA9oc21DqOtd6UnfnEeuhCpVtuKU6ClfDAypj/UnoAuRgt4PgA3SvMlxoPxeaemZxOVRL2bmqWRRZqbYO3VVCLIV+y+i3SPFlCh/OPMDbvJgs/ccJ8ozjG4Xy6rG12VNyRBLA2nOt3IWyfdA+MFBBEM+lgxTLePYZA3s2iw9Gy+/wMIes5bAEW+/LcvC9nyZciC+3ILp1blyZH/dm24drtVuheyRtovJxyWx6YevWHpzd26vEvA+ffvSaDbHpxZtWP8oTrvhLMoZI3+bT/QY1wnxLv4bwyTWenQn5yWAPV2AZ9fDnAuVJ9t9QuayyXt17wy7jTvesUsRLR6XIhAa7RCyGy4MH0YgnyWo775BuPvB1XXyd3KS+RRTYdziP8fwVHdQtCQFFTEbWIMMsftXGhtlzcwwL1mEM9oHFHC9ShCHecwx1EUUdo5/Cvlgz/uNcW3AsX7lWRoV5yGe71nN0/LDRrPiwMwnsSuQnpMYdEIpFIJNLf6wP98hbnfFcuQQAAAABJRU5ErkJggg=="
                            alt={t("labels.turkeyFlagAlt")}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-red-900">
                            {t("hero.permitCard.turkeyRepublic")}
                          </div>
                          <div className="text-xs text-red-600">
                            {t("hero.permitCard.republicOfTurkey")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Work Permit Card */}
                    <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="text-white/80 text-xs font-semibold mb-1">
                            {t("hero.permitCard.workPermitTR")}
                          </div>
                          <div className="text-white text-lg font-bold">
                            {t("hero.permitCard.workPermit")}
                          </div>
                        </div>
                        <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/80" />
                      </div>

                      {/* Simulated Photo */}
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="w-20 h-24 sm:w-24 sm:h-28 bg-white/20 rounded-lg backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                          <User className="w-10 h-10 sm:w-12 sm:h-12 text-white/50" />
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="bg-white/20 rounded h-3 w-full"></div>
                          <div className="bg-white/20 rounded h-3 w-3/4"></div>
                          <div className="bg-white/20 rounded h-3 w-5/6"></div>
                          <div className="bg-white/20 rounded h-3 w-2/3"></div>
                        </div>
                      </div>

                      {/* Permit Details */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                          <div className="text-white/60 text-xs mb-1">
                            {t("hero.permitCard.permitType")}
                          </div>
                          <div className="text-white text-sm font-semibold">
                            {t("hero.permitCard.permitTypeValue")}
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                          <div className="text-white/60 text-xs mb-1">
                            {t("hero.permitCard.duration")}
                          </div>
                          <div className="text-white text-sm font-semibold">
                            {t("hero.permitCard.durationValue")}
                          </div>
                        </div>
                      </div>

                      {/* Barcode */}
                      <div className="mt-4 flex justify-center">
                        <div className="bg-white rounded p-2 w-32 h-12 flex items-center justify-center">
                          <div className="flex space-x-1">
                            {[...Array(12)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-gray-800"
                                style={{
                                  height: `${20 + Math.random() * 20}px`,
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-sky-200/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Permit Types Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sky-900 mb-3 sm:mb-4">
              {t("workPermitTypes.title.part1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                {t("workPermitTypes.title.part2")}
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-sky-600 max-w-2xl mx-auto px-4">
              {t("workPermitTypes.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {workPermitTypes.map((permit, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between mb-3 sm:mb-4 gap-3">
                  <div className="flex-1 w-full">
                    <h3 className="text-lg sm:text-xl font-bold text-sky-900 mb-2 break-words">
                      {permit.type}
                    </h3>
                    <p className="text-sky-600 text-xs sm:text-sm leading-relaxed mb-3">
                      {permit.description}
                    </p>
                  </div>
                  <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-sky-500 flex-shrink-0" />
                </div>
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-sky-100">
                  <span className="text-xs sm:text-sm text-sky-500 font-semibold">
                    {t("workPermitTypes.durationLabel")}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-sky-700">
                    {permit.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 via-sky-100/30 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 bg-sky-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-20 w-48 h-48 bg-blue-300 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/50">
            <div className="mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-sky-800 mb-4">
                <span className="text-sky-600">
                  {t("benefits.title.part1")}
                </span>{" "}
                {t("benefits.title.part2")}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {keyBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-sky-100"
                  >
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg font-bold text-sky-800 mb-2 leading-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-sky-600 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-sky-900 mb-4">
              {t("process.title.part1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                {t("process.title.part2")}
              </span>
            </h2>
            <p className="text-xl text-sky-600 max-w-2xl mx-auto">
              {t("process.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="text-6xl font-black text-sky-100 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-sky-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sky-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-sky-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-white/50 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-sky-900 mb-4">
              {t("requirements.title.part1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                {t("requirements.title.part2")}
              </span>
            </h2>
            <p className="text-xl text-sky-600">{t("requirements.subtitle")}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
            <div className="grid md:grid-cols-2 gap-4">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-sky-50 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sky-800 font-medium">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-gradient-to-r from-sky-600 to-blue-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-sky-100 mb-8">{t("cta.subtitle")}</p>
            <button
              onClick={() => setShowPopup(true)}
              className="bg-white text-sky-600 font-bold px-8 py-4 rounded-2xl hover:bg-sky-50 transform hover:scale-105 transition-all duration-300 shadow-xl inline-flex items-center"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              {t("cta.button")}
            </button>
          </div>
        </div>
      </section>

      {/* Floating Badge */}
      <div className="fixed bottom-8 left-8 z-30 hidden lg:block">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/50">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-sky-900">
                {t("floatingBadge.title")}
              </div>
              <div className="text-xs text-sky-600">
                {t("floatingBadge.clients")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work Permit Popup Form */}
      <WorkPermitPopupForm
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "work-permit"])),
    },
  };
};

export default WorkPermitPage;
