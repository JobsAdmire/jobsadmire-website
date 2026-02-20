import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import {
  CheckCircle,
  CreditCard,
  FileText,
  Calendar,
  Mail,
  Phone,
  User,
  MapPin,
  Info,
} from "lucide-react";
import { COUNTRIES_LIST } from "@/lib/utils/countries";

export default function VisaApplicationForm() {
  const { t } = useTranslation("common");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    visaType: "Tourist E-visa up to 90 days",
    email: "",
    phone: "",
    citizenship: "Afghanistan",
    entryDay: "2",
    entryMonth: "Mar",
    entryYear: "2025",
    firstName: "",
    lastName: "",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    agreeTerms: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const countries = COUNTRIES_LIST;

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const monthKeys = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const months = monthKeys.map((k) => ({ key: k, label: t(`labels.applyOnline.months.${k}`) }));
  const years = ["2025", "2026", "2027", "2028", "2029", "2030"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t("labels.applyOnline.title")}
          </h1>
          <p className="text-gray-600">
            {t("labels.applyOnline.subtitle")}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-8">
            <div
              className={`flex items-center space-x-3 ${currentStep >= 1 ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 1
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-gray-300"
                }`}
              >
                {currentStep > 1 ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </div>
              <span className="font-semibold">{t("labels.applyOnline.stepApplication")}</span>
            </div>

            <div
              className={`h-1 w-16 ${currentStep >= 2 ? "bg-green-600" : "bg-gray-300"}`}
            ></div>

            <div
              className={`flex items-center space-x-3 ${currentStep >= 2 ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 2
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-gray-300"
                }`}
              >
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="font-semibold">{t("labels.applyOnline.stepPayment")}</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {currentStep === 1 && (
            <div className="p-8">
              {/* Application Header */}
              <div className="flex items-center space-x-3 mb-8">
                <FileText className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("labels.applyOnline.applicationDetails")}
                </h2>
              </div>

              {/* Visa Type Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <Info className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      {t("labels.applyOnline.visaTypeLabel")}
                    </h3>
                    <p className="text-blue-700 text-sm">
                      {t("labels.applyOnline.visaTypeDescription")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Visa Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t("labels.applyOnline.visaTypeSelectLabel")}
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  value={formData.visaType}
                  onChange={(e) =>
                    handleInputChange("visaType", e.target.value)
                  }
                >
                  <option>{t("labels.applyOnline.visaTypeTourist")}</option>
                  <option>{t("labels.applyOnline.visaTypeBusiness")}</option>
                  <option>{t("labels.applyOnline.visaTypeTransit")}</option>
                </select>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Mail className="inline w-4 h-4 mr-2" />
                    {t("labels.applyOnline.email")} *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={t("labels.applyOnline.placeholderEmail")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Phone className="inline w-4 h-4 mr-2" />
                    {t("labels.applyOnline.phone")} *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={t("labels.applyOnline.placeholderPhone")}
                  />
                </div>
              </div>

              {/* Citizenship */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  {t("labels.applyOnline.citizenship")} *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  value={formData.citizenship}
                  onChange={(e) =>
                    handleInputChange("citizenship", e.target.value)
                  }
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date of Entry */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  {t("labels.applyOnline.entryDate")} *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <select
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={formData.entryDay}
                    onChange={(e) =>
                      handleInputChange("entryDay", e.target.value)
                    }
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={formData.entryMonth}
                    onChange={(e) =>
                      handleInputChange("entryMonth", e.target.value)
                    }
                  >
                    {months.map((month) => (
                      <option key={month.key} value={month.label}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={formData.entryYear}
                    onChange={(e) =>
                      handleInputChange("entryYear", e.target.value)
                    }
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <User className="inline w-4 h-4 mr-2" />
                    {t("labels.applyOnline.firstName")} *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder={t("labels.applyOnline.placeholderFirstName")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <User className="inline w-4 h-4 mr-2" />
                    {t("labels.applyOnline.lastName")} *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder={t("labels.applyOnline.placeholderLastName")}
                  />
                </div>
              </div>

              {/* Government Fee */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">
                    {t("labels.applyOnline.governmentFee")}
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    PKR 14,651.00
                  </span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
              >
                {t("labels.applyOnline.saveAndContinue")}
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-8">
              {/* Payment Header */}
              <div className="flex items-center space-x-3 mb-8">
                <CreditCard className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("labels.applyOnline.paymentDetails")}
                </h2>
              </div>

              {/* Fee Breakdown */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-700 mb-4">
                  {t("labels.applyOnline.feeBreakdownTitle")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("labels.applyOnline.visaService")}</span>
                    <span className="font-semibold">PKR 14,651.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("labels.applyOnline.embassyFee")}</span>
                    <span className="font-semibold">PKR 14,651.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("labels.applyOnline.serviceFee")}</span>
                    <span className="font-semibold">PKR 15,623.25</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("labels.applyOnline.total")}</span>
                    <span className="text-green-600">PKR 31,274.25</span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t("labels.applyOnline.cardholderName")} *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={formData.cardholderName}
                    onChange={(e) =>
                      handleInputChange("cardholderName", e.target.value)
                    }
                    placeholder={t("labels.applyOnline.placeholderCardholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t("labels.applyOnline.cardNumber")} *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      value={formData.cardNumber}
                      onChange={(e) =>
                        handleInputChange("cardNumber", e.target.value)
                      }
                      placeholder={t("labels.applyOnline.placeholderCardNumber")}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          handleInputChange("expiryDate", e.target.value)
                        }
                        placeholder={t("labels.applyOnline.placeholderExpiry")}
                      />
                      <input
                        type="text"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        value={formData.cvv}
                        onChange={(e) =>
                          handleInputChange("cvv", e.target.value)
                        }
                        placeholder={t("labels.applyOnline.placeholderCvc")}
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    checked={formData.agreeTerms}
                    onChange={(e) =>
                      handleInputChange("agreeTerms", e.target.checked)
                    }
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    {t("labels.applyOnline.termsAgreement")}{" "}
                    <span className="text-green-600 hover:underline cursor-pointer">
                      {t("labels.applyOnline.termsOfService")}
                    </span>{" "}
                    and{" "}
                    <span className="text-green-600 hover:underline cursor-pointer">
                      {t("labels.applyOnline.privacyStatement")}
                    </span>{" "}
                    {t("labels.applyOnline.termsAgreementEnd")}
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    {t("labels.applyOnline.return")}
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                    disabled={!formData.agreeTerms}
                  >
                    {t("labels.applyOnline.submitOrder")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>{t("labels.applyOnline.footerCopyright")}</p>
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
