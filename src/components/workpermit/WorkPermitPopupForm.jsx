import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { showSuccess, showError, showWarning } from "@/lib/utils/toast";
import {
  Phone,
  Mail,
  User,
  Briefcase,
  Clock,
  Loader2,
  ChevronDown,
  Globe,
  X,
} from "lucide-react";
import { createInquiry } from "@/utils/crmUtils";
import { COUNTRIES_LIST } from "@/lib/utils/countries";

const WorkPermitPopupForm = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation("work-permit");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    citizenship: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryOptions = COUNTRIES_LIST.map((country) => ({
    value: country.toLowerCase().replace(/\s+/g, "-"),
    label: country,
  }));

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

    if (!formData.name) {
      showWarning(t("popup.errors.nameRequired"));
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
    if (!formData.citizenship) {
      showWarning(t("popup.errors.citizenshipRequired"));
      setIsSubmitting(false);
      return;
    }

    const selectedCountry = countryOptions.find(
      (option) => option.value === formData.citizenship
    );

    const response = await createInquiry({
      name: formData.name,
      interested_service: "Work Permit (Owner/Director/Investor)",
      mobile_no: formData.phone,
      email: formData.email,
      address: "",
      additional_details: `Current Citizenship: ${selectedCountry?.label || formData.citizenship}`,
    });

    if (response.status === 1) {
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "formSubmitted",
          formType: "Work Permit (Owner/Director/Investor)",
        });
      }
      showSuccess(t("popup.success"));
      router.push("/thankyou");
    } else {
      showError(t("popup.error") + response.data.message);
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      citizenship: "",
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

        <div className="overflow-y-auto h-full">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-sky-900 mb-2">
                {t("popup.title")}
              </h3>
              <p className="text-sky-600">{t("popup.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder={t("popup.form.namePlaceholder")}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 placeholder-sky-400 disabled:opacity-50"
                />
              </div>

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

              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-400 w-5 h-5 group-focus-within:text-sky-600 transition-colors z-10" />
                <select
                  name="citizenship"
                  value={formData.citizenship}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-12 py-4 bg-sky-50/50 border-2 border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 text-sky-800 disabled:opacity-50 appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-sky-400">
                    {t("popup.form.citizenshipPlaceholder")}
                  </option>
                  {countryOptions.map((option) => (
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

export default WorkPermitPopupForm;
