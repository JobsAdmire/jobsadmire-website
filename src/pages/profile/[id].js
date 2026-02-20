// pages/profile/[id].js - Professional Beautiful Profile Page
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "@/lib/utils/toast";
import candidateService from "../../lib/candidateService";

const ProfilePage = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { id } = router.query;
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) {
      const candidateData = candidateService.getCandidateById(parseInt(id));
      if (candidateData) {
        setCandidate(candidateData);
        setViewCount(Math.floor(Math.random() * 150) + 50);
      }
      setLoading(false);
    }
  }, [id]);

  const getCategoryColor = (category) => {
    const colors = {
      "software-development": "from-blue-600 via-blue-500 to-cyan-500",
      design: "from-purple-600 via-pink-500 to-rose-500",
      "data-science": "from-green-600 via-emerald-500 to-teal-500",
      marketing: "from-orange-600 via-red-500 to-pink-500",
      "customer-support": "from-indigo-600 via-purple-500 to-pink-500",
      business: "from-gray-700 via-slate-600 to-blue-600",
    };
    return colors[category] || "from-sky-600 via-blue-500 to-cyan-500";
  };

  const getCategoryName = (category) => {
    const names = {
      "software-development": "Software Development",
      design: "Design & Creative",
      "data-science": "Data Science",
      marketing: "Marketing",
      "customer-support": "Customer Support",
      business: "Business",
    };
    return names[category] || "Professional";
  };

  const handleContact = () => {
    showInfo(
      `Contact ${candidate.fullName} - Feature would integrate with email/messaging system`
    );
  };

  const handleDownload = () => {
    if (candidate.resumeFile) {
      const link = document.createElement("a");
      link.href = candidate.resumeFile.url;
      link.download = `${candidate.fullName}_Resume.pdf`;
      link.click();
    } else {
      showInfo(
        `Resume for ${candidate.fullName} would be available for download`
      );
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${candidate.fullName} - ${candidate.profession}`,
        text: `Check out ${candidate.fullName}'s profile`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess(t("labels.profile.profileLinkCopied"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">{t("labels.profile.loadingProfile")}</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-400 rounded-full relative">
              <div className="absolute top-1 left-1 w-6 h-6 border-2 border-slate-400 rounded-full"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Profile Not Found
          </h2>
          <p className="text-slate-600 mb-8">
            The profile you're looking for doesn't exist.
          </p>
          <Link href="/browse-candidates">
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl">
              Browse Candidates
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Navigation Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/browse-candidates">
              <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors group">
                <div className="w-5 h-5 relative">
                  <div className="absolute inset-0 border-l-2 border-t-2 border-current transform rotate-45 translate-x-1"></div>
                  <div className="absolute top-2 left-0 w-4 h-0.5 bg-current"></div>
                </div>
                <span className="font-medium">{t("labels.profile.backToCandidates")}</span>
              </button>
            </Link>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-xl transition-all ${
                  isLiked
                    ? "bg-red-100 text-red-600 shadow-md"
                    : "bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <div className="w-5 h-5 relative">
                  <div
                    className={`absolute inset-0 transform rotate-45 ${
                      isLiked ? "bg-current" : "border-2 border-current"
                    } rounded-tl-full rounded-br-full`}
                  ></div>
                  <div
                    className={`absolute inset-0 transform -rotate-45 ${
                      isLiked ? "bg-current" : "border-2 border-current"
                    } rounded-tl-full rounded-br-full`}
                  ></div>
                </div>
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                <div className="w-5 h-5 relative">
                  <div className="absolute top-0 left-1 w-3 h-3 border-2 border-current rounded"></div>
                  <div className="absolute bottom-1 right-0 w-2 h-2 bg-current rounded-full"></div>
                  <div className="absolute top-2 left-2 w-2 h-0.5 bg-current transform rotate-45"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-slate-200/50">
          {/* Cover Photo */}
          <div
            className={`h-48 bg-gradient-to-r ${getCategoryColor(candidate.category)} relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            {/* Floating Stats */}
            <div className="absolute top-6 right-6 flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <div className="flex items-center space-x-2 text-white">
                  <div className="w-4 h-4 relative">
                    <div className="absolute inset-0 border-2 border-white rounded-full"></div>
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">{viewCount} views</span>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <span className="text-white text-sm font-medium">
                  {getCategoryName(candidate.category)}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-8 -mt-20 relative">
              {/* Profile Picture */}
              <div className="flex-shrink-0 mb-6 lg:mb-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-white to-slate-100 p-1 shadow-2xl">
                    <img
                      src={
                        candidate.profileImage ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                      }
                      alt={candidate.fullName}
                      className="w-full h-full rounded-xl object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                      }}
                    />
                  </div>

                  {/* Online Status */}
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  {candidate.fullName}
                </h1>
                <p className="text-xl text-blue-600 font-semibold mb-4">
                  {candidate.profession}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <div className="w-4 h-4 relative">
                        <div className="absolute top-0 left-1 w-2 h-3 border-2 border-blue-600 rounded-t-full"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-1 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{t("labels.profile.location")}</p>
                      <p className="font-semibold text-slate-700">
                        {candidate.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-emerald-600 rounded"></div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{t("labels.profile.experience")}</p>
                      <p className="font-semibold text-slate-700">
                        {candidate.yearsOfExperience} years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{t("labels.profile.age")}</p>
                      <p className="font-semibold text-slate-700">
                        {candidate.age} years
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-0">
                <button
                  onClick={handleContact}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <div className="w-5 h-5 relative">
                    <div className="absolute inset-0 border-2 border-white rounded"></div>
                    <div className="absolute top-1 left-1 w-3 h-2 border-b-2 border-r-2 border-white transform rotate-45"></div>
                  </div>
                  <span>{t("labels.profile.contact")}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-blue-300 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <div className="w-5 h-5 relative">
                    <div className="absolute inset-0 border-2 border-current rounded"></div>
                    <div className="absolute top-1 left-1 w-3 h-2 border-b-2 border-current"></div>
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-current rounded-full"></div>
                  </div>
                  <span>{t("labels.profile.resume")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 mb-8">
          <div className="flex space-x-1 p-2">
            {[
              { id: "overview", label: t("labels.profile.overview") },
              { id: "experience", label: t("labels.profile.experienceTab") },
              { id: "education", label: t("labels.profile.education") },
              { id: "portfolio", label: t("labels.profile.portfolio") },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* About Section */}
                {candidate.bio && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                      {t("labels.profile.aboutName", { name: candidate.fullName.split(" ")[0] })}
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {candidate.bio}
                    </p>
                  </div>
                )}

                {/* Skills Section */}
                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                      {t("labels.profile.technicalSkills")}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {candidate.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 text-center hover:shadow-md transition-all group cursor-pointer"
                        >
                          <div className="text-blue-600 font-semibold group-hover:text-blue-700">
                            {skill}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expertise Section */}
                {candidate.expertise && candidate.expertise.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                      {t("labels.profile.areasOfExpertise")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {candidate.expertise.map((exp, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 hover:shadow-md transition-all group cursor-pointer"
                        >
                          <div className="text-emerald-700 font-semibold group-hover:text-emerald-800">
                            {exp}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "education" &&
              candidate.education &&
              candidate.education.some(
                (edu) => edu.degree || edu.institution
              ) && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200/50">
                  <h2 className="text-2xl font-bold text-slate-800 mb-8">
                    {t("labels.profile.education")}
                  </h2>
                  <div className="space-y-6">
                    {candidate.education
                      .filter((edu) => edu.degree || edu.institution)
                      .map((edu, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200"
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <div className="w-8 h-8 relative">
                              <div className="absolute inset-0 border-2 border-white rounded"></div>
                              <div className="absolute top-1 left-1 w-6 h-4 border-b-2 border-white"></div>
                              <div className="absolute bottom-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-800 mb-1">
                              {edu.degree} {edu.field && `in ${edu.field}`}
                            </h3>
                            <p className="text-blue-600 font-semibold mb-1">
                              {edu.institution}
                            </p>
                            {edu.year && (
                              <p className="text-slate-500">{edu.year}</p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {activeTab === "experience" &&
              candidate.certifications &&
              candidate.certifications.some(
                (cert) => cert.name || cert.issuer
              ) && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200/50">
                  <h2 className="text-2xl font-bold text-slate-800 mb-8">
                    Certifications
                  </h2>
                  <div className="space-y-6">
                    {candidate.certifications
                      .filter((cert) => cert.name || cert.issuer)
                      .map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200"
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <div className="w-8 h-8 relative">
                              <div className="absolute inset-0 border-2 border-white rounded-full"></div>
                              <div className="absolute top-2 left-2 w-4 h-2 border-b-2 border-white"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-800 mb-1">
                              {cert.name}
                            </h3>
                            <p className="text-orange-600 font-semibold mb-2">
                              {cert.issuer}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              {cert.year && <span>{cert.year}</span>}
                              {cert.credentialId && (
                                <span>ID: {cert.credentialId}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {activeTab === "portfolio" &&
              candidate.portfolio &&
              Object.values(candidate.portfolio).some(Boolean) && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200/50">
                  <h2 className="text-2xl font-bold text-slate-800 mb-8">
                    Portfolio & Links
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {candidate.portfolio.website && (
                      <a
                        href={candidate.portfolio.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 group-hover:text-blue-600">
                              Website
                            </h3>
                            <p className="text-sm text-slate-500">
                              Personal Portfolio
                            </p>
                          </div>
                        </div>
                      </a>
                    )}

                    {candidate.portfolio.github && (
                      <a
                        href={candidate.portfolio.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white rounded"></div>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 group-hover:text-slate-700">
                              GitHub
                            </h3>
                            <p className="text-sm text-slate-500">
                              Code Repository
                            </p>
                          </div>
                        </div>
                      </a>
                    )}

                    {candidate.portfolio.linkedin && (
                      <a
                        href={candidate.portfolio.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white rounded"></div>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 group-hover:text-blue-700">
                              LinkedIn
                            </h3>
                            <p className="text-sm text-slate-500">
                              Professional Network
                            </p>
                          </div>
                        </div>
                      </a>
                    )}

                    {candidate.portfolio.behance && (
                      <a
                        href={candidate.portfolio.behance}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 group-hover:text-purple-600">
                              Behance
                            </h3>
                            <p className="text-sm text-slate-500">
                              Creative Portfolio
                            </p>
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200/50">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <span className="text-slate-700 font-medium">{t("labels.profile.experience")}</span>
                  <span className="text-emerald-600 font-bold text-lg">
                    {candidate.yearsOfExperience} years
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <span className="text-slate-700 font-medium">{t("labels.profile.skills")}</span>
                  <span className="text-blue-600 font-bold text-lg">
                    {candidate.skills?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                  <span className="text-slate-700 font-medium">
                    {t("labels.profile.certifications")}
                  </span>
                  <span className="text-purple-600 font-bold text-lg">
                    {candidate.certifications?.filter(
                      (cert) => cert.name || cert.issuer
                    ).length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Ready to Connect?</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Get in touch with {candidate.fullName.split(" ")[0]} to discuss
                opportunities and learn more about their experience.
              </p>
              <button
                onClick={handleContact}
                className="w-full bg-white text-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <div className="w-5 h-5 relative">
                  <div className="absolute inset-0 border-2 border-current rounded"></div>
                  <div className="absolute top-1 left-1 w-3 h-2 border-b-2 border-r-2 border-current transform rotate-45"></div>
                </div>
                <span>{t("labels.profile.startConversation")}</span>
              </button>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200/50">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                {t("labels.profile.profileActivity")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {t("labels.profile.profileCreated")}
                    </p>
                    <p className="text-sm text-slate-500">{t("labels.profile.recentlyJoined")}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <div className="w-4 h-4 relative">
                      <div className="absolute inset-0 border-2 border-blue-600 rounded-full"></div>
                      <div className="absolute top-1 left-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {t("labels.profile.profileViews", { count: viewCount })}
                    </p>
                    <p className="text-sm text-slate-500">{t("labels.profile.greatVisibility")}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-purple-600 rounded"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {t("labels.profile.skillsUpdated")}
                    </p>
                    <p className="text-sm text-slate-500">
                      {t("labels.profile.portfolioOptimized")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Progress */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200/50">
                <h3 className="text-xl font-bold text-slate-800 mb-6">
                  {t("labels.profile.topSkills")}
                </h3>
                <div className="space-y-4">
                  {candidate.skills.slice(0, 5).map((skill, index) => {
                    const proficiency = Math.floor(Math.random() * 30) + 70; // Random 70-100%
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-slate-700">
                            {skill}
                          </span>
                          <span className="text-sm text-slate-500">
                            {proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6 border border-emerald-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                {t("labels.profile.recruiterTips")}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-sm text-slate-700">
                    Response rate: Usually replies within 24 hours
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-sm text-slate-700">
                    Open to remote opportunities
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-sm text-slate-700">
                    Available for immediate start
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ locale }) => {
  const {
    serverSideTranslations,
  } = require("next-i18next/serverSideTranslations");
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default ProfilePage;
