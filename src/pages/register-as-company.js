import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { showSuccess } from "@/lib/utils/toast";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  Briefcase,
  Upload,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const INDUSTRY_KEYS = {
  Technology: "industryTechnology",
  Healthcare: "industryHealthcare",
  Finance: "industryFinance",
  Education: "industryEducation",
  Manufacturing: "industryManufacturing",
  Retail: "industryRetail",
  Construction: "industryConstruction",
  Transportation: "industryTransportation",
  Energy: "industryEnergy",
  Other: "industryOther",
};
const JOB_TYPE_KEYS = {
  "Full-time": "fullTime",
  "Part-time": "partTime",
  Contract: "contract",
  Remote: "remote",
  Internship: "internship",
};

export default function CompanyRegistrationForm() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    phoneNumber: "",
    websiteUrl: "",
    industrySector: "",
    companySize: "",
    country: "",
    city: "",
    fullAddress: "",
    hrFullName: "",
    hrPosition: "",
    hrEmail: "",
    hrPhone: "",
    jobCategories: "",
    preferredNationalities: "",
    jobTypes: [],
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJobTypeChange = (jobType) => {
    setFormData((prev) => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(jobType)
        ? prev.jobTypes.filter((type) => type !== jobType)
        : [...prev.jobTypes, jobType],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    showSuccess("Registration form submitted successfully!");
    router.push("/thankyou");
  };

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Transportation",
    "Energy",
    "Other",
  ];

  const jobTypeOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Remote",
    "Internship",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 px-4 pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sky-100 rounded-full mb-6">
            <Building2 className="w-10 h-10 text-sky-600" />
          </div>
          <h1 className="text-4xl font-bold text-sky-600 mb-4">
            {t("labels.registerCompany.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our platform to connect with top talent and grow your team with
            qualified professionals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100 p-8">
            <div className="flex items-center mb-6">
              <Building2 className="w-6 h-6 text-sky-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Company Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.companyName")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder={t("labels.registerCompany.placeholderCompanyName")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.companyEmail")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder={t("labels.registerCompany.placeholderEmail")}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.phoneNumber")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder={t("labels.registerCompany.placeholderPhone")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.websiteUrl")}
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder={t("labels.registerCompany.placeholderWebsite")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.industrySector")}
                </label>
                <select
                  name="industrySector"
                  value={formData.industrySector}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                >
                  <option value="">{t("labels.registerCompany.selectIndustry")}</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {t(`labels.registerCompany.${INDUSTRY_KEYS[industry]}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.companySize")}
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                >
                  <option value="">{t("labels.registerCompany.selectCompanySize")}</option>
                  <option value="1-10">{t("labels.registerCompany.employees1_10")}</option>
                  <option value="11-50">{t("labels.registerCompany.employees11_50")}</option>
                  <option value="51-200">{t("labels.registerCompany.employees51_200")}</option>
                  <option value="201+">{t("labels.registerCompany.employees201Plus")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Company Address */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100 p-8">
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 text-sky-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("labels.registerCompany.companyAddress")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.country")}
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder={t("labels.registerCompany.placeholderCountry")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.city")}
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder={t("labels.registerCompany.placeholderCity")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.fullAddress")}
                </label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50 resize-none"
                  placeholder={t("labels.registerCompany.placeholderAddress")}
                />
              </div>
            </div>
          </div>

          {/* HR Contact Person */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100 p-8">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-sky-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("labels.registerCompany.hrContactPerson")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.fullName")}
                </label>
                <input
                  type="text"
                  name="hrFullName"
                  value={formData.hrFullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder={t("labels.registerCompany.placeholderFullName")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.position")}
                </label>
                <input
                  type="text"
                  name="hrPosition"
                  value={formData.hrPosition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder={t("labels.registerCompany.placeholderPosition")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.emailAddress")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="hrEmail"
                    value={formData.hrEmail}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder={t("labels.registerCompany.placeholderHrEmail")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.phoneNumber")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="hrPhone"
                    value={formData.hrPhone}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder={t("labels.registerCompany.placeholderPhone")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recruitment Preferences */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100 p-8">
            <div className="flex items-center mb-6">
              <Briefcase className="w-6 h-6 text-sky-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("labels.registerCompany.recruitmentPreferences")}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.jobCategoriesHiring")}
                </label>
                <textarea
                  name="jobCategories"
                  value={formData.jobCategories}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50 resize-none"
                  placeholder={t("labels.registerCompany.placeholderJobCategories")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.preferredNationalities")}
                </label>
                <input
                  type="text"
                  name="preferredNationalities"
                  value={formData.preferredNationalities}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder={t("labels.registerCompany.placeholderNationalities")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t("labels.registerCompany.jobTypesOffered")}
                </label>
                <div className="flex flex-wrap gap-3">
                  {jobTypeOptions.map((jobType) => (
                    <label key={jobType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.jobTypes.includes(jobType)}
                        onChange={() => handleJobTypeChange(jobType)}
                        className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 bg-sky-50 px-3 py-2 rounded-full">
                        {t(`labels.registerCompany.${JOB_TYPE_KEYS[jobType]}`)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Documents Upload */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100 p-8">
            <div className="flex items-center mb-6">
              <Upload className="w-6 h-6 text-sky-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("labels.registerCompany.documentsUpload")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.companyRegistrationDocument")}
                  <span className="text-sky-600 text-xs ml-1">
                    {t("labels.registerCompany.optionalRecommended")}
                  </span>
                </label>
                <div className="border-2 border-dashed border-sky-300 rounded-lg p-6 text-center hover:border-sky-400 transition-colors duration-200 bg-sky-50/50">
                  <Upload className="w-8 h-8 text-sky-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {t("labels.registerCompany.clickToUpload")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("labels.registerCompany.pdfDocMax")}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.licenseIfAny")}
                </label>
                <div className="border-2 border-dashed border-sky-300 rounded-lg p-6 text-center hover:border-sky-400 transition-colors duration-200 bg-sky-50/50">
                  <Upload className="w-8 h-8 text-sky-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {t("labels.registerCompany.clickToUpload")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("labels.registerCompany.pdfDocMax")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100 p-8">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-sky-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("labels.registerCompany.accountInformation")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.username")}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder={t("labels.registerCompany.placeholderUsername")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder={t("labels.registerCompany.placeholderPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCompany.confirmPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder={t("labels.registerCompany.placeholderConfirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <Building2 className="w-5 h-5" />
              <span>{t("labels.registerCompany.submitButton")}</span>
            </button>
          </div>
        </form>
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
