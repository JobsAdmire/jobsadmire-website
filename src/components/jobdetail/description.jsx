import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation, Trans } from "next-i18next";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Send,
  FileText,
  Check,
  ChevronDown,
  Bookmark,
  Share2,
  Clock,
  Building,
  X,
  MessageSquare,
  Star,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { EMAIL_URL } from "@/lib/constants/app";
import { env } from "@/lib/constants/env";

const JobDescriptionPage = ({ job_id }) => {
  const router = useRouter();
  const { t } = useTranslation("job-detail");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
    resume: null,
    linkedin: "",
    portfolio: "",
  });

  const [activeTab, setActiveTab] = useState("description");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applicationProgress, setApplicationProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [jobDetailArr, setJobDetailArr] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch job data from API
  useEffect(() => {
    fetchJobs(job_id);
  }, [job_id]);

  const fetchJobs = async (id) => {
    setIsLoading(true);
    try {
      const url = `${env.CRM_API_URL}/api/get-job-detail?v=${Date.now()}&id=${id}`;
      console.log("Fetching job details from:", url);
      const response = await axios.get(url);
      console.log("API Response:", response.data);

      if (response.data && response.data.data) {
        setJobDetailArr(response.data.data);
      } else {
        console.error("Invalid API response structure:", response.data);
        // Fallback data in case API fails
        setJobDetailArr({
          title: t("fallback.title_not_available"),
          job_type: "Full Time",
          location: t("fallback.location_not_available"),
          description: t("fallback.description_not_available"),
          requirement: t("fallback.requirement_not_available"),
          salary_start: 0,
          salary_end: 0,
          currency: "USD",
          job_posted: t("fallback.date_not_available"),
          quotaIsFull: false,
        });
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      // Fallback data in case API fails
      setJobDetailArr({
        title: t("fallback.error_loading"),
        job_type: "Full Time",
        location: t("fallback.location_not_available"),
        description: t("fallback.unable_to_load_desc"),
        requirement: t("fallback.unable_to_load_req"),
        salary_start: 0,
        salary_end: 0,
        currency: "USD",
        job_posted: t("fallback.date_not_available"),
        quotaIsFull: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Track scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate form completion percentage
  useEffect(() => {
    const requiredFields = ["name", "email", "phone", "location"];
    const filledFields = requiredFields.filter(
      (field) => formData[field] !== ""
    ).length;
    const resumePoints = formData.resume ? 1 : 0;

    const progress = Math.floor(
      ((filledFields / requiredFields.length) * 0.8 + resumePoints * 0.2) * 100
    );
    setApplicationProgress(progress);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      resume: e.target.files[0],
    }));

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowApplicationModal(false);
    router.push("/thankyou");
  };

  const toggleSaved = () => {
    setSaved(!saved);
  };

  const processContent = (content) => {
    if (!content) return "";

    // Enhanced content processing with better styling
    let processedContent = content.replace(
      /<p>/g,
      '<p class="mb-6 text-gray-700 leading-relaxed text-base">'
    );
    processedContent = processedContent.replace(
      /<ul>/g,
      '<ul class="mb-6 space-y-3">'
    );
    processedContent = processedContent.replace(
      /<ol>/g,
      '<ol class="mb-6 space-y-3">'
    );
    processedContent = processedContent.replace(
      /<strong>/g,
      '<strong class="font-bold text-gray-900">'
    );
    processedContent = processedContent.replace(
      /<b>/g,
      '<strong class="font-bold text-gray-900">'
    );

    // Style list items with custom bullets
    processedContent = processedContent.replace(
      /<li>/g,
      '<li class="flex items-start mb-2"><span class="inline-flex items-center justify-center w-2 h-2 bg-sky-500 rounded-full mt-2 me-3 flex-shrink-0"></span><span class="text-gray-700">'
    );
    processedContent = processedContent.replace(/<\/li>/g, "</span></li>");

    // Add headers styling
    processedContent = processedContent.replace(
      /<h1>/g,
      '<h1 class="text-3xl font-bold text-gray-900 mb-6">'
    );
    processedContent = processedContent.replace(
      /<h2>/g,
      '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">'
    );
    processedContent = processedContent.replace(
      /<h3>/g,
      '<h3 class="text-xl font-semibold text-gray-800 mb-3 mt-6">'
    );
    processedContent = processedContent.replace(
      /<h4>/g,
      '<h4 class="text-lg font-semibold text-gray-800 mb-2 mt-4">'
    );

    return processedContent;
  };

  // New function to parse and structure plain text job descriptions
  const structureJobDescription = (content) => {
    if (!content) return "";

    // If content has HTML tags, use processContent
    if (content.includes("<") && content.includes(">")) {
      return processContent(content);
    }

    // Process plain text and structure it
    const lines = content.split("\n").filter((line) => line.trim() !== "");
    let structuredContent = "";

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Check if line is a header (ends with colon or contains specific keywords)
      if (
        trimmedLine.endsWith(":") ||
        trimmedLine.toLowerCase().includes("job title") ||
        trimmedLine.toLowerCase().includes("location") ||
        trimmedLine.toLowerCase().includes("department") ||
        trimmedLine.toLowerCase().includes("reports to") ||
        trimmedLine.toLowerCase().includes("type") ||
        trimmedLine.toLowerCase().includes("job summary") ||
        trimmedLine.toLowerCase().includes("key responsibilities") ||
        trimmedLine.toLowerCase().includes("requirements") ||
        trimmedLine.toLowerCase().includes("qualifications")
      ) {
        structuredContent += `<h3 class="text-lg font-bold text-sky-800 mb-3 mt-6 border-b border-sky-200 pb-2">${trimmedLine}</h3>`;
      }
      // Check if line starts with bullet point indicators
      else if (trimmedLine.match(/^[-•*]/)) {
        if (!structuredContent.includes('<ul class="mb-6 space-y-3">')) {
          structuredContent += '<ul class="mb-6 space-y-3">';
        }
        const cleanLine = trimmedLine.replace(/^[-•*]\s*/, "");
        structuredContent += `<li class="flex items-start mb-2"><span class="inline-flex items-center justify-center w-2 h-2 bg-sky-500 rounded-full mt-2 me-3 flex-shrink-0"></span><span class="text-gray-700">${cleanLine}</span></li>`;
      }
      // Regular paragraph
      else if (trimmedLine.length > 0) {
        // Close any open list
        if (
          structuredContent.includes('<ul class="mb-6 space-y-3">') &&
          !structuredContent.includes("</ul>")
        ) {
          structuredContent += "</ul>";
        }
        structuredContent += `<p class="mb-4 text-gray-700 leading-relaxed">${trimmedLine}</p>`;
      }
    });

    // Close any remaining open list
    if (
      structuredContent.includes('<ul class="mb-6 space-y-3">') &&
      !structuredContent.includes("</ul>")
    ) {
      structuredContent += "</ul>";
    }

    return structuredContent;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-6">
            {/* Enhanced Job Description Display */}
            <div className="p-6 border rounded-lg bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 me-3 rounded-full bg-sky-500">
                  <FileText size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-sky-800">
                  {t("tab_content.description.overview")}
                </h2>
              </div>
              <div className="prose prose-sky max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: structureJobDescription(jobDetailArr.description),
                  }}
                />
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <Clock size={18} className="me-2 text-sky-500" />
                  <h3 className="font-semibold text-gray-800">
                    {t("tab_content.description.employment_type")}
                  </h3>
                </div>
                <p className="text-gray-600">{jobDetailArr.job_type}</p>
              </div>

              <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center mb-3">
                  <MapPin size={18} className="me-2 text-sky-500" />
                  <h3 className="font-semibold text-gray-800">
                    {t("tab_content.description.work_location")}
                  </h3>
                </div>
                <p className="text-gray-600">{jobDetailArr.location}</p>
              </div>
            </div>
          </div>
        );

      case "requirements":
        return (
          <div className="space-y-6">
            {/* Enhanced Requirements Display */}
            <div className="p-6 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 me-3 bg-green-500 rounded-full">
                  <Check size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-green-800">
                  {t("tab_content.requirements.title")}
                </h2>
              </div>
              <div className="prose prose-green max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: structureJobDescription(jobDetailArr.requirement),
                  }}
                />
              </div>
            </div>

            {/* Skills Highlight */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Star size={18} className="me-2 text-yellow-500" />
                <h3 className="font-semibold text-gray-800">
                  {t("tab_content.requirements.what_we_looking_for")}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center p-3 rounded-lg bg-sky-50">
                  <div className="flex items-center justify-center w-8 h-8 me-3 rounded-full bg-sky-500">
                    <Briefcase size={16} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {t("tab_content.requirements.professional_experience")}
                  </span>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-purple-50">
                  <div className="flex items-center justify-center w-8 h-8 me-3 bg-purple-500 rounded-full">
                    <MessageSquare size={16} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {t("tab_content.requirements.communication_skills")}
                  </span>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-green-50">
                  <div className="flex items-center justify-center w-8 h-8 me-3 bg-green-500 rounded-full">
                    <Star size={16} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {t("tab_content.requirements.team_collaboration")}
                  </span>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-orange-50">
                  <div className="flex items-center justify-center w-8 h-8 me-3 bg-orange-500 rounded-full">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {t("tab_content.requirements.growth_mindset")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "details":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-6 border rounded-lg bg-sky-50 border-sky-200">
                <h3 className="mb-4 text-lg font-semibold text-sky-800">
                  {t("tab_content.details.job_information")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("tab_content.details.job_type")}
                    </span>
                    <span className="font-medium text-gray-800">
                      {jobDetailArr.job_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("tab_content.details.location")}
                    </span>
                    <span className="font-medium text-gray-800">
                      {jobDetailArr.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("tab_content.details.posted")}
                    </span>
                    <span className="font-medium text-gray-800">
                      {jobDetailArr.job_posted}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("tab_content.details.status")}
                    </span>
                    <span
                      className={`font-medium ${jobDetailArr.quotaIsFull ? "text-red-600" : "text-green-600"}`}
                    >
                      {jobDetailArr.quotaIsFull
                        ? t("tab_content.details.quota_full")
                        : t("tab_content.details.open_for_applications")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-green-200 rounded-lg bg-green-50">
                <h3 className="mb-4 text-lg font-semibold text-green-800">
                  {t("tab_content.details.compensation")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("tab_content.details.currency")}
                    </span>
                    <span className="font-medium text-gray-800">
                      {jobDetailArr.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("tab_content.details.salary")}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {jobDetailArr.salary_start === jobDetailArr.salary_end
                        ? `${jobDetailArr.currency} ${jobDetailArr.salary_start?.toLocaleString()}`
                        : `${jobDetailArr.currency} ${jobDetailArr.salary_start?.toLocaleString()} - ${jobDetailArr.salary_end?.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Join Us Section */}
            <div className="p-6 border rounded-lg bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200">
              <h3 className="mb-4 text-lg font-semibold text-sky-800">
                {t("tab_content.details.why_join", {
                  title: jobDetailArr.title,
                })}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-sky-500">
                    <Star size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {t("tab_content.details.career_growth")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("tab_content.details.career_growth_desc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-sky-500">
                    <Building size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {t("tab_content.details.great_location")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("tab_content.details.great_location_desc", {
                        location: jobDetailArr.location,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-sky-500"></div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {t("tab_content.details.competitive_package")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("tab_content.details.competitive_package_desc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-sky-500">
                    <Briefcase size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {t("tab_content.details.professional_growth")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("tab_content.details.professional_growth_desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-sky-600"></div>
            <div className="text-xl text-sky-600">{t("loading")}</div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen pt-[166px] xs:pt-[146px] lg:pt-[116px] bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
          {/* Floating notification */}
          {showNotification && (
            <div className="fixed z-50 flex items-center p-4 text-white transition-all transform translate-x-0 bg-green-500 rounded-lg shadow-lg top-4 right-4 animate-slide-in-right">
              <Check size={20} className="me-2" />
              <div>{t("notifications.resume_uploaded")}</div>
              <button
                onClick={() => setShowNotification(false)}
                className="p-1 ms-4 rounded-full hover:bg-green-400"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Success Modal */}
          <div
            id="successModal"
            className="fixed inset-0 z-50 items-center justify-center hidden bg-black bg-opacity-50"
          >
            <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-2xl animate-bounce-in">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
                  <Check size={32} className="text-green-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">
                  {t("notifications.application_submitted.title")}
                </h2>
                <p className="mb-6 text-gray-600">
                  {t("notifications.application_submitted.message", {
                    title: jobDetailArr.title,
                  })}
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("successModal")
                      .classList.add("hidden")
                  }
                  className="px-6 py-2 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                >
                  {t("notifications.application_submitted.close")}
                </button>
              </div>
            </div>
          </div>

          {/* Application Modal */}
          {showApplicationModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 bg-gradient-to-r from-sky-500 to-blue-600 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="mb-1 text-2xl font-bold text-white">
                        {t("application_modal.title", {
                          title: jobDetailArr.title,
                        })}
                      </h2>
                      <p className="text-sky-100">
                        {t("application_modal.subtitle")}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowApplicationModal(false)}
                      className="p-2 text-white transition-all rounded-full hover:bg-white/20"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Application Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-sky-100">
                        {t("application_modal.progress")}
                      </span>
                      <span className="text-sm font-medium text-sky-100">
                        {applicationProgress}%
                      </span>
                    </div>
                    <div className="w-full h-2 overflow-hidden rounded-full bg-sky-400/30">
                      <div
                        className="h-full transition-all duration-300 bg-white"
                        style={{ width: `${applicationProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {t("application_modal.form.full_name")}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder={t(
                          "application_modal.form.full_name_placeholder"
                        )}
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {t("application_modal.form.email")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder={t(
                          "application_modal.form.email_placeholder"
                        )}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {t("application_modal.form.phone")}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder={t(
                          "application_modal.form.phone_placeholder"
                        )}
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {t("application_modal.form.location")}
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder={t(
                          "application_modal.form.location_placeholder"
                        )}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {t("application_modal.form.linkedin")}
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder={t(
                          "application_modal.form.linkedin_placeholder"
                        )}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {t("application_modal.form.portfolio")}
                      </label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                        className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder={t(
                          "application_modal.form.portfolio_placeholder"
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {t("application_modal.form.cover_message")}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder={t(
                        "application_modal.form.cover_message_placeholder"
                      )}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {t("application_modal.form.upload_resume")}
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 transition-all border-2 border-dashed rounded-lg cursor-pointer border-sky-300 bg-sky-50 hover:bg-sky-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileText size={32} className="mb-3 text-sky-500" />
                          <p className="text-sm font-medium text-sky-600">
                            {t("application_modal.form.click_to_upload")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t("application_modal.form.file_types")}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                        />
                      </label>
                    </div>
                    {formData.resume && (
                      <div className="flex items-center p-3 mt-3 space-x-2 text-sm border rounded-lg bg-sky-50 border-sky-200">
                        <FileText size={16} className="text-sky-500" />
                        <span className="flex-1 truncate text-sky-700">
                          {formData.resume.name}
                        </span>
                        <button
                          type="button"
                          className="p-1 text-gray-400 rounded-full hover:text-gray-600 hover:bg-sky-100"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex pt-4 gap-4">
                    <button
                      type="button"
                      onClick={() => setShowApplicationModal(false)}
                      className="flex-1 px-6 py-3 font-medium text-gray-700 transition-all border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {t("application_modal.form.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={jobDetailArr.quotaIsFull}
                      className={`flex-1 flex items-center justify-center px-6 py-3 font-medium text-white rounded-lg transition-all ${
                        jobDetailArr.quotaIsFull
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                      }`}
                    >
                      <Send size={18} className="me-2" />
                      {jobDetailArr.quotaIsFull
                        ? t("application_modal.form.application_closed")
                        : t("application_modal.form.submit")}
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-center text-gray-500">
                    <div>
                      <Trans
                        i18nKey="application_modal.form.terms_agreement"
                        t={t}
                        components={{
                          1: (
                            <a
                              href="/terms"
                              className="text-sky-600 hover:underline"
                            />
                          ),
                        }}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Share Modal */}
          {showShareModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {t("share_modal.title")}
                  </h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { name: t("share_modal.linkedin"), color: "bg-blue-500" },
                    { name: t("share_modal.twitter"), color: "bg-sky-400" },
                    { name: t("share_modal.facebook"), color: "bg-blue-600" },
                    { name: t("share_modal.whatsapp"), color: "bg-green-500" },
                  ].map((platform, i) => (
                    <button
                      key={i}
                      className={`flex items-center justify-center py-3 text-white rounded-lg ${platform.color} hover:opacity-90`}
                    >
                      <Share2 size={16} className="me-2" />
                      {platform.name}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={`https://jobsadmire.com/jobs/${job_id}`}
                    className="w-full px-4 py-3 pe-20 border border-gray-300 rounded-lg"
                  />
                  <button className="absolute px-3 py-1 text-white bg-blue-500 rounded-md end-2 top-2 hover:bg-blue-600">
                    {t("share_modal.copy_link")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 py-8 md:py-12">
            <div className="max-w-5xl mx-auto">
              {/* Header Section */}
              <div className="flex flex-col mb-8 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-sky-500">
                      {!jobDetailArr.quotaIsFull
                        ? t("header.status_open")
                        : t("header.status_closed")}
                    </div>
                    <div className="ms-2 text-xs text-gray-500">
                      {t("header.posted")} {jobDetailArr.job_posted}
                    </div>
                  </div>
                  <h1 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">
                    {jobDetailArr.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
                    <div className="flex items-center">
                      <Building size={18} className="me-2 text-sky-500" />
                      <span className="font-medium">{jobDetailArr.title}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={18} className="me-2 text-sky-500" />
                      <span>{jobDetailArr.location}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign size={18} className="me-2 text-green-500" />
                      <span className="text-lg font-bold text-green-600">
                        {jobDetailArr.salary_start === jobDetailArr.salary_end
                          ? `${jobDetailArr.currency} ${jobDetailArr.salary_start?.toLocaleString()}`
                          : `${jobDetailArr.currency} ${jobDetailArr.salary_start?.toLocaleString()} - ${jobDetailArr.salary_end?.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={18} className="me-2 text-sky-500" />
                      <span>{jobDetailArr.job_type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-6 md:mt-0 md:ms-6">
                  <button
                    onClick={toggleSaved}
                    className={`flex items-center px-6 py-3 font-medium rounded-lg transition-all ${
                      saved
                        ? "bg-pink-100 text-pink-600 border border-pink-200"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Bookmark
                      size={20}
                      className={`me-2 ${saved ? "fill-pink-500" : ""}`}
                    />
                    {saved ? t("header.saved") : t("header.save_job")}
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center px-6 py-3 font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Share2 size={20} className="me-2 text-gray-600" />
                    {t("header.share")}
                  </button>
                  <a href="/candidate-apply">
                    {" "}
                    <button
                      disabled={jobDetailArr.quotaIsFull}
                      className={`flex items-center px-8 py-3 font-medium text-white rounded-lg transition-all transform hover:scale-105 ${
                        jobDetailArr.quotaIsFull
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg"
                      }`}
                    >
                      <Send size={20} className="me-2" />
                      {jobDetailArr.quotaIsFull
                        ? t("header.application_closed")
                        : t("header.apply_now")}
                    </button>
                  </a>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="mb-8 overflow-hidden bg-white border shadow-lg rounded-2xl border-sky-100">
                <div className="relative h-32 bg-gradient-to-r from-sky-400 to-blue-600">
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-center space-x-4">
                      <div className="px-3 py-1 text-sm text-white rounded-full bg-white/20 backdrop-blur-sm">
                        <Clock size={14} className="inline mr-1" />
                        {jobDetailArr.job_type}
                      </div>
                      <div className="px-3 py-1 text-sm text-white rounded-full bg-white/20 backdrop-blur-sm">
                        <MapPin size={14} className="inline mr-1" />
                        {jobDetailArr.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 text-center rounded-lg bg-sky-50">
                      <div className="text-2xl font-bold text-sky-600">
                        {jobDetailArr.currency}
                      </div>
                      <div className="text-sm text-gray-600">
                        {t("quick_info.currency")}
                      </div>
                    </div>
                    <div className="p-4 text-center rounded-lg bg-green-50">
                      <div className="text-2xl font-bold text-green-600">
                        {jobDetailArr.salary_start?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {t("quick_info.salary")}
                      </div>
                    </div>
                    <div className="p-4 text-center rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold text-blue-600">
                        {jobDetailArr.job_type}
                      </div>
                      <div className="text-sm text-gray-600">
                        {t("quick_info.type")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <div className="overflow-hidden bg-white border shadow-lg rounded-2xl border-sky-100">
                <div className="flex border-b border-gray-200">
                  {[
                    { key: "description", label: t("tabs.job_description") },
                    { key: "requirements", label: t("tabs.requirements") },
                    { key: "details", label: t("tabs.details") },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                        activeTab === tab.key
                          ? "text-sky-600 border-b-2 border-sky-500 bg-sky-50"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-8">{renderTabContent()}</div>
              </div>

              {/* Call to Action Section */}
              <div className="p-8 mt-8 text-center bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl">
                <h2 className="mb-4 text-2xl font-bold text-white">
                  {t("cta.title")}
                </h2>
                <p className="max-w-2xl mx-auto mb-6 text-sky-100">
                  {t("cta.subtitle", { title: jobDetailArr.title })}
                </p>
                <a href="/candidate-apply">
                  <button
                    onClick={() => setShowApplicationModal(true)}
                    disabled={jobDetailArr.quotaIsFull}
                    className={`inline-flex items-center px-8 py-4 font-semibold text-lg rounded-lg transition-all transform hover:scale-105 ${
                      jobDetailArr.quotaIsFull
                        ? "bg-gray-400 cursor-not-allowed text-gray-200"
                        : "bg-white text-sky-600 hover:bg-sky-50 shadow-lg"
                    }`}
                  >
                    <Send size={20} className="me-2" />
                    {jobDetailArr.quotaIsFull
                      ? t("cta.application_closed")
                      : t("cta.apply_now")}
                  </button>
                </a>
              </div>

              {/* Contact Section */}
              <div className="mt-8 overflow-hidden bg-white border shadow-lg rounded-2xl border-sky-100">
                <div className="p-6 border-b bg-gradient-to-r from-sky-50 to-blue-50 border-sky-100">
                  <h3 className="text-xl font-semibold text-sky-800">
                    {t("contact.title")}
                  </h3>
                  <p className="mt-1 text-sm text-sky-600">
                    {t("contact.subtitle")}
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <a
                      href="https://wa.me/+905011240340"
                      className="flex items-center p-4 transition-all border border-gray-100 rounded-lg hover:bg-sky-50 group"
                    >
                      <div className="flex items-center justify-center w-12 h-12 me-4 text-white transition-transform rounded-full bg-gradient-to-r from-sky-500 to-blue-600 group-hover:scale-105">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {t("contact.live_chat.title")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {t("contact.live_chat.subtitle")}
                        </div>
                      </div>
                    </a>

                    <a
                      href={EMAIL_URL}
                      className="flex items-center p-4 transition-all border border-gray-100 rounded-lg hover:bg-sky-50 group"
                    >
                      <div className="flex items-center justify-center w-12 h-12 me-4 text-white transition-transform rounded-full bg-gradient-to-r from-sky-500 to-blue-600 group-hover:scale-105">
                        <Send size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {t("contact.email.title")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {t("contact.email.subtitle")}
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobDescriptionPage;
