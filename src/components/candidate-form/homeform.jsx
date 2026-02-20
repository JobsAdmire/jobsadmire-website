import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { showSuccess, showError, showWarning } from "@/lib/utils/toast";
import {
  Upload,
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Building,
  Briefcase,
  Award,
  Code,
  CheckCircle,
} from "lucide-react";

import { env } from "@/lib/constants/env";

const JobApplicationForm = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  // Define your API base URL and Bearer Token here
  // IMPORTANT: In a real application, fetch the token securely (e.g., from localStorage, a cookie, or an auth context)
  const API_BASE_URL = `${env.CRM_API_URL}/api/create-job-candidate`;
  const BEARER_TOKEN =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NybS5qb2JzYWRtaXJlLmNvbS9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc1Mzc5OTUzNiwiZXhwIjoxNzg1MzU3MTM2LCJuYmYiOjE3NTM3OTk1MzYsImp0aSI6ImRWWUMxa25ZTTRPNmJLeHIiLCJzdWIiOiI2NCIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.n3NK35juH7XulRqtS3DHXuJCpoEQ-PcKA4wZbyrK6JE"; // Replace with your actual bearer token

  // Form Data State - Updated to match API parameters
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    mother_name: "", // New API field
    father_name: "", // New API field
    email: "",
    phone: "",
    dob: "", // Matches API field
    gender: "", // Matches API field
    height: "", // Matches API field
    weight: "", // Matches API field
    address: "", // Matches API field
    country: "", // Matches API field
    city: "", // Matches API field
    state: "", // Matches API field
    place_of_birth: "", // Renamed from placeOfBirth
    worker_abroad_residence_address: "", // Renamed from abroadResidenceAddress
    passport_number: "", // Renamed from passportNumber
    video_link: "", // New API field
    candidate_category: "3", // New API field (integer)
    candidate_language: "", // New API field
    other_languages: "", // New API field
    description: "", // New API field, will consolidate job-specific details
    workspace: "", // New API field
    password: "",
    jobCategory: "",
    // 'programmingLanguages', 'experience', 'medicalLicense', 'specialization' will be combined into 'description'.
  });

  // File States - Updated to match API parameters
  const [files, setFiles] = useState({
    profile: null, // Renamed from profileImage
    resume: null, // Renamed from resumeFile
    passport: null, // Renamed from passportFile
    full_body_photo: null, // Renamed from fullBodyPhoto
    biometric_photo: null, // New API field
    video: null, // New API field
  });

  // Experience States (remain as is, will be stringified for API)
  const [projects, setProjects] = useState([
    {
      id: crypto.randomUUID(),
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      reference: "",
    },
  ]);

  const [candidateJobs, setCandidateJobs] = useState([
    {
      id: crypto.randomUUID(),
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      reference: "",
    },
  ]);

  const [qualifications, setQualifications] = useState([
    {
      id: crypto.randomUUID(),
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      reference: "",
    },
  ]);

  const [skills, setSkills] = useState([
    {
      id: crypto.randomUUID(),
      type: "",
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      reference: "",
    },
  ]);

  const [currentSection, setCurrentSection] = useState("personal");

  const jobCategories = [
    { value: "tourism", label: t("labels.candidateForm.jobCategoryTourism"), icon: Globe, apiId: 3 },
    { value: "factory", label: t("labels.candidateForm.jobCategoryFactory"), icon: Building, apiId: 8 },
    {
      value: "construction",
      label: t("labels.candidateForm.jobCategoryConstruction"),
      icon: Briefcase,
      apiId: 10,
    },
    { value: "agriculture", label: t("labels.candidateForm.jobCategoryAgriculture"), icon: Award, apiId: 11 },
  ];

  const sections = [
    { id: "personal", label: t("labels.candidateForm.personalInfo"), icon: User },
    { id: "professional", label: t("labels.candidateForm.professional"), icon: Briefcase },
    { id: "documents", label: t("labels.candidateForm.documents"), icon: FileText },
  ];

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFiles((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  const validatePersonalInfo = () => {
    const errors = {};

    if (!formData.name?.trim()) errors.name = t("labels.candidateForm.validationRequired");
    if (!formData.surname?.trim()) errors.surname = t("labels.candidateForm.validationRequired");
    if (!formData.email?.trim()) errors.email = t("labels.candidateForm.validationRequired");
    if (!formData.phone?.trim()) errors.phone = t("labels.candidateForm.validationRequired");
    if (!formData.dob) errors.dob = t("labels.candidateForm.dobRequired");
    if (!formData.gender) errors.gender = t("labels.candidateForm.genderRequired");
    if (!formData.address?.trim()) errors.address = t("labels.candidateForm.validationRequired");
    if (!formData.country?.trim()) errors.country = t("labels.candidateForm.validationRequired");
    if (!formData.state?.trim()) errors.state = t("labels.candidateForm.stateRequired");
    if (!formData.city?.trim()) errors.city = t("labels.candidateForm.validationRequired");
    if (!formData.place_of_birth?.trim())
      errors.place_of_birth = t("labels.candidateForm.placeOfBirthRequired");
    if (!formData.worker_abroad_residence_address?.trim())
      errors.worker_abroad_residence_address =
        t("labels.candidateForm.workerAbroadResidenceRequired");

    return errors;
  };

  const validateProfessionalInfo = () => {
    const errors = {};

    if (!formData.jobCategory) errors.jobCategory = t("labels.candidateForm.jobCategoryRequired");
    if (!formData.password?.trim()) errors.password = t("labels.candidateForm.validationRequired");
    if (!formData.candidate_language?.trim())
      errors.candidate_language = t("labels.candidateForm.candidateLanguageRequired");

    if (formData.jobCategory === "tourism") {
      if (!formData.weight)
        errors.weight = t("labels.candidateForm.weightRequired");
      if (!formData.height)
        errors.height = t("labels.candidateForm.heightRequired");
      if (!files.full_body_photo)
        errors.full_body_photo =
          t("labels.candidateForm.fullBodyPhotoRequiredTourism");
    }

    return errors;
  };

  const validateDocumentsInfo = () => {
    const errors = {};
    if (!formData.passport_number?.trim())
      errors.passport_number = t("labels.candidateForm.passportNumberRequired");
    if (!files.profile) errors.profile = t("labels.candidateForm.profilePhotoRequired");
    if (!files.resume) errors.resume = t("labels.candidateForm.resumeRequired");
    if (!files.passport) errors.passport = t("labels.candidateForm.passportScanRequired");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (currentSection === "personal") {
      validationErrors = validatePersonalInfo();
    }

    if (currentSection === "professional") {
      validationErrors = validateProfessionalInfo();
    }

    if (currentSection === "documents") {
      validationErrors = validateDocumentsInfo();
    }

    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = document.querySelector(".field-error");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return; // stop submission
    }

    if (validationErrors.length > 0) {
      showWarning(
        t("labels.candidateForm.fixErrorsIntro") + (validationErrors && Array.isArray(validationErrors) ? validationErrors.join("\n") : "")
      );
      return false;
    }

    if (currentSection !== sections[sections.length - 1].id) {
      return true;
    }

    // Validate file sizes
    const fileSizeErrors = [];
    if (files.profile && files.profile.size > 5 * 1024 * 1024) {
      fileSizeErrors.push(t("labels.candidateForm.profilePhotoMaxSize"));
    }
    if (files.resume && files.resume.size > 2 * 1024 * 1024) {
      fileSizeErrors.push(t("labels.candidateForm.resumeMaxSize"));
    }
    if (files.passport && files.passport.size > 5 * 1024 * 1024) {
      fileSizeErrors.push(t("labels.candidateForm.passportScanMaxSize"));
    }
    if (files.full_body_photo && files.full_body_photo.size > 5 * 1024 * 1024) {
      fileSizeErrors.push(t("labels.candidateForm.fullBodyPhotoMaxSize"));
    }
    if (files.biometric_photo && files.biometric_photo.size > 5 * 1024 * 1024) {
      fileSizeErrors.push(t("labels.candidateForm.biometricPhotoMaxSize"));
    }
    if (files.video && files.video.size > 50 * 1024 * 1024) {
      fileSizeErrors.push(t("labels.candidateForm.videoMaxSize"));
    }

    if (fileSizeErrors.length > 0) {
      showWarning(t("labels.candidateForm.fileSizeErrorsIntro") + fileSizeErrors.join("\n"));
      return;
    }

    try {
      const dataToSend = new FormData();

      // Get the API category ID from jobCategory
      const selectedCategory = jobCategories.find(
        (cat) => cat.value === formData.jobCategory
      );
      const candidateCategoryId = selectedCategory?.apiId;

      if (!candidateCategoryId) {
        showWarning(t("labels.candidateForm.selectValidJobCategory"));
        return;
      }

      // Consolidate job-specific fields into 'description'
      let consolidatedDescription = formData.description || "";

      // Add category-specific fields to description
      switch (formData.jobCategory) {
        case "tourism":
          if (formData.weight) {
            consolidatedDescription += `\nWeight: ${formData.weight} kg`;
          }
          if (formData.height) {
            consolidatedDescription += `\nHeight: ${formData.height} cm`;
          }
          break;

        case "factory":
          if (formData.factorySkills) {
            consolidatedDescription += `\nFactory Skills: ${formData.factorySkills}`;
          }
          if (formData.experience) {
            consolidatedDescription += `\nYears of Experience: ${formData.experience}`;
          }
          break;

        case "construction":
          if (formData.constructionSkills) {
            consolidatedDescription += `\nConstruction Skills: ${formData.constructionSkills}`;
          }
          if (formData.experience) {
            consolidatedDescription += `\nYears of Experience: ${formData.experience}`;
          }
          break;

        case "agriculture":
          if (formData.agricultureSkills) {
            consolidatedDescription += `\nAgricultural Skills: ${formData.agricultureSkills}`;
          }
          if (formData.experience) {
            consolidatedDescription += `\nYears of Experience: ${formData.experience}`;
          }
          break;
      }

      // Append all text form data, mapping to API parameters
      for (const key in formData) {
        // Skip job-specific fields that are being consolidated or not sent
        if (
          [
            "jobCategory",
            "password",
            "experience",
            "factorySkills",
            "constructionSkills",
            "agricultureSkills",
            "weight",
            "height",
            "candidate_category",
          ].includes(key)
        ) {
          continue;
        }

        // Only append non-empty values
        if (formData[key]) {
          if (key === "description") {
            dataToSend.append(key, consolidatedDescription.trim());
          } else if (key === "workspace" && formData[key]) {
            // Ensure workspace is sent as an integer if it has a value
            dataToSend.append(key, parseInt(formData[key], 10));
          } else {
            dataToSend.append(key, formData[key]);
          }
        }
      }

      // Append candidate_category with the mapped ID
      dataToSend.append("candidate_category", candidateCategoryId);

      // Append password separately
      if (formData.password) {
        dataToSend.append("password", formData.password);
      }

      // Append weight and height for tourism (not consolidated, sent as separate fields)
      if (formData.jobCategory === "tourism") {
        if (formData.weight) {
          dataToSend.append("weight", formData.weight);
        }
        if (formData.height) {
          dataToSend.append("height", formData.height);
        }
      }

      // Append all file fields, mapping to API parameters
      if (files.profile) dataToSend.append("profile", files.profile);
      if (files.resume) dataToSend.append("resume", files.resume);
      if (files.passport) dataToSend.append("passport", files.passport);
      if (files.full_body_photo)
        dataToSend.append("full_body_photo", files.full_body_photo);
      if (files.biometric_photo)
        dataToSend.append("biometric_photo", files.biometric_photo);
      if (files.video) dataToSend.append("video", files.video);

      // Append structured arrays as JSON strings
      dataToSend.append("projects_data", JSON.stringify(projects));
      dataToSend.append("candidate_jobs_data", JSON.stringify(candidateJobs));
      dataToSend.append("qualifications_data", JSON.stringify(qualifications));
      dataToSend.append("skills_data", JSON.stringify(skills));

      // DEBUG: Log what's being sent
      console.log("=== FORM DATA BEING SENT ===");
      for (let pair of dataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(
            pair[0] +
              ": [FILE] " +
              pair[1].name +
              " (" +
              pair[1].size +
              " bytes)"
          );
        } else {
          console.log(pair[0] + ": " + pair[1]);
        }
      }

      setIsSubmitting(true);

      try {
        const response = await fetch(`${API_BASE_URL}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
          body: dataToSend,
        });

        const result = await response.json();
        console.log("API Response:", result);
        // Check for errors in the response body (even if status is 200)
        if (result.error || result.errors) {
          const errorMessage =
            result.error ||
            (typeof result.errors === "object"
              ? Object.values(result.errors).flat().join("\n")
              : JSON.stringify(result.errors));
          showError(t("labels.candidateForm.errorSubmittingApplication") + errorMessage);
          console.error("API Error:", result);
          return;
        }

        // Only show success if there's actually a success indicator
        if (response.ok && result.success !== false) {
          showSuccess(
            `Application submitted successfully!${result.id ? ` Application ID: ${result.id}` : ""}`
          );
          console.log("Full API Response:", JSON.stringify(result, null, 2));

          // Redirect to thank you page after successful submission
          router.push("/thankyou");
        } else {
          showError(t("labels.candidateForm.errorPrefix") + (result.message || t("labels.candidateForm.unknownError")));
          console.error("Error details:", result);
        }
      } catch (e) {
        showError(t("labels.candidateForm.errorSubmittingApplication") + (e?.message || e));
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      showError(
        t("labels.candidateForm.submitFailed")
      );
    }
  };

  const renderJobSpecificFields = () => {
    if (!formData.jobCategory) return null;

    const getJobIcon = () => {
      const category = jobCategories.find(
        (cat) => cat.value === formData.jobCategory
      );
      const IconComponent = category?.icon || Code;
      return <IconComponent className="w-5 h-5 text-blue-600" />;
    };

    const getJobLabel = () => {
      const category = jobCategories.find(
        (cat) => cat.value === formData.jobCategory
      );
      return category?.label || t("labels.candidateForm.jobCategory");
    };

    let fields = null;
    switch (formData.jobCategory) {
      case "tourism":
        fields = (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                {t("labels.candidateForm.weightKg")}
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={t("labels.candidateForm.placeholderWeight")}
              />
            </div>
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                {t("labels.candidateForm.heightCm")}
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={t("labels.candidateForm.placeholderHeight")}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                {t("labels.candidateForm.uploadFullBodyPhoto")}
              </label>
              <input
                type="file"
                accept=".jpeg,.jpg,.png"
                onChange={(e) => handleFileChange(e, "full_body_photo")}
                className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-sky-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                {t("labels.candidateForm.supportedFormats")}
              </p>
            </div>
          </div>
        );
        break;

      case "factory":
        fields = (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                {t("labels.candidateForm.factorySkills")}
              </label>
              <input
                type="text"
                name="factorySkills"
                value={formData.factorySkills}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={t("labels.candidateForm.placeholderFactorySkills")}
              />
            </div>
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                {t("labels.candidateForm.yearsOfExperience")}
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={t("labels.candidateForm.placeholderExperience")}
              />
            </div>
          </div>
        );
        break;

      case "construction":
        fields = (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                {t("labels.candidateForm.constructionSkills")}
              </label>
              <input
                type="text"
                name="constructionSkills"
                value={formData.constructionSkills}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={t("labels.candidateForm.placeholderConstructionSkills")}
              />
            </div>
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                {t("labels.candidateForm.yearsOfExperience")}
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={t("labels.candidateForm.placeholderExperience")}
              />
            </div>
          </div>
        );
        break;

      case "agriculture":
        fields = (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                {t("labels.candidateForm.agricultureSkills")}
              </label>
              <input
                type="text"
                name="agricultureSkills"
                value={formData.agricultureSkills}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={t("labels.candidateForm.placeholderAgricultureSkills")}
              />
            </div>
            <div>
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                {t("labels.candidateForm.yearsOfExperience")}
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={t("labels.candidateForm.placeholderExperience")}
              />
            </div>
          </div>
        );
        break;

      default:
        return null;
    }

    return (
      <div className="p-6 mt-8 border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {getJobIcon()}
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {getJobLabel()} {t("labels.candidateForm.specificInformation")}
          </h3>
        </div>
        {fields}
      </div>
    );
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "personal":
        return (
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 shadow-sm bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {t("labels.candidateForm.personalInfoTitle")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* First Name */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.firstName")} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                    formErrors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder={t("labels.candidateForm.placeholderFirstName")}
                />
                {formErrors.name && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.lastName")} *
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                    formErrors.surname
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder={t("labels.candidateForm.placeholderLastName")}
                />
                {formErrors.surname && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.surname}
                  </p>
                )}
              </div>

              {/* Mother’s Name */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.motherName")}
                </label>
                <input
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                  placeholder={t("labels.candidateForm.placeholderMotherName")}
                />
              </div>

              {/* Father’s Name */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.fatherName")}
                </label>
                <input
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                  placeholder={t("labels.candidateForm.placeholderFatherName")}
                />
              </div>

              {/* Date of Birth */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.dob")} *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                    formErrors.dob
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200"
                  }`}
                />
                {formErrors.dob && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.dob}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.phone")} *
                </label>
                <div className="relative">
                  <Phone className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full py-3 pl-12 pr-4 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                      formErrors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={t("labels.candidateForm.placeholderPhoneExample")}
                  />
                </div>
                {formErrors.phone && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.email")} *
                </label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full py-3 pl-12 pr-4 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                      formErrors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={t("labels.candidateForm.placeholderEmailExample")}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.gender")} *
                </label>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-2 focus:ring-sky-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {t("labels.candidateForm.genderMale")}
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-2 focus:ring-sky-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {t("labels.candidateForm.genderFemale")}
                    </span>
                  </label>
                </div>
                {formErrors.gender && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.gender}
                  </p>
                )}
              </div>
            </div>

            {/* Location Information Section */}
            <div className="mt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 shadow-sm bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {t("labels.candidateForm.locationInfoTitle")}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Address */}
                <div className="field-error lg:col-span-3">
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.candidateForm.currentAddress")}
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                      formErrors.address
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={t("labels.candidateForm.placeholderCurrentAddress")}
                  />
                  {formErrors.address && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="field-error">
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.candidateForm.country")} *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                      formErrors.country
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={t("labels.candidateForm.country")}
                  />
                  {formErrors.country && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.country}
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="field-error">
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.candidateForm.stateProvince")}
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                      formErrors.state
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={t("labels.candidateForm.placeholderStateProvince")}
                  />
                  {formErrors.state && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.state}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="field-error">
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.candidateForm.city")} *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                      formErrors.city
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={t("labels.candidateForm.placeholderCity")}
                  />
                  {formErrors.city && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                {/* Place of Birth */}
                <div className="field-error lg:col-span-2">
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.candidateForm.placeOfBirth")} *
                  </label>
                  <input
                    type="text"
                    name="place_of_birth"
                    value={formData.place_of_birth}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                      formErrors.place_of_birth
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={t("labels.candidateForm.placeholderPlaceOfBirth")}
                  />
                  {formErrors.place_of_birth && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.place_of_birth}
                    </p>
                  )}
                </div>

                {/* Worker Abroad Residence Address */}
                <div className="field-error lg:col-span-3">
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("labels.candidateForm.workerAbroadResidenceAddress")} *
                  </label>
                  <textarea
                    name="worker_abroad_residence_address"
                    value={formData.worker_abroad_residence_address}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                      formErrors.worker_abroad_residence_address
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={t("labels.candidateForm.placeholderWorkerAbroad")}
                  />
                  {formErrors.worker_abroad_residence_address && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors.worker_abroad_residence_address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case "professional":
        return (
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 shadow-sm bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {t("labels.candidateForm.professionalInfoTitle")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Job Category */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.jobCategory")} *
                </label>
                <select
                  name="jobCategory"
                  value={formData.jobCategory}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                    formErrors.jobCategory
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">{t("labels.candidateForm.selectProfession")}</option>
                  {jobCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {formErrors.jobCategory && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.jobCategory}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.createPassword")}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                    formErrors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder={t("labels.candidateForm.placeholderCreatePassword")}
                />
                {formErrors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.password}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {t("labels.candidateForm.passwordLoginHint")}
                </p>
              </div>

              {/* Candidate Language */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.candidateLanguage")} *
                </label>
                <input
                  type="text"
                  name="candidate_language"
                  value={formData.candidate_language}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                    formErrors.candidate_language
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder={t("labels.candidateForm.placeholderCandidateLanguage")}
                />
                {formErrors.candidate_language && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.candidate_language}
                  </p>
                )}
              </div>

              {/* Other Languages */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.otherLanguages")}
                </label>
                <input
                  type="text"
                  name="other_languages"
                  value={formData.other_languages}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder={t("labels.candidateForm.placeholderOtherLanguages")}
                />
              </div>
            </div>

            {/* 👇 KEEP: dynamically rendered job-specific fields */}
            {renderJobSpecificFields()}

            {/* Additional Description */}
            <div className="mt-8">
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                {t("labels.candidateForm.additionalDescription")}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={t("labels.candidateForm.placeholderAdditionalDescription")}
              />
            </div>
          </section>
        );

      case "documents":
        return (
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 shadow-sm bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {t("labels.candidateForm.documentInfoTitle")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Passport Number */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.passportNumber")} *
                </label>
                <input
                  type="text"
                  name="passport_number"
                  value={formData.passport_number}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 ${
                    formErrors.passport_number
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200"
                  }`}
                  placeholder={t("labels.candidateForm.placeholderPassport")}
                />
                {formErrors.passport_number && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.passport_number}
                  </p>
                )}
              </div>

              {/* Profile Photo */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.profilePhoto")} *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="profile"
                    accept=".jpeg,.jpg,.png"
                    onChange={(e) => handleFileChange(e, "profile")}
                    className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 ${
                      formErrors.profile
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  <Upload className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {t("labels.candidateForm.supportedFormatsProfile")}
                </p>
                {formErrors.profile && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.profile}
                  </p>
                )}
              </div>

              {/* Resume/CV */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.resumeCvFile")}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, "resume")}
                    className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 ${
                      formErrors.resume
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  <Upload className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {t("labels.candidateForm.supportedFormatsResume")}
                </p>
                {files.resume && (
                  <p className="mt-1 text-xs text-green-600">
                    {t("labels.candidateForm.selectedFile")} {files.resume.name} (
                    {(files.resume.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {formErrors.resume && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.resume}
                  </p>
                )}
              </div>

              {/* Passport Scan */}
              <div className="field-error">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.passportScanFile")}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="passport"
                    accept=".jpeg,.jpg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, "passport")}
                    className={`w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2 focus:ring-sky-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 ${
                      formErrors.passport
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200"
                    }`}
                  />
                  <Upload className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {t("labels.candidateForm.supportedFormatsPassport")}
                </p>
                {formErrors.passport && (
                  <p className="mt-2 text-sm text-red-600">
                    {formErrors.passport}
                  </p>
                )}
              </div>

              {/* Biometric Photo (optional) */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.biometricPhoto")}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="biometric_photo"
                    accept=".jpeg,.jpg,.png"
                    onChange={(e) => handleFileChange(e, "biometric_photo")}
                    className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
                  />
                  <Upload className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {t("labels.candidateForm.supportedFormatsBiometric")}
                </p>
              </div>

              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.videoFile")}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="video"
                    accept=".mp4,.mov,.avi"
                    onChange={(e) => handleFileChange(e, "video")}
                    className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
                  />
                  <Upload className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {t("labels.candidateForm.supportedFormatsVideo")}
                </p>
              </div>

              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("labels.candidateForm.videoLink")}
                </label>
                <input
                  type="url"
                  name="video_link"
                  value={formData.video_link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder={t("labels.candidateForm.placeholderVideoLinkExample")}
                />
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 mt-10 bg-gradient-to-br from-blue-50 to-purple-50 sm:p-10">
      <div className="max-w-7xl mx-auto overflow-hidden bg-white shadow-2xl rounded-3xl">
        {/* Header */}
        <div className="p-8 text-white bg-gradient-to-r from-sky-600 to-blue-700">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-center">
            {t("labels.candidateForm.formTitle")}
          </h1>
          <p className="text-xl font-light text-center opacity-90">
            {t("labels.candidateForm.formSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-12">
          {/* Progress Indicator / Section Navigation */}
          <div className="mb-12">
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded-full shadow-inner">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`flex-1 text-center py-3 px-4 rounded-full font-semibold transition-all duration-300 ease-in-out
                    ${
                      currentSection === section.id
                        ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                    } flex items-center justify-center gap-2`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{section.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Render Current Section Content */}
          {renderCurrentSection()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 mt-12 border-t-2 border-gray-100">
            {currentSection !== sections[0].id && (
              <button
                type="button"
                onClick={() => {
                  const currentIndex = sections.findIndex(
                    (s) => s.id === currentSection
                  );
                  if (currentIndex > 0) {
                    setCurrentSection(sections[currentIndex - 1].id);
                  }
                }}
                className="px-8 py-3 font-bold text-gray-800 transition-colors duration-200 bg-gray-200 shadow-md rounded-xl hover:bg-gray-300"
              >
                {t("labels.candidateForm.previous")}
              </button>
            )}

            <button
              type="button"
              onClick={async (e) => {
                const valid = await handleSubmit(e);
                if (valid) {
                  const currentIndex = sections.findIndex(
                    (s) => s.id === currentSection
                  );
                  if (currentIndex < sections.length - 1) {
                    setCurrentSection(sections[currentIndex + 1].id);
                  }
                }
              }}
              className={`flex items-center gap-2 px-8 py-3 ml-auto font-bold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl hover:from-sky-600 hover:to-blue-600 ${currentSection !== sections[sections.length - 1].id ? "" : "hidden"}`}
            >
              {t("labels.candidateForm.nextStep")}
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-10 py-3 ml-auto font-bold text-white transition-all duration-200 shadow-lg rounded-xl 
    ${
      isSubmitting
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
    } 
    ${currentSection === sections[sections.length - 1].id ? "" : "hidden"}`}
            >
              {isSubmitting ? (
                <>
                  {/* Spinner */}
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
                  {t("labels.candidateForm.submitting")}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t("labels.candidateForm.submitApplication")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;
