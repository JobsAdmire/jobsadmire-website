import React, { useState } from "react";
import { useRouter } from "next/router";
import { showSuccess, showError, showWarning } from "@/lib/utils/toast";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Check,
  MessageCircle,
  Calendar,
  User,
  FileText,
  Bell,
} from "lucide-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// Import your translation files
import enTranslations from "../../public/locales/en/contact.json";
import trTranslations from "../../public/locales/tr/contact.json";
import arTranslations from "../../public/locales/ar/contact.json";
import frTranslations from "../../public/locales/fr/contact.json";
import deTranslations from "../../public/locales/de/contact.json";
import faTranslations from "../../public/locales/fa/contact.json";
import ruTranslations from "../../public/locales/ru/contact.json";
import { createInquiry } from "@/utils/crmUtils";

const PremiumContactForm = () => {
  const router = useRouter();
  const { locale } = router;

  // Get translations based on current locale
  const getTranslations = () => {
    switch (locale) {
      case "tr":
        return trTranslations;
      case "ar":
        return arTranslations;
      case "fa":
        return faTranslations;
      case "ru":
        return ruTranslations;
      case "fr":
        return frTranslations;
      case "de":
        return deTranslations;
      default:
        return enTranslations;
    }
  };

  const t = getTranslations();

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formStep, setFormStep] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep = (step) => {
    let isValid = true;
    const newErrors = { ...errors };

    if (step === 0) {
      // Validate name
      if (!formState.name.trim()) {
        newErrors.name = t.contact.form.validation.nameRequired;
        isValid = false;
      } else if (formState.name.trim().length < 2) {
        newErrors.name = t.contact.form.validation.nameMinLength;
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formState.email.trim()) {
        newErrors.email = t.contact.form.validation.emailRequired;
        isValid = false;
      } else if (!emailRegex.test(formState.email)) {
        newErrors.email = t.contact.form.validation.emailInvalid;
        isValid = false;
      }

      // Validate phone (optional)
      if (formState.phone.trim()) {
        const phoneRegex =
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(formState.phone)) {
          newErrors.phone = t.contact.form.validation.phoneInvalid;
          isValid = false;
        }
      }
    } else if (step === 1) {
      // Validate subject
      if (!formState.subject.trim()) {
        newErrors.subject = t.contact.form.validation.subjectRequired;
        isValid = false;
      } else if (formState.subject.trim().length < 3) {
        newErrors.subject = t.contact.form.validation.subjectMinLength;
        isValid = false;
      }

      // Validate message
      if (!formState.message.trim()) {
        newErrors.message = t.contact.form.validation.messageRequired;
        isValid = false;
      } else if (formState.message.trim().length < 10) {
        newErrors.message = t.contact.form.validation.messageMinLength;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(formStep + 1);
    }
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(formStep)) {
      return;
    }

    setIsSubmitting(true);

    const response = await createInquiry({
      name: formState.name,
      interested_service: "Contact Us",
      mobile_no: formState.phone,
      email: formState.email,
      address: "",
      additional_details:
        "message: " + formState.message + " | subject: " + formState.subject,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    console.log(response.data);

    router.push("/thankyou");
    resetFormReset();
  };

  const resetFormReset = () => {
    setFormState({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setErrors({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setFormStep(0);
  };

  const renderFormStep = () => {
    switch (formStep) {
      case 0:
        return (
          <>
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {t.contact.form.step1.title}
              </h2>
              <p className="text-lg text-gray-500">
                {t.contact.form.step1.subtitle}
              </p>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className={`w-full px-2 text-gray-900 placeholder-transparent bg-transparent border-b-2 ${errors.name ? "border-red-500" : "border-gray-300"} peer h-14 focus:outline-none focus:border-blue-600`}
                  placeholder={t.contact.form.fields.name.placeholder}
                />
                <label
                  htmlFor="name"
                  className={`absolute left-2 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm ${errors.name ? "text-red-500" : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-blue-600"}`}
                >
                  {t.contact.form.fields.name.label}
                </label>
                <User
                  size={20}
                  className={`absolute right-2 top-4 ${errors.name ? "text-red-500" : "text-gray-400"}`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className={`w-full px-2 text-gray-900 placeholder-transparent bg-transparent border-b-2 ${errors.email ? "border-red-500" : "border-gray-300"} peer h-14 focus:outline-none focus:border-blue-600`}
                  placeholder={t.contact.form.fields.email.placeholder}
                />
                <label
                  htmlFor="email"
                  className={`absolute left-2 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm ${errors.email ? "text-red-500" : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-blue-600"}`}
                >
                  {t.contact.form.fields.email.label}
                </label>
                <Mail
                  size={20}
                  className={`absolute right-2 top-4 ${errors.email ? "text-red-500" : "text-gray-400"}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  className={`w-full px-2 text-gray-900 placeholder-transparent bg-transparent border-b-2 ${errors.phone ? "border-red-500" : "border-gray-300"} peer h-14 focus:outline-none focus:border-blue-600`}
                  placeholder={t.contact.form.fields.phone.placeholder}
                />
                <label
                  htmlFor="phone"
                  className={`absolute left-2 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm ${errors.phone ? "text-red-500" : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-blue-600"}`}
                >
                  {t.contact.form.fields.phone.label}
                </label>
                <Phone
                  size={20}
                  className={`absolute right-2 top-4 ${errors.phone ? "text-red-500" : "text-gray-400"}`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center justify-center w-full px-4 py-4 text-base font-medium text-white transition-all duration-300 transform border border-transparent rounded-full shadow-md bg-gradient-to-r from-[#38B6FF] to-[#38B6FF] hover:from-[#38B6FF] hover:to-[#38B6FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:scale-105"
                >
                  {t.contact.form.buttons.continue}
                </button>
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {t.contact.form.step2.title}
              </h2>
              <p className="text-lg text-gray-500">
                {t.contact.form.step2.subtitle}
              </p>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  required
                  value={formState.subject}
                  onChange={handleChange}
                  className={`w-full px-2 text-gray-900 placeholder-transparent bg-transparent border-b-2 ${errors.subject ? "border-red-500" : "border-gray-300"} peer h-14 focus:outline-none focus:border-blue-600`}
                  placeholder={t.contact.form.fields.subject.placeholder}
                />
                <label
                  htmlFor="subject"
                  className={`absolute left-2 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm ${errors.subject ? "text-red-500" : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-blue-600"}`}
                >
                  {t.contact.form.fields.subject.label}
                </label>
                <FileText
                  size={20}
                  className={`absolute right-2 top-4 ${errors.subject ? "text-red-500" : "text-gray-400"}`}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                )}
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  required
                  value={formState.message}
                  onChange={handleChange}
                  className={`w-full px-2 py-2 text-gray-900 placeholder-transparent bg-transparent border-b-2 ${errors.message ? "border-red-500" : "border-gray-300"} resize-none peer focus:outline-none focus:border-blue-600`}
                  placeholder={t.contact.form.fields.message.placeholder}
                ></textarea>
                <label
                  htmlFor="message"
                  className={`absolute left-2 -top-3.5 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm ${errors.message ? "text-red-500" : "text-gray-600 peer-placeholder-shown:text-gray-400 peer-focus:text-blue-600"}`}
                >
                  {t.contact.form.fields.message.label}
                </label>
                <MessageCircle
                  size={20}
                  className={`absolute right-2 top-4 ${errors.message ? "text-red-500" : "text-gray-400"}`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center justify-center w-1/2 px-4 py-4 text-base font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t.contact.form.buttons.back}
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center justify-center w-1/2 px-4 py-4 text-base font-medium text-white transition-all duration-300 transform border border-transparent rounded-full shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t.contact.form.buttons.sending}
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      {t.contact.form.buttons.send}
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 sm:px-6 lg:px-8 pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]">
      <div className="flex flex-col w-full max-w-7xl overflow-hidden bg-white shadow-2xl lg:flex-row rounded-3xl">
        {/* Left Column - Brand & Info */}
        <div className="relative p-12 overflow-hidden text-white lg:w-1/2 bg-gradient-to-br from-[#38B6FF] via-[#38B6FF] to-[#38B6FF]">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 bg-white rounded-full w-80 h-80 opacity-10"></div>
          <div className="absolute bottom-0 left-0 -mb-32 -ml-32 bg-white rounded-full w-96 h-96 opacity-10"></div>

          <div className="relative z-10">
            <div className="flex items-center mb-12">
              <svg
                className="w-12 h-12 text-white"
                viewBox="0 0 40 40"
                fill="currentColor"
              >
                <path d="M20 3.33a16.67 16.67 0 1 0 0 33.34 16.67 16.67 0 0 0 0-33.34zm0 30a13.33 13.33 0 1 1 0-26.66 13.33 13.33 0 0 1 0 26.66z" />
                <path d="M20 13.33a6.67 6.67 0 1 0 0 13.34 6.67 6.67 0 0 0 0-13.34z" />
              </svg>
              <span className="ml-3 text-2xl font-bold">
                {t.contact.brand.name}
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold">
              {t.contact.brand.title}
            </h1>
            <p className="mb-12 text-xl font-light opacity-90">
              {t.contact.brand.description}
            </p>

            <div className="space-y-6">
              {t.contact.contactInfo.map((info, index) => {
                const isPhone = index === 0 || index === 1;
                const isEmail = index === 2;
                const href = isPhone
                  ? `tel:${info.value.replace(/\s/g, "")}`
                  : isEmail
                    ? `mailto:${info.value}`
                    : null;

                const content = (
                  <>
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-white rounded-full bg-opacity-20">
                      {(index === 0 || index === 1) && (
                        <Phone size={24} className="text-white" />
                      )}
                      {index === 2 && <Mail size={24} className="text-white" />}
                      {index === 3 && (
                        <MapPin size={24} className="text-white" />
                      )}
                      {index === 4 && (
                        <Calendar size={24} className="text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium opacity-80">
                        {info.label}
                      </p>
                      <p className="text-lg font-semibold">{info.value}</p>
                    </div>
                  </>
                );

                return href ? (
                  <a
                    key={index}
                    href={href}
                    className="flex items-center space-x-4 transition-all duration-200 hover:opacity-80"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={index} className="flex items-center space-x-4">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="relative p-12 lg:w-1/2">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="flex items-center justify-center w-24 h-24 mb-8 bg-green-100 rounded-full">
                <Check size={48} className="text-green-600" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                {t.contact.success.title}
              </h2>
              <p className="mb-6 text-xl text-gray-600">
                {t.contact.success.message}
              </p>
              <p className="mb-8 text-gray-500">{t.contact.success.followUp}</p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 font-medium text-white transition-all duration-300 transform rounded-full shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
              >
                {t.contact.success.sendAnother}
              </button>
            </div>
          ) : (
            <form className="flex flex-col h-full" onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                  <div
                    className="h-full transition-all duration-500 ease-in-out bg-gradient-to-r from-[#38B6FF] to-[#38B6FF]"
                    style={{ width: formStep === 0 ? "50%" : "100%" }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span
                    className={formStep >= 0 ? "text-blue-600 font-medium" : ""}
                  >
                    {t.contact.form.progress.step1}
                  </span>
                  <span
                    className={formStep >= 1 ? "text-blue-600 font-medium" : ""}
                  >
                    {t.contact.form.progress.step2}
                  </span>
                </div>
              </div>

              {renderFormStep()}

              <div className="pt-10 mt-auto">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Bell size={16} className="text-blue-600" />
                  <p>{t.contact.form.notification}</p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["about", "common"])),
    },
  };
};
export default PremiumContactForm;
