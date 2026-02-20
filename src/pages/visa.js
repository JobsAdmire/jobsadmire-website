import { useState } from "react";
import {
  ChevronDown,
  MessageCircle,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Calendar,
  AlertCircle,
  Sparkles,
  Globe,
  Plane,
} from "lucide-react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import visaData from "../data/visaData.json";
import { COUNTRIES_LIST } from "@/lib/utils/countries";
// Sample visa data (replace with your actual visaData.json import)

// Visa Requirements Display Component
const VisaRequirementsDisplay = ({
  citizenCountry,
  destinationCountry,
  visaType,
}) => {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("Tourism & Business");

  // Generate key for visa data lookup
  const getVisaKey = (citizen, destination) => {
    return `${citizen}-${destination}`;
  };

  // Get current visa data based on selected tab
  const getTabData = () => {
    const countryData =
      visaData[getVisaKey(citizenCountry, destinationCountry)] ||
      visaData["Pakistan-UK"];
    return countryData[activeTab] || countryData["Tourism & Business"];
  };

  const currentVisaData = getTabData();

  if (!citizenCountry || !destinationCountry) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-sky-50 to-white py-16 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-sky-300 rounded-full opacity-25"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="relative">
              <img
                src={`https://flagcdn.com/w40/${citizenCountry === "UK" ? "gb" : citizenCountry.toLowerCase().replace(" ", "-")}.png`}
                alt={citizenCountry}
                className="w-12 h-8 rounded-lg shadow-lg border-2 border-white"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-sky-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="text-sky-500 h-8 w-8 transform rotate-45" />
              <div className="w-16 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500"></div>
            </div>
            <div className="relative">
              <img
                src={`https://flagcdn.com/w40/${destinationCountry === "UK" ? "gb" : destinationCountry.toLowerCase()}.png`}
                alt={destinationCountry}
                className="w-12 h-8 rounded-lg shadow-lg border-2 border-white"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-3">
            {t("labels.visaPage.visaRequirementsFor", { destination: destinationCountry, citizen: citizenCountry })}
          </h2>
          <p className="text-gray-600 text-lg">
            {t("labels.visaPage.completeGuide")}
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 rounded-full ${currentVisaData.required ? "bg-red-100" : "bg-green-100"}`}
              >
                {currentVisaData.required ? (
                  <XCircle className="h-6 w-6 text-red-500" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>
              <span className="font-semibold text-gray-800">{t("labels.visaPage.visaStatus")}</span>
            </div>
            <p className="text-gray-600 font-medium">
              {currentVisaData.required ? t("labels.visaPage.visaRequired") : t("labels.visaPage.visaNotRequired")}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-sky-100">
                <Clock className="h-6 w-6 text-sky-500" />
              </div>
              <span className="font-semibold text-gray-800">
                {t("labels.visaPage.processingTime")}
              </span>
            </div>
            <p className="text-gray-600 font-medium">
              {currentVisaData.processingTime}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-500" />
              </div>
              <span className="font-semibold text-gray-800">{t("labels.visaPage.validity")}</span>
            </div>
            <p className="text-gray-600 font-medium">
              {currentVisaData.validity}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-green-100">
                <CreditCard className="h-6 w-6 text-green-500" />
              </div>
              <span className="font-semibold text-gray-800">{t("labels.visaPage.visaFees")}</span>
            </div>
            <p className="text-gray-600 font-medium">{currentVisaData.fees}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-sky-100">
            <nav className="flex space-x-2">
              {[{ key: "Tourism & Business", label: t("labels.visaPage.tourismBusiness") }, { key: "Work & Immigration", label: t("labels.visaPage.workImmigration") }].map((tabItem) => (
                <button
                  key={tabItem.key}
                  onClick={() => setActiveTab(tabItem.key)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tabItem.key
                      ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-sky-600 hover:bg-sky-50"
                  }`}
                >
                  {tabItem.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Visa Types */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-sky-100 p-8 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6 text-sky-500" />
                <h3 className="font-bold text-gray-800 text-lg">
                  {t("labels.visaPage.availableVisaTypes")}
                </h3>
              </div>
              <div className="space-y-4">
                {currentVisaData.visaTypes.map((visa, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:shadow-md ${
                      visa.status === "required"
                        ? "border-l-red-500 bg-gradient-to-r from-red-50 to-red-25"
                        : visa.status === "allowed"
                          ? "border-l-green-500 bg-gradient-to-r from-green-50 to-green-25"
                          : "border-l-sky-500 bg-gradient-to-r from-sky-50 to-sky-25"
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-1">
                      {visa.name}
                    </div>
                    <div
                      className={`text-sm font-medium capitalize ${
                        visa.status === "required"
                          ? "text-red-600"
                          : visa.status === "allowed"
                            ? "text-green-600"
                            : "text-sky-600"
                      }`}
                    >
                      {visa.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-sky-100 p-8">
              {/* Biometrics and Interview Requirements */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-6 text-lg flex items-center gap-2">
                  <Globe className="h-6 w-6 text-sky-500" />
                  {t("labels.visaPage.additionalRequirements")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-sky-50 border border-sky-100">
                    <div
                      className={`p-2 rounded-full ${currentVisaData.biometrics ? "bg-green-100" : "bg-red-100"}`}
                    >
                      {currentVisaData.biometrics ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {currentVisaData.biometrics ? t("labels.visaPage.biometricsRequired") : t("labels.visaPage.biometricsNotRequired")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-sky-50 border border-sky-100">
                    <div
                      className={`p-2 rounded-full ${currentVisaData.interview ? "bg-orange-100" : "bg-green-100"}`}
                    >
                      {currentVisaData.interview ? (
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {currentVisaData.interview ? t("labels.visaPage.interviewRequired") : t("labels.visaPage.interviewNotRequired")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Application Form Section */}
              {currentVisaData.required && (
                <div className="mb-8 p-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-200">
                  <h4 className="font-bold text-gray-800 mb-3 text-lg">
                    {t("labels.visaPage.fillOutApplication", { destination: destinationCountry })}
                  </h4>
                  <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                    {t("labels.visaPage.getStarted")}
                  </button>
                </div>
              )}

              {/* Required Documents */}
              <div>
                <h3 className="font-bold text-gray-800 mb-6 text-lg">
                  {currentVisaData.required
                    ? t("labels.visaPage.provideDigitalCopies")
                    : t("labels.visaPage.requiredDocumentsForEntry")}
                </h3>
                <div className="space-y-6">
                  {currentVisaData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-sky-25 to-white border border-sky-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {doc.title}
                        </h4>
                        <p className="text-gray-600">{doc.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              {currentVisaData.required && (
                <div className="mt-8 pt-8 border-t border-sky-200">
                  <button className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                    {t("labels.visaPage.applyForVisa", { destination: destinationCountry })}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Visa Page Component
const VisaRequirementsPage = () => {
  const { t } = useTranslation("common");
  const [selectedCitizen, setSelectedCitizen] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [showExpandedForm, setShowExpandedForm] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [visaType, setVisaType] = useState("Tourist visa (convenient)");
  const [livingIn, setLivingIn] = useState("");

  // All countries for citizenship selection
  const allCountries = COUNTRIES_LIST;

  // Limited destination countries
  const destinationCountries = ["UK", "USA", "Canada", "Turkey", "Australia"];

  const handleSearch = () => {
    if (selectedCitizen && selectedDestination) {
      setShowExpandedForm(true);
      setShowRequirements(true);
      setLivingIn(selectedCitizen);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getBackgroundImage = () => {
    if (showExpandedForm) {
      const backgrounds = {
        UK: "url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        USA: "url('https://images.unsplash.com/photo-1485738422979-f5c462d49f74?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        Canada:
          "url('https://images.unsplash.com/photo-1503614472-8c93d56cd22b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        Turkey:
          "url('https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        Australia:
          "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
      };
      return backgrounds[selectedDestination] || backgrounds["UK"];
    }
    return "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: getBackgroundImage() }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/70 via-blue-900/60 to-sky-800/70"></div>
        </div>

        <div className="relative z-10 flex flex-col pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]">
          <div className="bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-3 text-white text-sm font-semibold shadow-lg">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              {t("labels.visaPage.passportControl")}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-7xl">
              {!showExpandedForm ? (
                <div className="text-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl mb-6">
                      <Globe className="h-10 w-10 text-sky-500" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                      {t("labels.visaPage.travelVisaRequirements")}
                    </h1>
                  </div>
                  <p className="text-xl text-sky-100 mb-2">
                    {t("labels.visaPage.journeyBegins")}
                  </p>
                  <p className="text-lg text-sky-200 mb-16">
                    {t("labels.visaPage.checkDestination")}
                  </p>

                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto border border-sky-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="relative">
                        <label className="block text-sky-700 text-sm font-semibold mb-3 text-left">
                          {t("labels.visaPage.forCitizensOf")}
                        </label>
                        <select
                          value={selectedCitizen}
                          onChange={(e) => setSelectedCitizen(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="w-full p-4 border-2 border-sky-200 rounded-2xl text-gray-800 bg-white focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-300 appearance-none font-medium"
                        >
                          <option value="">{t("labels.visaPage.selectCountry")}</option>
                          {allCountries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-12 h-6 w-6 text-sky-400 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <label className="block text-sky-700 text-sm font-semibold mb-3 text-left">
                          {t("labels.visaPage.travelingTo")}
                        </label>
                        <select
                          value={selectedDestination}
                          onChange={(e) =>
                            setSelectedDestination(e.target.value)
                          }
                          onKeyPress={handleKeyPress}
                          className="w-full p-4 border-2 border-sky-200 rounded-2xl text-gray-800 bg-white focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-300 appearance-none font-medium"
                        >
                          <option value="">{t("labels.visaPage.selectDestination")}</option>
                          {destinationCountries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-12 h-6 w-6 text-sky-400 pointer-events-none" />
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={handleSearch}
                          disabled={!selectedCitizen || !selectedDestination}
                          className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
                        >
                          {t("labels.visaPage.checkRequirements")}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-12 mt-12 text-white">
                    <div className="flex items-center gap-3 cursor-pointer hover:text-sky-300 transition-all duration-300 transform hover:scale-110">
                      <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{t("labels.visaPage.liveChat")}</span>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer hover:text-sky-300 transition-all duration-300 transform hover:scale-110">
                      <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{t("labels.visaPage.whatsApp")}</span>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer hover:text-sky-300 transition-all duration-300 transform hover:scale-110">
                      <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{t("labels.visaPage.clickToCall")}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center gap-4 mb-8">
                    <div className="relative">
                      <img
                        src={`https://flagcdn.com/w40/${selectedDestination === "UK" ? "gb" : selectedDestination.toLowerCase()}.png`}
                        alt={selectedDestination}
                        className="w-16 h-12 rounded-xl shadow-lg border-4 border-white"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-sky-400 rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                    <h1 className="text-5xl font-bold text-white">
                      {selectedDestination}
                      <span className="block text-sky-300">{t("labels.visaPage.visa")}</span>
                    </h1>
                  </div>

                  <p className="text-lg text-sky-200 mb-16">
                    {t("labels.visaPage.weHelpYou")}
                  </p>

                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-7xl mx-auto border border-sky-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="relative">
                        <label className="block text-sky-700 text-sm font-semibold mb-3 text-left">
                          {t("labels.visaPage.yourTravelDestination")}
                        </label>
                        <select
                          value={selectedDestination}
                          onChange={(e) =>
                            setSelectedDestination(e.target.value)
                          }
                          className="w-full p-4 border-2 border-sky-200 rounded-2xl text-gray-800 bg-white focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-300 appearance-none font-medium"
                        >
                          {destinationCountries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-12 h-6 w-6 text-sky-400 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <label className="block text-sky-700 text-sm font-semibold mb-3 text-left">
                          {t("labels.visaPage.visaType")}
                        </label>
                        <select
                          value={visaType}
                          onChange={(e) => setVisaType(e.target.value)}
                          className="w-full p-4 border-2 border-sky-200 rounded-2xl text-gray-800 bg-white focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-300 appearance-none font-medium"
                        >
                          <option value="Tourist visa (convenient)">
                            {t("labels.visaPage.touristVisaConvenient")}
                          </option>
                          <option value="Business visa">{t("labels.visaPage.businessVisa")}</option>
                          <option value="Student visa">{t("labels.visaPage.studentVisa")}</option>
                          <option value="Work visa">{t("labels.visaPage.workVisa")}</option>
                          <option value="Transit visa">{t("labels.visaPage.transitVisa")}</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-12 h-6 w-6 text-sky-400 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <label className="block text-sky-700 text-sm font-semibold mb-3 text-left">
                          {t("labels.visaPage.yourCitizenship")}
                        </label>
                        <select
                          value={selectedCitizen}
                          onChange={(e) => setSelectedCitizen(e.target.value)}
                          className="w-full p-4 border-2 border-sky-200 rounded-2xl text-gray-800 bg-white focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-300 appearance-none font-medium"
                        >
                          {allCountries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-12 h-6 w-6 text-sky-400 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <label className="block text-sky-700 text-sm font-semibold mb-3 text-left">
                          living in
                        </label>
                        <select
                          value={livingIn}
                          onChange={(e) => setLivingIn(e.target.value)}
                          className="w-full p-4 border-2 border-sky-200 rounded-2xl text-gray-800 bg-white focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-300 appearance-none font-medium"
                        >
                          {allCountries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-12 h-6 w-6 text-sky-400 pointer-events-none" />
                      </div>

                      <div className="flex items-end">
                        <a href="/apply-online">
                          {" "}
                          <button className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl">
                            Apply Now
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-12 mt-12 text-white">
                    <div className="flex items-center gap-3 cursor-pointer hover:text-sky-300 transition-all duration-300 transform hover:scale-110">
                      <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{t("labels.visaPage.liveChat")}</span>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer hover:text-sky-300 transition-all duration-300 transform hover:scale-110">
                      <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{t("labels.visaPage.whatsApp")}</span>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer hover:text-sky-300 transition-all duration-300 transform hover:scale-110">
                      <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{t("labels.visaPage.callUsFree")}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowExpandedForm(false);
                      setShowRequirements(false);
                    }}
                    className="mt-12 text-white hover:text-sky-300 transition-all duration-300 underline font-medium flex items-center gap-2 mx-auto group"
                  >
                    <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
                      ←
                    </span>
                    Back to search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visa Requirements Display */}
      {showRequirements && (
        <VisaRequirementsDisplay
          citizenCountry={selectedCitizen}
          destinationCountry={selectedDestination}
          visaType={visaType}
        />
      )}
    </div>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default VisaRequirementsPage;
