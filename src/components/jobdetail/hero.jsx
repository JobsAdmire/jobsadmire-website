import React from "react";
import { useTranslation } from "next-i18next";
import {
  Briefcase,
  Calendar,
  Star,
  Award,
  MessageSquare,
  FileText,
  ExternalLink,
  User,
  Search,
  Clock,
  MapPin,
  Globe,
  Building,
  DollarSign,
  Users,
  CheckCircle,
  Share2,
} from "lucide-react";

const JobDescriptionHero = () => {
  const { t } = useTranslation("job-detail");
  return (
    <div className="relative w-full overflow-hidden font-sans bg-white pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]">
      {/* Grid Lines Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
               linear-gradient(to right, rgba(186, 230, 253, 0.4) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(186, 230, 253, 0.4) 1px, transparent 1px)
             `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0",
        }}
      ></div>

      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-sky-50 opacity-70"></div>

      {/* Abstract Shapes */}
      <div className="absolute w-64 h-64 rounded-full opacity-50 bg-sky-100 -top-20 -right-20 blur-3xl"></div>
      <div className="absolute bg-blue-100 rounded-full opacity-50 -bottom-40 -left-20 w-80 h-80 blur-3xl"></div>

      {/* Hero Section */}
      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-16 md:grid-cols-2">
          {/* Left Column */}
          <div className="relative">
            {/* Animated Highlight Element */}
            <div className="absolute w-20 h-20 border-t-2 border-l-2 border-sky-400 -left-4 -top-4 opacity-60 animate-pulse"></div>

            <div className="inline-flex items-center px-3 py-1 mb-6 bg-white border rounded-full shadow-md border-sky-100">
              <div className="flex items-center justify-center w-5 h-5 mr-2 text-xs text-white rounded-full bg-gradient-to-r from-sky-500 to-sky-600">
                <Briefcase size={12} />
              </div>
              <span className="text-sm font-medium text-sky-600">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-800">
              {t("hero.titleLine1")} <br />
              <span className="relative">
                {t("hero.titleLine2")}
                <span className="absolute left-0 w-full h-2 bg-sky-100 bottom-1 -z-10"></span>
              </span>{" "}
              at <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-500">
                {t("hero.companyName")}
              </span>
            </h1>

            <p className="mb-8 text-lg text-gray-600">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col gap-4 mb-10 sm:flex-row">
              <button className="relative px-8 py-4 overflow-hidden font-medium text-white transition duration-300 transform rounded-lg bg-gradient-to-r from-sky-600 to-blue-500 hover:shadow-xl hover:-translate-y-1 group">
                <span className="absolute top-0 left-0 w-full h-full transition-opacity bg-white opacity-0 group-hover:opacity-20"></span>
                {t("hero.ctaPrimary")}
              </button>
              <button className="flex items-center justify-center px-8 py-4 font-medium transition duration-300 transform bg-white border rounded-lg text-sky-600 border-sky-200 hover:border-sky-300 hover:shadow-lg hover:-translate-y-1 group">
                <Share2 className="w-4 h-4 mr-2" />
                {t("hero.ctaShare")}
                <span className="absolute inset-0 transition-opacity rounded-lg opacity-0 bg-sky-50 group-hover:opacity-30"></span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-sky-600">125K</div>
                <div className="text-sm text-gray-600">{t("hero.salaryRange")}</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-sky-600">{t("hero.locationStatValue")}</div>
                <div className="text-sm text-gray-600">{t("hero.location")}</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-sky-600">5+ yrs</div>
                <div className="text-sm text-gray-600">{t("hero.experience")}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Job Description Preview */}
          <div className="relative">
            {/* Animated bg elements */}
            <div className="absolute w-16 h-16 border-2 border-dashed rounded-full border-sky-200 top-1/3 -right-8 animate-spin-slow"></div>
            <div className="absolute w-24 h-24 border-2 border-blue-200 border-dashed rounded-full bottom-1/3 -left-12 animate-spin-slow"></div>

            {/* Glowing accent behind card */}
            <div className="absolute w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 top-1/2 left-1/2 h-3/4 opacity-5 blur-3xl"></div>

            {/* Card with "floating" effect */}
            <div className="relative z-10 transition-all duration-700 transform bg-white shadow-xl rounded-xl hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-50 to-blue-50 opacity-30 rounded-xl"></div>

              {/* Card header with tabs */}
              <div className="flex items-center p-4 border-b border-gray-100">
                <div className="flex mr-4 space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex border-b border-transparent">
                  <div className="px-4 py-2 text-sm font-medium border-b-2 text-sky-600 border-sky-500">
                    {t("hero.tabOverview")}
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-500">
                    {t("hero.tabRequirements")}
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-500">
                    {t("hero.tabBenefits")}
                  </div>
                </div>
                <div className="flex ml-auto space-x-2">
                  <button className="p-1 text-gray-500 hover:text-sky-500">
                    <Building className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-sky-500">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-sky-500">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Company and Role Info */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-12 h-12 mr-4 text-white rounded-lg bg-gradient-to-r from-sky-500 to-blue-500">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-800">
                      {t("hero.companyName")}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-3 h-3 mr-1" />
                      {t("hero.industry")}
                      <span className="mx-2">•</span>
                      <MapPin className="w-3 h-3 mr-1" />
                      {t("hero.locationValue")}
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <div className="p-2 mr-3 rounded-lg text-sky-500 bg-sky-50">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        {t("hero.salaryLabel")}
                      </div>
                      <div className="text-gray-800">115,000 - 135,000</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 mr-3 rounded-lg text-sky-500 bg-sky-50">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        {t("hero.teamSizeLabel")}
                      </div>
                      <div className="text-gray-800">{t("hero.teamSizeValue")}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 mr-3 rounded-lg text-sky-500 bg-sky-50">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        {t("hero.employmentLabel")}
                      </div>
                      <div className="text-gray-800">{t("hero.employmentValue")}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 mr-3 rounded-lg text-sky-500 bg-sky-50">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        {t("hero.postedLabel")}
                      </div>
                      <div className="text-gray-800">{t("hero.postedValue")}</div>
                    </div>
                  </div>
                </div>

                {/* Skills Required */}
                <div className="mb-6">
                  <div className="mb-3 text-sm font-semibold text-gray-600">
                    {t("hero.requiredSkills")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-sm rounded-full text-sky-700 bg-sky-100">
                      React
                    </span>
                    <span className="px-3 py-1 text-sm rounded-full text-sky-700 bg-sky-100">
                      Node.js
                    </span>
                    <span className="px-3 py-1 text-sm rounded-full text-sky-700 bg-sky-100">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 text-sm rounded-full text-sky-700 bg-sky-100">
                      AWS
                    </span>
                    <span className="px-3 py-1 text-sm rounded-full text-sky-700 bg-sky-100">
                      GraphQL
                    </span>
                  </div>
                </div>

                {/* Apply Now Button */}
                <div className="p-4 mt-6 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-800">
                      {t("hero.readyToJoin")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {t("hero.applicationTime")}
                    </div>
                  </div>
                  <button className="w-full px-4 py-3 text-sm font-medium text-white transition duration-300 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600">
                    {t("hero.ctaPrimary")}
                  </button>
                </div>
              </div>
            </div>

            {/* Floating UI Elements */}
            <div className="absolute p-3 bg-white rounded-full shadow-lg -left-4 top-1/4">
              <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-gradient-to-r from-sky-500 to-sky-400">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>

            <div className="absolute right-0 p-3 bg-white rounded-full shadow-lg bottom-1/3">
              <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-gradient-to-r from-blue-400 to-blue-300">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>

            <div className="absolute right-0 p-3 rounded-full shadow-lg top-10 bg-gradient-to-r from-sky-500 to-sky-400">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute w-6 h-6 rounded-full bg-sky-200 top-20 right-1/3 animate-pulse"></div>
      <div className="absolute w-4 h-4 bg-blue-200 rounded-full bottom-32 left-1/4 animate-pulse"></div>
      <div className="absolute w-3 h-3 rounded-full bg-sky-300 top-1/3 right-1/4 animate-pulse"></div>

      {/* SVG Wave Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 text-sky-50"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,144.82,141.79,213.93,120.18,229.9,100.91,287.13,67,321.39,56.44Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default JobDescriptionHero;
