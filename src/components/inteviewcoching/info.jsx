import React from "react";
import { useRouter } from "next/router";
import {
  CheckCircle,
  User,
  Award,
  ArrowRight,
  MessageCircle,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";

// Import your translation files
import enTranslations from "../../../public/locales/en/interview.json";
import trTranslations from "../../../public/locales/tr/interview.json";
import arTranslations from "../../../public/locales/ar/interview.json";
import frTranslations from "../../../public/locales/fr/interview.json";
import deTranslations from "../../../public/locales/de/interview.json";
import faTranslations from "../../../public/locales/fa/interview.json";
import ruTranslations from "../../../public/locales/ru/interview.json";

const ServiceRightForYouSection = () => {
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "ar":
        return arTranslations;
      case "ar":
        return ruTranslations;
      case "fr":
        return frTranslations;
      case "fa":
        return faTranslations;
      case "de":
        return deTranslations;
      case "ru":
        return ruTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  // Icon mapping for benefits
  const benefitIconMap = {
    messageCircle: <MessageCircle className="w-5 h-5 text-blue-600" />,
    user: <User className="w-5 h-5 text-blue-600" />,
    trendingUp: <TrendingUp className="w-5 h-5 text-blue-600" />,
  };

  return (
    <div className="py-20 bg-gradient-to-b from-blue-100 to-white">
      <div className="container max-w-7xl px-4 mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-800">
            <span className="relative inline-block">
              {t.interview.serviceSection.header.title}
              <span className="absolute left-0 w-full h-3 bottom-1 bg-blue-200 -z-10"></span>
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            {t.interview.serviceSection.header.description}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Two equal cards */}
          <div className="grid gap-8">
            {/* Success Story Card */}
            <div className="relative p-8 overflow-hidden bg-white shadow-xl h-[350px] rounded-2xl">
              {/* Background Pattern */}
              <div className="absolute top-0 left-0 w-full h-full opacity-5">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <pattern
                    id="grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-lg font-medium text-gray-700">
                    {t.interview.serviceSection.successStory.label}
                  </p>
                  <div className="px-3 py-1 text-xs font-medium text-white rounded-full bg-blue-500">
                    {t.interview.serviceSection.successStory.badge}
                  </div>
                </div>

                <div className="flex flex-col mb-4 sm:flex-row sm:items-center sm:space-x-6">
                  {/* SVG Illustration instead of photo */}
                  <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 mx-auto mb-4 rounded-full sm:mb-0 sm:mx-0 bg-blue-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 100 100"
                      className="w-12 h-12"
                    >
                      <circle
                        cx="50"
                        cy="35"
                        r="20"
                        fill="#38B6FF"
                        opacity="0.8"
                      />
                      <path
                        d="M15,85 Q50,65 85,85 L85,100 L15,100 Z"
                        fill="#38B6FF"
                        opacity="0.8"
                      />
                      <path
                        d="M35,40 Q50,50 65,40"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="40" cy="30" r="3" fill="#FFFFFF" />
                      <circle cx="60" cy="30" r="3" fill="#FFFFFF" />
                    </svg>
                  </div>

                  <div className="text-center sm:text-left">
                    <h3 className="mb-1 text-xl font-bold text-gray-800">
                      {t.interview.serviceSection.successStory.client.name}
                    </h3>
                    <p className="mb-2 text-sm text-gray-600">
                      {t.interview.serviceSection.successStory.client.position}
                    </p>
                    <div className="flex items-center justify-center space-x-1 sm:justify-start">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-grow p-4 mb-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-700">
                    {t.interview.serviceSection.successStory.testimonial}
                  </p>
                </div>

                <div className="flex justify-center mt-auto">
                  <button className="flex items-center px-4 py-2 text-sm font-medium transition-all duration-300 bg-white border-2 rounded-full text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                    {t.interview.serviceSection.successStory.readMore}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-30 bg-blue-400 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 opacity-20 bg-blue-300 rounded-tr-2xl"></div>
            </div>

            {/* Testimonial Card */}
            <div className="p-8 shadow-xl bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl h-[350px] flex flex-col justify-between">
              <div className="relative">
                <div className="absolute -top-6 -left-6 text-blue-300 opacity-30">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.7744 27.1704H1.8186V19.4464C1.8186 16.2445 2.36238 13.6242 3.44995 11.5855C4.53752 9.49542 6.53516 7.45708 9.44286 5.47046L13.958 9.27469C11.9232 10.6466 10.6013 11.9456 9.99221 13.1716C9.3831 14.3977 9.0786 15.6781 9.0786 17.0128H15.2896V27.1704H10.7744ZM29.6205 27.1704H20.6647V19.4464C20.6647 16.2445 21.2085 13.6242 22.2961 11.5855C23.3836 9.49542 25.3813 7.45708 28.289 5.47046L32.8041 9.27469C30.7693 10.6466 29.4474 11.9456 28.8383 13.1716C28.2292 14.3977 27.9247 15.6781 27.9247 17.0128H34.1357V27.1704H29.6205Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 text-sm font-medium text-blue-100">
                    {t.interview.serviceSection.testimonial.label}
                  </h4>
                  <p className="text-lg font-medium text-white">
                    {t.interview.serviceSection.testimonial.quote}
                  </p>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 100 100"
                      className="w-8 h-8"
                    >
                      <circle
                        cx="50"
                        cy="35"
                        r="20"
                        fill="#FFFFFF"
                        opacity="0.8"
                      />
                      <path
                        d="M15,85 Q50,65 85,85 L85,100 L15,100 Z"
                        fill="#FFFFFF"
                        opacity="0.8"
                      />
                      <path
                        d="M35,40 Q50,50 65,40"
                        fill="none"
                        stroke="#38B6FF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="40" cy="30" r="3" fill="#38B6FF" />
                      <circle cx="60" cy="30" r="3" fill="#38B6FF" />
                    </svg>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {t.interview.serviceSection.testimonial.client.name}
                    </h4>
                    <p className="text-sm text-blue-100">
                      {t.interview.serviceSection.testimonial.client.position}
                    </p>
                  </div>
                </div>

                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-yellow-300 fill-yellow-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Two equal cards */}
          <div className="grid gap-8">
            {/* Questions Card */}
            <div className="p-8 bg-white shadow-xl rounded-2xl h-[350px] flex flex-col">
              <h3 className="mb-6 text-xl font-bold text-gray-800">
                {t.interview.serviceSection.questions.title}
              </h3>

              <div className="mb-auto space-y-4">
                {t.interview.serviceSection.questions.items.map(
                  (question, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-500">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <p className="ml-4 text-gray-700">{question}</p>
                    </div>
                  )
                )}
              </div>

              <div className="p-4 mt-4 text-base font-medium text-blue-800 bg-blue-50 rounded-xl">
                {t.interview.serviceSection.questions.conclusion}
              </div>
            </div>

            {/* Benefits Card */}
            <div className="p-8 bg-white shadow-xl rounded-2xl h-[350px] flex flex-col">
              <h3 className="mb-6 text-xl font-bold text-gray-800">
                {t.interview.serviceSection.benefits.title}
              </h3>

              <div className="flex-grow space-y-4">
                {t.interview.serviceSection.benefits.items.map(
                  (benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mt-1 rounded-full bg-blue-100">
                        {benefitIconMap[benefit.iconKey]}
                      </div>
                      <p className="ml-4 text-gray-700">{benefit.text}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <a href="/contact-us">
            <button className="px-8 py-4 text-lg font-medium text-white transition-all duration-300 rounded-lg shadow-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-blue-200 hover:-translate-y-1">
              {t.interview.serviceSection.cta.text}
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceRightForYouSection;
