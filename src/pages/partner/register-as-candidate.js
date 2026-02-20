import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "@/lib/utils/toast";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  CheckCircle,
  Clock,
  Users,
  Shield,
  Target,
  TrendingUp,
  Heart,
  Plane,
  Home,
  DollarSign,
  Calendar,
  FileText,
  Languages,
  Camera,
  Upload,
  Zap,
  Building,
  Factory,
  Monitor,
  Stethoscope,
  Utensils,
  HardHat,
  Truck,
  Book,
} from "lucide-react";

export default function CandidateRegistration() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    currentCountry: "",
    currentCity: "",
    phone: "",
    email: "",
    whatsapp: "",
    maritalStatus: "",
    numberOfChildren: "",

    // Professional Information
    currentJobTitle: "",
    industryExperience: "",
    yearsOfExperience: "",
    currentSalary: "",
    expectedSalary: "",
    jobPreferences: [],
    workLocations: [],
    availabilityDate: "",

    // Education
    educationLevel: "",
    fieldOfStudy: "",
    university: "",
    graduationYear: "",
    additionalCertifications: "",

    // Skills & Languages
    skills: "",
    languages: [],
    turkishLevel: "",
    englishLevel: "",

    // Documents & Legal
    passportNumber: "",
    passportExpiry: "",
    hasWorkExperience: false,
    criminalRecord: "",
    healthStatus: "",

    // Preferences
    relocationType: "",
    familyRelocation: false,
    accommodationPreference: "",
    transportationNeeds: "",

    // Additional Information
    motivation: "",
    additionalInfo: "",
    hearAboutUs: "",

    // Agreements
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToContact: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.nationality)
      newErrors.nationality = "Nationality is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.currentJobTitle.trim())
      newErrors.currentJobTitle = "Current job title is required";
    if (!formData.industryExperience)
      newErrors.industryExperience = t("labels.partnerRegister.industryExperienceRequired");
    if (!formData.educationLevel)
      newErrors.educationLevel = t("labels.partnerRegister.educationLevelRequired");
    if (formData.jobPreferences.length === 0)
      newErrors.jobPreferences = "Please select at least one job preference";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to terms and conditions";
    if (!formData.agreeToPrivacy)
      newErrors.agreeToPrivacy = "You must agree to privacy policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
      showSuccess(t("labels.partnerRegister.registrationSuccess"));
      router.push("/thankyou");
    }
  };

  const benefits = [
    { icon: <Plane className="w-6 h-6" />, titleKey: "benefit1Title", descKey: "benefit1Description" },
    { icon: <Home className="w-6 h-6" />, titleKey: "benefit2Title", descKey: "benefit2Description" },
    { icon: <DollarSign className="w-6 h-6" />, titleKey: "benefit3Title", descKey: "benefit3Description" },
    { icon: <Shield className="w-6 h-6" />, titleKey: "benefit4Title", descKey: "benefit4Description" },
  ];

  const processSteps = [
    { icon: <User className="w-8 h-8" />, titleKey: "processStep1Title", descKey: "processStep1Description" },
    { icon: <Target className="w-8 h-8" />, titleKey: "processStep2Title", descKey: "processStep2Description" },
    { icon: <FileText className="w-8 h-8" />, titleKey: "processStep3Title", descKey: "processStep3Description" },
    { icon: <Plane className="w-8 h-8" />, titleKey: "processStep4Title", descKey: "processStep4Description" },
  ];

  const jobCategories = [
    "Factory Worker",
    "Machine Operator",
    "Construction Worker",
    "Welder",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Driver",
    "Security Guard",
    "Warehouse Worker",
    "Cleaner",
    "Kitchen Staff",
    "Waiter/Waitress",
    "Hotel Staff",
    "Sales Assistant",
    "Office Assistant",
    "IT Support",
    "Software Developer",
    "Engineer",
    "Teacher",
    "Nurse",
    "Care Worker",
    "Agriculture Worker",
    "Other",
  ];

  const workLocations = [
    "Istanbul",
    "Ankara",
    "Izmir",
    "Bursa",
    "Antalya",
    "Adana",
    "Konya",
    "Gaziantep",
    "Kayseri",
    "Anywhere in Turkey",
  ];

  const languages = [
    "Turkish",
    "English",
    "Arabic",
    "Russian",
    "German",
    "French",
    "Spanish",
    "Urdu",
    "Hindi",
    "Bengali",
    "Other",
  ];

  const successStories = [
    {
      name: "Ahmed Rahman",
      country: "Bangladesh",
      job: "Factory Supervisor",
      location: "Istanbul",
      story:
        "Working in Turkey for 2 years now. Great salary, good accommodation, and learned Turkish!",
      salary: "25,000 TL/month",
    },
    {
      name: "Maria Ivanova",
      country: "Ukraine",
      job: "Software Developer",
      location: "Ankara",
      story:
        "Found my dream job in tech. The visa process was smooth and the company is amazing.",
      salary: "45,000 TL/month",
    },
    {
      name: "Hassan Ali",
      country: "Pakistan",
      job: "Construction Manager",
      location: "Izmir",
      story:
        "Turkey gave me opportunities I never had. Now my family lives here comfortably.",
      salary: "30,000 TL/month",
    },
  ];

  const turkeyFacts = [
    { icon: <TrendingUp className="w-8 h-8" />, titleKey: "fact1Title", factKey: "fact1Fact", descKey: "fact1Description" },
    { icon: <Users className="w-8 h-8" />, titleKey: "fact2Title", factKey: "fact2Fact", descKey: "fact2Description" },
    { icon: <Heart className="w-8 h-8" />, titleKey: "fact3Title", factKey: "fact3Fact", descKey: "fact3Description" },
    { icon: <Globe className="w-8 h-8" />, titleKey: "fact4Title", factKey: "fact4Fact", descKey: "fact4Description" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden text-white bg-gradient-to-r from-blue-900 via-blue-900 to-cyan-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-600/20 via-teal-700/20 to-cyan-800/20"></div>
        </div>
        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="mb-6 text-5xl font-bold md:text-7xl">
                {t("labels.partnerRegister.heroTitle1")}
                <span className="block text-white">{t("labels.partnerRegister.heroTitle2")}</span>
              </h1>
              <p className="mb-8 text-xl md:text-2xl text-emerald-100">
                {t("labels.partnerRegister.heroSubtitle")}
              </p>

              <a
                href="#registration"
                className="inline-block px-10 py-4 text-lg font-bold text-white transition-all duration-200 transform bg-blue-600 shadow-lg hover:bg-blue-600 rounded-2xl hover:shadow-xl hover:scale-105"
              >
                {t("labels.partnerRegister.registerNow")}
              </a>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 text-center bg-white border border-white bg-opacity-10 backdrop-blur-sm rounded-2xl border-opacity-20">
                <div className="mb-2 text-4xl font-bold">150+</div>
                <div className="text-sm text-emerald-200">{t("labels.partnerRegister.jobsPlaced")}</div>
              </div>
              <div className="p-8 text-center bg-white border border-white bg-opacity-10 backdrop-blur-sm rounded-2xl border-opacity-20">
                <div className="mb-2 text-4xl font-bold">98%</div>
                <div className="text-sm text-emerald-200">
                  {t("labels.partnerRegister.visaSuccessRate")}
                </div>
              </div>
              <div className="p-8 text-center bg-white border border-white bg-opacity-10 backdrop-blur-sm rounded-2xl border-opacity-20">
                <div className="mb-2 text-4xl font-bold">20+</div>
                <div className="text-sm text-emerald-200">{t("labels.partnerRegister.countriesServed")}</div>
              </div>
              <div className="p-8 text-center bg-white border border-white bg-opacity-10 backdrop-blur-sm rounded-2xl border-opacity-20">
                <div className="mb-2 text-4xl font-bold">{t("labels.partnerRegister.freeToJoin")}</div>
                <div className="text-sm text-emerald-200">{t("labels.partnerRegister.forCandidates")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Why Turkey Section */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">
              {t("labels.partnerRegister.whyWorkInTurkey")}
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t("labels.partnerRegister.whyWorkInTurkeyDescription")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {turkeyFacts.map((fact, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-white shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl">
                  {fact.icon}
                </div>
                <div className="mb-2 text-3xl font-bold text-blue-900">
                  {t(`labels.partnerRegister.${fact.factKey}`)}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-blue-900">
                  {t(`labels.partnerRegister.${fact.titleKey}`)}
                </h3>
                <p className="text-sm text-gray-600">{t(`labels.partnerRegister.${fact.descKey}`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">
              {t("labels.partnerRegister.howItWorks")}
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t("labels.partnerRegister.howItWorksDescription")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={index} className="relative text-center">
                {index < processSteps.length - 1 && (
                  <div className="absolute hidden w-full h-1 transform translate-x-4 lg:block top-12 left-full bg-gradient-to-r from-blue-900 to-blue-900"></div>
                )}
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 text-white shadow-xl bg-gradient-to-br from-blue-900 to-blue-900 rounded-3xl">
                  {step.icon}
                </div>
                <div className="flex items-center justify-center w-10 h-10 mx-auto mb-4 text-lg font-bold text-white rounded-full bg-slate-800">
                  {index + 1}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  {t(`labels.partnerRegister.${step.titleKey}`)}
                </h3>
                <p className="text-gray-600">{t(`labels.partnerRegister.${step.descKey}`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <div className="p-12 text-white bg-gradient-to-r from-blue-900 to-blue-900 rounded-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">{t("labels.partnerRegister.whatWeProvide")}</h2>
              <p className="max-w-3xl mx-auto text-xl text-emerald-100">
                {t("labels.partnerRegister.whatWeProvideDescription")}
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-white bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                    {benefit.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">
                    {t(`labels.partnerRegister.${benefit.titleKey}`)}
                  </h3>
                  <p className="text-sm text-emerald-100">
                    {t(`labels.partnerRegister.${benefit.descKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div
          id="registration"
          className="p-8 bg-white border shadow-2xl rounded-3xl border-emerald-200"
        >
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">
              {t("labels.partnerRegister.createYourProfile")}
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t("labels.partnerRegister.createYourProfileDescription")}
            </p>
          </div>

          <div className="space-y-10">
            {/* Personal Information */}
            <div className="p-8 bg-emerald-50 rounded-2xl">
              <h3 className="flex items-center mb-8 text-2xl font-semibold text-slate-900">
                <User className="w-6 h-6 mr-3" />
                {t("labels.partnerRegister.personalInformation")}
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.partnerRegister.firstName")}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg ${errors.firstName ? "border-red-300" : "border-gray-300"}`}
                    placeholder={t("labels.partnerRegister.placeholderFirstName")}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.partnerRegister.lastName")}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg ${errors.lastName ? "border-red-300" : "border-gray-300"}`}
                    placeholder={t("labels.partnerRegister.placeholderLastName")}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.partnerRegister.dateOfBirth")}
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg ${errors.dateOfBirth ? "border-red-300" : "border-gray-300"}`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.partnerRegister.gender")}
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">{t("labels.partnerRegister.selectGender")}</option>
                    <option value="male">{t("labels.partnerRegister.male")}</option>
                    <option value="female">{t("labels.partnerRegister.female")}</option>
                    <option value="other">{t("labels.partnerRegister.other")}</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.partnerRegister.nationality")}
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg ${errors.nationality ? "border-red-300" : "border-gray-300"}`}
                    placeholder={t("labels.partnerRegister.placeholderNationality")}
                  />
                  {errors.nationality && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.nationality}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    Current Country
                  </label>
                  <input
                    type="text"
                    name="currentCountry"
                    value={formData.currentCountry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t("labels.partnerRegister.placeholderCurrentCountry")}
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    Current City
                  </label>
                  <input
                    type="text"
                    name="currentCity"
                    value={formData.currentCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t("labels.partnerRegister.placeholderCurrentCity")}
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">{t("labels.partnerRegister.selectStatus")}</option>
                    <option value="single">{t("labels.partnerRegister.single")}</option>
                    <option value="married">{t("labels.partnerRegister.married")}</option>
                    <option value="divorced">{t("labels.partnerRegister.divorced")}</option>
                    <option value="widowed">{t("labels.partnerRegister.widowed")}</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    Number of Children
                  </label>
                  <select
                    name="numberOfChildren"
                    value={formData.numberOfChildren}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">{t("labels.partnerRegister.selectNumber")}</option>
                    <option value="0">{t("labels.partnerRegister.children0")}</option>
                    <option value="1">{t("labels.partnerRegister.children1")}</option>
                    <option value="2">{t("labels.partnerRegister.children2")}</option>
                    <option value="3">{t("labels.partnerRegister.children3")}</option>
                    <option value="4+">{t("labels.partnerRegister.children4Plus")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-8 bg-teal-50 rounded-2xl">
              <h3 className="flex items-center mb-8 text-2xl font-semibold text-slate-900">
                <Phone className="w-6 h-6 mr-3" />
                Contact Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg ${errors.phone ? "border-red-300" : "border-gray-300"}`}
                    placeholder={t("labels.partnerRegister.placeholderPhone")}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg ${errors.email ? "border-red-300" : "border-gray-300"}`}
                    placeholder={t("labels.partnerRegister.placeholderEmail")}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t("labels.partnerRegister.placeholderPhone")}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="p-8 bg-cyan-50 rounded-2xl">
              <h3 className="flex items-center mb-8 text-2xl font-semibold text-slate-900">
                <Briefcase className="w-6 h-6 mr-3" />
                Professional Information
              </h3>
              <div className="grid gap-6 mb-8 md:grid-cols-2">
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    Current
                  </label>
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Current Job Title *
                    </label>
                    <input
                      type="text"
                      name="currentJobTitle"
                      value={formData.currentJobTitle}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg ${errors.currentJobTitle ? "border-red-300" : "border-gray-300"}`}
                      placeholder={t("labels.partnerRegister.placeholderJobTitle")}
                    />
                    {errors.currentJobTitle && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.currentJobTitle}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Industry Experience *
                    </label>
                    <select
                      name="industryExperience"
                      value={formData.industryExperience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg ${errors.industryExperience ? "border-red-300" : "border-gray-300"}`}
                    >
                      <option value="">{t("labels.partnerRegister.selectIndustry")}</option>
                      <option value="manufacturing">{t("labels.partnerRegister.industryManufacturing")}</option>
                      <option value="construction">{t("labels.partnerRegister.industryConstruction")}</option>
                      <option value="technology">{t("labels.partnerRegister.industryTechnology")}</option>
                      <option value="healthcare">{t("labels.partnerRegister.industryHealthcare")}</option>
                      <option value="hospitality">{t("labels.partnerRegister.industryHospitality")}</option>
                      <option value="education">{t("labels.partnerRegister.industryEducation")}</option>
                      <option value="agriculture">{t("labels.partnerRegister.industryAgriculture")}</option>
                      <option value="logistics">{t("labels.partnerRegister.industryLogistics")}</option>
                      <option value="retail">{t("labels.partnerRegister.industryRetail")}</option>
                      <option value="security">{t("labels.partnerRegister.industrySecurity")}</option>
                      <option value="other">{t("labels.partnerRegister.industryOther")}</option>
                    </select>
                    {errors.industryExperience && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.industryExperience}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Years of Experience
                    </label>
                    <select
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{t("labels.partnerRegister.selectExperience")}</option>
                      <option value="0-1">{t("labels.partnerRegister.experience0_1")}</option>
                      <option value="1-3">{t("labels.partnerRegister.experience1_3")}</option>
                      <option value="3-5">{t("labels.partnerRegister.experience3_5")}</option>
                      <option value="5-10">{t("labels.partnerRegister.experience5_10")}</option>
                      <option value="10+">{t("labels.partnerRegister.experience10Plus")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Current Monthly Salary
                    </label>
                    <input
                      type="text"
                      name="currentSalary"
                      value={formData.currentSalary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder={t("labels.partnerRegister.placeholderSalary")}
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Expected Salary in Turkey (TL)
                    </label>
                    <select
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{t("labels.partnerRegister.selectSalaryRange")}</option>
                      <option value="17000-20000">{t("labels.partnerRegister.salary17000_20000")}</option>
                      <option value="20000-25000">{t("labels.partnerRegister.salary20000_25000")}</option>
                      <option value="25000-30000">{t("labels.partnerRegister.salary25000_30000")}</option>
                      <option value="30000-40000">{t("labels.partnerRegister.salary30000_40000")}</option>
                      <option value="40000+">{t("labels.partnerRegister.salary40000Plus")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Available to Start
                    </label>
                    <select
                      name="availabilityDate"
                      value={formData.availabilityDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{t("labels.partnerRegister.selectAvailability")}</option>
                      <option value="immediately">{t("labels.partnerRegister.availabilityImmediately")}</option>
                      <option value="1-month">{t("labels.partnerRegister.availability1Month")}</option>
                      <option value="2-months">{t("labels.partnerRegister.availability2Months")}</option>
                      <option value="3-months">{t("labels.partnerRegister.availability3Months")}</option>
                      <option value="flexible">{t("labels.partnerRegister.availabilityFlexible")}</option>
                    </select>
                  </div>
                </div>

                {/* Job Preferences */}
                <div className="mb-8">
                  <label className="block mb-4 text-sm font-semibold text-gray-700">
                    Job Preferences *
                  </label>
                  <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {jobCategories.map((job, index) => (
                      <label
                        key={index}
                        className="flex items-center p-4 space-x-3 transition-colors border cursor-pointer rounded-xl hover:bg-white border-cyan-200"
                      >
                        <input
                          type="checkbox"
                          checked={formData.jobPreferences.includes(job)}
                          onChange={() =>
                            handleCheckboxChange("jobPreferences", job)
                          }
                          className="w-5 h-5 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {job}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.jobPreferences && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.jobPreferences}
                    </p>
                  )}
                </div>

                {/* Work Locations */}
                <div>
                  <label className="block mb-4 text-sm font-semibold text-gray-700">
                    Preferred Work Locations in Turkey
                  </label>
                  <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {workLocations.map((location, index) => (
                      <label
                        key={index}
                        className="flex items-center p-4 space-x-3 transition-colors border cursor-pointer rounded-xl hover:bg-white border-cyan-200"
                      >
                        <input
                          type="checkbox"
                          checked={formData.workLocations.includes(location)}
                          onChange={() =>
                            handleCheckboxChange("workLocations", location)
                          }
                          className="w-5 h-5 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {location}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Education Information */}
              <div className="p-8 bg-blue-50 rounded-2xl">
                <h3 className="flex items-center mb-8 text-2xl font-semibold text-slate-900">
                  <GraduationCap className="w-6 h-6 mr-3" />
                  Education & Qualifications
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Education Level *
                    </label>
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg ${errors.educationLevel ? "border-red-300" : "border-gray-300"}`}
                    >
                      <option value="">{t("labels.partnerRegister.selectEducationLevel")}</option>
                      <option value="primary">{t("labels.partnerRegister.educationPrimary")}</option>
                      <option value="secondary">{t("labels.partnerRegister.educationSecondary")}</option>
                      <option value="high-school">{t("labels.partnerRegister.educationHighSchool")}</option>
                      <option value="diploma">{t("labels.partnerRegister.educationDiploma")}</option>
                      <option value="bachelor">{t("labels.partnerRegister.educationBachelors")}</option>
                      <option value="master">{t("labels.partnerRegister.educationMasters")}</option>
                      <option value="phd">{t("labels.partnerRegister.educationPhD")}</option>
                      <option value="other">{t("labels.partnerRegister.educationOther")}</option>
                    </select>
                    {errors.educationLevel && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.educationLevel}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.fieldOfStudy")}
                    </label>
                    <input
                      type="text"
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder={t("labels.partnerRegister.placeholderFieldOfStudy")}
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.universityInstitution")}
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder={t("labels.partnerRegister.placeholderUniversity")}
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.graduationYear")}
                    </label>
                    <input
                      type="number"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      min="1990"
                      max="2025"
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder={t("labels.partnerRegister.placeholderGraduationYear")}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.additionalCertifications")}
                    </label>
                    <textarea
                      name="additionalCertifications"
                      value={formData.additionalCertifications}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder={t("labels.partnerRegister.placeholderAdditionalCertifications")}
                    />
                  </div>
                </div>
              </div>

              {/* Skills & Languages */}
              <div className="p-8 bg-purple-50 rounded-2xl">
                <h3 className="flex items-center mb-8 text-2xl font-semibold text-slate-900">
                  <Languages className="w-6 h-6 mr-3" />
                  {t("labels.partnerRegister.skillsAndLanguages")}
                </h3>

                <div className="mb-8">
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.partnerRegister.professionalSkills")}
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={t("labels.partnerRegister.placeholderProfessionalSkills")}
                  />
                </div>

                <div className="mb-8">
                  <label className="block mb-4 text-sm font-semibold text-gray-700">
                    {t("labels.partnerRegister.languagesYouSpeak")}
                  </label>
                  <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {languages.map((language, index) => (
                      <label
                        key={index}
                        className="flex items-center p-4 space-x-3 transition-colors border border-purple-200 cursor-pointer rounded-xl hover:bg-white"
                      >
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(language)}
                          onChange={() =>
                            handleCheckboxChange("languages", language)
                          }
                          className="w-5 h-5 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {language}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.turkishLanguageLevel")}
                    </label>
                    <select
                      name="turkishLevel"
                      value={formData.turkishLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{t("labels.partnerRegister.selectLevel")}</option>
                      <option value="none">{t("labels.partnerRegister.noTurkish")}</option>
                      <option value="basic">{t("labels.partnerRegister.levelBasic")}</option>
                      <option value="intermediate">{t("labels.partnerRegister.levelIntermediate")}</option>
                      <option value="advanced">{t("labels.partnerRegister.levelAdvanced")}</option>
                      <option value="native">{t("labels.partnerRegister.nativeFluent")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.englishLanguageLevel")}
                    </label>
                    <select
                      name="englishLevel"
                      value={formData.englishLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{t("labels.partnerRegister.selectLevel")}</option>
                      <option value="none">{t("labels.partnerRegister.noEnglish")}</option>
                      <option value="basic">{t("labels.partnerRegister.levelBasic")}</option>
                      <option value="intermediate">{t("labels.partnerRegister.levelIntermediate")}</option>
                      <option value="advanced">{t("labels.partnerRegister.levelAdvanced")}</option>
                      <option value="native">{t("labels.partnerRegister.nativeFluent")}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Documents & Legal */}
              <div className="p-8 bg-orange-50 rounded-2xl">
                <h3 className="flex items-center mb-8 text-2xl font-semibold text-slate-900">
                  <FileText className="w-6 h-6 mr-3" />
                  {t("labels.partnerRegister.documentsAndLegal")}
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.passportNumber")}
                    </label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder={t("labels.partnerRegister.placeholderPassportNumber")}
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.passportExpiryDate")}
                    </label>
                    <input
                      type="date"
                      name="passportExpiry"
                      value={formData.passportExpiry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.criminalRecordStatus")}
                    </label>
                    <select
                      name="criminalRecord"
                      value={formData.criminalRecord}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{t("labels.partnerRegister.selectStatus")}</option>
                      <option value="clean">{t("labels.partnerRegister.cleanRecord")}</option>
                      <option value="minor">{t("labels.partnerRegister.minorOffenses")}</option>
                      <option value="prefer-not-say">{t("labels.partnerRegister.preferNotToSay")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.healthStatus")}
                    </label>
                    <select
                      name="healthStatus"
                      value={formData.healthStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{t("labels.partnerRegister.selectStatus")}</option>
                      <option value="excellent">{t("labels.partnerRegister.excellent")}</option>
                      <option value="good">{t("labels.partnerRegister.good")}</option>
                      <option value="fair">{t("labels.partnerRegister.fair")}</option>
                      <option value="medical-conditions">
                        {t("labels.partnerRegister.haveMedicalConditions")}
                      </option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center p-4 space-x-3 transition-colors cursor-pointer rounded-xl hover:bg-orange-100">
                      <input
                        type="checkbox"
                        name="hasWorkExperience"
                        checked={formData.hasWorkExperience}
                        onChange={handleInputChange}
                        className="w-5 h-5 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium text-gray-700">
                        {t("labels.partnerRegister.hasWorkedAbroad")}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="p-8 bg-pink-50 rounded-2xl">
                <h3 className="flex items-center mb-8 text-2xl font-semibold text-slate-900">
                  <Target className="w-6 h-6 mr-3" />
                  {t("labels.partnerRegister.relocationPreferences")}
                </h3>
                <div className="grid gap-6 mb-8 md:grid-cols-2">
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.relocationType")}
                    </label>
                    <select
                      name="relocationType"
                      value={formData.relocationType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{t("labels.partnerRegister.selectPreference")}</option>
                      <option value="temporary">{t("labels.partnerRegister.temporary")}</option>
                      <option value="long-term">{t("labels.partnerRegister.longTerm")}</option>
                      <option value="permanent">{t("labels.partnerRegister.permanentRelocation")}</option>
                      <option value="flexible">{t("labels.partnerRegister.flexible")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      {t("labels.partnerRegister.accommodationPreference")}
                    </label>
                    <select
                      name="accommodationPreference"
                      value={formData.accommodationPreference}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{t("labels.partnerRegister.selectPreference")}</option>
                      <option value="company-provided">{t("labels.partnerRegister.companyProvided")}</option>
                      <option value="own-arrangement">{t("labels.partnerRegister.ownArrangement")}</option>
                      <option value="shared">{t("labels.partnerRegister.sharedAccommodation")}</option>
                      <option value="family">{t("labels.partnerRegister.familyAccommodation")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Transportation Needs
                    </label>
                    <select
                      name="transportationNeeds"
                      value={formData.transportationNeeds}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select needs</option>
                      <option value="company-transport">
                        Company Transportation
                      </option>
                      <option value="public-transport">
                        Public Transportation
                      </option>
                      <option value="own-vehicle">Own Vehicle</option>
                      <option value="no-preference">No Preference</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center p-4 space-x-3 transition-colors cursor-pointer rounded-xl hover:bg-pink-100">
                    <input
                      type="checkbox"
                      name="familyRelocation"
                      checked={formData.familyRelocation}
                      onChange={handleInputChange}
                      className="w-5 h-5 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-gray-700">
                      I plan to bring my family to Turkey
                    </span>
                  </label>
                </div>
              </div>

              {/* Additional Information */}
              <div className="p-8 bg-indigo-50 rounded-2xl">
                <h3 className="flex items-center mb-8 text-2xl font-semibold text-slate-900">
                  <Star className="w-6 h-6 mr-3" />
                  Additional Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Why do you want to work in Turkey?
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Tell us about your motivation and goals for working in Turkey..."
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Additional Information
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Any other information you'd like to share..."
                    />
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      How did you hear about us?
                    </label>
                    <select
                      name="hearAboutUs"
                      value={formData.hearAboutUs}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select option</option>
                      <option value="google">Google Search</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="friend">Friend/Family</option>
                      <option value="agent">Local Agent</option>
                      <option value="advertisement">Advertisement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="p-8 bg-gray-100 rounded-2xl">
                <h3 className="flex items-center mb-8 text-2xl font-semibold text-slate-900">
                  <Shield className="w-6 h-6 mr-3" />
                  Legal Agreements
                </h3>
                <div className="space-y-6">
                  <label className="flex items-start space-x-4 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="w-5 h-5 mt-1 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-gray-700">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="font-semibold underline text-emerald-600 hover:text-emerald-800"
                      >
                        Terms and Conditions
                      </a>{" "}
                      and understand the employment process, visa requirements,
                      and legal obligations for working in Turkey. *
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-500">
                      {errors.agreeToTerms}
                    </p>
                  )}

                  <label className="flex items-start space-x-4 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onChange={handleInputChange}
                      className="w-5 h-5 mt-1 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-gray-700">
                      I acknowledge that I have read and agree to the{" "}
                      <a
                        href="#"
                        className="font-semibold underline text-emerald-600 hover:text-emerald-800"
                      >
                        Privacy Policy
                      </a>{" "}
                      and consent to the processing of my personal data for
                      employment and visa services. *
                    </span>
                  </label>
                  {errors.agreeToPrivacy && (
                    <p className="text-sm text-red-500">
                      {errors.agreeToPrivacy}
                    </p>
                  )}

                  <label className="flex items-start space-x-4 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToContact"
                      checked={formData.agreeToContact}
                      onChange={handleInputChange}
                      className="w-5 h-5 mt-1 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-gray-700">
                      I agree to be contacted by JobAsdmire and potential
                      employers via phone, email, WhatsApp, and other
                      communication methods regarding job opportunities.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  className="px-16 py-6 text-2xl font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-blue-900 to-blue-900 hover:from-blue-900 hover:to-blue-900 rounded-3xl hover:shadow-3xl hover:scale-105"
                >
                  Create My Profile - FREE!
                </button>
                <p className="mt-6 text-lg text-gray-600">
                  Your profile will be reviewed within 3-5 business days. We'll
                  contact you with matching job opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="p-12 mt-20 text-center text-white bg-gradient-to-r from-blue-900 to-blue-900 rounded-3xl">
            <h3 className="mb-6 text-3xl font-bold">
              Need Help With Your Application?
            </h3>
            <p className="max-w-3xl mx-auto mb-8 text-lg text-emerald-100">
              Our candidate support team is here to help you through every step
              of the process. From application to arrival in Turkey, we're with
              you.
            </p>
            <div className="grid gap-8 mb-8 md:grid-cols-3">
              <div className="flex items-center justify-center px-6 py-4 space-x-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                <Mail className="w-6 h-6" />
                <span className="text-lg">candidates@jobasdmire.com</span>
              </div>
              <div className="flex items-center justify-center px-6 py-4 space-x-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                <Phone className="w-6 h-6" />
                <span className="text-lg">+90 xxx xxx xx xx</span>
              </div>
              <div className="flex items-center justify-center px-6 py-4 space-x-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                <Clock className="w-6 h-6" />
                <span className="text-lg">24/7 WhatsApp Support</span>
              </div>
            </div>
            <div className="text-emerald-200">
              <p className="text-lg">
                Support Available: Monday - Sunday, 9:00 AM - 9:00 PM (Turkey
                Time)
              </p>
              <p className="mt-2">
                WhatsApp Support: Available 24/7 for urgent assistance
              </p>
              <p className="mt-4 text-sm">
                <strong>Multiple Language Support:</strong> English, Arabic,
                Urdu, Hindi, Bengali, Russian
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600">
                Get answers to common questions about working in Turkey through
                JobAsdmire.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="p-6 bg-white border shadow-lg rounded-xl border-emerald-100">
                <h4 className="mb-3 font-bold text-slate-900">
                  Is the service really free for candidates?
                </h4>
                <p className="text-gray-600">
                  Yes! We never charge candidates any fees. Employers pay us for
                  our recruitment services, so everything is completely free for
                  job seekers.
                </p>
              </div>
              <div className="p-6 bg-white border shadow-lg rounded-xl border-emerald-100">
                <h4 className="mb-3 font-bold text-slate-900">
                  How long does the visa process take?
                </h4>
                <p className="text-gray-600">
                  Typically 30-45 days from job offer to visa approval. We
                  handle all documentation and government processes for you.
                </p>
              </div>
              <div className="p-6 bg-white border shadow-lg rounded-xl border-emerald-100">
                <h4 className="mb-3 font-bold text-slate-900">
                  Do I need to speak Turkish?
                </h4>
                <p className="text-gray-600">
                  Not required for most positions! Many employers provide
                  Turkish language training, and we offer free basic Turkish
                  courses to our candidates.
                </p>
              </div>
              <div className="p-6 bg-white border shadow-lg rounded-xl border-emerald-100">
                <h4 className="mb-3 font-bold text-slate-900">
                  Can I bring my family?
                </h4>
                <p className="text-gray-600">
                  Yes! We assist with family visas and help you find suitable
                  family accommodation near your workplace.
                </p>
              </div>
              <div className="p-6 bg-white border shadow-lg rounded-xl border-emerald-100">
                <h4 className="mb-3 font-bold text-slate-900">
                  What if I don't like the job?
                </h4>
                <p className="text-gray-600">
                  We provide 6 months of support after arrival. If there are
                  issues, we help you find alternative employment with our other
                  partner companies.
                </p>
              </div>
              <div className="p-6 bg-white border shadow-lg rounded-xl border-emerald-100">
                <h4 className="mb-3 font-bold text-slate-900">
                  Are salaries paid on time?
                </h4>
                <p className="text-gray-600">
                  All our partner companies are verified and monitored. We
                  ensure compliance with Turkish labor laws and timely salary
                  payments.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="p-12 mt-20 text-center text-white bg-gradient-to-r from-blue-900 to-blue-900 rounded-3xl">
            <h3 className="mb-6 text-4xl font-bold">
              Ready to Start Your Turkish Adventure?
            </h3>
            <p className="max-w-3xl mx-auto mb-8 text-xl text-teal-100">
              Join thousands of professionals who have successfully built their
              careers in Turkey. Your dream job is waiting!
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="px-6 py-3 bg-white rounded-full bg-opacity-20 backdrop-blur-sm">
                <span className="font-semibold">✓ 100% Free Service</span>
              </div>
              <div className="px-6 py-3 bg-white rounded-full bg-opacity-20 backdrop-blur-sm">
                <span className="font-semibold">✓ Visa Guaranteed</span>
              </div>
              <div className="px-6 py-3 bg-white rounded-full bg-opacity-20 backdrop-blur-sm">
                <span className="font-semibold">✓ Family Support</span>
              </div>
              <div className="px-6 py-3 bg-white rounded-full bg-opacity-20 backdrop-blur-sm">
                <span className="font-semibold">✓ 24/7 Assistance</span>
              </div>
            </div>
            <a
              href="#registration"
              className="inline-block px-12 py-4 text-xl font-bold text-teal-700 transition-all duration-200 transform bg-white shadow-lg rounded-2xl hover:shadow-xl hover:scale-105"
            >
              Register Now - It's Free!
            </a>
          </div>
        </div>
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
