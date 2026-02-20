import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { showSuccess } from "@/lib/utils/toast";
import {
  Users,
  Globe,
  FileText,
  Shield,
  Phone,
  Mail,
  Building,
  Award,
  Clock,
  UserCheck,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";
import { createInquiryFromRecruiter } from "@/utils/crmUtils";
import * as Sentry from "@sentry/nextjs";

const initialState = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  address: "",
  website: "",
  companyType: "",
  licenseNumber: "",
  yearsInBusiness: "",
  employeesCount: "",
  specialization: "",
  servicesOffered: [],
  description: "",
  agreeToTerms: false,
  agreeToPrivacy: false,
};

export default function RecruiterRegistration() {
  const router = useRouter();
  const { t } = useTranslation("recruiter-agency");
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
    if (!formData.contactPerson.trim())
      newErrors.contactPerson = t("form.company_info.contact_person_error");
    if (!formData.email.trim())
      newErrors.email = t("form.contact_info.email_required");
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = t("form.contact_info.email_invalid");
    if (!formData.phone.trim())
      newErrors.phone = t("form.contact_info.phone_required");
    if (!formData.country.trim())
      newErrors.country = t("form.contact_info.country_required");
    if (!formData.city.trim())
      newErrors.city = t("form.contact_info.city_required");
    if (!formData.companyType)
      newErrors.companyType = t("form.company_info.company_type_error");
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = t("form.legal.terms_error");
    if (!formData.agreeToPrivacy)
      newErrors.agreeToPrivacy = t("form.legal.privacy_error");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    function transformForApi(apiObj) {
      return {
        company_name: apiObj.companyName,
        contact_person_name: apiObj.contactPerson,
        company_type: apiObj.companyType,
        years_in_business: apiObj.yearsInBusiness,
        business_license_number: apiObj.licenseNumber,
        number_of_employees: apiObj.employeesCount,

        contact_email: apiObj.email,
        contact_phone_no: apiObj.phone,
        contact_country: apiObj.country,
        contact_city: apiObj.city,
        business_address: apiObj.address,
        company_website: apiObj.website,

        services_offered: apiObj.servicesOffered || [],
        primary_specialization: apiObj.specialization,
        company_description: apiObj.description,
      };
    }
    Sentry.captureMessage(
      "Recruiter Registration attempted: " + JSON.stringify(formData)
    );

    if (validateForm()) {
      setLoading(true);
      try {
        await createInquiryFromRecruiter({ ...transformForApi(formData) });
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

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: t("benefits.items.talent_pool.title"),
      description: t("benefits.items.talent_pool.description"),
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t("benefits.items.fast_process.title"),
      description: t("benefits.items.fast_process.description"),
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("benefits.items.legal_compliance.title"),
      description: t("benefits.items.legal_compliance.description"),
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: t("benefits.items.industry_matching.title"),
      description: t("benefits.items.industry_matching.description"),
    },
  ];

  const turkeyAdvantages = [
    {
      title: t("why_partner.items.global_network.title"),
      description: t("why_partner.items.global_network.description"),
    },
    {
      title: t("why_partner.items.trusted_brand.title"),
      description: t("why_partner.items.trusted_brand.description"),
    },
    {
      title: t("why_partner.items.ai_driven.title"),
      description: t("why_partner.items.ai_driven.description"),
    },
    {
      title: t("why_partner.items.end_to_end.title"),
      description: t("why_partner.items.end_to_end.description"),
    },
    {
      title: t("why_partner.items.commission.title"),
      description: t("why_partner.items.commission.description"),
    },
    {
      title: t("why_partner.items.dedicated_team.title"),
      description: t("why_partner.items.dedicated_team.description"),
    },
  ];

  const industryExpertise = [
    {
      icon: <Building className="w-8 h-8" />,
      title: t("industry_expertise.items.factory.title"),
      description: t("industry_expertise.items.factory.description"),
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t("industry_expertise.items.agriculture.title"),
      description: t("industry_expertise.items.agriculture.description"),
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t("industry_expertise.items.tourism.title"),
      description: t("industry_expertise.items.tourism.description"),
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t("industry_expertise.items.construction.title"),
      description: t("industry_expertise.items.construction.description"),
    },
  ];

  const platformFeatures = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: t("platform_features.items.verified_candidates.title"),
      description: t("platform_features.items.verified_candidates.description"),
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t("platform_features.items.quick_placement.title"),
      description: t("platform_features.items.quick_placement.description"),
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: t("platform_features.items.document_processing.title"),
      description: t("platform_features.items.document_processing.description"),
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t("platform_features.items.ongoing_support.title"),
      description: t("platform_features.items.ongoing_support.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50">
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
                  {t("header.program_title")}
                </span>
              </div>

              <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-6xl text-slate-900">
                {t("header.main_title_prefix")}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600">
                  {t("header.main_title_suffix")}
                </span>
              </h1>

              <p className="mb-8 text-lg leading-relaxed text-gray-600 md:text-xl">
                {t("header.description")}
              </p>

              {/* Quick Stats Inline */}

              <div className="flex flex-wrap gap-4">
                <a
                  href="/contact-us"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold transition-all duration-200 border-2 bg-white text-cyan-700 border-cyan-300 hover:bg-cyan-50 rounded-xl hover:border-cyan-400"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {t("header.contact_us")}
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
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                    alt={t("header.heroImageAlt")}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10"></div>
                </div>

                {/* Floating Card */}
                <div className="absolute p-6 bg-white shadow-2xl -bottom-6 -left-6 rounded-2xl backdrop-blur-sm bg-opacity-95">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">
                        {t("header.verified_candidates")}
                      </div>
                      <div className="text-xl font-bold text-slate-900">
                        {t("header.pre_screened")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div
          id="application"
          className="p-8 mb-20 bg-white border shadow-xl rounded-2xl border-cyan-100"
        >
          <h2 className="mb-4 text-3xl font-bold text-center text-cyan-900">
            {t("form.title")}
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-center text-gray-600">
            {t("form.subtitle")}
          </p>

          <div className="space-y-8">
            {/* Company Information */}
            <div className="p-6 bg-cyan-50/30 rounded-xl" ref={formTopRef}>
              <h3 className="flex items-center mb-6 text-xl font-semibold text-cyan-900">
                <Building className="w-5 h-5 mr-2" />
                {t("form.company_info.title")}
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.company_info.company_name")}
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-white ${errors.companyName ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t(
                      "form.company_info.company_name_placeholder"
                    )}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.company_info.contact_person")}
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-white ${errors.contactPerson ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t(
                      "form.company_info.contact_person_placeholder"
                    )}
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.contactPerson}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.company_info.company_type")}
                  </label>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-white ${errors.companyType ? "border-red-300" : "border-cyan-200"}`}
                  >
                    <option value="">
                      {t("form.company_info.company_type_placeholder")}
                    </option>
                    <option value="manufacturing">
                      {t("form.company_info.types.manufacturing")}
                    </option>
                    <option value="agriculture">
                      {t("form.company_info.types.agriculture")}
                    </option>
                    <option value="tourism">
                      {t("form.company_info.types.tourism")}
                    </option>
                    <option value="construction">
                      {t("form.company_info.types.construction")}
                    </option>
                    <option value="retail">
                      {t("form.company_info.types.retail")}
                    </option>
                    <option value="other">
                      {t("form.company_info.types.other")}
                    </option>
                  </select>
                  {errors.companyType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.companyType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.company_info.years_in_business")}
                  </label>
                  <select
                    name="yearsInBusiness"
                    value={formData.yearsInBusiness}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                  >
                    <option value="">
                      {t("form.company_info.years_placeholder")}
                    </option>
                    <option value="1-2">
                      {t("form.company_info.years_options.1_2")}
                    </option>
                    <option value="3-5">
                      {t("form.company_info.years_options.3_5")}
                    </option>
                    <option value="6-10">
                      {t("form.company_info.years_options.6_10")}
                    </option>
                    <option value="10+">
                      {t("form.company_info.years_options.10_plus")}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.company_info.license_number")}
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder={t("form.company_info.license_placeholder")}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.company_info.employees_count")}
                  </label>
                  <select
                    name="employeesCount"
                    value={formData.employeesCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">
                      {t("form.company_info.employees_placeholder")}
                    </option>
                    <option value="1-10">
                      {t("form.company_info.employees_options.1_10")}
                    </option>
                    <option value="11-50">
                      {t("form.company_info.employees_options.11_50")}
                    </option>
                    <option value="51-100">
                      {t("form.company_info.employees_options.51_100")}
                    </option>
                    <option value="100+">
                      {t("form.company_info.employees_options.100_plus")}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-6 bg-cyan-50/20 rounded-xl">
              <h3 className="flex items-center mb-6 text-xl font-semibold text-cyan-900">
                <Mail className="w-5 h-5 mr-2" />
                {t("form.contact_info.title")}
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.contact_info.email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-white ${errors.email ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t("form.contact_info.email_placeholder")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.contact_info.phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-white ${errors.phone ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t("form.contact_info.phone_placeholder")}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.contact_info.country")}
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-white ${errors.country ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t("form.contact_info.country_placeholder")}
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.contact_info.city")}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-white ${errors.city ? "border-red-300" : "border-cyan-200"}`}
                    placeholder={t("form.contact_info.city_placeholder")}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.contact_info.address")}
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                    placeholder={t("form.contact_info.address_placeholder")}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.contact_info.website")}
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                    placeholder={t("form.contact_info.website_placeholder")}
                  />
                </div>
              </div>
            </div>

            {/* Staffing Needs */}
            <div className="p-6 bg-cyan-50/30 rounded-xl">
              <h3 className="flex items-center mb-6 text-xl font-semibold text-cyan-900">
                <FileText className="w-5 h-5 mr-2" />
                {t("form.staffing_needs.title")}
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.staffing_needs.types_needed")}
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                  >
                    <option value="">
                      {t("form.staffing_needs.types_placeholder")}
                    </option>
                    <option value="manufacturing">
                      {" "}
                      {t("form.staffing_needs.positions.housekeeping")}
                    </option>
                    <option value="agriculture">
                      {t("form.staffing_needs.positions.waiter")}
                    </option>
                    <option value="tourism">
                      {t("form.staffing_needs.positions.waiter_assistant")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.receptionist")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.guest_relations")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.bellboy")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.animator")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.kitchen_assistant")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.specialized_worker")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.cnc_operator")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.packing_worker")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.tailor")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.forklift_operator")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.material_handler")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.fruit_picker")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.greenhouse_worker")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.packing_sorting")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.irrigation")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.animal_husbandry")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.general_labourer")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.painter")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.electrician")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.positions.tile_fixer")}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("form.staffing_needs.industry_focus")}
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                  >
                    <option value="">
                      {t("form.staffing_needs.industry_placeholder")}
                    </option>
                    <option value="manufacturing">
                      {t("form.staffing_needs.industries.factory")}
                    </option>
                    <option value="agriculture">
                      {t("form.staffing_needs.industries.agriculture")}
                    </option>
                    <option value="tourism">
                      {t("form.staffing_needs.industries.tourism")}
                    </option>
                    <option value="construction">
                      {t("form.staffing_needs.industries.construction")}
                    </option>
                  </select>
                </div>
              </div>
              <br></br>

              <div className="mt-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {t("form.staffing_needs.description_label")}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-cyan-200"
                  placeholder={t("form.staffing_needs.description_placeholder")}
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="flex items-center mb-6 text-xl font-semibold text-gray-900">
                <Shield className="w-5 h-5 mr-2" />
                {t("form.legal.title")}
              </h3>
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-1 border-gray-300 rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">
                    {t("form.legal.agree_terms_prefix")}{" "}
                    <a
                      href="#"
                      className="font-medium underline text-cyan-600 hover:text-cyan-800"
                    >
                      {t("form.legal.terms_link")}
                    </a>{" "}
                    {t("form.legal.agree_terms_suffix")}
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                )}

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToPrivacy"
                    checked={formData.agreeToPrivacy}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-1 border-gray-300 rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">
                    {t("form.legal.agree_privacy_prefix")}{" "}
                    <a
                      href="#"
                      className="font-medium underline text-cyan-600 hover:text-cyan-800"
                    >
                      {t("form.legal.privacy_link")}
                    </a>{" "}
                    {t("form.legal.agree_privacy_suffix")}
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

              <p className="mt-4 text-sm text-gray-600">
                {t("form.submit.footer_message")}
              </p>
            </div>
          </div>
        </div>
        {/* Why Partner Section */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-cyan-900">
              {t("why_partner.title")}
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              {t("why_partner.subtitle")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {turkeyAdvantages.map((advantage, index) => (
              <div
                key={index}
                className="p-6 transition-shadow bg-white border shadow-lg rounded-xl border-cyan-100 hover:shadow-xl"
              >
                <h3 className="mb-3 text-lg font-semibold text-cyan-900">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Expertise */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-cyan-900">
              {t("industry_expertise.title")}
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              {t("industry_expertise.subtitle")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {industryExpertise.map((industry, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 text-white shadow-lg bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl">
                  {industry.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-cyan-900">
                  {industry.title}
                </h3>
                <p className="text-sm text-gray-600">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-20">
          <div className="p-8 text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">
                {t("platform_features.title")}
              </h2>
              <p className="max-w-2xl mx-auto text-cyan-50">
                {t("platform_features.subtitle")}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {platformFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-white border border-white bg-opacity-10 rounded-xl backdrop-blur-sm border-opacity-20"
                >
                  <div className="flex items-center justify-center w-12 h-12 mb-4 text-white bg-white rounded-lg bg-opacity-20">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-cyan-50">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="mb-4 text-3xl font-bold text-center text-cyan-900">
            {t("benefits.title")}
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-center text-gray-600">
            {t("benefits.subtitle")}
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 transition-all duration-300 bg-white border shadow-lg rounded-xl hover:shadow-xl border-cyan-100 hover:scale-105"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
                  {benefit.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-cyan-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-8 mb-20 text-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl">
          <h3 className="mb-4 text-2xl font-bold">
            {t("contact_footer.title")}
          </h3>
          <p className="max-w-2xl mx-auto mb-6 text-cyan-50">
            {t("contact_footer.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex items-center px-4 py-2 space-x-2 bg-white rounded-lg bg-opacity-20 backdrop-blur-sm">
              <Mail className="w-5 h-5" />
              <span>Info@jobsadmire.com</span>
            </div>
            <div className="flex items-center px-4 py-2 space-x-2 bg-white rounded-lg bg-opacity-20 backdrop-blur-sm">
              <Phone className="w-5 h-5" />
              <span>+90 501 124 03 40</span>
            </div>
          </div>
          <div className="text-sm text-cyan-100">
            <p>{t("contact_footer.business_hours")}</p>
            <p className="mt-2">{t("contact_footer.response_time")}</p>
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
      ...(await serverSideTranslations(locale, ["common", "recruiter-agency"])),
    },
  };
};
