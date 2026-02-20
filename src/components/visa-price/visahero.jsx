import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "@/lib/utils/toast";
import {
  ChevronDown,
  Search,
  MapPin,
  Home,
  Star,
  Clock,
  CheckCircle,
  Plane,
} from "lucide-react";
import VisaApplicationPopup from "./VisaApplicationPopup";
import { env } from "@/lib/constants/env";

// Import translation files for all 7 languages
import enTranslations from "../../../public/locales/en/travel.json";
import trTranslations from "../../../public/locales/tr/travel.json";
import frTranslations from "../../../public/locales/fr/travel.json";
import deTranslations from "../../../public/locales/de/travel.json";
import arTranslations from "../../../public/locales/ar/travel.json";
import ruTranslations from "../../../public/locales/ru/travel.json";
import faTranslations from "../../../public/locales/fa/travel.json";

const getTranslations = (locale) => {
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
};

const visaDestinations = [
  {
    name: "Turkey",
    flag: "🇹🇷",
    backgroundImage:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    pricing: {
      "Individual Tourist Invitation": { current: 499, base: 599 },
      "Individual Business Invitation": { current: 475, base: 550 },
      "Family Tourist Invitation": { current: 75, base: 115 },
    },
  },

  {
    name: "China",
    flag: "🇨🇳",
    backgroundImage:
      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    pricing: {
      "Individual Tourist Invitation": { current: 499, base: 599 },
      "Individual Business Invitation": { current: 475, base: 550 },
      "Family Tourist Invitation": { current: 75, base: 115 },
    },
  },
  {
    name: "Albania",
    flag: "🇦🇱",
    backgroundImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    pricing: {
      "Individual Tourist Invitation": { current: 499, base: 599 },
      "Individual Business Invitation": { current: 475, base: 550 },
      "Family Tourist Invitation": { current: 75, base: 115 },
    },
  },
  {
    name: "Kazakhstan",
    flag: "🇰🇿",
    backgroundImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    pricing: {
      "Individual Tourist Invitation": { current: 499, base: 599 },
      "Individual Business Invitation": { current: 475, base: 550 },
      "Family Tourist Invitation": { current: 75, base: 115 },
    },
  },
  {
    name: "Dubai",
    flag: "🇦🇪",
    backgroundImage:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    pricing: {
      "Individual Tourist Invitation": { current: 499, base: 599 },
      "Individual Business Invitation": { current: 475, base: 550 },
      "Family Tourist Invitation": { current: 75, base: 115 },
    },
  },
  {
    name: "Portugal",
    flag: "🇵🇹",
    backgroundImage:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    pricing: {
      "Individual Tourist Invitation": { current: 499, base: 599 },
      "Individual Business Invitation": { current: 475, base: 550 },
      "Family Tourist Invitation": { current: 75, base: 115 },
    },
  },
];

// Helper function to update URL parameters
const updateURLParams = (params) => {
  if (typeof window !== "undefined") {
    const url = new URL(window.location);

    // Update or remove parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    // Update the URL without reloading the page
    window.history.replaceState({}, "", url.toString());
  }
};

// Helper function to get URL parameters
const getURLParams = () => {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      fromCountry: urlParams.get("from") || "",
      toCountry: urlParams.get("to") || "",
      destination: urlParams.get("destination") || "",
    };
  }
  return { fromCountry: "", toCountry: "", destination: "" };
};

