import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { showSuccess } from "@/lib/utils/toast";
import {
  Building2,
  Factory,
  Users,
  Shield,
  Phone,
  Mail,
  Award,
  Clock,
  FileCheck,
  Briefcase,
  HardHat,
  Monitor,
} from "lucide-react";
import { createInquiryFromBusinessOwner } from "@/utils/crmUtils";
import * as Sentry from "@sentry/nextjs";

const initialState = {
  companyName: "",
  companyType: "",
  industryType: "",
  contactPerson: "",
  position: "",
  email: "",
  phone: "",
  companyAddress: "",
  city: "",
  province: "",
  postalCode: "",
  website: "",
  taxNumber: "",
  tradeRegistryNumber: "",
  establishedYear: "",
  employeeCount: "",
  annualRevenue: "",
  hiringNeeds: [],
  jobPositions: "",
  salaryRange: "",
  accommodationProvided: false,
  transportationProvided: false,
  visaSponsorship: false,
  urgentHiring: false,
  preferredNationalities: "",
  languageRequirements: "",
  workExperience: "",
  additionalRequirements: "",
  companyDescription: "",
  agreeToTerms: false,
  agreeToPrivacy: false,
};

export default function CompanyRegistration() {
  const router = useRouter();
  const { t } = useTranslation("job-provider");
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const formTopRef = useRef(null);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim())
      newErrors.companyName = t("form.company_info.company_name_error");
    if (!formData.companyType)
      newErrors.companyType = t("form.company_info.company_type_error");
    if (!formData.industryType)
      newErrors.industryType = t("form.company_info.industry_type_error");
    if (!formData.contactPerson.trim())
      newErrors.contactPerson = t("form.contact_info.contact_person_error");
    if (!formData.email.trim())
      newErrors.email = t("form.contact_info.email_required");
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = t("form.contact_info.email_invalid");
    if (!formData.phone.trim())
      newErrors.phone = t("form.contact_info.phone_required");
    if (!formData.city.trim())
      newErrors.city = t("form.contact_info.city_required");
    if (!formData.province.trim())
      newErrors.province = t("form.contact_info.province_required");
    if (!formData.taxNumber.trim())
      newErrors.taxNumber = t("form.legal_info.tax_number_error");
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = t("form.legal_agreements.terms_error");
    if (!formData.agreeToPrivacy)
      newErrors.agreeToPrivacy = t("form.legal_agreements.privacy_error");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    function transformApiToCompany(rawApi) {
      return {
        company_name: rawApi.companyName,
        company_type: rawApi.companyType,
        industry_type: rawApi.industryType,
        established_year: rawApi.establishedYear,
        current_employee_count: rawApi.employeeCount,
        annual_revenue_range: rawApi.annualRevenue,

        contact_person_name: rawApi.contactPerson,
        contact_person_title: rawApi.position,
        contact_email: rawApi.email,
        contact_phone_no: rawApi.phone,

        company_address: rawApi.companyAddress,
        city: rawApi.city,
        province: rawApi.province,
        postal_code: rawApi.postalCode,
        company_website: rawApi.website,

        tax_number: rawApi.taxNumber,
        trade_registry_number: rawApi.tradeRegistryNumber,

        positions_needed: rawApi.hiringNeeds || [],
        specific_job_positions: rawApi.jobPositions,
        monthly_salary_range: rawApi.salaryRange,

        preferred_nationalities: rawApi.preferredNationalities
          ? rawApi.preferredNationalities.split(",").map((s) => s.trim())
          : [],

        language_requirements: rawApi.languageRequirements,
        work_experience_required: rawApi.workExperience,

        additional_benefits: [
          rawApi.accommodationProvided ? "Accommodation Provided" : null,
          rawApi.transportationProvided ? "Transportation Provided" : null,
          rawApi.visaSponsorship ? "Visa Sponsorship" : null,
          rawApi.urgentHiring ? "Urgent Hiring" : null,
        ].filter(Boolean),

        additional_requirements: rawApi.additionalRequirements,
        company_description: rawApi.companyDescription,
      };
    }

    Sentry.captureMessage(
      "Job Provider Registration attempted: " + JSON.stringify(formData)
    );

    if (validateForm()) {
      setLoading(true);
      try {
        await createInquiryFromBusinessOwner({
          ...transformApiToCompany(formData),
        });
        showSuccess(t("form.submit.success_message"));
        setFormData(initialState);
        router.push("/thankyou");
      } catch (error) {
        Sentry.captureException(error);
        setSubmitError(error);
      } finally {
        setLoading(false);
      }
    } else {
      formTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const industries = [
    {
      icon: <Factory className="w-8 h-8" />,
      name: t("industries_served.items.factory.name"),
      desc: t("industries_served.items.factory.desc"),
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      name: t("industries_served.items.agriculture.name"),
      desc: t("industries_served.items.agriculture.desc"),
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      name: t("industries_served.items.tourism.name"),
      desc: t("industries_served.items.tourism.desc"),
    },
    {
      icon: <HardHat className="w-8 h-8" />,
      name: t("industries_served.items.construction.name"),
      desc: t("industries_served.items.construction.desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50">
      {/* Hero Section */}
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/40 pt-[186px] xs:pt-[166px] lg:pt-[172px] pb-[50px]">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Floating Gradient Orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative flex items-center px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center w-full gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 mb-6 space-x-2 border rounded-full bg-cyan-50/80 border-cyan-200">
                <Award className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-semibold text-cyan-700">
                  {t("header.badge")}
                </span>
              </div>

              <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-6xl text-slate-900">
                {t("header.title_prefix")}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600">
                  {t("header.title_suffix")}
                </span>
              </h1>

              <p className="mb-8 text-lg leading-relaxed text-gray-600 md:text-xl">
                {t("header.description")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="/contact-us"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold transition-all duration-200 border-2 bg-white text-cyan-700 border-cyan-300 hover:bg-cyan-50 rounded-xl hover:border-cyan-400"
                >
                  <Mail className="w-5 h-5 me-2" />
                  {t("header.contact_button")}
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Image */}
                <div
                  className="relative overflow-hidden shadow-2xl rounded-3xl"
                  style={{ height: "450px" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                    alt={t("header.heroImageAlt")}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div
          id="registration"
          className="p-8 bg-white border shadow-2xl rounded-3xl border-cyan-200"
        >
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-cyan-900">
              {t("form.title")}
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t("form.subtitle")}
            </p>
          </div>

          <div className="space-y-10">
            {/* Company Basic Information */}
            <div className="p-8 bg-cyan-50/30 rounded-2xl">
              <h3 className="flex items-center mb-8 text-2xl font-semibold text-cyan-900">
                <Building2 className="w-6 h-6 me-3" />
                {t("form.company_info.title")}
              </h3>
              <div className="grid gap-6 md:grid-cols-2" ref={formTopRef}>
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.company_info.company_name")}
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg bg-white ${errors.companyName ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t(
                      "form.company_info.company_name_placeholder"
                    )}
                  />
                  {errors.companyName && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.company_info.company_type")}
                  </label>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg bg-white ${errors.companyType ? "border-red-300" : "border-cyan-200"}`}
                  >
                    <option value="">
                      {t("form.company_info.company_type_placeholder")}
                    </option>
                    <option value="corporation">
                      {t("form.company_info.types.corporation")}
                    </option>
                    <option value="limited_company">
                      {t("form.company_info.types.limited_company")}
                    </option>
                    <option value="partnership">
                      {t("form.company_info.types.partnership")}
                    </option>
                    <option value="sole_proprietorship">
                      {t("form.company_info.types.sole_proprietorship")}
                    </option>
                    <option value="branch_office">
                      {t("form.company_info.types.branch_office")}
                    </option>
                    <option value="other">
                      {t("form.company_info.types.other")}
                    </option>
                  </select>
                  {errors.companyType && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.companyType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.company_info.industry_type")}
                  </label>
                  <select
                    name="industryType"
                    value={formData.industryType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg bg-white ${errors.industryType ? "border-red-300" : "border-cyan-200"}`}
                  >
                    <option value="">
                      {t("form.company_info.industry_type_placeholder")}
                    </option>
                    <option value="manufacturing">
                      {t("form.company_info.industries.manufacturing")}
                    </option>
                    <option value="construction">
                      {t("form.company_info.industries.construction")}
                    </option>
                    <option value="technology">
                      {t("form.company_info.industries.technology")}
                    </option>
                    <option value="healthcare">
                      {t("form.company_info.industries.healthcare")}
                    </option>
                    <option value="other">
                      {t("form.company_info.industries.other")}
                    </option>
                  </select>
                  {errors.industryType && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.industryType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.company_info.established_year")}
                  </label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleInputChange}
                    min="1900"
                    max="2025"
                    className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                    placeholder={t(
                      "form.company_info.established_year_placeholder"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-8 bg-cyan-50/20 rounded-2xl">
              <h3 className="flex items-center mb-8 text-2xl font-semibold text-cyan-900">
                <Phone className="w-6 h-6 me-3" />
                {t("form.contact_info.title")}
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.contact_info.contact_person")}
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg bg-white ${errors.contactPerson ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t(
                      "form.contact_info.contact_person_placeholder"
                    )}
                  />
                  {errors.contactPerson && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.contactPerson}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.contact_info.position")}
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                    placeholder={t("form.contact_info.position_placeholder")}
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.contact_info.email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg bg-white ${errors.email ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t("form.contact_info.email_placeholder")}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.contact_info.phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg bg-white ${errors.phone ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t("form.contact_info.phone_placeholder")}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.contact_info.company_address")}
                  </label>
                  <textarea
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                    placeholder={t(
                      "form.contact_info.company_address_placeholder"
                    )}
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.contact_info.city")}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg bg-white ${errors.city ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t("form.contact_info.city_placeholder")}
                  />
                  {errors.city && (
                    <p className="mt-2 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.contact_info.province")}
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg bg-white ${errors.province ? "border-red-300" : "border-cyan-200"}`}
                  >
                    <option value="">
                      {t("form.contact_info.province_placeholder")}
                    </option>
                    <option value="Istanbul">
                      {t("form.contact_info.provinces.istanbul")}
                    </option>
                    <option value="Ankara">
                      {t("form.contact_info.provinces.ankara")}
                    </option>
                    <option value="Izmir">
                      {t("form.contact_info.provinces.izmir")}
                    </option>
                    <option value="Bursa">
                      {t("form.contact_info.provinces.bursa")}
                    </option>
                    <option value="Antalya">
                      {t("form.contact_info.provinces.antalya")}
                    </option>
                    <option value="Adana">
                      {t("form.contact_info.provinces.adana")}
                    </option>
                    <option value="Konya">
                      {t("form.contact_info.provinces.konya")}
                    </option>
                    <option value="Gaziantep">
                      {t("form.contact_info.provinces.gaziantep")}
                    </option>
                    <option value="Kayseri">
                      {t("form.contact_info.provinces.kayseri")}
                    </option>
                    <option value="Other">
                      {t("form.contact_info.provinces.other")}
                    </option>
                  </select>
                  {errors.province && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.province}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.contact_info.postal_code")}
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                    placeholder={t("form.contact_info.postal_code_placeholder")}
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.contact_info.website")}
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                    placeholder={t("form.contact_info.website_placeholder")}
                  />
                </div>
              </div>
            </div>

            {/* Legal Information */}
            <div className="p-8 bg-cyan-50/30 rounded-2xl">
              <h3 className="flex items-center mb-8 text-2xl font-semibold text-cyan-900">
                <FileCheck className="w-6 h-6 me-3" />
                {t("form.legal_info.title")}
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.legal_info.tax_number")}
                  </label>
                  <input
                    type="text"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg bg-white ${errors.taxNumber ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t("form.legal_info.tax_number_placeholder")}
                  />
                  {errors.taxNumber && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.taxNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.legal_info.trade_registry_number")}
                  </label>
                  <input
                    type="text"
                    name="tradeRegistryNumber"
                    value={formData.tradeRegistryNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                    placeholder={t(
                      "form.legal_info.trade_registry_number_placeholder"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Hiring Requirements */}
            <div className="p-8 bg-cyan-50/30 rounded-2xl">
              <h3 className="flex items-center mb-8 text-2xl font-semibold text-cyan-900">
                <Users className="w-6 h-6 me-3" />
                {t("form.staffing_requirements.title")}
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.staffing_requirements.specific_job_positions")}
                  </label>
                  <textarea
                    name="jobPositions"
                    value={formData.jobPositions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                    placeholder={t(
                      "form.staffing_requirements.specific_job_positions_placeholder"
                    )}
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.staffing_requirements.salary_range")}
                  </label>
                  <input
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleInputChange}
                    placeholder={t(
                      "form.staffing_requirements.salary_range_placeholder"
                    )}
                    className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.staffing_requirements.preferred_nationalities")}
                  </label>
                  <input
                    type="text"
                    name="preferredNationalities"
                    value={formData.preferredNationalities}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                    placeholder={t(
                      "form.staffing_requirements.preferred_nationalities_placeholder"
                    )}
                  />
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.staffing_requirements.language_requirements")}
                  </label>
                  <select
                    name="languageRequirements"
                    value={formData.languageRequirements}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                  >
                    <option value="">
                      {t(
                        "form.staffing_requirements.language_requirements_placeholder"
                      )}
                    </option>
                    <option value="none">
                      {t("form.staffing_requirements.languages.none")}
                    </option>
                    <option value="basic-turkish">
                      {t("form.staffing_requirements.languages.basic_turkish")}
                    </option>
                    <option value="intermediate-turkish">
                      {t(
                        "form.staffing_requirements.languages.intermediate_turkish"
                      )}
                    </option>
                    <option value="fluent-turkish">
                      {t("form.staffing_requirements.languages.fluent_turkish")}
                    </option>
                    <option value="english">
                      {t("form.staffing_requirements.languages.english")}
                    </option>
                    <option value="turkish-english">
                      {t(
                        "form.staffing_requirements.languages.turkish_english"
                      )}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700">
                    {t("form.staffing_requirements.work_experience")}
                  </label>
                  <select
                    name="workExperience"
                    value={formData.workExperience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                  >
                    <option value="">
                      {t(
                        "form.staffing_requirements.work_experience_placeholder"
                      )}
                    </option>
                    <option value="entry-level">
                      {t(
                        "form.staffing_requirements.experience_levels.entry_level"
                      )}
                    </option>
                    <option value="junior">
                      {t("form.staffing_requirements.experience_levels.junior")}
                    </option>
                    <option value="mid-level">
                      {t(
                        "form.staffing_requirements.experience_levels.mid_level"
                      )}
                    </option>
                    <option value="senior">
                      {t("form.staffing_requirements.experience_levels.senior")}
                    </option>
                    <option value="expert">
                      {t("form.staffing_requirements.experience_levels.expert")}
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("form.staffing_requirements.additional_requirements")}
                </label>
                <textarea
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                  placeholder={t(
                    "form.staffing_requirements.additional_requirements_placeholder"
                  )}
                />
              </div>
            </div>

            {/* Company Description */}
            <div className="p-8 bg-cyan-50/20 rounded-2xl">
              <h3 className="flex items-center mb-8 text-2xl font-semibold text-cyan-900">
                <Briefcase className="w-6 h-6 me-3" />
                {t("form.company_description.title")}
              </h3>
              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  {t("form.company_description.label")}
                </label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                  placeholder={t("form.company_description.placeholder")}
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="p-8 bg-gray-100 rounded-2xl">
              <h3 className="flex items-center mb-8 text-2xl font-semibold text-cyan-900">
                <Shield className="w-6 h-6 me-3" />
                {t("form.legal_agreements.title")}
              </h3>
              <div className="space-y-6">
                <label className="flex items-start space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-1 border-gray-300 rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-gray-700">
                    {t("form.legal_agreements.agree_terms_prefix")}{" "}
                    <a
                      href="#"
                      className="font-semibold underline text-cyan-600 hover:text-cyan-800"
                    >
                      {t("form.legal_agreements.terms_link")}
                    </a>{" "}
                    {t("form.legal_agreements.agree_terms_suffix")}
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                )}

                <label className="flex items-start space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToPrivacy"
                    checked={formData.agreeToPrivacy}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-1 border-gray-300 rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-gray-700">
                    {t("form.legal_agreements.agree_privacy_prefix")}{" "}
                    <a
                      href="#"
                      className="font-semibold underline text-cyan-600 hover:text-cyan-800"
                    >
                      {t("form.legal_agreements.privacy_link")}
                    </a>{" "}
                    {t("form.legal_agreements.agree_privacy_suffix")}
                  </span>
                </label>
                {errors.agreeToPrivacy && (
                  <p className="text-sm text-red-500">
                    {errors.agreeToPrivacy}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}

            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`relative px-12 py-4 text-lg font-semibold text-white transition-all duration-200 transform shadow-lg rounded-xl
      ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl hover:scale-105"
      }
    `}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
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
                    {t("form.submit.submitting")}
                  </div>
                ) : (
                  t("form.submit.button")
                )}
              </button>

              {/* ✅ Optional error message section */}
              {submitError && (
                <p className="mt-3 text-sm font-medium text-red-600">
                  {submitError}
                </p>
              )}

              <p className="mt-6 text-lg text-gray-600">
                {t("form.submit.footer_message")}
              </p>
            </div>
          </div>
        </div>
        <br></br>
        {/* Industries We Serve */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-cyan-900">
              {t("industries_served.title")}
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              {t("industries_served.subtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2  lg:grid-cols-4">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="p-6 transition-all duration-300 bg-white border shadow-lg cursor-pointer rounded-xl hover:shadow-xl border-cyan-200 hover:scale-105"
              >
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-white bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
                  {industry.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-cyan-900">
                  {industry.name}
                </h3>
                <p className="text-sm text-gray-600">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        {/* Industries We Serve */}

        {/* Registration Form */}

        {/* Support Section */}
        <div className="p-12 mt-20 text-center text-white bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl">
          <h3 className="mb-6 text-3xl font-bold">{t("support.title")}</h3>
          <p className="max-w-3xl mx-auto mb-8 text-lg text-cyan-50">
            {t("support.description")}
          </p>
          <div className="grid gap-8 mb-8 md:grid-cols-3">
            <div className="flex items-center justify-center px-6 py-4 space-x-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
              <Mail className="w-6 h-6" />
              <span className="text-lg">{t("support.email")}</span>
            </div>
            <div className="flex items-center justify-center px-6 py-4 space-x-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
              <Phone className="w-6 h-6" />
              <span className="text-lg">{t("support.phone")}</span>
            </div>
            <div className="flex items-center justify-center px-6 py-4 space-x-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
              <Clock className="w-6 h-6" />
              <span className="text-lg">{t("support.support_24_7")}</span>
            </div>
          </div>
          <div className="text-cyan-100">
            <p className="text-lg">{t("support.business_hours")}</p>
            <p className="mt-2">{t("support.response_time")}</p>
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
      ...(await serverSideTranslations(locale, ["common", "job-provider"])),
    },
  };
};
