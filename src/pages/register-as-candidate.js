import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import {
  Eye,
  EyeOff,
  Upload,
  User,
  Mail,
  Phone,
  Briefcase,
  Globe,
  Lock,
  GraduationCap,
  Clock,
  FileText,
  Check,
  Sparkles,
} from "lucide-react";
import { COUNTRIES_LIST } from "@/lib/utils/countries";
import { env } from "@/lib/constants/env";

export default function CandidateRegistrationForm() {
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    preferredCountry: "",
    resume: null,
    password: "",
    confirmPassword: "",
    qualification: "",
    experience: "",
    agreeTerms: false,
    needVisaHelp: false,
    profileSummary: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState({
    title: "",
    message: "",
    type: "",
  });

  const countries = COUNTRIES_LIST;

  const showCustomMessageBox = (title, message, type) => {
    setMessageBoxContent({ title, message, type });
    setShowMessageBox(true);
  };

  const hideCustomMessageBox = () => {
    setShowMessageBox(false);
    setMessageBoxContent({ title: "", message: "", type: "" });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = (file) => {
    if (
      file &&
      (file.type === "application/pdf" || file.type.includes("document"))
    ) {
      setFormData((prev) => ({ ...prev, resume: file }));
    } else {
      showCustomMessageBox(
        t("labels.registerCandidate.fileTypeError"),
        t("labels.registerCandidate.fileTypeErrorMessage"),
        "error"
      );
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    showCustomMessageBox(
      "Success!",
      "Registration submitted successfully!",
      "success"
    );
    router.push("/thankyou");
  };

  const handleGenerateSummary = async () => {
    if (!formData.jobTitle) {
      showCustomMessageBox(
        "Input Required",
        'Please enter a "Desired Job Title" to generate a summary.',
        "warning"
      );
      return;
    }

    setIsGenerating(true);

    try {
      let chatHistory = [];
      const prompt = `Given the desired job title '${formData.jobTitle}' and '${formData.experience || "no"}' years of experience, suggest a concise (2-3 sentences) professional profile summary or an enhanced, impactful job title. Focus on highlighting key skills and career aspirations.`;
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = { contents: chatHistory };
      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        showCustomMessageBox(
          "Configuration Error",
          "Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY.",
          "error"
        );
        setIsGenerating(false);
        return;
      }
      const baseUrl = env.GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta";
      const apiUrl = `${baseUrl}/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0].text;
        setFormData((prev) => ({ ...prev, profileSummary: text }));
        showCustomMessageBox(
          "Profile Summary Generated",
          "The suggested profile summary has been added to the form. You can review and edit it.",
          "info"
        );
      } else {
        showCustomMessageBox(
          t("labels.registerCandidate.generationFailed"),
          t("labels.registerCandidate.generationFailedMessage"),
          "error"
        );
        console.error("Gemini API response structure unexpected:", result);
      }
    } catch (error) {
      showCustomMessageBox(
        t("labels.registerCandidate.apiError"),
        t("labels.registerCandidate.apiErrorMessage"),
        "error"
      );
      console.error("Error calling Gemini API:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("labels.registerCandidate.title")}
          </h1>
          <p className="text-gray-600">
            {t("labels.registerCandidate.subtitle")}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <form className="p-8" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("labels.registerCandidate.personalInformation")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labels.registerCandidate.fullName")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={t("labels.registerCandidate.placeholderFullName")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labels.registerCandidate.emailAddress")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={t("labels.registerCandidate.placeholderEmail")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labels.registerCandidate.phoneNumber")}{" "}
                    <span className="text-gray-400">{t("labels.registerCandidate.optional")}</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={t("labels.registerCandidate.placeholderPhone")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labels.registerCandidate.preferredCountry")}
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <select
                      name="preferredCountry"
                      value={formData.preferredCountry}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                    >
                      <option value="">{t("labels.registerCandidate.selectCountry")}</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("labels.registerCandidate.jobInformation")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labels.registerCandidate.desiredJobTitle")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder={t("labels.registerCandidate.placeholderJobTitle")}
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t("labels.registerCandidate.generating")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {t("labels.registerCandidate.generateProfileSummary")}
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("labels.registerCandidate.profileSummary")}
                </label>
                <textarea
                  name="profileSummary"
                  value={formData.profileSummary}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={t("labels.registerCandidate.placeholderProfileSummary")}
                />
              </div>
            </div>

            {/* Account Security Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("labels.registerCandidate.accountSecurity")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labels.registerCandidate.password")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={t("labels.registerCandidate.placeholderPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
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
                    {t("labels.registerCandidate.confirmPassword")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={t("labels.registerCandidate.placeholderConfirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
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

            {/* Resume Upload Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("labels.registerCandidate.resumeUpload")}
                </h2>
              </div>

              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                } hover:border-blue-400 hover:bg-blue-50 cursor-pointer`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {formData.resume ? (
                    <span className="text-green-600 flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" /> {formData.resume.name}{" "}
                      {t("labels.registerCandidate.resumeUploadedSuccess")}
                    </span>
                  ) : (
                    t("labels.registerCandidate.dragDropResume")
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {t("labels.registerCandidate.pdfDocOnly")}
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    e.target.files[0] && handleFileUpload(e.target.files[0])
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Optional Information Section */}
            <div className="mb-8">
              <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t("labels.registerCandidate.optionalInformation")}
                  </h2>
                </div>
                <div
                  className={`transform transition-transform ${showOptional ? "rotate-180" : ""}`}
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {showOptional && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("labels.registerCandidate.highestQualification")}
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <select
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                        >
                          <option value="">{t("labels.registerCandidate.selectQualification")}</option>
                          <option value="high-school">{t("labels.registerCandidate.highSchool")}</option>
                          <option value="bachelors">{t("labels.registerCandidate.bachelors")}</option>
                          <option value="masters">{t("labels.registerCandidate.masters")}</option>
                          <option value="phd">{t("labels.registerCandidate.phd")}</option>
                          <option value="other">{t("labels.registerCandidate.other")}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("labels.registerCandidate.yearsOfExperience")}
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                        >
                          <option value="">{t("labels.registerCandidate.selectExperience")}</option>
                          <option value="0-1">{t("labels.registerCandidate.experience0_1")}</option>
                          <option value="2-5">{t("labels.registerCandidate.experience2_5")}</option>
                          <option value="6-10">{t("labels.registerCandidate.experience6_10")}</option>
                          <option value="11-15">{t("labels.registerCandidate.experience11_15")}</option>
                          <option value="15+">{t("labels.registerCandidate.experience15Plus")}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Preferences */}
            <div className="mb-8 space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <label className="text-sm text-gray-700">
                  {t("labels.registerCandidate.agreeTerms")}{" "}
                  <span className="text-blue-600 hover:underline font-medium cursor-pointer">
                    {t("labels.registerCandidate.termsAndConditions")}
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="needVisaHelp"
                    checked={formData.needVisaHelp}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <label className="text-sm text-gray-700">
                  {t("labels.registerCandidate.needVisaHelp")}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t("labels.registerCandidate.submitButton")}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600">
          {t("labels.registerCandidate.alreadyHaveAccount")}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium ml-1"
          >
            {t("labels.registerCandidate.signInHere")}
          </a>
        </div>
      </div>

      {/* Message Box Modal */}
      {showMessageBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <h3
                className={`text-lg font-semibold mb-3 ${
                  messageBoxContent.type === "success"
                    ? "text-green-600"
                    : messageBoxContent.type === "error"
                      ? "text-red-600"
                      : messageBoxContent.type === "warning"
                        ? "text-orange-600"
                        : "text-blue-600"
                }`}
              >
                {messageBoxContent.title}
              </h3>
              <p className="text-gray-700 mb-6">{messageBoxContent.message}</p>
              <button
                onClick={hideCustomMessageBox}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  messageBoxContent.type === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : messageBoxContent.type === "error"
                      ? "bg-red-600 hover:bg-red-700"
                      : messageBoxContent.type === "warning"
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "bg-blue-600 hover:bg-blue-700"
                } transition-colors`}
              >
                {t("labels.registerCandidate.ok")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const getStaticProps = async ({ locale }) => {
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");
  const { getLayoutCmsProps } = require("@/lib/api/cmsHelper");
  const { getPageAndLayoutContent } = require("@/lib/api/cmsContent");

  const [layoutProps, cmsPageContent] = await Promise.all([
    getLayoutCmsProps(locale),
    getPageAndLayoutContent("register-as-candidate", locale),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      ...layoutProps,
      cmsPageContent,
    },
    revalidate: 60,
  };
};
