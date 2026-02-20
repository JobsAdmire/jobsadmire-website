import React from "react";
import { useRouter } from "next/router";
import {
  GraduationCap,
  Home,
  Users,
  Baby,
  Coins,
  UserPlus,
  Search,
  MessageSquare,
  Briefcase,
  Shield,
  Star,
  Award,
  CheckCircle,
  ArrowRight,
  Globe,
  Target,
  Sparkles,
  MapPin,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/remotejobs.json";
import trTranslations from "../../../public/locales/tr/remotejobs.json";
import frTranslations from "../../../public/locales/fr/remotejobs.json";
import deTranslations from "../../../public/locales/de/remotejobs.json";
import arTranslations from "../../../public/locales/ar/remotejobs.json";
import ruTranslations from "../../../public/locales/ru/remotejobs.json";
import faTranslations from "../../../public/locales/fa/remotejobs.json";
const RemoteWorkSection2 = () => {
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "ar":
        return arTranslations;
      case "ru":
        return ruTranslations;
      case "fr":
        return frTranslations;
      case "fa":
        return faTranslations;
      case "de":
        return deTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  // Icon mapping function
  const getIcon = (iconName, size = "w-8 h-8") => {
    const iconMap = {
      GraduationCap: <GraduationCap className={size} />,
      Home: <Home className={size} />,
      Users: <Users className={size} />,
      Baby: <Baby className={size} />,
      Coins: <Coins className={size} />,
      MapPin: <MapPin className={size} />,
      UserPlus: <UserPlus className={size} />,
      Search: <Search className={size} />,
      MessageSquare: <MessageSquare className={size} />,
      Briefcase: <Briefcase className={size} />,
      Award: <Award className={size} />,
      Shield: <Shield className={size} />,
      Globe: <Globe className={size} />,
    };
    return iconMap[iconName] || <Briefcase className={size} />;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Who Should Explore Remote Work Section */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-7xl px-6 mx-auto">
          {/* Header */}
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {t.remoteworksection2.whoShould.title.prefix}{" "}
              <span className="text-[#38B6FF]">
                {t.remoteworksection2.whoShould.title.highlight}
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t.remoteworksection2.whoShould.description}
            </p>
          </div>

          {/* Target Audience */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {t.remoteworksection2.whoShould.audience.map((audience, index) => (
              <div
                key={index}
                className="relative p-8 overflow-hidden transition-all duration-500 bg-white border border-gray-100 shadow-sm group rounded-3xl hover:shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#38B6FF]/5 rounded-full -mr-16 -mt-16 group-hover:bg-[#38B6FF]/10 transition-colors duration-500"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#38B6FF] to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <div className="text-white">{getIcon(audience.icon)}</div>
                  </div>

                  <h3 className="mb-4 text-xl font-bold text-gray-900">
                    {audience.title}
                  </h3>

                  <p className="leading-relaxed text-gray-600">
                    {audience.highlight
                      ? audience.description
                          .split(audience.highlight)
                          .map((part, i, arr) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className="font-semibold text-[#38B6FF]">
                                  {audience.highlight}
                                </span>
                              )}
                            </span>
                          ))
                      : audience.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started Section */}
      <section className="relative py-24 overflow-hidden bg-white">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#38B6FF]/5 rounded-full blur-3xl"></div>
        <div className="absolute rounded-full bottom-20 left-10 w-96 h-96 bg-blue-500/5 blur-3xl"></div>

        <div className="container relative z-10 px-6 mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {t.remoteworksection2.howToStart.title.prefix}{" "}
              <span className="text-[#38B6FF]">
                {t.remoteworksection2.howToStart.title.highlight}
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t.remoteworksection2.howToStart.description}
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left Side - Visual Flow */}
            <div className="relative">
              <div className="space-y-8">
                {t.remoteworksection2.howToStart.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-6 group">
                    {/* Step Number & Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#38B6FF] to-blue-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                        <div className="text-white">
                          {getIcon(step.icon, "w-6 h-6")}
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-[#38B6FF] rounded-full flex items-center justify-center text-sm font-bold text-[#38B6FF]">
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl group-hover:shadow-xl">
                      <h3 className="mb-2 text-xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="leading-relaxed text-gray-600">
                        {step.description}
                      </p>
                    </div>

                    {/* Connection Line */}
                    {index <
                      t.remoteworksection2.howToStart.steps.length - 1 && (
                      <div className="absolute left-10 top-20 w-0.5 h-16 bg-gradient-to-b from-[#38B6FF] to-blue-300 z-0"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Interactive Demo */}
            <div className="relative">
              <div className="p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl">
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#38B6FF] to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    {t.remoteworksection2.howToStart.form.title}
                  </h3>
                  <p className="text-gray-600">
                    {t.remoteworksection2.howToStart.form.subtitle}
                  </p>
                </div>

                {/* Mock Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      {t.remoteworksection2.howToStart.form.fields.name}
                    </label>
                    <div className="flex items-center w-full h-12 px-4 border border-gray-200 bg-gray-50 rounded-xl">
                      <span className="text-gray-400">
                        {t.remoteworksection2.howToStart.form.placeholders.name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      {t.remoteworksection2.howToStart.form.fields.email}
                    </label>
                    <div className="flex items-center w-full h-12 px-4 border border-gray-200 bg-gray-50 rounded-xl">
                      <span className="text-gray-400">
                        {
                          t.remoteworksection2.howToStart.form.placeholders
                            .email
                        }
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      {t.remoteworksection2.howToStart.form.fields.skills}
                    </label>
                    <div className="flex items-start w-full h-20 p-4 border border-gray-200 bg-gray-50 rounded-xl">
                      <span className="text-gray-400">
                        {
                          t.remoteworksection2.howToStart.form.placeholders
                            .skills
                        }
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-[#38B6FF] to-blue-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    {t.remoteworksection2.howToStart.form.submit}
                  </button>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center mt-8 space-x-2">
                  <div className="w-2 h-2 bg-[#38B6FF] rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#38B6FF] rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute w-6 h-6 delay-1000 bg-blue-400 rounded-full -bottom-4 -left-4 opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-[#38B6FF] to-blue-500 p-1 rounded-2xl shadow-xl">
              <a href="/contact-us">
                <button className="bg-white text-[#38B6FF] px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {t.remoteworksection2.howToStart.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust JobsAdmire Section */}
      <section className="py-24 bg-gradient-to-br from-[#38B6FF] to-blue-500">
        <div className="container max-w-7xl px-6 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              {t.remoteworksection2.whyTrust.title.prefix}{" "}
              <span className="text-blue-100">
                {t.remoteworksection2.whyTrust.title.highlight}
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-blue-100">
              {t.remoteworksection2.whyTrust.description}
            </p>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Column - Trust Points */}
            <div className="space-y-8">
              {t.remoteworksection2.whyTrust.points.map((point, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl">
                    {getIcon(point.icon, "w-6 h-6 text-white")}
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {point.title}
                    </h3>
                    <p className="text-blue-100">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Highlight Card */}
            <div className="p-8 bg-white shadow-2xl rounded-3xl">
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#38B6FF] to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  {t.remoteworksection2.whyTrust.highlight.title.prefix}{" "}
                  <span className="text-[#38B6FF]">
                    {t.remoteworksection2.whyTrust.highlight.title.highlight}
                  </span>
                </h3>
              </div>

              <div className="mb-8 space-y-4">
                {t.remoteworksection2.whyTrust.highlight.features.map(
                  (feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#38B6FF] flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  )
                )}
              </div>

              <button className="w-full bg-gradient-to-r from-[#38B6FF] to-blue-500 text-white font-semibold py-4 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                <Target className="w-5 h-5" />
                {t.remoteworksection2.whyTrust.highlight.cta}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RemoteWorkSection2;
