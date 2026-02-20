import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";

// Helper function to safely get arrays from translations
const getArrayFromTranslation = (t, key) => {
  const result = t(key, { returnObjects: true });
  return Array.isArray(result) ? result : [];
};

const NAV_SECTION_KEYS = {
  "data-controller": "sectionDataController",
  "scope": "sectionScope",
  "data-categories": "sectionDataCategories",
  "purposes": "sectionPurposes",
  "cookies": "sectionCookies",
  "disclosures": "sectionDisclosures",
  "transfers": "sectionTransfers",
  "retention": "sectionRetention",
  "rights": "sectionRights",
  "security": "sectionSecurity",
};

const PrivacyPolicy = () => {
  const { t } = useTranslation("privacy");
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('[id^="section-"]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const sections = [
    { id: "data-controller" },
    { id: "scope" },
    { id: "data-categories" },
    { id: "purposes" },
    { id: "cookies" },
    { id: "disclosures" },
    { id: "transfers" },
    { id: "retention" },
    { id: "rights" },
    { id: "security" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Floating Navigation */}
      <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-10">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-4">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  document
                    .getElementById(`section-${section.id}`)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  activeSection === `section-${section.id}`
                    ? "bg-sky-100 text-sky-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t(`page.${NAV_SECTION_KEYS[section.id]}`)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230EA5E9' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="flex flex-col items-center justify-center px-5 md:px-10 relative z-10">
          <div className="flex min-w-full flex-col items-center justify-center bg-gradient-to-br from-sky-500 via-sky-600 to-blue-600 py-20 md:py-32 relative overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/8 rounded-full blur-lg animate-bounce"></div>

            <div
              className={`flex flex-col items-center py-8 gap-y-6 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="h-8 w-px bg-white/30"></div>
                <span className="text-white/80 font-medium">{t("page.brandName")}</span>
              </div>

              <h1 className="text-4xl md:text-7xl font-bold text-white text-center leading-tight">
                {t("page.heroTitle")}
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  {t("page.heroTitleHighlight")}
                </span>
              </h1>

              <p className="text-white/90 text-lg md:text-xl max-w-2xl text-center px-4">
                {t("page.lastUpdated")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative">
        <div className="w-full max-w-7xl py-16 mx-auto px-5 md:px-10 md:py-20 lg:py-24">
          <div className="flex flex-col items-center gap-y-16">
            {/* Introduction */}
            <div
              className={`max-w-4xl transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-sky-100/50 shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("page.aboutTitle")}
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {t("page.aboutParagraph")}
                </p>
              </div>
            </div>

            {/* Content Sections */}
            <div className="flex flex-col min-w-full gap-y-12">
              {/* Data Controller */}
              <div id="section-data-controller" className="group">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 6h2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("page.sectionDataController")}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-sky-50 rounded-xl">
                      <p className="font-semibold text-sky-700 mb-2">
                        {t("page.body.dataController.companyName")}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">{t("page.body.dataController.addressLabel")}</span>{" "}
                        {t("page.body.dataController.addressText")}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">{t("page.body.dataController.emailLabel")}</span>{" "}
                        {t("page.body.dataController.email")}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">{t("page.body.dataController.phoneLabel")}</span>{" "}
                        {t("page.body.dataController.phone")}
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-400">
                      <p className="text-gray-700 leading-relaxed">
                        {t("page.body.dataController.permitNote")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope */}
              <div id="section-scope" className="group">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("page.sectionScope")}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t("page.body.scope.intro")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getArrayFromTranslation(t, "page.body.scope.items").map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data Categories */}
              <div id="section-data-categories" className="group">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("page.body.dataCategories.sectionTitle")}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {getArrayFromTranslation(t, "page.body.dataCategories.categories").map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl"
                      >
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <span className="font-semibold text-gray-800">
                            {item.title}
                          </span>
                          <span className="text-gray-700"> {item.desc}</span>
                        </div>
                      </div>
                    ))}
                    <div className="p-4 bg-red-50 rounded-xl border-l-4 border-red-400">
                      <p className="text-gray-700">
                        {t("page.body.dataCategories.specialNote")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purposes & Legal Bases */}
              <div id="section-purposes" className="group">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("page.body.purposes.sectionTitle")}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {t("page.body.purposes.intro")}
                  </p>
                  <div className="space-y-4">
                    {getArrayFromTranslation(t, "page.body.purposes.items").map((item, index) => (
                      <div key={index} className="p-4 bg-orange-50 rounded-xl">
                        <h4 className="font-semibold text-orange-700 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-700 mb-2">{item.desc}</p>
                        <p className="text-sm text-gray-600 italic">
                          {t("page.body.purposes.legalLabel", { legal: item.legal })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div id="section-cookies" className="group">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("page.body.cookies.sectionTitle")}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t("page.body.cookies.intro")}
                  </p>
                  <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                    <p className="text-gray-700">
                      {t("page.body.cookies.notice")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Disclosures */}
              <div id="section-disclosures" className="group">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("page.body.disclosures.sectionTitle")}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {getArrayFromTranslation(t, "page.body.disclosures.items").map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-700 font-medium">
                      {t("page.body.disclosures.processorNote")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cross-Border Transfers */}
              <div id="section-transfers" className="group">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("page.body.transfers.sectionTitle")}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t("page.body.transfers.intro")}
                  </p>
                  <div className="space-y-3">
                    {getArrayFromTranslation(t, "page.body.transfers.items").map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-700 mt-4 p-4 bg-gray-50 rounded-xl">
                    {t("page.body.transfers.recordNote")}
                  </p>
                </div>
              </div>

              {/* Retention */}
              <div id="section-retention" className="group">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("page.body.retention.sectionTitle")}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed p-4 bg-green-50 rounded-xl">
                    {t("page.body.retention.text")}
                  </p>
                </div>
              </div>

              {/* Your Rights */}
              <div id="section-rights" className="group">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("page.body.rights.sectionTitle")}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {t("page.body.rights.intro")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {getArrayFromTranslation(t, "page.body.rights.items").map((right, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl"
                      >
                        <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{right}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                      <p className="text-gray-700 mb-2">
                        {t("page.body.rights.howToApply")}
                      </p>
                      <p className="text-gray-700">
                        {t("page.body.rights.responseTime")}
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-400">
                      <p className="text-gray-700">
                        {t("page.body.rights.complaintNote")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div id="section-security" className="group">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("page.body.security.sectionTitle")}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t("page.body.security.intro")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getArrayFromTranslation(t, "page.body.security.items").map((measure, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{measure}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Sections */}
              <div className="group">
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("page.body.additional.sectionTitle")}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-teal-50 rounded-xl">
                      <h4 className="font-semibold text-teal-700 mb-2">
                        {t("page.body.additional.verbisTitle")}
                      </h4>
                      <p className="text-gray-700">
                        {t("page.body.additional.verbisText")}
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-700 mb-2">
                        {t("page.body.additional.childrenTitle")}
                      </h4>
                      <p className="text-gray-700">
                        {t("page.body.additional.childrenText")}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-xl">
                      <h4 className="font-semibold text-purple-700 mb-2">
                        {t("page.body.additional.thirdPartyTitle")}
                      </h4>
                      <p className="text-gray-700">
                        {t("page.body.additional.thirdPartyText")}
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-xl">
                      <h4 className="font-semibold text-orange-700 mb-2">
                        {t("page.body.additional.changesTitle")}
                      </h4>
                      <p className="text-gray-700">
                        {t("page.body.additional.changesText")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="group">
                <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-2xl p-8 md:p-10 shadow-xl border border-sky-500/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {t("page.body.contact.sectionTitle")}
                    </h3>
                  </div>
                  <p className="text-white/90 leading-relaxed mb-6">
                    {t("page.body.contact.intro")}
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-white/80 text-sm mb-1">
                        {t("page.body.contact.dataProtectionLabel")}
                      </p>
                      <p className="text-white font-semibold">
                        {t("page.body.contact.dataProtectionEmail")}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-white/80 text-sm mb-1">
                        {t("page.body.contact.alternativeLabel")}
                      </p>
                      <p className="text-white font-semibold">
                        {t("page.body.contact.alternativeEmail")}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-white/80 text-sm mb-1">
                        {t("page.body.contact.addressLabel")}
                      </p>
                      <p className="text-white/90 text-sm">
                        {t("page.body.contact.addressText")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-gray-900 to-black py-16">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("page.body.footerCta.title")}
          </h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {t("page.body.footerCta.description")}
          </p>
          <a
            href="/contact-us"
            className="inline-block bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {t("page.body.footerCta.button")}
          </a>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
