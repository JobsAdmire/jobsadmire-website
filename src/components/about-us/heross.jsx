import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  CheckCircle,
  Users,
  Award,
  Globe,
  BookOpen,
  Heart,
  MapPin,
  BarChart,
  Star,
  History,
  ExternalLink,
  MessageSquare,
  Target,
  Compass,
  FileText,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Sparkles,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/about.json";
import trTranslations from "../../../public/locales/tr/about.json";
import arTranslations from "../../../public/locales/ar/about.json";
import frTranslations from "../../../public/locales/fr/about.json";
import deTranslations from "../../../public/locales/de/about.json";
import ruTranslations from "../../../public/locales/ru/about.json";
import faTranslations from "../../../public/locales/fa/about.json";

const AboutUsHero = () => {
  const router = useRouter();
  const { locale } = router;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "ar":
        return arTranslations;
      case "fr":
        return frTranslations;
      case "ru":
        return ruTranslations;
      case "de":
        return deTranslations;
      case "fa":
        return faTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  // Animation effect for word rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(
        (prevIndex) => (prevIndex + 1) % t.hero.animatedWords.length
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [t.hero.animatedWords.length]);

  return (
    <div className="relative pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] bg-gradient-to-br from-indigo-50 via-white to-blue-50 overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-emerald-200/20 to-teal-300/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(99 102 241) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Single Container - Everything fits here */}
      <div className="relative z-10 mx-auto px-4 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
            {/* LEFT SIDE - Content */}
            <div className="space-y-6">
              {/* Badge */}

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="text-gray-900">
                    {t.hero.headline.empowering}
                  </span>{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-sky-600 to-sky-600 bg-clip-text text-transparent font-extrabold">
                      {t.hero.animatedWords[currentWordIndex]}
                    </span>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-sky-600 to-sky-600 rounded-full"></div>
                  </span>
                  <br />
                  <span className="text-gray-900">
                    {t.hero.headline.through}
                  </span>
                  <br />
                  <span className="text-gray-900">
                    {t.hero.headline.resumeServices}
                  </span>
                </h1>

                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  {t.hero.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="/services" className="flex-1">
                    <button className="group relative w-full py-3 px-6 font-bold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-sky-600 to-sky-600 hover:from-sky-600 hover:to-sky-600 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center">
                        <Briefcase className="w-5 h-5 mr-2" />
                        <span>{t.hero.cta.ourServices}</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </button>
                  </a>
                  <button className="group py-3 px-6 font-semibold text-sky-600 transition-all duration-300 rounded-xl bg-white border-2 border-indigo-200 hover:border-indigo-300 shadow-md hover:shadow-lg hover:-translate-y-1">
                    {t.hero.cta.learnMore}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - About Card */}
            <div className="space-y-4">
              {/* Main About Card */}
              <div className="bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl overflow-hidden">
                {/* Card Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100/50 bg-gradient-to-r from-indigo-50 to-blue-50">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm font-bold text-gray-700">
                      {t.story.title}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-sky-600 transition-colors">
                      <History className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-sky-600 transition-colors">
                      <Target className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  {/* Timeline - Compact */}
                  <div className="relative mb-5 pl-5 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-400 before:to-blue-500">
                    <div className="relative mb-3">
                      <div className="absolute flex items-center justify-center w-4 h-4 bg-white border-2 rounded-full -left-5 top-0.5 border-indigo-400 shadow-sm">
                        <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                      </div>
                      <div className="text-sm font-bold text-gray-800">
                        {t.story.timeline.founded.year}
                      </div>
                      <p className="text-xs text-gray-600">
                        {t.story.timeline.founded.description}
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute flex items-center justify-center w-4 h-4 text-white border-2 rounded-full -left-5 top-0.5 bg-gradient-to-r from-sky-600 to-sky-600 border-indigo-400 shadow-sm">
                        <Compass size={8} />
                      </div>
                      <div className="text-sm font-bold text-sky-600">
                        {t.story.timeline.today.year}
                      </div>
                      <p className="text-xs text-gray-600">
                        {t.story.timeline.today.description}
                      </p>
                    </div>
                  </div>

                  {/* Core Values - Compact */}
                  <div className="mb-5">
                    <h3 className="mb-3 text-base font-bold text-gray-800">
                      {t.story.values.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center p-2 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100/50 rounded-lg">
                        <div className="flex items-center justify-center w-6 h-6 mr-2 rounded-lg bg-gradient-to-r from-sky-600 to-sky-600">
                          <Users className="w-3 h-3 text-white" />
                        </div>
                        <div className="text-xs font-bold text-gray-800">
                          {t.story.values.clientFirst}
                        </div>
                      </div>

                      <div className="flex items-center p-2 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100/50 rounded-lg">
                        <div className="flex items-center justify-center w-6 h-6 mr-2 rounded-lg bg-gradient-to-r from-blue-500 to-sky-600">
                          <Award className="w-3 h-3 text-white" />
                        </div>
                        <div className="text-xs font-bold text-gray-800">
                          {t.story.values.excellence}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section - Compact */}

                  <div className="flex justify-center">
                    <button className="group flex items-center px-4 py-2 text-sm font-semibold bg-white border-2 rounded-lg text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-0.5">
                      {t.story.cta}
                      <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-white/60">
                  <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-600 shadow-md">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-sky-600">CV</div>
                    <div className="text-xs text-gray-600">Expert</div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-white/60">
                  <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-r from-blue-500 to-sky-600 shadow-md">
                    <BarChart className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-sky-600">
                      Analytics
                    </div>
                    <div className="text-xs text-gray-600">Driven</div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-white/60">
                  <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">
                      Quality
                    </div>
                    <div className="text-xs text-gray-600">First</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute w-2 h-2 rounded-full bg-indigo-400/60 top-20 right-1/3 animate-pulse"></div>
      <div className="absolute w-3 h-3 bg-blue-400/60 rounded-full bottom-32 left-1/4 animate-pulse delay-300"></div>
      <div className="absolute w-2 h-2 rounded-full bg-purple-400/60 top-1/3 right-1/4 animate-pulse delay-700"></div>
    </div>
  );
};

export default AboutUsHero;
