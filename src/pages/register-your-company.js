import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { showSuccess, showError, showWarning } from "@/lib/utils/toast";
import Head from "next/head";
import {
  Building2,
  FileText,
  Clock,
  CheckCircle,
  Users,
  Shield,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { createInquiry } from "@/utils/crmUtils";

// PAGE DISABLED - Redirect to home page
export default function CompanyRegistration() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/");
  }, [router]);
  
  // Show nothing while redirecting
  return null;
}

// Original component kept for future use
function CompanyRegistrationOriginal() {
  const { t } = useTranslation("company-registration");
  const router = useRouter();
  const { locale } = router;
  const isRTL = locale === "ar" || locale === "fa";
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyType: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: "", message: "" }); // success or error

  // refs for smooth scroll
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setFormStatus({ type: "", message: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = t("contactForm.fields.fullName.required");
    if (!formData.email.trim())
      newErrors.email = t("contactForm.fields.email.required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t("contactForm.fields.email.invalid");
    if (!formData.phone.trim())
      newErrors.phone = t("contactForm.fields.phone.required");
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.fullName && fullNameRef.current)
        fullNameRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      else if (validationErrors.email && emailRef.current)
        emailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      else if (validationErrors.phone && phoneRef.current)
        phoneRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    try {
      const response = await createInquiry({
        name: formData.fullName,
        interested_service: "Company Registration Ltd., A.Ş., Sole Proprie.",
        mobile_no: formData.phone,
        email: formData.email,
        address: "",
        additional_details: JSON.stringify(formData),
      });

      if (response.status === 1) {
        setFormStatus({
          type: "success",
          message: t("contactForm.successMessage"),
        });
        router.push("/thankyou");
      } else {
        setFormStatus({
          type: "error",
          message: response.data.message ?? t("contactForm.errorMessage"),
        });
      }
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyType: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      setFormStatus({
        type: "error",
        message: t("contactForm.errorMessage"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const companyTypes = [
    {
      title: t("companyTypes.types.limited.title"),
      description: t("companyTypes.types.limited.description"),
    },
    {
      title: t("companyTypes.types.jointStock.title"),
      description: t("companyTypes.types.jointStock.description"),
    },
    {
      title: t("companyTypes.types.soleProprietorship.title"),
      description: t("companyTypes.types.soleProprietorship.description"),
    },
  ];

  const registrationSteps = [
    {
      step: t("registrationProcess.steps.consultation.step"),
      title: t("registrationProcess.steps.consultation.title"),
      desc: t("registrationProcess.steps.consultation.description"),
    },
    {
      step: t("registrationProcess.steps.documentPreparation.step"),
      title: t("registrationProcess.steps.documentPreparation.title"),
      desc: t("registrationProcess.steps.documentPreparation.description"),
    },
    {
      step: t("registrationProcess.steps.tradeRegistry.step"),
      title: t("registrationProcess.steps.tradeRegistry.title"),
      desc: t("registrationProcess.steps.tradeRegistry.description"),
    },
    {
      step: t("registrationProcess.steps.taxOffice.step"),
      title: t("registrationProcess.steps.taxOffice.title"),
      desc: t("registrationProcess.steps.taxOffice.description"),
    },
    {
      step: t("registrationProcess.steps.bankAccount.step"),
      title: t("registrationProcess.steps.bankAccount.title"),
      desc: t("registrationProcess.steps.bankAccount.description"),
    },
    {
      step: t("registrationProcess.steps.finalization.step"),
      title: t("registrationProcess.steps.finalization.title"),
      desc: t("registrationProcess.steps.finalization.description"),
    },
  ];

  const requiredDocuments = [
    t("requiredDocuments.documents.passportCopies"),
    t("requiredDocuments.documents.proofOfAddress"),
    t("requiredDocuments.documents.companyNameProposals"),
    t("requiredDocuments.documents.companyActivity"),
    t("requiredDocuments.documents.shareDistribution"),
    t("requiredDocuments.documents.articlesOfAssociation"),
    t("requiredDocuments.documents.signatureDeclarations"),
  ];

  const benefits = [
    {
      icon: Clock,
      title: t("benefits.fastProcessing.title"),
      desc: t("benefits.fastProcessing.description"),
    },
    {
      icon: Shield,
      title: t("benefits.legalSupport.title"),
      desc: t("benefits.legalSupport.description"),
    },
    {
      icon: Users,
      title: t("benefits.dedicatedTeam.title"),
      desc: t("benefits.dedicatedTeam.description"),
    },
    {
      icon: FileText,
      title: t("benefits.allInclusive.title"),
      desc: t("benefits.allInclusive.description"),
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Head>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
      </Head>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              {t("hero.title")}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-sky-100 max-w-3xl mx-auto px-4">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 -mt-16 sm:-mt-24">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
            >
              <benefit.icon className="w-10 h-10 sm:w-12 sm:h-12 text-sky-500 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Company Types Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            {t("companyTypes.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
            {t("companyTypes.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {companyTypes.map((type, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow border-2 border-sky-100"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                {type.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Registration Process */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              {t("registrationProcess.title")}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {t("registrationProcess.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {registrationSteps.map((item) => (
              <div
                key={item.step}
                className="relative bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4 sm:p-6 border-2 border-sky-200"
              >
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 mt-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl shadow-xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">
            {t("requiredDocuments.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {requiredDocuments.map((doc, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-1" />
                <span className="text-sky-50">{doc}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-sm">
              <strong>{t("requiredDocuments.note.label")}</strong>{" "}
              {t("requiredDocuments.note.text")}
            </p>
          </div>
        </div>
      </div>

      {/* Benefits of Opening a Company in Turkey */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t("turkeyBenefits.title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("turkeyBenefits.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1 */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border-2 border-sky-100 hover:shadow-lg transition-shadow">
              <div className="bg-sky-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {t("turkeyBenefits.items.strategicLocation.title")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("turkeyBenefits.items.strategicLocation.description")}
              </p>
            </div>

            {/* 2 */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border-2 border-sky-100 hover:shadow-lg transition-shadow">
              <div className="bg-sky-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {t("turkeyBenefits.items.foreignOwnership.title")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("turkeyBenefits.items.foreignOwnership.description")}
              </p>
            </div>

            {/* 3 */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border-2 border-sky-100 hover:shadow-lg transition-shadow">
              <div className="bg-sky-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {t("turkeyBenefits.items.taxAdvantages.title")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("turkeyBenefits.items.taxAdvantages.description")}
              </p>
            </div>

            {/* 4 */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border-2 border-sky-100 hover:shadow-lg transition-shadow">
              <div className="bg-sky-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {t("turkeyBenefits.items.residencePermit.title")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("turkeyBenefits.items.residencePermit.description")}
              </p>
            </div>

            {/* 5 */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border-2 border-sky-100 hover:shadow-lg transition-shadow">
              <div className="bg-sky-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {t("turkeyBenefits.items.fastRegistration.title")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("turkeyBenefits.items.fastRegistration.description")}
              </p>
            </div>

            {/* 6 */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border-2 border-sky-100 hover:shadow-lg transition-shadow">
              <div className="bg-sky-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {t("turkeyBenefits.items.growingEconomy.title")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("turkeyBenefits.items.growingEconomy.description")}
              </p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {t("turkeyBenefits.cta.title")}
                </h3>
                <p className="text-sky-100">
                  {t("turkeyBenefits.cta.subtitle")}
                </p>
              </div>
              <a
                href="/contact-us"
                className="bg-white text-sky-600 px-8 py-3 rounded-lg font-bold hover:bg-sky-50 transition-colors shadow-lg whitespace-nowrap"
              >
                {t("turkeyBenefits.cta.button")}
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Why Choose Us Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("whyChooseUs.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("whyChooseUs.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("whyChooseUs.items.expertGuidance.title")}
            </h3>
            <p className="text-gray-600">
              {t("whyChooseUs.items.expertGuidance.description")}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("whyChooseUs.items.endToEndService.title")}
            </h3>
            <p className="text-gray-600">
              {t("whyChooseUs.items.endToEndService.description")}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {t("whyChooseUs.items.fastEfficient.title")}
            </h3>
            <p className="text-gray-600">
              {t("whyChooseUs.items.fastEfficient.description")}
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {t("whyChooseUs.cta.title")}
          </h3>
          <p className="text-sky-100 mb-8 max-w-2xl mx-auto">
            {t("whyChooseUs.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/contact-us"
              className="bg-white text-sky-600 px-8 py-4 rounded-lg font-bold hover:bg-sky-50 transition-colors shadow-lg flex items-center gap-2"
            >
              {t("whyChooseUs.cta.button")}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <div className="flex flex-col lg:flex-row items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold">
                  {t("whyChooseUs.cta.phone")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold">
                  {t("whyChooseUs.cta.email")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div
        id="contact"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t("contactForm.title")}
            </h2>
            <p className="text-gray-600">{t("contactForm.subtitle")}</p>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div ref={fullNameRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("contactForm.fields.fullName.label")}
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.fullName
                      ? "border-red-500"
                      : "border-gray-200 focus:border-sky-400"
                  }`}
                  placeholder={t("contactForm.fields.fullName.placeholder")}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div ref={emailRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("contactForm.fields.email.label")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-200 focus:border-sky-400"
                  }`}
                  placeholder={t("contactForm.fields.email.placeholder")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div ref={phoneRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("contactForm.fields.phone.label")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-200 focus:border-sky-400"
                  }`}
                  placeholder={t("contactForm.fields.phone.placeholder")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("contactForm.fields.companyType.label")}
                </label>
                <select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sky-400 focus:outline-none transition-colors"
                >
                  <option value="">
                    {t("contactForm.fields.companyType.placeholder")}
                  </option>
                  <option value="limited">
                    {t("contactForm.fields.companyType.options.limited")}
                  </option>
                  <option value="joint">
                    {t("contactForm.fields.companyType.options.jointStock")}
                  </option>
                  <option value="sole">
                    {t("contactForm.fields.companyType.options.sole")}
                  </option>
                  <option value="unsure">
                    {t("contactForm.fields.companyType.options.unsure")}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("contactForm.fields.message.label")}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sky-400 focus:outline-none transition-colors resize-none"
                placeholder={t("contactForm.fields.message.placeholder")}
              />
            </div>

            {/* Submit Button + Status Banners */}
            {formStatus.type === "success" && (
              <div className="bg-green-100 text-green-700 border border-green-300 rounded-lg p-4 text-center font-medium">
                {formStatus.message}
              </div>
            )}
            {formStatus.type === "error" && (
              <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg p-4 text-center font-medium">
                {formStatus.message}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  {t("contactForm.buttons.submitting")}
                </>
              ) : (
                <>
                  {t("contactForm.buttons.submit")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              {t("contactForm.privacyNote")}
            </p>
          </div>
        </div>
      </div>
      {/* Trust Indicators */}
      {/* You can restore your trust badges, client logos, or certification icons here if you had any */}

      {/* FAQ Section */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {t("faq.title")}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: t("faq.items.duration.question"),
                a: t("faq.items.duration.answer"),
              },
              {
                q: t("faq.items.foreigners.question"),
                a: t("faq.items.foreigners.answer"),
              },
              {
                q: t("faq.items.presence.question"),
                a: t("faq.items.presence.answer"),
              },
              {
                q: t("faq.items.obligations.question"),
                a: t("faq.items.obligations.answer"),
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 group"
              >
                <summary className="font-semibold text-gray-800 cursor-pointer flex items-center justify-between">
                  {faq.q}
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
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
      ...(await serverSideTranslations(locale, [
        "common",
        "company-registration",
      ])),
    },
  };
};
