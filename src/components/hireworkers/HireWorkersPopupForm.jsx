import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { showSuccess, showError, showWarning } from "@/lib/utils/toast";
import {
  Phone,
  Mail,
  User,
  Building,
  Users,
  Briefcase,
  Clock,
  Loader2,
  ChevronDown,
  MessageSquare,
  X,
} from "lucide-react";
import { createInquiry } from "@/utils/crmUtils";

const HireWorkersPopupForm = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation("hire-workers");

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    phone: "",
    email: "",
    workersNeeded: "",
    skillLevel: "",
    industry: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const skillLevelOptions = [
    { value: "skilled", label: t("popup.form.skillLevels.skilled") },
    { value: "semi-skilled", label: t("popup.form.skillLevels.semiSkilled") },
    { value: "unskilled", label: t("popup.form.skillLevels.unskilled") },
    { value: "mixed", label: t("popup.form.skillLevels.mixed") },
  ];

  const industryOptions = [
    { value: "manufacturing", label: t("popup.form.industries.manufacturing") },
    { value: "construction", label: t("popup.form.industries.construction") },
    { value: "logistics", label: t("popup.form.industries.logistics") },
    { value: "agriculture", label: t("popup.form.industries.agriculture") },
    { value: "hospitality", label: t("popup.form.industries.hospitality") },
    { value: "retail", label: t("popup.form.industries.retail") },
    { value: "other", label: t("popup.form.industries.other") },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!formData.companyName) {
      showWarning(t("popup.errors.companyNameRequired"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.contactName) {
      showWarning(t("popup.errors.contactNameRequired"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.email) {
      showWarning(t("popup.errors.emailRequired"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.phone) {
      showWarning(t("popup.errors.phoneRequired"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.workersNeeded) {
      showWarning(t("popup.errors.workersNeededRequired"));
      setIsSubmitting(false);
      return;
    }
    if (!formData.skillLevel) {
      showWarning(t("popup.errors.skillLevelRequired"));
      setIsSubmitting(false);
      return;
    }

    const selectedSkillLevel = skillLevelOptions.find(
      (option) => option.value === formData.skillLevel
    );
    const selectedIndustry = industryOptions.find(
      (option) => option.value === formData.industry
    );

    const additionalDetails = `
Company: ${formData.companyName}
Workers Needed: ${formData.workersNeeded}
Skill Level: ${selectedSkillLevel?.label || formData.skillLevel}
Industry: ${selectedIndustry?.label || formData.industry || "Not specified"}
Message: ${formData.message || "No additional message"}
    `.trim();

    const response = await createInquiry({
      name: formData.contactName,
      interested_service: "Hire Workers in Turkey (B2B Recruitment)",
      mobile_no: formData.phone,
      email: formData.email,
      address: formData.companyName,
      additional_details: additionalDetails,
    });

    if (response.status === 1) {
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "formSubmitted",
          formType: "Hire Workers in Turkey (B2B Recruitment)",
        });
      }
      showSuccess(t("popup.success"));
      router.push("/thankyou");
    } else {
      showError(t("popup.error") + response.data.message);
    }

    setFormData({
      companyName: "",
      contactName: "",
      phone: "",
      email: "",
      workersNeeded: "",
      skillLevel: "",
      industry: "",
      message: "",
    });
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-2 sm:mx-4 bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute z-20 p-2 text-white transition-all duration-200 bg-black rounded-full top-4 right-4 sm:top-6 sm:right-6 hover:text-gray-200 bg-opacity-20 hover:bg-opacity-30"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="overflow-y-auto h-full max-h-[95vh] sm:max-h-[90vh]">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-sky-900 mb-2">
                {t("popup.title")}
              </h3>
              <p className="text-sky-600">{t("popup.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Name */}
              <div className="relative group">
                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                <input
                  type="text"
                  name="companyName"
                  placeholder={t("popup.form.companyNamePlaceholder")}
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                />
              </div>

              {/* Contact Name */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                <input
                  type="text"
                  name="contactName"
                  placeholder={t("popup.form.contactNamePlaceholder")}
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                />
              </div>

              {/* Phone and Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t("popup.form.phonePlaceholder")}
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder={t("popup.form.emailPlaceholder")}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Workers Needed */}
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                <input
                  type="text"
                  name="workersNeeded"
                  placeholder={t("popup.form.workersNeededPlaceholder")}
                  value={formData.workersNeeded}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                />
              </div>

              {/* Skill Level and Industry Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors z-10" />
                  <select
                    name="skillLevel"
                    value={formData.skillLevel}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-12 pr-12 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 disabled:opacity-50 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-sky-400">
                      {t("popup.form.skillLevelPlaceholder")}
                    </option>
                    {skillLevelOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="text-sky-800"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 pointer-events-none" />
                </div>

                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors z-10" />
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full pl-12 pr-12 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 disabled:opacity-50 appearance-none cursor-pointer"
                  >
                    <option value="" className="text-sky-400">
                      {t("popup.form.industryPlaceholder")}
                    </option>
                    {industryOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="text-sky-800"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Message */}
              <div className="relative group">
                <MessageSquare className="absolute left-4 top-4 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                <textarea
                  name="message"
                  placeholder={t("popup.form.messagePlaceholder")}
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:from-sky-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t("popup.form.submitting")}
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 mr-2" />
                    {t("popup.form.submitButton")}
                  </>
                )}
              </button>

              <p className="text-xs text-sky-500 text-center">
                {t("popup.form.terms")}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HireWorkersPopupForm;
