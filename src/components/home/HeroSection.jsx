import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Globe,
  Users,
  ArrowRight,
  CheckCircle,
  Building,
  ChevronDown,
  MessageCircle,
  Phone,
  X,
  GraduationCap,
  Plane,
  UserCheck,
  MapIcon,
  Star,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  Zap,
  Target,
  Shield,
  Rocket,
} from "lucide-react";
import ServicePopupForm from "./ServicePopupForm";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { env } from "@/lib/constants/env";

const PremiumJobHeroSection = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [jobTitles, setJobTitles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showJobTitles, setShowJobTitles] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [filteredJobTitles, setFilteredJobTitles] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupServiceType, setPopupServiceType] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    const formParam = router.query.form;
    const urlParamToServiceType = {
      migrate: "migrate",
      work: "work",
      "e-invitation": "visit",
    };

    if (formParam && urlParamToServiceType[formParam]) {
      const serviceType = urlParamToServiceType[formParam];
      if (popupServiceType !== serviceType || !showPopup) {
        setSelectedService(serviceType);
        setPopupServiceType(serviceType);
        setShowPopup(true);
      }
    } else if (!formParam && showPopup) {
      setShowPopup(false);
      setPopupServiceType("");
      setSelectedService(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.form, router.isReady]);

  const handleServiceClick = (serviceId) => {
    console.log("Service clicked:", serviceId);
    setSelectedService(serviceId);
    setPopupServiceType(serviceId);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupServiceType("");
    setSelectedService(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const animatedWords = t("hero.animatedWords", { returnObjects: true });
      setCurrentWordIndex(
        (prevIndex) => (prevIndex + 1) % animatedWords.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [t]);

  const fetchJobsData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${env.CRM_API_URL}/api/get-jobs?v=${Date.now()}&page=1&per_page=100`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.data && Array.isArray(data.data)) {
        const titles = [
          ...new Set(
            data.data.map((job) => job.title).filter((title) => title)
          ),
        ];
        setJobTitles(titles);
        setFilteredJobTitles(titles);

        const jobLocations = [
          ...new Set(
            data.data.map((job) => job.location).filter((location) => location)
          ),
        ];
        setLocations(jobLocations);
        setFilteredLocations(jobLocations);
      } else {
        console.warn("Unexpected API response structure:", data);
        setError(t("hero.search.errorText"));
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(t("hero.search.errorText"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = jobTitles.filter((title) =>
        title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobTitles(filtered);
    } else {
      setFilteredJobTitles(jobTitles);
    }
  }, [searchTerm, jobTitles]);

  useEffect(() => {
    if (location) {
      const filtered = locations.filter((loc) =>
        loc.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [location, locations]);

  const handleJobTitleSelect = (title) => {
    setSearchTerm(title);
    setShowJobTitles(false);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowLocations(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-dropdown")) {
        setShowJobTitles(false);
        setShowLocations(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const serviceOptions = [
    {
      id: "migrate",
      label: t("hero.services.migrate.label"),
      icon: <UserCheck className="w-5 h-5" />,
      description: t("hero.services.migrate.description"),
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-700",
    },
    {
      id: "work",
      label: t("hero.services.work.label"),
      icon: <Target className="w-5 h-5" />,
      description: t("hero.services.work.description"),
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-300",
      textColor: "text-emerald-700",
    },
    {
      id: "visit",
      label: t("hero.services.visit.label"),
      icon: <Plane className="w-5 h-5" />,
      description: t("hero.services.visit.description"),
      gradient: "from-purple-500 to-violet-600",
      iconBg: "bg-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      textColor: "text-purple-700",
    },
  ];

  const animatedWords = t("hero.animatedWords", { returnObjects: true });

  return (
    <>
      {/* RESPONSIVE HERO SECTION - Full screen on desktop, scrollable on mobile */}
      <div className="relative pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        {/* Subtle Background */}
        <div className="absolute inset-0">
          <div className="absolute w-32 h-32 rounded-full top-10 right-10 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-200/20 to-indigo-300/10 blur-3xl animate-pulse"></div>
          <div className="absolute w-24 h-24 delay-1000 rounded-full bottom-10 left-10 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-br from-emerald-200/20 to-teal-300/10 blur-2xl animate-pulse"></div>

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
        <div className="relative z-10 px-4 mx-auto sm:px-6 lg:px-8">
          <div className="w-full mx-auto max-w-7xl">
            <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
              {/* LEFT SIDE - Content + Search */}
              <div className="order-1 space-y-6 lg:space-y-8 lg:order-1">
                {/* Badge */}

                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                    <span className="text-gray-900">
                      {t("hero.title.findTheDream")}
                    </span>{" "}
                    <span className="relative inline-block">
                      <span className="font-extrabold text-transparent bg-gradient-to-r from-sky-600 to-sky-600 bg-clip-text">
                        {animatedWords[currentWordIndex]}
                      </span>
                      <div className="absolute left-0 right-0 h-1 rounded-full -bottom-1 bg-gradient-to-r from-sky-600 to-sky-600"></div>
                    </span>
                    <br />
                    <span className="text-gray-900">
                      {t("hero.title.forYourself")}
                    </span>
                  </h1>

                  <p className="max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg lg:text-xl">
                    {t("hero.subtitle")}
                  </p>
                </div>

                {/* Compact Search Box */}
                <div className="p-4 border shadow-xl bg-white/90 backdrop-blur-xl border-white/60 rounded-2xl sm:p-5">
                  {/* Loading/Error - Compact */}
                  {loading && (
                    <div className="flex items-center mb-4 text-sky-600">
                      <div className="w-4 h-4 mr-2 border-b-2 rounded-full animate-spin border-sky-600"></div>
                      <span className="text-sm">
                        {t("hero.search.loadingText")}
                      </span>
                    </div>
                  )}
                  {error && (
                    <div className="p-3 mb-4 border border-red-200 bg-red-50 rounded-xl">
                      <div className="flex flex-col text-sm text-red-600 sm:flex-row sm:items-center">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <X className="w-4 h-4 mr-2" />
                          {error}
                        </div>
                        <button
                          onClick={fetchJobsData}
                          className="font-medium text-left underline sm:ml-2 text-sky-600 hover:text-sky-600"
                        >
                          {t("hero.search.retryButton")}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2">
                    {/* Job Search Input */}
                    <div className="relative search-dropdown">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <Search className="w-5 h-5 text-sky-400" />
                      </div>
                      <input
                        type="text"
                        placeholder={t("hero.search.jobPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowJobTitles(true)}
                        className="w-full py-3 pr-4 text-gray-700 transition-all duration-300 border-2 border-gray-200 pl-11 bg-gray-50/80 rounded-xl focus:ring-3 focus:ring-indigo-500/20 focus:border-sky-600"
                      />

                      {/* Job Titles Dropdown */}
                      {showJobTitles && filteredJobTitles.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 overflow-y-auto border border-gray-200 shadow-xl bg-white/95 backdrop-blur-xl rounded-xl max-h-48">
                          {filteredJobTitles.slice(0, 8).map((title, index) => (
                            <div
                              key={index}
                              onClick={() => handleJobTitleSelect(title)}
                              className="flex items-center px-4 py-2 text-sm transition-colors border-b border-gray-100 cursor-pointer hover:bg-indigo-50 hover:text-sky-600 last:border-b-0"
                            >
                              <Search className="w-3 h-3 mr-2 text-gray-400" />
                              {title}
                            </div>
                          ))}
                          {filteredJobTitles.length > 8 && (
                            <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50/80">
                              +{filteredJobTitles.length - 8}{" "}
                              {t("hero.search.moreResults")}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Location Search Input */}
                    <div className="relative search-dropdown">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <MapPin className="w-5 h-5 text-sky-600" />
                      </div>
                      <input
                        type="text"
                        placeholder={t("hero.search.locationPlaceholder")}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onFocus={() => setShowLocations(true)}
                        className="w-full py-3 pr-4 text-gray-700 transition-all duration-300 border-2 border-gray-200 pl-11 bg-gray-50/80 rounded-xl focus:ring-3 focus:ring-indigo-500/20 focus:border-sky-600"
                      />

                      {/* Locations Dropdown */}
                      {showLocations && filteredLocations.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 overflow-y-auto border border-gray-200 shadow-xl bg-white/95 backdrop-blur-xl rounded-xl max-h-48">
                          {filteredLocations.slice(0, 8).map((loc, index) => (
                            <div
                              key={index}
                              onClick={() => handleLocationSelect(loc)}
                              className="flex items-center px-4 py-2 text-sm transition-colors border-b border-gray-100 cursor-pointer hover:bg-indigo-50 hover:text-sky-600 last:border-b-0"
                            >
                              <MapPin className="w-3 h-3 mr-2 text-gray-400" />
                              {loc}
                            </div>
                          ))}
                          {filteredLocations.length > 8 && (
                            <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50/80">
                              +{filteredLocations.length - 8}{" "}
                              {t("hero.search.moreResults")}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Search Button */}
                  <a href="/job">
                    <button className="relative w-full px-6 py-3 overflow-hidden font-bold text-white transition-all duration-300 shadow-lg group rounded-xl bg-gradient-to-r from-sky-600 to-sky-600 hover:from-sky-600 hover:to-sky-400 hover:shadow-xl hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center">
                        <span className="mr-2">
                          {t("hero.search.searchButton")}
                        </span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </button>
                  </a>
                </div>
              </div>

              {/* RIGHT SIDE - Services */}
              <div className="order-2 space-y-6 lg:order-2">
                {/* Services Header */}
                <div className="text-center">
                  <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                    {t("hero.services.sectionTitle")}
                  </h2>
                  <p className="text-sm text-gray-600 sm:text-base">
                    {t("hero.services.sectionSubtitle")}
                  </p>
                </div>

                {/* Service Cards - Compact */}
                <div className="space-y-3">
                  {serviceOptions.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className={`
                        group relative w-full p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden
                        ${
                          selectedService === service.id
                            ? `${service.bgColor} border-2 ${service.borderColor} shadow-lg`
                            : "bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
                        }
                      `}
                    >
                      {/* Background effect */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      ></div>

                      {/* Content */}
                      <div className="relative flex items-center space-x-3 sm:space-x-4">
                        {/* Icon */}
                        <div
                          className={`
                          flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all duration-300 transform group-hover:scale-110
                          ${
                            selectedService === service.id
                              ? `${service.iconBg} text-white shadow-md`
                              : `${service.iconBg} text-white group-hover:shadow-md`
                          }
                        `}
                        >
                          {service.icon}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0 text-left">
                          <h3
                            className={`text-base sm:text-lg font-bold mb-1 transition-colors duration-300 ${
                              selectedService === service.id
                                ? service.textColor
                                : "text-gray-900"
                            }`}
                          >
                            {service.label}
                          </h3>
                          <p className="text-xs text-gray-600 sm:text-sm line-clamp-2">
                            {service.description}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div
                          className={`
                          transition-all duration-300 transform group-hover:translate-x-1 flex-shrink-0
                          ${selectedService === service.id ? service.textColor : "text-gray-400 group-hover:text-gray-700"}
                        `}
                        >
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </div>

                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                  ))}
                </div>

                {/* WhatsApp Contact - Compact */}
                <div className="relative p-4 overflow-hidden text-white transition-all duration-300 shadow-lg rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-12 h-12 rounded-bl-full sm:w-16 sm:h-16 bg-white/10"></div>

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0 space-x-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl">
                        <MessageCircle className="w-4 h-4 text-white sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate">
                          {t("hero.services.consultation.title")}
                        </h4>
                        <p className="text-xs truncate text-emerald-100">
                          {t("hero.services.consultation.subtitle", {
                            defaultValue: "Expert guidance available",
                          })}
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://wa.me/+905011240340"
                      className="flex items-center flex-shrink-0 px-3 py-2 ml-2 text-xs font-semibold transition-all duration-300 border rounded-lg group sm:px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 hover:scale-105 sm:text-sm"
                    >
                      <span className="hidden sm:inline">
                        {t("hero.services.consultation.button")}
                      </span>
                      <span className="sm:hidden">Chat</span>
                      <ArrowRight className="w-3 h-3 ml-1 transition-transform duration-300 sm:w-4 sm:h-4 sm:ml-2 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Popup */}
      <ServicePopupForm
        isOpen={showPopup}
        onClose={closePopup}
        serviceType={popupServiceType}
      />
    </>
  );
};

export default PremiumJobHeroSection;
