import React from "react";
import { useRouter } from "next/router";
import {
  Clock,
  Globe,
  DollarSign,
  Heart,
  TrendingUp,
  CheckCircle,
  Users,
  Briefcase,
  Target,
  BookOpen,
  Headphones,
  Zap,
  ArrowRight,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/remotejobs.json";
import trTranslations from "../../../public/locales/tr/remotejobs.json";
import frTranslations from "../../../public/locales/fr/remotejobs.json";
import deTranslations from "../../../public/locales/de/remotejobs.json";
import arTranslations from "../../../public/locales/ar/remotejobs.json";
import ruTranslations from "../../../public/locales/ru/remotejobs.json";
import faTranslations from "../../../public/locales/fa/remotejobs.json";
const RemoteWorkSection1 = () => {
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
      Clock: <Clock className={size} />,
      Globe: <Globe className={size} />,
      DollarSign: <DollarSign className={size} />,
      Heart: <Heart className={size} />,
      TrendingUp: <TrendingUp className={size} />,
      Users: <Users className={size} />,
      Target: <Target className={size} />,
      Briefcase: <Briefcase className={size} />,
      Headphones: <Headphones className={size} />,
      BookOpen: <BookOpen className={size} />,
    };
    return iconMap[iconName] || <Briefcase className={size} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Why Choose Remote Work Section */}
      <section className="py-24">
        <div className="container max-w-7xl px-6 mx-auto">
          {/* Header */}
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {t.remoteworksection.whyChoose.title.prefix}{" "}
              <span className="text-[#38B6FF]">
                {t.remoteworksection.whyChoose.title.highlight}
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t.remoteworksection.whyChoose.description}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {t.remoteworksection.whyChoose.benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-8 transition-all duration-500 bg-white border border-gray-100 shadow-sm group rounded-3xl hover:shadow-xl hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-[#38B6FF]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#38B6FF] transition-colors duration-300">
                  <div className="text-[#38B6FF] group-hover:text-white transition-colors duration-300">
                    {getIcon(benefit.icon)}
                  </div>
                </div>

                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  {benefit.title}
                </h3>

                <p className="leading-relaxed text-gray-600">
                  {benefit.highlight
                    ? benefit.description
                        .split(benefit.highlight)
                        .map((part, i, arr) => (
                          <span key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <span className="font-semibold text-[#38B6FF]">
                                {benefit.highlight}
                              </span>
                            )}
                          </span>
                        ))
                    : benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl px-6 mx-auto">
          {/* Header */}
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {t.remoteworksection.whatWeOffer.title.prefix}{" "}
              <span className="text-[#38B6FF]">
                {t.remoteworksection.whatWeOffer.title.highlight}
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t.remoteworksection.whatWeOffer.description}
            </p>
          </div>

          {/* Services */}
          <div className="space-y-8">
            {t.remoteworksection.whatWeOffer.services.map((service, index) => (
              <div
                key={index}
                className={`group flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className="space-y-6 lg:w-1/2">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#38B6FF] rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="text-white">
                        {getIcon(service.icon, "w-7 h-7")}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-lg leading-relaxed text-gray-600">
                    {service.highlight
                      ? service.description
                          .split(service.highlight)
                          .map((part, i, arr) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className="font-semibold text-[#38B6FF]">
                                  {service.highlight}
                                </span>
                              )}
                            </span>
                          ))
                      : service.description}
                  </p>
                </div>

                {/* Visual */}
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="w-full h-80 bg-gradient-to-br from-[#38B6FF]/20 to-blue-100 rounded-3xl p-8">
                      <div className="flex items-center justify-center h-full p-6 bg-white shadow-xl rounded-2xl">
                        <div className="space-y-4 text-center">
                          <div className="w-20 h-20 bg-[#38B6FF]/10 rounded-full flex items-center justify-center mx-auto">
                            <div className="text-[#38B6FF]">
                              {getIcon(service.icon, "w-7 h-7")}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="w-32 h-3 mx-auto bg-gray-100 rounded-full"></div>
                            <div className="w-24 h-3 mx-auto bg-gray-100 rounded-full"></div>
                            <div className="h-3 bg-[#38B6FF] rounded-full w-28 mx-auto"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-[#38B6FF] to-blue-500 rounded-full p-1">
              <a href="/contact-us">
                <button className="bg-white text-[#38B6FF] px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {t.remoteworksection.whatWeOffer.cta}
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RemoteWorkSection1;
