import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Briefcase,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Award,
  Building,
  Factory,
  Wrench,
  HardHat,
  Package,
  UserCheck,
  Zap,
  Lock,
  DollarSign,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import HireWorkersPopupForm from "@/components/hireworkers/HireWorkersPopupForm";

const HireWorkersPage = ({ cmsFaqs = [] }) => {
  const { t } = useTranslation("hire-workers");
  const router = useRouter();
  const { locale } = router;
  const isRTL = locale === "ar" || locale === "fa";

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const benefits = [
    t("hero.benefits.scalable"),
    t("hero.benefits.laborSupply"),
    t("hero.benefits.tailored"),
  ];

  const workforceTypes = [
    {
      icon: Wrench,
      title: t("workforceTypes.skilled.title"),
      description: t("workforceTypes.skilled.description"),
      items: [
        t("workforceTypes.skilled.items.technicians"),
        t("workforceTypes.skilled.items.welders"),
        t("workforceTypes.skilled.items.engineers"),
        t("workforceTypes.skilled.items.it"),
      ],
      availability: t("workforceTypes.skilled.availability"),
    },
    {
      icon: Package,
      title: t("workforceTypes.semiSkilled.title"),
      description: t("workforceTypes.semiSkilled.description"),
      items: [
        t("workforceTypes.semiSkilled.items.assembly"),
        t("workforceTypes.semiSkilled.items.production"),
        t("workforceTypes.semiSkilled.items.warehouse"),
        t("workforceTypes.semiSkilled.items.packaging"),
      ],
      availability: t("workforceTypes.semiSkilled.availability"),
    },
    {
      icon: HardHat,
      title: t("workforceTypes.unskilled.title"),
      description: t("workforceTypes.unskilled.description"),
      items: [
        t("workforceTypes.unskilled.items.factory"),
        t("workforceTypes.unskilled.items.construction"),
        t("workforceTypes.unskilled.items.cleaning"),
        t("workforceTypes.unskilled.items.agricultural"),
      ],
      availability: t("workforceTypes.unskilled.availability"),
    },
    {
      icon: Building,
      title: t("workforceTypes.corporate.title"),
      description: t("workforceTypes.corporate.description"),
      items: [
        t("workforceTypes.corporate.items.admin"),
        t("workforceTypes.corporate.items.sales"),
        t("workforceTypes.corporate.items.customer"),
        t("workforceTypes.corporate.items.backoffice"),
      ],
      availability: t("workforceTypes.corporate.availability"),
    },
  ];

  const keyBenefits = [
    {
      icon: Users,
      title: t("benefits.items.reliableTalent.title"),
      description: t("benefits.items.reliableTalent.description"),
    },
    {
      icon: Zap,
      title: t("benefits.items.fasterHiring.title"),
      description: t("benefits.items.fasterHiring.description"),
    },
    {
      icon: TrendingUp,
      title: t("benefits.items.scalableWorkforce.title"),
      description: t("benefits.items.scalableWorkforce.description"),
    },
    {
      icon: Award,
      title: t("benefits.items.industrySpecific.title"),
      description: t("benefits.items.industrySpecific.description"),
    },
    {
      icon: DollarSign,
      title: t("benefits.items.costEfficient.title"),
      description: t("benefits.items.costEfficient.description"),
    },
    {
      icon: Lock,
      title: t("benefits.items.confidential.title"),
      description: t("benefits.items.confidential.description"),
    },
  ];

  const processSteps = [
    {
      step: t("process.steps.requirement.step"),
      title: t("process.steps.requirement.title"),
      description: t("process.steps.requirement.description"),
    },
    {
      step: t("process.steps.sourcing.step"),
      title: t("process.steps.sourcing.title"),
      description: t("process.steps.sourcing.description"),
    },
    {
      step: t("process.steps.screening.step"),
      title: t("process.steps.screening.title"),
      description: t("process.steps.screening.description"),
    },
    {
      step: t("process.steps.onboarding.step"),
      title: t("process.steps.onboarding.title"),
      description: t("process.steps.onboarding.description"),
    },
  ];

  const requirements = [
    t("requirements.items.jobRoles"),
    t("requirements.items.workerCount"),
    t("requirements.items.skillLevel"),
    t("requirements.items.contractDuration"),
    t("requirements.items.location"),
    t("requirements.items.operational"),
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
      className="bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50"
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
                  {t("hero.buttons.requestSupport")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </button>
                <button className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-sky-600 text-sky-600 font-bold text-sm sm:text-base rounded-2xl hover:bg-sky-50 transition-all duration-300">
                  {t("hero.buttons.learnMore")}
                </button>
              </div>
            </div>

            {/* Right Content - Workforce Illustration */}
            <div
              className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="relative">
                {/* Workforce Card Illustration */}
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

                  {/* Workforce Illustration Content */}
                  <div className="relative z-10 space-y-6">
                    {/* Header with Factory Icon */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-50 to-blue-100 rounded-2xl border-l-4 border-sky-500">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Factory className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-sky-900">
                            {t("hero.illustration.title")}
                          </div>
                          <div className="text-xs text-sky-600">
                            {t("hero.illustration.subtitle")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Workforce Stats Card */}
                    <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="text-white/80 text-xs font-semibold mb-1">
                            {t("hero.illustration.workforceSolutions")}
                          </div>
                          <div className="text-white text-lg font-bold">
                            {t("hero.illustration.readyToDeploy")}
                          </div>
                        </div>
                        <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/80" />
                      </div>

                      {/* Worker Icons Grid */}
                      <div className="flex items-center justify-center space-x-2 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-12 h-14 bg-white/20 rounded-lg backdrop-blur-sm border-2 border-white/30 flex items-center justify-center"
                          >
                            <UserCheck className="w-6 h-6 text-white/70" />
                          </div>
                        ))}
                      </div>

                      {/* Skill Level Badges */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm text-center">
                          <div className="text-white/60 text-xs mb-1">
                            {t("hero.illustration.skilled")}
                          </div>
                          <div className="text-white text-sm font-semibold flex items-center justify-center">
                            <Wrench className="w-3 h-3 mr-1" />
                            {t("hero.illustration.available")}
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm text-center">
                          <div className="text-white/60 text-xs mb-1">
                            {t("hero.illustration.semiSkilled")}
                          </div>
                          <div className="text-white text-sm font-semibold flex items-center justify-center">
                            <Package className="w-3 h-3 mr-1" />
                            {t("hero.illustration.available")}
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm text-center">
                          <div className="text-white/60 text-xs mb-1">
                            {t("hero.illustration.general")}
                          </div>
                          <div className="text-white text-sm font-semibold flex items-center justify-center">
                            <HardHat className="w-3 h-3 mr-1" />
                            {t("hero.illustration.available")}
                          </div>
                        </div>
                      </div>

                      {/* Pre-screened Badge */}
                      <div className="mt-4 flex justify-center">
                        <div className="bg-white rounded-xl p-3 flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sky-800 text-sm font-semibold">
                            {t("hero.illustration.preScreened")}
                          </span>
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

      {/* Workforce Types Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sky-900 mb-3 sm:mb-4">
              {t("workforceTypes.title.part1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                {t("workforceTypes.title.part2")}
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-sky-600 max-w-2xl mx-auto px-4">
              {t("workforceTypes.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {workforceTypes.map((workforce, index) => {
              const Icon = workforce.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-sky-900 mb-2">
                        {workforce.title}
                      </h3>
                      <p className="text-sky-600 text-xs sm:text-sm leading-relaxed">
                        {workforce.description}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {workforce.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sky-700 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-sky-100">
                    <span className="text-xs sm:text-sm text-sky-500 font-semibold">
                      {t("workforceTypes.availabilityLabel")}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-sky-700">
                      {workforce.availability}
                    </span>
                  </div>
                </div>
              );
            })}
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
            <p className="text-sm text-sky-500 text-center mt-6 italic">
              {t("requirements.note")}
            </p>
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
              <Users className="w-5 h-5 mr-2" />
              {t("cta.button")}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-8 bg-white/50 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl mb-4">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-sky-900 mb-4">
              {t("faq.title")}
            </h2>
          </div>

          <div className="space-y-4">
            {(cmsFaqs.length > 0 ? cmsFaqs : [1, 2, 3, 4].map((num) => ({
              question: t(`faq.items.q${num}.question`),
              answer: t(`faq.items.q${num}.answer`),
            }))).map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-sky-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-sky-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section className="py-8 px-8 bg-sky-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-sky-600 leading-relaxed">
            {t("footer.disclaimer")}
          </p>
          <p className="text-xs text-sky-500 mt-2 italic">
            {t("footer.note")}
          </p>
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

      {/* Hire Workers Popup Form */}
      <HireWorkersPopupForm
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
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const { getFaqs } = require("@/lib/api/cms");

  const [cmsPageContent, cmsFaqs] = await Promise.all([
    getPageAndLayoutContent("services/hire-workers", locale),
    getFaqs("hire-workers-in-turkey", locale),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "hire-workers"])),
      cmsPageContent,
      cmsFaqs: cmsFaqs || [],
    },
    revalidate: 60,
  };
};

export default HireWorkersPage;