// Main App Component
export default function TravelApp() {
  const router = useRouter();
  const { locale } = router;
  const t = getTranslations(locale);

  const [countries, setCountries] = useState([]);
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [visaDestination, setVisaDestination] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    fetchCountries();
    handleUrlParameters();
  }, []);

  // Handle URL parameters for direct navigation and initial load
  const handleUrlParameters = () => {
    const urlParams = getURLParams();

    if (urlParams.fromCountry) {
      setFromCountry(urlParams.fromCountry);
    }

    if (urlParams.toCountry) {
      setToCountry(urlParams.toCountry);
    }

    if (urlParams.destination) {
      // Handle both full names and short names for destinations
      const destinationMap = {
        turkey: "Turkey",
        dubai: "Dubai",
        albania: "Albania",
        kazakhstan: "Kazakhstan",
        portugal: "Portugal",
        china: "China",
      };

      const mappedDestination =
        destinationMap[urlParams.destination.toLowerCase()] ||
        urlParams.destination;

      // Verify the destination exists in our visa destinations
      const validDestination = visaDestinations.find(
        (dest) => dest.name.toLowerCase() === mappedDestination.toLowerCase()
      );

      if (validDestination) {
        setVisaDestination(validDestination.name);

        // Auto-scroll to packages section after a short delay if all params are present
        if (urlParams.fromCountry && urlParams.toCountry) {
          setTimeout(() => {
            const packagesElement = document.getElementById("packages");
            if (packagesElement) {
              packagesElement.scrollIntoView({ behavior: "smooth" });
            }
          }, 1000);
        }
      }
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        `${env.RESTCOUNTRIES_API_URL}/all?fields=name,flag`
      );
      const data = await response.json();

      const sortedCountries = data
        .map((country) => ({
          name: country.name.common,
          flag: country.flag,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setCountries(sortedCountries);
      setLoading(false);
    } catch (err) {
      setError(t.errors.failedToLoadCountries);
      setLoading(false);
    }
  };

  const handleGetStarted = (pkg) => {
    setSelectedPackage(pkg);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedPackage(null);
  };

  // Update URL when countries change
  const handleFromCountryChange = (countryName) => {
    setFromCountry(countryName);
    updateURLParams({
      from: countryName,
      to: toCountry,
      destination: visaDestination,
    });
  };

  const handleToCountryChange = (countryName) => {
    setToCountry(countryName);
    updateURLParams({
      from: fromCountry,
      to: countryName,
      destination: visaDestination,
    });
  };

  const handleVisaDestinationChange = (destinationName) => {
    setVisaDestination(destinationName);
    updateURLParams({
      from: fromCountry,
      to: toCountry,
      destination: destinationName,
    });
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        countries={countries}
        fromCountry={fromCountry}
        setFromCountry={handleFromCountryChange}
        toCountry={toCountry}
        setToCountry={handleToCountryChange}
        visaDestination={visaDestination}
        setVisaDestination={handleVisaDestinationChange}
        loading={loading}
        error={error}
        t={t}
      />
      <PackageSection
        fromCountry={fromCountry}
        toCountry={toCountry}
        visaDestination={visaDestination}
        onGetStarted={handleGetStarted}
        t={t}
      />

      {/* Visa Application Popup */}
      <VisaApplicationPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        selectedPackage={selectedPackage}
        countries={countries}
        loading={loading}
      />
    </div>
  );
}

// Hero Section Component
function HeroSection({
  countries,
  fromCountry,
  setFromCountry,
  toCountry,
  setToCountry,
  visaDestination,
  setVisaDestination,
  loading,
  error,
  t,
}) {
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showVisaDropdown, setShowVisaDropdown] = useState(false);
  const [fromSearchTerm, setFromSearchTerm] = useState("");
  const [toSearchTerm, setToSearchTerm] = useState("");

  // Get current background image based on selected visa destination
  const getCurrentBackgroundImage = () => {
    if (visaDestination) {
      const destination = visaDestinations.find(
        (dest) => dest.name === visaDestination
      );
      return destination
        ? destination.backgroundImage
        : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2035&q=80";
    }
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2035&q=80";
  };

  const handleFromSelect = (country) => {
    setFromCountry(country.name);
    setShowFromDropdown(false);
    setFromSearchTerm("");
  };

  const handleToSelect = (country) => {
    setToCountry(country.name);
    setShowToDropdown(false);
    setToSearchTerm("");
  };

  const handleVisaSelect = (destination) => {
    setVisaDestination(destination.name);
    setShowVisaDropdown(false);
  };

  const filteredFromCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(fromSearchTerm.toLowerCase())
  );

  const filteredToCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(toSearchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowFromDropdown(false);
        setShowToDropdown(false);
        setShowVisaDropdown(false);
        setFromSearchTerm("");
        setToSearchTerm("");
      }
    };

    if (showFromDropdown || showToDropdown || showVisaDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showFromDropdown, showToDropdown, showVisaDropdown]);

  const handleSearch = () => {
    if (fromCountry && toCountry && visaDestination) {
      document
        .getElementById("packages")
        .scrollIntoView({ behavior: "smooth" });
    } else {
      showWarning(t.alerts.selectAllFields);
    }
  };

  return (
    <div className="relative pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px] overflow-hidden">
      {/* Background Image with smooth transition */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-in-out bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('${getCurrentBackgroundImage()}')`,
        }}
      ></div>

      {/* Light Sky Blue Overlay */}
      <div className="absolute inset-0 bg-opacity-75 bg-sky-100"></div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-32 h-32 rounded-full top-20 left-20 bg-sky-300 blur-xl"></div>
        <div className="absolute w-48 h-48 bg-blue-200 rounded-full top-60 right-32 blur-2xl"></div>
        <div className="absolute w-40 h-40 rounded-full bottom-32 left-1/3 bg-cyan-200 blur-xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Hero Title */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-slate-800">
            {t.hero.title.line1}
            <br />
            {t.hero.title.line2}
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 px-4">
            {t.hero.description}
          </p>
        </div>

        {/* Search Form */}
        <div className="w-full max-w-7xl p-4 sm:p-6 md:p-8 border shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl border-sky-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* From Country */}
            <div className="relative dropdown-container">
              <label className="block mb-2 text-xs sm:text-sm font-medium text-gray-700">
                {t.form.iAmFrom}
              </label>
              <div className="relative">
                <div
                  className="flex items-center justify-between w-full p-3 sm:p-4 transition-colors border rounded-lg cursor-pointer border-sky-200 bg-sky-50 hover:bg-sky-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFromDropdown(!showFromDropdown);
                    setShowToDropdown(false);
                    setShowVisaDropdown(false);
                    setToSearchTerm("");
                  }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 flex-shrink-0" />
                    <span
                      className={`text-sm sm:text-base truncate ${
                        fromCountry ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {fromCountry ? (
                        <span className="flex items-center space-x-2">
                          <span className="text-lg">
                            {
                              countries.find((c) => c.name === fromCountry)
                                ?.flag
                            }
                          </span>
                          <span className="truncate">{fromCountry}</span>
                        </span>
                      ) : (
                        t.form.selectCountry
                      )}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-sky-500 transition-transform ${showFromDropdown ? "rotate-180" : ""}`}
                  />
                </div>

                {showFromDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-sky-200 rounded-lg shadow-xl z-[100]">
                    <div className="p-3 border-b border-sky-100">
                      <input
                        type="text"
                        placeholder={t.form.searchCountries}
                        value={fromSearchTerm}
                        onChange={(e) => setFromSearchTerm(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="overflow-y-auto max-h-60 overscroll-contain">
                      {loading ? (
                        <div className="p-4 text-center text-slate-500">
                          {t.form.loadingCountries}
                        </div>
                      ) : error ? (
                        <div className="p-4 text-center text-red-500">
                          {error}
                        </div>
                      ) : filteredFromCountries.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">
                          {t.form.noCountriesFound}
                        </div>
                      ) : (
                        filteredFromCountries.map((country) => (
                          <div
                            key={country.name}
                            className="flex items-center p-3 space-x-3 border-b cursor-pointer hover:bg-sky-50 border-sky-50 last:border-b-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFromSelect(country);
                            }}
                          >
                            <span className="flex-shrink-0 text-xl">
                              {country.flag}
                            </span>
                            <span className="truncate text-slate-900">
                              {country.name}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* To Country */}
            <div className="relative dropdown-container">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t.form.iLiveIn}
              </label>
              <div className="relative">
                <div
                  className="flex items-center justify-between w-full p-4 transition-colors border rounded-lg cursor-pointer border-sky-200 bg-sky-50 hover:bg-sky-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowToDropdown(!showToDropdown);
                    setShowFromDropdown(false);
                    setShowVisaDropdown(false);
                    setFromSearchTerm("");
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />
                    <span
                      className={
                        toCountry ? "text-slate-900" : "text-slate-500"
                      }
                    >
                      {toCountry ? (
                        <span className="flex items-center space-x-2">
                          <span className="text-lg">
                            {countries.find((c) => c.name === toCountry)?.flag}
                          </span>
                          <span className="truncate">{toCountry}</span>
                        </span>
                      ) : (
                        t.form.selectCountry
                      )}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-sky-500 transition-transform ${showToDropdown ? "rotate-180" : ""}`}
                  />
                </div>

                {showToDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-sky-200 rounded-lg shadow-xl z-[100]">
                    <div className="p-3 border-b border-sky-100">
                      <input
                        type="text"
                        placeholder={t.form.searchCountries}
                        value={toSearchTerm}
                        onChange={(e) => setToSearchTerm(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="overflow-y-auto max-h-60 overscroll-contain">
                      {loading ? (
                        <div className="p-4 text-center text-slate-500">
                          {t.form.loadingCountries}
                        </div>
                      ) : error ? (
                        <div className="p-4 text-center text-red-500">
                          {error}
                        </div>
                      ) : filteredToCountries.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">
                          {t.form.noCountriesFound}
                        </div>
                      ) : (
                        filteredToCountries.map((country) => (
                          <div
                            key={country.name}
                            className="flex items-center p-3 space-x-3 border-b cursor-pointer hover:bg-sky-50 border-sky-50 last:border-b-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToSelect(country);
                            }}
                          >
                            <span className="flex-shrink-0 text-xl">
                              {country.flag}
                            </span>
                            <span className="truncate text-slate-900">
                              {country.name}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visa Destination */}
            <div className="relative dropdown-container">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t.form.invitationFor}
              </label>
              <div className="relative">
                <div
                  className="flex items-center justify-between w-full p-4 transition-colors border rounded-lg cursor-pointer border-sky-200 bg-sky-50 hover:bg-sky-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowVisaDropdown(!showVisaDropdown);
                    setShowFromDropdown(false);
                    setShowToDropdown(false);
                    setFromSearchTerm("");
                    setToSearchTerm("");
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />
                    <span
                      className={
                        visaDestination ? "text-slate-900" : "text-slate-500"
                      }
                    >
                      {visaDestination ? (
                        <span className="flex items-center space-x-2">
                          <span className="text-lg">
                            {
                              visaDestinations.find(
                                (c) => c.name === visaDestination
                              )?.flag
                            }
                          </span>
                          <span className="truncate">{visaDestination}</span>
                        </span>
                      ) : (
                        t.form.selectDestination
                      )}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-sky-500 transition-transform ${showVisaDropdown ? "rotate-180" : ""}`}
                  />
                </div>

                {showVisaDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-sky-200 rounded-lg shadow-xl z-[100]">
                    <div className="overflow-y-auto max-h-60 overscroll-contain">
                      {visaDestinations.map((destination) => (
                        <div
                          key={destination.name}
                          className="flex items-center p-3 space-x-3 border-b cursor-pointer hover:bg-sky-50 border-sky-50 last:border-b-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVisaSelect(destination);
                          }}
                        >
                          <span className="flex-shrink-0 text-xl">
                            {destination.flag}
                          </span>
                          <span className="truncate text-slate-900">
                            {destination.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <button
                onClick={handleSearch}
                className="flex items-center justify-center w-full px-4 sm:px-6 py-3 sm:py-4 space-x-2 text-sm sm:text-base font-medium text-white transition-colors rounded-lg shadow-lg bg-sky-500 hover:bg-sky-600 hover:shadow-xl"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t.form.findNow}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Package Section Component
function PackageSection({
  fromCountry,
  toCountry,
  visaDestination,
  onGetStarted,
  t,
}) {
  const [selectedTab, setSelectedTab] = useState("Single Entry");

  // Get pricing based on selected visa destination
  const getPricingForDestination = (packageType) => {
    if (!visaDestination) {
      // Default pricing when no destination is selected
      const defaultPricing = {
        "Individual Tourist Invitation": { current: 500, base: 500 },
        "Individual Business Invitation": { current: 500, base: 500 },
        "Family Tourist Invitation": { current: 1000, base: 1000 },
      };
      return defaultPricing[packageType] || { current: 599, base: 599 };
    }

    const destination = visaDestinations.find(
      (dest) => dest.name === visaDestination
    );
    return destination
      ? destination.pricing[packageType]
      : { current: 599, base: 599 };
  };

  const getPackageTypeLabel = (type) => {
    const keyMap = {
      "Individual Tourist Invitation": "individualTouristInvitation",
      "Individual Business Invitation": "individualBusinessInvitation",
      "Family Tourist Invitation": "familyTouristInvitation",
      "Single Entry": "singleEntry",
    };
    const key = keyMap[type];
    return t.packageTypes && key && t.packageTypes[key] ? t.packageTypes[key] : type;
  };

  const packages = [
    {
      id: 1,
      type: "Individual Tourist Invitation",
      destination: visaDestination || t.packages.selectedCountry,
      processing: t.packages.processingTime48Hours,
      recommended: true,
      features: [
        t.packages.features.fastProcessing,
        t.packages.features.hours96Valid,
        t.packages.features.airportTransit,
      ],
    },
    {
      id: 2,
      type: "Individual Business Invitation",
      destination: visaDestination || t.packages.selectedCountry,
      processing: t.packages.processingTime48Hours,
      recommended: false,
      features: [
        t.packages.features.days14Valid,
        t.packages.features.touristBusinesss,
        t.packages.features.singleEntry,
      ],
    },
    {
      id: 3,
      type: "Family Tourist Invitation",
      destination: visaDestination || t.packages.selectedCountry,
      processing: t.packages.documentationProcessingTime48Hours,
      recommended: false,
      features: [
        t.packages.features.days30Valid,
        t.packages.features.touristBusiness,
        t.packages.features.singleMultipleEntry,
      ],
    },
  ];

  return (
    <div id="packages" className="px-4 py-12 sm:py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-500">
              {t.packages.title}
            </span>
          </h2>
          <p className="max-w-3xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg text-slate-600 px-4">
            {t.packages.description}
          </p>

          {/* Route Display */}
          {fromCountry && toCountry && visaDestination && (
            <div className="inline-flex items-center p-4 mb-8 space-x-4 bg-white border rounded-lg shadow-sm border-sky-200">
              <span className="text-slate-600">
                {t.packages.showingPackagesFor}
              </span>
              <span className="font-semibold text-sky-600">{fromCountry}</span>
              <span className="text-slate-400">→</span>
              <span className="font-semibold text-sky-600">{toCountry}</span>
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-green-600">
                {t.packages.packageFor} {visaDestination}
              </span>
            </div>
          )}
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {packages.map((pkg) => {
            const pricing = getPricingForDestination(pkg.type);
            const showComparison = pricing.current !== pricing.base;

            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-xl shadow-lg border hover:shadow-xl transition-shadow ${
                  pkg.recommended
                    ? "border-sky-200 ring-2 ring-sky-100"
                    : "border-gray-200"
                }`}
              >
                {/* Recommended Badge */}
                {pkg.recommended && (
                  <div className="absolute px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium text-white rounded-full -top-2 sm:-top-3 right-3 sm:right-4 bg-sky-500">
                    {t.packages.recommended}
                  </div>
                )}

                <div className="p-4 sm:p-6">
                  {/* Package Header */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="mb-2 text-lg sm:text-xl font-bold text-slate-800 break-words">
                      {getPackageTypeLabel(pkg.type)}
                    </h3>
                    <div className="inline-block px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-sky-100 text-sky-700">
                      {t.packages.packageFor} {pkg.destination}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 sm:mb-6">
                    <div className="text-2xl sm:text-3xl font-bold text-slate-800">
                      ${pricing.current} USD
                    </div>
                    {showComparison && (
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs sm:text-sm line-through text-slate-500">
                          ${pricing.base} USD
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-green-600">
                          {t.packages.save} ${pricing.base - pricing.current}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-2 text-slate-600"
                        >
                          <CheckCircle className="flex-shrink-0 w-4 h-4 text-sky-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Processing Time */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-sm">{pkg.processing}</span>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() =>
                      onGetStarted({
                        ...pkg,
                        price: pricing.current,
                      })
                    }
                    className="w-full px-6 py-3 font-medium text-white transition-colors rounded-lg bg-sky-500 hover:bg-sky-600"
                  >
                    {t.packages.getStarted}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-600">
            {t.packages.needHelp}{" "}
            <a href="#" className="font-medium text-sky-500 hover:text-sky-600">
              {t.packages.contactExperts}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
