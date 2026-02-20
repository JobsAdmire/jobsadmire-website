import React from "react";
import { useRouter } from "next/router";
import {
  Lightbulb,
  Award,
  BrainCircuit,
  Compass,
  HeartHandshake,
  User,
  UserCircle,
  Users,
  Star,
  Sparkles,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/careercounselling.json";
import trTranslations from "../../../public/locales/tr/careercounselling.json";
import arTranslations from "../../../public/locales/ar/careercounselling.json";
import frTranslations from "../../../public/locales/fr/careercounselling.json";
import deTranslations from "../../../public/locales/de/careercounselling.json";
import ruTranslations from "../../../public/locales/ru/careercounselling.json";
import faTranslations from "../../../public/locales/fa/careercounselling.json";
const CareerCounsellingSections = () => {
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "ar":
        return arTranslations;
      case "fa":
        return faTranslations;
      case "fr":
        return frTranslations;
      case "ru":
        return ruTranslations;
      case "de":
        return deTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  return (
    <div className="font-sans bg-gradient-to-b from-white to-sky-50">
      {/* Why do you need career counselling section */}
      <section className="px-4 py-16 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-50 -z-10 bg-sky-100 blur-3xl"></div>
          <div className="absolute w-48 h-48 bg-blue-100 rounded-full opacity-50 -z-10 bottom-10 left-10 blur-2xl"></div>

          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h2 className="relative inline-block mb-8 text-3xl font-bold text-gray-800 md:text-4xl">
                {t.careercounselling.whyNeed.title.prefix}{" "}
                <span className="text-[#38B6FF]">
                  {t.careercounselling.whyNeed.title.highlight}
                </span>
                <div className="absolute w-full h-3 bg-sky-100 bottom-1 -z-10"></div>
              </h2>

              <p className="mb-8 text-gray-700">
                {t.careercounselling.whyNeed.description}
              </p>

              <div className="space-y-6">
                {t.careercounselling.whyNeed.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-white rounded-lg shadow-md bg-gradient-to-br from-[#38B6FF] to-[#38B6FF]">
                      {index === 0 && <Award className="w-6 h-6" />}
                      {index === 1 && <BrainCircuit className="w-6 h-6" />}
                      {index === 2 && <Compass className="w-6 h-6" />}
                      {index === 3 && <HeartHandshake className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-800">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              {/* Enhanced image container with multiple decorative elements */}
              <div className="relative group">
                {/* Main image container */}
                <div className="relative overflow-hidden shadow-2xl rounded-3xl ring-1 ring-sky-100 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl">
                  {/* Gradient overlay for better text visibility if needed */}
                  <div className="absolute inset-0 z-10 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/10 via-transparent to-transparent group-hover:opacity-100"></div>

                  {/* Career counselling image */}
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt={t.careercounselling.whyNeed.image.alt}
                    className="object-cover w-full h-[500px] transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl"></div>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute flex items-center justify-center w-16 h-16 text-white rounded-full shadow-xl -top-8 -right-8 bg-gradient-to-r from-[#38B6FF] to-blue-500 animate-pulse">
                  <Lightbulb className="w-8 h-8" />
                </div>

                <div className="absolute flex items-center justify-center w-12 h-12 text-white rounded-full shadow-lg -bottom-6 -left-6 bg-gradient-to-r from-green-400 to-green-500">
                  <Star className="w-6 h-6" />
                </div>

                <div className="absolute flex items-center justify-center w-10 h-10 text-white rounded-full shadow-md top-10 -left-5 bg-gradient-to-r from-purple-400 to-purple-500">
                  <Sparkles className="w-5 h-5" />
                </div>

                {/* Background decorative shapes */}
                <div className="absolute inset-0 -z-20">
                  <div className="absolute w-full h-full transform scale-105 bg-gradient-to-br from-sky-100/30 to-blue-100/30 rounded-3xl rotate-3"></div>
                  <div className="absolute w-full h-full transform scale-110 bg-gradient-to-tl from-indigo-100/20 to-cyan-100/20 rounded-3xl -rotate-2"></div>
                </div>

                {/* Animated floating dots */}
                <div
                  className="absolute top-1/4 -right-4 w-3 h-3 bg-[#38B6FF] rounded-full opacity-60 animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="absolute w-2 h-2 bg-green-400 rounded-full top-1/2 -left-3 opacity-60 animate-bounce"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute w-2 h-2 bg-purple-400 rounded-full bottom-1/4 -right-2 opacity-60 animate-bounce"
                  style={{ animationDelay: "2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is a Career Counselor section */}
      <section className="relative px-4 py-16 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        {/* Vertical line separator */}
        <div className="absolute top-0 w-px h-20 transform -translate-x-1/2 left-1/2 bg-gradient-to-b from-sky-100 to-[#38B6FF]"></div>

        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute bg-blue-100 rounded-full -z-10 top-40 left-10 w-72 h-72 opacity-40 blur-3xl"></div>

          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="relative inline-block mb-6 text-3xl font-bold text-gray-800 md:text-4xl">
              {t.careercounselling.whoCounselor.title.prefix}{" "}
              <span className="text-[#38B6FF]">
                {t.careercounselling.whoCounselor.title.highlight}
              </span>
              <div className="absolute w-full h-3 bg-sky-100 bottom-1 -z-10"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {t.careercounselling.whoCounselor.cards.map((card, index) => (
              <div
                key={index}
                className="relative p-8 overflow-hidden transition-all duration-300 bg-white border shadow-xl rounded-2xl hover:shadow-2xl border-sky-100 group"
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 to-white opacity-80"></div>
                <div
                  className={`absolute w-40 h-40 transition-all duration-300 rounded-full opacity-50 ${index === 0 ? "-right-20" : "-left-20"} -bottom-20 bg-sky-100 group-hover:opacity-70`}
                ></div>

                <div className="flex items-start gap-6">
                  <div className="flex items-center justify-center flex-shrink-0 text-white shadow-md w-14 h-14 rounded-xl bg-gradient-to-br from-[#38B6FF] to-[#38B6FF]">
                    {index === 0 ? (
                      <User className="h-7 w-7" />
                    ) : (
                      <UserCircle className="h-7 w-7" />
                    )}
                  </div>

                  <div className="relative">
                    <h3 className="mb-3 text-xl font-semibold text-gray-800">
                      {card.title}
                    </h3>
                    {card.paragraphs.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className={`text-gray-600 ${pIndex > 0 ? "mt-4" : ""}`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="/contact-us">
              <button className="px-8 py-4 font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] rounded-xl hover:shadow-xl hover:-translate-y-1 hover:from-[#2A9EE8] hover:to-[#2A9EE8]">
                {t.careercounselling.whoCounselor.cta.text}
              </button>
            </a>
          </div>

          {/* Testimonial */}
          <div className="relative p-8 mt-16 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl">
            <div className="absolute flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg -top-6 left-10">
              <Users className="w-6 h-6 text-[#38B6FF]" />
            </div>

            <div className="max-w-4xl mx-auto text-center">
              <p className="mb-6 text-lg italic text-gray-600">
                {t.careercounselling.whoCounselor.testimonial.quote}
              </p>
              <div className="font-semibold text-gray-800">
                {t.careercounselling.whoCounselor.testimonial.name}
              </div>
              <div className="text-sm text-[#38B6FF]">
                {t.careercounselling.whoCounselor.testimonial.title}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerCounsellingSections;
