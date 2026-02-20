import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { showSuccess, showError } from "@/lib/utils/toast";
import {
  Briefcase,
  ChevronDown,
  Globe,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  Phone,
  Plane,
  User,
  X,
} from "lucide-react";

// Import translation files for all 7 languages
import enTranslations from "../../../public/locales/en/servicepopup.json";
import trTranslations from "../../../public/locales/tr/servicepopup.json";
import frTranslations from "../../../public/locales/fr/servicepopup.json";
import deTranslations from "../../../public/locales/de/servicepopup.json";
import arTranslations from "../../../public/locales/ar/servicepopup.json";
import ruTranslations from "../../../public/locales/ru/servicepopup.json";
import faTranslations from "../../../public/locales/fa/servicepopup.json";
import { createInquiry } from "@/utils/crmUtils";
import { useFormUrlSync } from "@/lib/hooks/useFormUrlSync";
import { COUNTRIES_LIST } from "@/lib/utils/countries";

const ServicePopupForm = ({ isOpen, onClose, serviceType }) => {
  const router = useRouter();
  const { locale } = router;

  const { openForm, closeForm } = useFormUrlSync({
    onFormOpen: () => {
      // URL sync is handled automatically by the hook
    },
    onFormClose: () => {
      // URL sync is handled automatically by the hook
    },
  });

  useEffect(() => {
    if (isOpen && serviceType) {
      openForm(serviceType);
    } else if (!isOpen) {
      closeForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, serviceType]);

  const handleClose = () => {
    closeForm();
    onClose();
  };

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

  const [formData, setFormData] = useState({
    name: "",
    destination: "Turkey", // Fixed to Turkey
    currentCountry: "",
    citizenCountry: "",
    serviceOption: "", // New field for service-specific options
    personalPhone: "",
    whatsappPhone: "",
    email: "",
    isWhatsAppSame: false,
    acceptTerms: false,
    personalCountryCode: "+1",
    whatsappCountryCode: "+1",
  });

  const [showCitizenCountryDropdown, setShowCitizenCountryDropdown] =
    useState(false);
  const [showCurrentCountryDropdown, setShowCurrentCountryDropdown] =
    useState(false);
  const [showPersonalCodeDropdown, setShowPersonalCodeDropdown] =
    useState(false);
  const [showWhatsappCodeDropdown, setShowWhatsappCodeDropdown] =
    useState(false);
  const [personalCodeSearch, setPersonalCodeSearch] = useState("");
  const [whatsappCodeSearch, setWhatsappCodeSearch] = useState("");
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showServiceOptionDropdown, setShowServiceOptionDropdown] =
    useState(false); // New state
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggleChange = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleCitizenCountrySelect = (citizenCountry) => {
    setFormData((prev) => ({ ...prev, citizenCountry }));
    setShowCitizenCountryDropdown(false);
  };

  const handleCurrentCountrySelect = (currentCountry) => {
    setFormData((prev) => ({ ...prev, currentCountry }));
    setShowCurrentCountryDropdown(false);
  };

  const handleDestinationSelect = (destination) => {
    setFormData((prev) => ({ ...prev, destination }));
    setShowDestinationDropdown(false);
  };

  const handleServiceOptionSelect = (option) => {
    setFormData((prev) => ({ ...prev, serviceOption: option }));
    setShowServiceOptionDropdown(false);
  };

  const handleCountryCodeSelect = (code, type) => {
    if (type === "personal") {
      setFormData((prev) => ({ ...prev, personalCountryCode: code }));
      setShowPersonalCodeDropdown(false);
      setPersonalCodeSearch("");
    } else {
      setFormData((prev) => ({ ...prev, whatsappCountryCode: code }));
      setShowWhatsappCodeDropdown(false);
      setWhatsappCodeSearch("");
    }
  };

  // Get countries based on service type
  const getCountriesForService = () => {
    if (serviceType === "visit") {
      // For visa e-invitation, only show 5 specific countries
      return ["Albania", "China", "Dubai", "Kazakhstan", "Portugal", "Turkey"];
    }
    // For all other services, show all countries
    return t?.countries || COUNTRIES_LIST;
  };

  // Fixed destination options (only Turkey for now)
  const getDestinationOptions = () => {
    return ["Turkey"];
  };

  // Get service-specific options for the new dropdown
  const getServiceOptions = () => {
    const fallbackOptions = {
      study: [
        "Bachelor's Degree",
        "Master's Degree",
        "PhD Program",
        "Language Course",
        "Diploma Program",
        "Certificate Course",
        "Exchange Program",
      ],
      work: [
        "Work Permit (Owner/Director/Investor)",
        "Domestic Recruitment & Work Permit",
        "Abroad Recruitment & Work Permit",
      ],
      migrate: [
        "Company Registration Ltd., A.Ş., Sole Proprie.",
        "Investment Migration",
        "Turkish Nationality Process",
      ],
      visit: ["Invitation Letter Individual", "Individual Letter of Family"],
    };

    return t?.serviceOptions?.[serviceType]?.options || fallbackOptions[serviceType] || fallbackOptions.migrate;
  };

  // Get service option config
  const getServiceOptionConfig = () => {
    const fallbackConfigs = {
      study: { label: "Program Type", placeholder: "Select your study program" },
      work: { label: "Work Category", placeholder: "Select work visa type" },
      migrate: { label: "Migration Category", placeholder: "Select migration type" },
      visit: { label: "Visit Purpose", placeholder: "Select visit purpose" },
    };
    
    const icons = {
      study: <GraduationCap className="w-5 h-5 text-sky-500" />,
      work: <Briefcase className="w-5 h-5 text-sky-500" />,
      migrate: <Home className="w-5 h-5 text-sky-500" />,
      visit: <Plane className="w-5 h-5 text-sky-500" />,
    };
    
    const type = serviceType || "migrate";
    return {
      label: t?.serviceOptions?.[type]?.label || fallbackConfigs[type]?.label,
      placeholder: t?.serviceOptions?.[type]?.placeholder || fallbackConfigs[type]?.placeholder,
      icon: icons[type] || icons.migrate,
    };
  };

  const availableDestinations = getDestinationOptions();
  const availableServiceOptions = getServiceOptions();
  const serviceOptionConfig = getServiceOptionConfig();

  // Filter country codes based on search
  const filterCountryCodes = (searchTerm) => {
    if (!searchTerm) return t?.countryCodes || [];

    return (t?.countryCodes || []).filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.includes(searchTerm) ||
        country.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
  };

  // Handle keyboard navigation for country codes
  const handleKeyPress = (e, type) => {
    const char = e.key.toLowerCase();
    if (char.length === 1 && /[a-z]/.test(char)) {
      const matchingCountry = (t?.countryCodes || []).find((country) =>
        country.name.toLowerCase().startsWith(char)
      );
      if (matchingCountry) {
        if (type === "personal") {
          setPersonalCodeSearch(char);
        } else {
          setWhatsappCodeSearch(char);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      showError(
        t?.form?.validation?.acceptTerms ||
          "Please accept the terms and conditions"
      );
      return;
    }

    setSubmitting(true);

    const response = await createInquiry({
      name: formData.name,
      interested_service:
        serviceType === "migrate"
          ? "Individual Residence Permit"
          : serviceType === "visit"
            ? "Invitation Letter Individual"
            : "Work Permit",
      mobile_no: formData.personalPhone ?? formData.whatsappPhone,
      email: formData.email,
      address: "",
      additional_details: JSON.stringify(formData),
    });

    if (response.status === 1) {
      showSuccess("Thanks, We will contact you soon.");
      router.push("/thankyou");
    } else {
      showError("Error: " + response.data.message);
    }

    setSubmitting(false);

    // No need for cleanup, since we are redirecting to /thankyou page
    return;

    // Reset form and close popup
    setFormData({
      name: "",
      destination: "Turkey",
      country: "",
      serviceOption: "",
      personalPhone: "",
      whatsappPhone: "",
      email: "",
      isWhatsAppSame: false,
      acceptTerms: false,
      personalCountryCode: "+1",
      whatsappCountryCode: "+1",
    });
    setShowCitizenCountryDropdown(false);
    setShowCurrentCountryDropdown(false);
    setShowPersonalCodeDropdown(false);
    setShowWhatsappCodeDropdown(false);
    setPersonalCodeSearch("");
    setShowDestinationDropdown(false);
    setShowServiceOptionDropdown(false);
    setWhatsappCodeSearch("");
    handleClose();
  };

  const getServiceConfig = () => {
    const configs = {
      study: {
        title: t?.services?.study?.title || "Study Abroad",
        subtitle:
          t?.services?.study?.subtitle ||
          "Pursue your education in top universities worldwide",
        gradient: "from-sky-400 to-blue-500",
        actionText: t?.services?.study?.actionText || "study in",

        icon: "🎓",
      },
      work: {
        title: t?.services?.work?.title || "",
        subtitle:
          t?.services?.work?.subtitle ||
          "Build your career with global opportunities",
        gradient: "from-cyan-400 to-teal-500",
        actionText: t?.services?.work?.actionText || "work in",

        icon: "💼",
      },
      migrate: {
        title: t?.services?.migrate?.title || "Migrate",
        subtitle:
          t?.services?.migrate?.subtitle ||
          "Start a new life abroad with your family",
        gradient: "from-sky-500 to-indigo-600",
        actionText: t?.services?.migrate?.actionText,

        icon: "🏠",
      },
      visit: {
        title: t?.services?.visit?.title || "Visit & Explore",
        subtitle:
          t?.services?.visit?.subtitle ||
          "Discover amazing destinations worldwide",
        gradient: "from-sky-300 to-cyan-500",
        actionText: t?.services?.visit?.actionText || "Invitation",

        icon: "✈️",
      },
    };

    return configs[serviceType] || configs.migrate;
  };

  // This is the crucial line that prevents the popup from showing when not needed
  if (!isOpen) return null;

  const config = getServiceConfig();
  const availableCountries = getCountriesForService();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl mx-2 sm:mx-4 bg-white rounded-xl sm:rounded-2xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute z-20 p-2 text-white transition-all duration-200 bg-black rounded-full top-4 right-4 sm:top-6 sm:right-6 hover:text-gray-200 bg-opacity-20 hover:bg-opacity-30"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Mobile Header Section - Only visible on mobile */}
        <div
          className={`lg:hidden bg-gradient-to-br ${config.gradient} p-6 text-white text-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10">
            <div className="mb-3 text-4xl">{config.icon}</div>
            <h2 className="mb-2 text-2xl font-bold">{config.title}</h2>
            <p className="text-sm text-white/90">{config.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[600px] max-h-[80vh]">
          {/* Left Image Section - Hidden on mobile */}
          <div
            className={`hidden lg:block lg:w-2/5 bg-gradient-to-br ${config.gradient} relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <img
              src={config.image}
              className="object-cover w-full h-full mix-blend-overlay"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
              <div className="mb-4 text-6xl">{config.icon}</div>
              <h2 className="mb-4 text-4xl font-bold text-center">
                {config.title}
              </h2>
              <p className="text-xl leading-relaxed text-center text-white/90">
                {config.subtitle}
              </p>

              {/* Decorative Elements */}
              <div className="flex mt-8 space-x-2">
                <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="w-full overflow-y-auto lg:w-3/5 bg-gradient-to-br from-sky-50 to-blue-50">
            <div className="flex flex-col h-full p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h3 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl">
                  {t?.form?.header?.title || "Let's Get Started"}
                </h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  {t?.form?.header?.subtitle ||
                    "Fill in your details and we'll help you achieve your goals"}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col flex-1 space-y-4"
              >
                <div className="grid grid-cols-1 gap-4">
                  {/* Name Input */}
                  <div className="p-4 bg-white border shadow-sm rounded-xl border-sky-100">
                    <div className="flex items-center mb-2 space-x-3">
                      <User className="w-5 h-5 text-sky-500" />
                      <span className="text-sm font-medium text-gray-700 sm:text-base">
                        {t?.form?.fields?.name?.label || "I am"}
                      </span>
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder={
                        t?.form?.fields?.name?.placeholder ||
                        "Enter your full name"
                      }
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 text-sm transition-colors bg-white border-2 rounded-lg sm:px-4 border-sky-200 focus:border-sky-400 focus:outline-none sm:text-base"
                      required
                    />
                  </div>

                  {/* Country Dropdown */}
                  <div className="p-4 bg-white border shadow-sm rounded-xl border-sky-100">
                    <div className="flex items-center mb-2 space-x-3">
                      <Globe className="w-5 h-5 text-sky-500" />
                      <span className="text-sm font-medium text-gray-700 sm:text-base">
                        {serviceType === "visit"
                          ? (t?.formLabels?.livingIn || "Living In")
                          : t?.form?.fields?.country?.label ||
                            (t?.formLabels?.destinationCountry || "Destination Country")}
                      </span>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowCitizenCountryDropdown(
                            !showCitizenCountryDropdown
                          )
                        }
                        className="flex items-center justify-between w-full px-3 py-3 text-sm text-left transition-colors bg-white border-2 rounded-lg sm:px-4 border-sky-200 focus:border-sky-400 focus:outline-none hover:border-sky-300 sm:text-base"
                      >
                        <span
                          className={
                            formData.citizenCountry
                              ? "text-gray-900"
                              : "text-gray-400"
                          }
                        >
                          {formData.citizenCountry ||
                            (serviceType === "visit"
                              ? (t?.formLabels?.selectDestinationForInvitation || "Select destination for invitation")
                              : t?.form?.fields?.country?.placeholder ||
                                (t?.formLabels?.selectDestination || "Select your destination"))}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-sky-500 transition-transform ${showCitizenCountryDropdown ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Country Dropdown */}
                      {showCitizenCountryDropdown && (
                        <div className="absolute z-20 w-full mt-2 overflow-y-auto bg-white border-2 shadow-xl border-sky-200 rounded-xl max-h-48">
                          {availableCountries.map((country) => (
                            <button
                              key={country}
                              type="button"
                              onClick={() =>
                                handleCitizenCountrySelect(country)
                              }
                              className="w-full px-3 py-3 text-sm text-left transition-colors border-b sm:px-4 hover:bg-sky-50 hover:text-sky-700 border-sky-100 last:border-b-0 sm:text-base"
                            >
                              {country}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {(serviceType === "visit" ||
                      serviceType === "migrate" ||
                      serviceType === "work") && (
                      <div className="mt-2 text-xs text-gray-500"></div>
                    )}
                  </div>

                  <div className="p-4 bg-white border shadow-sm rounded-xl border-sky-100">
                    <div className="flex items-center mb-2 space-x-3">
                      <Globe className="w-5 h-5 text-sky-500" />
                      <span className="text-sm font-medium text-gray-700 sm:text-base">
                        {t?.formLabels?.currentlyLivingIn || "Currently Living in"}
                      </span>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentCountryDropdown(
                            !showCurrentCountryDropdown
                          )
                        }
                        className="flex items-center justify-between w-full px-3 py-3 text-sm text-left transition-colors bg-white border-2 rounded-lg sm:px-4 border-sky-200 focus:border-sky-400 focus:outline-none hover:border-sky-300 sm:text-base"
                      >
                        <span
                          className={
                            formData.currentCountry
                              ? "text-gray-900"
                              : "text-gray-400"
                          }
                        >
                          {formData.currentCountry ||
                            (t?.formLabels?.selectCurrentCountry || "Select your current country")}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-sky-500 transition-transform ${showCurrentCountryDropdown ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Country Dropdown */}
                      {showCurrentCountryDropdown && (
                        <div className="absolute z-20 w-full mt-2 overflow-y-auto bg-white border-2 shadow-xl border-sky-200 rounded-xl max-h-48">
                          {availableCountries.map((country) => (
                            <button
                              key={country}
                              type="button"
                              onClick={() =>
                                handleCurrentCountrySelect(country)
                              }
                              className="w-full px-3 py-3 text-sm text-left transition-colors border-b sm:px-4 hover:bg-sky-50 hover:text-sky-700 border-sky-100 last:border-b-0 sm:text-base"
                            >
                              {country}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Destination Dropdown */}
                <div className="p-4 bg-white border shadow-sm rounded-xl border-sky-100">
                  <div className="flex items-center mb-2 space-x-3">
                    <MapPin className="w-5 h-5 text-sky-500" />
                    <span className="text-sm font-medium text-gray-700 sm:text-base">
                      {t?.formLabels?.destination || "Destination"}
                    </span>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowDestinationDropdown(!showDestinationDropdown)
                      }
                      className="flex items-center justify-between w-full px-3 py-3 text-sm text-left transition-colors bg-white border-2 rounded-lg sm:px-4 border-sky-200 focus:border-sky-400 focus:outline-none hover:border-sky-300 sm:text-base"
                    >
                      <span
                        className={
                          formData.destination
                            ? "text-gray-900"
                            : "text-gray-400"
                        }
                      >
                        {formData.destination || (t?.formLabels?.selectDestination || "Select destination")}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-sky-500 transition-transform ${showDestinationDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Destination Dropdown */}
                    {showDestinationDropdown && (
                      <div className="absolute z-20 w-full mt-2 overflow-y-auto bg-white border-2 shadow-xl border-sky-200 rounded-xl max-h-48">
                        {availableDestinations.map((destination) => (
                          <button
                            key={destination}
                            type="button"
                            onClick={() => handleDestinationSelect(destination)}
                            className="w-full px-3 py-3 text-sm text-left transition-colors border-b sm:px-4 hover:bg-sky-50 hover:text-sky-700 border-sky-100 last:border-b-0 sm:text-base"
                          >
                            🇹🇷 {destination}
                          </button>
                        ))}
                      </div>
                    )}
                    {(serviceType === "visit" ||
                      serviceType === "migrate" ||
                      serviceType === "work") && (
                      <div className="mt-2 text-xs text-gray-500">
                        {serviceType === "visit"
                          ? (t?.formLabels?.wantsInvitationFor || "Wants an Invitation For:")
                          : serviceType === "migrate"
                            ? (t?.formLabels?.wantsToMigrateTo || "Wants to Migrate to:")
                            : (t?.formLabels?.wantsToWorkIn || "Wants to Work in:")}
                      </div>
                    )}
                  </div>
                </div>

                {/* NEW SERVICE-SPECIFIC OPTIONS DROPDOWN */}
                <div className="p-4 bg-white border shadow-sm rounded-xl border-sky-100">
                  <div className="flex items-center mb-2 space-x-3">
                    {serviceOptionConfig.icon}
                    <span className="text-sm font-medium text-gray-700 sm:text-base">
                      {serviceOptionConfig.label}
                    </span>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowServiceOptionDropdown(!showServiceOptionDropdown)
                      }
                      className="flex items-center justify-between w-full px-3 py-3 text-sm text-left transition-colors bg-white border-2 rounded-lg sm:px-4 border-sky-200 focus:border-sky-400 focus:outline-none hover:border-sky-300 sm:text-base"
                    >
                      <span
                        className={
                          formData.serviceOption
                            ? "text-gray-900"
                            : "text-gray-400"
                        }
                      >
                        {formData.serviceOption ||
                          serviceOptionConfig.placeholder}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-sky-500 transition-transform ${showServiceOptionDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Service Options Dropdown */}
                    {showServiceOptionDropdown && (
                      <div className="absolute z-20 w-full mt-2 overflow-y-auto bg-white border-2 shadow-xl border-sky-200 rounded-xl max-h-48">
                        {availableServiceOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleServiceOptionSelect(option)}
                            className="w-full px-3 py-3 text-sm text-left transition-colors border-b sm:px-4 hover:bg-sky-50 hover:text-sky-700 border-sky-100 last:border-b-0 sm:text-base"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Section */}
                <div className="p-4 bg-white border shadow-sm rounded-xl border-sky-100">
                  <div className="flex items-center mb-4 space-x-3">
                    <Phone className="w-5 h-5 text-sky-500" />
                    <h4 className="text-lg font-medium text-gray-800">
                      {t?.form?.contact?.title || "Contact Information"}
                    </h4>
                  </div>

                  {/* Personal Phone Input */}
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {t?.form?.contact?.personalPhone?.label ||
                        "Personal Mobile Number"}
                    </label>
                    <div className="flex gap-2 sm:gap-3">
                      {/* Personal Country Code Dropdown */}
                      <div className="relative w-24 sm:w-32">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPersonalCodeDropdown(
                              !showPersonalCodeDropdown
                            );
                            setShowWhatsappCodeDropdown(false);
                          }}
                          onKeyDown={(e) => handleKeyPress(e, "personal")}
                          className="flex items-center justify-between w-full px-1 py-3 text-left transition-colors bg-white border-2 rounded-lg sm:px-2 border-sky-200 focus:border-sky-400 focus:outline-none hover:border-sky-300"
                        >
                          <span className="text-xs truncate sm:text-sm">
                            {(() => {
                              const country = (t?.countryCodes || []).find(
                                (c) => c.code === formData.personalCountryCode
                              );
                              return country
                                ? `${country.flag} ${country.code}`
                                : "🇺🇸 +1";
                            })()}
                          </span>
                          <ChevronDown
                            className={`w-3 h-3 sm:w-4 sm:h-4 text-sky-500 transition-transform ${showPersonalCodeDropdown ? "rotate-180" : ""}`}
                          />
                        </button>

                        {showPersonalCodeDropdown && (
                          <div className="absolute z-30 w-full mt-1 overflow-hidden bg-white border-2 shadow-xl border-sky-200 rounded-xl max-h-60">
                            {/* Search Input */}
                            <div className="p-2 border-b border-sky-100">
                              <input
                                type="text"
                                placeholder={
                                  t?.form?.contact?.countryCodeSearch ||
                                  "Search country..."
                                }
                                value={personalCodeSearch}
                                onChange={(e) =>
                                  setPersonalCodeSearch(e.target.value)
                                }
                                className="w-full px-2 py-2 text-xs border rounded-lg sm:px-3 sm:text-sm border-sky-200 focus:border-sky-400 focus:outline-none"
                                autoFocus
                              />
                            </div>
                            <div className="overflow-y-auto max-h-48">
                              {filterCountryCodes(personalCodeSearch).map(
                                (country) => (
                                  <button
                                    key={country.code}
                                    type="button"
                                    onClick={() =>
                                      handleCountryCodeSelect(
                                        country.code,
                                        "personal"
                                      )
                                    }
                                    className="flex items-center w-full px-2 py-2 space-x-1 text-xs text-left transition-colors border-b sm:px-3 hover:bg-sky-50 hover:text-sky-700 border-sky-50 last:border-b-0 sm:space-x-2 sm:text-sm"
                                  >
                                    <span>{country.flag}</span>
                                    <span className="font-medium">
                                      {country.code}
                                    </span>
                                    <span className="hidden text-gray-600 truncate sm:inline">
                                      {country.name}
                                    </span>
                                  </button>
                                )
                              )}
                              {filterCountryCodes(personalCodeSearch).length ===
                                0 && (
                                <div className="px-2 py-4 text-xs text-center text-gray-500 sm:px-3 sm:text-sm">
                                  {t?.form?.contact?.noResults ||
                                    "No countries found"}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        type="tel"
                        name="personalPhone"
                        placeholder={
                          t?.form?.contact?.personalPhone?.placeholder ||
                          "Personal Mobile Number"
                        }
                        value={formData.personalPhone}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-3 text-sm transition-colors bg-white border-2 rounded-lg sm:px-4 border-sky-200 focus:border-sky-400 focus:outline-none sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* WhatsApp Toggle */}
                  <div className="flex items-center justify-between p-3 mb-4 border border-green-200 sm:p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="text-xl sm:text-2xl">📱</span>
                      <span className="text-sm font-medium text-gray-700 sm:text-base">
                        {t?.form?.contact?.whatsappToggle?.label ||
                          "This number is on WhatsApp"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleChange("isWhatsAppSame")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        formData.isWhatsAppSame ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                          formData.isWhatsAppSame
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* WhatsApp Number (only show if toggle is off) */}
                  {!formData.isWhatsAppSame && (
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {t?.form?.contact?.whatsappNumber?.label ||
                          "WhatsApp Number"}
                      </label>
                      <div className="flex gap-2 sm:gap-3">
                        {/* WhatsApp Country Code Dropdown */}
                        <div className="relative w-24 sm:w-32">
                          <button
                            type="button"
                            onClick={() => {
                              setShowWhatsappCodeDropdown(
                                !showWhatsappCodeDropdown
                              );
                              setShowPersonalCodeDropdown(false);
                            }}
                            onKeyDown={(e) => handleKeyPress(e, "whatsapp")}
                            className="flex items-center justify-between w-full px-1 py-3 text-left transition-colors bg-white border-2 rounded-lg sm:px-2 border-sky-200 focus:border-sky-400 focus:outline-none hover:border-sky-300"
                          >
                            <span className="text-xs truncate sm:text-sm">
                              {(() => {
                                const country = (t?.countryCodes || []).find(
                                  (c) => c.code === formData.whatsappCountryCode
                                );
                                return country
                                  ? `${country.flag} ${country.code}`
                                  : "🇺🇸 +1";
                              })()}
                            </span>
                            <ChevronDown
                              className={`w-3 h-3 sm:w-4 sm:h-4 text-sky-500 transition-transform ${showWhatsappCodeDropdown ? "rotate-180" : ""}`}
                            />
                          </button>

                          {showWhatsappCodeDropdown && (
                            <div className="absolute z-30 w-full mt-1 overflow-hidden bg-white border-2 shadow-xl border-sky-200 rounded-xl max-h-60">
                              {/* Search Input */}
                              <div className="p-2 border-b border-sky-100">
                                <input
                                  type="text"
                                  placeholder={
                                    t?.form?.contact?.countryCodeSearch ||
                                    "Search country..."
                                  }
                                  value={whatsappCodeSearch}
                                  onChange={(e) =>
                                    setWhatsappCodeSearch(e.target.value)
                                  }
                                  className="w-full px-2 py-2 text-xs border rounded-lg sm:px-3 sm:text-sm border-sky-200 focus:border-sky-400 focus:outline-none"
                                  autoFocus
                                />
                              </div>
                              <div className="overflow-y-auto max-h-48">
                                {filterCountryCodes(whatsappCodeSearch).map(
                                  (country) => (
                                    <button
                                      key={country.code}
                                      type="button"
                                      onClick={() =>
                                        handleCountryCodeSelect(
                                          country.code,
                                          "whatsapp"
                                        )
                                      }
                                      className="flex items-center w-full px-2 py-2 space-x-1 text-xs text-left transition-colors border-b sm:px-3 hover:bg-sky-50 hover:text-sky-700 border-sky-50 last:border-b-0 sm:space-x-2 sm:text-sm"
                                    >
                                      <span>{country.flag}</span>
                                      <span className="font-medium">
                                        {country.code}
                                      </span>
                                      <span className="hidden text-gray-600 truncate sm:inline">
                                        {country.name}
                                      </span>
                                    </button>
                                  )
                                )}
                                {filterCountryCodes(whatsappCodeSearch)
                                  .length === 0 && (
                                  <div className="px-2 py-4 text-xs text-center text-gray-500 sm:px-3 sm:text-sm">
                                    {t?.form?.contact?.noResults ||
                                      "No countries found"}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <input
                          type="tel"
                          name="whatsappPhone"
                          placeholder={
                            t?.form?.contact?.whatsappNumber?.placeholder ||
                            "WhatsApp Number"
                          }
                          value={formData.whatsappPhone}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-3 text-sm transition-colors bg-white border-2 rounded-lg sm:px-4 border-sky-200 focus:border-sky-400 focus:outline-none sm:text-base"
                          required={!formData.isWhatsAppSame}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="flex items-center mb-2 space-x-3">
                    <Mail className="w-5 h-5 text-sky-500" />
                    <span className="text-sm font-medium text-gray-700 sm:text-base">
                      {t?.form?.contact?.email?.label || "Email Address"}
                    </span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder={
                      t?.form?.contact?.email?.placeholder ||
                      "your.email@example.com"
                    }
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 text-sm transition-colors bg-white border-2 rounded-lg sm:px-4 border-sky-200 focus:border-sky-400 focus:outline-none sm:text-base"
                    required
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center justify-between p-3 border sm:p-4 bg-sky-50 rounded-xl border-sky-200">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-xl sm:text-2xl">✅</span>
                    <span className="text-sm font-medium text-gray-700 sm:text-base">
                      {t?.form?.terms?.label ||
                        "I accept the Terms & Conditions"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange("acceptTerms")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                      formData.acceptTerms ? "bg-sky-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                        formData.acceptTerms ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Submit Button - Fixed at bottom */}
                <div className="pt-4 mt-auto">
                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !formData.name ||
                      !formData.citizenCountry ||
                      !formData.currentCountry ||
                      !formData.serviceOption ||
                      !formData.personalPhone ||
                      (!formData.isWhatsAppSame && !formData.whatsappPhone) ||
                      !formData.email ||
                      !formData.acceptTerms
                    }
                    className={`w-full py-3 sm:py-4 text-white font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r ${config.gradient} hover:shadow-lg hover:scale-105 transform flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base`}
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="w-5 h-5 text-white animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
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
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        <span>{t?.formLabels?.submitting || t?.form?.submitting || "Submitting..."}</span>
                      </>
                    ) : (
                      <>
                        <span>{t?.form?.submitButton || "Submit Form"}</span>
                        <span>📤</span>
                      </>
                    )}
                  </button>

                  {/* Consultation Link */}
                  <div className="pt-3 mt-4 text-center border-t border-sky-200">
                    <p className="mb-2 text-xs text-gray-600 sm:text-sm">
                      {t?.form?.consultation?.text ||
                        "Need guidance before proceeding?"}
                    </p>
                    <a href="/contact-us">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex items-center space-x-2 text-xs font-medium transition-colors text-sky-600 hover:text-sky-800 hover:underline sm:text-sm"
                      >
                        <span>
                          {t?.form?.consultation?.linkText ||
                            "Get Free Consultation"}
                        </span>
                        <span>🗓️</span>
                      </button>
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePopupForm;
