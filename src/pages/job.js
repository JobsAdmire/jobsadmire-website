import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Search,
  MapPin,
  Briefcase,
  ChevronRight,
  Star,
  Clock,
  DollarSign,
  Filter,
  X,
  Menu,
  Bell,
  Sun,
  Moon,
  BookOpen,
  Users,
  Zap,
  Bookmark,
  Heart,
  TrendingUp,
  Award,
  Coffee,
  Globe,
  Sliders,
  Eye,
  ChevronDown,
  Calendar,
  Compass,
} from "lucide-react";
import axios from "axios";
import { env } from "@/lib/constants/env";

// Import translation files for all 7 languages
import enTranslations from "../../public/locales/en/jobboard.json";
import trTranslations from "../../public/locales/tr/jobboard.json";
import frTranslations from "../../public/locales/fr/jobboard.json";
import deTranslations from "../../public/locales/de/jobboard.json";
import arTranslations from "../../public/locales/ar/jobboard.json";
import ruTranslations from "../../public/locales/ru/jobboard.json";
import faTranslations from "../../public/locales/fa/jobboard.json";

const PremiumJobBoard = () => {
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    try {
      switch (locale) {
        case "tr":
          return trTranslations;
        case "fr":
          return frTranslations;
        case "de":
          return deTranslations;
        case "ar":
          return arTranslations;
        case "ru":
          return ruTranslations;
        case "fa":
          return faTranslations;
        default:
          return enTranslations;
      }
    } catch (error) {
      console.error(`Error loading translations for locale ${locale}:`, error);
      return enTranslations;
    }
  };

  const t = getTranslations();

  const [darkMode, setDarkMode] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showJobDetail, setShowJobDetail] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [jobTypeFilter, setTobTypeFilter] = useState(null);

  const [jobListings, setJobListings] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [perPageItems, setPerPageItems] = useState(14);
  const [jobCategory, setCategory] = useState([]);

  useEffect(() => {
    fetchJobCategories();
    fetchJobs();
  }, [currentPageNo, jobTypeFilter]);

  const fetchJobs = async () => {
    try {
      var url = `${env.CRM_API_URL}/api/get-jobs?v=${Date.now()}&page=${currentPageNo}&per_page=${perPageItems}`;
      if (jobTypeFilter != null) {
        url += `&job_type=${jobTypeFilter}`;
      }

      const response = await axios.get(url);
      setTotalJobs(response.data.result_count);
      setJobListings(response.data.data || []);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const fetchJobCategories = async () => {
    try {
      const response = await axios.get(
        `${env.CRM_API_URL}/api/get-categories?v=${Date.now()}`
      );

      const cat_data = response.data.data.reduce((acc, cat) => {
        acc[cat.id] = cat;
        return acc;
      }, {});

      setCategory(cat_data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    // Simulating loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addFilter = (filter) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter));
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const handleDetailView = (jobId) => {
    setShowJobDetail(jobId === showJobDetail ? null : jobId);
  };

  const jobTypeFilterHandler = (job_type, e) => {
    setTobTypeFilter(null);
    if (e.target.checked) {
      setTobTypeFilter(job_type);
    }
  };

  // Animation classes for loading state
  const skeletonPulse = darkMode
    ? "animate-pulse bg-gray-700"
    : "animate-pulse bg-gray-200";

  // Filter component for reuse
  const FilterComponent = ({ isMobile = false }) => (
    <div
      className={`${isMobile ? "w-full" : "md:w-80"} ${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow-md ${!isMobile ? "h-fit sticky top-20" : ""}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"} flex items-center`}
        >
          <Sliders className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          {t?.filters?.title || "Filters"}
        </h2>

        <div className="flex items-center space-x-2">
          {selectedFilters.length > 0 && (
            <button
              onClick={clearFilters}
              className={`text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
            >
              {t?.filters?.clearAll || "Clear all"}
            </button>
          )}

          {isMobile && (
            <button
              onClick={() => setShowMobileFilters(false)}
              className={`p-1 rounded ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedFilters.map((filter) => (
            <div
              key={filter}
              className={`flex items-center ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"} px-3 py-1 rounded-full text-sm`}
            >
              <span>{filter}</span>
              <button onClick={() => removeFilter(filter)} className="ml-2">
                <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3
            className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center`}
          >
            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />{" "}
            {t?.filters?.jobType?.title || "Job Type"}
          </h3>
          <div className="space-y-3">
            {(
              t?.filters?.jobType?.options || [
                { id: "fullTime", value: "full_time", label: "Full Time" },
                { id: "partTime", value: "part_time", label: "Part Time" },
                { id: "contract", value: "contract", label: "Contract" },
                { id: "remote", value: "remote", label: "Remote" },
              ]
            ).map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${option.id}-${isMobile ? "mobile" : "desktop"}`}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => jobTypeFilterHandler(option.value, e)}
                />
                <label
                  htmlFor={`${option.id}-${isMobile ? "mobile" : "desktop"}`}
                  className={`ml-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3
            className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center`}
          >
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />{" "}
            {t?.filters?.experience?.title || "Experience Level"}
          </h3>
          <div className="space-y-3">
            {(
              t?.filters?.experience?.options || [
                { id: "entry", label: "Entry Level" },
                { id: "mid", label: "Mid Level" },
                { id: "senior", label: "Senior Level" },
                { id: "executive", label: "Executive" },
              ]
            ).map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${option.id}-${isMobile ? "mobile" : "desktop"}`}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`${option.id}-${isMobile ? "mobile" : "desktop"}`}
                  className={`ml-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3
            className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center`}
          >
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />{" "}
            {t?.filters?.salary?.title || "Salary Range"}
          </h3>
          <div
            className={`${darkMode ? "bg-gray-700" : "bg-gray-100"} p-4 rounded-lg`}
          >
            <input
              type="range"
              min="0"
              max="100"
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
            />
            <div className="flex items-center justify-between mt-2">
              <span
                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {t?.filters?.salary?.min || "$0"}
              </span>
              <span
                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {t?.filters?.salary?.max || "$100k+"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3
            className={`text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"} flex items-center`}
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />{" "}
            {t?.filters?.datePosted?.title || "Date Posted"}
          </h3>
          <div className="space-y-3">
            {(
              t?.filters?.datePosted?.options || [
                { id: "any", label: "Any time" },
                { id: "day", label: "Past 24 hours" },
                { id: "week", label: "Past week" },
                { id: "month", label: "Past month" },
              ]
            ).map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="radio"
                  name={`date-${isMobile ? "mobile" : "desktop"}`}
                  id={`${option.id}-${isMobile ? "mobile" : "desktop"}`}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor={`${option.id}-${isMobile ? "mobile" : "desktop"}`}
                  className={`ml-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          className={`w-full py-3 ${darkMode ? "bg-sky-500 hover:bg-sky-500" : "bg-sky-500 hover:bg-sky-500"} text-white rounded-lg font-medium transition-all flex items-center justify-center`}
        >
          <Filter className="w-4 h-4 mr-2" />
          {t?.filters?.applyButton || "Apply Filters"}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Header */}

      {/* Hero Banner */}
      <div
        className={`relative pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]  ${darkMode ? "bg-gradient-to-r from-sky-400 via-sky-400 to-sky-400" : "bg-gradient-to-r from-blue-500 via-sky-500 to-sky-500"} text-white overflow-hidden`}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-50 bg-sky-400"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-sky-400 to-transparent opacity-60"></div>
        </div>
        <div className="max-w-7xl mx-auto relative px-4">
          <div className="max-w-3xl mx-auto mt-5 text-center">
            <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
              {t?.hero?.title || "Find Your Dream Job"}
            </h1>
            <p className="mb-8 text-lg text-gray-200 sm:text-xl">
              {t?.hero?.subtitle ||
                "Discover opportunities that match your passion, skills, and career goals"}
            </p>

            <div
              className={`max-w-4xl mx-auto p-4 rounded-xl ${darkMode ? "bg-sky-400 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"} shadow-2xl transition-all transform ${searchFocused ? "scale-105" : ""}`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div
                  className={`flex-1 flex items-center px-4 py-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} ${searchFocused ? "ring-2 ring-blue-500" : ""}`}
                >
                  <Search
                    className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  />
                  <input
                    type="text"
                    placeholder={
                      t?.hero?.search?.jobPlaceholder ||
                      "Job title, skills or keywords..."
                    }
                    className={`bg-transparent w-full outline-none ${darkMode ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"}`}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
                <div
                  className={`flex-1 flex items-center px-4 py-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <MapPin
                    className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  />
                  <input
                    type="text"
                    placeholder={
                      t?.hero?.search?.locationPlaceholder ||
                      "City, country or remote..."
                    }
                    className={`bg-transparent w-full outline-none ${darkMode ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"}`}
                  />
                </div>
                <div className="flex md:w-auto">
                  <button
                    className={`w-full md:w-auto px-6 py-3 ${darkMode ? "bg-sky-400 hover:bg-sky-400" : "bg-sky-400 hover:bg-blue-700"} text-white rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center`}
                  >
                    <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    {t?.hero?.search?.buttonText || "Search Jobs"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats banner */}
      </div>

      {/* Category Navigation */}
      <div className="max-w-7xl mx-auto px-4 mt-16 mb-8 sm:mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2
            className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {t?.categories?.title || "Explore Opportunities"}
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto flex-1 px-4 pb-16">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <FilterComponent />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(true)}
              className={`w-full mb-4 px-4 py-3 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"} rounded-lg shadow-md flex items-center justify-center text-sm font-medium`}
            >
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              {t?.filters?.title || "Filters"}
              {selectedFilters.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {selectedFilters.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Filters Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setShowMobileFilters(false)}
              ></div>
              <div
                className={`absolute inset-x-0 bottom-0 ${darkMode ? "bg-gray-900" : "bg-white"} rounded-t-xl max-h-[90vh] overflow-y-auto`}
              >
                <FilterComponent isMobile={true} />
              </div>
            </div>
          )}

          {/* Job Listings */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {t?.jobListings?.title || "Available Jobs"}
                </h2>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {t?.jobListings?.showing || "Showing"} {jobListings.length}{" "}
                  {t?.jobListings?.opportunities || "opportunities"}
                </p>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <div
                  className={`flex items-center ${darkMode ? "bg-gray-800" : "bg-white"} px-3 py-2 rounded-lg shadow-sm`}
                >
                  <span
                    className={`text-sm mr-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {t?.jobListings?.sortBy?.label || "Sort by:"}
                  </span>
                  <select
                    className={`bg-transparent border-none outline-none text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {(
                      t?.jobListings?.sortBy?.options || [
                        "Most Relevant",
                        "Newest",
                        "Highest Salary",
                        "Most Popular",
                      ]
                    ).map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <button
                  className={`p-2 rounded-lg ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-sm`}
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              // Skeleton loading state
              <div className="space-y-4 sm:space-y-6">
                {[1, 2, 3, 4].map((_, index) => (
                  <div
                    key={index}
                    className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 sm:p-6 rounded-xl shadow-md`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start">
                      <div
                        className={`${skeletonPulse} w-12 h-12 sm:w-14 sm:h-14 rounded-lg mb-4 sm:mb-0 sm:mr-4`}
                      ></div>
                      <div className="flex-1">
                        <div
                          className={`${skeletonPulse} h-5 sm:h-6 w-3/4 rounded mb-2 sm:mb-3`}
                        ></div>
                        <div
                          className={`${skeletonPulse} h-4 w-1/3 rounded mb-3 sm:mb-4`}
                        ></div>
                        <div className="flex flex-wrap gap-2">
                          <div
                            className={`${skeletonPulse} h-4 sm:h-5 w-20 sm:w-24 rounded-full`}
                          ></div>

                          <div
                            className={`${skeletonPulse} h-4 sm:h-5 w-20 sm:w-24 rounded-full`}
                          ></div>
                          <div
                            className={`${skeletonPulse} h-4 sm:h-5 w-20 sm:w-24 rounded-full`}
                          ></div>
                        </div>
                      </div>
                      <div
                        className={`${skeletonPulse} h-8 sm:h-10 w-24 sm:w-28 rounded-lg mt-4 sm:mt-0`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Actual job listings
              <div className="space-y-4 sm:space-y-6">
                {jobListings.map((job) => (
                  <div
                    key={job.job_id}
                    className={`${darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-blue-50"} p-3 sm:p-4 md:p-6 rounded-xl shadow-md transition-all border ${job.featured ? (darkMode ? "border-blue-600" : "border-blue-500") : darkMode ? "border-gray-700" : "border-gray-200"} w-full max-w-full overflow-hidden`}
                  >
                    <div className="flex flex-col w-full">
                      {/* Header Row - Company Logo and Basic Info */}
                      <div className="flex items-start mb-3 sm:mb-4 gap-2 sm:gap-4">
                        <div className="flex-shrink-0">
                          <div
                            className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-center`}
                          >
                            <img
                              src={job.logo}
                              alt={job.company}
                              className="object-cover"
                            />
                            {job.featured && (
                              <div className="absolute top-0 left-0 w-full">
                                <div className="bg-yellow-500 text-white text-xs px-1 py-0.5 text-center">
                                  {t?.jobCard?.featured || "Featured"}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1 min-w-0 max-w-full">
                              <h3
                                className={`text-base sm:text-lg md:text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"} break-words line-clamp-2`}
                              >
                                {job.title}
                              </h3>
                              <p
                                className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} truncate`}
                              >
                                {job.job_type}
                              </p>
                            </div>

                            <div className="flex items-center flex-shrink-0 space-x-1 sm:space-x-2">
                              {job.new && (
                                <span className="bg-green-100 text-green-800 text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                                  {t?.jobCard?.new || "New"}
                                </span>
                              )}
                              <span
                                className={`${darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-800"} text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium whitespace-nowrap`}
                              >
                                {job.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="grid grid-cols-1 gap-2 mb-3 sm:mb-4 sm:grid-cols-2 sm:gap-4">
                        <div
                          className={`flex items-center text-xs sm:text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} min-w-0`}
                        >
                          <MapPin className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="truncate">{job.location}</span>
                        </div>

                        <div
                          className={`flex items-center text-xs sm:text-sm ${darkMode ? "text-blue-400" : "text-sky-500"} font-medium`}
                        >
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {job.currency} {job.salary_start} - {job.salary_end}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {showJobDetail === job.job_id && (
                        <div
                          className={`mt-4 pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                        >
                          <p
                            className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            {job.description}
                          </p>

                          {job.requirements && job.requirements.length > 0 && (
                            <div className="mb-3">
                              <h4
                                className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                              >
                                {t?.jobCard?.requirements || "Requirements:"}
                              </h4>
                              <ul
                                className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} pl-5 list-disc space-y-1`}
                              >
                                {job.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {job.benefits && job.benefits.length > 0 && (
                            <div className="mb-3">
                              <h4
                                className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                              >
                                {t?.jobCard?.benefits || "Benefits:"}
                              </h4>
                              <ul
                                className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} pl-5 list-disc space-y-1`}
                              >
                                {job.benefits.map((benefit, index) => (
                                  <li key={index}>{benefit}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {job.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className={`text-xs px-2 py-1 rounded-full ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-800"}`}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 mt-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-2 overflow-x-auto">
                          <button
                            className={`flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full flex-shrink-0 ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} transition-colors`}
                          >
                            <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>

                          <button
                            className={`flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full flex-shrink-0 ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} transition-colors`}
                          >
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>

                          <button
                            onClick={() => handleDetailView(job.job_id)}
                            className={`text-xs sm:text-sm whitespace-nowrap ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-sky-500 hover:text-sky-500"} transition-colors`}
                          >
                            {showJobDetail === job.job_id
                              ? t?.jobCard?.hideDetails || "Hide details"
                              : t?.jobCard?.viewDetails || "View details"}
                          </button>
                        </div>

                        <a
                          href={`/job-detail/${job.job_id}`}
                          className={`inline-flex items-center justify-center ${darkMode ? "bg-sky-500 hover:bg-sky-600" : "bg-sky-500 hover:bg-sky-600"} text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all w-full sm:w-auto flex-shrink-0`}
                        >
                          {t?.jobCard?.applyNow || "Apply Now"}
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalJobs > perPageItems && (
              <div className="flex justify-center mt-8">
                <div className="inline-flex overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                  {[...Array(Math.ceil(totalJobs / perPageItems)).keys()].map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPageNo(page + 1)}
                        className={`px-3 py-2 sm:px-4 text-sm ${
                          currentPageNo === page + 1
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        } transition-colors`}
                      >
                        {page + 1}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Call to Action - Floating Button */}
      <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-10`}>
        <button
          className="flex items-center justify-center w-12 h-12 text-white transition-all rounded-full shadow-lg sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105"
          title={t?.cta?.postJob || "Post a Job"}
        >
          <span className="sr-only">{t?.cta?.postJob || "Post a Job"}</span>
          <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

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

export default PremiumJobBoard;
