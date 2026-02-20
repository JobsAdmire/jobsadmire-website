import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { showSuccess, showError, showWarning } from "@/lib/utils/toast";
import {
  X,
  MapPin,
  Home,
  ChevronDown,
  ArrowRight,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle,
  Globe,
  Upload,
  File,
  AlertCircle,
  Send,
} from "lucide-react";

export default function VisaApplicationPopup({
  isOpen,
  onClose,
  selectedPackage = null,
  countries = [],
  loading = false,
}) {
  const { t } = useTranslation("travel");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Location
    fromCountry: "",
    toCountry: "",
    // Step 2: Requirements & Confirmation
    hasValidPassport: false,
    hasPictureHeadshot: false,
    confirmNoActiveApplication: false,
    confirmGovernmentDiscretion: false,
    // Step 3: Documents
    passportDocument: null,
    pictureHeadshot: null,
    // Step 4: Personal Details
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    profession: "",
    travelDate: "",
    travelToDate: "",
    travelPurpose: "",
    numberOfTravelers: 1,
    travelers: [{ name: "", phoneNumber: "" }],
  });

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [fromSearchTerm, setFromSearchTerm] = useState("");
  const [toSearchTerm, setToSearchTerm] = useState("");
  const [nationalitySearchTerm, setNationalitySearchTerm] = useState("");

  // Filter countries based on search terms
  const filteredFromCountries = countries.filter(
    (country) =>
      country.name &&
      country.name.toLowerCase().includes(fromSearchTerm.toLowerCase())
  );

  const filteredToCountries = countries.filter(
    (country) =>
      country.name &&
      country.name.toLowerCase().includes(toSearchTerm.toLowerCase())
  );

  const filteredNationalityCountries = countries.filter(
    (country) =>
      country.name &&
      country.name.toLowerCase().includes(nationalitySearchTerm.toLowerCase())
  );

  const totalSteps = 5; // Reduced from 6 to 5 (removed payment step)

  const stepTitles = {
    1: t("visaApplication.stepTitles.step1"),
    2: t("visaApplication.stepTitles.step2"),
    3: t("visaApplication.stepTitles.step3"),
    4: t("visaApplication.stepTitles.step4"),
    5: t("visaApplication.stepTitles.step5"),
  };

  const getPackageTypeLabel = (type) => {
    if (!type) return null;
    const keyMap = {
      "Individual Tourist Invitation": "packageTypes.individualTouristInvitation",
      "Individual Business Invitation": "packageTypes.individualBusinessInvitation",
      "Family Tourist Invitation": "packageTypes.familyTouristInvitation",
      "Single Entry": "packageTypes.singleEntry",
    };
    const key = keyMap[type];
    return key ? t(key) : type;
  };

  // Email submission function using Resend
  const submitToEmail = async (applicationData) => {
    try {
      const response = await fetch("/api/send-visa-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationData,
          selectedPackage,
          submissionDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(t("visaApplication.submitFailed"));
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };

  // Validation functions for each step
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.fromCountry)
          newErrors.fromCountry = t("visaApplication.errors.fromCountry");
        if (!formData.toCountry)
          newErrors.toCountry = t("visaApplication.errors.toCountry");
        if (formData.fromCountry === formData.toCountry) {
          newErrors.toCountry = t("visaApplication.errors.toCountrySame");
        }
        break;

      case 2:
        if (!formData.hasValidPassport)
          newErrors.hasValidPassport = t("visaApplication.errors.hasValidPassport");
        if (!formData.hasPictureHeadshot)
          newErrors.hasPictureHeadshot = t("visaApplication.errors.hasPictureHeadshot");
        if (!formData.confirmNoActiveApplication)
          newErrors.confirmNoActiveApplication = t("visaApplication.errors.confirmNoActiveApplication");
        if (!formData.confirmGovernmentDiscretion)
          newErrors.confirmGovernmentDiscretion = t("visaApplication.errors.confirmGovernmentDiscretion");
        break;

      case 3:
        if (!formData.passportDocument)
          newErrors.passportDocument = t("visaApplication.errors.passportDocument");
        if (!formData.pictureHeadshot)
          newErrors.pictureHeadshot = t("visaApplication.errors.pictureHeadshot");
        break;

      case 4:
        if (!formData.firstName.trim())
          newErrors.firstName = t("visaApplication.errors.firstName");
        if (!formData.lastName.trim())
          newErrors.lastName = t("visaApplication.errors.lastName");
        if (!formData.phoneNumber.trim())
          newErrors.phoneNumber = t("visaApplication.errors.phoneNumber");
        if (!formData.email.trim()) newErrors.email = t("visaApplication.errors.email");
        if (!formData.passportNumber.trim())
          newErrors.passportNumber = t("visaApplication.errors.passportNumber");
        if (!formData.profession.trim())
          newErrors.profession = t("visaApplication.errors.profession");
        if (!formData.travelDate)
          newErrors.travelDate = t("visaApplication.errors.travelDate");
        if (!formData.travelToDate)
          newErrors.travelToDate = t("visaApplication.errors.travelToDate");
        if (!formData.travelPurpose.trim())
          newErrors.travelPurpose = t("visaApplication.errors.travelPurpose");

        // Email validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = t("visaApplication.errors.emailInvalid");
        }

        // Phone validation (basic)
        if (
          formData.phoneNumber &&
          !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)
        ) {
          newErrors.phoneNumber = t("visaApplication.errors.phoneInvalid");
        }

        // Date validation
        if (formData.travelDate && formData.travelToDate) {
          const fromDate = new Date(formData.travelDate);
          const toDate = new Date(formData.travelToDate);
          const today = new Date();

          if (fromDate < today) {
            newErrors.travelDate = t("visaApplication.errors.travelDatePast");
          }
          if (toDate <= fromDate) {
            newErrors.travelToDate = t("visaApplication.errors.travelToDateAfter");
          }
        }

        // Additional travelers validation
        if (formData.numberOfTravelers > 1) {
          formData.travelers.slice(1).forEach((traveler, index) => {
            const travelerIndex = index + 2;
            if (!traveler.name.trim()) {
              newErrors[`traveler_${index + 1}_name`] = t("visaApplication.errors.travelerNameRequired", { index: travelerIndex });
            }
            if (!traveler.phoneNumber.trim()) {
              newErrors[`traveler_${index + 1}_phone`] = t("visaApplication.errors.travelerPhoneRequired", { index: travelerIndex });
            }
          });
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle number of travelers change
  const handleNumberOfTravelersChange = (value) => {
    const numTravelers = parseInt(value) || 1;
    const newTravelers = Array.from(
      { length: numTravelers },
      (_, index) => formData.travelers[index] || { name: "", phoneNumber: "" }
    );

    setFormData((prev) => ({
      ...prev,
      numberOfTravelers: numTravelers,
      travelers: newTravelers,
    }));
  };

  // Handle individual traveler data change
  const handleTravelerChange = (index, field, value) => {
    const updatedTravelers = [...formData.travelers];
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      travelers: updatedTravelers,
    }));

    // Clear traveler errors
    const errorKey = `traveler_${index}_${field === "name" ? "name" : "phone"}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleFromSelect = (country) => {
    handleInputChange("fromCountry", country.name);
    setShowFromDropdown(false);
    setFromSearchTerm("");
  };

  const handleToSelect = (country) => {
    handleInputChange("toCountry", country.name);
    setShowToDropdown(false);
    setToSearchTerm("");
  };

  const handleNationalitySelect = (country) => {
    handleInputChange("nationality", country.name);
    setShowNationalityDropdown(false);
    setNationalitySearchTerm("");
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({}); // Clear errors when going back
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Convert files to base64 for email transmission
      const processFile = (file) => {
        return new Promise((resolve, reject) => {
          if (!file) {
            resolve(null);
            return;
          }

          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              data: reader.result,
            });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      const processedPassport = await processFile(formData.passportDocument);
      const processedHeadshot = await processFile(formData.pictureHeadshot);

      const applicationData = {
        ...formData,
        passportDocument: processedPassport,
        pictureHeadshot: processedHeadshot,
        submissionTimestamp: new Date().toISOString(),
        applicationId: `VA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      await submitToEmail(applicationData);
      dataLayer.push({
        event: "visaApplicationSubmitted",
        formType: "E-invitation ",
        applicationId: applicationData.applicationId,
      });
      showSuccess(
        `Visa application submitted successfully! Your application ID is: ${applicationData.applicationId}`
      );
      router.push("/thankyou");
      onClose();
    } catch (error) {
      showError("Failed to submit application. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form and close
    setFormData({
      fromCountry: "",
      toCountry: "",
      hasValidPassport: false,
      hasPictureHeadshot: false,
      confirmNoActiveApplication: false,
      confirmGovernmentDiscretion: false,
      passportDocument: null,
      pictureHeadshot: null,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      nationality: "",
      passportNumber: "",
      passportExpiry: "",
      profession: "",
      travelDate: "",
      travelToDate: "",
      travelPurpose: "",
      numberOfTravelers: 1,
      travelers: [{ name: "", phoneNumber: "" }],
    });
    setCurrentStep(1);
    setErrors({});
    setFromSearchTerm("");
    setToSearchTerm("");
    setNationalitySearchTerm("");
    setShowFromDropdown(false);
    setShowToDropdown(false);
    setShowNationalityDropdown(false);
    onClose();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowFromDropdown(false);
        setShowToDropdown(false);
        setShowNationalityDropdown(false);
        setFromSearchTerm("");
        setToSearchTerm("");
        setNationalitySearchTerm("");
      }
    };

    if (showFromDropdown || showToDropdown || showNationalityDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showFromDropdown, showToDropdown, showNationalityDropdown]);

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setErrors({});
      setFormData({
        fromCountry: "",
        toCountry: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: "",
        passportExpiry: "",
        travelPurpose: "",
        travelDate: "",
        travelToDate: "",
        profession: "",
        hasValidPassport: false,
        hasPictureHeadshot: false,
        confirmNoActiveApplication: false,
        confirmGovernmentDiscretion: false,
        passportDocument: null,
        pictureHeadshot: null,
        numberOfTravelers: 1,
        travelers: [{ name: "", phoneNumber: "" }],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Selected Package Info */}
            {selectedPackage && (
              <div className="p-6 border bg-sky-50 rounded-xl border-sky-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1 font-semibold text-slate-800">
                      Selected Package
                    </h3>
                    <p className="font-medium text-sky-600">
                      {selectedPackage.type}
                    </p>
                    <p className="text-sm text-slate-600">
                      {selectedPackage.destination}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">
                      ${selectedPackage.price}
                    </p>
                    <p className="text-sm text-slate-600">{t("visaApplication.labels.currency")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Country Selection */}
            <div className="space-y-6">
              {/* From Country */}
              <div className="relative dropdown-container">
                <label className="block mb-3 text-sm font-medium text-gray-700">
                  <MapPin className="inline w-4 h-4 mr-2" />{t("form.iAmFrom")}
                </label>
                <div className="relative">
                  <div
                    className={`flex items-center justify-between w-full p-4 transition-colors border cursor-pointer rounded-xl bg-sky-50 hover:bg-sky-100 ${
                      errors.fromCountry
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFromDropdown(!showFromDropdown);
                      setShowToDropdown(false);
                      setShowNationalityDropdown(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-sky-500" />
                      <span
                        className={
                          formData.fromCountry
                            ? "text-slate-900"
                            : "text-slate-500"
                        }
                      >
                        {formData.fromCountry ? (
                          <span className="flex items-center space-x-2">
                            <span className="text-lg">
                              {
                                countries.find(
                                  (c) => c.name === formData.fromCountry
                                )?.flag
                              }
                            </span>
                            <span>{formData.fromCountry}</span>
                          </span>
                        ) : (
                          t("visaApplication.placeholders.selectCountry")
                        )}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${showFromDropdown ? "rotate-180" : ""}`}
                    />
                  </div>

                  {showFromDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[100]">
                      <div className="p-3 border-b border-gray-100">
                        <input
                          type="text"
                          placeholder={t("visaApplication.placeholders.searchCountries")}
                          value={fromSearchTerm}
                          onChange={(e) => setFromSearchTerm(e.target.value)}
                          className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="overflow-y-auto max-h-48">
                        {filteredFromCountries.map((country) => (
                          <div
                            key={country.name}
                            className="flex items-center p-3 space-x-3 cursor-pointer hover:bg-sky-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFromSelect(country);
                            }}
                          >
                            <span className="text-xl">{country.flag}</span>
                            <span className="text-slate-900">
                              {country.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {errors.fromCountry && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fromCountry}
                  </p>
                )}
              </div>

              {/* To Country */}
              <div className="relative dropdown-container">
                <label className="block mb-3 text-sm font-medium text-gray-700">
                  <Home className="inline w-4 h-4 mr-2" />{t("form.iLiveIn")}
                </label>
                <div className="relative">
                  <div
                    className={`flex items-center justify-between w-full p-4 transition-colors border cursor-pointer rounded-xl bg-sky-50 hover:bg-sky-100 ${
                      errors.toCountry
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowToDropdown(!showToDropdown);
                      setShowFromDropdown(false);
                      setShowNationalityDropdown(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-sky-500" />
                      <span
                        className={
                          formData.toCountry
                            ? "text-slate-900"
                            : "text-slate-500"
                        }
                      >
                        {formData.toCountry ? (
                          <span className="flex items-center space-x-2">
                            <span className="text-lg">
                              {
                                countries.find(
                                  (c) => c.name === formData.toCountry
                                )?.flag
                              }
                            </span>
                            <span>{formData.toCountry}</span>
                          </span>
                        ) : (
                          t("visaApplication.placeholders.selectCountry")
                        )}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${showToDropdown ? "rotate-180" : ""}`}
                    />
                  </div>

                  {showToDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[100]">
                      <div className="p-3 border-b border-gray-100">
                        <input
                          type="text"
                          placeholder={t("visaApplication.placeholders.searchCountries")}
                          value={toSearchTerm}
                          onChange={(e) => setToSearchTerm(e.target.value)}
                          className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="overflow-y-auto max-h-48">
                        {filteredToCountries.map((country) => (
                          <div
                            key={country.name}
                            className="flex items-center p-3 space-x-3 cursor-pointer hover:bg-sky-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToSelect(country);
                            }}
                          >
                            <span className="text-xl">{country.flag}</span>
                            <span className="text-slate-900">
                              {country.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {errors.toCountry && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.toCountry}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-slate-800">
                Let's get your Visa(s)
              </h3>
              <p className="text-slate-600">
                What's required to make this application?
              </p>
            </div>

            {/* Requirements Cards */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
              {/* Valid Passport */}
              <div className="p-6 text-center border border-gray-200 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-xl">
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <h4 className="mb-2 font-semibold text-slate-800">
                  1 Valid Passport
                </h4>
                <div className="w-12 h-0.5 bg-sky-500 mx-auto mb-3"></div>
                <p className="text-sm text-slate-600">
                  Clear passport scan or picture with minimum of 6 months
                  validity.
                </p>
              </div>

              {/* Picture/Headshot */}
              <div className="p-6 text-center border border-gray-200 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-xl">
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <h4 className="mb-2 font-semibold text-slate-800">
                  2 Picture / Headshot
                </h4>
                <div className="w-12 h-0.5 bg-sky-500 mx-auto mb-3"></div>
                <p className="text-sm text-slate-600">
                  Clear passport scan or picture with minimum of 6 months
                  validity.
                </p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="mb-4 font-semibold text-slate-800">
                  Please confirm that you have read and agreed to the following:
                </h4>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={formData.hasValidPassport}
                        onChange={(e) =>
                          handleInputChange(
                            "hasValidPassport",
                            e.target.checked
                          )
                        }
                        className={`w-5 h-5 bg-white border-2 rounded text-sky-600 focus:ring-sky-500 focus:ring-2 ${
                          errors.hasValidPassport
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    <span className="text-sm transition-colors text-slate-700 group-hover:text-slate-900">
                      I have a valid passport with minimum 6 months validity
                    </span>
                  </label>
                  {errors.hasValidPassport && (
                    <p className="ml-8 text-sm text-red-600">
                      {errors.hasValidPassport}
                    </p>
                  )}

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={formData.hasPictureHeadshot}
                        onChange={(e) =>
                          handleInputChange(
                            "hasPictureHeadshot",
                            e.target.checked
                          )
                        }
                        className={`w-5 h-5 bg-white border-2 rounded text-sky-600 focus:ring-sky-500 focus:ring-2 ${
                          errors.hasPictureHeadshot
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    <span className="text-sm transition-colors text-slate-700 group-hover:text-slate-900">
                      I have a clear picture/headshot available for the
                      application
                    </span>
                  </label>
                  {errors.hasPictureHeadshot && (
                    <p className="ml-8 text-sm text-red-600">
                      {errors.hasPictureHeadshot}
                    </p>
                  )}

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={formData.confirmNoActiveApplication}
                        onChange={(e) =>
                          handleInputChange(
                            "confirmNoActiveApplication",
                            e.target.checked
                          )
                        }
                        className={`w-5 h-5 bg-white border-2 rounded text-sky-600 focus:ring-sky-500 focus:ring-2 ${
                          errors.confirmNoActiveApplication
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    <div className="text-sm transition-colors text-slate-700 group-hover:text-slate-900">
                      I hereby confirm that no active visa application is
                      currently under processing by another agent. This could
                      lead to a non-refundable rejection of my visa application.
                    </div>
                  </label>
                  {errors.confirmNoActiveApplication && (
                    <p className="ml-8 text-sm text-red-600">
                      {errors.confirmNoActiveApplication}
                    </p>
                  )}

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={formData.confirmGovernmentDiscretion}
                        onChange={(e) =>
                          handleInputChange(
                            "confirmGovernmentDiscretion",
                            e.target.checked
                          )
                        }
                        className={`w-5 h-5 bg-white border-2 rounded text-sky-600 focus:ring-sky-500 focus:ring-2 ${
                          errors.confirmGovernmentDiscretion
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    <div className="text-sm transition-colors text-slate-700 group-hover:text-slate-900">
                      The decision to grant or refuse the visa(s) is the sole
                      prerogative and at the sole discretion of Government of
                      Destination Country.
                    </div>
                  </label>
                  {errors.confirmGovernmentDiscretion && (
                    <p className="ml-8 text-sm text-red-600">
                      {errors.confirmGovernmentDiscretion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Package Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-sky-100 text-sky-700">
                  {getPackageTypeLabel(selectedPackage?.type) || t("visaApplication.labels.transitVisa")}
                </span>
                <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                  {t("visaApplication.labels.visaFor")} {selectedPackage?.destination || "QATAR"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm text-slate-600">{t("visaApplication.labels.price")} </span>
                <span className="text-xl font-bold text-slate-800">
                  {selectedPackage?.price || "135.00"} {t("visaApplication.labels.currency")}
                </span>
              </div>
            </div>

            {/* Upload Section */}
            <div className="mb-8 text-center">
              <h3 className="mb-4 text-2xl font-bold text-slate-800">
                {t("visaApplication.labels.uploadDocumentsTitle")}
              </h3>
              <p className="mb-2 text-slate-600">
                {t("visaApplication.labels.acceptedFormats")}{" "}
                <span className="font-medium text-sky-600">
                  {t("visaApplication.labels.acceptedFormatsValue")}
                </span>
              </p>
            </div>

            {/* Document Upload Cards */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Valid Passport Upload */}
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-xl">
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <h4 className="mb-4 font-semibold text-slate-800">
                  1 Valid Passport
                </h4>

                <div className="relative">
                  <input
                    type="file"
                    id="passport-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleInputChange("passportDocument", file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="passport-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 transition-colors border-2 border-dashed cursor-pointer rounded-xl hover:border-sky-400 hover:bg-sky-100 ${
                      errors.passportDocument
                        ? "border-red-300 bg-red-50"
                        : "border-sky-300 bg-sky-50"
                    }`}
                  >
                    {formData.passportDocument ? (
                      <div className="text-center">
                        <File className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          {formData.passportDocument.name}
                        </span>
                        <p className="mt-1 text-xs text-slate-500">
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-sky-500" />
                        <span className="text-sm font-medium text-sky-600">
                          Click to upload
                        </span>
                        <p className="mt-1 text-xs text-slate-500">
                          or drag and drop
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                {errors.passportDocument && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.passportDocument}
                  </p>
                )}
              </div>

              {/* Picture Headshot Upload */}
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-xl">
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <h4 className="mb-4 font-semibold text-slate-800">
                  2 Picture Headshot
                </h4>

                <div className="relative">
                  <input
                    type="file"
                    id="headshot-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleInputChange("pictureHeadshot", file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="headshot-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 transition-colors border-2 border-dashed cursor-pointer rounded-xl hover:border-sky-400 hover:bg-sky-100 ${
                      errors.pictureHeadshot
                        ? "border-red-300 bg-red-50"
                        : "border-sky-300 bg-sky-50"
                    }`}
                  >
                    {formData.pictureHeadshot ? (
                      <div className="text-center">
                        <File className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          {formData.pictureHeadshot.name}
                        </span>
                        <p className="mt-1 text-xs text-slate-500">
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-sky-500" />
                        <span className="text-sm font-medium text-sky-600">
                          Click to upload
                        </span>
                        <p className="mt-1 text-xs text-slate-500">
                          or drag and drop
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                {errors.pictureHeadshot && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.pictureHeadshot}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Package Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-sky-100 text-sky-700">
                  {getPackageTypeLabel(selectedPackage?.type) || t("visaApplication.labels.transitVisa")}
                </span>
                <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                  {t("visaApplication.labels.visaFor")} {selectedPackage?.destination || "QATAR"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm text-slate-600">{t("visaApplication.labels.price")} </span>
                <span className="text-xl font-bold text-slate-800">
                  {selectedPackage?.price || "135.00"} {t("visaApplication.labels.currency")}
                </span>
              </div>
            </div>

            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-slate-800">
                Please Provide The Following Details
              </h3>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    First name
                  </label>
                  <div className="relative">
                    <User className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                        errors.firstName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("visaApplication.placeholders.firstName")}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                        errors.lastName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("visaApplication.placeholders.lastName")}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number and Email */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                        errors.phoneNumber
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("visaApplication.placeholders.phoneNumber")}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                        errors.email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("visaApplication.placeholders.email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* From and Live in */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    From
                  </label>
                  <div className="relative">
                    <Globe className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="text"
                      value={formData.fromCountry}
                      readOnly
                      className="w-full py-3 pl-10 pr-4 text-gray-700 border border-gray-300 rounded-lg bg-gray-50"
                      placeholder={t("visaApplication.placeholders.from")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Live in
                  </label>
                  <div className="relative">
                    <Globe className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="text"
                      value={formData.toCountry}
                      readOnly
                      className="w-full py-3 pl-10 pr-4 text-gray-700 border border-gray-300 rounded-lg bg-gray-50"
                      placeholder={t("visaApplication.placeholders.liveIn")}
                    />
                  </div>
                </div>
              </div>

              {/* Passport Number and Profession */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Passport number
                  </label>
                  <div className="relative">
                    <FileText className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="text"
                      value={formData.passportNumber}
                      onChange={(e) =>
                        handleInputChange("passportNumber", e.target.value)
                      }
                      className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                        errors.passportNumber
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("visaApplication.placeholders.passportNumber")}
                    />
                  </div>
                  {errors.passportNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.passportNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Profession
                  </label>
                  <div className="relative">
                    <Mail className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={(e) =>
                        handleInputChange("profession", e.target.value)
                      }
                      className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                        errors.profession
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("visaApplication.placeholders.profession")}
                    />
                  </div>
                  {errors.profession && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.profession}
                    </p>
                  )}
                </div>
              </div>

              {/* Travel Date From, Travel To, Travel Purpose, Number of Travelers */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Travel date From
                  </label>
                  <div className="relative">
                    <Calendar className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) =>
                        handleInputChange("travelDate", e.target.value)
                      }
                      className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                        errors.travelDate
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("visaApplication.placeholders.dateFormat")}
                    />
                  </div>
                  {errors.travelDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.travelDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Travel To
                  </label>
                  <div className="relative">
                    <Calendar className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="date"
                      value={formData.travelToDate}
                      onChange={(e) =>
                        handleInputChange("travelToDate", e.target.value)
                      }
                      className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                        errors.travelToDate
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("visaApplication.placeholders.dateFormat")}
                    />
                  </div>
                  {errors.travelToDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.travelToDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Travel purpose
                  </label>
                  <div className="relative">
                    <Globe className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="text"
                      value={formData.travelPurpose}
                      onChange={(e) =>
                        handleInputChange("travelPurpose", e.target.value)
                      }
                      className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                        errors.travelPurpose
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("visaApplication.placeholders.travelPurpose")}
                    />
                  </div>
                  {errors.travelPurpose && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.travelPurpose}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Number Of Travellers
                  </label>
                  <div className="relative">
                    <User className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.numberOfTravelers}
                      onChange={(e) =>
                        handleNumberOfTravelersChange(e.target.value)
                      }
                      className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder={t("visaApplication.placeholders.numberOfTravellers")}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Traveler Fields */}
              {formData.numberOfTravelers > 1 && (
                <div className="mt-8">
                  <h4 className="mb-4 text-lg font-semibold text-slate-800">
                    Additional Travelers Information
                  </h4>
                  <div className="space-y-6">
                    {formData.travelers.slice(1).map((traveler, index) => (
                      <div
                        key={index + 1}
                        className="p-6 border border-gray-200 bg-gray-50 rounded-xl"
                      >
                        <h5 className="mb-4 font-medium text-md text-slate-700">
                          Traveler {index + 2}
                        </h5>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                              Full Name
                            </label>
                            <div className="relative">
                              <User className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                              <input
                                type="text"
                                value={traveler.name}
                                onChange={(e) =>
                                  handleTravelerChange(
                                    index + 1,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                                  errors[`traveler_${index + 1}_name`]
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300"
                                }`}
                                placeholder={t("visaApplication.placeholders.fullName")}
                              />
                            </div>
                            {errors[`traveler_${index + 1}_name`] && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors[`traveler_${index + 1}_name`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-sky-500" />
                              <input
                                type="tel"
                                value={traveler.phoneNumber}
                                onChange={(e) =>
                                  handleTravelerChange(
                                    index + 1,
                                    "phoneNumber",
                                    e.target.value
                                  )
                                }
                                className={`w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                                  errors[`traveler_${index + 1}_phone`]
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300"
                                }`}
                                placeholder={t("visaApplication.placeholders.phoneNumber")}
                              />
                            </div>
                            {errors[`traveler_${index + 1}_phone`] && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors[`traveler_${index + 1}_phone`]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Package Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-sky-100 text-sky-700">
                  {getPackageTypeLabel(selectedPackage?.type) || t("visaApplication.labels.transitVisa")}
                </span>
                <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                  {t("visaApplication.labels.visaFor")} {selectedPackage?.destination || "QATAR"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm text-slate-600">{t("visaApplication.labels.price")} </span>
                <span className="text-xl font-bold text-slate-800">
                  {selectedPackage?.price || "135.00"} {t("visaApplication.labels.currency")}
                </span>
              </div>
            </div>

            <div className="mb-6 text-center">
              <h3 className="mb-2 text-2xl font-bold text-slate-800">
                Review Your Application
              </h3>
              <p className="text-slate-600">
                Please review all information before submitting
              </p>
            </div>

            {/* Review Details */}
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Plan Name:
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {getPackageTypeLabel(selectedPackage?.type) || t("visaApplication.labels.transitVisaShort")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Description:
                  </span>
                  <span className="text-sm text-slate-900">
                    {selectedPackage?.processing ||
                      "Transit Visa: Processing time 48 hours."}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Duration:
                  </span>
                  <span className="text-sm text-slate-900">
                    {selectedPackage?.duration || "Maximum 96 Hours Stay"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Name:
                  </span>
                  <span className="text-sm text-slate-900">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Contact Number:
                  </span>
                  <span className="text-sm text-slate-900">
                    {formData.phoneNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Email Address:
                  </span>
                  <span className="text-sm text-slate-900">
                    {formData.email}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    From:
                  </span>
                  <span className="text-sm text-slate-900">
                    {formData.fromCountry}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Live in:
                  </span>
                  <span className="text-sm text-slate-900">
                    {formData.toCountry}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Passport No:
                  </span>
                  <span className="text-sm text-slate-900">
                    {formData.passportNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Profession:
                  </span>
                  <span className="text-sm text-slate-900">
                    {formData.profession}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Travel Date:
                  </span>
                  <span className="text-sm text-slate-900">
                    {formData.travelDate}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Return Date:
                  </span>
                  <span className="text-sm text-slate-900">
                    {formData.travelToDate}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-slate-700">
                    Number of Travelers:
                  </span>
                  <span className="text-sm text-slate-900">
                    {formData.numberOfTravelers}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-slate-700">
                    Purpose of Travel:
                  </span>
                  <span className="text-sm text-slate-900">
                    {formData.travelPurpose}
                  </span>
                </div>

                {/* Additional Travelers Review */}
                {formData.numberOfTravelers > 1 && (
                  <div className="pt-4 mt-6 border-t border-gray-200">
                    <h5 className="mb-3 text-sm font-semibold text-slate-800">
                      Additional Travelers:
                    </h5>
                    {formData.travelers.slice(1).map((traveler, index) => (
                      <div
                        key={index + 1}
                        className="p-3 mb-3 bg-white border border-gray-100 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">
                            Traveler {index + 2}:
                          </span>
                          <span className="text-sm text-slate-900">
                            {traveler.name || t("visaApplication.labels.notProvided")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-medium text-slate-700">
                            Phone:
                          </span>
                          <span className="text-sm text-slate-900">
                            {traveler.phoneNumber || t("visaApplication.labels.notProvided")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Documents Uploaded */}
                <div className="pt-4 mt-6 border-t border-gray-200">
                  <h5 className="mb-3 text-sm font-semibold text-slate-800">
                    Documents Uploaded:
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Picture/Headshot:
                      </span>
                      <span className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {formData.pictureHeadshot?.name || t("visaApplication.labels.notUploaded")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Passport Document:
                      </span>
                      <span className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {formData.passportDocument?.name || t("visaApplication.labels.notUploaded")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Confirmation */}
            <div className="p-6 border border-yellow-200 bg-yellow-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-yellow-600" />
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-yellow-800">
                    Important Notice
                  </h4>
                  <p className="text-sm text-yellow-700">
                    By submitting this application, you confirm that all
                    information provided is accurate and complete. You will
                    receive a confirmation email with your application details
                    and tracking information.
                  </p>
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      ></div>

      {/* Popup Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative p-6 text-white bg-gradient-to-r from-sky-500 to-blue-600">
          <button
            onClick={handleCancel}
            className="absolute flex items-center justify-center w-8 h-8 transition-colors rounded-full top-4 right-4 bg-white/20 hover:bg-white/30"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pr-12">
            <h2 className="mb-2 text-2xl font-bold">{t("visaApplication.labels.applicationDetails")}</h2>
            <p className="text-blue-100">
              {stepTitles[currentStep]} - Step {currentStep} of {totalSteps}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mt-6 space-x-2 overflow-x-auto">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors min-w-fit ${
                    currentStep >= step
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-blue-200"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep > step
                        ? "bg-white text-sky-600"
                        : currentStep === step
                          ? "bg-white text-sky-600"
                          : "bg-white/20"
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>
                  <span className="hidden text-xs sm:inline">
                    {stepTitles[step]?.split(" ")[0]}
                  </span>
                </div>
                {step < totalSteps && (
                  <div className="w-6 h-0.5 bg-white/30 hidden sm:block"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={currentStep === 1 ? handleCancel : handleBack}
            className="px-6 py-3 font-medium transition-colors rounded-lg text-slate-600 hover:text-slate-800 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500">
              Step {currentStep} of {totalSteps}
            </span>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center px-8 py-3 space-x-2 font-medium text-white transition-colors rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("visaApplication.labels.submitting")}</span>
                </>
              ) : (
                <>
                  <span>
                    {currentStep === totalSteps
                      ? t("visaApplication.labels.submitApplication")
                      : currentStep === 3
                        ? t("visaApplication.labels.details")
                        : currentStep === 4
                          ? t("visaApplication.labels.review")
                          : t("visaApplication.labels.next")}
                  </span>
                  {currentStep === totalSteps ? (
                    <Send className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed top-4 right-4 z-[10000] max-w-sm">
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-medium text-red-800">
                Please fill in all required fields before continuing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
